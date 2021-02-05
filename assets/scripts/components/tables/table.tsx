import React from 'react';

interface TablePropsI {
    extraClass?: string;
    striped?: string;
}

export default function Table(props: React.PropsWithChildren<TablePropsI>): JSX.Element {
    return (
        <table className={
            "table table-sm w-100 table-hover2 table-bordered2 mobile table-striped" + (props.striped || "2")
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