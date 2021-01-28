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

export default function Toast(props: React.PropsWithChildren<ToastPropsI>): JSX.Element {
    return (
        <div
            className={`border-${props.type} round toast-alert toast-${props.type}` + (props.show ? " show" : "")}
        >
            {
                (props.title?.trim() !== "") && (
                    <h4>
                        {props.title}
                        <span className="float-right">
                            {
                                props.type === "success"
                                    ? <FontAwesomeIcon icon={[ 'fas', 'check-circle' ]} />
                                    : <FontAwesomeIcon icon={[ 'fas', 'times-circle' ]} />
                            }
                        </span>
                    </h4>
                )
            }
            {props.message || props.children}
        </div>
    );
}