// 设备屏幕宽高
let width = wx.getSystemInfoSync().screenWidth
let height = wx.getSystemInfoSync().screenHeight
// 设备像素比
let ratio = wx.getSystemInfoSync().pixelRatio

// 子域Canvas
let sharedCanvas = wx.getSharedCanvas()
let cvs = sharedCanvas.getContext('2d')

// 排行榜详细
let itemCanvas = wx.createCanvas()
let ctx = itemCanvas.getContext('2d')

// 排行榜绘制状态
let rankingStatus = false

/**
 * 初始化外框
 */
function initFrame(type) {
  // 还原画布状态
  cvs.restore()

  // 保存画布状态
  cvs.save()

  // 清除画布
  cvs.clearRect(0, 0, width * ratio, height * ratio)

  // 缩放到像素比 使之高清
  cvs.scale(ratio, ratio)

  // 背景
  cvs.fillStyle = 'rgba(204, 204, 204, 0.5)'
  cvs.fillRect(0, 0, width * ratio, height * ratio)

  // 缩放到750 * 1334比例
  let scales = width / 750
  cvs.scale(scales, scales)

  // 标题
  cvs.fillStyle = '#FFFFFF'
  cvs.font = 'bold 50px Arial'
  cvs.textAlign = 'center'
  cvs.fillText(type === 1 ? '好友排行榜' : '群排行榜', 750 / 2, 220)

  // 排名列表外框
  cvs.fillStyle = '#302F30'
  cvs.fillRect(80, 290, 750 - 80 * 2, 650)

  // 排行榜提示
  cvs.fillStyle = '#8D8D8D'
  cvs.font = '20px Arial'
  cvs.textAlign = 'left'
  cvs.fillText('每周一凌晨刷新', 100, 330)

  // 自己排名外框
  cvs.fillStyle = '#302F30'
  cvs.fillRect(80, 960, 750 - 80 * 2, 120)

  // 返回按钮
  let returnImage = wx.createImage()
  returnImage.src = 'images/return.png'
  returnImage.onload = () => {
    cvs.drawImage(returnImage, 80, 1120, 100, 100)
  }
}

/**
 * 初始化排行榜详细
 */
function initRankingItems(items) {
  // 最少绘制6个详细项
  let length = items && items.length > 6 ? items.length : 6

  // 每项高度
  let itemHeight = 590 / 6

  // 设置排行榜详细的宽高 基于外框绘制
  itemCanvas.width = 750 - 80 * 2
  itemCanvas.height = itemHeight * length

  // 清除画布
  ctx.clearRect(0, 0, itemCanvas.width, itemCanvas.height)

  // 先绘制网格
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = '#393739'
    } else {
      ctx.fillStyle = '#302F30'
    }
    ctx.fillRect(0, i * itemHeight, 750 - 80 * 2, itemHeight)
  }

  if (items) {
    // 绘制详细内容
    items.map((item, index) => {
      drawRankingNum(index, index * itemHeight)
      drawHead(item['avatarUrl'], index * itemHeight)
      drawNickName(item['nickName'], index * itemHeight)
      drawScore(item['score'], index * itemHeight)
    })

    // 绘制排行榜详细到子域
    drawRankingItems(0)

    // 排行榜绘制完成
    rankingStatus = true
  } else {
    console.error('未找到排行榜数据')
  }
 
}

/**
 * 初始化自己的排行
 */
function initOwnRanking(own) {
  if (own) {
    // 名次
    let rankingNum = own['ranking']
    let image = wx.createImage()
    image.onload = () => {
      cvs.drawImage(image, 100, 990, 60, 60)
    }
    // 名次从0开始
    switch (rankingNum) {
      case 0:
        image.src = 'images/first.png'
        break
      case 1:
        image.src = 'images/second.png'
        break
      case 2:
        image.src = 'images/third.png'
        break
      default:
        cvs.fillStyle = '#FFFFFF'
        cvs.font = 'italic 45px Arial'
        cvs.textAlign = 'center'
        cvs.fillText(rankingNum + 1, 126, 1035)
    }

    // 头像
    let headImage = wx.createImage()
    headImage.src = own['avatarUrl']
    headImage.onload = () => {
      cvs.drawImage(headImage, 180, 985, 70, 70)
    }

    // 昵称
    cvs.fillStyle = '#FFFFFF'
    cvs.font = '28px Arial'
    cvs.textAlign = 'left'
    cvs.fillText(own['nickName'], 270, 1030)

    // 分数
    cvs.fillStyle = '#FFFFFF'
    cvs.font = 'bold 36px Arial'
    cvs.textAlign = 'right'
    cvs.fillText(own['score'], 630, 1032)
  } else {
    console.error('未找到当前用户数据')
  }

}

