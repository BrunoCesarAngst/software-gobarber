import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// criamos um array de jobs
const jobs = [CancellationMail];

// criamos a fila
class Queue {
  constructor() {
    // para armazenar todas as filas
    this.queues = {};

    // para dividir aparte de inicialização das filas em outro método
    this.init();
  }

  // inicializando a fila
  init() {
    /**
     * simplesmente percorremos jobs, pois não há retorno
     * jobs.forEach(job => {}), mas posso acessar as informações de key e handle
     * do CancellationMail por desestruturação
     */
    jobs.forEach(({ key, handle }) => {
      /**
       * chamando o objeto queues, pegando todas as nossas jobs "setando" a
       * chave com key e armazenando como um objeto em queues, armazenando a
       * fila que tem conexão com nosso banco não relacional Redis e também o
       * método handle que processa nossos jobs, recebendo as informações e
       * disparando os email ou outra tarefa que precise ser feito em background
       */
      this.queues[key] = {
        /**
         * em bee temos a conexão com Redis que armazena e recupera valor do
         * banco de dados
         */
        bee: new Bee(key, {
          /**
           * passamos a conexão com Redis, para isso criamos um arquivo config
           * para o ele.
           */
          redis: redisConfig
        }),
        /**
         * handle processa a fila recebendo as variáveis dos nossos emails por
         * ex
         */
        handle
      };
    });
  }

  /**
   * adicionando novos itens na fila
   * criamos um método para adicionar novas jobs dentro de cada fila para ser
   * processado em background.
   * queue a qual fila vai ser adicionado um novo trabalho que com a propriedade
   * bee podemos criar novos jobs recebendo job com as informações que vem como
   * por exemplo appointment, que são passadas para o método handle
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * processando as filas
   * percorrendo as jobs e para cada job recebo um job buscando bee e handle da
   * fila relacionada com aquele job
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      /**
       * então pego a fila(bee) processando com o parâmetro(handle)
       */
      bee.process(handle);
    });
  }
}

export default new Queue();
