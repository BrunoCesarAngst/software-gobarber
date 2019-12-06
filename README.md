# software-GoBarber
Um software de agendamento de beleza

Iniciando o projeto
``` bash
mkdir software-GoBarber
cd software-GoBarber
yarn init -y
yarn add express
yarn add sucrase nodemon -D
  # o sucrase é para trabalhar com sintaxe `import ... from '...';`.
  # Criamos uma propriedade um script para rodar comandos na minha aplicação, no arquivo package.json, após o MIT assim:
```
``` json
"scripts": {
    "dev": "nodemon src/server.js",
    "dev:debug": "nodemon --inspect src/server.js"
    // essa propriedade permite fazer debug no vscode, sem precisar reiniciar a plicação, configurando o aquivo launch.json como a seguir:
  },
```
``` bash
touch nodemon.json
```
```json
// arquivo nodemon.json
{
  "execMap": {
    "js": "node -r sucrase/register"
  }
}
```
```json
// arquivo launch.json
"configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Launch Program",
      "restart": true,
      "protocol": "inspector"
    }
  ]
```

Conceito de padronização de código
`mkdir src`
`cd src`
`touch app.js`
`touch server.js`
`touch routes.js`

Docker

Nome do container: database

Senha do banco de dados: docker

Quando for acessado localhost: 5432 da minha máquina, estaremos acessando a porta 5432 desse container

usando a imagem do Postgres 11
```docker
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11
```
Para visualizar os dados do Postgres eu uso o [Postbird](https://electronjs.org/apps/postbird)

No Postbird informo:

usuário: postgres

senha: docker

Clico em test connection se deu tudo certo clico em save & connect, clique em create database e dê um nome, nesse caso GoBarber!

``` docker
docker start database - para reiniciar o container
docker logs database - para observar algum possível erro
```
ESlint, Prettier & EditorConfig
``` bash
yarn add eslint -D # o lint verifica a aplicação de padrões
yarn eslint --init
# selecione as seguintes opções:
❯ To check syntax, find problems, and enforce code style
❯ JavaScript modules (import/export)
❯ None of these
  Does your project use TypeScript? No
❯◯ Node
❯ Use a popular style guide
❯ Airbnb: https://github.com/airbnb/javascript
❯ JavaScript
? Y
# delete o arquivo package-lock.json e rode yarn
yarn
# no arquivo setting.json inclua:
```
```json
"eslint.autoFixOnSave": true,
	"eslint.validate": [
		{
			"language": "javascript",
			"autoFix": true
		},
		{
			"language": "javascriptreact",
			"autoFix": true
		},
		{
			"language": "typescript",
			"autoFix": true
		},
		{
			"language": "typescriptreact",
			"autoFix": true
		}
  ],

```
``` js
// no arquivo gerado .eslintrc.js inclua

extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],

rules: {
    "prettier/prettier": "error",
    // quando existir o prettier retorna error.
    "class-methods-use-this": "off",
    // nem todo método dentro de uma class vai precisar do 'this'.
    "no-param-reassign": "off",
    // posso receber um parâmetro e fazer alterações no mesmo.
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    // estou dizendo que vou declarar essa variável, mesmo, não usando-a.
  },
```
``` bash
# instalo mais essas ferramentas que controlaram a estética do código.
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
touch .prettierrc.json
```
``` json
// no arquivo .prettierrc.json
{
  "singleQuote": true,
  "trailingComa": "es5"
}
```
```bash
yarn eslint --fix src --ext .js
```
## Configurando o Sequelize(ORM), estrutura de pastas e MVC

ORM (do inglês: Object-relational mapping) - Mapeamento objeto-relacional é uma técnica de desenvolvimento utilizada para reduzir a impedância da programação orientada aos objetos utilizando bancos de dados relacionais. As tabelas do banco de dados são representadas através de classes e os registros de cada tabela são representados como instâncias das classes correspondentes.
``` bash
# estrutura d pastas
~/../../src/
├── app
│   ├── controllers
│   └── models
├── app.js
├── config
│   └── database.js
├── database
│   └── migrations
├── routes.js
└── server.js

yarn add sequelize
yarn add sequelize-cli -D
yarn add pg pg-hstore

# migration de usuário
yarn sequelize migration:create --name=create-users
database
└── migrations
    └── 20191205214748-create-users.json
    # uma 'migration' para cada tabela

# após a criação da colunas das tabelas
yarn sequelize db:migrate # para criar a tabela dentro do banco de dados
# para fazer rollback enquanto estivermos desenvolvendo a 'feature'
yarn sequelize db:migrate:undo # para desfazer a última migration
yarn sequelize db:migrate:undo:all # para desfazer todas as migrations

# Criar o model de usuário
models
└── User.js

# Criando a conexão com a base de dados postgres, que carregue todas as models da nossa aplicação.
database
├── index.js # <- esse arquivo
└── migrations
    └── 20191205214748-create-users.js

# criação e registro de usuários dentro da nossa API
controllers
└── UserController.js

# Gerando hash da senha no arquivo User.js
yarn add bcryptjs
```
## Autenticação JWT
```bash
# uma nova entidade um novo controller
controllers
├── SessionController.js # criamos esse arquivo

yarn add jsonwebtoken
```

Upload de imagens
Validação
