Page({
  data: {
    detail: undefined,
  },
  onLoad: function (option) {
    let obj = JSON.parse(option.id);
    console.log('postItem', obj);
    this.setData({
      detail: obj,
    });
  },
});
