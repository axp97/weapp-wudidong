//index.js
var dbJs = require("../../utils/db.js");
var toolJs = require("../../utils/tool.js");
const _ = dbJs.db.command;
const app = getApp();

Page({
  data: {
    currentType: undefined,
    currentSmallType: undefined,
    typeList: [],
    smallTypeList: [],
    dataList: [],
    showModal: false,
    subTypeName: undefined,
    subTypeColor: undefined,
    zanList: [],
  },
  // onshow  onLoad
  onLoad() {
    dbJs.query("square_type").then((res) => {
      let data = res.data,
        dataLen = data.length;
      this.setData({
        typeList: data,
      });
      this.setData({
        currentType: dataLen ? 0 : undefined,
      });
      if (!dataLen) return;
      this.getSubTypeList(data[0]._id);
    });
    this.getZanList();
  },

  onShow() {
    let smTypeIdx = this.data.currentSmallType;
    if (smTypeIdx == undefined) return;
    let id = this.data.smallTypeList[smTypeIdx]._id;
    this.getList(id);
  },

  getSubTypeList(_id) {
    dbJs.query("square_subtype", { type_id: _.eq(_id) }).then((res) => {
      let data = res.data,
        dataLen = data.length;
      this.setData({
        smallTypeList: data,
      });
      this.setData({
        currentSmallType: dataLen ? 0 : undefined,
      });
      if (!dataLen) return;
      this.getList(data[0]._id);
    });
  },

  getList(id) {
    dbJs.query("square_data", { type_id: _.eq(id) }).then((res) => {
      let data = res.data;
      if (!data.length) {
        this.setData({
          dataList: [],
        });
        return;
      }
      data.forEach((item, index) => {
        item.release = toolJs.formatTime(item.release);
        item.typeName = this.data.smallTypeList.find((st) => st._id == id).name;
        if (!this.data.zanList.length) {
          item.isLike = false;
          // this.setData({
          //   [this.data.dataList[index].isLike]: false,
          // });
          return;
        }
        let hasStatus = this.data.zanList.find(
          (zan) => zan.post_id == item._id
        );
        if (!hasStatus) {
          item.isLike = false;
          // this.setData({
          //   [this.data.dataList[index].isLike]: false,
          // });
          return;
        }
        item.isLike = !!hasStatus.status;
        // this.setData({
        //   [this.data.dataList[index].isLike]: !!hasStatus.status,
        // });
      });
      this.setData({
        dataList: data,
      });
    });
  },

  clickType(e) {
    let id = e.currentTarget.dataset["id"],
      idx = e.currentTarget.dataset["idx"];
    if (this.data.currentType === idx) {
      return false;
    }
    this.setData({
      currentType: idx,
    });
    this.getSubTypeList(id);
  },

  clickSmallType(e) {
    let id = e.currentTarget.dataset["id"],
      idx = e.currentTarget.dataset["idx"];

    if (this.data.currentSmallType === idx) {
      return false;
    } else {
      this.setData({
        currentSmallType: idx,
      });
      this.getList(id);
    }
  },

  toDetailPage(event) {
    let postItem = event.currentTarget.dataset.postitem;
    wx.navigateTo({
      url: "subpage/detail/detail?id=" + JSON.stringify(postItem),
      complete: function (res) {},
    });
  },

  post() {
    wx.navigateTo({
      url: "subpage/post/post?id=" + JSON.stringify(this.data.smallTypeList),
      complete: function (res) {},
    });
  },

  async zan(e) {
    let post_id = e.currentTarget.dataset.postid,
      curStatus = e.currentTarget.dataset.status,
      index = e.currentTarget.dataset.index,
      user_id = wx.getStorageSync("openid") || (await app.getOpenid());
    dbJs.db
      .collection("square_data")
      .doc(post_id)
      .update({
        data: {
          like_num: _.inc(curStatus ? -1 : 1),
        },
      });
    let likeNum = this.data.dataList[index].like_num;
    this.setData({
      [`dataList[${index}].isLike`]: !curStatus,
      [`dataList[${index}].like_num`]: curStatus ? --likeNum : ++likeNum,
    });
    let param = {
      post_id,
      status: curStatus ? 0 : 1,
      type: 1,
      user_id,
    };

    if (!this.data.zanList.length) {
      dbJs.add("zan", param).then((res) => {
        this.getZanList();
      });
      return;
    }

    let hasStatus = this.data.zanList.find((zan) => zan.post_id == post_id);
    if (!hasStatus) {
      dbJs.add("zan", param).then((res) => {
        this.getZanList();
      });
      return;
    }
    let that = this;
    dbJs.db
      .collection("zan")
      .doc(hasStatus._id)
      .update({
        data: {
          status: curStatus ? 0 : 1,
        },
        complete(res) {
          that.getZanList();
        },
      });
  },

  async getZanList() {
    let user_id = wx.getStorageSync("openid") || (await app.getOpenid());
    dbJs.query("zan", { user_id }).then((res) => {
      this.setData({
        zanList: res.data,
      });
    });
  },

  // modal
  addSubType() {
    this.setData({
      showModal: true,
    });
  },

  modalConfirm() {
    let name = this.data.subTypeName,
      bg = this.data.subTypeColor;
    if (!name) return;
    let type_id = this.data.typeList[this.data.currentType]._id,
      param = {
        type_id,
        name,
        bg,
      };
    dbJs.add("square_subtype", param).then((res) => {
      this.getSubTypeList(type_id);
    });
    this.setData({
      showModal: false,
    });
  },

  saveSubTypeName(e) {
    this.setData({
      subTypeName: e.detail.value,
    });
  },

  saveSubTypeColor(e) {
    this.setData({
      subTypeColor: e.detail.value,
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
});
