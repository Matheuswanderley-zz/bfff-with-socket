
const httpClient = require('../http-client')
const client = require('../redis')
const lodash = require('lodash')
const registerLog = require('../db/index').save


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
  const diffLog = []


  for (i in apiResult) {  
    const cachedObj = mapCached.get(apiResult[i].id)
    const apiObj = mapApi.get(apiResult[i].id)
    apiObj.oldFavorabilidade = null
    apiObj.changed = false
    if ( !cachedObj || cachedObj.favorabilidade !== apiObj.favorabilidade) {      
     apiObj.oldFavorabilidade = cachedObj ? cachedObj.favorabilidade : ''
      apiObj.changed = true
      diffLog.push({
        deputado_id: apiObj.id,
        old_favorabilidade: apiObj.oldFavorabilidade,
        favorabilidade: apiObj.favorabilidade
      })

    }
    payload.push(apiObj)
  }
  if (diffLog.length === 0) {
    return {}
  }
  registerLog(diffLog)
  .catch(err => console.log(err))
  
  _setResultToCache(payload)

  const countBy = (data, dimension) => {
    const totalGrouped = lodash.countBy(data, dimension)
    return lodash.chain(totalGrouped)
      .map((c, k) => {
        return { group: k, count: c }
      })
      .keyBy('group')
      .mapValues('count')
      .value()
  }

  const approvalProb = (summary, goal) => {
    const wieghts = {
      afavor: 1,
      concordante: .7,
      centro: .5,
      discordante: .2,
      contra: 0,
    }}

  
  const generateSummary = () =>{
    const goal = 308
    const congressmen = payload
    const summary = countBy(payload, 'favorabilidade')
    summary.probabilidade = approvalProb(summary, goal)
    summary.necessarios = Math.max(goal - (summary.afavor + summary.concordante), 0)
    return { summary, congressmen }
    
  }

  const response = {
    summary: generateSummary(payload),
    congressmen: payload
  }

  console.log('[SERVICE] DIFF count =', diffLog.length)
  return  response
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
      .then(result =>       
        _getDeputadosRedis()        
        .then(redisResult => diff(redisResult, result)))

module.exports = {
    getDeputados
    
}