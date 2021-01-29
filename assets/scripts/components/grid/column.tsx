import React from 'react';

interface ColumnPropsI {
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    extraClass?: string;
}

export default function _Column(props: React.PropsWithChildren<ColumnPropsI>): JSX.Element {
    let className = ((props.size) ? `col-md-${props.size}` : 'col');
        props.extraClass && (className += ` ${props.extraClass}`);
    return (
        <div className={className}>
            {props.children}
        </div>
    );
}