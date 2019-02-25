
const axios = require("axios");

const DEP_URL = 'https://api.setters.co/api/v1/dashboards/prev-1/deputados/summary'
const POST_URL = 'https://api.setters.co/api/v1/dashboards/prev-1/deputados/'



const getDeputados = () => axios.get(DEP_URL).then(res => res.data)
const getPosts = (id) => axios.get(POST_URL + id + '/posts').then(res => res.data)


module.exports = {
    getDeputados,
    getPosts
}

