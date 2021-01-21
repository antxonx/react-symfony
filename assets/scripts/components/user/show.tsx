import EditableTextField from '@components/editable/editableTextField';
import Column from '@components/grid/column';
import Row from '@components/grid/row';
import { UserI } from '@services/authentication';
import React from 'react';

interface UserShowStateI {
    errors: {
        username: string;
        name: string;
        email: string;
    };
}

declare type UserFields = "username" | "email" | "name";

export default class UserShow extends React.Component<UserI, UserShowStateI> {

    constructor (props: UserI) {
        super(props);
        this.state = {
            errors: {
                username: "",
                name: "",
                email: "",
            }
        };
    }

    onTextFieldCalcel = (name: string) => {
        let newState = { ...this.state };
        delete newState.errors[ name as UserFields ];
        this.setState(newState);
    };

    render = (): JSX.Element => {
        return (
            <Row>
                <Column size={6}>
                    <EditableTextField
                        value={this.props.username}
                        name="username"
                        title="Usuario"
                        errorMsg={this.state.errors.username}
                        // onTextFieldEdit={() => {}}
                        onTextFieldCacel={this.onTextFieldCalcel}
                    />
                    <EditableTextField
                        value={this.props.email}
                        name="email"
                        title="Correo"
                        errorMsg={this.state.errors.email}
                        // onTextFieldEdit={() => {}}
                        onTextFieldCacel={this.onTextFieldCalcel}
                    />
                </Column>
                <Column size={6}>
                    <EditableTextField
                        value={this.props.name}
                        name="name"
                        title="Nombre"
                        errorMsg={this.state.errors.name}
                        // onTextFieldEdit={() => {}}
                        onTextFieldCacel={this.onTextFieldCalcel}
                    />
                </Column>
            </Row>
        );
    };
}