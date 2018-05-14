import * as THREE from '../libs/threejs/three.min'

import Params from './params'

// 游戏参数
let GameParams = new Params()

let instance

/**
 * 统一UI管理
 */
export default class UI {
  constructor(renderer) {
    if (instance) {
      return instance
    }
    instance = this

    // 渲染器
    this.renderer = renderer

    // UI场景
    this.scene = new THREE.Scene()

    // 使用正交相机绘制2D
    this.camera = new THREE.OrthographicCamera(GameParams.width / -2, GameParams.width / 2, GameParams.height / 2, GameParams.height / -2, 0, 10000)
    
    // 初始化排行榜
    this.initRanking()
  }

  /**
   * 初始化排行榜
   */
  initRanking() {
    // 开放域
    this.open = wx.getOpenDataContext()

    // 开放域canvas
    this.sharedCanvas = this.open.canvas
    // 缩放到像素比 使之高清
    this.sharedCanvas.width = GameParams.width * GameParams.ratio
    this.sharedCanvas.height = GameParams.height * GameParams.ratio

    this.rankingTexture = new THREE.CanvasTexture(this.sharedCanvas)
    // TODO 关键代码
    this.rankingTexture.minFilter = this.rankingTexture.magFilter = THREE.LinearFilter
    this.rankingTexture.needsUpdate = true

    let geometry = new THREE.PlaneGeometry(GameParams.width, GameParams.height)

    let material = new THREE.MeshBasicMaterial({ map: this.rankingTexture, transparent: true })

    this.ranking = new THREE.Mesh(geometry, material)
  }

  /**
   * 显示排行榜
   */
  showRanking() {
    this.open.postMessage({
      type: 'friend',
      key: 'score',
      openId: 'oyJjl5dYt5dB4-jS5ifbsbToVYZ0'
    })

    this.scene.add(this.ranking)
  }

  /**
   * 更新排行榜
   */
  updateRanking() {
    this.rankingTexture.needsUpdate = true
  }

  /**
   * 隐藏排行榜
   */
  hideRanking() {
    this.scene.remove(this.ranking)
  }

  /**
   * 渲染UI
   */
  render() {
    this.renderer.render(this.scene, this.camera)
  }
  
}
