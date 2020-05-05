// pages/mine/mine.js
// let half;
// let quarter;
var dbJs = require("../../utils/db");
const app = getApp();
Page({
  data: {
    // slideOffset: 0,
    // headerList: ["消息", "罐头", "设置"],
    // //setting
    // head: {
    //   name: "我",
    //   rightIcon: "setting",
    // },
    // grayHeight: 15,
    // dataList: [
    //   { icon: "letter", name: "信件箱" },
    //   { icon: "favorite", name: "收藏室" },
    // ],
    // aboutList: [
    //   { icon: "email", name: "提建议" },
    //   { icon: "about", name: "关于我们" },
    // ],
    userInfo: {
      nickname: undefined,
      gender: undefined,
    },
  },

  onLoad: function () {
    this.getUserInfo();
  },

  getUserInfo() {
    let globalUserInfo = app.globalData.userInfo;
    // if (!globalUserInfo) return;
    this.setData({
      userInfo: {
        nickname: globalUserInfo.nickname,
        gender: globalUserInfo.gender,
      },
    });
  },

  saveNickname(e) {
    this.setData({
      [`userInfo.nickname`]: e.detail.value,
    });
  },

  saveGender(e) {
    console.log("saveGender", e.detail.value);
    return;
    this.setData({
      [`userInfo.gender`]: e.detail.value,
    });
  },

  setUser() {
    console.log("setUser", this.data.userInfo);
    // return;
    let user_id = app.globalData.openId;

    console.log("user_id", user_id);
    console.log("user_id", this.data.userInfo.nickname);

    dbJs.db
      .collection("user")
      .doc(user_id)
      .update({
        data: {
          nickname: this.data.userInfo.nickname,
        },
        complete(res) {
          console.log("complete", res);
        },
        success(res) {
          app.globalData.nickname = this.data.userInfo.nickname;
        },
      });
  },

  // swiper的滑动
  // 第二种方法是直接把slideOffset赋死值，但不兼容
  // 第三种是选择器 class="{{Changeline?'swiper_header_line_before':'swiper_header_line_after'}}" if current为1则什么什么，if 为2 ，则什么什么。
  // changeline: function (e) {
  //   console.log("changeline", e);
  //   console.log(e.detail.current);
  //   let current = e.detail.current; //获取swiper的current值
  //   if (e.detail.current === 0) {
  //     this.setData({
  //       slideOffset: quarter - 14,
  //     });
  //   }
  //   if (e.detail.current === 1) {
  //     this.setData({
  //       slideOffset: quarter - 14 + half,
  //     });
  //   }
  //   if (e.detail.current === null) {
  //     this.setData({
  //       slideOffset: quarter - 14,
  //     });
  //   }
  // },
});
