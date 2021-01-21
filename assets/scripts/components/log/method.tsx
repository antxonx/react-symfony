import React from 'react';
import { LogMethods } from '.';

interface MethodPropsI {
    method: LogMethods;
    no100?: boolean;
}

export default class Method extends React.Component<MethodPropsI, {}> {
    render = (): JSX.Element => {
        const w100 = (this.props.no100 ? "" : " w-100");
        let badgeClass: string;
        switch (this.props.method) {
            case LogMethods.GET:
                badgeClass = "badge-success";
                break;
            case LogMethods.POST:
                badgeClass = "badge-primary";
                break;
            case LogMethods.PUT:
            case LogMethods.PATCH:
                badgeClass = "badge-warning";
                break;
            case LogMethods.DELETE:
                badgeClass = "badge-danger";
                break;
            default:
                badgeClass = "badge-light";
                break;
        }
        return (
            <span className={"badge round " + badgeClass + w100}>
                {this.props.method || this.props.children}
            </span>
        );
    };
}