import React from 'react';

interface SubmitButtonPropsI {
    loading: boolean;
    text: string;
}

export default function SubmitButton(props: React.PropsWithChildren<SubmitButtonPropsI>): JSX.Element {
    return (
        <>
            {
                props.loading
                    ? (
                        <button className="btn btn-success mt-2 round w-100" type="submit" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            <span className="sr-only">cargando...</span>
                        </button>
                    )
                    : (
                        <button className="btn btn-success mt-2 round w-100" type="submit">
                            {props.text}
                        </button>
                    )
            }
        </>
    );
}