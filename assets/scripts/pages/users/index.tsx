import ButtonAction from '@components/buttons/bottonAction';
import Button from '@components/buttons/button';
import Action from '@components/buttons/table/action';
import ButtonDelete from '@components/buttons/table/delete';
import Column from '@components/grid/column';
import Layout from '@components/layout';
import LoaderH from '@components/loader/loaderH';
import RoleBadge from '@components/misc/roleBadge';
import Alert, { AlertPropsI, FinishedAlertState, FinishedStateTypes } from '@components/modals/alert';
import Modal from '@components/modals/modal';
import Panel, { PanelPropsI } from '@components/panel';
import Search from '@components/search/search';
import Tbody from '@components/tables/tbody';
import PasswordFormAdmin from '@scripts/forms/user/passwordAdmin';
import Authentication, { UserI } from '@services/authentication';
import HandleResponse from '@services/handleResponse';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';

const AddForm = React.lazy(() => import('@scripts/forms/user/add'));
const UserShow = React.lazy(() => import('@components/user/show'));
interface UsersStateI {
    modal: {
        show: boolean;
        size: number;
        title: string;
    };
    alert: AlertPropsI;
    impersonateLoading: number[];
    redirectLogger: number;
}
export default class Users extends Panel<UserI, UsersStateI> {

