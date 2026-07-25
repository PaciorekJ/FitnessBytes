import axios, { AxiosRequestConfig } from "axios";

const defaultApiBaseUrl = import.meta.env.DEV
    ? "http://localhost:5301/"
    : "/api/";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBaseUrl;

const axiosInstance = axios.create({
    baseURL: apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`,
    withCredentials: true,
});

export interface Paginated {
    hasMore: boolean;
}

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
