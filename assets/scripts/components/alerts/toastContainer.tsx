import React from 'react';

export default class ToastContainer extends React.Component {
    render = ():JSX.Element => {
        return (
            <div className="toast-container">
                {this.props.children}
            </div>
        )
    }
}