---
title: numpy-api函数
categories: python 库
tags:
  - numpy
date: 2021-10-08 11:33:36
cover: image/cover/python.png
---

### 1.ndarray通用函数

通用函数（ufunc）是一种对ndarray中的数据执行元素级运算的函数。<br />
<div style="display:flex;margin-top:10px">
  <img src="/image/numpy-image/numpy-api.png" style="width:49%">
  <img src="/image/numpy-image/numpy-2-api.png" style="width:49%">
</div>

```python
print '一元ufunc示例'
x = numpy.arange(6)
print x # [0 1 2 3 4 5]
print numpy.square(x) # [ 0  1  4  9 16 25]
x = numpy.array([1.5,1.6,1.7,1.8])
y,z = numpy.modf(x)
print y # [ 0.5  0.6  0.7  0.8]
print z # [ 1.  1.  1.  1.]

print '二元ufunc示例'
x = numpy.array([[1,4],[6,7]])
y = numpy.array([[2,3],[5,8]])
print numpy.maximum(x,y) # [[2,4],[6,8]]
print numpy.minimum(x,y) # [[1,3],[5,7]]
```

### 2.NumPy的where函数

p.where(condition, x, y)，第一个参数为一个布尔数组，第二个参数和第三个参数可以是标量也可以是数组。

```python
print 'where函数的使用'
cond = numpy.array([True,False,True,False])
x = numpy.where(cond,-2,2)
print x # [-2  2 -2  2]
cond = numpy.array([1,2,3,4])
x = numpy.where(cond>2,-2,2)
print x # [ 2  2 -2 -2]
y1 = numpy.array([-1,-2,-3,-4])
y2 = numpy.array([1,2,3,4])
x = numpy.where(cond>2,y1,y2) # 长度须匹配
print x # [1,2,-3,-4]

print 'where函数的嵌套使用'
y1 = numpy.array([-1,-2,-3,-4,-5,-6])
y2 = numpy.array([1,2,3,4,5,6])
y3 = numpy.zeros(6)
cond = numpy.array([1,2,3,4,5,6])
x = numpy.where(cond>5,y3,numpy.where(cond>2,y1,y2))
print x # [ 1.  2. -3. -4. -5.  0.]
```

### 3.ndarray常用的统计方法

可以通过这些基本统计方法对整个数组/某个轴的数据进行统计计算。

- **sum:** 对数组中全部或莫轴向的元素求和。0长度的数组sum为0
- **mean:** 算术平均数，0长度的数组mean为NaN
- **std、var:** 标准差和方差
- **min、max** 最大值和最小值
- **argmin、argmax:** 最大元素和最小元素的索引
- **cumsum:** 所有元素的累计和
- **cumprod** 所有元素的累计积  

```python
print 'numpy的基本统计方法'
x = numpy.array([[1,2],[3,3],[1,2]]) #同一维度上的数组长度须一致
print x.mean() # 2
print x.mean(axis=1) # 对每一行的元素求平均
print x.mean(axis=0) # 对每一列的元素求平均
print x.sum() #同理 12
print x.sum(axis=1) # [3 6 3]
print x.max() # 3
print x.max(axis=1) # [2 3 2]
print x.cumsum() # [ 1  3  6  9 10 12]
print x.cumprod() # [ 1  2  6 18 18 36]
```

用于布尔数组的统计方法：

- **sum:** 统计数组/数组某一维度中的True的个数
- **any:** 统计数组/数组某一维度中是否存在一个/多个True
- **all:** 统计数组/数组某一维度中是否都是True

```python
print '用于布尔数组的统计方法'
x = numpy.array([[True,False],[True,False]])
print x.sum() # 2
print x.sum(axis=1) # [1,1]
print x.any(axis=0) # [True,False]
print x.all(axis=1) # [False,False]
```

使用**sort**对数组/数组某一维度进行就地排序（会修改数组本身）。

```python
print '.sort的就地排序'
x = numpy.array([[1,6,2],[6,1,3],[1,5,2]])
x.sort(axis=1) 
print x # [[1 2 6] [1 3 6] [1 2 5]]
#非就地排序：numpy.sort()可产生数组的副本
```

### 4.ndarray数组的去重以及集合运算

- **unique(x):** 计算x中的唯一元素，并返回有序结果
- **instersect1d(x,y):** 计算x和y中的公共元素，并返回有序结果
- **union1d(x,y):** 计算x和y的并集，并返回有序结果
- **in1d(x,y):** 得到一个表示“x的元素是否包含于y”的布尔型数组
- **setdiff1d(x,y):** 集合的差，即元素在x中且不在y中
- **setxor1d(x,y):** 集合的对称差，即存在于一个数组中但不同时存在于两个数组中的元素

```python
print 'ndarray的唯一化和集合运算'
x = numpy.array([[1,6,2],[6,1,3],[1,5,2]])
print numpy.unique(x) # [1,2,3,5,6]
y = numpy.array([1,6,5])
print numpy.in1d(x,y) # [ True  True False  True  True False  True  True False]
print numpy.setdiff1d(x,y) # [2 3]
print numpy.intersect1d(x,y) # [1 5 6]
```

### 5.numpy中的线性代数

- **diag:** 以一维数组的形式返回方阵的对角线（或非对角线）元素，或将一维数组转换成方阵（非对角线元素为0）
- **dot:** 矩阵乘法
- **trace:** 计算对角线元素的和
- **det:** 计算矩阵行列式
- **eig:** 计算方阵的本征值和本征向量
- **inv:** 计算方阵的逆
- **pinv:** 计算矩阵的Moore-Penrose伪逆
- **qr:** 计算QR分解
- **svd:** 计算奇异值分解（SVD）
- **solve:** 解线性方程组Ax = b，其中A为一个方阵
- **lstsq** 计算Ax = b的最小二乘解

```python
print '线性代数'
import numpy.linalg as nla
print '矩阵点乘'
x = numpy.array([[1,2],[3,4]])
y = numpy.array([[1,3],[2,4]])
print x.dot(y) # [[ 5 11][11 25]]
print numpy.dot(x,y) # # [[ 5 11][11 25]]
print '矩阵求逆'
x = numpy.array([[1,1],[1,2]])
y = nla.inv(x) # 矩阵求逆（若矩阵的逆存在）
print x.dot(y) # 单位矩阵 [[ 1.  0.][ 0.  1.]]
print nla.det(x) # 求行列式
```

### 6.numpy中的随机数生成
