import React from 'react';
import Row from '@components/grid/row';
import { ToastEventsI } from '@scripts/app';
import { Table, Thead, ThPropsI } from '@components/tables';
import TableLoader from '@components/loader/tableLoader';
import { Router } from '@scripts/router';
import axios from '@services/axios';
import HandleResponse from '@services/handleResponse';
import Paginator from '@components/paginator/paginator';


export interface PanelPropsI {
    toasts: ToastEventsI;
}

export interface PanelStateI<RRS> {
    loading: boolean;
    requestResult: RequestResult<RRS>;
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

    protected header: ThPropsI[];

    protected router: Router;

    protected route: string;

    protected params: {
        page: number;
        [ key: string ]: string | number;
    };

    constructor (props: PT) {
        super(props);
        this.route = "";
        this.header = [];
        this.params = {
            page: 1
        };
        this.router = new Router(process.env.BASE_URL);
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
            <div className="alert alert-dark container mt-5 round">
                No hay registos.
            </div>
        );
    };

    protected NoRoute = (): JSX.Element => {
        return (
            <div className="alert alert-dark container mt-5 round">
                No se ha seleccionado una ruta.
            </div>
        );
    };

    protected getEntities = (): RRT[] => {
        return this.state.requestResult.entities;
    };

    protected onPageChange = () => {

    };

    protected Table = (props: React.PropsWithChildren<{
        extraTableClass?: string;
        noLoader?: boolean;
    }>): JSX.Element => {
        return (
            <>
                <Table extraClass={props.extraTableClass}>
                    <Thead cells={this.header} />
                    {
                        props.noLoader
                            ? props.children
                            : this.state.loading
                                ? <TableLoader colSpan={this.header.length} />
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
        noLoader?: boolean;
    }>) => {
        return (
            <>
                {
                    (this.route.trim() === "")
                        ? <this.NoRoute />
                        : (this.state.requestResult.entities.length === 0 && !this.state.loading)
                            ? <this.NoRegisters />
                            : <this.Table children={props.children} {...props}/>
                }
            </>
        );
    };
}