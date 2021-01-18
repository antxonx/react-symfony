import React from 'react';
import Row from '@components/grid/row';
import { ToastEventsI } from '@scripts/app';
import { Table, Thead, ThPropsI } from '@components/tables';
import TableLoader from '@components/loader/tableLoader';
import { Router } from '@scripts/router';
import axios from '@services/axios';
import HandleResponse from '@services/handleResponse';


export interface PanelPropsI {
    toasts: ToastEventsI;
}

export default class Panel<PT> extends React.Component<PanelPropsI, {
    loading: boolean;
    entities: PT[];
}> {
    protected header: ThPropsI[];

    protected router: Router;

    protected route: string;

    constructor (props: PanelPropsI) {
        super(props);
        this.route = "";
        this.state = {
            loading: false,
            entities: [],
        };
        this.header = [];
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

    protected setRoute = (route: string) => {
        this.route = route;
    };

    protected setEntities = (entities: PT[]) => {
        this.setState({
            entities: entities,
        });
    };

    protected update = () => {
        this.setLoading();
        axios.get(this.route)
            .then(res => {
                this.setEntities(res.data);
                this.unsetLoading();
            })
            .catch(err => {
                HandleResponse.error(err, this.props.toasts);
            });
    };

    protected MainTable = (props: React.PropsWithChildren<{
        head: ThPropsI[];
    }>) => {
        return (
            <Table>
                <Thead cells={props.head} />
                {this.state.loading ?
                    <TableLoader colSpan={this.header.length} /> :
                    props.children
                }
            </Table>
        );
    };
}