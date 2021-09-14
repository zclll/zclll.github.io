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
