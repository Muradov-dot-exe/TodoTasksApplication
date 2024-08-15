import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_API_URL ?? ''}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(function (config) {
    let user = JSON.parse(sessionStorage.getItem('user'))

    if (user) {
        config.headers.Authorization = user.token
    }

    return config
})
export { axiosInstance }
