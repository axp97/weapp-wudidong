var dbJs = require("../../../../utils/db");
const app = getApp();
Page({
  data: {
    imgArr: [],
    content: undefined,
    typeArr: [],
    index: 0,
    subTypeId: undefined,
    inputValue: undefined,
    showModal: false,
  },

  onLoad(option) {
    let arr = JSON.parse(option.id);
    this.setData({
      typeArr: arr,
    });
    this.setData({
      subTypeId: arr[0]._id,
    });
  },

  uploadImg() {
    var that = this;
    var count = 3 - that.data.imgArr.length;
    wx.chooseImage({
      count: count,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        wx.showLoading({
          title: "上传中",
        });
        const filePathArr = res.tempFilePaths,
          cloudPathArr = [];
        let imgArr = that.data.imgArr;
        imgArr.push(...filePathArr);
        that.setData({
          imgArr,
        });
        filePathArr.forEach((filePath, i) => {
          cloudPathArr.push(count + "_" + i + filePath.match(/\.[^.]+?$/)[0]);
        });
        filePathArr.forEach((filePath, i) => {
          let cloudPath = cloudPathArr[i];
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            fail: (e) => {
              wx.showToast({
                icon: "none",
                title: "上传失败",
              });
            },
            complete: () => {
              count++;
              wx.hideLoading();
            },
          });
        });
      },
      fail: (e) => {},
    });
  },

  previewImg(e) {
    let current = e.currentTarget.dataset.url,
      urls = e.currentTarget.dataset.urls;
    wx.previewImage({
      current,
      urls,
    });
  },

  deleteImg(e) {
    let _index = e.currentTarget.dataset.index;
    let imgArr = this.data.imgArr;
    imgArr.splice(_index, 1);
    this.setData({
      imgArr,
    });
  },

  bindInput(e) {
    this.setData({
      content: e.detail.value,
    });
  },

  backPage() {
    wx.navigateBack({
      // delta: 2,
      complete: function (res) {
        console.log("backPage", res);
      },
    });
  },

  bindPickerChange(e) {
    let index = e.detail.value;
    this.setData({ index });
    this.setData({
      subTypeId: this.data.typeArr[index]._id, // 事件后触发获取的值
    });
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },
  // modal
  completeBtn() {
    this.setData({
      showModal: true,
    });
  },

  modalConfirm() {
    let param = {
      content: this.data.content,
      image_arr: this.data.imgArr,
      name: this.data.inputValue,
      type_id: this.data.subTypeId,
      release: new Date(),
      like_num: 0,
      reply_num: 0,
      gender: app.globalData.userInfo.gender,
    };
    dbJs.add("square_data", param).then((res) => {
      this.backPage();
    });
  },
});
