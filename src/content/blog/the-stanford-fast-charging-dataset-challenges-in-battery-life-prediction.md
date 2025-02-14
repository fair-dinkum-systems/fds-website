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
image: /assets/images/blog/screenshot_2025-02-11_at_11.03.50_am.png
imageAlt: Plot
---
# ML Researchers: Beware the Stanford Fast Charging Battery Dataset

In 2019, a team of researchers from Stanford University made a surprising discovery in battery lifetime prediction. They developed a model that accurately foretasted the lifespan of lithium-ion phosphate batteries under fast-charging conditions using a simple linear regression model. With >2,000 citations this paper is considered a seminal work in the field of machine learning for battery modelling. 

The dataset released alongside this paper, the so called “Stanford Fast Charging Battery Dataset” or “MATR” is probably the most widely used dataset in machine learning for battery modelling and also one of the largest. However despite the rapid advancements in machine learning since 2019, **no deep learning approach has ever convincingly outperformed the original linear regression model on this dataset.**

![Screenshot 2025-02-12 at 4.58.38 PM.png](attachment:c7edbe5b-2a1d-46d2-a15c-01b9a647b5c6:Screenshot_2025-02-12_at_4.58.38_PM.png)

\*Batlinet, they reported better results, but we believe they obtained these in error. We have contacted the authors.

✦DiffBat

♱*BATTERYML: AN OPEN-SOURCE PLATFORM FOR MACHINE LEARNING ON BATTERY DEGRADATION*

❋ Our Results

The graph above contains the scores, reported or replicated by us, of the best performing models we are aware of on the two test sets of this dataset, known as MATR1 or *test* and MATR2 or *secondary_test*. As we can see, none of them outperform the linear regression model on both test sets.

For most of the rest of this article we’re going to try to explain why this is by enumerating some of the difficulties we encountered with this data when trying to create our own deep learning model to outperform Severson et al. Hopefully this will save future researchers some frustration.

### Why Is The Stanford Fast Charging Battery Dataset So Difficult?

The Stanford Fast Charging Dataset presents several challenges that make it inhospitable to deep learning: it has a small sample size, its splits have widely different distributions and the data contains many strange artifacts that are liable to confuse deep learning models. 

None of this is to deride in any way the excellent work of Severson et al. who take pains to document the minutiae of their data collection process. Six years later this dataset is still probably one of the top 3 best datasets for modelling batteries with machine learning. The issue seems to be that collecting battery charging data is an inherently very finicky and artifact-prone process.

**Small Sample Size**

The dataset itself contains only 124 batteries. Each battery has recorded on it an average of 810 cycles with 985 individual data points recorded per cycle across 5 variables. Ultimately however the test sets only require a single prediction per battery: the input is the first 100 cycles of data for that battery, the output is how long it’s going to live for past that point given in cycles.

![](/assets/images/blog/abx.png)

did someone say “weird artifacts”?

124 samples is not a enough to train any kind of neural network, and in fact only 43 of those are in the training set, so you’re going to have to use some kind of heavy duty data augmentation or transfer learning. Just based on this, battery chemistry is no longer the sole issue here. Our success is going to depend equally on our mastery of niche applications of small-dataset deep learning.

**Diverse Distributions**

The dataset was collected in 3 batches, b1, b2 and b3 representing 3 distinct batches of batteries plugged into the researcher’s potentiostat and cycled until death. The training set and the test set (MATR1) are made up of a combination of b1 and b2, MATR2 is the entirety of b3. Unfortunately these batches have very different properties, starting with the target.

![Screenshot 2025-02-12 at 10.27.20 AM.png](/assets/images/blog/asdf.png)

Above we have plotted the remaining useful life of each battery at cycle 100 against the so called “Qdlin delta variance” feature used by Severson et al. The linearity of this relationship is promising, but clearly the batching itself has had a very large impact on the target and generalizing is going to be tough.

Another example are the charging curves. Below we have plotted the first portion the recorded charging curves of 10 random batteries taken from each set. 

![Screenshot 2025-02-12 at 10.36.47 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.36.47-am.png)

As well as being offset from one another, we can see that batteries from b3 have a much smoother, essentially linear slope, while the other two battery sets have a much bumpier, but still monotonic profile. A zoomed in section is given below.

![Screenshot 2025-02-12 at 10.39.08 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.39.08-am.png)

In fact what you’re *probably* supposed to do when using this data is not take the raw charging curve values as they are given, but interpolate them against the given time value `'t'` for each cycle first. Here we plot most of the charging cycle with this interpolation performed. Now all 3 sets are smooth and linear, but we can still perceive clear differences in distribution. 

![Screenshot 2025-02-12 at 10.45.36 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.45.36-am.png)

![Screenshot 2025-02-12 at 10.50.17 AM.png](/assets/images/blog/screenshot-2025-02-12-at-10.50.17-am.png)

And for good measure here are the means and standard deviations of the other 4 variables similarly interpolated over time.

![output.png](/assets/images/blog/output-1-.png)

