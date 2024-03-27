import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    server: {
      port: 1024,
      open: true,
      proxy: {
          //正则表达式，所有以/collect|/sysDialog|/user开头的请求地址都使用target的域名，如果还有其他域名，则在下面以一样的格式补充
          '^(/collect|/sysDialog|/user)': {
              target: 'http://10.38.170.192:8081/',    //请求域名
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
