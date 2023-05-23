import Hapi from '@hapi/hapi';
import { HttpServer } from "./HttpServer";
//framework and driver
export class HapiAdapter implements HttpServer {
  server: Hapi.Server;

  constructor() {
    this.server = Hapi.server({});
  }

  on(method: string, url: string, callback: Function): void {
    this.server.route({
      method,
      path: url,
      handler: async (request: Hapi.Request, reply: any) => {
        try {
          const output = await callback(request.params, request.payload)
          return output
        } catch (error: any) {
          return reply.response({ message: error.message }).code(422);
        }
      }
    });
  }

  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }

}