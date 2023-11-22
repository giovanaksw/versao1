const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')
const Produto = require('./models/Produto')

const PORT = 3000
const hostname = 'localhost'

let log = false
let usuario = ''
let tipo_usuario = ''
  
// -------

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
// -------
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

// -------

app.get('/', (req,res)=>{
    res.render('home', {log})
})

app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    const pesq = await Usuario.findOne({raw: true, where:{email:email}})
    console.log(pesq)
    if(pesq == null){
        console.log('Usuário não encontrado')        
        res.status(200).redirect('/')
    }else{
        bcrypt.compare(senha, pesq.senha, (err,resultado)=>{
           if(err){
                console.error('Erro ao comparar a senha',err)
                res.render('home', {log})
           }else if(resultado){
            console.log('Cliente existente')
            log = true
            res.render('home', {log, nome: pesq.nome})
           }else{
            console.log('senha incorreta')
            res.render('home', {log})
           }
        })
    }
})

app.get('/login', (req,res)=>{
    res.render('login', {log})
})

app.get('/logout', (req,res)=>{
    log = false
    res.render('home', {log})
})


app.get('/carrinho', (req,res)=>{
    res.render('carrinho', {log, usuario, tipoUsuario})
})

// ----- adm
app.post('/cadastro', async(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const senha = req.body.senha

    console.log(nome,email,telefone,senha)

    bcrypt.hash(senha, 10, async (err,hash)=>{
        if(err){
            console.error('Erro ao criar o hash da senha'+err)
            res.render('home', {log})
            return
        }
        try{
            await Usuario.create({nome: nome, email: email, telefone: telefone, senha: hash})
            console.log('\n')
            console.log('Senha criptografada')
            console.log('\n')

            log = true

            const pesq = await Usuario.findOne({ raw: true, where:{ nome:nome, senha: hash}})
            console.log(pesq)

            res.render('home', {log})
        }catch(error){
            console.error('Erro ao criar a senha',error)
            res.render('home', {log})
        }
    })
})
app.get('/cadastro', (req,res)=>{
    res.render('cadastro', {log})
})


app.post('/editarProduto', async (req,res)=>{
    const nome = req.body.nome
    const tamanho = Number(req.body.tamanho)
    const cor = req.body.cor
    const tipo = req.body.tipo
    const quantidadeEstoque = Number(req.body.quantidadeEstoque)
    const precoUnitario = Number(req.body.precoUnitario)
    const descricao = req.body.descricao
    console.log(nome,tamanho, cor, tipo, quantidadeEstoque, precoUnitario, descricao)
    const dados = await Produto.findOne({raw:true, where: {nome:nome_produto}})
    console.log(dados)
    res.redirect('/editarProduto')

})
app.get('/editarProduto', (req,res)=>{
    res.render('editarProduto', {log, usuario, tipoUsuario})
})



// ------
conn.sync().then(()=>{
    app.listen(PORT,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro ao rodar servidor' + error)
})