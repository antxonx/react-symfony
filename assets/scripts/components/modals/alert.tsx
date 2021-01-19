import React from 'react';
import parser from 'html-react-parser';
import Button, { buttonSizes } from '@components/buttons/button';

export interface AlertPropsI<PT = number> {
    show: boolean;
    id: PT;
    onAccept: (id: PT) => Promise<boolean>;
    onCancel: (id: PT) => void;
    message: JSX.Element;
    type?: "alert" | "warning" | "info";
}

interface AlertStateI {
    loading: boolean;
    actualState: boolean;
}

export default class Alert<T = number> extends React.Component<AlertPropsI<T>, AlertStateI> {

    private bodyOverflow: string;

    constructor (props: AlertPropsI<T>) {
        super(props);
        this.bodyOverflow = "";
        this.state = {
            loading: false,
            actualState: false,
        };
    }

    hideScroll = () => {
        if (this.props.show) {
            this.bodyOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = this.bodyOverflow;
        }
    };

    render = (): JSX.Element => {
        this.hideScroll();
        let icon: JSX.Element;
        switch (this.props.type) {
            case "info":
                icon = <i className="fas fa-info-circle fa-2x text-info"></i>;
                break;
            case "warning":
                icon = <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>;
                break;
            case "alert":
            default:
                icon = <i className="fas fa-exclamation-triangle fa-2x text-danger"></i>;
                break;
        }
        return (
            <div
                className={"modal-component" + (this.props.show ? " show" : "")}
            >
                <div
                    className="modal-component-content alert"
                >
                    <div className="pt-3 pl-3">
                        {icon}
                    </div>
                    <div className="p-4">
                        <h3 className="text-center">
                            {this.props.message}
                        </h3>
                    </div>
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
                            onClick={() => { this.props.onCancel(this.props.id); }}
                        />
                    </div>
                </div>
            </div>
        );
    };
}