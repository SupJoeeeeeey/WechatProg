//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    location: "广州市",
    weatherPic: "../../images/cloudy-bg.png",
    temp: "17℃",
    detail:"晴天",
    weatherIcon: "../../images/sunny-icon.png"
  },
  //事件处理函数
  onLoad: function () {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      success: res=>{
        console.log(res.data.result)
      }
    })
  }
})
