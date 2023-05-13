module.exports = {
    devServer: function(configFunction) {
        return function(proxy, allowedHost) {
            const config = configFunction(proxy, allowedHost)
            config.headers = {
                'Cross-Origin-Embedder-Policy': 'require-corp',
                'Cross-Origin-Opener-Policy': 'same-origin'
            }
            return config
        }
    }
}