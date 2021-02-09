import { ToastEventsI } from "@scripts/app";
import { AxiosError, AxiosResponse } from "axios";

interface JsonErrorResonse {
    code: number;
    message: string;
};

export default class HandleResponse {
    public static error = (err: AxiosError, toasts: ToastEventsI | null = null): JsonErrorResonse | null => {
        if (err.response) {
            const error = err.response.data as JsonErrorResonse;
            let message = error.message;
            console.error(`${error.code}: ${error.message}`);
            if (err.response.status == 401) {
                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes("expired")) {
                    message = "Ha caducado la sesión";
                } else if (errorMsg.includes("invalid")) {
                    message = "Usuario y/o contraseña inválidos";
                } else {
                    message = "Debes iniciar sesión";
                }
                console.error(message);
            }
            const id = Math.floor(Math.random() * 100000 + 1);
            toasts && (
                toasts.add({
                    id: id.toString(),
                    title: "Error",
                    type: "error",
                    message: message,
                })
            );
            return {
                code: error.code,
                message: message
            };
        } else {
            console.error(err);
            return null;
        }
    };
    public static success = <T = string>(res: AxiosResponse, toasts: ToastEventsI | null = null): T => {
        const message = res.data.message || res.data;
        toasts && (
            toasts.add({
                id: Math.floor(Math.random() * 100000 + 1).toString(),
                title: "Bien",
                type: "success",
                message: message,
            })
        );
        try {
            return JSON.parse(message);
        } catch (err) {
            return message;
        }
        
    };
}