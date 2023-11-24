const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Usuario = db.define('usuario',{
    nome: {
        type: DataTypes.STRING(50) 
    },
    sobrenome: {
        type: DataTypes.STRING(50) 
    },
    email: {
        type: DataTypes.STRING(50)
    },    
    telefone: {
        type: DataTypes.STRING(20) 
    },
    cpf: {
        type: DataTypes.STRING(20)
    },
    senha: {
        type: DataTypes.STRING(255) 
    },
    tipo:{
        type: DataTypes.STRING(30) // cliente e admin
    }
},{
    createdAt: false,
    updatedAt: false
})

// Usuario.sync({force:true})

module.exports = Usuario