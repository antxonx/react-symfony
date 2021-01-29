import { EditableCheckField, EditableTextField } from '@components/editable';
import { Column, Row } from '@components/grid';
import { Router } from '@scripts/router';
import { UserI } from '@services/authentication';
import HandleResponse from '@services/handleResponse';
import axios from 'axios';
import React from 'react';

interface UserShowPropsI {
    user: UserI;
    callback?: () => void;
}

interface UserShowStateI {
    user: UserI;
    errors: {
        username?: string;
        name?: string;
        email?: string;
        roles?: string;
    };
}

declare type UserFields = "username" | "email" | "name";

export default class UserShow extends React.Component<UserShowPropsI, UserShowStateI> {

    constructor (props: UserShowPropsI) {
        super(props);
        this.state = {
            user: { ...this.props.user },
            errors: {},
        };
    }

    onTextFieldCalcel = (name: string) => {
        let newState = { ...this.state };
        delete newState.errors[ name as UserFields | "roles" ];
        this.setState(newState);
    };

    onTextfieldEdit = async (name: string, value: string): Promise<boolean> => {
        if (this.state.user[ name as UserFields ] != value.trim()) {
            let newState = { ...this.state };
            let result: boolean;
            try {
                const res = await axios.patch(
                    (new Router(process.env.BASE_URL)).apiGet(
                        "user_edit", {
                        'id': this.state.user.id
                    }), { name, value });
                HandleResponse.success(res);
                this.onTextFieldCalcel(name);
                newState.user[ name as UserFields ] = value;
                this.props.callback && this.props.callback();
                result = true;
            } catch (err) {
                newState.errors[ name as UserFields ] = HandleResponse.error(err)?.message;
                result = false;
            }
            this.setState(newState);
            return result;
        } else {
            return true;
        }
    };

    onCheckFieldEdit = async (name: string, value: string[]): Promise<boolean> => {
        if (this.state.user.roles != value) {
            let newState = { ...this.state };
            let result: boolean;
            try {
                const res = await axios.patch(
                    (new Router(process.env.BASE_URL)).apiGet(
                        "user_edit", {
                        'id': this.state.user.id
                    }), { name, value });
                HandleResponse.success(res);
                this.onTextFieldCalcel(name);
                newState.user.roles = value;
                this.props.callback && this.props.callback();
                result = true;
            } catch (err) {
                newState.errors.roles = HandleResponse.error(err)?.message;
                result = false;
            }
            this.setState(newState);
            return result;
        } else {
            return true;
        }
    };

    render = (): JSX.Element => {
        const options = [
            { value: "ROLE_ADMIN", showValue: "admin" }
        ];
        let roles = this.state.user.roles.slice();
        const index = roles.findIndex(role => role === "ROLE_USER");
        (index >= 0) && roles.splice(index, 1);
        const userRoles = roles.map(role => {
            return {
                value: role,
                showValue: role.substring(5).toLowerCase(),
            };
        });
        return (
            <Row>
                <Column size={6}>
                    <EditableTextField
                        value={this.state.user.username}
                        name="username"
                        title="Usuario"
                        errorMsg={this.state.errors.username}
                        onTextFieldEdit={this.onTextfieldEdit}
                        onTextFieldCacel={this.onTextFieldCalcel}
                        onKeyDown={(e) => e.key.match(/\s/) && e.preventDefault()}
                    />
                    <EditableTextField
                        value={this.state.user.email}
                        name="email"
                        title="Correo"
                        errorMsg={this.state.errors.email}
                        onTextFieldEdit={this.onTextfieldEdit}
                        onTextFieldCacel={this.onTextFieldCalcel}
                    />
                </Column>
                <Column size={6}>
                    <EditableTextField
                        value={this.state.user.name}
                        name="name"
                        title="Nombre"
                        errorMsg={this.state.errors.name}
                        onTextFieldEdit={this.onTextfieldEdit}
                        onTextFieldCacel={this.onTextFieldCalcel}
                    />
                    <EditableCheckField
                        data={userRoles}
                        options={options}
                        name="roles"
                        title="Puesto"
                        errorMsg={this.state.errors.roles}
                        onTextFieldEdit={this.onCheckFieldEdit}
                        onTextFieldCacel={this.onTextFieldCalcel}
                    />
                </Column>
            </Row>
        );
    };
}