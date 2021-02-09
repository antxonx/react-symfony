import Layout from '@components/layout';
import React, { Suspense } from 'react';
import { AxiosResponse } from 'axios';
import Axios from '@services/axios';
import { Router } from '@scripts/router';
import Loader from '@components/loader/loader';
import AlertBox from 'antd/es/alert';
import 'antd/es/alert/style/css';
import HandleResponse from '@services/handleResponse';

const PasswordForm = React.lazy(() => import('@scripts/forms/user/passwordAdmin'));

interface PasswordResetPropsI {

}

interface PasswordResetStateI {
    data: UserDataI;
    token: string;
    loading: boolean;
    errorMsg?: string;
}

interface UserDataI {
    username: string;
    name: string;
}

export default class PasswordReset extends React.Component<PasswordResetPropsI, PasswordResetStateI> {
    constructor (props: PasswordResetPropsI) {
        super(props);
        this.state = {
            data: {
                username: "",
                name: "",
            },
            token: "",
            loading: true,
        };
    }

    componentDidMount = async () => {
        const token = this.getParameterByName("token") || "";
        this.setState({
            token: token,
        });
        if (token) {
            try {
                const res = await Axios.get(
                    (new Router(process.env.BASE_URL)).apiGet("reset_password_confirm", {
                        token: token
                    })
                );
                this.setState({
                    loading: false,
                    data: HandleResponse.success<UserDataI>(res),
                });
            } catch (err) {
                this.setState({
                    loading: false,
                    errorMsg: HandleResponse.error(err)!.message,
                });
            }
        }
    };

    getParameterByName(name: string) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[ 1 ].replace(/\+/g, ' '));
    }

    handleSuccess = (res: AxiosResponse) => {
        window.location.href = (new Router(process.env.BASE_URL)).get("dashboard");
    };

    handleSubmit = async (e: React.FormEvent, inputs: any): Promise<AxiosResponse<any>> => {
        return await Axios.post(
            (new Router(process.env.BASE_URL)).apiGet("reset_password_reset", {username: this.state.data.username}),
            inputs
        );
    };

    NoToken = (): JSX.Element => {
        return (
            <AlertBox
                className="round w-50 mx-auto mt-5"
                message="No se encontró el token."
                description="Debes usar el link o la ruta que se envió al correo para recuperar tu contraseña."
                type="info"
                showIcon
            />
        );
    };
    Error = (): JSX.Element => {
        return (
            <AlertBox
                className="round w-50 mx-auto mt-5"
                message="No se encontró el token."
                description={this.state.errorMsg}
                type="error"
                showIcon
            />
        );
    };

    Form = (): JSX.Element => {
        const { data, loading, errorMsg } = this.state;
        return (
            <>
                {
                    loading
                        ? <Loader />
                        : errorMsg
                            ? <this.Error />
                            : (
                                <div className="vertical-center w-100">
                                    <div className="card mx-auto wd-40-wm-95 mt-5 round shadow-lg">
                                        <div className="card-body">
                                            <h5 className="h3 mb-3 font-weight-normal text-center">Cambio de contraseña</h5>
                                            <h6 className="mb-3 font-weight-normal text-center"><em>{data.username}</em> | <b>{data.name}</b></h6>
                                            <hr className="divide" />
                                            <Suspense fallback={<Loader />}>
                                                <PasswordForm
                                                    onSuccess={this.handleSuccess}
                                                    onSubmit={this.handleSubmit}
                                                />
                                            </Suspense>
                                        </div>
                                    </div>
                                </div>
                            )
                }
            </>
        );
    };

    render = (): JSX.Element => {
        const { token } = this.state;
        return (
            <Layout title="Recuperar contraseña" top={false}>
                {
                    token
                        ? <this.Form />
                        : <this.NoToken />

                }

            </Layout>
        );
    };
}