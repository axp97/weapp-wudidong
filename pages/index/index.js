//index.js
var dbJs = require("../../utils/db.js");
var toolJs = require("../../utils/tool.js");
const _ = dbJs.db.command;

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
      data.forEach((item) => {
        item.release = toolJs.formatTime(item.release);
        item.typeName = this.data.smallTypeList.find((st) => st._id == id).name;
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
