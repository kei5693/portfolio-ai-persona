const KEYS = {
  token: 'token',
  globalData: 'globalData',
  templates: 'templates',
  preRouterName: 'preRouterName',
}

const get = (key, defaultValue = '') => {
  let result = window.sessionStorage.getItem(key)
  return result === null ? defaultValue : result
}

const save = (key, value) => {
  window.sessionStorage.setItem(key, value)
}

const clear = () => {
  window.sessionStorage.clear()
}

const getToken = () => {
  return get(KEYS.token, null)
}

const saveToken = (value) => {
  save(KEYS.token, value)
}

const getGlobalData = () => {
  return get(KEYS.globalData, null)
}

const saveGlobalData = (value) => {
  save(KEYS.globalData, value)
}

/**
 * 템플릿 정보 가져오기
 * 
 * @param {Number} templateKey 템플릿 키
 * @return {Object} result 템플릿 정보
 */
const getTemplate = (templateKey) => {
  const strTemplates = get(KEYS.templates, null)

  if (template === null) {
    return undefined
  }

  const templates = JSON.parse(strTemplates)
  const template = templates.filter(o => o.key === templateKey)

  return template.length === 0 ? undefined : template[0]
}

/**
 * 템플릿 저장
 * 
 * @param {Array} value 템플릿 배열
 */
const saveTemplate = (value) => {
  save(KEYS.templates, JSON.stringify(value))
}

const savePreRouterName = (value) => {
  save(KEYS.preRouterName, value)
}

const getPreRouterName = () => {
  return get(KEYS.preRouterName, '')
}

export default { get, save, clear, getToken, saveToken, getGlobalData, saveGlobalData, saveTemplate, getTemplate, savePreRouterName, getPreRouterName, KEYS }
