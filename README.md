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
ORM
MVC
Altenticação JWT
Upload de imagens
Validação
