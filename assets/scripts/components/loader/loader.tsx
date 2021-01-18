import React from 'react';

interface LoaderPropsI {
    noAbs?: boolean;
}

export default class Loader extends React.Component<LoaderPropsI, {}> {

    constructor(props: LoaderPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div className={this.props.noAbs ? "loader-container-no-abs" : "loader-container"}>
                <div className="loader"></div>
            </div>
        );
    };
}