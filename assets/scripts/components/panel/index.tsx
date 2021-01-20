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

interface RequestResult<RRT> {
    entities: RRT[];
    maxPages: number;
    showed: number;
    total: number;
}

export default class Panel<PT = {}, ST = {}> extends React.Component<PanelPropsI, {
    loading: boolean;
    requestResult: RequestResult<PT>;
    state: ST;
}> {
    protected header: ThPropsI[];

    protected router: Router;

    protected route: string;

    protected tableExtraClass: string;

    protected params: {
        page: number;
        [ key: string ]: string | number;
    };

    constructor (props: PanelPropsI) {
        super(props);
        this.route = "";
        this.state = {
            loading: false,
            requestResult: {
                entities: [],
                maxPages: 0,
                showed: 0,
                total: 0,
            },
            state: {} as ST
        };
        this.header = [];
        this.params = {
            page: 1
        };
        this.router = new Router(process.env.BASE_URL);
        this.tableExtraClass = "";
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

    protected setRequestResult = (result: RequestResult<PT>) => {
        this.setState({
            requestResult: result,
        });
    };

    protected setSubState = (state: {}) => {
        this.setState({
            state: {
                ...this.state.state,
                ...state,
            },
        });
    };

    protected getSubState = () => {
        return this.state.state;
    };

    protected update = (options?: { page?: number, silent?: boolean; }) => {
        this.params.page = options?.page || this.params.page;
        if (!options?.silent)
            this.setLoading();
        axios.get(this.router.apiGet(this.route, this.params))
            .then(res => {
                this.setRequestResult(JSON.parse(HandleResponse.success(res)));
                console.log(JSON.parse(HandleResponse.success(res)));
                if (!options?.silent)
                    this.unsetLoading();
            })
            .catch(err => {
                HandleResponse.error(err, this.props.toasts);
            });
    };

    protected MainTable = (props: React.PropsWithChildren<{}>) => {
        return (
            <>
                <Table extraClass={this.tableExtraClass}>
                    <Thead cells={this.header} />
                    {this.state.loading ?
                        <TableLoader colSpan={this.header.length} /> :
                        props.children
                    }
                </Table>
                <Paginator
                    actual={this.params.page}
                    maxPages={this.state.requestResult.maxPages}
                    showed={this.state.requestResult.showed}
                    total={this.state.requestResult.total}
                    onClick={(page: number) => {
                        this.params.page = page;
                        this.update();
                    }}
                />
            </>
        );
    };
}