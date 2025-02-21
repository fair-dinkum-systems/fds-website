---
title: "Battery ML Researchers: Beware the Stanford Fast Charging Battery Dataset"
url: standford-dataset
description: An in-depth look at the Stanford Fast Charging Dataset, its
  limitations for machine learning applications, and the current state of
  battery life prediction research.
author: Louka Ewington-Pitsos, Victor Goh, Alan Huynh
date: 2025-02-13T14:36:00.000Z
tags:
  - post
  - machine-learning
  - research
image: /assets/images/blog/feb-18-screenshot-from-battery-ml-researchers.png
imageAlt: Plot
---
In 2019 a team of researchers from Stanford University made a surprising discovery in battery lifetime prediction \[5]. They accurately foretasted the lifespan of lithium-ion phosphate batteries under fast-charging conditions using a simple linear regression model. With >2,000 citations this paper is considered a seminal work in the field of machine learning for battery modelling.

The dataset released alongside this paper, the so called “Stanford Fast Charging Battery Dataset” (or “MATR” after www.matr.io the platform where the data can be accessed) is one of the largest and probably the most widely used dataset in machine learning for battery modelling. However despite the rapid advancements in machine learning since 2019, **no deep learning approach has ever convincingly outperformed the original linear regression model on this dataset.**

![](/assets/images/blog/feb-18-screenshot-from-battery-ml-researchers.png "* --> [4]. The authors reported better results but these results were obtained by manually configuring an important hyperparameter differently for MATR1 vs MATR2. Their publication does not mention or justify this so we show the results they get with the default hyperparemeters for both test sets. We have mentioned this to the authors.  ✦ --> [1] . ♱ --> [3].  ❋ --> Ours")

\* --> \[4]. The authors reported better results but these results were obtained by manually configuring an important hyperparameter differently for MATR1 vs MATR2. Their publication does not mention or justify this so we show the results they get with the default hyperparemeters for both test sets. We have mentioned this to the authors.  ✦ --> \[1] . ♱ --> \[3].  ❋ --> Ours

The graph above contains the scores, reported or replicated by us, of the best performing models we are aware of on the two test sets of this dataset, known as MATR1 and MATR2. As we can see, none of them outperform the linear regression model on both test sets.
This article is our best attempt to explain why linear regression is still the best performing algorithm on this dataset. We will start by covering some of the difficulties we encountered while training our own models, and then highlighting some of the issues with recent publications involving MATR.

## Why is MATR so Difficult for Deep Learning Models?

The Stanford Fast Charging Dataset presents several challenges that make it inhospitable to deep learning:

* it has a small sample size
* its splits have widely different distributions
* the data contains many strange artifacts that are liable to confuse complex models

None of this is to deride the excellent work of Severson et al. \[2] who take pains to document the minutiae of their data collection process. Six years later this dataset is still one of the largest and probably one of the best datasets for modelling batteries with machine learning. The issue seems to be that collecting battery charging data is an inherently very finicky and artifact-prone process.

### Small Sample Size

The dataset itself contains only 124 batteries. Each battery is cycled until it reaches 80% capacity (at which point, by convention a battery is considered "dead") which happens on average after 810 cycles. Measurements for 5 different variables Temperature, Current, Voltage, Charge Amount and Discharge Amount are taken throughout each cycle with an average of 985 measurements taken per cycle on average for each variable. That's ~500 million individual data points in total.

![](/assets/images/blog/stanford-fast-charging-battery-dataset.png)

Ultimately however the test sets only require a single prediction per battery: the input is the first 100 cycles of data for that battery, the output is how long it’s going to live for past that point given in cycles. Using a naive approach this amounts to merely 124 data points, with only 43 of theses being in the training set. Not enough to train any large, modern neural network.

Given this, the whole battery chemistry aspect of this dataset becomes less important. The really important problem for ML researchers when dealing with MATR becomes: how do we overcome the small number of labels? There are many possible answers (transfer learning, data augmentation, etc) but none of them are simple or guaranteed to work.

### Diverse Batch Characteristics

The dataset was collected in 3 batches, b1, b2 and b3 representing 3 sequential groups of 48 or so batteries that were plugged into the same potentiostat and cycled until death. Multiple months elapsed between each set being plugged in and some had to be dropped due to measurement abnormalities. The training set and MATR1 are made up of a combination of b1 and b2, MATR2 is the entirety of b3. As it turns out these batches have significantly divergent properties, starting with the target.

![](/assets/images/blog/stanford-fast-charging-battery-dataset-1-.png)

