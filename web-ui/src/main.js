import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import "element-plus/theme-chalk/index.css"
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'fast-crud-ui3/lib/style.css'
import '@/assets/index.scss'
import FastCrudUI from 'fast-crud-ui3'
import http from "@/http"

const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn
})
app.use(FastCrudUI, {
    $http: http
})
app.mount('#app')
