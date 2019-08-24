const mongoose = require('mongoose')
const Schema = mongoose.Schema
const houseSchema = new Schema({
  title: String,  //标题
  createTime: {   //发布时间
    type: Date,
    default: Date.now(),
  },
  totalPrice: { //总价
    type: String,
    default:''
  }, 
  averagePrice: { //均价
    type: String,
    default: ''
  },
  acreage: { // 面积
    type: String,
    default: ''
  }, 
  houseType: { //户型
    type: String,
    default: ''
  }, 
  type: { //个人1，中介2
    type: String,
    default: ''
  },  
  position: { //位置
    type: String,
    default: ''
  }, 
  positionType: { //类型：城关，乡镇
    type: String,
    default:''
  },
  community: { //小区
    type: String,
    default: ''
  }, 
  label: { //标签 
    type: Array,
    default: []
  },  
  // isNew: { //新房true，二手房false
  //   type: Boolean,
  //   default: false
  // }, 
  year: { // 房龄
    type: String,
    default: ''
  }, 
  floor: {  //楼层
    type: String,
    default: ''
  },
  totalFloor:  { //总楼层
    type: String,
    default: ''
  },
  decoration:  { // 装修
    type: String,
    default: ''
  },
  orientation: { //房屋朝向
    type: String,
    default: ''
  }, 
  shoufu:  { //首付
    type: String,
    default: ''
  },
  yuegong:  {
    type: String,
    default: ''
  },
  linkman:  { //联系人
    type: String,
    default: ''
  },
  tel:  {
    type: String,
    default: ''
  },
  content: {
    type: Object,
    default: null,
  },
})

mongoose.model('house', houseSchema)