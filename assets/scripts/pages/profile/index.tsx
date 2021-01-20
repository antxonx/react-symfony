import React, { Suspense } from 'react';
import axios from '@services/axios';
import { UserI } from '@services/authentication';
import { Router } from '@scripts/router';
import Layout from '@components/layout';
import EditableTextField from '@components/editable/editableTextField';
import Column from '@components/grid/column';
import Row from '@components/grid/row';
import Button from '@components/buttons/button';
import Modal from '@components/modals/modal';
import LoaderH from '@components/loader/loaderH';
import Card from '@components/cards/card';
import HandleResponse from '@scripts/services/handleResponse';
import { ToastEventsI } from '@scripts/app';
import RoleBadge from '@components/misc/roleBadge';

const PasswordForm = React.lazy(() => import('@scripts/forms/user/password'));

interface ProfilePropsI {
    toasts: ToastEventsI;
}

interface ProfileStateI {
    user: UserI | null;
    errors: {
        username?: string;
        email?: string;
        name?: string;
    };
    passwordModalOpen: boolean;
}

declare type UserFields = "username" | "email" | "name";

export default class Profile extends React.Component<ProfilePropsI, ProfileStateI>{

    public constructor (props: ProfilePropsI) {
        super(props);
        this.state = {
            user: null,
            errors: {},
            passwordModalOpen: false,
        };
    }

    componentDidMount = () => {
        axios.get((new Router(process.env.BASE_ROUTE)).apiGet("user_profile"))
            .then(res => {
                this.setState({ user: JSON.parse(HandleResponse.success(res)) as UserI });
            })
            .catch(err => {
                HandleResponse.error(err, this.props.toasts);
            });
    };

    onTextFieldEdit = async (name: string, value: string): Promise<boolean> => {
        if (this.state.user![ name as UserFields ] != value.trim()) {
            let result = false;
            let newState = { ...this.state };
            try {
                const res = await axios.patch(
                    (new Router(process.env.BASE_URL).apiGet(
                        "user_profile_edit", {
                        'id': this.state.user?.id
                    })), { name, value });
                HandleResponse.success(res, this.props.toasts);
                this.onTextFieldCalcel(name);
                newState.user![ name as UserFields ] = value;
                result = true;
                if (name == "username") {
                    window.location.reload();
                }
            } catch (err) {
                newState.errors[ name as UserFields ] = HandleResponse.error(err, this.props.toasts)?.message;
                result = false;
            }
            this.setState(newState);
            return result;
        } else {
            return true;
        }
    };

    onTextFieldCalcel = (name: string) => {
        let newState = { ...this.state };
        delete newState.errors[ name as UserFields ];
        this.setState(newState);
    };

    onClickChangePassword = () => {
        this.setState({
            passwordModalOpen: true,
        });
    };

    onPasswordModalClose = () => {
        this.setState({
            passwordModalOpen: false,
        });
    };

    render = (): JSX.Element => {
        return (
            <Layout title="Perfil">
                <div className="container mt-5">
                    <Card>
                        <Row>
                            <Column size={6}>
                                <EditableTextField value={this.state.user?.username}
                                    name="username"
                                    title="Usuario"
                                    errorMsg={this.state.errors.username}
                                    onTextFieldEdit={this.onTextFieldEdit}
                                    onTextFieldCacel={this.onTextFieldCalcel}
                                    wait={!this.state.user}
                                />
                                <EditableTextField
                                    name="email"
                                    value={this.state.user?.email}
                                    errorMsg={this.state.errors.email}
                                    title="Correo"
                                    onTextFieldEdit={this.onTextFieldEdit}
                                    onTextFieldCacel={this.onTextFieldCalcel}
                                    wait={!this.state.user}
                                />
                            </Column>
                            <Column size={6} extraClass="border-left">
                                <EditableTextField
                                    name="name"
                                    value={this.state.user?.name}
                                    errorMsg={this.state.errors.name}
                                    title="Nombre"
                                    onTextFieldEdit={this.onTextFieldEdit}
                                    onTextFieldCacel={this.onTextFieldCalcel}
                                    wait={!this.state.user}
                                />
                                {this.state.user && this.state.user.roles && (
                                    <div className="w-100">
                                        <small>
                                            <b>Puesto:</b>
                                        </small>
                                    </div>
                                )}
                                <ul className="list-group list-group-horizontal">
                                    {this.state.user?.roles.map(role => {
                                        if (role != "ROLE_USER") {
                                            return (
                                                <li key={role} className="list-group-item border-0 p-1">
                                                    <RoleBadge role={role} />
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                                <br />
                            </Column>
                        </Row>
                        <Row>
                            <Column size={6}>
                                <Row extraClass="mt-2">
                                    <Column size={6}>
                                        <Button
                                            color="danger"
                                            content="Cambiar contraseña"
                                            extraClass="w-100"
                                            name="changeClassButton"
                                            onClick={this.onClickChangePassword}
                                        />
                                    </Column>
                                    <Column size={6} />
                                </Row>
                                <Modal
                                    show={this.state.passwordModalOpen}
                                    onClose={this.onPasswordModalClose}
                                    size={50}
                                    title="Contraseña"
                                    loading={!this.state.passwordModalOpen}
                                >
                                    {this.state.passwordModalOpen && (
                                        <Suspense fallback={<LoaderH position="center" />}>
                                            <PasswordForm onSuccess={(res) => {
                                                HandleResponse.success(res, this.props.toasts);
                                                this.setState({
                                                    passwordModalOpen: false,
                                                });
                                            }} />
                                        </Suspense>
                                    )}
                                </Modal>
                            </Column>
                        </Row>
                    </Card>
                </div>
            </Layout>
        );
    };
}