const axios = require('axios')

exports.axiosInstanceFileUpload = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_API_URL_FILE_UPLOAD}`,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    timeout: 10000,
})
