import React, { Suspense } from 'react';
import { ToastEventsI } from '@scripts/app';
import { Table, Thead, ThPropsI } from '@components/tables';
import TableLoader from '@components/loader/tableLoader';
import { Router } from '@scripts/router';
import axios from '@services/axios';
import HandleResponse from '@services/handleResponse';
import Paginator from '@components/paginator/paginator';
import Authentication from '@services/authentication';
import Alert, { AlertPropsI, FinishedAlertState, FinishedStateTypes } from '@components/modals/alert';
import Layout from '@components/layout';
import Modal from '@components/modals/modal';
import LoaderH from '@components/loader/loaderH';
import { Alert as AlertBox } from 'antd';
import { Row } from '@components/grid';

export interface PanelPropsI {
    toasts: ToastEventsI;
}

export interface ModalI {
    show: boolean;
    size: number;
    title: string;
    content: JSX.Element;
    onHide?: (name: string) => void;
    onClose?: (name: string) => void;
}

export interface PanelStateI<RRS> {
    loading: boolean;
    requestResult: RequestResult<RRS>;
    header: ThPropsI[];
    modal: ModalI;
    alert: AlertPropsI;
    active: {
        modal: boolean;
        alert: boolean;
    };
}

interface RequestResult<RRT> {
    entities: RRT[];
    maxPages: number;
    showed: number;
    total: number;
}

export default class Panel<
    RRT,
    PT extends PanelPropsI = PanelPropsI,
    ST extends PanelStateI<RRT> = PanelStateI<RRT>
    > extends React.Component<PT, ST> {

    protected router: Router;

    protected route: string;

    protected roles: string[];

    protected params: {
        page: number;
        [ key: string ]: string | number;
    };

    constructor (props: PT) {
        super(props);
        this.route = "";
        this.params = {
            page: 1
        };
        this.router = new Router(process.env.BASE_URL);
        this.roles = Authentication.getRoles();
    }

    protected MainBar = (props: React.PropsWithChildren<{}>) => {
        return (
            <Row extraClass="my-2 mx-1">
                {props.children}
            </Row>
        );
    };

    protected setLoading = () => {
        this.setState({
            loading: true,
        });
    };

    protected unsetLoading = () => {
        this.setState({
            loading: false,
        });
    };

    protected setRequestResult = (result: RequestResult<RRT>) => {
        this.setState({
            requestResult: result,
        });
    };

    protected update = async (options?: { page?: number, silent?: boolean; }) => {
        this.params.page = options?.page || this.params.page;
        if (!options?.silent)
            this.setLoading();
        try {
            const res = await axios.get(this.router.apiGet(this.route, this.params));
            this.setRequestResult(JSON.parse(HandleResponse.success(res)));
            if (!options?.silent)
                this.unsetLoading();
        } catch (err) {
            HandleResponse.error(err, this.props.toasts);
        }
    };

    protected NoRegisters = (): JSX.Element => {
        return (
            <AlertBox
                className="round w-50 mx-auto mt-5"
                message="No hay registros."
                description="No se pudo encontrar registros con la petición realizada."
                type="info"
                showIcon
            />
        );
    };

    protected NoRoute = (): JSX.Element => {
        return (
            <AlertBox
                className="round w-50 mx-auto mt-5"
                message="No se ha seleccionado una ruta."
                description="Debe seleccionar una ruta para poder mostrar los resultados."
                type="info"
                showIcon
            />
        );
    };

    protected getEntities = (): RRT[] => {
        return this.state.requestResult.entities;
    };

    protected onPageChange = () => {

    };

    protected handleThClickBG = (name: string, header: ThPropsI[]) => {
        const th = Object.assign({}, header.find(t => t.name === name));
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
        header = this.unsetSorts(header);
        header[ header.findIndex(t => t.name === name) ] = th;
        this.params.orderBy = th.column!;
        this.params.order = th.order;
        this.params.page = 1;
        return header;
    };

    protected unsetSorts = (ths: ThPropsI[]): ThPropsI[] => {
        return ths.map(th => {
            return {
                ...th,
                activeOrder: false,
                order: undefined
            };
        });
    };

    protected manuallyCloseModal = () => {
        this.handleCloseModal();
        setTimeout(() => {
            this.handleHideModal();
        }, 1);
    };

    protected handleCloseModal = () => {
        this.setState({
            modal: {
                ...this.state.modal,
                show: false,
            }
        });
    };

    protected handleHideModal = () => {
        this.setState({
            modal: {
                ...this.state.modal,
                content: <></>,
            },
            active: {
                ...this.state.active,
                modal: false,
            }
        });
    };

    protected setModal = (modal: ModalI) => {
        this.setState({
            active: {
                ...this.state.active,
                modal: true,
            },
        });
        setTimeout(() => {
            this.setState({
                modal: modal
            });
        }, 1);
    };

    protected handleHideAlert = () => {
        this.setState({
            active: {
                ...this.state.active,
                alert: false,
            }
        });
    };

    protected handleAcceptAlert = async (id: any): Promise<FinishedAlertState> => {
        return {
            type: FinishedStateTypes.SUCCESS,
            message: "",
        };
    };

    protected handleCancelAlert = () => {
        this.setState({
            alert: {
                ...this.state.alert,
                ...{
                    show: false
                },
            },
        });
    };

    protected setAlert = (alert: AlertPropsI) => {
        this.setState({
            active: {
                ...this.state.active,
                alert: true,
            }
        });
        setTimeout(() => {
            this.setState({
                alert: alert
            });
        }, 1);
    };

    protected handleSearch = (data: string) => {
        this.params.page = 1;
        this.params.search = data;
        if (this.route != "")
            this.update();
    };

    protected Table = (props: React.PropsWithChildren<{
        extraTableClass?: string;
        striped?: string;
        noLoader?: boolean;
    }>): JSX.Element => {
        return (
            <>
                <Table extraClass={props.extraTableClass} striped={props.striped}>
                    <Thead cells={this.state.header} />
                    {
                        props.noLoader
                            ? props.children
                            : this.state.loading
                                ? <TableLoader colSpan={this.state.header.length} />
                                : props.children
                    }
                </Table>
                <Paginator
                    actual={this.params.page}
                    maxPages={this.state.requestResult.maxPages}
                    showed={this.state.requestResult.showed}
                    total={this.state.requestResult.total}
                    onClick={(page: number) => {
                        this.onPageChange();
                        this.params.page = page;
                        this.update();
                    }}
                />
            </>
        );
    };

    protected MainTable = (props: React.PropsWithChildren<{
        extraTableClass?: string;
        striped?: string;
        noLoader?: boolean;
    }>) => {
        return (
            <>
                {
                    (this.route.trim() === "")
                        ? <this.NoRoute />
                        : (this.state.requestResult.entities.length === 0 && !this.state.loading)
                            ? <this.NoRegisters />
                            : <this.Table children={props.children} {...props} />
                }
            </>
        );
    };

    protected Layout = (props: React.PropsWithChildren<{ title?: string; }>) => {
        return (
            <Layout title={props.title}>
                {props.children}
                {
                    this.state.active.modal && (
                        <Modal
                            onClose={this.handleCloseModal}
                            onHide={this.handleHideModal}
                            name="form"
                            loading={false}
                            {...this.state.modal}
                        >
                            <Suspense fallback={<LoaderH position="center" />}>
                                {this.state.modal.content}
                            </Suspense>
                        </Modal>
                    )
                }
                {
                    this.state.active.alert && <Alert<number>{...this.state.alert} />
                }
            </Layout>
        );
    };
}