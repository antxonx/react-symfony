import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import Authentication from '@services/authentication';
class Axios {
    public static async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await axios.get<T>(url, {
            ...config,
            ...{
                headers: {
                    Authorization: `Bearer ${Authentication.getToken()}`
                }
            },
        });
    }

    public static async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await axios.delete<T>(url, {
            ...config,
            ...{
                headers: {
                    Authorization: `Bearer ${Authentication.getToken()}`
                }
            },
        });
    }

    public static async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await axios.post<T>(url, data, {
            ...config,
            ...{
                headers: {
                    Authorization: `Bearer ${Authentication.getToken()}`
                }
            },
        });
    }

    public static async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await axios.put<T>(url, data, {
            ...config,
            ...{
                headers: {
                    Authorization: `Bearer ${Authentication.getToken()}`
                }
            },
        });
    }

    public static async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await axios.patch<T>(url, data, {
            ...config,
            ...{
                headers: {
                    Authorization: `Bearer ${Authentication.getToken()}`
                }
            },
        });
    }

}

export default Axios;