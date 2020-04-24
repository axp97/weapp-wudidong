var dbJs = require("../../../../utils/db");
const app = getApp();
Page({
    data: {
        detail: undefined,
        releaseFocus: false,
        commentList: [],
        // content: undefined
    },

    onLoad: function (option) {
        let obj = JSON.parse(option.id);
        console.log("postItem", obj);
        this.setData({
            detail: obj,
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

    bindReply: function (e) {
        this.setData({
            releaseFocus: true,
        });
    },
    // comment
    async getZanList() {
        let user_id = wx.getStorageSync("openid") || (await app.getOpenid()),
            post_id = this.data.detail._id;
        dbJs.query("comment", { user_id, post_id }).then((res) => {
            this.setData({
                commentList: res.data,
            });
        });
    },

    zan(e) {
        
    },
});
