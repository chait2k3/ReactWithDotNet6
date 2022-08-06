import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5001/api/";
axios.defaults.withCredentials = true;  // for using cookies, user credentials etc

axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep();
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
    list: () => requests.get("products"),
    details: (id: string | undefined) => requests.get(`products/${id}`)
};

const Basket = {
    get: () => requests.get('basket'),
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
};

const agent = {
    TestErrors,
    Catalog,
    Basket
};

export default agent;