import axios from "axios";

/**
 * Adds interceptors to the different HTTP Get methods of javascript
 *
 * @param {Object} params
 * @param {() => Promise<string|undefined>} params.getFreshToken
 *        An async function that returns the latest valid Bearer token, refreshing it if needed.
 * @param {string|RegExp} [params.interceptorUrlRegex]
 *        A regex to test which URLs should have the Authorization header attached.
 *        Relative URLs always match.
 * @returns {void}
 */
function addInterceptor ({ getFreshToken, interceptorUrlRegex}) {
    axios.interceptors.request.use(
        async (config) => {
            const url = typeof config.url === "object" ? config.url.origin : config.url;

            const shouldAttach =
                !url?.startsWith("http") ||
                (interceptorUrlRegex && url?.match(interceptorUrlRegex));

            if(shouldAttach) {
                const token = await getFreshToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    (function (open) {
        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            const opened = open.call(this, method, url, ...rest);

            if (interceptorUrlRegex && this.responseURL?.match(interceptorUrlRegex)) {
                this.setRequestHeader("Authorization", `Bearer ${token}`);
            }
            return opened;
        };
    })(XMLHttpRequest.prototype.open);

    const {fetch: originalFetch} = window;

    window.fetch = async (resource, options = null) => {
        let newOptions = options || {};

        if (interceptorUrlRegex && resource?.match(interceptorUrlRegex)) {
            newOptions = {
                ...newOptions,
                credentials: "include"
            };
        }

        return originalFetch(resource, newOptions);
    };

}

export default {
    addInterceptor
};
