const dbJs = require("./db"),
  _ = dbJs.db.command,
  app = getApp();
var user_id = undefined;

async function getUserId() {
  // user_id = wx.getStorageSync("openid") || (await app.getOpenid());
  // return user_id;
  return app.globalData.openId;
}

async function getZanList() {
  return dbJs.query("zan", { user_id });
}

async function getCommentList(post_id) {
  return dbJs.query("comment", { user_id, post_id });
  // dbJs.query("comment", { user_id }).then((res) => {
  //   this.setData({
  //     commentList: res.data,
  //   });
  // });
}

// async
module.exports = {
  getZanList: getZanList,
  getUserId: getUserId,
  getCommentList: getCommentList,
  // thumbsUp: thumbsUp, //'对外方法名':'本地方法名'
  thumbsUp: async function (obj) {
    await getUserId();
    let post_id = obj.postId,
      curStatus = obj.status;
    dbJs.db
      .collection("square_data")
      .doc(post_id)
      .update({
        data: {
          like_num: _.inc(curStatus ? -1 : 1),
        },
        complete(res) {
          console.log("complete", res);
        },
      });

    getZanList().then((res) => {
      console.log("res", res);
      let zanList = res.data;
      hasStatus = zanList.find((zan) => zan.post_id == post_id);
      console.log("zanList", zanList);
      param = {
        post_id,
        status: curStatus ? 0 : 1,
        type: 1,
        user_id,
      };
      if (!hasStatus) {
        dbJs.add("zan", param).then((res) => {});
        return;
      }
      console.log("collection-zan", hasStatus);
      dbJs.db
        .collection("zan")
        .doc(hasStatus._id)
        .update({
          data: {
            status: curStatus ? 0 : 1,
          },
          complete(res) {
            console.log("complete-zan", res);
          },
        });
    });
  },

  commentReply: async function (param) {
    dbJs.add("comment", param).then((res) => {
      console.log("commentReply", res);
      let post_id = param.post_id;
      dbJs.db
        .collection("square_data")
        .doc(post_id)
        .update({
          data: {
            reply_num: _.inc(1),
          },
          complete(res) {
            console.log("complete", res);
          },
        });
    });
  },
};
