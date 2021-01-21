import Column from '@components/grid/column';
import Row from '@components/grid/row';
import React from 'react';
import parser from 'html-react-parser';
import Method from './method';

export enum LogMethods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export enum logTypes {
    NOTICE = "NOTICE",
    INFO = "INFO",
    ERROR = "ERROR",
    WARNING = "WARNING",
    CRITICL = "CRITICAL",
    ALERT = "ALERT",
    EMERGENCY = "EMERGENCY",
    API = "API",
}

export enum LogNames {
    INFO = "info",
    ERROR = "error"
}

export enum LogRoutes {
    UNDEFINED = "",
    INFO = "logger_info_list",
    ERROR = "logger_error_list"
}

export interface LogI {
    [ key: string ]: string;
}

export interface InfoLogI {
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

export interface ErrorLogI {
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

interface LogPropsI {
    log: InfoLogI | ErrorLogI;
}

export default class Log extends React.Component<LogPropsI, {}> {

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

    render = (): JSX.Element => {
        const errorLog = this.props.log as ErrorLogI;
        let badgeClass = "badge-" + this.getTypeColor(this.props.log.level);
        return (
            <div className="container mx-auto card my-5 round">
                <div className="card-body">

                    <Row extraClass="hide-on-mobile">
                        <Column extraClass="text-left">
                            <b>{this.props.log.id}</b>
                        </Column>
                        <Column extraClass="text-center">
                            <b><em>{this.props.log.createdAt}</em></b>
                        </Column>
                        <Column extraClass="text-right">
                            <Method method={this.props.log.method} no100={true} />
                        </Column>
                    </Row>
                    <div className="hide-on-desktop">
                        <Row>
                            <Column extraClass="text-left">
                                <b>{this.props.log.id}</b>
                            </Column>
                            <Column extraClass="text-right">
                                <Method method={this.props.log.method} no100={true} />
                            </Column>
                        </Row>
                        <Row style={{
                            transform: "translateY(-1.5rem)"
                        }}>
                            <Column extraClass="text-center">
                                <b><em>{this.props.log.createdAt}</em></b>
                            </Column>
                        </Row>
                    </div>
                    <hr className="divide" />
                    <div className="p-2 text-muted">
                        <h5 className="text-center">
                            <span className={`badge ${badgeClass} badge-pill px-5`}>
                                {this.props.log.level}
                            </span>
                        </h5>
                        <Row>
                            <Column size={4}>
                                <span>
                                    <b>IP:</b> {' '}
                                    {this.props.log.clientIp}
                                </span>
                            </Column>
                            <Column size={4}>
                                <span>
                                    <b>Ruta:</b> {' '}
                                    {this.props.log.route}
                                </span>
                            </Column>
                            <Column size={4}>
                                <span>
                                    <b>Usuario:</b> {' '}
                                    <em>{this.props.log.userName}</em>
                                </span>
                            </Column>
                        </Row>
                        {errorLog.file && (
                            <Row>
                                <Column size={8}>
                                    <span>
                                        <b>Archivo:</b>{' '}
                                        {errorLog.file}
                                    </span>
                                </Column>
                                <Column size={4}>
                                    <span>
                                        <b>Linea:</b>{' '}
                                        {errorLog.line}
                                    </span>
                                </Column>
                            </Row>
                        )}
                        <hr />
                        {parser(this.props.log.message)}
                    </div>
                </div>
            </div>
        );
    };
}