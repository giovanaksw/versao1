const itens_carrinho = document.getElementById("itens_carrinho")
const qtde_total = document.getElementById("qtde_total")
const total_carrinho = document.getElementById("total_carrinho")
const limpar_carrinho_botao = document.getElementById("limpar_carrinho")


const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

carrinho.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `&nbsp;&nbsp;&nbsp;${item.nome} |  quantidade = ${item.qtde} | R$ ${item.preco}`
    itens_carrinho.appendChild(listItem);
})

const total = carrinho.reduce((total, item) => total + item.preco, 0)
const qtde_item = carrinho.reduce((total_item, item)=> total_item + item.qtde, 0)
qtde_total.textContent = qtde_item
total_carrinho.textContent = total.toFixed(2)

const carrinho_icone = document.getElementById("carrinho_icon")
carrinho_icone.src = "/img/carrinho.png"

limpar_carrinho_botao.addEventListener("click", () => {
    localStorage.removeItem("carrinho")

    const carrinho_icone = document.getElementById("carrinho_icon")
    carrinho_icone.src = "/img/carrinho.png"

    itens_carrinho.innerHTML = ""
    qtde_total.textContent = "0"
    total_carrinho.textContent = "0.00"
})

const botao_comprar = document.getElementById("botao_comprar")

botao_comprar.addEventListener("click", () => {
  const carrinho = JSON.parse(localStorage.getItem("carrinho"))
  console.log(carrinho)

  fetch('/comprar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carrinho),
  })
    .then((response) => response.json())
    .then((data) => {

      console.log(data.message)
      const mensagemCompra = document.getElementById("mensagem_compra")
      mensagemCompra.textContent = data.message;

      localStorage.removeItem("carrinho")
      itens_carrinho.innerHTML = ""
      qtde_total.textContent = "0"
      total_carrinho.textContent = "0.00"
    })
    .catch((error) => {
      console.error('Erro ao enviar dados do carrinho: ', error)
    })
})