    protected modalContent: JSX.Element;

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
                children: "Correo",
                style: {
                    width: "1px",
                },
            }, {
                children: "Puesto",
                style: {
                    width: "1px",
                },
            }, {
                key: "password",
                children: <FontAwesomeIcon icon={[ 'fas', 'key' ]} />,
                className: "icon-col border-right-0",
            }, {
                key: "logs",
                children: <FontAwesomeIcon icon={[ 'fas', 'book' ]} />,
                className: "icon-col border-right-0 border-left-0",
            }, {
                key: "impersonate",
                children: <FontAwesomeIcon icon={[ 'fas', 'user-tie' ]} />,
                className: "icon-col border-right-0 border-left-0",
            }, {
                key: "delete",
                children: <FontAwesomeIcon icon={[ 'fas', 'trash-alt' ]} />,
                className: "icon-col border-left-0",
            },
        ];
        this.route = "user_all";
        this.modalContent = <LoaderH position="center" />;
    }

    componentDidMount = () => {
        this.setSubState({
            modal: {
                show: false,
                size: 50,
            },
            alert: {
                id: 0,
                message: <></>,
                onAccept: this.handleAcceptDelete,
                onCancel: this.handleCancelDelete,
                show: false,
            },
            impersonateLoading: [],
            redirectLogger: 0,
        });
        this.update();
    };

    handleCloseModal = () => {
        this.setSubState({
            modal: {
                ...this.getSubState().modal,
                show: false,
            },
        });
    };

    handleAddUser = () => {
        this.modalContent = (
            <AddForm
                onSuccess={(res: AxiosResponse) => {
                    HandleResponse.success(res, this.props.toasts);
                    this.setSubState({
                        modal: {
                            ...this.getSubState().modal,
                            show: false,
                        },
                    });
                    this.update({ silent: true });
                }}
                onError={(err: AxiosError) => {
                    return HandleResponse.error(err, this.props.toasts)?.message;
                }}
            />
        );
        this.setSubState({
            modal: {
                title: "Agregar",
                show: true,
                size: 30,
            }
        });
    };

    handleSearch = (data: string) => {
        this.params.search = data;
        this.params.page = 1;
        this.update();
    };

    handleDelete = (id: number, extra: JSX.Element) => {
        this.setSubState({
            alert: {
                ...this.getSubState().alert,
                ...{
                    show: true,
                    id: id,
                    message: (<>¿Eliminar a {extra}?</>),
                }
            }
        });
    };

    handleAcceptDelete = async (id: number): Promise<FinishedAlertState> => {
        let message: string;
        let type: FinishedStateTypes;
        let res;
        try {
            res = await axios.delete(this.router.apiGet("user_delete", { id: id }));
            type = FinishedStateTypes.SUCCESS;
            message = HandleResponse.success(res);
            this.update({ silent: true });
        } catch (err) {
            type = FinishedStateTypes.ERROR;
            message = HandleResponse.error(err)!.message;
        }
        return {
            type: type,
            message: message,
        };
    };

    handleCancelDelete = (id: number) => {
        this.setSubState({
            alert: {
                ...this.getSubState().alert,
                ...{
                    show: false
                }
            }
        });
    };

    handleRowClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
        const row = e.currentTarget.closest("tr")!;
        const toShow = this.getEntities().find((user) => {
            return user.id == +row.dataset.id!;
        }) as UserI;
        this.modalContent = (
            <UserShow
                key={toShow.id}
                user={toShow}
                callback={() => {
                    this.update({ silent: true });
                }}
            />
        );
        const user = this.getEntities().find(us => us.id === +row.dataset.id!);
        this.setSubState({
            modal: {
                title: `<b>${user!.name}</b> | <em>${user!.username}</em>`,
                show: true,
                size: 50,
            },
        });
    };

    handlePasswordClick = (id: number) => {
        this.modalContent = (
            <PasswordFormAdmin
                id={id}
                onSuccess={(res) => {
                    HandleResponse.success(res, this.props.toasts);
                    this.setSubState({
                        modal: {
                            show: false,
                        }
                    });
                }}
            />
        );
        const user = this.getEntities().find(us => us.id === id);
        this.setSubState({
            modal: {
                title: `<b>${user!.name}</b> | <em>${user!.username}</em>`,
                show: true,
                size: 30,
            },
        });
    };

    handleImpersonateClick = async (id: number) => {
        let loadingStates = this.getSubState().impersonateLoading.slice();
        loadingStates.push(id);
        this.setSubState({
            impersonateLoading: loadingStates,
        });
        try {
            await Authentication.impersonate(id);
            window.location.href = this.router.get("dashboard");
        } catch (err) {
            HandleResponse.error(err, this.props.toasts);
            let loadingStates2 = this.getSubState().impersonateLoading.slice();
            loadingStates2.splice(loadingStates2.findIndex(x => x === id), 1);
            this.setSubState({
                impersonateLoading: loadingStates2,
            });
        }
    };

    handleLoadLogger = (id: number) => {
        this.setSubState({
            redirectLogger: id
        });
    };

    render = (): JSX.Element => {
        return (
            <Layout title="Usuarios">
                {
                    (this.getSubState().redirectLogger > 0)
                        ? (
                            <Redirect to={{
                                pathname: this.router.get("logger"),
                                state: { id: this.getSubState().redirectLogger }
                            }} />
                        )
                        : (
                            <>
                                <this.MainBar>
                                    <Column size={3}>
                                        <Button
                                            color="primary"
                                            content="Agregar usuario"
                                            extraClass="w-100"
                                            onClick={this.handleAddUser}
                                        />
                                    </Column>
                                    <Column size={6}>
                                        <Search callback={this.handleSearch} />
                                    </Column>
                                </this.MainBar>
                                <this.MainTable>
                                    <Tbody rows={
                                        this.getEntities().map(user => {
                                            return {
                                                id: user.id.toString(),
                                                "data-id": user.id.toString(),
                                                cells: [
                                                    {
                                                        key: "id",
                                                        children: <b>{user.id}</b>,
                                                        className: "text-right cursor-pointer",
                                                        onClick: this.handleRowClick,
                                                    },
                                                    {
                                                        key: "username",
                                                        children: <em>{user.username}</em>,
                                                        className: "cursor-pointer",
                                                        onClick: this.handleRowClick,
                                                    },
                                                    {
                                                        key: "name",
                                                        children: <b>{user.name}</b>,
                                                        className: "cursor-pointer",
                                                        onClick: this.handleRowClick,
                                                    },
                                                    {
                                                        key: "email",
                                                        children: <ButtonAction type="mailto" content={user.email} />
                                                    },
                                                    {
                                                        key: "role",
                                                        className: "cursor-pointer",
                                                        children: <RoleBadge role={user.roles[ 0 ]} />,
                                                        onClick: this.handleRowClick,
                                                    }, {
                                                        key: "password",
                                                        className: "border-right-0",
                                                        children:
                                                            (<Action<number>
                                                                id={user.id}
                                                                color='danger'
                                                                content={<FontAwesomeIcon icon={[ 'fas', 'key' ]} />}
                                                                onClick={this.handlePasswordClick}
                                                            />),
                                                    }, {
                                                        key: "logs",
                                                        className: "border-right-0 border-left-0",
                                                        children:
                                                            (<Action<number>
                                                                id={user.id}
                                                                color='secondary'
                                                                content={<FontAwesomeIcon icon={[ 'fas', 'book' ]} />}
                                                                onClick={this.handleLoadLogger}
                                                            />),
                                                    }, {
                                                        key: "impersonate",
                                                        className: "border-right-0 border-left-0",
                                                        children:
                                                            (<Action<number>
                                                                key={"_action_" + user.id}
                                                                id={user.id}
                                                                color='info'
                                                                content={<FontAwesomeIcon icon={[ 'fas', 'user-tie' ]} />}
                                                                loading={this.getSubState().impersonateLoading.findIndex(x => x === user.id) >= 0}
                                                                onClick={this.handleImpersonateClick}
                                                            />),
                                                    }, {
                                                        key: "delete",
                                                        className: "border-left-0",
                                                        children:
                                                            (<ButtonDelete<number>
                                                                id={user.id}
                                                                extra={<b>{user.name}{' ('}<em>{user.username}</em>{')'}</b>}
                                                                onClick={this.handleDelete}
                                                            />),
                                                    },
                                                ]
                                            };
                                        })
                                    }
                                    />
                                </this.MainTable>
                                <Modal
                                    onClose={this.handleCloseModal}
                                    name="form"
                                    loading={false}
                                    {...this.getSubState().modal}
                                >
                                    <Suspense fallback={<LoaderH position="center" />}>
                                        {this.modalContent}
                                    </Suspense>
                                </Modal>
                                <Alert<number>
                                    {...this.getSubState().alert}
                                />
                            </>
                        )
                }

            </Layout>
        );
    };
}