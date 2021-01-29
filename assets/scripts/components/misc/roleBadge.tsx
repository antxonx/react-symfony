import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface RoleBadgePropsI {
    role: string;
}

export default function RoleBadge(props: React.PropsWithChildren<RoleBadgePropsI>): JSX.Element {
    return (
        <span className={
            "badge round w-100 " + (() => {
                switch (props.role) {
                    case "ROLE_DEV": return "badge-light";
                    case "ROLE_ADMIN": return "badge-primary";
                    default: return "badge-light";
                }
            })()
        }>
            {
                props.role === "ROLE_DEV"
                    ? (
                        <span>
                            &nbsp;&nbsp;
                            <FontAwesomeIcon icon={[ 'fas', 'cross' ]} />
                            &nbsp;&nbsp;
                        </span>
                    )
                    : props.role.substring(5, props.role.length)
            }
        </span>
    );
}