---
title: "The Stanford Fast Charging Dataset: Challenges in Battery Life Prediction"
url: standford-dataset
description: An in-depth look at the Stanford Fast Charging Dataset, its
  limitations for machine learning applications, and the current state of
  battery life prediction research.
author: Fair Dinkum Systems Team
date: 2025-02-13T14:36:00.000Z
tags:
  - post
  - machine-learning
  - research
image: /assets/images/blog/screenshot-2025-02-18-at-12.01.14 pm.png
imageAlt: Plot
---
# ML Researchers: Beware the Stanford Fast Charging Battery Dataset

In 2019, a team of researchers from Stanford University made a surprising discovery in battery lifetime prediction\[2]. They accurately foretasted the lifespan of lithium-ion phosphate batteries under fast-charging conditions using a simple linear regression model. With >2,000 citations this paper is considered a seminal work in the field of machine learning for battery modelling. 

The dataset released alongside this paper, the so called “Stanford Fast Charging Battery Dataset” (or “MATR” after [www.matr.io](https://data.matr.io/) the platform where the data can be accessed) is one of the largest and probably the most widely used dataset in machine learning for battery modelling. However despite the rapid advancements in machine learning since 2019, **no deep learning approach has ever convincingly outperformed the original linear regression model on this dataset.**

![Screenshot 2025-02-12 at 4.58.38 PM.png](/assets/images/blog/screenshot-2025-02-18-at-12.01.14 pm.png)

*\* --> \[4]. The authors reported better results but these results were obtained by manually configuring an important hyperparameter differently for MATR1 vs MATR2. Their publication does not mention or justify this so we show the results they get with the default hyperparemeters for both test sets. We have mentioned this to the authors.*

*✦  --> \[1]*

*♱ --> \[3]* 

*❋ --> Ours*





The graph above contains the scores, reported or replicated by us, of the best performing models we are aware of on the two test sets of this dataset, known as MATR1 and MATR2. As we can see, none of them outperform the linear regression model on both test sets.

This article is our best attempt to explain why linear regression is still the best performing algorithm on this dataset. We will start by covering some of the difficulties we encountered while training our own models, and then highlighting some of the issues with recent publications involving MATR.

### Why is MATR so Difficult for Deep Learning Models?

The Stanford Fast Charging Dataset presents several challenges that make it inhospitable to deep learning: 

* it has a small sample size 
* its splits have widely different distributions
* the data contains many strange artifacts that are liable to confuse complex models 

None of this is to deride the excellent work of Severson et al. \[2] who take pains to document the minutiae of their data collection process. Six years later this dataset is still one of the largest and probably one of the best datasets for modelling batteries with machine learning. The issue seems to be that collecting battery charging data is an inherently very finicky and artifact-prone process.

**Small Sample Size**

The dataset itself contains only 124 batteries. Each battery is cycled until it reaches 80% capacity (at which point, by convention a battery is considered "dead") which happens on average after 810 cycles. Measurements for 5 different variables Temperature, Current, Voltage, Charge Amount and Discharge Amount are taken throughout each cycle with an average of 985 measurements taken per cycle on average for each variable. That's ~500 million individual data points in total.

![](/assets/images/blog/abx.png)

Ultimately however the test sets only require a single prediction per battery: the input is the first 100 cycles of data for that battery, the output is how long it’s going to live for past that point given in cycles. Using a naive approach this amounts to merely 124 data points, with only 43 of theses being in the training set. Not enough to train any large, modern neural network.

Given this, the whole battery chemistry aspect of this dataset becomes less important. The really important problem for ML researchers when dealing with MATR becomes: how do we overcome the small number of labels? There are many possible answers (transfer learning, data augmentation, etc) but none of them are simple or guaranteed to work.

**Diverse Batch Characteristics**

The dataset was collected in 3 batches, b1, b2 and b3 representing 3 distinct sets of batteries plugged into Severson et al.'s potentiostat and cycled until death. Multiple months elapsed between each set being plugged in. The training set and MATR1 are made up of a combination of b1 and b2, MATR2 is the entirety of b3. As it turns out these batches have significantly different properties, starting with the target.

![Screenshot 2025-02-12 at 10.27.20 AM.png](/assets/images/blog/asdf.png)

Above we have plotted the remaining useful life of each battery at cycle 100 against the so called “Qdlin delta variance” feature used by Severson et al. The linearity of this relationship is promising, but clearly the batching itself has had a very large impact on the target and generalizing is going to be tough.

Another example are the charging curves. Below we have plotted the first portion of the charging curves of 10 random batteries taken from each set at cycle 100. 

![Screenshot 2025-02-12 at 10.36.47 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.36.47-am.png)

As well as each set being offset along the x-axis we can see that batteries from b3 have a much smoother, essentially linear slope, while the other two battery sets have a much bumpier, but still monotonic profile. A zoomed in section is given below to highlight this discrepancy. 

![Screenshot 2025-02-12 at 10.39.08 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.39.08-am.png)

That said, what you’re *probably* supposed to do when using this data is not use the raw charging curve values as they are given, but interpolate them against the given time value `'t'` for each cycle. Here we plot most of the charging cycle with this interpolation performed. Now all 3 sets are smooth and linear, but we can still perceive clear differences in distribution. 

![Screenshot 2025-02-12 at 10.45.36 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.45.36-am.png)

To emphasize this point we plot the means and standard deviations of all 3 sets charging curves...

![Screenshot 2025-02-12 at 10.50.17 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.50.17-am.png)

And for good measure here are the means and standard deviations of the other 4 variables similarly interpolated over time.

![output.png](/assets/images/blog/output-1-.png)

A thorough analysis will reveal that the sets have distinct profiles. As a fun little aside we trained an XGBoost model to classify the 3 sets by splitting the set in half and training on one half. In the graph below we see that MATR1 is very easy to distinguish from the other 2 sets with only 16 samples. given to train on.

**Data Artifacts** 

Finally the data contains a lot of very obvious structures which are correlated with the target. We will merely give the most obvious examples here, which are charging artifacts.

Different batteries are charged in different ways and the the charging strategies are obvious to see in the data. Below we plot the voltage curves of two different batteries at the 100th cycle. In one case the battery was charged at 8C till it reached 25% capacity and then switched to 3.6C. The other battery was charged at 5.6C till 36% and then switched to 4.3C. The original authors this to demonstrate that their results generalized across different charging strategies, though each battery always retains the same charging strategy.

![and what about that little bump at the end for b3c12? who knows what that’s about…](/assets/images/blog/screenshot-2025-02-12-at-12.34.22-pm.png)

Certain charging strategies are highly correlated with the target, here are all the different charging strategies plotted against how long their average battery lasted.

![rul-bars.png](/assets/images/blog/rul-bars-1-.png)

Orange bars indicate that only one battery had this charging strategy, which accounts for all batteries in b2. Charging strategies are both related to the target and very obvious in the input. It’s quite likely that deep learning models will rely on these when making predictions even though they are not shared across sets.

Another example: the voltage curve interpolated over time:

![Screenshot 2025-02-12 at 12.53.03 PM.png](/assets/images/blog/b.png)

This plot contains one voltage curve for each battery colored according to the lifespan of the battery. We can see that:

* there is a large variation in when exactly the charging and discharging processes start and end which presumably has more to do with the specifics of the potentiostat configuration than anything else. 
* the exact start and end times have a big impact on the shape of the curve
* there is clearly some association between the start and end times and the target, with the outlying purple cluster corresponding to b2

There are many more similar examples, suffice to say that success in modelling this dataset ultimately has as much to do with the chemistry of batteries as it does to do with how you choose to deal with these specific quirks of the data collection process, quirks which likely will not appear in other similar datasets or the real world.

## Recent Findings

Despite these challenges, some research papers have attempted to apply deep learning to this dataset, often claiming to significantly outperform Severson et al’s baseline. Let’s take a look at some of these approaches and our findings after closer scrutiny.

### Dual-Stream ViT ESA

![](/assets/images/blog/dsvitesa.png)

Introduced by Liu et al in 2024, the Dual-Stream ViT-ESA Model uses a creative preprocessing pipeline to break the battery features up into delta features and standard features, feeding the data through two vision transformers. They reported a remarkably low RMSE of approximately 25 cycles with only 15 cycles, which got us all excited about the promises of deep learning and attempted to validate their findings.

**The catch?** The results they report aren’t achieved on the standard MATR1/MATR2 split. Instead they create their own train/test split and report on that. This would be all well and good if they actually specified their new test set,  released their code, or reported their performance on the standard train/test split. They don’t though, which is what seems a bit odd.

Our team made many attempts to replicate their opinionated data preprocessing and modelling techniques but were never able do better than Severson et al. on the standard train/test split.

Conclude from all of that what you will.

### **BatLiNet: A Closer Look**

![](/assets/images/blog/batlinet.png)

Among the recent papers claiming to have surpassed the 2019 model, BatLiNet stood out because its authors provided transparent implementation of their code via CodeOcean, making it possible to reproduce their results. On top of that, their model was also benchmarked using other popular battery datasets in BatteryML commonly referenced by other papers. At first glance, their reported performance appeared dramatically impressive. However, upon scrutiny and deeper investigation, we found several critical issues that undermines its credibility.

1. Inconsistent model configuration - We noticed that the authors tuned their model differently for the test and secondary test set. While this might have boosted their reported results, it is a strategy that wouldn’t translate into real-world scenarios where a single configuration must generalize.
2. Model Architecture Interpretability - Beyond dataset specific tuning, the model’s architecture and design choices itself seem somewhat arbitrary. We just couldn't clearly or intuitively justify the advantages from what they implemented over classical modeling methods.

### DiffBatt: A Novel Approach

![](/assets/images/blog/diffbatt.png)

Recently published, **DiffBatt** model has seemed to have a distinct take on battery degradation prediction and simulation. Introduced in late 2024, DiffBatt leverages diffusion models with classifier-free guidance alongside a transformer architecture to achieve high expressivity and scalability. It functions as both:

* **A Probabilistic Model:** Capturing uncertainties in aging behaviors.
* **A Generative Model:** Capable of simulating battery degradation over time.

Notably, DiffBatt has demonstrated better results in remaining useful life (RUL) prediction, achieving a mean RMSE of 88 cycles across the test dataset—outperforming many of its contemporaries. Meanwhile, this does not generalize well to the secondary test dataset as they reported higher RMSE over existing papers. Given only modest gains over what we currently have on the test set, we decided not to invest time in reproducing their results. In our view, the theoretical appeal of diffusion models isn’t convincing enough that it will translate into practical benefits on this particular dataset.

### Final Thoughts

Be careful when working with the Stanford Fast Charging Battery Dataset. Like most battery data datasets, it’s undoubtedly challenging for deep learning considering the amount of quirks or artifacts that can easily derail your research if not properly addressed.

Furthermore, many have tried reasonable, up-to-date techniques on this dataset and none have succeeded convincingly to model it.

### Bibliography

1. \[1] Eivazi, H., Hebenbrock, A., Ginster, R., Bl¨omeke, S., Wittek, S., Herrmann, C., . . . Rausch, A. (2024). Diffbatt: A diffusion model for battery degradation prediction and synthesis. arXiv preprint arXiv:2410.23893.
2. \[2] Liu, Y., Ahmed, M., Feng, J., Mao, Z., & Chen, Z. (2025). Deep learning-powered lifetime prediction for lithium-ion batteries based on small amounts of charging cycles. IEEE Transactions on Transportation Electrification, 11 (1), 3078-3090. doi: 10.1109/TTE.2024.3434553
3. \[3] Zhang, H., Li, Y., Zheng, S., Lu, Z., Gui, X., Xu, W., & Bian, J. (2023). Harnessing intra-and inter-cell differences: A comprehensive approach to precise battery lifespan estimations across conditions. arXiv preprint arXiv:2310.05052.
4. \[4] Zhang, H., Gui, X., Zheng, S., Lu, Z., Li, Y., & Bian, J. (2024). BatteryML: An Open-source platform for Machine Learning on Battery Degradation. International Conference on Learning Representations (ICLR 2024).
