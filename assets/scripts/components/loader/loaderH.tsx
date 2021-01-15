import React from 'react';

interface LoaderHPropsI {
    position: "left" | "right" | "center";
}

export default class LoaderH extends React.Component<LoaderHPropsI, {}> {

    constructor (props: LoaderHPropsI) {
        super(props);
    }
    render = (): JSX.Element => {
        return (
            <div className={"cssload-" + (this.props.position)}>
                <div className="cssload-container">
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                    <span className="cssload-dots"></span>
                </div>
            </div>
        );
    };
}