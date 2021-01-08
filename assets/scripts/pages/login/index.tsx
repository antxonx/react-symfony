// import axios from 'axios';
import Authentication from '@services/authentication';
import SubmitButton from '@components/submitButton';
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Router from '@scripts/router';
import Layout from '@scripts/components/layout';

declare type LoginFields = "username" | "password";

interface LoginProps {
    logged: boolean;
    onloggedinchange: (logged: boolean) => void;
}

interface LoginState {
    username: string;
    password: string;
    error: boolean;
    loading: boolean;
    isLoggedIn: boolean;
}

export default class Login extends React.Component<LoginProps, LoginState>{
    constructor (props: LoginProps) {
        super(props);
        this.state = {
            username: "",
            password: "",
            error: false,
            loading: false,
            isLoggedIn: this.props.logged,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    changeStateValue = (key: string, value: any) => {
        let current = { ...this.state };
        current[ key as LoginFields ] = value;
        this.setState(current);
    };

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        this.changeStateValue("loading", true);
        Authentication.logIn({
            username: this.state.username,
            password: this.state.password,
            onSuccess: () => {
                this.changeStateValue("error", false);
                this.changeStateValue("isLoggedIn", true);
                this.props.onloggedinchange(true);
            },
            onError: () => {
                this.changeStateValue("error", true);
                this.changeStateValue("isLoggedIn", false);
                this.changeStateValue("loading", false);
                this.props.onloggedinchange(false);
            }
        });
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.changeStateValue(e.target.name, e.target.value);
    };

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key.match(/\s/))
            e.preventDefault();
    };

    render = (): JSX.Element => {
        return (
            <Layout title="login">
                {this.state.isLoggedIn ? (
                    <Redirect to={(new Router()).get("home")} />
                ) : (
                        <div className="vertical-center w-100">
                            <div className="card mx-auto wd-40-wm-95 mt-5 round shadow-lg">
                                <div className="card-body">
                                    <h5 className="h3 mb-3 font-weight-normal text-center">Inicia sesión</h5>
                                    <hr className="divide" />
                                    {this.state.error ? (
                                        <div className="alert alert-danger round text-center">
                                            Datos incorrectos
                                        </div>
                                    ) : <></>}
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="username"
                                                onChange={this.handleChange}
                                                onKeyDown={this.handleKeyDown}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <SubmitButton text="Iniciar sesión" loading={this.state.loading} />
                                    </form>
                                    <hr />
                                    <div className="text-center">
                                        <small>
                                            <Link to="/">Olvidé mi contraseña</Link>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </Layout>
        );
    };
}