/**
 * 绘制名次
 */
function drawRankingNum(num, y) {
  let image = wx.createImage()
  image.onload = () => {
    ctx.drawImage(image, 20, y + 20, 60, 60)
    drawRankingItems(0)
  }
  // 名次从0开始
  switch (num) {
    case 0:
      image.src = 'images/first.png'
      break
    case 1:
      image.src = 'images/second.png'
      break
    case 2:
      image.src = 'images/third.png'
      break
    default:
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'italic 45px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(num + 1, 46, y + 62)
  }
}

/**
 * 绘制头像
 */
function drawHead(url, y) {
  let image = wx.createImage()
  image.src = url
  image.onload = () => {
    ctx.drawImage(image, 100, y + 15, 70, 70)
    drawRankingItems(0)
  }
}

/**
 * 绘制昵称
 */
function drawNickName(nickName, y) {
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '28px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(nickName, 190, y + 58)
}

/**
 * 绘制分数
 */
function drawScore(score, y) {
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'right'
  ctx.fillText(score, 550, y + 60)
}

/**
 * 绘制排行榜详细
 */
function drawRankingItems(y) {
  // 清除画布
  cvs.clearRect(80, 350, 750 - 80 * 2, 590)

  // 排名列表背景
  cvs.fillStyle = '#302F30'
  cvs.fillRect(80, 350, 750 - 80 * 2, 590)

  // 绘制到子域
  cvs.drawImage(itemCanvas, 0, y, 750 - 80 * 2, 590, 80, 350, 750 - 80 * 2, 590)
}

/**
 * 获取好友排行榜
 */
function getFriendRanking(key, openId) {
  // 初始化外框
  initFrame(1)
  // 获取好友数据
  wx.getFriendCloudStorage({
    keyList: [key],
    success: result => {
      if (result['data'].length !== 0) {
        let gameData = groupGameData(result['data'], key, openId)
        initRankingItems(gameData['ranking'])
        initOwnRanking(gameData['own'])
      } else {
        console.error('无数据记录')
      }
    }
  })
}

/**
 * 分组游戏数据
 */
function groupGameData(data, key, openId) {
  let gameData = {}, array = []
  if (data[0]['KVDataList'].length !== 0) {
    data.map(item => {
      array.push({
        openId: item['openid'],
        avatarUrl: item['avatarUrl'],
        nickName: item['nickname'].length < 8 ? item['nickname'] : `${item['nickname'].substr(0, 6)}...`,
        score: item['KVDataList'][0]['value']
      })
    })

    // 排序
    array.sort((a, b) => {
      return a[key] < b[key]
    })
    gameData['ranking'] = array

    // 获取自己的排名
    for (let i = 0; i < array.length; i++) {
      let item = array[i]
      if (item['openId'] === openId) {
        item['ranking'] = i
        gameData['own'] = item
        break
      }
    }
  } else {
    console.error(`未找到 key: ${key} 的数据`)
  }

  return gameData
}

/**
 * 监听主域消息
 */
wx.onMessage(data => {
  switch (data['type']) {
    case 'friend':
      getFriendRanking(data['key'], data['openId'])
      break
  }
})

// 触摸开始位置和移动位置
let startY = undefined, moveY = 0

/**
 * 触摸移动事件
 */
wx.onTouchMove(event => {
  if (rankingStatus) {
    // 触摸移动位置
    let touche = event.touches[0]

    // 触摸移动第一次触发是记录开始位置 需要加上之前移动的位置
    if (startY === undefined) {
      startY = touche.clientY + moveY
    }
    // 当前移动的位置
    moveY = startY - touche.clientY

    // 绘制排行榜详细
    drawRankingItems(moveY)
  }
})

/**
 * 触摸移除事件
 */
wx.onTouchEnd(event => {
  if (rankingStatus) {
    // 开始位置置空
    startY = undefined
    // 触摸移除位置
    let touche = event.changedTouches[0]

    // 判断当前移动的位置
    if (moveY < 0) {
      // 到顶了
      moveY = 0
    } else if (moveY > itemCanvas.height - 590) {
      // 到底了
      moveY = itemCanvas.height - 590
    }

    // 绘制排行榜详细
    drawRankingItems(moveY)
  }
})
