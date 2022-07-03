import {createApp} from 'vue';
import App from '/@/App.vue';
import 'virtual:windi.css';
import { createHead } from '@vueuse/head';
const head = createHead();

createApp(App)
    .use(head)
    .mount('#app');

