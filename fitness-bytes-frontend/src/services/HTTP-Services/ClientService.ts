import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5301/",
    withCredentials: true,
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

    checkResponse(res: ResponseResult<T>): unknown {
        return res.result as unknown
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