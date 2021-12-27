import router from '../router/index'
import store from '../store/index'
import axios from 'axios'
import StorageUtils from '@/utils/storage-utils'
// import TokenUtils from '@/utils/token-utils'

/**
 * ESS Http 플러그인
 * 
 * @method install
 */
const EssHttp = {
    install (Vue) {
        Vue.customAxios = axios.create({
            timeout: 90 * 1000
        })

        /**
         * 전달받은 Response의 Head, Body를 검사하는 함수
         * 
         * @method response
         * @param {Object} res Response 객체
         * @return {Object} result Promise 정보
         */
        Vue.response = (res) => {
            return new Promise((resolve, reject) => {
                console.log('Response Data: ', res)
                let responseData = res.data

                if (!responseData.success) {
                    reject(new Error(responseData.errMsg))
                }
                else {
                    resolve(responseData.body)
                }
            })
        }

        /**
         * AXIOS로 통신하는 함수
         * 
         * @param {String} paramUrl 전송 할 URL
         * @param {String} paramMethod 전송 할 메소드 타입(GET, POST, PUT, DELETE)
         * @param {Object} data 전송 할 POST 파라미터
         * @param {Object} params 전송 할 GET 파라미터
         * @return {Object} result Promise 정보
         */
        Vue.prototype.$connect = (paramUrl, paramMethod, data = {}, params = {}, headers = {}) => {
            return new Promise((resolve, reject) => {
                store.commit('startLoading')

                headers['x-token'] = StorageUtils.getToken()
                if (headers['x-token'] === null) delete headers['x-token']

                Vue.customAxios({
                    method: paramMethod,
                    url: `${store.state.domainUrl}${paramUrl}`,
                    data: data,
                    params: params,
                    headers: headers
                })
                    .then(res => {
                        resolve(res.data)
                        store.commit('stopLoading')
                    })
                    .catch(error => {
                        reject(new Error(error))
                        store.commit('stopLoading')

                        console.log(">>>> headers", paramUrl, headers, error.response, router.history.current.path)

                        let errorMsg = error

                        if (error.response !== undefined && error.response.status === 401) {
                            errorMsg = '사용자 토큰이 만료되었거나 접근 권한이 존재하지 않습니다. 로그인 후 다시 시도해 주시기 바랍니다.'

                            router.push({ path: `${router.history.current.path.startsWith('/fc') ? '/fc' : '/user'}/login` })
                        }
                        console.log('errorMsg', errorMsg)

                        if (error.response !== undefined && error.response.data !== undefined) {
                            const serverErrorMsg = error.response.data.errMsg
                            alert(serverErrorMsg !== undefined ? serverErrorMsg : '서버와 통신 중 오류가 발생하였습니다.')
                        } else {
                            alert('서버와 통신에 실패하였습니다.')
                        }
                    })
            })
        }
    }
}

export default EssHttp