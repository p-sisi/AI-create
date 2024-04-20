import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ElMessage } from 'element-plus';

const COMMON_REQUEST_METHOD = 'POST';
const DEFAULT_TIMEOUT = 120000; //请求超时时间

const config: AxiosRequestConfig = {
    timeout: DEFAULT_TIMEOUT,
    method: COMMON_REQUEST_METHOD,
    // 跨域时候允许携带凭证
    withCredentials: true
};

export class CustomAxiosInstance {
    instance: AxiosInstance;

    constructor(axiosConfig: AxiosRequestConfig) {
        this.instance = axios.create(axiosConfig);
        this.setupInterceptor();
    }

    //设置请求拦截器和响应拦截器
    setupInterceptor () {
        this.instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('Token')
                if( token !== null ) {
                    config.headers.Authorization = token;
                }
                if(config.method.toUpperCase() === 'POST') {
                    config.headers['Content-Type'] = 'application/json;charset=utf-8'
                }
                return config
            }
        );

        //响应拦截器
        this.instance.interceptors.response.use(
            async (response: AxiosResponse) => {
                const { status, data } = response;
                const { isSuccess } = data;

                if ((status === 200 || status < 300 || status === 304) && isSuccess === true) {
                    return Promise.resolve(data);
                } else {
                    return Promise.reject(data);
                }
            },
            //AxiosError中包含了响应错误的详细信息，如错误码、错误信息等
            (error: AxiosError) => {
                //请求失败，返回错误信息
                if (error.code === 'ERR_CANCELED') {
                    return Promise.reject('ERR_CANCELED');
                }

                if (error.code === 'ERR_NETWORK') {
                    console.log('网络异常, 请检查网络');
                }
                if(error.response?.status === 401) {
                    ElMessage.error('登录已过期或未登录，请登录后重试！');
                    router.push('/homepage');
                    commonStore.setLoginDialogOpen(true);
                }
                console.log('response interceptor error', error);
                //请求发送失败，请求没法送到数据库中
                return Promise.reject(error);
            }
        );
    }

    /** 常用请求方法封装 */
    get(url: string, params: any = null, config: AxiosRequestConfig = {}) {
        return this.instance.get(url, { params, ...config });
    }
    
    post(url: string, data: any, config: AxiosRequestConfig = {}) {
        return this.instance.post(url, data, { ...config });
    }
}

export default new CustomAxiosInstance(config);