import React from 'react';

interface LoaderHProps {
    position: "left" | "right" | "center";
}

export default class LoaderH extends React.Component<LoaderHProps, {}> {

    constructor (props: LoaderHProps) {
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