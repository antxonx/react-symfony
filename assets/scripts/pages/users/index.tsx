import Button from '@components/buttons/button';
import Column from '@components/grid/column';
import Row from '@components/grid/row';
import Layout from '@components/layout';
import React from 'react';
import { Table, Thead, Tbody, ThPropsI } from '@components/tables';
import { UserI } from '@services/authentication';
import TableLoader from '@components/loader/tableLoader';
import axios from '@services/axios';
import { Router } from '@scripts/router';
import HandleResponse from '@services/handleResponse';
import { ToastEventsI } from '@scripts/app';


interface UsersPropsI {
    toasts: ToastEventsI;
}

interface UsersStateI {
    users: UserI[];
    laoding: boolean;
}

export default class Users extends React.Component<UsersPropsI, UsersStateI> {

    protected readonly header: ThPropsI[];

    constructor (props: UsersPropsI) {
        super(props);
        this.state = {
            users: [],
            laoding: false,
        };
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

    handleAddUser = () => {
        console.log("add");
    };

    componentDidMount = () => {
        this.setState({
            laoding: true,
        });
        axios.get((new Router(process.env.BASE_URL)).apiGet("user_all"))
            .then(res => {
                this.setState({
                    users: res.data,
                });
                this.setState({
                    laoding: false,
                });
            })
            .catch(err => {
                HandleResponse.error(err, this.props.toasts);
            });
    };

    render = (): JSX.Element => {
        return (
            <Layout title="Usuarios">
                <Row extraClass="my-2 mx-1">
                    <Column size={3}>
                        <Button
                            color="primary"
                            content="Agregar usuario"
                            extraClass="w-100"
                            onClick={this.handleAddUser}
                        />
                    </Column>
                </Row>

                <Table>
                    <Thead cells={this.header} />
                    {this.state.laoding ?
                        <TableLoader colSpan={this.header.length} /> : (
                            <Tbody rows={this.state.users.map(user => {
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
                        )}
                </Table>
            </Layout>
        );
    };
}