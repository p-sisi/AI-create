import { createApp } from 'vue'
import './style.css'
import 'animate.css';
import 'element-plus/es/components/message/style/css'
import App from './App.vue'
import { store } from '@/store'

// MarkDown的Editor
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';

import router from './router'

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

const app = createApp(App);

app.use(router);
app.use(store);
app.use(VueMarkdownEditor);

app.mount('#app')
