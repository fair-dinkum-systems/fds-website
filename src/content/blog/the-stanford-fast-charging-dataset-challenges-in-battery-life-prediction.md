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










124 samples is not a enough to train any kind of neural network, and in fact only 43 of those are in the training set, so you’re going to have to use some kind of heavy duty data augmentation or transfer learning. Just based on this, battery chemistry is no longer the sole issue here. Our success is going to depend equally on our mastery of niche applications of small-dataset deep learning.

**Diverse Distributions**

The dataset was collected in 3 batches, b1, b2 and b3 representing 3 distinct batches of batteries plugged into the researcher’s potentiostat and cycled until death. The training set and the test set (MATR1) are made up of a combination of b1 and b2, MATR2 is the entirety of b3. Unfortunately these batches have very different properties, starting with the target.











Above we have plotted the remaining useful life of each battery at cycle 100 against the so called “Qdlin delta variance” feature used by Severson et al. The linearity of this relationship is promising, but clearly the batching itself has had a very large impact on the target and generalizing is going to be tough.

Another example are the charging curves. Below we have plotted the first portion the recorded charging curves of 10 random batteries taken from each set. 








As well as being offset from one another, we can see that batteries from b3 have a much smoother, essentially linear slope, while the other two battery sets have a much bumpier, but still monotonic profile. A zoomed in section is given below.










In fact what you’re *probably* supposed to do when using this data is not take the raw charging curve values as they are given, but interpolate them against the given time value 't' for each cycle first. Here we plot most of the charging cycle with this interpolation performed. Now all 3 sets are smooth and linear, but we can still perceive clear differences in distribution. 




















Why the charging data would be better synced with time in the 3rd batch but not the other two remains a mystery, but many such differences exist between sets. Rather than enumerate every single difference we trained an XGBoost model to classify the 3 sets. Across 8 seeds it reaches 100% accuracy at ___ samples per set.

**Data Artifacts**

Finally, differing sets aside the data contains a lot of very obvious structures which are correlated with the target. We will merely give the most obvious examples here: charging cycles.

Different batteries are charged in different ways and the the charging strategies obvious to see in the data. Below we plot the voltage curves of two different batteries at the 100th cycle. In one case the battery was charged at 8C till it reached 25% capacity and then switched to 3.6C. The other battery was charged at 5.6C till 36% and then switched to 4.3C. The original authors this to demonstrate that their results generalized across different charging strategies, though each battery always retains the same charging strategy.








Certain charging strategies are highly correlated with the target, here are all the different charging strategies plotted against how long their average battery lasted.












Orange bars indicate that only one battery had this charging strategy, which accounts for all batteries in b2. Charging strategies are both related to the target and very obvious in the input. it’s quite likely that deep learning models will rely on these when making predictions even though they are not shared across sets.
Another example: the voltage curve interpolated over time:
