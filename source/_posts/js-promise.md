---
title: javascript - 基础(promise)
categories: javascript基础
tags:
  - javascript
date: 2018-09-01
cover: /image/cover/javascript.jpg
---


### Promise 简介

Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值。
存在意义：**异步问题同步化解决方案**

### Promise 描述

一个 Promise 对象代表一个在这个 promise 被创建出来时不一定已知的值。它让您能够把异步操作最终的成功返回值或者失败原因和相应的处理程序关联起来。 这样使得异步方法可以像同步方法那样返回值：异步方法并不会立即返回最终的值，而是会返回一个 `promise`，以便在未来某个时候把值交给使用者。
一个 Promise 必然处于以下几种状态之一：

- 待定（`pending`）: 初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（`fulfilled`）: 意味着操作成功完成。
- 已拒绝（`rejected`）: 意味着操作失败。

待定状态的 Promise 对象要么会通过一个值被兑现（*fulfilled*），要么会通过一个原因（错误）被拒绝（*rejected*）。当这些情况之一发生时，我们用 promise 的 then 方法排列起来的相关处理程序就会被调用。如果 promise 在一个相应的处理程序被绑定时就已经被兑现或被拒绝了，那么这个处理程序就会被调用，因此在完成异步操作和绑定处理方法之间不会存在竞争状态。
因为 `Promise.prototype.then` 和  `Promise.prototype.catch` 方法返回的是 `promise`， 所以它们可以被链式调用。

### Promise 运行流程

1. executor会立即执行（同步执行）
2. 然后将任务储存在微任务中
3. 等待 构造函数中的 `resolve` 或 `reject` 执行，只有第一次执行有效，多次调用没有任何作用,如果一直**没调用**则永远不会触发 `then` 或者 `catch`
4. 等主线程执行完成，事件循环机制(`Event Loop`)从微任务中查看状态（有可执行的微任务调出来运行 `then` 或者 `catch` ）
5. `then` 和 `catch` 会返回一个新的 `promise` 所以可以被链式调用且下一个 `then` 或者 `catch`传值为上一个 `then` 或者 `catch`函数的返回值。
6. `catch` 类似 `switch-case`的 `default` 可以用来兜底
**宏任务与微任务**

- 宏任务（任务队列）：setTimeout产生的队列为宏任务
- 微任务（任务队列）：promise产生的队列为微任务

> 同一时间微任务的优先级会大于微任务
>
> 微任务 > DOM渲染 > 宏任务
>

```javascript
let p = new Promise(r=>{console.log("executor"); r()})
let con = "测试";
document.write(con);
console.log(1);
setTimeout(_=>console.log("s2"),0)
p.then(_=>console.log("p3"))
// 执行顺序 executor => 1 => p3 => dom渲染 => s2
```

### Promise 方法

#### Promise.all([])

该方法接收一个Promise数组返回一个Promise，只有**当该数组中的所有Promise完成**后才会由pendding状态变为resolve**执行then**里面的回调函数，若数组中有**任意一个或多个promise被拒绝**则会执行**失败回调**，catch方法会捕获到首个被执行的 reject函数。该方法获得的成功结果的数组里面的数据顺序和接收到的promise数组顺序是一致的。

#### Promise.any([])

当传入的promise数组中有**任意一个完成时就会终止**，会忽略到所有被拒绝掉的promise，直到第一个promise完成。若传入**所有的promise被拒绝则会执行拒绝回调**。

#### Promise.race([])

当promise数组中任意一个promise被拒绝或者成功，则会**采用第一个promise作为他的返回值**。若为成功的执行then，若失败则执行catch。

#### Promise.allSettled([])

当给定的promise数组中的所有promise被拒绝后会返回一个拒绝的promise数组，与[]一一对应。
一旦所指定的 promises 集合中每一个 promise 已经完成，无论是成功的达成或被拒绝，未决议的 Promise将被异步完成。那时，所返回的 **promise 的处理器将传入一个数组作为输入，该数组包含原始 promises 集中每个 promise 的结果。**
对于**每个结果对象，都有一个 status 字符串**。如果它的值为 fulfilled，则结果对象上存在一个 value 。如果值为 rejected，则存在一个 reason 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
