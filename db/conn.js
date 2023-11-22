const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('ecommerce_gi','root','senai',{
    host: 'localhost',
    dialect: 'mysql',
})

// sequelize.authenticate().then(()=>{
//     console.log('Banco conectado')
// }).catch((error)=>{
//     console.error('Erro ao conectar o banco' + error)
// })

module.exports = sequelize