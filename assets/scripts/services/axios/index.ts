import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import Authentication from '@services/authentication';
class Axios {
    public static async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await axios.get(url, {
                ...config,
                ...{
                    headers: {
                        Authorization: `Bearer ${Authentication.getToken()}`
                    }
                },
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    public static async delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await axios.delete(url, {
                ...config,
                ...{
                    headers: {
                        Authorization: `Bearer ${Authentication.getToken()}`
                    }
                },
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    public static async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await axios.post(url, data, {
                ...config,
                ...{
                    headers: {
                        Authorization: `Bearer ${Authentication.getToken()}`
                    }
                },
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    public static async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await axios.put(url, data, {
                ...config,
                ...{
                    headers: {
                        Authorization: `Bearer ${Authentication.getToken()}`
                    }
                },
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    public static async patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await axios.patch(url, data, {
                ...config,
                ...{
                    headers: {
                        Authorization: `Bearer ${Authentication.getToken()}`
                    }
                },
            });
        } catch (err) {
            throw new Error(err);
        }
    }

}

export default Axios;