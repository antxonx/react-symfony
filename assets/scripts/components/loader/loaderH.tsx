import React from 'react';

import '@styles/loaderH.scss';

interface LoaderHPropsI {
    position: "left" | "right" | "center";
}

export default function LoaderH(props: React.PropsWithChildren<LoaderHPropsI>): JSX.Element {
    return (
        <div className={"cssload-" + (props.position)}>
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
}