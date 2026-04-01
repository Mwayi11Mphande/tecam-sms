import { api } from "./client";

// -----------------------------
// Generic Request Helpers
// -----------------------------

export const get = async <T = any>(
    url: string,
    params?: Record<string, any>
): Promise<T> => {
    return api.get(url, { params });
};

export const post = async <T = any>(url: string, data?: any): Promise<T> => {
    return api.post(url, data);
};

export const put = async <T = any>(url: string, data?: any): Promise<T> => {
    return api.put(url, data);
};

export const patch = async <T = any>(url: string, data?: any): Promise<T> => {
    return api.patch(url, data);
};

export const del = async <T = any>(url: string): Promise<T> => {
    return api.delete(url);
};