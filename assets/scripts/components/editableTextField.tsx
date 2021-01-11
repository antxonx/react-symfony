import React from 'react';

interface EditableTextFieldPropsI {
    value: string;
    title?: string;
    name: string;
    errorMsg?: string;
    onTextFieldEdit?: (name: string, value: string) => Promise<boolean>;
    onTextFieldCacel?: (name: string) => void;
}

interface EditableFieldStatesI {
    editig: boolean;
    newValue: string;
    loading: boolean;
    error: boolean;
}

export default class EditableTextField extends React.Component<EditableTextFieldPropsI, EditableFieldStatesI> {

    constructor (props: EditableTextFieldPropsI) {
        super(props);
        this.state = {
            editig: false,
            newValue: this.props.value,
            loading: false,
            error: false,
        };
    }

    handleClick = () => {
        this.setState({
            editig: !this.state.editig,
        });
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newValue: e.target.value,
        });
    };

    handleCnacelClick = () => {
        this.props.onTextFieldCacel && this.props.onTextFieldCacel(this.props.name);
        this.setState({
            editig: false,
            newValue: this.props.value,
            error: false,
        });
    };

    handleOkclick = async () => {
        let res = false;
        if (this.props.onTextFieldEdit) {
            this.setState({
                loading: true,
            });
            this.props.onTextFieldEdit && (res = await this.props.onTextFieldEdit(this.props.name, this.state.newValue));
            this.setState({
                loading: false,
            });
            if (res) {
                this.setState({
                    editig: false,
                    error: false,
                });
            } else {
                this.setState({
                    error: true,
                });
            }
        }
    };

    render = (): JSX.Element => {
        return (
            <div className="editable-container">
                {this.props.title && (
                    <div className="w-100">
                        <small>
                            <b>{this.props.title}</b>
                        </small>
                    </div>
                )}
                {this.state.editig ? (this.state.loading ? (
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                        <>
                            <div className="input-group">
                                <input
                                    className={this.state.error ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                    value={this.state.newValue}
                                    onChange={this.handleChange}
                                />
                                <div className="input-group-append btn-group-sm">
                                    <button
                                        onClick={this.handleCnacelClick}
                                        className="btn btn-info w-100"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <button
                                        className="btn btn-antxony w-100 round-right"
                                        onClick={this.handleOkclick}
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                </div>
                            </div>
                            {this.props.errorMsg ? (
                                <small className="text-danger">{this.props.errorMsg}</small>
                            ) : <></>}
                        </>
                    )) : (
                        <div className="editable-field-container">
                            <span className="editable-field" onClick={this.handleClick}>{this.props.value}</span>
                        </div>
                    )}
            </div>
        );
    };
}