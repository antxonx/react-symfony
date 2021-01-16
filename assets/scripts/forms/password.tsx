import TextInput from '@components/form/textInput';
import ErrorAlert from '@components/alerts/errorAlert';
import SubmitButton from '@components/form/submitButton';
import { Router } from '@scripts/router';
import axios from 'axios';
import React from 'react';
import HandleResponse from '@scripts/services/handleResponse';

interface PasswordFormPropsI {
    onSuccess: () => void;
}

interface PasswordFormStateI {
    inputs: {
        old: string;
        new: string;
        confirmNew: string;
    };
    errors: {
        old: boolean;
        new: boolean;
        confirmNew: boolean;
    };
    error: boolean;
    errorMsg: string;
    loading: boolean;
}

declare type PasswordFormFields = "old" | "new" | "confirmNew";

export default class PasswordForm extends React.Component<PasswordFormPropsI, PasswordFormStateI> {
    constructor (props: PasswordFormPropsI) {
        super(props);
        this.state = {
            inputs: {
                old: "",
                new: "",
                confirmNew: "",
            },
            errors: {
                old: false,
                new: false,
                confirmNew: false,
            },
            error: false,
            errorMsg: "",
            loading: false,
        };
    }

    changeStateValue = (key: string, value: any) => {
        let current = { ...this.state };
        current.inputs[ key as PasswordFormFields ] = value;
        this.setState(current);
    };

    handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let inputError: boolean;
        let anyError: boolean;
        anyError = inputError = false;
        this.setState({
            error: false,
            errorMsg: "",
        });
        Object.keys(this.state.errors).forEach(key => {
            anyError = anyError || this.state.errors[ key as "old" | "new" | "confirmNew" ];
        });
        if (anyError) return;
        Object.keys(this.state.inputs).forEach(key => {
            inputError = inputError || (this.state.inputs[ key as "old" | "new" | "confirmNew" ] === "");
        });
        this.setState({
            errors: {
                old: this.state.inputs.old === "",
                new: this.state.inputs.new === "",
                confirmNew: this.state.inputs.confirmNew === "",
            }
        });
        if (inputError) {
            this.setState({
                error: true,
                errorMsg: "Debes llenar los datos",
            });
            return;
        } else {
            this.setState({
                loading: true,
            });
            axios.patch((new Router(process.env.BASE_URL)).apiGet("user_profile_change_password"), this.state.inputs)
                .then(res => {
                    this.props.onSuccess();
                })
                .catch(err => {
                    this.setState({
                        error: true,
                        errorMsg: HandleResponse.error(err)!.message
                    });
                    this.setState({
                        loading: false,
                    });
                });
        }
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.changeStateValue(e.target.name, e.target.value);
        if (e.target.name == "new" || e.target.name == "confirmNew") {
            if (this.state.inputs.new != this.state.inputs.confirmNew) {
                this.setState({
                    errors: {
                        new: true,
                        confirmNew: true,
                        old: this.state.errors.old
                    }
                });
            } else {
                this.setState({
                    errors: {
                        new: false,
                        confirmNew: false,
                        old: this.state.errors.old
                    }
                });
            }
        } else {
            if (this.state.errors.old) {
                this.setState({
                    errors: {
                        new: this.state.errors.new,
                        confirmNew: this.state.errors.confirmNew,
                        old: false
                    }
                });
            }
        }
    };

    render = (): JSX.Element => {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextInput
                    name="old"
                    type="password"
                    placeholder="Contraseña actual"
                    onChange={this.handleChange}
                    error={this.state.errors.old}
                    errorMsg="debes ingresar tu contraseña actual"
                />
                <TextInput
                    name="new"
                    type="password"
                    placeholder="Nueva contraseña"
                    onChange={this.handleChange}
                    error={this.state.errors.new}
                />
                <TextInput
                    name="confirmNew"
                    type="password"
                    placeholder="Confirmar contraseña"
                    onChange={this.handleChange}
                    error={this.state.errors.confirmNew}
                    errorMsg="No coinciden las contraseñas"
                />
                <SubmitButton text="Cambiar contraseña" loading={this.state.loading} />
                {this.state.error && <ErrorAlert text={this.state.errorMsg} />}
            </form>
        );
    };
}