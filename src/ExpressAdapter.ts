import express, { Request, Response } from "express";
import { HttpServer } from "./HttpServer";
//framework and driver
export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async (request: Request, response: Response) => {
      try {
        const output = await callback(request.params, request.body, request.headers)
        return response.json(output);
      } catch (error: any) {
        return response.status(422).json({ message: error.message });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port, () => console.log(`Server is running on port ${port}`))
  }

}