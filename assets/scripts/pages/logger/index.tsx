import Column from '@components/grid/column';
import LoaderH from '@components/loader/loaderH';
import Log, { LogI, LogRoutes, LogNames, logTypes, LogMethods, InfoLogI, ErrorLogI } from '@components/log';
import Method from '@components/log/method';
import Panel, { PanelPropsI, PanelStateI } from '@components/panel';
import Tbody from '@components/tables/tbody';
import parser from 'html-react-parser';
import React from 'react';
import { DatePicker, Radio, RadioChangeEvent } from 'antd';
const { RangePicker } = DatePicker;

interface LoggerPropsI extends PanelPropsI { }

interface LoggerStateI extends PanelStateI<LogI> {
    changing: boolean;
    type: "error" | "info" | "";
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
            type: "",
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
            ],
            modal: {
                title: "",
                show: false,
                size: 50,
                content: <LoaderH position="center" />,
                onClose: this.handleCloseModal,
                onHide: this.handleHideModal,
            },
            alert: {
                id: 0,
                message: <></>,
                onAccept: this.handleAcceptAlert,
                onCancel: this.handleCancelAlert,
                onHide: this.handleHideAlert,
                show: false,
            },
            active: {
                modal: false,
                alert: false,
            }
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
        });
        this.update();
    };

    handleTypeChange = (e: RadioChangeEvent) => {
        this.route = (() => {
            switch (e.target.value) {
                case LogNames.INFO: return LogRoutes.INFO;
                case LogNames.ERROR: return LogRoutes.ERROR;
                default: return LogRoutes.UNDEFINED;
            }
        })();
        this.setState({
            changing: true,
            header: this.unsetSorts(this.state.header),
            type: e.target.value,
        });
        this.params.page = 1;
        delete this.params.order;
        delete this.params.orderBy;
        this.update();
    };

    handleDateChange = (_: any) => {
        if(_) {
            const dates = _ as moment.Moment[];
            const startDate = dates![ 0 ]?.format("YYYY-MM-DD");
            const endDate = dates![ 1 ]?.format("YYYY-MM-DD");
            console.log(startDate + " - " + endDate);
            this.params.startDate = startDate;
            this.params.endDate = endDate;
        } else {
            delete this.params.startDate;
            delete this.params.endDate;
        }
        if(this.route !== "") 
                this.update();
    }

    getTypeColor = (type: logTypes) => {
        return (() => {
            switch (type) {
                case logTypes.WARNING:
                case logTypes.API: return "warning";
                case logTypes.INFO: return "info";
                default: return "danger";
            }
        })();
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
            <this.Layout title="Registro">
                <this.MainBar>
                    <Column size={3}>
                        <Radio.Group
                            options={[ { label: 'Info', value: 'info' }, { label: 'Error', value: 'error' } ]}
                            onChange={this.handleTypeChange}
                            value={this.state.type}
                            className="button-group"
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Column>
                    <Column size={4}>
                        <RangePicker className="round w-100" onChange={this.handleDateChange} />
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
            </this.Layout>
        );
    };
}