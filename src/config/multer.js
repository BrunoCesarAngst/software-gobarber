import multer from 'multer';

import crypto from 'crypto';

import { extname, resolve } from 'path';
// extname que retorna a extensão do arquivo baseado no seu nome.

// exportamos um objeto de configuração.
export default {
  // storage é como o multer vai guardar os arquivos.
  storage: multer.diskStorage({
    // destination é o destino de nossos arquivos.
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    /**
     * filename é o como será formatado os nomes dos arquivos.
     * Adicionando um código único no arquivo
     */
    filename: (req, file, cb) => {
      /**
       * crypto para gerar caracteres aleatórios.
       * A função randomBytes informando o nº de bytes que será gerado, como
       * segundo parâmetro uma função callback que pega o resultado da função
       * com um erro(err), caso tenha dado erro ou resposta.
       */
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        /**
         * Se não deu erro.
         * chamamos o callback(cb), avisando que o primeiro parâmetro não deu
         * erro 'null', usamos a resposta do randomBytes(res) transformando 16
         * bytes de conteúdo aleatório em uma string hexadecimal concatenando
         * com a extensão do arquivo. Então configuramos as rotas em routes.
         */
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    }
  })
};
