let instance

/**
 * 统一参数管理
 */
export default class Params {
  constructor() {
    if (instance) {
      return instance
    }
    instance = this
    
    // 屏幕宽度
    this.width = window.innerWidth
    // 屏幕高度
    this.height = window.innerHeight
    // 相机比例
    this.cameraAspect = this.width / this.height
    // 设备像素比
    this.ratio = window.devicePixelRatio
  }
}
