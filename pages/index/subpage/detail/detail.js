var dbJs = require("../../../../utils/db");
var commonJs = require("../../../../utils/common.js");
var toolJs = require("../../../../utils/tool.js");
const app = getApp();
Page({
  data: {
    detail: undefined,
    releaseFocus: false,
    commentList: [],
    comment: undefined,
    userId: undefined,
    showReply: false,
    replyParentId: null,
  },

  onLoad: function (option) {
    let obj = JSON.parse(option.id);
    console.log("postItem", obj);
    // obj.formatRelease0 = toolJs.formatTime(obj.release, true);
    this.setData({
      detail: obj,
    });
    this.getUserId();
    this.getCommentList(obj._id);
  },

  getCommentList() {
    // item.release = toolJs.formatTime(item.release);
    let postId = this.data.detail._id;
    console.log("getCommentList-postId", postId);

    commonJs.getCommentList(postId).then((res) => {
      let data = res.data.reverse();
      data.forEach((item) => {
        item.release = toolJs.formatTime(item.release);
        let parentId = item.parent_id;
        if (!parentId) return;
        let dataIdx = data.findIndex((x) => x._id == parentId);
        if (dataIdx == -1) return;
        let curArrItem = data[dataIdx];
        console.log("curArrItem", curArrItem);
        item.parent_nickname = curArrItem.nickname;
      });
      console.log("getCommentList", data);
      this.setData({
        commentList: data,
      });
    });
  },

  getUserId() {
    commonJs.getUserId().then((id) => {
      this.setData({
        userId: id,
      });
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

  // zan
  zan(e) {
    let index = e.currentTarget.dataset.index,
      likeNum = this.data.dataList[index].like_num,
      obj = {
        postId: e.currentTarget.dataset.postid,
        status: e.currentTarget.dataset.status,
        _id: e.currentTarget.dataset._id,
      };
    commonJs.thumbsUp(obj).then((res) => {
      console.log("thumbsUp", res);
      this.setData({
        [`detail.isLike`]: !obj.status,
        [`detail.like_num`]: obj.status ? --likeNum : ++likeNum,
      });
      //   this.getZanList();
    });
  },

  bindInput(e) {
    this.setData({
      comment: e.detail.value,
    });
  },

  sendComment() {
    let parentId = this.data.replyParentId;
    if (!this.data.comment) return;
    let param = {
      comment: this.data.comment,
      parent_id: parentId,
      post_id: this.data.detail._id,
      release: new Date(),
      type: 1,
      user_id: this.data.userId,
      nickname: app.globalData.userInfo.nickname,
      gender: app.globalData.userInfo.gender,
    };
    console.log("sendComment", param);
    commonJs.commentReply(param).then((res) => {
      if (!parentId) {
        this.setData({
          [`detail.reply_num`]: ++this.data.detail.reply_num,
        });
      }
      this.getCommentList();
      this.setData({
        replyParentId: null,
      });
      this.setData({
        showReply: false,
      });
    });
  },

  replyComment(e) {
    this.setData({
      replyParentId: e.currentTarget.dataset.id,
    });
    this.setData({
      showReply: true,
    });

    // let commentId = e.currentTarget.dataset.id;
    // this.sendComment(commentId);
  },

  clickComment() {
    this.setData({
      showReply: true,
    });
  },
});
