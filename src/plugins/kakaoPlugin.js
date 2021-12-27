const kakaoPlugin = {
    install(Vue, options = {}) {

        const initialized = () => {
            if (!window.Kakao) {
                return false
            }

            if (Object.keys(window.Kakao).length === 0) {
                return false
            }

            return window.Kakao.isInitialized()
        }

        const initializeScript = (scriptUrl, scriptId, apiKey) => {
            return new Promise(resolve => {
                const script = document.createElement('script')
                script.src = scriptUrl
                script.defer = true
                script.onload = () => {
                    if (!initialized()) {
                        window.Kakao.init(apiKey)
                    }

                    resolve()
                }

                script.onerror = error => this.handleError(error)
                script.id = scriptId
                document.body.appendChild(script)
            })
        }

        let { apiKey, scriptUrl, scriptId, callback } = options
        scriptUrl = scriptUrl || 'https://developers.kakao.com/sdk/js/kakao.min.js'
        scriptId = scriptId || 'kakao_script'
        callback = callback || null

        if (!apiKey) {
            throw Error(`'apiKey' 옵션 값이 없습니다.`)
        }

        const initializedScript = initialized()

        if (!initializedScript) {
            initializeScript(scriptUrl, scriptId, apiKey)
                .then(() => {
                    if (typeof callback === 'function') {
                        callback()
                    }
                })
                .finally(() => {
                    Vue.prototype.$kakao = window.Kakao
                })
        }
    },
}

export default kakaoPlugin