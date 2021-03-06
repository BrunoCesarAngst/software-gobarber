
<h2 align="center">
    <img alt="silhueta barba, cabelo e bigode" src="https://github.com/BrunoCesarAngst/software-gobarber/blob/master/images/cabelobigodebarbas.png" width="80px" />
</h2>

<h2 align="center">
Software-GoBarber-Backend
</h2>

<h4 align="center">
Um software de agendamento de beleza
</h4>

Iniciando o projeto
``` bash
mkdir software-GoBarber
cd software-GoBarber
yarn init -y
yarn add express
yarn add sucrase nodemon -D
  # o sucrase é para trabalhar com sintaxe `import ... from '...';`.
  # Criamos uma propriedade um script para rodar comandos na minha aplicação
  # no arquivo package.json, após o MIT assim:
```
``` json
"scripts": {
    "dev": "nodemon src/server.js",
    "dev:debug": "nodemon --inspect src/server.js"
    // essa propriedade permite fazer debug no vscode, sem precisar reiniciar a
    // plicação, configurando o aquivo launch.json como a seguir:
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
### Configurando o Sequelize(ORM), estrutura de pastas e MVC

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
### Autenticação JWT
```bash
# uma nova entidade um novo controller
controllers
├── SessionController.js # criamos esse arquivo

yarn add jsonwebtoken
```
### Middleware de autenticação
Bloqueando usuários a acessar algum tipo de rotas, caso não esteja logado, pensando na parte de edição do usuário. Vamos para o arquivo UserController.js

Criamos a middleware de verificação de usuário no arquivo auth.js
```bash
middlewares
└── auth.js
```
### Update do usuário
A edição do cadastro do usuário, para poder alterar alguns campos cadastrais

### Validando dados de entrada
Usando a biblioteca 'yup', faremos essas validações com essa "schema validation".
```bash
yarn add yup
```

### Upload de imagens
```bash
yarn add multer
touch src/config/multer.js
touch tmp/uploads
```
#### Avatar do usuário
associando o avatar ao usuário
```bash
touch src/app/controllers/FileController.js
# criamos a tabela que armazena os arquivos
yarn sequelize migration:create --name=create-files
# configuramos as colunas conforme necessário e rodamos
yarn sequelize db:migrate
# criamos o model da tabela
touch src/app/models/File.js
# importamos esse arquivo em index.js da pasta database
# então para refazer as tabelas existentes, criamos uma nova migration que cria
# e adiciona essa nova coluna responsável por relacionar usuário com o avatar
yarn sequelize migration:create --name=add-avatar-field-to-users
yarn sequelize db:migrate
```
### Listagem de prestadores de serviço
criamos uma nova rota em routes e uma novo controller (pois, é uma nova entidade) em:
```bash
touch src/app/controllers/ProviderController.js
```
### Migration e model de agendamento
```bash
# criamos uma nova tabela
yarn sequelize migration:create --name=create-appointments
# src/database/migrations/20191226200908-create-appointments.js
yarn sequelize db:migrate
# criamos o model de agendamento
touch src/app/models/Appointment.js
# importamos esse arquivo em index.js da pasta database, incluindo no array de
# models
```
### Agendamento de serviço
```bash
# criamos o controller de agendamento
touch src/app/controllers/AppointmentController.js
# importamos esse arquivo em routes.js
```
### Validações de agendamento
validando se o horário é futuro se já está comprometido e fazer marcações de hora em hora.
```bash
yarn add date-fns@next
# então trabalhamos as validações no arquivo AppointmentController.js
```
### Listando agendamentos do usuário
criamos essa nova rota em routes.js
trabalhamos no arquivo AppointmentController

### Aplicando paginação
trabalhamos no arquivo AppointmentController

### Listando agenda do prestador
```bash
touch src/app/controllers/ScheduleController.js
# criamos essa nova rota em routes.js
```
### Configurando MongoDB
trabalhando com dados não estruturados e não relacionados que precisão de performance com MongoDB no ORM Mongoose, dentro de um container Docker.
```bash
# subindo um container com a imagem do mongo.
docker run --name mongobarber -p 27017:27017 -d -t mongo
# verifico no browser localhost:27017 a mensagem - It looks like you are trying to access MongoDB over HTTP on the native driver port.
# instalando o ORM
yarn add mongoose
# configuramos a conexão do mongodb no arquivo em index.js da pasta database
# criando um segundo método.
```
### Notificando novos agendamentos
enviando uma notificação ao prestador sobre os novos agendamentos
vamos armazenar as notificações dentro do mongodb
```bash
# criando as schemas que são as models do mongo
touch src/app/schemas/Notification.js
```
e no controller AppointmentController.js geramos a notificação e para visualizar
esse banco usamos o [MongoDB Compass Community](https://www.mongodb.com/download-center/compass)

### Listando notificações do usuário
criamos a rota no arquivo routes.js criando o arquivo NotificationController.js
```bash
touch src/app/controllers/NotificationController.js
```
### Marcar notificações como lidas
criamos a rota no arquivo routes.js e no controller NotificationController.js incluímos o método update.

### Cancelamento de agendamento
o usuário poderá cancelar duas horas antes do horário marcado.
criamos a rota no arquivo routes.jse no controller AppointmentController.js incluímos o método delete.

### Configurando Nodemailer
enviando ao prestador um email com o aviso de cancelamento.
```bash
yarn add nodemailer
# crio o arquivo de configuração de envios de email.
touch src/config/mail.js
```
utilizando [mailtrap](https://mailtrap.io/) (somente para ambiente de desenvolvimento!)
```bash
touch src/lib/Mail.js
# na pasta lib é onde colocamos configurações adicionais, para ficar mais
# isolado e o arquivo Mail.js é a configuração do email
```
em AppointController.js configuramos a parte que envia o email

### Configurando templates de e-mail
usando template engine, arquivos HTML que podem receber variáveis do node, faremos uso do [Handlebars](https://handlebarsjs.com/)
```bash
# instalando os pacotes
yarn add express-handlebars nodemailer-express-handlebars
# importo esses pacotes em Mail.js
# gero a seguinte estrutura de arquivos
app/views
      └── emails
          ├── cancellation.hbs
          ├── layouts
          │   └── default.hbs
          └── partials
              └── footer.hbs
