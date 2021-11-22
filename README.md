## Desafio Bagy
###Configuração inicial:

    $ git clone git@github.com:ssk4trio/desafio-bagy.git
    $ cd desafio-bagy
    $ npm install

###Inicial aplicação:

    $ npm start
###GraphQL Playground:
    http://localhost:4000
###Desenvolvimento de uma Api que faz registros de pedidos

CRUDs realizados
- Clientes
  - Nome
  - Email
  - CPF
  - Data de nascimento
    - Endereço
      - Rua
      - Bairro
      - Cidade
      - Estado
      - País
      - CEP
      - Número 

- Produtos
  - Nome
  - Imagem
  - Peso
  - Preço
  - Quantidade em estoque

- Pedidos
  - Produtos 
  - Data de criação
  - Parcelas
  - Comprador
  - Status
  
Mutation de criação de pedido:
- [X] Registrar a venda(criar pedido no banco de dados)
- [X] Remover quantidade de produtos em estoque
- [ ] Envio de email ao comprador - somente a configuração do email feita.

Faltantes: 
- [ ] Teste unitários

### Tecnlogias
- Apollo-Server
- GraphQL
- SQLite3
- Nodemailer