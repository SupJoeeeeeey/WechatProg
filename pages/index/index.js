//index.js
//获取应用实例
const app = getApp()

let QQMapWx = require('qqmap-wx-jssdk.js')
let map = new QQMapWx({
  key: "DVDBZ-KY6LK-QPIJF-ACQ4R-SIFLK-6RFKD"
})

const weatherMap = {
  "阴" : "阴背景",
  "多云": "多云背景",
  "晴" : "晴背景",
  "雾": "阴背景",
  "浓雾": "阴背景",
  "强浓雾": "阴背景",
  "特强浓雾": "阴背景",
  "霾": "阴背景",
  "中度霾": "阴背景",
  "重度霾": "阴背景",
  "严重霾": "阴背景",
  "浮尘": "阴背景",
  "扬沙": "阴背景",
  "沙尘暴": "阴背景",
  "特强浓雾": "阴背景",
  "小雨": "小雨背景",
  "阵雨": "小雨背景",
  "冻雨": "小雨背景",
  "雷阵雨": "暴雨背景",
  "暴雨": "暴雨背景",
  "中雨": "暴雨背景",
  "大雨": "暴雨背景",
  "大暴雨": "暴雨背景",
  "特大暴雨": "暴雨背景",
  "小雪": "雪背景",
  "雨夹雪": "雪背景",
  "阵雪": "雪背景",
  "中雪": "雪背景",
  "暴雪": "雪背景"
}

Page({
  data: {
    location: "上海",
    weatherPic: "../../images/晴背景.png",
    temp: "17℃",
    detail:"晴天",
    weatherIcon: "../../images/晴.png",
    forecasts:[]
  },
  //事件处理函数
  onLoad: function () {
    wx.getLocation({
      success: res => {
        console.log(res)
        map.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            console.log(res)
            this.setData({
              location: res.result.address_component.city.replace("市", "")
            })
            this.setTemp()
          },
          fail: function(){
            this.setData({
              location: "北京"
            })
          }
        })
      },
      fail: function(){
        console.log("get location failed.")
      }
    })
  },
  onPullDownRefresh: function(){
    this.setTemp(function(){
      wx.stopPullDownRefresh()
    })
  },
  setTemp: function(cb){
    wx.request({
      url: 'https://supjoey.xyz/weather',
      data: {
        location:this.data.location
      },
      success: res => {
        console.log(res)
        let weather = weatherMap[res.data.result.weather_curr]
        console.log(weather)
        if(weather === null || weather === ""){
          weather = "晴背景"
        } 
        this.setData({
          temp: res.data.result.temp_curr + "℃",
          detail: res.data.result.weather_curr,
          weatherIcon: "../../images/" + res.data.result.weather_curr + ".png",
          weatherPic: "../../images/" + weather + ".png"
        })
        this.setForecast(cb)
      },
      fail: function(){
        console.log("failed")
      }
    })
  },
  setForecast: function(cb){
    wx.request({
      url: 'https://supjoey.xyz/futureweather',
      data: {
        location: this.data.location
      },
      success: res => {
        console.log(res)
        let arr = []
        res.data.result.forEach(function(item, index){
          let data = {
            date: index === 0?"今天":item.week,
            icon: "../../images/" + item.weather.split("转")[0] + ".png",
            temp: item.temperature.replace("/","~")
          }
          arr.push(data)
        })
        this.setData({
          forecasts: arr
        })
        if(cb){
          cb()
        }
      }
    })
  }
})
