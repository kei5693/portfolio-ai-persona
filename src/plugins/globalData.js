import StorageUtils from '@/utils/storage-utils'

const globalData = {
  install(Vue, lodash) {
    const that = {
      getDataAll: () => {
        return Object.assign({}, JSON.parse(StorageUtils.getGlobalData()));
      },
      getData: (key) => {
        var tmpData = Object.assign({}, JSON.parse(StorageUtils.getGlobalData()));
        return lodash.get(tmpData, key);
      },
      setData: (key, value) => {
        var tmpData = Object.assign({}, JSON.parse(StorageUtils.getGlobalData()));
        var dataObj = lodash.set(tmpData, key, value);

        StorageUtils.saveGlobalData(JSON.stringify(dataObj));
        return dataObj;
      },
      setDataObj: (obj) => {
        var tmpData = Object.assign({}, JSON.parse(StorageUtils.getGlobalData()));
        Object.assign(tmpData, obj);
        StorageUtils.saveGlobalData(JSON.stringify(tmpData));
      }
    }

    Vue.prototype.$globalData = that;
  }
}

export default globalData