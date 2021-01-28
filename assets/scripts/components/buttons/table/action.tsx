import React from 'react';
interface ActionPropsI<PT> {
    id: PT;
    color: 'success' | 'danger' | 'info' | 'primary' | 'secondary' | 'light' | 'dark';
    content: JSX.Element;
    loading?: boolean;
    onClick: (id: PT) => void;
}

export default function Action<T>(props: React.PropsWithChildren<ActionPropsI<T>>): JSX.Element {
    return (
        <>
            <button
                className={`btn btn-sm btn-outline-${props.color} border-0 w-100 round`}
                disabled={props.loading}
                onClick={() => {
                    props.onClick(props.id);
                }}
            >
                {
                    props.loading
                        ? (
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            >
                            </span>
                        )
                        : props.content
                }
            </button>
        </>
    );
}