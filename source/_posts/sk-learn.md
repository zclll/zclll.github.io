---
title: sk-learn 科学计算
tags:
  - sk-learn
  - python
categories: python 库
cover: image/cover/python.png
---

### 安装sk-learn

#### pip 简介

Scikit learn 也简称 sklearn, 是机器学习领域当中最知名的 python 模块之一.

Sklearn 包含了很多种机器学习的方式:

Classification 分类

Regression 回归

Clustering 非监督分类

Dimensionality reduction 数据降维

Model Selection 模型选择

Preprocessing 数据预处理

#### pip 安装

```python
# 安装条件
# Python (>=2.6 或 >=3.3 版本)
# Numpy (>=1.6.1)
# Scipy (>=0.9)

# python 2+ 版本
pip install sciket-learn

# python 3+ 版本
pip3 install sciket-learn

#如果你是 Windows 用户, 你也可以选择使用 Anaconda 来安装所有 python 的科学计算模块. Anaconda的相关资料在这
```

#### sk-learn 数据集分割

1. 留出法
  基本思想是将数据集D（即我们获得的所有样本数据）划分为两个互斥的集合，将其中一个作为训练集S，另一个作为验证集T，即D=SUT，S∩T=Φ。在S上训练出模型后，再用T来评估其测试误差，作为泛化误差的估计值；

    ```python
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split() 

    # X：待分割的样本集中的自变量部分，通常为二维数组或矩阵的形式；
    # y：待分割的样本集中的因变量部分，通常为一维数组；
    # test_size：用于指定验证集所占的比例，有以下几种输入类型：
    　　  # float型，0.0~1.0之间，此时传入的参数即作为验证集的比例；
    　　  # int型，此时传入的参数的绝对值即作为验证集样本的数量；
    　　  # None，这时需要另一个参数train_size有输入才生效，此时验证集去为train_size指定的比例或数量的补集；
    　　  # 缺省时为0.25，但要注意只有在train_size和test_size都不输入值时缺省值才会生效；
    # train_size：基本同test_size，但缺省值为None，其实test_size和train_size输入一个即可；
    # random_state：int型，控制随机数种子，默认为None，即纯随机（伪随机）；
    # stratify：控制分类问题中的分层抽样，默认为None，即不进行分层抽样，当传入为数组时，则依据该数组进行分层抽样（一般传入因变量所在列）；
    # shuffle：bool型，用来控制是否在分割数据前打乱原数据集的顺序，默认为True，分层抽样时即stratify为None时该参数必须传入False；
    ```

2. 交叉验证法
3. 基于生成器的采样方法

#### sk-learn 数据缩放

1. 标准缩放（Standard Scaler）
    StandardScaler假定你的数据正态分布在每个要素中，并将对其进行缩放，以使分布现在以0为中心，标准偏差为1。
    计算特征的平均值和标准偏差，然后根据以下条件对特征进行缩放：

    !["标准缩放（Standard Scaler）"](/image/md-image/python特征缩放1.png "标准缩放（Standard Scaler）")
    如果数据**不是正态分布**的，那么这**不算是最佳的缩放方法**。

    ```python
    from sklearn.preprocessing import StandardScaler  # 标准化工具
    import numpy as np

    x_np = np.array([[1.5, -1., 2.],
                  [2., 0., 0.]])
    scaler = StandardScaler()
    x_train = scaler.fit_transform(x_np)
    print('矩阵初值为：{}'.format(x_np))
    print('该矩阵的均值为：{}\n 该矩阵的标准差为：{}'.format(scaler.mean_,np.sqrt(scaler.var_)))
    print('标准差标准化的矩阵为：{}'.format(x_train))

    # 矩阵初值为：[[ 1.5 -1.   2. ]
    #             [ 2.   0.   0. ]]
    # 该矩阵的均值为：   [ 1.75 -0.5   1.  ]
    # 该矩阵的标准差为：[0.25 0.5  1.  ]
    # 标准差标准化的矩阵为：[[-1. -1.  1.]
    #                      [ 1.  1. -1.]]
    ```

    ```python
    StandardScaler()的方法
    fit():
      1. 功能：
        计算均值和标准差，用于以后的缩放。
      2. 参数：
        X: 二维数组，形如(样本的数量，特征的数量)
          训练集
    fit_transform():
      1. 功能：
        先计算均值、标准差，再标准化
      2. 参数:
        X: 二维数组
    transform():
      1. 功能：
        通过居中和缩放执行标准化。
      2. 参数：
        X: 二维数组
          该数据沿着特征轴。
    inverse_transform():
      1. 功能：
        将数据按比例恢复到以前的大小。
      2. 参数：
        X: 二维数组，形如(样本数量，特征数量)、
    容易犯的错误
    错误输入一维数组给fit_transform()、transform()。
    原因是，标准化是对列操作的，一维数组每列中只有一个值，无法计算。
    解决是，通过reshape(-1, 1)，将一维数组改为二维数组。
    ```

2. 最大最小值缩放（Min-Max Scaler）
3. 稳健缩放 （Roburst Scaler）
4. 归一化（Normalizer）
  