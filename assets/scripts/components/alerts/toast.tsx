import { extend } from 'jquery';
import React from 'react';

interface ToastPropsI {
    type: "success" | "danger";
    title?: string;
    message?: string;
    show: boolean;
}

export interface ToastData {
    id: string;
    type: "success" | "danger";
    title?: string;
    message: string;
    show?: boolean;
}

export default class Toast extends React.Component<ToastPropsI, {}> {
    constructor (props: ToastPropsI) {
        super(props);
    }

    successIcon = (): JSX.Element => {
        return <i className="fas fa-check-circle"></i>;
    };

    dangerIcon = (): JSX.Element => {
        return <i className="fas fa-times-circle"></i>;
    };

    render = (): JSX.Element => {
        return (
            <div className={`border-${this.props.type} round toast-alert toast-${this.props.type}` + (this.props.show ? " show" : "")}>
                {
                    this.props.title ? (
                        <h4>
                            {this.props.title}
                            <span className="float-right">
                                {this.props.type === "success" ? this.successIcon() : this.dangerIcon()}
                            </span>
                        </h4>
                    ) : <></>
                }
                {this.props.message || this.props.children}
            </div>
        );
    };
}