import jwt_decode from 'jwt-decode'
import StorageUtils from './storage-utils'

const EXCLUDE_PATHS = ['/']

const getToken = () => {
  const token = StorageUtils.getToken()
  return jwt_decode(token)
}

const getUserTypeKey = () => {
  const token = StorageUtils.getToken()
  const payload = jwt_decode(token)
  return payload.userTypeKey
}

const getUserKey = () => {
  try {
    const token = StorageUtils.getToken()
    const payload = jwt_decode(token)
    return payload.userKey
  } catch (error) {
    console.warn('[둘러보기 모드]토큰 정보가 존재하지 않아 사용자 키 0을 반환 합니다.')
    return 0
  }
}

const getUserName = () => {
  const token = StorageUtils.getToken()
  const payload = jwt_decode(token)
  return payload.userName
}

const verify = (routerPath) => {
  let errorMsg = ''

  return new Promise((resolve, reject) => {
    try {
      if (EXCLUDE_PATHS.includes(routerPath)) {
        resolve()
      } else {
        const token = StorageUtils.getToken()
        const payload = jwt_decode(token)
        const tokenUserId = payload.userId
        const tokenAuthLevel = payload.authLevel
        const expTime = payload.exp * 1000
        const nowTime = new Date().getTime()

        if (expTime < nowTime) {
          errorMsg = '만료된 정보 입니다. 로그인을 재시도해 주시기 바랍니다.'
          reject()
        } else if (tokenAuthLevel === '') {
          errorMsg = '접근 권한이 존재하지 않습니다.'
          reject()
        } else if (tokenUserId === '') {
          errorMsg = '사용자 정보가 존재하지 않습니다.'
          reject()
        } else {
          resolve()
        }
      }
    } catch (error) {
      errorMsg = '토큰 정보가 올바르지 않습니다. '
      reject()
    } finally {
      if (errorMsg !== '') {
        window.alert(errorMsg)
      }
    }
  })
}

export default { verify, getToken, getUserTypeKey, getUserKey, getUserName }