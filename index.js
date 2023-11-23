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
app.post('/cadastrar_produto', async(req,res)=>{
    const nome_produto = req.body.nome_produto
    const cod_produto = Number(req.body.cod_produto)
    const modelo = req.body.modelo
    const marca = req.body.marca
    const tipo = req.body.tipo
    const qtde_estoque = Number(req.body.qtde_estoque)
    const preco = Number(req.body.preco)

    console.log(nome_produto,cod_produto,modelo,marca,tipo,qtde_estoque,preco)

    bcrypt.hash(senha, 10, async (err,hash)=>{
        if(err){
            console.error('Erro ao criar o hash da senha'+err)
            res.render('home', {log})
            return
        }
        try{
            await Usuario.create({nome_produto: nome_produto, cod_produto: cod_produto, modelo: modelo, marca: marca, tipo: tipo, qtde_estoque: qtde_estoque, preco: preco,  senha: hash})
            console.log('\n')
            console.log('Senha criptografada')
            console.log('\n')

            log = true

            const pesq = await Usuario.findOne({ raw: true, where:{ nome:nome_produto, senha: hash}})
            console.log(pesq)

            res.render('home', {log})
        }catch(error){
            console.error('Erro ao criar a senha'+ error)
            res.render('home', {log})
        }
    })
})
app.get('/cadastrar_produto', (req,res)=>{
    res.render('cadastrar_produto', {log})
})

app.post('/atualizar_produto', async (req,res)=>{
    //config atuais
    const nome_produto = req.body.nome_produto
    const cod_produto = req.body.cod_produto
    const qtde_estoque = req.body.qtde_estoque
    const cor = req.body.cor
    const tamanho = req.body.tamanho
    const preco = req.body.preco
    //novas config
    const novo_id = req.body.novo_id
    const novo_nome_produto = req.body.novo_nome_produto
    const novo_cod_produto = req.body.novo_cod_produto
    const novo_qtde_estoque = req.body.novo_qtde_estoque
    const novo_cor = req.body.novo_cor
    const novo_tamanho = req.body.novo_tamanho
    const novo_preco = req.body.novo_preco

    const pesq = await Produto.findOne({raw:true, where:{ nome_produto:nome_produto, cod_produto:cod_produto, qtde_estoque:qtde_estoque, cor:cor, tamanho:tamanho, preco:preco}})

    const dados = {
        nome_produto: novo_nome_produto,
        cod_produto: novo_cod_produto,
        qtde_estoque: novo_qtde_estoque,
        cor: novo_cor,
        tamanho: novo_tamanho,
        preco: novo_preco,
    }

    let msg = 'Dados não encontrados'
    let msg2 = 'Produto Atualizado!'
    log = true

    if(pesq==null){
        res.render('atualizar_produto', {log, adm, nomeAdm, msg})
    }else{
        await Produto.update(dados, {where:{nome_produto:pesq.nome_produto, cod_produto:pesq.cod_produto, qtde_estoque:pesq.qtde_estoque, cor:pesq.cor, tamanho:pesq.tamanho, preco:pesq.preco}})
        res.render('atualizar_produto', {log, adm, nomeAdm, msg2})
    }
})

app.get('/atualizar_produto', (req,res)=>{
    res.render('atualizar_produto', {log, adm, nomeAdm})
})

app.post('/consulta_produto', async (req, res)=>{
    const nome_produto = req.body.nome
    console.log(nome_produto)
    const dados = await Produto.findOne({raw:true, where: {nome:nome_produto}})
    console.log(dados)
    res.render('editarProduto',{log, usuario, tipoUsuario, valor:dados} )
})

app.get('/listar_produto', async (req,res)=>{
    const dados = await Produto.findAll({raw:true})
    console.log(dados)
    res.render('listar_produto', {log, usuario, tipoUsuario, valores:dados})
})

// ------
conn.sync().then(()=>{
    app.listen(PORT,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error)=>{
    console.error('Erro ao rodar servidor' + error)
})