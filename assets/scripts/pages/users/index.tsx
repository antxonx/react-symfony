import ButtonAction from '@components/buttons/bottonAction';
import Action from '@components/buttons/table/action';
import ButtonDelete from '@components/buttons/table/delete';
import LoaderH from '@components/loader/loaderH';
import RoleBadge from '@components/misc/roleBadge';
import { FinishedAlertState, FinishedStateTypes } from '@components/modals/alert';
import Panel, { PanelPropsI, PanelStateI } from '@components/panel';
import Search from '@components/search/search';
import Tbody from '@components/tables/tbody';
import Authentication, { UserI } from '@services/authentication';
import HandleResponse from '@services/handleResponse';
import { AxiosError, AxiosResponse } from 'axios';
import axios from '@services/axios';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import { TdPropsI, ThPropsI } from '@components/tables';
import { Button } from 'antd';
import { Column } from '@components/grid';

const PasswordFormAdmin = React.lazy(() => import('@scripts/forms/user/passwordAdmin'));
const AddForm = React.lazy(() => import('@scripts/forms/user/add'));
const UserShow = React.lazy(() => import('@components/user/show'));

interface UserPropsI extends PanelPropsI {

}


interface UsersStateI extends PanelStateI<UserI> {
    impersonateLoading: number[];
    redirectLogger: number;
}
export default class Users extends Panel<UserI, UserPropsI, UsersStateI> {

    protected fade: boolean;

    constructor (props: PanelPropsI) {
        super(props);
        let impersonatorCell: ThPropsI, logsCell: ThPropsI;
        if (this.roles.includes("ROLE_DEV")) {
            impersonatorCell = {
                name: "impersonate",
                key: "impersonate",
                children: <FontAwesomeIcon icon={[ 'fas', 'user-tie' ]} />,
                className: "icon-col border-right-0 border-left-0",
            };
            logsCell = {
                name: "logs",
                key: "logs",
                children: <FontAwesomeIcon icon={[ 'fas', 'book' ]} />,
                className: "icon-col border-right-0 border-left-0",
            };
        } else {
            impersonatorCell = {
                name: "impersonate",
                key: "impersonate",
                className: "d-none",
            };
            logsCell = {
                name: "logs",
                key: "logs",
                className: "d-none",
            };
        }
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
                content: <LoaderH position="center" />,
                onClose: this.handleCloseModal,
                onHide: this.handleHideModal,
            },
            alert: {
                id: 0,
                message: <></>,
                onAccept: this.handleAcceptAlert,
                onCancel: this.handleCancelAlert,
                onHide: this.handleHideAlert,
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
                },
                logsCell,
                impersonatorCell, {
                    name: "delete",
                    key: "delete",
                    children: <FontAwesomeIcon icon={[ 'fas', 'trash-alt' ]} />,
                    className: "icon-col border-left-0",
                },
            ],
            active: {
                modal: false,
                alert: false,
            }
        };
        this.route = "user_all";
        this.fade = false;
    }

    componentDidMount = () => {
        this.update();
    };

    onPageChange = () => {
        this.fade = true;
    };

    handleAddUser = () => {
        this.setModal({
            ...this.state.modal,
            title: "Agregar",
            show: true,
            size: 30,
            content: (
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
            )
        });
    };

    handleSearch = (data: string) => {
        this.params.search = data;
        this.params.page = 1;
        this.fade = true;
        this.update();
    };

    handleDelete = (id: number, extra: JSX.Element) => {
        this.setAlert({
            ...this.state.alert,
            ...{
                show: true,
                id: id,
                message: (<>¿Eliminar a {extra}?</>),
            }
        });
    };

    handleAcceptAlert = async (id: number): Promise<FinishedAlertState> => {
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

    handleRowClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
        const row = e.currentTarget.closest("tr")!;
        const toShow = this.getEntities().find((user) => {
            return user.id == +row.dataset.id!;
        }) as UserI;
        const user = this.getEntities().find(us => us.id === +row.dataset.id!);
        this.setModal({
            ...this.state.modal,
            title: `<b>${user!.name}</b> | <em>${user!.username}</em>`,
            show: true,
            size: 50,
            content: (
                <UserShow
                    key={toShow.id}
                    user={toShow}
                    callback={() => {
                        this.update({ silent: true });
                    }}
                />
            )
        });
    };

    handlePasswordClick = (id: number) => {
        const user = this.getEntities().find(us => us.id === id);
        this.setModal({
            ...this.state.modal,
            title: `<b>${user!.name}</b> | <em>${user!.username}</em>`,
            show: true,
            size: 30,
            content: (
                <PasswordFormAdmin
                    id={id}
                    onSuccess={(res) => {
                        HandleResponse.success(res, this.props.toasts);
                        this.manuallyCloseModal();
                    }}
                />
            )
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

    handleThClick = (name: string) => {
        const header = this.handleThClickBG(name, this.state.header.slice());
        this.setState({
            header: header,
        });
        this.fade = true;
        this.update();
    };

    render = (): JSX.Element => {
        let extraTableClass = "result-table";
        if (this.state.loading && this.fade) {
            extraTableClass += " hide";
        }
        return (
            <this.Layout title="Usuarios">
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
                                            type="primary"
                                            className="w-100 round"
                                            onClick={this.handleAddUser}
                                        >
                                            Agregar usaurio
                                        </Button>
                                    </Column>
                                    <Column size={6} extraClass="my-1">
                                        <Search callback={this.handleSearch} />
                                    </Column>
                                </this.MainBar>
                                <this.MainTable extraTableClass={extraTableClass} noLoader={this.fade}>
                                    <Tbody rows={
                                        this.getEntities().map(user => {
                                            let impersonatorCell: TdPropsI, logsCell: TdPropsI;
                                            if (this.roles.includes("ROLE_DEV")) {
                                                impersonatorCell = {
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
                                                };
                                                logsCell = {
                                                    key: "logs",
                                                    className: "border-right-0 border-left-0",
                                                    children:
                                                        (<Action<number>
                                                            id={user.id}
                                                            color='secondary'
                                                            content={<FontAwesomeIcon icon={[ 'fas', 'book' ]} />}
                                                            onClick={this.handleLoadLogger}
                                                        />),
                                                };
                                            } else {
                                                impersonatorCell = {
                                                    key: "impersonate",
                                                    className: "d-none",
                                                };
                                                logsCell = {
                                                    key: "logs",
                                                    className: "d-none",
                                                };
                                            }
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
                                                    },
                                                    logsCell,
                                                    impersonatorCell, {
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
                            </>
                        )
                }
            </this.Layout>
        );
    };
}