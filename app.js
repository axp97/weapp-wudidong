var dbJs = null;
//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
      return;
    }
    wx.cloud.init({
      // env 参数说明：
      //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
      //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
      //   如不填则使用默认环境（第一个创建的环境）
      env: "axp-hvv6s",
      traceUser: true,
    });
    dbJs = require("./utils/db");
    this.globalData = {
      openId: null,
      userInfo: null,
    };

    this.getOpenid();
  },

  getOpenid: async function () {
    let res = await wx.cloud.callFunction({ name: "login" }),
      openId = res.result.openid;
    this.globalData.openId = openId;
    wx.setStorageSync("openid", openId);
    this.getUserInfo(openId);
    return openId;
  },

  getUserInfo(openid) {
    dbJs.query("user", { user_id: openid }).then((res) => {
      let data = res.data;
      if (data.length) {
        this.globalData.userInfo = data[0];
      } else {
        this.setMockUser(openid);
      }
    });
  },

  setMockUser(openid) {
    const nicknameArr = ["阿白", "欢乐猫", "神经蛙", "momo", "夏至"],
      genderArr = [0, 1];
    let param = {
      name: "name没有用",
      nickname: nicknameArr[this.getRandomInt(5)],
      gender: genderArr[this.getRandomInt(2)],
      user_id: openid,
    };
    dbJs.add("user", param).then((res) => {
      this.globalData.userInfo = param;
    });
  },

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  },
});
