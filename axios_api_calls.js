const { default: axios } = require('axios');

// const params = {
//     authorization: 'apiKey ' + process.env.CRYPTO_COMPARE_API_KEY,
// };

const baseUrl = 'https://api.spoonacular.com';

const axios_get = (url) => {
    return axios.get(`${baseUrl}${url}`, {
        params: {
            apiKey: process.env.SPOONACULAR_API_KEY
        }
    });
};

const axios_post = (url, payload) => {
    return axios.post(`${baseUrl}${url}`, payload, {
        headers: headers,
    });
};

module.exports = {
    axios_get,
    axios_post,
};