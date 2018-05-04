import './js/libs/weapp-adapter/index'
import './js/libs/symbol'

// 没有物理引擎的Demo 可手机预览
import Main from './js/main'

new Main()

// 带有物理引擎的Demo 手机预览会报错 问题可能出在ammo.js中
// import MainPhysics from './js/main_physics'

// new MainPhysics()
