---
title: javascript轮转时间片
categories: javascript基础
tags:
  - javascript

date: 2019-12-05
cover: /image/cover/javascript.jpg
---

### 轮转时间片

**概念**： 短时间内轮流执行多个任务的片段（单线程 -> 模拟多线程）

1. 任务1 、任务2 ...
2. 切分任务并且随机排列这些任务片段组成一个队列
3. 按照队列的顺序将任务片段送进js进程
4. js线程执行一个又一个的片段
