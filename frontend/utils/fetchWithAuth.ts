import axios, { AxiosRequestConfig } from 'axios';

const API_TOKEN = '3f8b2e1c-9d4a-4e2b-8c2e-7f1a2b3c4d5e';

export const axiosWithAuth = axios.create({
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Optionally, add a function for custom requests
export const fetchWithAuth = <T = any>(url: string, config: AxiosRequestConfig = {}) =>
  axiosWithAuth({ url, ...config }).then(res => res.data as T);