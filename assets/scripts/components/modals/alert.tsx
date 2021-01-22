import React from 'react';
import parser from 'html-react-parser';
import Button, { buttonSizes } from '@components/buttons/button';
import LoaderH from '@components/loader/loaderH';
import Row from '@components/grid/row';
import Column from '@components/grid/column';

export interface AlertPropsI<PT = number> {
    show: boolean;
    id: PT;
    onAccept: (id: PT) => Promise<FinishedAlertState>;
    onCancel: (id: PT) => void;
    message: JSX.Element;
    type?: "alert" | "warning" | "info";
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

    private bodyOverflow: string;

    constructor (props: AlertPropsI<T>) {
        super(props);
        this.bodyOverflow = "";
        this.state = {
            loading: false,
        };
    }

    hideScroll = () => {
        if (this.props.show) {
            this.bodyOverflow = document.body.style.overflowY;
            document.body.style.overflowY = "hidden";
        } else {
            if(document.querySelectorAll(".modal-component.show").length > +this.props.show)
                document.body.style.overflowY = this.bodyOverflow;
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
                        : (
                            <div className="btn-group w-100 p-0 m-0 footer">
                                <Button
                                    color="light"
                                    children={<b>Cancelar</b>}
                                    size={buttonSizes.LARGE}
                                    extraClass="border-0 w-100 p-3"
                                    onClick={() => { this.props.onCancel(this.props.id); }}
                                />
                                <Button
                                    color="light"
                                    children={<b>Aceptar</b>}
                                    size={buttonSizes.LARGE}
                                    extraClass="border-0 w-100 p-3"
                                    onClick={this.handleAccept}
                                />
                            </div>
                        )
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
                <div className="btn-group w-100 p-0 m-0 footer">
                    <Button
                        color="light"
                        children={<b>Aceptar</b>}
                        size={buttonSizes.LARGE}
                        extraClass="border-0 w-100 p-3"
                        onClick={() => {
                            this.restartFinished();
                            this.props.onCancel(this.props.id);
                        }}
                    />
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
        this.hideScroll();
        return (
            <div className={"modal-component" + (this.props.show ? " show" : "")}>
                <div className="modal-component-content modal-alert">
                    <div className="pt-3 pl-3">
                        <i className={
                            "fas fa-2x " +
                            (() => {
                                switch (this.props.type) {
                                    case "info": return "fa-info-circle text-info";
                                    case "warning": return "fa-exclamation-triangle fa-2x text-warning";
                                    default: return "fa-exclamation-triangle text-danger";
                                }
                            })()
                        }>
                        </i>
                    </div>
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
                </div>
            </div>
        );
    };
}