Above we have plotted the remaining useful life of each battery at cycle 100 against the so called “Qdlin delta variance” feature used by Severson et al. The linearity of this relationship is promising, but clearly the batching itself has had a large impact on the target and generalizing is going to be tough.

Another example are the charging curves. Below we have plotted the first portion of the charging curves of 10 random batteries taken from each set at cycle 100.

![](/assets/images/blog/battery-ml-screenshot-feb-12-2025.png)

These lines seem to indicate that each set begins charging at different times during this cycle, i.e. all b2 batteries have already begun charging at the beginning of the plot. We can also see that batteries from b3 have a much smoother, essentially linear slope, while the other two battery sets have a much bumpier, but still monotonic profile. A zoomed in section is given below to highlight this discrepancy.

![](/assets/images/blog/battery-ml-dataset-screenshot-feb-12-2025.png)

That said, what researchers are probably supposed to do when using this data is not deal with the raw charging curve values as they are given, but instead interpolate them against the given time value 't' for each cycle. I.e. create a function which takes the time elapsed at a given step sn and returns the charge amount at step sn and then use this to generate the charge values across a time period at constant intervals, then use these instead of the initially given charge values. Here we plot most of the charging cycle with this interpolation performed. Now all 3 sets are smooth and linear, but we can still perceive clear differences in distribution.

![](/assets/images/blog/battery-ml-researchers-screenshot-feb-12-2025.png)

To emphasize this point we plot the means and standard deviations of the interpolated charging curves for all 3 sets.

![](/assets/images/blog/battery-ml-researchers-screenshot-feb-12-2025-1-.png)

And for good measure here are the means and standard deviations of the other 4 variables similarly interpolated over time.

![](/assets/images/blog/stanford-fast-charging-battery-dataset-2-.png)

A thorough analysis will reveal that the sets have distinct profiles. As a fun little aside we trained an XGBoost model to classify the 3 sets by splitting the set in half training on one half of each set and attempting to classify the remainder. In the graph below we see that MATR1 is very easy to distinguish from the other 2 sets after with only 16 samples (CLO is another subset of this data used in the literature, it is made up of the existing 3 sets).

![](/assets/images/blog/stanford-fast-charging-battery-dataset-3-.png)

### Data Artifacts

Finally the data contains a some very obvious structures which are correlated with the target. A good example are charging artifacts.

Different batteries are charged in different ways and the the charging strategies are obvious to see in the data. Below we plot the voltage curves of two different batteries at the 100th cycle. In one case the battery was charged at 8C till it reached 25% capacity and then switched to 3.6C. The other battery was charged at 5.6C till 36% capacity and then switched to 4.3C. Severson et al. did this to demonstrate that their results generalized across different charging strategies, though each battery always retains the same charging strategy throughout its lifespan.
￼

![](/assets/images/blog/feb-12-screenshot-from-battery-ml-researchers.png)

Certain charging strategies are highly correlated with the target, here are all the different charging strategies plotted against how long their average battery lasted.
￼

![](/assets/images/blog/battery-ml-dataset.png)

Orange bars indicate that only one battery had this charging strategy, which accounts for all batteries in b2. Charging strategies are both related to the target and very obvious in the input. It’s quite likely that deep learning models will rely on these when making predictions even though they are not shared across sets.

Another example: the voltage curve interpolated over time:
￼

![](/assets/images/blog/stanford-fast-charging-battery-dataset-4-.png)

This plot contains one voltage curve for each battery colored according to the lifespan of the battery. We can see that:

* there is a large variation in when exactly the charging and discharging processes start and end which presumably has more to do with the specifics of the potentiostat configuration than anything else.
* the exact start and end times have a big impact on the shape of the curve
* there is clearly some association between the start and end times and the target, with the outlying purple cluster corresponding to b2

Due to data artifacts like this, success in modelling this dataset ultimately has as much to do with the chemistry of batteries as it does with how you choose to deal with these specific quirks of the data collection process, quirks which likely will not appear in other similar datasets or the real world.

## Recent Findings

Despite these challenges, some research papers have attempted to apply deep learning to this dataset, often claiming to significantly outperform Severson et al’s baseline. We will show the papers we found to be the most useful and relevant to the task of predicting battery remaining useful life.

### Dual-Stream ViT ESA

![](/assets/images/blog/stanford-fast-charging-battery-dataset-5-.png)

Introduced by Liu et al in 2024\[2], the Dual-Stream ViT-SAE Model uses a creative preprocessing pipeline to break the battery features up into delta features and standard features, feeding the data through two vision transformers. They reported a remarkably low RMSE of approximately 25 cycles on the test set which is by far the most impressive result we are aware of and implies that deep learning approaches can effectively model this data.

