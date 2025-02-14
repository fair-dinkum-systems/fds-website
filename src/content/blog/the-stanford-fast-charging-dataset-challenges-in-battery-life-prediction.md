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
