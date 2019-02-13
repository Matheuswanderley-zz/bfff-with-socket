
const httpClient = require('../http-client')
const client = require('../redis')

const _setResultToCache = 
  result => {
    client.setex('deputados', 3600, JSON.stringify({ source: 'Redis Cache', ...result, }))
    return result
  }

const _diff = (cached, apiResult) => {
  const mapCached = new Map()
  const mapApi = new Map()

  for (i in cached) {
    mapCached.set(cached[i].id, cached[i])
  }

  for (i in apiResult) {
    mapApi.set(apiResult[i].id, apiResult[i])
  }

  const resultado = []

  for (i in apiResult) {
    const cachedObj = mapCached.get(apiResult[i].id)
    const apiObj = mapApi.get(apiResult[i].id)

    if (cachedObj == null || cachedObj.favorabilidade !== apiObj.favorabilidade) {
      _setResultToCache(apiResult)
      resultado.push(apiObj)
    }
  }

  console.log('[SERVICE] DIFF count =', resultado.length)
  const resultadoFormatado = {}
  resultado.forEach((v, i) => resultadoFormatado[''+i+''] = v)
  return resultadoFormatado
}

const _getDeputadosRedis = () => new Promise((resolve, reject) => {
  return client.get('deputados', (err, result) => {
        if (err) reject(err)
        else {
          console.log('[SERVICE] redis cached')
          resolve(JSON.parse(result))
        }
      })
})

const _getDiferencaDeputados = 
  result => 
    _getDeputadosRedis()
    .then(redisResult => _diff(redisResult, result))

const getDeputados = () =>
  httpClient.getDeputados()
    .then(_getDiferencaDeputados)

module.exports = {
    getDeputados 
}