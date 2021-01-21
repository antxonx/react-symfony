import Column from '@components/grid/column';
import Layout from '@components/layout';
import Panel, { PanelPropsI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import parser from 'html-react-parser';

enum LogMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

enum logTypes {
    NOTICE = "NOTICE",
    INFO = "INFO",
    ERROR = "ERROR",
    WARNING = "WARNING",
    CRITICL = "CRITICAL",
    ALERT = "ALERT",
    EMERGENCY = "EMERGENCY",
    API = "API",
}

enum LogNames {
    INFO = "info",
    ERROR = "error"
}

enum LogRoutes {
    UNDEFINED = "",
    INFO = "logger_info_list",
    ERROR = "logger_error_list"
}

interface LogI {
    [ key: string ]: string;
}

interface InfoLogI {
    id: number;
    userName: string;
    createdAt: string;
    route: string;
    message: string;
    method: LogMethods;
    clientIp: string;
    level: logTypes;
    system: boolean;
}

interface ErrorLogI {
    id: number;
    userName: string;
    createdAt: string;
    file: string;
    line: number;
    route: string;
    message: string;
    method: LogMethods;
    clientIp: string;
    level: logTypes;
    system: boolean;
}

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

    CreationDate = (props: React.PropsWithChildren<{ system: boolean; level: logTypes; }>): JSX.Element => {
        let dateclass: string;
        if (props.system) {
            switch (props.level) {
                case logTypes.WARNING:
                case logTypes.API:
                    dateclass = "badge-warning";
                    break;
                case logTypes.INFO:
                    dateclass = "badge-info";
                    break;
                default:
                    dateclass = "badge-danger";
                    break;
            }
        } else {
            dateclass = "badge-light";
        }
        return (
            <span className={"badge w-100 round " + dateclass}>
                {props.children}
            </span>
        );
    };

    MethodBadge = (props: React.PropsWithChildren<{ method: LogMethods; }>): JSX.Element => {
        let badgeClass: string;
        switch (props.method) {
            case LogMethods.GET:
                badgeClass = "badge-success";
                break;
            case LogMethods.POST:
                badgeClass = "badge-primary";
                break;
            case LogMethods.PUT:
            case LogMethods.PATCH:
                badgeClass = "badge-warning";
                break;
            case LogMethods.DELETE:
                badgeClass = "badge-danger";
                break;
            default:
                badgeClass = "badge-light";
                break;
        }
        return (
            <span className={"badge w-100 round " + badgeClass}>
                {props.method || props.children}
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
                    <Tbody rows={this.state.requestResult.entities.map(_log => {
                        const log = (_log as unknown) as ErrorLogI;
                        return {
                            id: log.id.toString(),
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
                                    children: <this.MethodBadge method={log.method}/>,
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
                    })}
                    />
                </this.MainTable>
            </Layout>
        );
    };
}