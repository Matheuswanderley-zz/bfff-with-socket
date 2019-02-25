const httpClient = require('../http-client')
const client = require('../redis')
const lodash = require('lodash')



const _setResultToCache = 
  result => {
    client.setex('deputados', 3600, JSON.stringify({ source: 'Redis Cache', ...result, }))
    return result
  }

const diff = (cached, apiResult) => {
  const mapCached = new Map()
  const mapApi = new Map()

  for (i in cached) {
    mapCached.set(cached[i].id, cached[i])
    
  }

  for (i in apiResult) {
    mapApi.set(apiResult[i].id, apiResult[i])
  }

  const payload = []
  


  for (i in apiResult) {  
    const cachedObj = mapCached.get(apiResult[i].id)
    const apiObj = mapApi.get(apiResult[i].id)
      if (cachedObj == null || cachedObj.favorabilidade !== apiObj.favorabilidade) {
        _setResultToCache(apiResult)
        payload.push(apiObj)
     }
    
  }
  _setResultToCache(payload)
  
  return payload
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

const getDeputados = () =>   httpClient.getDeputados()
      .then(result => _getDeputadosRedis()    
        .then(redisResult => diff(redisResult , result)))
        

module.exports = {
    getDeputados
    
}