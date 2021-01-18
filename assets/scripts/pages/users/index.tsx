import Button from '@components/buttons/button';
import Column from '@components/grid/column';
import Layout from '@components/layout';
import Panel, { PanelPropsI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import { Router } from '@scripts/router';
import { UserI } from '@services/authentication';
import axios from '@services/axios';
import HandleResponse from '@services/handleResponse';
import React from 'react';
export default class Users extends Panel<UserI> {
    constructor (props: PanelPropsI) {
        super(props, [
            {
                children: "Id",
                style: {
                    width: "100px"
                }
            }, {
                children: "Usuario"
            }, {
                children: "Nombre"
            }, {
                children: "Correo"
            }
        ]);
    }

    componentDidMount = () => {
        this.update();
    };

    update = () => {
        this.setLoading();
        axios.get(this.router.apiGet("user_all"))
            .then(res => {
                this.setEntities(res.data);
                this.unsetLoading();
            })
            .catch(err => {
                HandleResponse.error(err, this.props.toasts);
            });
    };

    handleAddUser = () => {
        console.log("add");
    };

    render = (): JSX.Element => {
        return (
            <Layout>
                <this.MainBar>
                    <Column size={3}>
                        <Button
                            color="primary"
                            content="Agregar usuario"
                            extraClass="w-100"
                            onClick={this.handleAddUser}
                        />
                    </Column>
                </this.MainBar>
                <this.MainTable head={this.header}>
                    <Tbody rows={this.state.entities.map(user => {
                        return {
                            id: user.id.toString(),
                            cells: [
                                {
                                    name: "id",
                                    children: <b>{user.id}</b>
                                },
                                {
                                    name: "username",
                                    children: <em>{user.username}</em>
                                },
                                {
                                    name: "name",
                                    children: <b>{user.name}</b>
                                },
                                {
                                    name: "email",
                                    children: user.email
                                },
                            ]
                        };
                    })}
                    />
                </this.MainTable>
            </Layout>
        );
    };
}