import React from 'react';
import parser from 'html-react-parser';
import LoaderH from '@components/loader/loaderH';
import { Card } from 'antd';
import { Column, Row } from '@components/grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export interface AlertPropsI<PT = number> {
    show: boolean;
    id: PT;
    onAccept: (id: PT) => Promise<FinishedAlertState>;
    onCancel: (id: PT) => void;
    message: JSX.Element;
    type?: "alert" | "warning" | "info";
    onHide?: (id: PT) => void;
}

interface AlertStateI {
    loading: boolean;
    finishedState?: FinishedAlertState;
}

export interface FinishedAlertState {
    type: FinishedStateTypes;
    message: string;
}

export enum FinishedStateTypes {
    SUCCESS,
    ERROR,
};

export default class Alert<T = number> extends React.Component<AlertPropsI<T>, AlertStateI> {

    constructor (props: AlertPropsI<T>) {
        super(props);
        this.state = {
            loading: false,
        };
    }

    handleCancel = () => {
        this.props.onCancel(this.props.id);
        setTimeout(() => {
            this.props.onHide && (
                this.props.onHide(this.props.id)
            );
        }, 200);
    };

    hideScroll = () => {
        if (this.props.show) {
            document.body.classList.add("modal-component-open");
        } else {
            if (document.querySelectorAll(".modal-component.show").length > +this.props.show)
                document.body.classList.remove("modal-component-open");
        }
    };

    handleAccept = async () => {
        this.setState({
            loading: true,
        });
        let result = await this.props.onAccept(this.props.id);
        this.setState({
            finishedState: result,
            loading: false
        });
    };

    NotFinished = (): JSX.Element => {
        return (
            <>
                {
                    this.state.loading
                        ? (
                            <div className="p-4">
                                <LoaderH position="center" />
                            </div>
                        )
                        : <></>
                }
            </>
        );
    };

    Finished = (): JSX.Element => {
        const isSuccess = (this.state.finishedState!.type === FinishedStateTypes.SUCCESS);
        const alertClass = (isSuccess ? "light" : "danger");
        const icon = (
            isSuccess
                ? <i className="far fa-check-circle fa-2x"></i>
                : <i className="far fa-times-circle fa-2x"></i>
        );
        return (
            <div>
                <div className={`alert alert-${alertClass} m-3 round text-center font-weight-bold`}>
                    <Row>
                        <Column size={2}>
                            <div className="text-center">
                                {icon}
                            </div>
                        </Column>
                        <Column size={10}>
                            <div className="text-justify h4">
                                {this.state.finishedState && parser(this.state.finishedState.message)}
                            </div>
                        </Column>
                    </Row>
                </div>
            </div>
        );
    };

    restartFinished = () => {
        this.setState({
            finishedState: undefined,
        });
    };

    render = (): JSX.Element => {
        let actions: JSX.Element[] = [];
        this.hideScroll();
        if (this.state.finishedState) {
            actions.push(<div
                children={<b>Aceptar</b>}
                onClick={() => {
                    this.restartFinished();
                    this.props.onCancel(this.props.id);
                }}
            />);
        } else {
            actions.push(<div
                children={<b>Cancelar</b>}
                onClick={this.handleCancel}
            />
            );
            actions.push(<div
                children={<b>Aceptar</b>}
                onClick={this.handleAccept}
            />);
        }
        return (
            <div className={"modal-component" + (this.props.show ? " show" : "")}>
                <div className="modal-component-content modal-alert">
                    <Card
                        size="small"
                        className="round"
                        title={
                            (
                                <FontAwesomeIcon
                                    size="2x"
                                    {...(() => {
                                        switch (this.props.type) {
                                            case "info": return { icon: faInfoCircle, className: "text-info" };
                                            case "warning": return { icon: faExclamationTriangle, className: "text-warning" };
                                            default: return { icon: faExclamationTriangle, className: "text-danger" };
                                        }
                                    })()}
                                />
                            )
                        }
                        actions={actions}
                    >
                        {
                            this.state.finishedState
                                ? <></>
                                : (
                                    <div className="p-4">
                                        <h3 className="text-center">
                                            {this.props.message}
                                        </h3>
                                    </div>
                                )
                        }
                        {
                            this.state.finishedState
                                ? <this.Finished />
                                : <this.NotFinished />
                        }
                    </Card>
                </div>
            </div>
        );
    };
}