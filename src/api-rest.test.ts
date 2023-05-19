import axios from "axios";
import { expect, it } from "vitest";

axios.defaults.validateStatus = function () {
  return true;
}

it("Não deve criar pedido com cpf inválido", async function () {
  const input = {
    cpf: "406.302.170-27"
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid CPF");
});

it("Deve fazer um pedido com 3 itens", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ]
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

it("Deve fazer um pedido com 3 itens com cupom de desconto válido", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ],
    coupon: "VALE20"
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.total).toBe(4872);
});

it("Deve fazer um pedido com 3 itens com cupom de desconto expirado", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ],
    coupon: "VALE10"
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

it("Deve fazer um pedido com 3 itens com cupom de desconto que não existe", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ],
    coupon: "VALE0"
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

it("Não deve fazer um pedido com quantidade negativa de item", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: -1 }
    ]
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid quantity");
});

it("Não deve fazer um pedido com item duplicado", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 }
    ]
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Duplicated item");
});

it("Deve fazer um pedido com 3 itens calculando o frete", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 }
    ],
    from: "88015600",
    to: "22030060"
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

it("Deve fazer um pedido com 3 itens calculando o frete com preço mínimo", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 }
    ],
    from: "88015600",
    to: "22030060"
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});

it.skip("Não deve fazer um pedido se o produto tiver dimensões inválidas", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 4, quantity: 1 }
    ]
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid dimensions");
});

it.skip("Não deve fazer um pedido se o produto tiver peso negativo", async function () {
  const input = {
    cpf: "407.302.170-27",
    items: [
      { idProduct: 5, quantity: 1 }
    ]
  };
  const response = await axios.post("http://localhost:3333/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid weight");
});