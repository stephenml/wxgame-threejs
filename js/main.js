import * as THREE from 'libs/threejs/three.min'

import 'libs/threejs/controls/OrbitControls'

let ctx = canvas.getContext('webgl')

const winWidth = window.innerWidth
const winHeight = window.innerHeight
const cameraAspect = winWidth / winHeight

const bastUrl = 'https://raw.githubusercontent.com/stephenml/wegame-threejs/master/model'

export default class MainPhysics {
  constructor() {
    // 场景  
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.PointLight(0x8A8A8A))
    this.scene.add(new THREE.AmbientLight(0xFFFFFF))

    // 摄像机
    this.camera = new THREE.PerspectiveCamera(75, cameraAspect, .1, 1000)
    this.camera.position.z = 30
    this.camera.position.y = 20

    // 渲染器  
    this.renderer = new THREE.WebGLRenderer({ context: ctx, canvas: canvas })
    this.renderer.shadowMapEnabled = true
    this.renderer.setSize(winWidth, winHeight)
    this.renderer.setClearColor(0xFFFFFF, 1)
    // 抗锯齿
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.controls = new THREE.OrbitControls(this.camera)

    this.controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera)
    })

    this.start()
  }
  start() {
    // 加载材质贴图
    let metal_texture = new THREE.TextureLoader().load("images/metal.jpg")
    let wood_texture = new THREE.TextureLoader().load("images/wood.jpg")
    let cloth_texture = new THREE.TextureLoader().load("images/cloth.jpg")

    // 地面
    let ground_material = new THREE.MeshBasicMaterial({ map: metal_texture })
    this.ground = new THREE.Mesh(new THREE.BoxGeometry(30, 1, 30), ground_material, 0)
    this.ground.receiveShadow = true
    this.scene.add(this.ground)

    // 盒子
    let box_meterial = new THREE.MeshLambertMaterial({ map: wood_texture })
    this.box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), box_meterial)
    this.box.position.y = 15
    this.box.collisions = 0
    this.box.castShadow = true
    this.scene.add(this.box)

    // 载入json模型
    new THREE.JSONLoader().load(`${bastUrl}/sphere.json`,
      (geometry, materials) => {
        geometry.center()
        this.model_meterial = new THREE.MeshLambertMaterial({ map: cloth_texture })

        this.model = new THREE.Mesh(geometry, this.model_meterial)
        this.model.scale.set(2, 2, 2)
        this.model.position.y = 10
        this.model.collisions = 0
        this.model.castShadow = true
        this.scene.add(this.model)

        this.loop()
      },
      // 进度条 小游戏内无效
      (xhr) => {
        console.log(`${(xhr.loaded / xhr.total * 100)}% 已载入`)
      },
      // 载入出错
      (error) => {
        console.log(`载入出错: ${error}`)
      }
    )

  }
  loop() {
    this.box.rotation.z += .1
    this.model.rotation.y += .1
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.loop.bind(this), canvas)
  }
}