import React from 'react';
import '@styles/toast.scss';

export default function ToastContainer(props: React.PropsWithChildren<{}>): JSX.Element {
    return (
        <div className="toast-container mt-5">
            {props.children}
        </div>
    );
}