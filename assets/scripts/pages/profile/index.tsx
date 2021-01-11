import React from 'react';
import axios from '@services/axios';
import Authentication, { UserI } from '@scripts/services/authentication';
import { Router } from '@scripts/router';
import Layout from '@scripts/components/layout';
import Loader from '@scripts/components/loader';
import EditableTextField from '@scripts/components/editableTextField';
import { setTimeout } from 'timers';

interface ProfileStateI {
    user: UserI | null;
    errors: {
        username?: string;
        email?: string;
        name?: string;
    };
}

declare type UserFields = "username" | "email";

export default class Profile extends React.Component<{}, ProfileStateI>{

    public constructor (props: {}) {
        super(props);
        this.state = {
            user: null,
            errors: {},
        };
    }

    componentDidMount = () => {
        axios.get((new Router(process.env.BASE_ROUTE)).apiGet("user_profile"))
            .then(res => {
                this.setState({ user: res.data });
            })
            .catch(err => {
                console.error(err);
                console.error(err.response.data.message);
            });
    };

    onTextFieldEdit = async (name: string, value: string): Promise<boolean> => {
        let result = false;
        let newState = { ...this.state };
        await axios.patch((new Router(process.env.BASE_URL).apiGet("user_profile_edit", { 'id': this.state.user?.id })), { name, value })
            .then(res => {
                this.onTextFieldCalcel(name);
                newState.user![ name as UserFields ] = value;
                result = true;
                Authentication.setToken(res.data);
            })
            .catch(err => {
                console.error(err);
                console.error(err.response.data);
                newState.errors[ name as UserFields ] = err.response.data;
                result = false;
            });
        this.setState(newState);
        return result;
    };

    onTextFieldCalcel = (name: string) => {
        let newState = { ...this.state };
        delete newState.errors[ name as UserFields ];
        this.setState(newState);
    };

    timeout(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    render(): JSX.Element {
        return (
            <Layout title="perfil">
                {this.state.user ? (
                    <div className="container mt-5">
                        <div className="card round main-2">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <EditableTextField value={this.state.user.username}
                                            name="username"
                                            title="Usuario"
                                            errorMsg={this.state.errors.username}
                                            onTextFieldEdit={this.onTextFieldEdit}
                                            onTextFieldCacel={this.onTextFieldCalcel}
                                        />
                                        <EditableTextField
                                            name="email"
                                            value={this.state.user.email}
                                            errorMsg={this.state.errors.email}
                                            title="Correo"
                                            onTextFieldEdit={this.onTextFieldEdit}
                                            onTextFieldCacel={this.onTextFieldCalcel}
                                        />
                                    </div>
                                    <div className="col-md-6 border-left">
                                        <EditableTextField
                                            name="name"
                                            value={this.state.user.username}
                                            errorMsg={this.state.errors.name}
                                            title="Nombre"
                                            onTextFieldEdit={this.onTextFieldEdit}
                                            onTextFieldCacel={this.onTextFieldCalcel}
                                        />
                                        <b className="field-title">roles:</b>
                                        <br />
                                        {this.state.user.roles.map(role => {
                                            return (
                                                <span
                                                    className="btn btn-sm2 alert-info cursor-normal"
                                                    key={role}
                                                >
                                                    {role.substring(5).toLowerCase()}
                                                </span>
                                            );
                                        })}
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                        <Loader />
                    )}
            </Layout>
        );
    }
}