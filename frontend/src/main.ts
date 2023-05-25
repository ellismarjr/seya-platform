import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { HttpCheckoutGateway } from './gateway/HttpCheckoutGateway';
import { AxiosAdapter } from './gateway/AxiosAdapter';

const app = createApp(App);
const httClient = new AxiosAdapter();
app.provide("checkoutGateway", new HttpCheckoutGateway(httClient));
app.mount('#app');
