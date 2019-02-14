require('dotenv').config()


const pgp = require('pg-promise')({
  capSQL: true,
  schema: process.env.DB_SCHEMA
})

const db = pgp(process.env.DATABASE_URL)

const table = process.env.DB_TABLE

module.exports.save = (payload) => {
    const columns = new pgp.helpers.ColumnSet(Object.keys(payload[0]), { table })
    const query = pgp.helpers.insert(payload, columns)
    return db.none(query)
}

module.exports.db = db
  

/*
1 criar conexao com o banco
2 um objeto de acordo com a tabela
3 dar um insert na tabela com esse novo objeto
4 expor em um rota de api o objto;
*/