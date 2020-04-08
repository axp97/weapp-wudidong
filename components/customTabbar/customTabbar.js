const config = require("./tabbarConfig.js");
Component({
  properties: {
    activeIndex: {
      type: Number,
      value: 1
    }
  },
  data: {
    data: config
  },
  created() {
    //进入页面时需要隐藏掉原有的tabbar
    wx.hideTabBar({ aniamtion: false });
  },
  methods: {
    //点击tag
    clickTag(e) {
      let index = e.currentTarget.dataset.index;
        console.log("clickTag", e.currentTarget.dataset);
        
      this.changeTag(index);
    },
    bindMiddleTab: function() {
      this.changeTag(1);
    },
    //tag方法
    changeTag(index) {
      //如果点击当前所在的项，不会跳转
      if (index == this.data.activeIndex) {
        return false;
      }
      console.log("activeIndex", this.data.activeIndex);
      // this.data.activeIndex = index;
      let pagePath = this.data.data.tabs[index].path;
      // 如果点击的为中间按钮则使用navigator方式跳转 其他页面使用switch
      wx.switchTab({
        url: pagePath
      });
      // if (index == 1) {
      //   wx.navigateTo({
      //     url: pagePath
      //   });
      // } else {
      //   wx.switchTab({
      //     url: pagePath
      //   });
      // }
    }
  }
});
