import Column from '@components/grid/column';
import Layout from '@components/layout';
import Log, { LogI, LogRoutes, LogNames, logTypes, LogMethods, InfoLogI, ErrorLogI } from '@components/log';
import Method from '@components/log/method';
import Panel, { PanelPropsI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import parser from 'html-react-parser';

interface LoggerStateI { }

export default class Logger extends Panel<LogI, LoggerStateI> {

    constructor (props: PanelPropsI) {
        super(props);
        this.header = [
            {
                children: "Id",
                className: "text-right",
                style: {
                    width: "7%"
                }
            }, {
                children: "Creación",
                style: {
                    width: "12%",
                },
            }, {
                children: "Método",
                style: {
                    width: "6%",
                },
            }, {
                children: "Ruta",
                style: {
                    width: "25%",
                },
            }, {
                children: "Mensaje",
                style: {
                    width: "50%",
                },
            },
        ];
        this.route = LogRoutes.UNDEFINED;
        this.tableExtraClass = "fixed";
    }

    handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch (e.target.value) {
            case LogNames.INFO:
                this.route = LogRoutes.INFO;
                break;
            case LogNames.ERROR:
                this.route = LogRoutes.ERROR;
                break;
            default:
                this.route = LogRoutes.UNDEFINED;
                break;
        }
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

    render = (): JSX.Element => {
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
                <this.MainTable>
                    <Tbody rows={...this.state.requestResult.entities.map((_log, i) => {
                        if (_log.infoField) {
                            const log = (this.state.requestResult.entities[ i - 1 ] as unknown) as ErrorLogI | InfoLogI;
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
                    })}
                    />
                </this.MainTable>
            </Layout>
        );
    };
}