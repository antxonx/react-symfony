import React from 'react';

interface ErrorAlertI {
    title?: string;
    text: string;
}

export default class ErrorAlert extends React.Component<ErrorAlertI, {}> {
    constructor (props: ErrorAlertI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div className="alert alert-danger mt-2 round">
                {this.props.title && <h5>this.props.title</h5>}
                {this.props.text}
            </div>
        );
    };
}