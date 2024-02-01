import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    params: {
        token: localStorage.getItem('token'),
    },
    baseURL: "http://localhost:5301/",
});

class ClientService<T> {

    private endpoint = '';

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    get = (config?: AxiosRequestConfig) =>{
        return axiosInstance.get<T>(this.endpoint, config)
        .then((res) => res.data);
    }

    post = (data: unknown, config?: AxiosRequestConfig) =>{
        return axiosInstance.post<T>(this.endpoint, data, config)
        .then((res) => res.data);
    }
}

export default ClientService;