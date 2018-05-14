import * as THREE from '../libs/threejs/three.min'

import Params from './params'
import Game from './game'
import UI from './ui'

// 游戏参数
let GameParams = new Params()

// 网格数量
const length = 20

export default class Main {
  constructor() {
    // TODO 不加这一句打开可能会短暂黑屏
    // canvas.getContext('webgl')

    // 渲染器  
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
    this.renderer.shadowMap.enabled = true
    this.renderer.setSize(GameParams.width, GameParams.height)
    this.renderer.setClearColor(0xFFFFFF, 1)
    // 设置设备像素比达到抗锯齿效果
    this.renderer.setPixelRatio(GameParams.ratio)
    // 由于使用多个不同的摄像机 这里关闭自动清除
    this.renderer.autoClear = false

    this.Game = new Game(this.renderer)
    this.UI = new UI(this.renderer)

    // 显示排行榜
    this.UI.showRanking()

    // setTimeout(() => {
    //   this.UI.hideRanking()
    // }, 6000)

    setInterval(() => {
      this.UI.updateRanking()
    }, 2000)

    wx.onTouchMove(event => {
      this.UI.updateRanking()
    })

    wx.onTouchEnd(event => {
      this.UI.updateRanking()
    })

    // 创建网格
    this.Game.createMeshs().then(() => {
      this.loop()
    })
  }

  loop() {
    // 关闭了渲染器的自动清除 这里需要手动清除
    this.renderer.clear()
    
    // 渲染游戏场景
    this.Game.render()
    // 渲染UI
    this.UI.render()

    window.requestAnimationFrame(this.loop.bind(this), canvas)
  }
}