import React from "react";
import ReactDOM from "react-dom";
export interface HeadI {
    title?: string;
    url?: string;
    image?: string;
    description?: string;
}

export default function Head(props: React.PropsWithChildren<{}>): JSX.Element {
    return ReactDOM.createPortal(props.children, document.head);
}