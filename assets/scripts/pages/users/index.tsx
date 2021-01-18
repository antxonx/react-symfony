import Button from '@components/buttons/button';
import Column from '@components/grid/column';
import Row from '@components/grid/row';
import Layout from '@components/layout';
import React, { Suspense } from 'react';
import Table from '@components/tables/table';
import Thead from '@components/tables/thead';
// import Tbody from '@components/tables/tbody';
import { UserI } from '@services/authentication';
import Loader from '@components/loader/loader';

const Tbody = React.lazy(() => import('@components/tables/tbody'));

interface UsersPropsI {

}

interface UsersStateI {
    users: UserI[];
    laoding: boolean;
}

export default class Users extends React.Component<UsersPropsI, UsersStateI> {
    constructor (props: UsersPropsI) {
        super(props);
        this.state = {
            users: [],
            laoding: true,
        };
    }

    handleAddUser = () => {
        console.log("add");
    };

    componentDidMount = () => {
        this.setState({
            users: [
                {
                    name: "Juan",
                    username: "juanito",
                    id: 1,
                    email: "juanito@juan.com",
                    roles: [ "ROLE_USER" ]
                },
                {
                    name: "Pedor",
                    username: "pedrito",
                    id: 2,
                    email: "pedrito@juan.com",
                    roles: [ "ROLE_USER" ]
                },
            ]
        });
    };

    render = (): JSX.Element => {
        return (
            <Layout title="Usuarios">
                <Row extraClass="my-2">
                    <Column size={3}>
                        <Button
                            color="primary"
                            content="Agregar usuario"
                            extraClass="w-100"
                            onClick={this.handleAddUser}
                        />
                    </Column>
                </Row>
                <Suspense fallback={<Loader />}>
                    <Table>
                        <Thead cells={[
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
                        ]}
                        />
                        <Tbody rows={this.state.users.map(user => {
                            return {
                                id: user.id.toString(),
                                cells: [
                                    {
                                        name: "id",
                                        children: user.id
                                    },
                                    {
                                        name: "username",
                                        children: user.username
                                    },
                                    {
                                        name: "name",
                                        children: user.name
                                    },
                                    {
                                        name: "email",
                                        children: user.email
                                    },
                                ]
                            };
                        })}
                        />

                    </Table>
                </Suspense>
            </Layout>
        );
    };
}