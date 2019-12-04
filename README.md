# software-gobarber
Um software de agendamento de beleza

Iniciando o projeto
``` bash
mkdir software-gobarber
cd software-gobarber
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

Conseito de padronização de código
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

usuario: postgres

senha: docker

Clico em test connection se deu tudo certo clico em save & connect, clique em create database e dê um nome, nesse caso gobarber!

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
    // posso receber um parametro e fazer alterações no mesmo.
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    // estou dizendo que vou declarar essa variável, mesmo, não usundo-a.
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

ORM & MVC



Altenticação JWT
Upload de imagens
Validação
