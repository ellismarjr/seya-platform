import { HttpServer } from "./HttpServer";
import { UseCaseFactory } from "./UseCaseFactory";
// interface adapter
export class HttpController {
  constructor(httpServer: HttpServer,
    useCaseFactory: UseCaseFactory) {
    httpServer.on('post', "/checkout", async (params: any, body: any) => {
      const checkout = useCaseFactory.createCheckout();
      const output = await checkout.execute(body);
      return output;
    })

    httpServer.on('get', "/products", async (params: any, body: any, headers: any) => {
      const contentType = headers['content-type'];
      const getProducts = useCaseFactory.createGetProducts(contentType);
      const output = await getProducts.execute();
      return output;
    })
  }
}