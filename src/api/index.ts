import axios, { AxiosError, AxiosResponse } from 'axios'

interface CustomHeaders {
    [key: string]: any;
}

const baseURL = 'http://localhost:8080/api/v1';
const request = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
request.interceptors.request.use(
    (config: any) => {
        const headers = config.headers as CustomHeaders;
        headers['Access-Control-Allow-Origin'] = '*';
        // url에 따른 각종 header 세팅
        // jwt 사용시 accessToken 세팅
        return config;
    },
    (err: AxiosError) => {
        console.log('this?? : ', err);
        return Promise.reject(err);
    }
);

// Response interceptor
request.intercleptors.response.use(
    (resp: AxiosResponse) => {
        const res = resp.data;
        console.log('resp?? : ', res);
        return res;
    },
    async (err: any) => {
        if (err.response && err.response.status === 401) {
            if (err.response.config.url !== `/api/relogin`) {
                console.log('jwt relogin')
            } else {
                return err;
            }

            return err;
        }

        if (err.response && err.response.status !== 401) {
            console.log("test??????????????????")
            return err.response;
        }
    }
);

export default request;