// import axios from 'axios';
import Authentication from '@services/authentication';
import SubmitButton from '@components/submitButton';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Router from '@scripts/router';

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

    render = (): JSX.Element => {
        return (
            <>
                {this.state.isLoggedIn ? (
                    <Redirect to={(new Router()).get("home")} />
                ) : (
                        <div className="card mt-5 mx-auto w-50">
                            <div className="card-body">
                                <h5>Inicia sesión</h5>
                                <hr />
                                {this.state.error ? (
                                    <div className="alert alert-danger">
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
                            </div>
                        </div>
                    )}
            </>
        );
    };
}