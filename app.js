
const rq = require('request-promise')
const cheerio = require('cheerio')

const mongoose = require('mongoose')

const { initSchema, connect } = require('./database/init')

const { getSaleListUrl} = require('./utils')


let obj = {}
let getListPage = async (url) => {
  try {
    const data = await rq({ url })
    const $ = cheerio.load(data)

    $('.esf_list li').map(async function () {
      let pageUrl = $(this).find('.esftu a').attr('href')
      pageUrl = `http://www.xinxianwang.com/${pageUrl}`
      let timer = null
      clearInterval(timer)
      timer = setInterval(async function () {
        await getDetail(pageUrl)

      }, 1000)
    })
  } catch (e) {
    console.log(e,'-------')
 }
  
}
  let getDetail = async (url) => {
    const data = await rq({ url })
    const $ = cheerio.load(data)
    obj.title = $('.d_main').find('h1').text()
    obj.createTime = $('.balefthead span').first().text().match(/(?<=发布时间：).+(?= 信息关注度)/)[0]
    obj.totalPrice = $('.xxshow dl dt').eq(0).next('dd').find('b').text()
    let res = $('.xxshow dl dt').eq(0).next('dd').text().match(/(?<=\().+(?=元)/)
    obj.averagePrice = res && res[0] || "面议"
     $('.xxshow dl dt').map(function () {
       let text = $(this).text()
       let next = $(this).next('dd').text().replace(/\s+/g, '')
      if (text == '房屋户型：') {
        let type = $(this).next('dd').text().replace(/\s+/g, '').split('-')
        obj.houseType = type[0] || ''
        obj.acreage = type[1] ||''
      } else if (text == '所在楼层：') {
        let floor = $(this).next('dd').text().replace(/\s+/g, '')
        if (!floor) {
          obj.floor = ''
          obj.totalFloor = ''
        } else {
          let fl = floor.split('/')
          obj.floor = fl[0]
          obj.totalFloor = fl[1]
        }
      } else if (text == '建筑年份：') {
        let year = $(this).next('dd').text().replace(/\s+/g, '')
        obj.year = year == '--' ? '' : year
      } else if (text == '房屋概况：') {
        if (!next) {
          obj.orientation = obj.decoration = ''
        } else {
          obj.decoration=next.split('-')[0]
          obj.orientation=next.split('-')[1]
        }
      } else if (text == '所在小区：') {
        obj.community = next || ''
      } else if (text == '所在地址：') {
        if (next) {
          obj.position = next.split('-')[1]
          obj.positionType = next.split('-')[0]
        } else {
          obj.position = obj.positionType= ''
        }
      } else if (text == '联 系 人：') {
        obj.linkman = next.split('(')[0] || ''
        let str = next.split('(')[1]
        obj.type = str.slice(0,2)
      } else if (text == '联系电话：') {
        obj.tel = next.match(/\w{11}/)[0]
      } 
       
     })
    
    obj.label = []
    
    $('.tese span').map(function () {
      obj.label.push($(this).text()) 
    })
    let btitle = $('.show-content').find('b').text().replace(/\s+/g, '')
    let content = $('.show-content p').eq(0).text().replace(/\s+/g, '')
    let imgs =[]
     $('.xxtup img').map(function () {
      imgs.push($(this).attr('src')) 
     })
    
    obj.content = {
      title: btitle,
      content,
      imgs
    }
    const houseModel = mongoose.model('house') 
    let result = await houseModel.findOne({ 'title': obj.title })
    if (!result) {
      let oneNew = new houseModel(obj)
      await oneNew.save()
      
    }
}


; (async () => {
  initSchema()
  await connect()
  let arr = getSaleListUrl(1, 10)
  arr.forEach(async item => {
    await getListPage(item)
  })
})()
