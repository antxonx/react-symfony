import React from 'react';

interface TablePropsI {
    extraClass?: string;
}

export default function Table(props: React.PropsWithChildren<TablePropsI>): JSX.Element {
    return (
        <table className={
            "table table-sm table-striped2 w-100 table-hover2 table-bordered2 mobile"
            + (
                props.extraClass
                    ? " " + props.extraClass
                    : ""
            )
        }>
            {props.children}
        </table>
    );
}