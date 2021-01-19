import Button from '@components/buttons/button';
import Column from '@components/grid/column';
import Layout from '@components/layout';
import LoaderH from '@components/loader/loaderH';
import Modal from '@components/modals/modal';
import Panel, { PanelPropsI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import { UserI } from '@services/authentication';
import HandleResponse from '@services/handleResponse';
import { AxiosError, AxiosResponse } from 'axios';
import React, { Suspense } from 'react';

const AddForm = React.lazy(() => import('@scripts/forms/user/add'));
interface UsersStateI {
    formModalOpen: boolean;
}
export default class Users extends Panel<UserI, UsersStateI> {
    constructor (props: PanelPropsI) {
        super(props);
        this.header = [
            {
                children: "Id",
                className: "text-right",
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
        this.route = "user_all";
    }

    handleCloseModal = (_: string) => {
        this.setSubState({
            formModalOpen: false,
        });
    };

    handleAddUser = () => {
        this.setSubState({
            formModalOpen: true,
        });
    };

    componentDidMount = () => {
        this.setSubState({
            formModalOpen: false,
        });
        this.update();
    };

    render = (): JSX.Element => {
        return (
            <Layout title="Usuarios">
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
                    <Tbody rows={this.state.requestResult.entities.map(user => {
                        return {
                            id: user.id.toString(),
                            cells: [
                                {
                                    name: "id",
                                    children: <b>{user.id}</b>,
                                    className: "text-right",
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
                <Modal
                    show={this.state.state.formModalOpen}
                    onClose={this.handleCloseModal}
                    name="form"
                    size={30}
                    title="Contraseña"
                    loading={!this.state.state.formModalOpen}
                >
                    <Suspense fallback={<LoaderH position="center" />}>
                        <AddForm
                            onSuccess={(res: AxiosResponse) => {
                                HandleResponse.success(res, this.props.toasts);
                                this.setSubState({
                                    formModalOpen: false,
                                });
                             }}
                            onError={(err: AxiosError) => { 
                                return HandleResponse.error(err, this.props.toasts)?.message;
                            }}
                        />
                    </Suspense>
                </Modal>
            </Layout>
        );
    };
}