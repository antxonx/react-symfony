import React from 'react';
import Row from '@components/grid/row';
import { ToastEventsI } from '@scripts/app';
import { Table, Thead, ThPropsI } from '@components/tables';
import TableLoader from '@components/loader/tableLoader';
import { Router } from '@scripts/router';


export interface PanelPropsI {
    toasts: ToastEventsI;
}

export default class Panel<PT> extends React.Component<PanelPropsI, {
    loading: boolean;
    entities: PT[];
}> {
    protected readonly header: ThPropsI[];

    protected router: Router;

    constructor (props: PanelPropsI, header: ThPropsI[]) {
        super(props);
        this.state = {
            loading: false,
            entities: [],
        };
        this.header = header;
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

    protected setEntities = (entities: PT[]) => {
        this.setState({
            entities: entities,
        });
    }

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