import { HttpClient } from "../http/HttpClient";

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, data: any): Promise<any> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await fetch(url, options);
    return response.json();
  }
}