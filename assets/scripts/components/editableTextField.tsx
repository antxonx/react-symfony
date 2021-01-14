import React from 'react';
import LoaderH from './loader/loaderH';

interface EditableTextFieldPropsI {
    value?: string;
    title?: string;
    name: string;
    errorMsg?: string;
    wait?: boolean;
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
            newValue: this.props.value || "",
            loading: false,
            error: false,
        };
    }

    handleClick = () => {
        this.setState({
            editig: !this.state.editig,
            newValue: this.props.value || "",
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
            newValue: this.props.value || "",
            error: false,
        });
    };

    handleSubmit = async () => {
        let res = false;
        if (this.props.onTextFieldEdit) {
            this.setState({
                loading: true,
            });
            res = await this.props.onTextFieldEdit(this.props.name, this.state.newValue);
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
                {this.state.editig || this.props.wait ? (this.state.loading || this.props.wait ? (
                    <LoaderH position="left" />
                ) : (
                        <form onSubmit={this.handleSubmit}>
                            <div className="input-group">
                                <input
                                    className={this.state.error ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                                    value={this.state.newValue}
                                    onChange={this.handleChange}
                                />
                                <div className="input-group-append btn-group-sm editable-buttons">
                                    <button
                                        type="button"
                                        onClick={this.handleCnacelClick}
                                        className="btn btn-info w-100"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-antxony w-100 round-right"
                                        onClick={this.handleSubmit}
                                    >
                                        <i className="fas fa-check"></i>
                                    </button>
                                </div>
                            </div>
                            {this.props.errorMsg ? (
                                <small className="text-danger">{this.props.errorMsg}</small>
                            ) : <></>}
                        </form>
                    )) : (
                        <div className="editable-field-container">
                            <span className="editable-field" onClick={this.handleClick}>{this.props.value}</span>
                        </div>
                    )}
            </div>
        );
    };
}