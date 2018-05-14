import * as THREE from '../libs/threejs/three.min'
import * as OIMO from '../libs/threejs/plugins/oimo.min'

import Params from './params'

import '../libs/threejs/controls/OrbitControls'

// 网格数量
const length = 20

// 游戏参数
let GameParams = new Params()

let instance

/**
 * 统一游戏管理
 */
export default class Game {
  constructor(renderer) {
    if (instance) {
      return instance
    }
    instance = this

    // 渲染器
    this.renderer = renderer

    // 游戏场景  
    this.scene = new THREE.Scene()
    this.scene.add(new THREE.PointLight(0x8A8A8A))
    this.scene.add(new THREE.AmbientLight(0xFFFFFF))

    // 使用透视相机绘制3D
    this.camera = new THREE.PerspectiveCamera(75, GameParams.cameraAspect, .1, 10000)
    this.camera.position.z = 50
    this.camera.position.y = 20

    // 摄像机控制器
    // this.controls = new THREE.OrbitControls(this.camera)
    // this.controls.addEventListener('change', () => {
    //   this.renderer.render(this.scene, this.camera)
    // })

    // Oimo物理世界
    this.world = new OIMO.World({ worldscale: 1 })

    // 初始化
    this.boxs = []
    this.boxBodys = []
    this.models = []
    this.modelBodys = []

    this.initGame()
  }

  /**
   * 初始化游戏
   */
  initGame() {
    // 清除Oimo物理世界
    this.world.clear()

    // 加载材质贴图
    let metal_texture = new THREE.TextureLoader().load("images/metal.jpg")

    // 地面
    let ground_material = new THREE.MeshBasicMaterial({ map: metal_texture })
    this.ground = new THREE.Mesh(new THREE.BoxGeometry(30, 1, 30), ground_material)
    this.ground.receiveShadow = true
    this.ground.castShadow = true
    this.scene.add(this.ground)

    // 物理地面
    this.groundBody = this.world.add({
      size: [30, 1, 30],
      pos: [0, 0, 0],
      name: 'groundBody'
    })
  }

  /**
   * 创建网格
   */
  createMeshs() {
    return new Promise((resolve, reject) => {
      new THREE.JSONLoader().load('models/sphere.json',
        (geometry, materials) => {
          geometry.center()

          let wood_texture = new THREE.TextureLoader().load("images/wood.jpg")
          let cloth_texture = new THREE.TextureLoader().load("images/cloth.jpg")

          // 盒子材质
          let box_meterial = new THREE.MeshLambertMaterial({ map: wood_texture })
          // 模型材质
          let model_meterial = new THREE.MeshLambertMaterial({ map: cloth_texture })

          // 载入模型后再创建盒子
          // 创建盒子和模型
          for (let i = 0; i < length; i++) {
            // 创建盒子
            let box = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), box_meterial)
            box.position.y = 50 + i * 2
            box.receiveShadow = true
            box.castShadow = true
            this.scene.add(box)
            this.boxs.push(box)

            // 创建物理盒子
            let boxBody = this.world.add({
              type: 'box',
              move: true,
              size: [3, 3, 3],
              pos: [0, 50 + i * 2, 0],
              name: `boxBody${i}`
            })
            this.boxBodys.push(boxBody)

            // 创建模型
            let model = new THREE.Mesh(geometry, model_meterial)
            model.scale.set(2, 2, 2)
            model.position.y = 50 + i * 2
            model.receiveShadow = true
            model.castShadow = true
            this.scene.add(model)
            this.models.push(model)

            // 创建物理模型
            let modelBody = this.world.add({
              type: 'sphere',
              move: true,
              size: [2],
              pos: [0, 50 + i * 2, 0],
              name: `modelBody${i}`
            })
            this.modelBodys.push(modelBody)
          }

          resolve()
        },
        // 进度条 小游戏内无效
        xhr => {
          console.log(`${(xhr.loaded / xhr.total * 100)}% 已载入`)
        },
        // 载入出错
        error => {
          console.log(`载入出错: ${error}`)
          reject(error)
        }
      )
    })
  }

  /**
   * 更新游戏
   */
  update() {
    // 更新物理世界
    this.world.step()

    // 复制物理世界的位置到Threejs的网格上
    for (let i = 0; i < length; i++) {
      this.boxs[i].position.copy(this.boxBodys[i].getPosition())
      this.boxs[i].quaternion.copy(this.boxBodys[i].getQuaternion())

      this.models[i].position.copy(this.modelBodys[i].getPosition())
      this.models[i].quaternion.copy(this.modelBodys[i].getQuaternion())
    }

    // 碰撞检测
    // if (this.world.checkContact('boxBody', 'modelBody')) {
    //   console.log('contact...')
    // }
  }

  /**
   * 渲染游戏
   */
  render() {
    this.update()
    this.renderer.render(this.scene, this.camera)
  }
}
