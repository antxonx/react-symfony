import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

    render = (): JSX.Element => {
        return (
            <div
                className={`border-${this.props.type} round toast-alert toast-${this.props.type}` + (this.props.show ? " show" : "")}
            >
                {
                    (this.props.title?.trim() !== "") && (
                        <h4>
                            {this.props.title}
                            <span className="float-right">
                                {
                                    this.props.type === "success"
                                        ? <FontAwesomeIcon icon={[ 'fas', 'check-circle' ]} />
                                        : <FontAwesomeIcon icon={[ 'fas', 'times-circle' ]} />
                                }
                            </span>
                        </h4>
                    )
                }
                {this.props.message || this.props.children}
            </div>
        );
    };
}