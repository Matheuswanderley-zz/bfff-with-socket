
const axios = require("axios");

const DEP_URL = 'http://demo2585989.mockable.io/deputados'

const getDeputados = () => axios.get(DEP_URL).then(res => res.data)

module.exports = {
    getDeputados
}

