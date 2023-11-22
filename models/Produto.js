const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto',{
    nome_produto: {
        type: DataTypes.STRING(50) 
    },
    cod_produto:{
        type: DataTypes.INTEGER 
    },
    modelo:{
        type: DataTypes.STRING(30)
    },
    marca:{
        type: DataTypes.STRING(30)
    },
    tipo:{
        type: DataTypes.STRING(30)  // iniciante ou profissional
    },
    qtde_estoque: {
        type: DataTypes.INTEGER
    },
    preco: {
        type: DataTypes.FLOAT  
    }
},{
    createdAt: false,
    updatedAt: false
})

// Produto.sync({force:true})

module.exports = Produto