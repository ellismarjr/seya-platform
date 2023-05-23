import { DatabaseRepositoryFactory } from './DatabaseRepositoryFactory';
import { PgPromiseAdapter } from './PgPromiseAdapter';
import { ExpressAdapter } from './ExpressAdapter';
import { HttpController } from './HttpController';
import { UseCaseFactory } from './UseCaseFactory';

const connection = new PgPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection);
const useCaseFactory = new UseCaseFactory(repositoryFactory);
const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
new HttpController(httpServer, useCaseFactory);
httpServer.listen(3333);