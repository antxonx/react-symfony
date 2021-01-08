import * as React from "react";
import * as ReactDOM from "react-dom";

const headRoot = document.head;

export interface HeadI {
    title?: string;
    url?: string;
    image?: string;
    description?: string;
}

export default class Head extends React.Component {
    public render(): JSX.Element {
        return ReactDOM.createPortal(this.props.children, headRoot);
    }
}