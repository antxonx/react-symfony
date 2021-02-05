import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface ButtonDeletePropsI<PT> {
    id: PT;
    extra?: JSX.Element;
    onClick: (id: PT, extra: JSX.Element) => void;
}

export default function ButtonDelete<T>(props: React.PropsWithChildren<ButtonDeletePropsI<T>>): JSX.Element {
    return (
        <button
            type="button"
            className="btn btn-sm btn-outline-dark border-0 w-100 round"
            onClick={() => {
                props.onClick(props.id, props.extra || <></>);
            }}
        >
            <FontAwesomeIcon icon={faTrashAlt} />
        </button>
    );
}