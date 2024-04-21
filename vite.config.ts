import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { BASE_URL } from './src/content/user.ts'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      host: '0.0.0.0',
      port: 1033,
      open: true,
      proxy: { 
          '^(/user|/modelChat)': {
              target: BASE_URL,    //请求域名
              changeOrigin: true,
          }
      }
  	},
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  }
})
