import Button from '@components/buttons/button';
import Column from '@components/grid/column';
import Layout from '@components/layout';
import Panel, { PanelPropsI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import { UserI } from '@services/authentication';
import React from 'react';
export default class Users extends Panel<UserI> {
    constructor (props: PanelPropsI) {
        super(props);
        this.header = [
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
        ];
    }

    componentDidMount = () => {
        this.setRoute(this.router.apiGet("user_all"));
        this.update();
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