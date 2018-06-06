//index.js
//获取应用实例
const app = getApp()

let QQMapWx = require('qqmap-wx-jssdk.js')
let map = new QQMapWx({
  key: "DVDBZ-KY6LK-QPIJF-ACQ4R-SIFLK-6RFKD"
})

// const weatherMap = {
//   "阴" : "",
//   "多云": "../../images/cloudy-bg.png",
//   "晴" : "sunny-bg.png",
//   "" : ""
// }

Page({
  data: {
    location: "上海",
    weatherPic: "../../images/cloudy-bg.png",
    temp: "17℃",
    detail:"晴天",
    weatherIcon: "../../images/晴.png",
    forecasts:[]
  },
  //事件处理函数
  onLoad: function () {
    wx.getLocation({
      success: res => {
        map.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            this.setData({
              location: res.result.address_component.city.replace("市", "")
            })
          },
          fail: function(){
            this.setData({
              location: "北京"
            })
          }
        })
      }
    })
    this.setTemp()
    this.setForecast()
  },
  setTemp: function(){
    wx.request({
      url: 'http://api.k780.com',
      data: {
        app: "weather.today",
        weaid: this.data.location,
        appkey: "34189",
        sign: "00a9dc0ce3a80506ee73f982df8b59db",
        format: "json"
      },
      success: res => {
        this.setData({
          temp: res.data.result.temp_curr + "℃",
          detail: res.data.result.weather_curr,
          weatherIcon: "../../images/" + res.data.result.weather_curr + ".png"
        })
      }
    })
  },
  setForecast: function(){
    wx.request({
      url: 'http://api.k780.com',
      data: {
        app: "weather.future",
        weaid: this.data.location,
        appkey: "34189",
        sign: "00a9dc0ce3a80506ee73f982df8b59db",
        format: "json"
      },
      success: res => {
        let arr = []
        res.data.result.forEach(function(item, index){
          let data = {
            date: index === 0?"今天":item.week,
            icon: "../../images/" + "晴" + ".png",
            temp: item.temperature.replace("/","~")
          }
          arr.push(data)
        })
        this.setData({
          forecasts: arr
        })
      }
    })
    console.log("ok")
  }
})
