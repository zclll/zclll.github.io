---
title: 图片懒加载
categories: 前端设计思路
tags:
  - 前端设计
date: 2019-11-03 20:33:36
cover: /image/cover/javascript.jpg
---

### 使用场景

+ 在一些图片量比较大的场景（电商首页，小程序首页等），如果我们打开页面时就加载所有的图片，那势必会导致页面的卡顿以及白屏，给用户不好的体验，导致用户流失。

+ 但是我们仔细想一下，用户真的需要我们显示所有图片一起展示吗？其实并不是，用户看到的只是浏览器可视区域的内容。所以从这个情况我们可以做一些优化，只显示用户可视区域内的图片，当用户触发滚动的瞬间再去请求显示给用户。

### 基本思路

#### planA

监听到scroll事件后，调用目标元素的getBoundingClientRect()方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。计算目标元素的offsettop、屏幕高度、滚动条的高度之间的值确定元素是否显示在页面中

+ img 标签有自定义属性 data-src
+ 首屏展示可视区域内的图片 src 值 替换为 data-src
+ 滚动出现在可视区域的图片即时展示 （重复第二步）

+ 利用scroll事件函数判断目标元素是否显示在页面中（getBoundingClientRect()获取返回元素的大小及其相对于视口的位置）

```javascript
viewHeight = window.innerHeight
imgs = Array.from(document.getElementsByClassName("imgs"))
function lazyLoad() {
    // 运用闭包 count 进行计数 避免已显示的图片重复参与循环
    let count = 0
    return () => {
        for (let i = count; i < imgs.length; i++) {
            // getBoundingClientRect()获取返回元素的大小及其相对于视口的位置
            // 获取第i张图片是否在可视区域
            let distance = viewHeight - imgs[i].getBoundingClientRect().top
            if (distance >= 0) {
                // 图片在可视区域时设置图片的src 为 当前元素 data-src
                imgs[i].src = imgs[i].getAttribute('data-src')
                imgs[i].removeAttribute('data-src')
                // 图片已被显示，下次从count + 1 张开始检查是否在可视区域
                count += 1
            }
        }
    }
}
// 添加滚动事件触发加载
window.addEventListener('scroll', lazyLoad, false)
```

至此我们已经初步完成了我们的懒加载，但是我们大家都知道，scroll这个事件实在太容易被触发了，用户一滚动鼠标就会触发很多次，如果一直滚势必会导致重复触发执行我们的事件，这也会导致我们的性能急剧下降，所以这就引出了我们的混合体 防抖节流 来优化我们的性能。

+ **节流**
  比如mouseover，resize这种事件，每当有变化的时候，就会触发一次函数，这样很浪费资源。就比如一个持续流水的水龙头，水龙头开到最大的时候很浪费水资源，将水龙头开得小一点，让他每隔200毫秒流出一滴水，这样能源源不断的流出水而又不浪费。而节流就是每隔n的时间调用一次函数，而不是一触发事件就调用一次，这样就会减少资源浪费。
+ **防抖**
  A和B说话，A一直说，当A持续说了一段时间的话后停止讲话，过了10秒之后，我们判定A讲完了，B开始回答A的话；如果10秒内A又继续讲话，那么我们判定A没讲完，B不响应，等A再次停止后，我们再次计算停止的时间，如果超过10秒B响应，如果没有则B不响应。

+ **节流与防抖的区别**
  节流与防抖的前提都是某个行为持续地触发，不同之处只要判断是要优化到减少它的执行次数还是只执行一次就行。

#### planB

利用IntersectionObserver实现
**IntersectionObserver使用方法**

```javascript
var io = new IntersectionObserver(callback, option);
```

上面代码中，IntersectionObserver是浏览器原生提供的构造函数，接受两个参数：callback是可见性变化时的回调函数，option是配置对象（该参数可选）。
构造函数的返回值是一个观察器实例。实例的observe方法可以指定观察哪个 DOM 节点。

```javascript
// 开始观察
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();
```

上面代码中，observe的参数是一个 DOM 节点对象。如果要观察多个节点，就要多次调用这个方法。

```javascript
io.observe(elementA);
io.observe(elementB);
```

##### callback 参数

