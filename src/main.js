import { createApp } from 'vue'
import './style.css'
import './mobile.css'
import App from './App.vue'
import { router } from './route'

createApp(App).use(router).mount('#app')
