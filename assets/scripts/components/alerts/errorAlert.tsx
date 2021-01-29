import React from 'react';
import parser from 'html-react-parser';

interface ErrorAlertI {
    title?: string;
    text: string;
}

export default function ErrorAlert(props: React.PropsWithChildren<ErrorAlertI>): JSX.Element {
    return (
        <div className="alert alert-danger mt-2 round">
            {props.title && <h5>this.props.title</h5>}
            {parser(props.text)}
        </div>
    );
}