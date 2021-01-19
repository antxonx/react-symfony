import React from 'react';

interface RoleBadgePropsI {
    role: string;
}

export default class RoleBadge extends React.Component<RoleBadgePropsI, {}> {

    private devIcon: JSX.Element = <i className="fas fa-cross mobile-2-desktop-1"></i>;

    constructor (props: RoleBadgePropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        let badgeClass: string;
        switch (this.props.role) {
            case "ROLE_DEV":
                badgeClass = "";
                break;
            case "ROLE_ADMIN":
                badgeClass = " alert-primary";
                break;
            default:
                badgeClass = " alert-light";
                break;
        }
        return (
            <span className={"btn btn-sm2 w-100" + badgeClass}>
                {
                    this.props.role === "ROLE_DEV" ?
                        this.devIcon :
                        this.props.role.substring(5, this.props.role.length)
                }
            </span>
        );
    };
}