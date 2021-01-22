import React from 'react';

interface RoleBadgePropsI {
    role: string;
}

export default class RoleBadge extends React.Component<RoleBadgePropsI, {}> {

    private readonly devIcon: JSX.Element;

    constructor (props: RoleBadgePropsI) {
        super(props);
        this.devIcon = (
            <span>
                &nbsp;&nbsp;
                <i className="fas fa-cross mobile-2-desktop-1"></i>
                &nbsp;&nbsp;
            </span>
        );
    }

    render = (): JSX.Element => {
        return (
            <span className={
                "badge round w-100 " + (() => {
                    switch (this.props.role) {
                        case "ROLE_DEV": return "badge-light";
                        case "ROLE_ADMIN": return "badge-primary";
                        default: return "badge-light";
                    }
                })()
            }>
                {
                    this.props.role === "ROLE_DEV"
                        ? this.devIcon
                        : this.props.role.substring(5, this.props.role.length)
                }
            </span>
        );
    };
}