Why the charging data would be better synced with time in the 3rd batch but not the other two remains a mystery, but many such differences exist between sets. Rather than enumerate every single difference we trained an XGBoost model to classify the 3 sets. Across 8 seeds it reaches 100% accuracy at ___ samples per set.

**Data Artifacts** 

Finally, differing sets aside the data contains a lot of very obvious structures which are correlated with the target. We will merely give the most obvious examples here: charging cycles. 

Different batteries are charged in different ways and the the charging strategies obvious to see in the data. Below we plot the voltage curves of two different batteries at the 100th cycle. In one case the battery was charged at 8C till it reached 25% capacity and then switched to 3.6C. The other battery was charged at 5.6C till 36% and then switched to 4.3C. The original authors this to demonstrate that their results generalized across different charging strategies, though each battery always retains the same charging strategy.

![and what about that little bump at the end for b3c12? who knows what that’s about…](/assets/images/blog/screenshot-2025-02-12-at-12.34.22-pm.png)

and what about that little bump at the end for b3c12? who knows what that’s about…

Certain charging strategies are highly correlated with the target, here are all the different charging strategies plotted against how long their average battery lasted.

![rul-bars.png](/assets/images/blog/rul-bars-1-.png)

Orange bars indicate that only one battery had this charging strategy, which accounts for all batteries in b2. Charging strategies are both related to the target and very obvious in the input. it’s quite likely that deep learning models will rely on these when making predictions even though they are not shared across sets.
Another example: the voltage curve interpolated over time:

![Screenshot 2025-02-12 at 12.53.03 PM.png](/assets/images/blog/b.png)

This plot contains one voltage curve for each battery colored according to the lifespan of the battery. We can see that:

* there is a large variation in when exactly the charging and discharging processes start and end which presumably has more to do with the specifics of the potentiostat configuration than anything else. these seem to be around 6 mysterious but distinct groupings.
* the exact start and end times have a big impact on the shape of the curve
* there is clearly some association between the start and end times and the target

There are many more similar examples, suffice to say that success in modelling this dataset ultimately has as much to do with the chemistry of batteries as it does to do with how you choose to deal with these specific quirks of the data, quirks which likely will not appear in other similar datasets or the real world.

**Summary**

In conclusion, there are many reasons, small sample size, diverse distributions and data artifacts why this dataset is difficult to use for deep learning. We listed  just some of the many, *many* issues we encountered, if you decide to dive in you’ll surely discover many more.

### Recent findings

Despite these challenges, there are no shortage of research papers applying deep learning to this dataset. In fact, recent papers have claimed to significantly outperform Severson et al. Here we will present our findings having read every notable example of such papers, and attempted to re-implement the two most promising examples.

1. **Dual-Stream ViT-ESA** – This paper lacks sufficient transparency in how its results were achieved, making it difficult to verify the claimed performance improvements.
2. **BatLiNet** – This model appears to achieve better performance, but only by carefully managing the dataset’s artifacts. In reality, it does not truly improve predictive performance in a way that would generalize to other datasets.

### Revisiting BatLiNet: A Closer Look at Its Issues

Among the recent papers claiming to have surpassed the 2019 model, BatLiNet stood out because its authors provided transparent implementation of their code via CodeOcean, making it possible to reproduce their results. On top of that, their model was also benchmarked using other popular battery datasets in BatteryML commonly referenced by other papers. At first glance, their reported performance appeared drastically impressive. However, upon scrutiny and deeper investigation, we found several critical flaws that undermines its credibility in real-world application.

1. Inconsistent model configuration - We noticed that the authors tuned their model differently for the test and secondary test set. While this might improve their reported results, it is a strategy that wouldn’t translate into real-world scenarios since a single configuration must generalize across all data.
2. Model Architecture Interpretability - Beyond dataset specific tuning, the model architecture or design choices itself seem arbitrary, lacking theoretical justification that indicates clear advantages over classical modeling methods.

### The Dual-Stream ViT ESA Model (alternative)

This model was introduced by Liu et al in 2024, it uses a sophisticated preprocessing pipeline to break the battery features up into delta features and normal features and a twin-bodied transformer to process it. 
Their results are good, excellent in fact, achieving \~15 cycle RMSE, which is a \~11x error reduction compared to Severson et al. These are the kinds of results that deep learning promised us.

**INSERT THE GRAPH THEY CREATED**

The catch? The results they report aren’t achieved on the standard MATR1/MATR2 split. Instead they create their own train/test split and report on that. This would be all well and good if they actually specified their new test set,  released their code, or reported their performance on the standard train/test split. They don’t though, which seems a bit odd.
Our team made many attempts to replicate their opinionated data preprocessing and modelling techniques but were never able do better than Severson et al. on the standard train/test split. 
Conclude from all of that what you will.

**Summary**

Be careful when dealing with this dataset. 
Like most battery data datasets, it’s inherently inhospitable to deep learning and it has a lot of quirks, all of which take a while to understand properly and if you fail to treat any of these quirks properly your research will end up being invalid.
Furthermore, many have tried reasonable, up-to-date techniques on this dataset and none have succeeded convincingly to model it.
Beware.
