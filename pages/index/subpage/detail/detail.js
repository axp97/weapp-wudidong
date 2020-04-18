Page({
  data: {
    detail: undefined,
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
});
