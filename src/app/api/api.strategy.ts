import instance, { instance1 } from "./axios"

const getStrategy = async (url: string, params?: any) => {
    return await instance.get(url, { params });
};

const postStrategy = async (url: string, data: any) => {
    return await instance.post(url, data);
};

const postWithParamsStrategy = async (url: string, params?: any, data: any = {}) => {
    return await instance.post(url, data, { params });
};

const putStrategy = async (url: string, data: any) => {
    return await instance.put(url, data);
};

const deleteStrategy = async (url: string) => {
    return await instance.delete(url);
};

const getStrategy1 = async (url: string, params?: any) => {
    return await instance1.get(url, { params });
};

const postStrategy1 = async (url: string, data: any) => {
    return await instance1.post(url, data);
};

const postWithParamsStrategy1 = async (url: string, params?: any, data: any = {}) => {
    return await instance1.post(url, data, { params });
};

const putStrategy1 = async (url: string, data: any) => {
    return await instance1.put(url, data);
};

const deleteStrategy1 = async (url: string) => {
    return await instance1.delete(url);
};

export const strategy = {
    GET: getStrategy,getStrategy1,
    POST: postStrategy,postStrategy1,
    POST_PARAMS: postWithParamsStrategy,postWithParamsStrategy1,
    PUT: putStrategy,putStrategy1,
    DELETE: deleteStrategy,deleteStrategy1,
};
export const strategy1 = {
    GET: getStrategy1,
    POST: postStrategy1,
    POST_PARAMS: postWithParamsStrategy1,
    PUT: putStrategy1,
    DELETE: deleteStrategy1,
};