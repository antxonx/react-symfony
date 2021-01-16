import { AxiosError } from "axios";

interface JsonErrorResonse {
    code: number;
    message: string;
};

export default class HandleResponse {
    public static error = (err: AxiosError): JsonErrorResonse | null => {
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
            return {
                code: error.code,
                message: message
            };
        } else {
            console.error(err);
            return null;
        }
    };
}