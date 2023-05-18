import { Output, coupons, products } from "./api-rest";
import { validate } from "./validator";

const input: { cpf: string, items: { idProduct: number, quantity: number }[], from?: string, to?: string, coupon?: string } = {
  cpf: '',
  items: [],
}

process.stdin.on('data', (data) => {
  const command = data.toString().replace('\n', '');
  if (command.startsWith('set-cpf')) {
    input.cpf = command.replace('set-cpf', '');
    console.log(input)
    return
  }

  if (command.startsWith('add-item')) {
    const [idProduct, quantity] = command.replace('add-item ', '').split(' ')
    input.items.push({ idProduct: parseInt(idProduct), quantity: parseInt(quantity) })
    console.log(input)
    return
  }

  if (command.startsWith('checkout')) {
    try {
      const output: Output = {
        subtotal: 0,
        total: 0,
        freight: 0
      };
      if (input.items) {
        for (const item of input.items) {
          if (item.quantity <= 0) {
            throw new Error('Invalid quantity');
          }
          if (input.items.filter((i: any) => i.idProduct === item.idProduct).length > 1) {
            throw new Error('Duplicated item');
          }
          const productData = products.filter(product => product.id === item.idProduct);
          if (productData[0].width <= 0 ||
            productData[0].height <= 0 ||
            productData[0].length <= 0) {
            throw new Error('Invalid dimensions');
          }
          if (productData[0].weight <= 0) {
            throw new Error('Invalid weight');
          }
          output.subtotal += productData[0].price * item.quantity;
          if (input.from && input.to) {
            const volume = productData[0].width / 100 * productData[0].height / 100 * productData[0].length / 100;
            const density = productData[0].weight / volume;
            let freight = volume * 1000 * (density / 100);
            freight = Math.max(freight, 10);
            output.freight += freight * item.quantity;
          }
        }
      }
      output.total = output.subtotal;
      if (input.coupon) {
        const couponData = coupons.find(coupon => coupon.code === input.coupon);
        const today = new Date();
        if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
          output.total -= output.total * (couponData.percentage / 100);
        }
      }
      const isValid = validate(input.cpf);
      if (!isValid) {
        output.message = 'Invalid CPF';
      }
      output.total += output.freight;
      console.log(`Total: ${output.total}`);
    } catch (error: any) {
      console.log(error.message);
    }
    return
  }

  if (command.startsWith('quit')) {
    console.log('quit')
    process.exit();
  }

  console.log('Invalid command')
});