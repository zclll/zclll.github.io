---
title: numpy
categories: python 库
tags:
  - numpy
date: 2021-10-08 12:33:36
cover: image/cover/python.png
---


### 1.numpy简介

NumPy是用Python进行科学计算的基础软件包。
具有矢量运算能力，快速、节省空间。numpy支持高级大量的维度数组与矩阵运算，此外也针对数组运算提供大量的数学函数库。

1. 功能强大的N维数组对象。
2. 精密广播功能函数。
3. 集成 C/C+和Fortran 代码的工具。
4. 强大的线性代数、傅立叶变换和随机数功能。

### 2.numpy环境安装

numpy 安装

```python
pip install numpy
```

### 3.numpy数组创建

ndarray：N维数组对象（矩阵），所有元素必须是相同类型。
ndarray属性：`ndim` 属性，表示维度个数；`shape` 属性，表示各维度大小；`dtype` 属性，表示数据类型。<br />
!["numpy创建数组"](/image/numpy-image/numpy-narray.png "numpy创建数组")

```python
# 示例代码

import numpy;

print '使用列表生成一维数组'
data = [1,2,3,4,5,6]
x = numpy.array(data)
print x #打印数组
print x.dtype #打印数组元素的类型

print '使用列表生成二维数组'
data = [[1,2],[3,4],[5,6]]
x = numpy.array(data)
print x #打印数组
print x.ndim #打印数组的维度
print x.shape #打印数组各个维度的长度。shape是一个元组

print '使用zero/ones/empty创建数组:根据shape来创建'
x = numpy.zeros(6) #创建一维长度为6的，元素都是0一维数组
print x
x = numpy.zeros((2,3)) #创建一维长度为2，二维长度为3的二维0数组
print x
x = numpy.ones((2,3)) #创建一维长度为2，二维长度为3的二维1数组
print x
x = numpy.empty((3,3)) #创建一维长度为2，二维长度为3,未初始化的二维数组
print x

print '使用arrange生成连续元素'
print numpy.arange(6) # [0,1,2,3,4,5,] 开区间
print numpy.arange(0,6,2)  # [0, 2，4]
```

### 4.ndarray数组元素的类型

!["numpy创建数组"](/image/numpy-image/numpy-dtype.jpg "numpy创建数组")

```python
# 示例代码

print '生成指定元素类型的数组:设置dtype属性'
x = numpy.array([1,2.6,3],dtype = numpy.int64)
print x # 元素类型为int64
print x.dtype
x = numpy.array([1,2,3],dtype = numpy.float64)
print x # 元素类型为float64
print x.dtype

print '使用astype复制数组，并转换类型'
x = numpy.array([1,2.6,3],dtype = numpy.float64)
y = x.astype(numpy.int32)
print y # [1 2 3]
print x # [ 1.   2.6  3. ]
z = y.astype(numpy.float64)
print z # [ 1.  2.  3.]

print '将字符串元素转换为数值元素'
x = numpy.array(['1','2','3'],dtype = numpy.string_)
y = x.astype(numpy.int32)
print x # ['1' '2' '3']
print y # [1 2 3] 若转换失败会抛出异常

print '使用其他数组的数据类型作为参数'
x = numpy.array([ 1., 2.6,3. ],dtype = numpy.float32);
y = numpy.arange(3,dtype=numpy.int32);
print y # [0 1 2]
print y.astype(x.dtype) # [ 0.  1.  2.]
```

### 5.ndarray的矢量化计算

矢量运算：相同大小的数组键间的运算应用在元素上
矢量和标量运算：“广播”— 将标量“广播”到各个元素

```python
print 'ndarray数组与标量/数组的运算'
x = numpy.array([1,2,3]) 
print x*2 # [2 4 6]
print x>2 # [False False  True]
y = numpy.array([3,4,5])
print x+y # [4 6 8]
print x>y # [False False False]
```

### 6.ndarray数组的基本索引和切片

一维数组的索引：与Python的列表索引功能相似;
多维数组的索引：

1. arr[r1:r2, c1:c2]
2. arr[1,1] 等价 arr[1][1]
3. [:] 代表某个维度的数据

```python
print 'ndarray的基本索引'
x = numpy.array([[1,2],[3,4],[5,6]])
print x[0] # [1,2]
print x[0][1] # 2,普通python数组的索引
print x[0,1] # 同x[0][1]，ndarray数组的索引
x = numpy.array([[[1, 2], [3,4]], [[5, 6], [7,8]]])
print x[0] # [[1 2],[3 4]]
y = x[0].copy() # 生成一个副本
z = x[0] # 未生成一个副本
print y #  [[1 2],[3 4]]
print y[0,0] # 1
y[0,0] = 0 
z[0,0] = -1
print y # [[0 2],[3 4]]
print x[0] # [[-1 2],[3 4]]
print z # [[-1 2],[3 4]]

print 'ndarray的切片'
x = numpy.array([1,2,3,4,5])
print x[1:3] # [2,3] 右边开区间
print x[:3] # [1,2,3] 左边默认为 0
print x[1:] # [2,3,4,5] 右边默认为元素个数
print x[0:4:2] # [1,3] 下标递增2
x = numpy.array([[1,2],[3,4],[5,6]])
print x[:2] # [[1 2],[3 4]]
print x[:2,:1] # [[1],[3]]
x[:2,:1] = 0 # 用标量赋值
print x # [[0,2],[0,4],[5,6]]
x[:2,:1] = [[8],[6]] # 用数组赋值
print x # [[8,2],[6,4],[5,6]]
```









