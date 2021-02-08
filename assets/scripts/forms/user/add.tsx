import SubmitButton from '@components/form/submitButton';
import TextInput from '@components/form/textInput';
import { Router } from '@scripts/router';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@services/axios';
import React from 'react';
import parse from 'html-react-parser';

import '@styles/checkbox.scss'

interface AddPropsI {
    onSuccess: (res: AxiosResponse) => void;
    onError: (err: AxiosError) => string | undefined;
}

const EmailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AddStateI {
    inputs: {
        username: string;
        name: string;
        password: string;
        email: string;
        roles: string[];
    };
    errors: {
        username: boolean;
        name: boolean;
        email: boolean;
        password: boolean;
    };
    loading: boolean;
    errorMsg?: string;
}

declare type AddFormFields = "username" | "name";

export default class Add extends React.Component<AddPropsI, AddStateI> {
    constructor (props: AddPropsI) {
        super(props);
        this.state = {
            inputs: {
                username: "",
                name: "",
                password: "",
                email: "",
                roles: [],
            },
            errors: {
                username: false,
                name: false,
                password: false,
                email: false,
            },
            loading: false,
        };
    }

    changeStateValue = (key: string, value: any) => {
        let current = { ...this.state };
        current.inputs[ key as AddFormFields ] = value;
        this.setState(current);
    };

    handleSubmit = (e: React.FormEvent) => {
        let errors = {
            username: false,
            password: false,
            name: false,
            email: false,
        };
        let final = false;
        e.preventDefault();
        this.setState({
            errorMsg: undefined,
        });
        if (this.state.inputs.username.trim() == "") {
            errors.username = true;
        }
        if (this.state.inputs.name.trim() == "") {
            errors.name = true;
        }
        if (this.state.inputs.password == "") {
            errors.password = true;
        }
        if (this.state.inputs.email == "" || !EmailRegExp.test(this.state.inputs.email)) {
            errors.email = true;
        }
        this.setState({
            errors: errors,
        });
        Object.values(errors).map(x => final = final || x);
        if (!final) {
            this.setState({
                loading: true,
            });
            axios.post((new Router(process.env.BASE_URL).apiGet("register")), this.state.inputs)
                .then(this.props.onSuccess)
                .catch(err => {
                    this.setState({
                        errorMsg: this.props.onError(err),
                        loading: false,
                    });
                });
        }
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.changeStateValue(e.target.name, e.target.value);
    };

    handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rolesCopy = this.state.inputs.roles.slice();
        if (e.target.checked) {
            if (!this.state.inputs.roles.includes(e.target.name)) {
                rolesCopy.push(e.target.name);
            }
        } else {
            rolesCopy.splice(rolesCopy.findIndex((role) => role == e.target.name), 1);
        }
        this.setState({
            inputs: {
                username: this.state.inputs.username,
                name: this.state.inputs.name,
                password: this.state.inputs.password,
                email: this.state.inputs.email,
                roles: rolesCopy.sort(),
            }
        });
    };

    render = (): JSX.Element => {
        const roles = [
            { nombre: 'admin', real: 'ROLE_ADMIN' },
        ];
        return (
            <form onSubmit={this.handleSubmit}>
                <TextInput
                    name="username"
                    placeholder="Usuario"
                    onChange={this.handleChange}
                    error={this.state.errors.username}
                    errorMsg="Ingresa un nombre de usuario"
                    onKeyDown={(e) => e.key.match(/\s/) && e.preventDefault()}
                />
                <TextInput
                    name="name"
                    placeholder="Nombre"
                    onChange={this.handleChange}
                    error={this.state.errors.name}
                    errorMsg="Ingresa un nombre"
                />
                <TextInput
                    name="email"
                    placeholder="email@email.com"
                    onChange={this.handleChange}
                    error={this.state.errors.email}
                    errorMsg="Ingresa un correo válido"
                />
                <TextInput
                    name="password"
                    type="password"
                    placeholder="******"
                    onChange={this.handleChange}
                    error={this.state.errors.password}
                    errorMsg="Ingresa una contraseña"
                />
                <b className="text-muted font-italic">Puesto:</b>
                <br />
                <div className="row">
                    {
                        roles.map((role, i) => {
                            return (
                                <div className="col-md-5 ml-4 checkbox-lg" key={role.real}>
                                    <input
                                        type="checkbox"
                                        className="custom-control-input check-roles"
                                        value={role.real}
                                        id={"roleCheckBox" + i}
                                        name={role.real}
                                        onChange={this.handleCheckChange}
                                    />
                                    <label
                                        htmlFor={"roleCheckBox" + i}
                                        className="custom-control-label">
                                        {role.nombre}
                                    </label>
                                </div>
                            );
                        })
                    }
                </div>
                <SubmitButton text="Agregar usuario" loading={this.state.loading} />
                {
                    this.state.errorMsg && (
                        <div className="alert alert-danger round text-center mt-2">
                            {parse(this.state.errorMsg)}
                        </div>
                    )
                }
            </form>
        );
    };
}