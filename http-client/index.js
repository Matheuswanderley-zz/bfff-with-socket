
const axios = require("axios");

const DEP_URL = 'http://demo2585989.mockable.io/deputados'

const POST_URL = 'http://demo4396522.mockable.io/'


const getDeputados = () => axios.get(DEP_URL).then(res => res.data)
const getPost = (id) => axios.get(POST_URL + id + 'posts').then(res => res.data)

module.exports = {
    getDeputados,
    getPost
}

