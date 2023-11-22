const adicionar_carrinho = document.querySelectorAll(".adicionar_ao_carrinho")

adicionar_carrinho.forEach((botao) => {
    botao.addEventListener("click", () => {
      const nome = botao.getAttribute("data_nome")
      const qtde = Number(botao.getAttribute("data_qtde"))
      const preco = Number(botao.getAttribute("data_preco"))
      const cod_prod = Number(botao.getAttribute("cod_prod"))
      const item = { cod_produto, nome_produto, qtde_estoque, preco };

      const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

      carrinho.push(item)
      console.log(carrinho)

      localStorage.setItem("carrinho", JSON.stringify(carrinho))

      const carrinho_icone = document.getElementById("carrinho_icon")
      carrinho_icone.src = "../img/carrinho.png"
    })
})
