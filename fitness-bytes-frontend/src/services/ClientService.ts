import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    params: {
        token: localStorage.getItem('token'),
    },
    baseURL: "http://localhost:5301/",
});

export interface ResponseResult<T> {
    message: string;
    result?: T; 
}

class ClientService<T> {

    private endpoint = '';

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    get = (config?: AxiosRequestConfig) =>{
        return axiosInstance.get<ResponseResult<T>>(this.endpoint, config)
        .then((res) => res.data);
    }

    delete = (config?: AxiosRequestConfig) =>{
        return axiosInstance.delete<ResponseResult<T>>(this.endpoint, config)
        .then((res) => res.data);
    }

    post = (data: unknown, config?: AxiosRequestConfig) =>{
        return axiosInstance.post<ResponseResult<T>>(this.endpoint, data, config)
        .then((res) => res.data);
    }

    patch = (data: unknown, config?: AxiosRequestConfig) =>{
        return axiosInstance.patch<ResponseResult<T>>(this.endpoint, data, config)
        .then((res) => res.data);
    }
}

export default ClientService;