// 云db对象
const db = wx.cloud.database()

module.exports = {
  db: db,

  /**
   * 新增记录
   *
   * @param data 数据
   * @param collection 集合
   * @return {"_id": String, "errMsg": String}
   */
  add: function(data, collection) {
    return db.collection(collection).add({
      data: data
    })
  },

  /**
   * 查询记录
   * 
   * @param collection 集合
   * @param where 查询条件
   * @param skip 查询起始位置
   * @param limit 查询数量
   * @return {"data": Array, "errMsg": String}
   */
  query: function(collection, where, skip, limit) {
    where = where || {}
    skip = skip || 0
    limit = limit || 10
    return db.collection(collection)
      .where(where).orderBy('time', 'desc')
      .skip(skip).limit(limit).get()
  },

  /**
   * 查询记录数量
   *
   * @param collection 集合
   * @param where 查询条件
   * @return {"total": Number, "errMsg": String}
   */
  count: function(collection, where) {
    where = where || {}
    return db.collection(collection).where(where).count()
  },

  /**
   * 新增/全部更新文档
   *
   * @param collection 集合
   * @param doc 文档_id
   * @param data 数据
   * @return {"_id": String, "errMsg": String}
   */
  addDoc: function(collection, doc, data) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).set({
      data: data
    })
  },

  /**
   * 查询文档
   *
   * @param collection 集合
   * @param doc 文档_id
   * @return {"data": Object, "errMsg": String}
   */
  getDoc: function(collection, doc) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).get()
  },

  /**
   * 部分更新文档
   * 
   * @param collection 集合
   * @param doc 文档_id   
   * @param data 数据
   * @return {"stats": Object, "errMsg": String}
   */
  update: function(collection, doc, data) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).update({
      data: data
    })
  },
  // const update = (collection, _id, data) => {
  //   return new Promise((resolve, reject) => {
  //       if (!exist(collection)) {
  //           reject(401, resCode[401]);
  //       }
    
  //       db.collection(collection).doc(_id).update({
  //           data: data
  //       }).then(res => {
  //           resolve(res);
  //       }).catch((code, msg) => {
  //           reject(code, msg);
  //       });
  //   });
  // }

  /**
   * 删除文档
   *
   * @param collection 集合
   * @param doc 文档_id
   * @return {"stats": Object, "errMsg": String}
   */
  remove: function(collection, doc) {
    collection = collection || lovc
    return db.collection(collection).doc(doc).remove()
  }
}