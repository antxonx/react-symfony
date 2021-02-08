import React from 'react';

import '@styles/loader.scss';

interface LoaderPropsI {
    noAbs?: boolean;
}

export default function Loader(props: React.PropsWithChildren<LoaderPropsI>): JSX.Element {
    return (
        <div className={props.noAbs ? "loader-container-no-abs" : "loader-container"}>
            <div className="loader"></div>
        </div>
    );
}