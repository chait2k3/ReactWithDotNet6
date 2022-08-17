import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../models/pagination';
import { store } from '../store/configure-store';

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;  // for using cookies, user credentials etc

// for authorization header
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if(token) config.headers!.Authorization = `Bearer ${token}`;
    return config;
});

// for pagination header and errors
axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep();
    
    const pagination = response.headers["pagination"];
    if(pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
    }
    
    return response;
}, (error: AxiosError) => {
    const { status } = error.response!;
    switch (status) {
        case 400:
            toast.error("Bad request...") 
            break;
        case 401:
            toast.error('You are not authorized to do that!');
            break;
        case 403:
            toast.error('You are not allowed to do that!');
            break;
        case 500:
            toast.error('Internal server error...');
            break;
        default:
            toast.error('Something went wrong...');
            break;
    }
    return Promise.reject(error.response);
});

const responseBody = (resp: AxiosResponse) => resp.data;

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody),
    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody)
}

function createFormData(item: any) {
    let formData = new FormData();
    for (const key in item) {
        formData.append(key, item[key])
    }
    return formData;
}

// request calls
const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
};

const Catalog = {
    list: (params: URLSearchParams) => requests.get("products", params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get("products/filters")
};

const Basket = {
    get: () => requests.get("basket"),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
};

const Account = {
    login: (values: any) => requests.post("account/login", values),
    register: (values: any) => requests.post("account/register", values),
    currentUser: () => requests.get("account/currentuser"),
    fetchAddress: () => requests.get("account/savedAddress")
};

const Orders = {
    list: () => requests.get("orders"),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post("orders", values)
};

const Payments = {
    createPaymentIntent: () => requests.post("payments", {})
};

const agent = {
    TestErrors,
    Account,
    Catalog,
    Basket,
    Orders,
    Payments
};

export default agent;