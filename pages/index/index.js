//index.js
var dbJs = require("../../utils/db.js");
var toolJs = require("../../utils/tool.js");
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
            data.data.forEach((data) => {
                data.release = toolJs.formatTime(data.release);
                data.typeName = this.data.smallTypeList.find(
                    (st) => st.id == id
                ).name;
            });
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

    onTapdetail(event) {
        let postItem = event.currentTarget.dataset.postitem;
        console.log(postItem);
        // url: "subpage/detail/detail?id=" + postItem,
        wx.navigateTo({
            url: "subpage/detail/detail?id=" + JSON.stringify(postItem),
            complete: function (res) {
                console.log("complete", res);
            },
        });
    },
    post() {
        wx.navigateTo({
            url: "subpage/post/post",
            complete: function (res) {
                console.log("/post/post", res);
            },
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
