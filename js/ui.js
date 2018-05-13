import * as THREE from '../libs/threejs/three.min'

// 屏幕宽高
const winWidth = window.innerWidth
const winHeight = window.innerHeight
const cameraAspect = winWidth / winHeight

// 设备像素比
let ratio = window.devicePixelRatio

// 开放域
let open = wx.getOpenDataContext()

// 开放域canvas
let sharedCanvas = open.canvas
// 缩放到像素比 使之高清
sharedCanvas.width = winWidth * ratio
sharedCanvas.height = winHeight * ratio

let instance

/**
 * 统一UI管理
 */
export default class UI {
  constructor() {
    if (instance) {
      return instance
    }
    instance = this

    // UI场景
    this.scene = new THREE.Scene()
    // 使用正交相机绘制2D
    this.camera = new THREE.OrthographicCamera(winWidth / -2, winWidth / 2, winHeight / 2, winHeight / -2, 0, 10000)
    // 初始化排行榜
    this.initRanking()
  }

  /**
   * 初始化排行榜
   */
  initRanking() {
    this.rankingTexture = new THREE.CanvasTexture(sharedCanvas)
    // TODO 关键代码
    this.rankingTexture.minFilter = this.rankingTexture.magFilter = THREE.LinearFilter
    this.rankingTexture.needsUpdate = true

    let geometry = new THREE.PlaneGeometry(winWidth, winHeight)

    let material = new THREE.MeshBasicMaterial({ map: this.rankingTexture, transparent: true })

    this.ranking = new THREE.Mesh(geometry, material)
  }

  /**
   * 显示排行榜
   */
  showRanking() {
    open.postMessage({
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
  
}
