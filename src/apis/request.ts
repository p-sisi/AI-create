import axios from 'axios';
import type { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const COMMON_REQUEST_METHOD = 'POST'; 
const DEFAULT_TIMEOUT = 120000; //缺省请求超时时间 2min

//请求配置对象
const config: AxiosRequestConfig = {
    timeout: DEFAULT_TIMEOUT,
    method: COMMON_REQUEST_METHOD,
    withCredentials: true
};

export class CustomAxiosInstance {
    instance: AxiosInstance;

    constructor(axiosConfig: AxiosRequestConfig) {
        this.instance = axios.create(axiosConfig);
        this.setupInterceptor();
    }

    setupInterceptor () {
        this.instance.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('Token')
                if( token !== null ) {
                    config.headers.Authorization = token;
                }
                if(config.method?.toUpperCase() === 'POST') {
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
            (error: AxiosError) => {
                if (error.code === 'ERR_CANCELED') {
                    return Promise.reject('ERR_CANCELED');
                }

                if (error.code === 'ERR_NETWORK') {
                    console.log('网络异常, 请检查网络');
                }
                console.log('response interceptor error', error);
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