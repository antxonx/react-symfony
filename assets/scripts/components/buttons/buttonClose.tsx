import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

interface ButtonCloseI {
    onClick: () => void;
    float?: string;
    extraClass?: string;
}

export default function ButtonClose(props: React.PropsWithChildren<ButtonCloseI>): JSX.Element {
    return (
        <button
            className={
                "btn text-muted close-btn" +
                (props.float ? " float-" + props.float : "") +
                (props.extraClass ? " " + props.extraClass : "")
            }
            onClick={props.onClick}
        >
            <FontAwesomeIcon icon={faTimes} />
        </button>
    );
}