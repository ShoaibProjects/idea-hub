import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

interface CustomHeaders extends AxiosRequestHeaders {
  'Content-Type': string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  } as CustomHeaders,
});

export default apiClient;