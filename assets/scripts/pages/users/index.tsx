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
import Panel, { PanelPropsI, PanelStateI } from '@components/panel';
import Search from '@components/search/search';
import Tbody from '@components/tables/tbody';
import PasswordFormAdmin from '@scripts/forms/user/passwordAdmin';
import Authentication, { UserI } from '@services/authentication';
import HandleResponse from '@services/handleResponse';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { Suspense } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import { ThPropsI } from '@components/tables';

const AddForm = React.lazy(() => import('@scripts/forms/user/add'));
const UserShow = React.lazy(() => import('@components/user/show'));

interface UserPropsI extends PanelPropsI {

}

interface UsersStateI extends PanelStateI<UserI> {
    modal: {
        show: boolean;
        size: number;
        title: string;
    };
    alert: AlertPropsI;
    impersonateLoading: number[];
    redirectLogger: number;
}
export default class Users extends Panel<UserI, UserPropsI, UsersStateI> {

    protected modalContent: JSX.Element;

    protected fade: boolean;

    constructor (props: PanelPropsI) {
        super(props);
        this.state = {
            loading: false,
            requestResult: {
                entities: [],
                maxPages: 0,
                showed: 0,
                total: 0,
            },
            modal: {
                title: "",
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
            header: [
                {
                    name: "Id",
                    column: "id",
                    sort: true,
                    onClick: this.handleThClick,
                    style: {
                        width: "100px"
                    }
                }, {
                    name: "Usuario",
                    column: "username",
                    sort: true,
                    onClick: this.handleThClick,
                }, {
                    name: "Nombre",
                    column: "name",
                    sort: true,
                    onClick: this.handleThClick,
                }, {
                    name: "Correo",
                    style: {
                        width: "1px",
                    },
                }, {
                    name: "Puesto",
                    style: {
                        width: "1px",
                    },
                }, {
                    name: "password",
                    key: "password",
                    children: <FontAwesomeIcon icon={[ 'fas', 'key' ]} />,
                    className: "icon-col border-right-0",
                }, {
                    name: "logs",
                    key: "logs",
                    children: <FontAwesomeIcon icon={[ 'fas', 'book' ]} />,
                    className: "icon-col border-right-0 border-left-0",
                }, {
                    name: "impersonate",
                    key: "impersonate",
                    children: <FontAwesomeIcon icon={[ 'fas', 'user-tie' ]} />,
                    className: "icon-col border-right-0 border-left-0",
                }, {
                    name: "delete",
                    key: "delete",
                    children: <FontAwesomeIcon icon={[ 'fas', 'trash-alt' ]} />,
                    className: "icon-col border-left-0",
                },
            ]
        };
        this.route = "user_all";
        this.modalContent = <LoaderH position="center" />;
        this.fade = false;
    }

    componentDidMount = () => {
        this.update();
    };

    onPageChange = () => {
        this.fade = true;
    };

    handleCloseModal = () => {
        this.setState({
            modal: {
                ...this.state.modal,
                show: false,
            }
        });
    };

    handleThClick = (name: string) => {
        console.log(name);
        const th =  Object.assign({}, this.state.header.find(t => t.name === name));
        const headerCopy = this.unsetSorts(this.state.header.slice());
        if (th.activeOrder) {
            if (th.order === "ASC") {
                th.order = "DESC";
            } else {
                th.order = "ASC";
            }
        } else {
            th.activeOrder = true;
            th.order = "ASC";
        }
        headerCopy[headerCopy.findIndex(t => t.name === name)] = th;
        this.setState({
            header: headerCopy
        });
        this.params.orderBy = th.column!;
        this.params.order = th.order;
        this.params.page = 1;
        this.update();
    };

    unsetSorts = (ths: ThPropsI[]): ThPropsI[] => {
        return ths.map(th => {
            return {
                ...th,
                activeOrder: false,
                order: undefined
            }
        })
    }

    handleAddUser = () => {
        this.modalContent = (
            <AddForm
                onSuccess={(res: AxiosResponse) => {
                    HandleResponse.success(res, this.props.toasts);
                    this.setState({
                        modal: {
                            ...this.state.modal,
                            show: false,
                        }
                    });
                    this.update({ silent: true });
                }}
                onError={(err: AxiosError) => {
                    return HandleResponse.error(err, this.props.toasts)?.message;
                }}
            />
        );
        this.setState({
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
        this.setState({
            alert: {
                ...this.state.alert,
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
        this.setState({
            alert: {
                ...this.state.alert,
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
        this.setState({
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
                    this.setState({
                        modal: {
                            ...this.state.modal,
                            show: false,
                        }
                    });
                }}
            />
        );
        const user = this.getEntities().find(us => us.id === id);
        this.setState({
            modal: {
                title: `<b>${user!.name}</b> | <em>${user!.username}</em>`,
                show: true,
                size: 30,
            },
        });
    };

    handleImpersonateClick = async (id: number) => {
        let loadingStates = this.state.impersonateLoading.slice();
        loadingStates.push(id);
        this.setState({
            impersonateLoading: loadingStates,
        });
        try {
            await Authentication.impersonate(id);
            window.location.href = this.router.get("dashboard");
        } catch (err) {
            HandleResponse.error(err, this.props.toasts);
            let loadingStates2 = this.state.impersonateLoading.slice();
            loadingStates2.splice(loadingStates2.findIndex(x => x === id), 1);
            this.setState({
                impersonateLoading: loadingStates2,
            });
        }
    };

    handleLoadLogger = (id: number) => {
        this.setState({
            redirectLogger: id
        });
    };

    render = (): JSX.Element => {
        let extraTableClass = "result-table";
        if (this.state.loading && this.fade) {
            extraTableClass += " hide";
        }
        return (
            <Layout title="Usuarios">
                {
                    (this.state.redirectLogger > 0)
                        ? (
                            <Redirect to={this.router.get("logger") + "?user=" + this.state.redirectLogger} />
                        )
                        : (
                            <>
                                <this.MainBar>
                                    <Column size={3} extraClass="my-1">
                                        <Button
                                            color="primary"
                                            content="Agregar usuario"
                                            extraClass="w-100"
                                            onClick={this.handleAddUser}
                                        />
                                    </Column>
                                    <Column size={6} extraClass="my-1">
                                        <Search callback={this.handleSearch} />
                                    </Column>
                                </this.MainBar>
                                <this.MainTable extraTableClass={extraTableClass} noLoader={this.fade}>
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
                                                                loading={this.state.impersonateLoading.findIndex(x => x === user.id) >= 0}
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
                                    {...this.state.modal}
                                >
                                    <Suspense fallback={<LoaderH position="center" />}>
                                        {this.modalContent}
                                    </Suspense>
                                </Modal>
                                <Alert<number>
                                    {...this.state.alert}
                                />
                            </>
                        )
                }

            </Layout>
        );
    };
}