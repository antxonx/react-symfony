import Column from '@components/grid/column';
import Layout from '@components/layout';
import Log, { LogI, LogRoutes, LogNames, logTypes, LogMethods, InfoLogI, ErrorLogI } from '@components/log';
import Method from '@components/log/method';
import Panel, { PanelPropsI, PanelStateI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import parser from 'html-react-parser';
import React from 'react';

interface LoggerPropsI extends PanelPropsI { }

interface LoggerStateI extends PanelStateI<LogI> {
    changing: boolean;
}

export default class Logger extends Panel<LogI, LoggerPropsI, LoggerStateI> {

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
            changing: false,
            header: [
                {
                    name: "Id",
                    sort: true,
                    column: "id",
                    onClick: this.handleThClick,
                    className: "text-right",
                    style: {
                        width: "7%"
                    }
                }, {
                    name: "Creación",
                    sort: true,
                    column: "createdAt",
                    onClick: this.handleThClick,
                    style: {
                        width: "12%",
                    },
                }, {
                    name: "Método",
                    style: {
                        width: "6%",
                    },
                }, {
                    name: "Ruta",
                    style: {
                        width: "25%",
                    },
                }, {
                    name: "Mensaje",
                    style: {
                        width: "50%",
                    },
                },
            ]
        };
        this.route = LogRoutes.UNDEFINED;
    }

    componentDidMount = () => {
        this.params.user = this.getParameterByName("user") || 0;
    };

    componentDidUpdate = () => {
        this.params.user = this.getParameterByName("user") || 0;
    };

    handleThClick = (name: string) => {
        const header = this.handleThClickBG(name, this.state.header.slice());
        this.setState({
            header: header,
            changing: true,
        })
        this.update();
    }

    handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let change = false;
        switch (e.target.value) {
            case LogNames.INFO:
                if (this.route != LogRoutes.UNDEFINED)
                    change = true;
                this.route = LogRoutes.INFO;
                break;
            case LogNames.ERROR:
                if (this.route != LogRoutes.UNDEFINED)
                    change = true;
                this.route = LogRoutes.ERROR;
                break;
            default:
                this.route = LogRoutes.UNDEFINED;
                break;
        }
        this.setState({
            changing: change,
            header: this.unsetSorts(this.state.header),
        });
        this.params.page = 1;
        delete this.params.order;
        delete this.params.orderBy;
        this.update();
    };

    getTypeColor = (type: logTypes) => {
        let color: string;
        switch (type) {
            case logTypes.WARNING:
            case logTypes.API:
                color = "warning";
                break;
            case logTypes.INFO:
                color = "info";
                break;
            default:
                color = "danger";
                break;
        }
        return color;
    };

    CreationDate = (props: React.PropsWithChildren<{ system: boolean; level: logTypes; }>): JSX.Element => {
        let dateclass: string;
        if (props.system) {
            dateclass = "badge-" + this.getTypeColor(props.level);
        } else {
            dateclass = "badge-light";
        }
        return (
            <span className={"badge w-100 round " + dateclass}>
                {props.children}
            </span>
        );
    };

    getParameterByName(name: string) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[ 1 ].replace(/\+/g, ' '));
    }

    onPageChange = () => {
        this.setState({
            changing: true,
        });
    };

    render = (): JSX.Element => {
        let extraTableClass = "fixed result-table";
        if (this.state.loading && this.state.changing) {
            extraTableClass += " hide";
        }
        return (
            <Layout title="Registro">
                <this.MainBar>
                    <Column size={3}>
                        <div className="btn-group btn-group-toggle w-100" data-toggle="buttons" onChange={this.handleTypeChange}>
                            <label className="btn btn-outline-primary round">
                                <input type="radio" value="info" name="logName" autoComplete="off" />
                                Info
                            </label>
                            <label className="btn btn-outline-primary round">
                                <input type="radio" value="error" name="logName" autoComplete="off" />
                                Error
                            </label>
                        </div>
                    </Column>
                </this.MainBar>
                <this.MainTable extraTableClass={extraTableClass} noLoader={this.state.changing}>
                    <Tbody rows={
                        ...this.getEntities().map((_log, i) => {
                            if (_log.infoField) {
                                const log = (this.getEntities()[ i - 1 ] as unknown) as ErrorLogI | InfoLogI;
                                return {
                                    id: "info-" + _log.id,
                                    cells: [
                                        {
                                            name: "info",
                                            children: (
                                                <div id={"info-" + _log.id} className="collapse full-cont">
                                                    <Log log={log} />
                                                </div>
                                            ),
                                            colSpan: 5,
                                            className: "p-0"
                                        }
                                    ]
                                };
                            } else {
                                const log = (_log as unknown) as ErrorLogI | InfoLogI;
                                return {
                                    id: log.id.toString(),
                                    "data-toggle": "collapse",
                                    "data-target": "#info-" + log.id,
                                    "aria-expanded": "false",
                                    "aria-controls": "info-" + log.id,
                                    cells: [
                                        {
                                            name: "id",
                                            children: <b>{log.id}</b>,
                                            className: "text-right cursor-pointer",
                                        }, {
                                            name: "date",
                                            children: <this.CreationDate system={log.system} level={log.level} children={log.createdAt} />,
                                            className: "cursor-pointer",
                                        }, {
                                            name: "method",
                                            children: <Method method={log.method} />,
                                            className: "cursor-pointer",
                                        }, {
                                            name: "route",
                                            children: <>{log.route}</>,
                                            className: "cursor-pointer",
                                        }, {
                                            name: "message",
                                            children: <>{parser(log.message)}</>,
                                            className: "text-truncate cursor-pointer",
                                        }
                                    ]
                                };
                            }
                        })
                    }
                    />
                </this.MainTable>
            </Layout>
        );
    };
}