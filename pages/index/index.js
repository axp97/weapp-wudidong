//index.js
var dbJs = require("../../utils/db.js");
const _ = dbJs.db.command;

Page({
  data: {
    currentType: 0,
    currentSmallType: 0,
    typeList: [],
    smallTypeList: [],
    dataList: [],
  },
  onLoad() {
    dbJs.query("square_type").then((data) => {
      this.setData({
        typeList: data.data,
      });
      if (!this.data.smallTypeList.length) {
        this.getEventList(data.data[0].id);
      }
    });
  },
  // onReady() {
  //   console.log("onReady----");
  //   if (!this.data.smallTypeList.length && this.data.typeList.length) {
  //     this.getEventList(this.data.typeList[0].id);
  //   }
  // },
  clickType(e) {
    let id = e.currentTarget.dataset["id"],
      idx = e.currentTarget.dataset["idx"];
    console.log("~~~~~~id", id);
    console.log("idx", idx);
    if (this.data.currentType === idx) {
      return false;
    } else {
      this.setData({
        currentType: idx,
      });
      this.getEventList(id);
    }
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
      this.getDataList(id);
    }
  },

  getDataList(id) {
    dbJs.query("square_data", { type_id: _.eq(id) }).then((data) => {
      this.setData({
        dataList: data.data,
      });
    });
  },

  getEventList(id) {
    dbJs.query("square_subtype", { type_id: _.eq(id) }).then((data) => {
      this.setData({
        smallTypeList: data.data,
      });
    });
  },

  // getEventList(id) {
  //   dbJs.query("square_subtype", { type_id: _.eq(id) }).then((data) => {
  //     this.setData(
  //       {
  //         smallTypeList: data.data,
  //       },
  //       () => this.getRandomColor()
  //     );
  //   });
  // },
  // 0406
  // getStyle(bg, isActive) {
  //   console.log(`getStyle: ${bg}-${isActive}`)
  //   return {
  //     background: `#${bg}`
  //   }

  // }
});
