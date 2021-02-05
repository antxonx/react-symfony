import React from 'react';
import parser from 'html-react-parser';
import Method from './method';
import { Column, Row } from '@components/grid';
import Card from 'antd/es/card';

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

export default function Log(props: React.PropsWithChildren<LogPropsI>): JSX.Element {
    const errorLog = props.log as ErrorLogI;
    return (
        <div className="container mx-auto my-5">
            <Card className="round log-card">
                <Row extraClass="hide-on-mobile">
                    <Column extraClass="text-left">
                        <b>{props.log.id}</b>
                    </Column>
                    <Column extraClass="text-center">
                        <b><em>{props.log.createdAt}</em></b>
                    </Column>
                    <Column extraClass="text-right">
                        <Method method={props.log.method} no100={true} />
                    </Column>
                </Row>
                <div className="hide-on-desktop">
                    <Row>
                        <Column extraClass="text-left">
                            <b>{props.log.id}</b>
                        </Column>
                        <Column extraClass="text-right">
                            <Method method={props.log.method} no100={true} />
                        </Column>
                    </Row>
                    <Row
                        style={{
                            transform: "translateY(-1.5rem)"
                        }}
                    >
                        <Column extraClass="text-center">
                            <b><em>{props.log.createdAt}</em></b>
                        </Column>
                    </Row>
                </div>
                <hr className="divide" />
                <div className="p-2 text-muted">
                    <h5 className="text-center">
                        <span className={"badge-pill px-5 badge badge-" + (() => {
                            switch (props.log.level) {
                                case logTypes.WARNING:
                                case logTypes.API: return "warning";
                                case logTypes.INFO: return "info";
                                default: return "danger";
                            }
                        })()}>
                            {props.log.level}
                        </span>
                    </h5>
                    <Row>
                        <Column size={4}>
                            <span>
                                <b>IP:</b> {' '}
                                {props.log.clientIp}
                            </span>
                        </Column>
                        <Column size={4}>
                            <span>
                                <b>Ruta:</b> {' '}
                                {props.log.route}
                            </span>
                        </Column>
                        <Column size={4}>
                            <span>
                                <b>Usuario:</b> {' '}
                                <em>{props.log.userName}</em>
                            </span>
                        </Column>
                    </Row>
                    {
                        errorLog.file && (
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
                        )
                    }
                    <hr />
                    {parser(props.log.message)}
                </div>
            </Card>
        </div>
    );
}