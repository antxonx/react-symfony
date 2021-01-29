import { Column, Row } from '@components/grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from 'antd';
import React from 'react';

interface ToastPropsI {
    type: "success" | "error";
    title?: string;
    message?: string;
    show: boolean;
}

export interface ToastData {
    id: string;
    type: "success" | "error";
    title?: string;
    message: string;
    show?: boolean;
}

export default function Toast(props: React.PropsWithChildren<ToastPropsI>): JSX.Element {
    return (
        <Card
            className={`toast-alert round toast-${props.type}` + (props.show ? " show" : "")}
            size="small"
        >
            <Row>
                <Column size={1}>
                    {
                        props.type === "success"
                            ? <FontAwesomeIcon icon={[ 'far', 'check-circle' ]} size="2x" color="#52c41a" />
                            : <FontAwesomeIcon icon={[ 'far', 'times-circle' ]} size="2x" color="#e79a93" />
                    }
                </Column>
                <Column size={11} extraClass="mt-1">
                    <h6>
                        {props.message || props.children}
                    </h6>
                </Column>
            </Row>

        </Card>
    );
}