import jwt from 'jsonwebtoken';

import { promisify } from 'util';

// trazendo o segredo para descriptografar o token para validar
import authConfig from '../../config/auth';

// exportando essa middleware como uma função
export default async (req, res, next) => {
  // buscando o header
  const authHeader = req.headers.authorization;

  // se não estiver presente
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provider!' });
  }

  // usando a desestruturação para pegar o token
  const [, token] = authHeader.split(' ');

  // usando try catch pois pode retornar um erro
  try {
    /**
     * usamos o método verify do jwt na versão assíncrona, mas, por ela utilizar
     * callback, vamos fazer uso do promisify da biblioteca do util que
     * transforma essa função callback em uma função async await.
     * então a variável decoded recebe o valor retornado da função sem precisar
     * passar o callback, somente o restante dos parâmetros da função do método
     * que se quer "promisificar", então, decoded recebe payload um objeto
     * contendo o id do usuário
     */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    /**
     * aqui incluímos o id do usuário no req(requisição), para reconhecer o
     * usuário com seu respectivo token
     */
    req.userId = decoded.id;

    /**
     * se chegou aqui, quer dizer que o usuário pode acessar o controller
     * normalmente, pois, ele está autenticado.
     */
    return next();
  } catch (err) {
    // token inválido
    return res.status(401).json({ error: 'Token invalid!' });
  }
};
