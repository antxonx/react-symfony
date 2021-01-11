import React from 'react';
import axios from '@services/axios';
import { UserI } from '@scripts/services/authentication';
import { Router } from '@scripts/router';
import Layout from '@scripts/components/layout';
import Loader from '@scripts/components/loader';

interface ProfileStateI {
    user: UserI | null;
}

export default class Profile extends React.Component<{}, ProfileStateI>{

    public constructor (props: {}) {
        super(props);
        this.state = {
            user: null
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

    render(): JSX.Element {
        return (
            <Layout title="perfil">
                {this.state.user ? (
                    <div className="container mt-5">
                        <div className="card round main-2">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <b className="field-title">Usuario:</b>
                                        <br />
                                        <a className="editable-field" href="#" data-name="username" data-type="text" data-pk="" data-url="" data-title="Ingresa el usuario">{this.state.user.username}</a>
                                        <br />
                                        <b className="field-title">Correo:</b>
                                        <br />
                                        <a className="editable-field" href="#" data-name="email" data-type="text" data-pk="" data-url="" data-title="Ingresa el correo">{this.state.user.email}</a>
                                        <br />

                                    </div>
                                    <div className="col-md-6 border-left">
                                        <b className="field-title">Nombre:</b>
                                        <br />
                                        <a className="editable-field" href="#" data-name="name" data-type="text" data-pk="" data-url="" data-title="Ingresa el nombre">{this.state.user.username}</a>
                                        <br />
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