目标元素的可见性变化时，就会调用观察器的回调函数callback。
callback一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```javascript
var io = new IntersectionObserver(
  entries => {
    console.log(entries);
  }
);
```

callback函数的参数（entries）是一个数组，每个成员都是一个IntersectionObserverEntry对象。举例来说，如果同时有两个被观察的对象的可见性发生变化，entries数组就会有两个成员。

##### IntersectionObserverEntry 对象

IntersectionObserverEntry对象提供目标元素的信息，一共有六个属性。

```java
{
  time: 1875.699999988079,
  rootBounds: DOMRectReadOnly {
    bottom: 920,
    height: 1024,
    left: 0,
    right: 1024,
    top: 0,
    width: 920
  },
  boundingClientRect: DOMRectReadOnly {
     // ...
  },
  intersectionRect: DOMRectReadOnly {
    // ...
  },
  intersectionRatio: 0.54,
  target: element
}
```

每个属性的含义如下。

+ time：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
+ target：被观察的目标元素，是一个 DOM 节点对象
+ rootBounds：根元素的矩形区域的信息，getBoundingClientRect()方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回null
+ boundingClientRect：目标元素的矩形区域的信息
+ intersectionRect：目标元素与视口（或根元素）的交叉区域的信息
+ intersectionRatio：目标元素的可见比例，即intersectionRect占boundingClientRect的比例，完全可见时为1，完全不可见时小于等于0

##### Option 对象

1. threshold
    threshold属性决定了什么时候触发回调函数。它是一个数组，每个成员都是一个门槛值，默认为[0]，即交叉比例（intersectionRatio）达到0时触发回调函数。

    ```javascript
    new IntersectionObserver(
      entries => {/* ... */}, 
      {
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );
    ```

    用户可以自定义这个数组。比如，[0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。

2. root 属性和 rootMargin 属性
    很多时候，目标元素不仅会随着窗口滚动，还会在容器里面滚动（比如在iframe窗口里滚动）。容器内滚动也会影响目标元素的可见性

    IntersectionObserver API 支持容器内滚动。root属性指定目标元素所在的容器节点（即根元素）。注意，容器元素必须是目标元素的祖先节点。

    ```javascript
    var opts = { 
      root: document.querySelector('.container'),
      rootMargin: "500px 0px" 
    };

    var observer = new IntersectionObserver(
      callback,
      opts
    );
    ```

    上面代码中，除了root属性，还有rootMargin属性。后者定义根元素的margin，用来扩展或缩小rootBounds这个矩形的大小，从而影响intersectionRect交叉区域的大小。它使用CSS的定义方法，比如10px 20px 30px 40px，表示 top、right、bottom 和 left 四个方向的值。

    这样设置以后，不管是窗口滚动或者容器内滚动，只要目标元素可见性变化，都会触发观察器。

##### !!!**注意点**

+ IntersectionObserver API 是异步的，不随着目标元素的滚动同步触发。

+ 规格写明，IntersectionObserver的实现，应该采用requestIdleCallback()，即只有线程空闲下来，才会执行观察器。这意味着，这个观察器的优先级非常低，只在其他任务执行完，浏览器有了空闲才会执行。

##### **实现代码**

```javascript
let arr = [
  "https://tse1-mm.cn.bing.net/th/id/OIP-C.JQ-VhVrsScl0rLNrPtMlcQHaE8?w=260&h=180&c=7&r=0&o=5&pid=1.7",
  "https://tse1-mm.cn.bing.net/th?id=OIP-C.M9CUntHQGPvSO5JkAn5Y4AHaFA&w=140&h=100&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
  "https://tse1-mm.cn.bing.net/th?id=OIP-C.xsA-3qUw6cqmd8nRfxk6TQHaEK&w=168&h=100&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
];
let n = 0;

var io = new IntersectionObserver((ios) => {
  ios.forEach((item) => {
    if (item.intersectionRatio) {
      var contain = item.target,
          image = new Image();
      image.src = arr[n % 3];
      image.style.width = "100%";
      n++;
      image.onload = function () {
        contain.appendChild(image);
        io.unobserve(contain);
      };
    }
  });
});

let lis = document.getElementsByClassName("test");

Array.from(lis).forEach((item) => {
  io.observe(item);
});
```
