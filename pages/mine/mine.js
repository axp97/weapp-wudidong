// pages/mine/mine.js
let half;
let quarter;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    slideOffset: 0,
    headerList: ["消息", "罐头", "设置"],
    //setting
    head: {
      name: "我",
      rightIcon: "iconsetting"
    },
    grayHeight: 15,
    dataList: [
      { icon: "iconletter", name: "信件箱" },
      { icon: "iconfavorite", name: "收藏室" }
    ],
    aboutList: [
      { icon: "iconemail", name: "提建议" },
      { icon: "iconabout", name: "关于我们" }
    ]
    //
  },

  // swiper的滑动
  // 第二种方法是直接把slideOffset赋死值，但不兼容
  // 第三种是选择器 class="{{Changeline?'swiper_header_line_before':'swiper_header_line_after'}}" if current为1则什么什么，if 为2 ，则什么什么。
  changeline: function(e) {
    console.log("changeline", e);
    console.log(e.detail.current);
    let current = e.detail.current; //获取swiper的current值
    if (e.detail.current === 0) {
      this.setData({
        slideOffset: quarter - 14
      });
    }
    if (e.detail.current === 1) {
      this.setData({
        slideOffset: quarter - 14 + half
      });
    }
    if (e.detail.current === null) {
      this.setData({
        slideOffset: quarter - 14
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    // wx.getSystemInfo({
    //   success: function(res) {
    //     console.log(res.windowWidth);
    //     console.log(res.windowWidth / 2 / 2);
    //     half = res.windowWidth / 2;
    //     quarter = res.windowWidth / 2 / 2;
    //     that.setData({
    //       slideOffset: quarter - 14 //onLoad的时候让 quarter - 14 给slideOffset，即一开始就让他在个性推荐的下面，否则onLoad的时候一开始在0的位置
    //     });
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
