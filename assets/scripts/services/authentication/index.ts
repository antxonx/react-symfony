import { Router } from '@scripts/router';
import axios from 'axios';
import HandleResponse from '@services/handleResponse';

export interface UserI {
    username: string;
    roles: string[];
    email: string;
    id: number;
    name: string;
}

export interface TokenPayloadI {
    username: string;
    roles: string[];
    iat: number;
    exp: number;
}

enum CookiesNames {
    AUTH_COOKIE_NAME = "jwtAuthToken",
    REAL_JWT_TOKEN = "jwtAuthTokenReal",
}

export default class Authentication {

    public static isLoggedIn = async (): Promise<boolean> => {
        let result = false;
        const token = Authentication.getCookie(CookiesNames.AUTH_COOKIE_NAME).trim();
        if (token !== "") {
            await axios.get((new Router(process.env.BASE_ROUTE)).apiGet("index_check_login"), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    result = true;
                })
                .catch((err) => {
                    HandleResponse.error(err);
                    result = false;
                });
        }
        return result;
    };

    public static setToken = (value: string) => {
        Authentication.setCookie(CookiesNames.AUTH_COOKIE_NAME, value);
    };

    public static getToken = (): string => {
        return Authentication.getCookie(CookiesNames.AUTH_COOKIE_NAME);
    };

    private static getCookie = (cname: string) => {
        const name = cname + "=";
        const ca = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[ i ];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    private static setCookie = (cname: string, cvalue: string, exdays: number = 100) => {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    private static deleteCookie = (cname: string) => {
        if (Authentication.getCookie(cname).trim() !== "")
            document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    public static logIn = (options: {
        username: string;
        password: string;
        onSuccess: () => void;
        onError?: (err: any) => void;
        finally?: () => void;
    }) => {
        axios.post((new Router(process.env.BASE_ROUTE)).apiGet("api_login_check"), {
            username: options.username,
            password: options.password
        })
            .then(res => {
                Authentication.setCookie(CookiesNames.AUTH_COOKIE_NAME, res.data.token);
                options.onSuccess();
            })
            .catch(err => {
                options.onError && options.onError(err);
            })
            .finally(() => {
                options.finally && options.finally();
            });
    };

    public static logOut = () => {
        Authentication.deleteCookie(CookiesNames.AUTH_COOKIE_NAME);
        Authentication.deleteCookie(CookiesNames.REAL_JWT_TOKEN);
    };

    public static getPayload = (): TokenPayloadI | null => {
        const token = Authentication.getToken();
        if (token == "") {
            return null;
        } else {
            let result = JSON.parse(atob(token.split(".")[ 1 ])) as TokenPayloadI;
            result.roles = Object.values(result.roles);
            return result;
        }
    };

    public static refreshToken = () => {
        axios.get((new Router(process.env.BASE_ROUTE)).apiGet("user_refresh_token"),
            {
                headers: {
                    Authorization: `Bearer ${Authentication.getToken()}`
                }
            })
            .then(res => {
                Authentication.setCookie(CookiesNames.AUTH_COOKIE_NAME, res.data.token);
                console.info("refreshed token");
            })
            .catch(err => {
                HandleResponse.error(err);
            });
    };

    public static setImpersonation = (token: string) => {
        const actualToken = Authentication.getToken();
        Authentication.setCookie(CookiesNames.REAL_JWT_TOKEN, actualToken);
        Authentication.setToken(token);
    }

    public static unsetIpersonation = () => {
        const realToken =  Authentication.getCookie(CookiesNames.REAL_JWT_TOKEN);
        Authentication.setToken(realToken);
        Authentication.deleteCookie(CookiesNames.REAL_JWT_TOKEN);
    }

    public static isImpersonating = (): boolean => {
        return Authentication.getCookie(CookiesNames.REAL_JWT_TOKEN) !== "";
    }
}