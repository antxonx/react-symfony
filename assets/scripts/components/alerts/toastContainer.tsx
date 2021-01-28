import React from 'react';

export default function ToastContainer(props: React.PropsWithChildren<{}>): JSX.Element {
    return (
        <div className="toast-container mt-5">
            {props.children}
        </div>
    );
}