However, the results they report aren’t achieved on the standard MATR1/MATR2 split. Instead they create their own train/test split and report on that. This would be all well and good if they actually specified their new test set, released their code, or reported their performance on the standard train/test split. They don’t though, which seems a little unusual.

Our team made many attempts to replicate their opinionated data preprocessing and modelling techniques but were never able do better than Severson et al. on the standard train/test split. We will leave the reader to investigate this further.

### BatLiNet: A Closer Look

![](/assets/images/blog/stanford-fast-charging-battery-dataset-6-.png)

Among the recent papers claiming to have surpassed the 2019 model, BatLiNet stood out because its authors provided transparent implementation of their code via CodeOcean, making it possible to reproduce their results. On top of that, their model was benchmarked using other popular battery datasets in microsoft's BatteryML repository\[4]. At first glance (see "BatLiNet" below), while only a little bit better than Severson et al.'s linear regression model, their results represented a significant improvement.

![](/assets/images/blog/feb-20-screenshot-from-battery-ml-researchers.png)

However, upon scrutiny we feel we cannot rely on their reported results. After downloading and running the provided code we noticed that the authors manually set an important hyperparameter when performing the MATR-2 test. This parameter: alpha, which governs how much weighting to give predictions relating to each stream of their neural network is set to the default 0.5 for all the other tests they perform, but for this test it is set to 0.2. We ran their code with the hyperparameter consistently set to 0.5 and achieved significantly worse results for MATR-2, results given below over 8 trials using the same seeds as the original paper.

![](/assets/images/blog/stanford-fast-charging-battery-dataset-7-.png)

This decision is not mentioned in the paper, something that the authors acknowledged when we contacted them directly. The scores achieved when we avoid manually setting hyper-parameters are still better than Severson et al.'s linear regression model, but by <1%.

### DiffBatt: A Novel Approach

![](/assets/images/blog/stanford-fast-charging-battery-dataset-8-.png)

Introduced in late 2024, DiffBatt leverages diffusion models with classifier-free guidance alongside a transformer architecture to achieve high expressivity and scalability. It functions as both:

* **A Probabilistic Model:** Capturing uncertainties in aging behaviors.
* **A Generative Model:** Capable of simulating battery degradation over time.
  Notably, DiffBatt has demonstrated better results in remaining useful life (RUL) prediction, achieving a mean RMSE of 88 cycles across the test dataset—outperforming many of its contemporaries. However, it does not generalize well to MATR2, achieving an RMSE of 235. As appealing as a diffusion approach might be, in practical terms we are still far behind Severson et al.'s linear regression model for this dataset.

## Final Thoughts

Be careful when working with the Stanford Fast Charging Battery Dataset. It is very hard to get deep learning approaches to perform well on this dataset due to its small sample size, test split diversity and data collection artifacts. Many clever researchers have already tried reasonable, up-to-date techniques on this dataset and none have succeeded convincingly to grok it any better than the original linear regression model.

## Bibliography

1. \[1] Eivazi, H., Hebenbrock, A., Ginster, R., Bl¨omeke, S., Wittek, S., Herrmann, C., . . . Rausch, A. (2024). Diffbatt: A diffusion model for battery degradation prediction and synthesis. arXiv preprint arXiv:2410.23893.
2. \[2] Liu, Y., Ahmed, M., Feng, J., Mao, Z., & Chen, Z. (2025). Deep learning-powered lifetime prediction for lithium-ion batteries based on small amounts of charging cycles. IEEE Transactions on Transportation Electrification, 11 (1), 3078-3090. doi: 10.1109/TTE.2024.3434553
3. \[3] Zhang, H., Li, Y., Zheng, S., Lu, Z., Gui, X., Xu, W., & Bian, J. (2023). Harnessing intra-and inter-cell differences: A comprehensive approach to precise battery lifespan estimations across conditions. arXiv preprint arXiv:2310.05052.
4. \[4] Zhang, H., Gui, X., Zheng, S., Lu, Z., Li, Y., & Bian, J. (2024). BatteryML: An Open-source platform for Machine Learning on Battery Degradation. International Conference on Learning Representations (ICLR 2024).
5. \[5] Severson, K. A., Attia, P. M., Jin, N., Perkins, N., Jiang, B., Yang, Z., Chen, M. H., Aykol, M., Herring, P. K., Fraggedakis, D., Bazant, M. Z., Harris, S. J., Chueh, W. C., & Braatz, R. D. (2019). Data-driven prediction of battery cycle life before capacity degradation. Nature Energy, 4, 383-391.
