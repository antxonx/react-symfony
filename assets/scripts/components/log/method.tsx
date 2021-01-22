import React from 'react';
import { LogMethods } from '.';

interface MethodPropsI {
    method: LogMethods;
    no100?: boolean;
}

export default class Method extends React.Component<MethodPropsI, {}> {
    render = (): JSX.Element => {
        const w100 = (this.props.no100 ? "" : " w-100 ");
        return (
            <span className={
                "badge round " + w100 + (() => {
                    switch (this.props.method) {
                        case LogMethods.GET: return "badge-success";
                        case LogMethods.POST: return "badge-primary";
                        case LogMethods.PUT:
                        case LogMethods.PATCH: return "badge-warning";
                        case LogMethods.DELETE: return "badge-danger";
                        default: return "badge-light";
                    }
                })()
            }>
                {this.props.method || this.props.children}
            </span>
        );
    };
}