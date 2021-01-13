import React from 'react';

export default class Loader extends React.Component {
    render = (): JSX.Element => {
        return (
            <div className="loader-container">
                <div className="loader"></div>
            </div>
        );
    };
}