# então configuro o template em Mail.js e em AppointController.js
```
### Configurando fila com Redis
trabalhando com background jobs(trabalhos em segundo plano) configurando em nossa aplicação alguns serviços que ficão rodando em segundo plano, nesse caso, usamos um banco que usa chave e valor no caso Redis não relacional dando mais capacidade de registro sem perder a performance.
```bash
# subimos um container com o Redis
docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
```
também vamos instalar uma ferramenta de fila dentro do Node.js para background jobs o [Bee-queue](https://github.com/bee-queue/bee-queue)
```bash
yarn add bee-queue
# criamos novos arquivos
touch src/lib/Queue.js
touch src/app/jobs/CancellationMail.js
touch src/config/redis.js
# mudo forma da passagem do email no arquivo AppointController.js importando a
# fila
touch src/queue.js
# com esse arquivo esse processo não vai estar rodando no mesmo Node, pois, a
# fila pode estar rodando em um servidor num core do processador, com mais ou
# menos recursos, totalmente separado, assim a fila não atrapalha a performance
# da nossa aplicação
```
### Monitorando falhas na fila
então configuro o arquivo Queue.js

### Listando horários disponíveis
crio uma rota em routes.js listando os horários disponíveis de um prestador em dado dia
```bash
# crio o respectivo controller
touch src/app/controllers/AvailableController.js
```
### Campos virtuais no agendamento
colocando informações importante em Appointment.js e AppointController.js

### Tratamento de exceções
usando uma ferramenta de monitoramento de erros [Sentry](https://sentry.io/), cria uma conta e configura um novo projeto com Express, e o Sentry vai passar o passo a passo
```bash
yarn add @sentry/node@5.10.2
# para resolver o problema do async atrapalhar o envio de erro para o Sentry
yarn add express-async-errors
# e para mostrar esse erros no insomnia instalo
yarn add youch
```
### Variáveis ambiente
