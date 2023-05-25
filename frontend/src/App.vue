<script setup lang="ts">
import { onMounted, ref, inject } from 'vue';
import { CheckoutGateway } from './gateway/CheckoutGateway';
import { Order } from './entities/Order';

const products: any = ref([]);
const order: any = ref(new Order('89e3b33c-7edc-4cb3-9a45-60b0c9dfce3d', '503.348.770-16'));
const success = ref({
  total: 0,
});

const checkoutGateway = inject("checkoutGateway") as CheckoutGateway;

async function checkout() {
  success.value = await checkoutGateway.checkout(order.value);
}

onMounted(async () => {
  products.value = await checkoutGateway.getProducts();
});

</script>

<template>
  <div class="module-name"> Checkout</div>
  <div v-for="product in products">
    <div class="product-description">{{ product.description }}</div>
    <div class="product-price">{{ product.price }}</div>
    <button class="product-add-button" @click="order.addItem(product)">Add</button>
  </div>
  <div class="total">{{ order.getTotal() }}</div>
  <div v-for="item in order.items">
    <div class="order-item">{{ item.idProduct }} {{ item.quantity }}</div>
  </div>
  <button class="checkout-button" @click="checkout">Checkout</button>
  <div class="success">{{ success.total }}</div>
</template>

<style scoped>
</style>
