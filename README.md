# `Threejs` 开发微信小游戏

本项目是一个使用 `Threejs` 开发微信小游戏的 `'完整'` 示例，不定期更新

---

## 使用的库

`weapp-adapter` : https://github.com/finscn/weapp-adapter

---

`Threejs` : https://github.com/mrdoob/three.js

由于微信小游戏的包大小限制，直接引入 `three.js` 微信开发工具压缩后还是会很大，所以引入 `minified` 版本后体积会减少很多，使用 `weapp-adapter` 后 `Threejs` 无需修改代码

---

~~`Physijs` : https://github.com/chandlerprall/Physijs~~

~~由于 `Physijs` 是基于 `worker` 进行模拟， 而微信小游戏中的 `worker` 并非原生，所以需要对 `physi.js` 、 `physijs_worker.js` 中的部分代码进行修改才能适配微信小游戏~~

---

~~`Ammojs` : https://github.com/kripken/ammo.js~~

~~目前直接引入的是 `Physijs` 示例中的 `ammo.js`，有条件的可自行下载进行编译~~

---

`Oimojs` : https://github.com/lo-th/Oimo.js

引入方式同 `Threejs`

---

## 遇到的问题

1. ~~使用 `Physijs` 示例中的 `ammo.js` 开发工具可以正常模拟，手机预览会报错，暂时还没有进行适配~~

2. ~~`ammo.js` 的体积太大，而微信小游戏的包大小限制为 `4M` ，占用了 `1/3` 的大小 （`Threejs` 的占用大小约为 `600k`）~~

3. 使用 `Oimojs` 手机预览时，如果有 `console.log( OimoObject )` 类似操作，可能会造成无法渲染，解决办法就是删除这行调试代码

4. 微信小游戏离屏 `Canvas` 使用 `webgl` 存在 `bug` 无法渲染

5. 由于 `子域` 的限制，无法得知 `子域` 的状态，需要不停的更新渲染 `子域` 的内容，在绘制 `子域` 内容时会存在很大的性能消耗，掉帧严重

---

## 更新日志

### 2018年05月05日
```
> 移除 `Physijs` 和 `Ammojs` 改用 `Oimojs` 实现物理效果
```

### 2018年5月9日
```
> 修改绘图方式 
  # 上屏 `Canvas` 使用 `2d`
  # 离屏 `Canvas` 使用 `webgl`
  # 将离屏 `Canvas` 绘制到上屏 `Canvas` 中

> 增加子域排行榜示例
```

### 2018年05月13日
```
> 弃用离屏 `Canvas` 渲染 `webgl` ，改用新的解决方案，详见 `ui` 类
```

---

## LICENSE

The MIT License (MIT)

Copyright © 2018 stephenml(Stephen.Yang)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
