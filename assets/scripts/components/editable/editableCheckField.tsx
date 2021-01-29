import LoaderH from '@components/loader/loaderH';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface EditableCheckFieldPropsI {
    data: CheckValue[];
    options: CheckValue[];
    title?: string;
    name: string;
    errorMsg?: string;
    wait?: boolean;
    onTextFieldEdit?: (name: string, value: string[]) => Promise<boolean>;
    onTextFieldCacel?: (name: string) => void;
}

interface EditableFieldStatesI {
    editig: boolean;
    newData: CheckValue[];
    loading: boolean;
    error: boolean;
}

interface CheckValue {
    value: string;
    showValue?: string;
}

interface OptionsI extends CheckValue {
    checked: boolean;
}

export default class _EditableCheckField extends React.Component<EditableCheckFieldPropsI, EditableFieldStatesI> {

    protected options: OptionsI[];

    constructor (props: EditableCheckFieldPropsI) {
        super(props);
        this.state = {
            editig: false,
            newData: this.props.data,
            loading: false,
            error: false,
        };
        this.options = [];
    }

    handleClick = (e: React.MouseEvent<HTMLElement>) => {
        this.setState({
            editig: true
        });
    };

    handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let selection = this.state.newData.slice();
        if (e.target.checked) {
            if (!selection.map(val => val.value).includes(e.target.id)) {
                selection.push(this.props.options.filter(op => op.value == e.target.id)[ 0 ]);
            }
        } else {
            selection.splice(selection.findIndex((role) => role.value == e.target.id), 1);
        }
        this.setState({
            newData: selection.sort((a, b) => {
                if (a.value < b.value)
                    return -1;
                else if (a.value > b.value)
                    return 1;
                else
                    return 0;
            }),
        });
    };

    handleCnacelClick = () => {
        this.props.onTextFieldCacel && this.props.onTextFieldCacel(this.props.name);
        this.options = [];
        this.setState({
            editig: false,
            newData: this.props.data,
            error: false,
        });
    };

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(this.state.newData);
        if (this.props.onTextFieldEdit) {
            this.setState({
                loading: true,
            });
            const res = await this.props.onTextFieldEdit(this.props.name, this.state.newData.map(val => val.value));
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

    EditableField = (): JSX.Element => {
        let list: JSX.Element | JSX.Element[];
        if (this.state.newData.length > 0) {
            list = this.state.newData.map((val, i) => {
                return (
                    <li
                        key={val.value}
                        className="editable-field"
                        onClick={this.handleClick}
                    >
                        {val.showValue || val.value}
                    </li>
                );
            });
        } else {
            list = (
                <li
                    className="editable-field empty"
                    onClick={this.handleClick}
                >
                    Vacío
                </li>
            );
        }
        return (
            <ul
                className="editable-field-container"
                style={{
                    listStyleType: "none",
                }}
            >
                {list}
            </ul>
        );
    };

    InputField = (): JSX.Element => {
        const options = this.props.options.map(option => {
            let checked = false;
            this.state.newData.forEach(dat => {
                return checked ||= (option.value === dat.value);
            });
            return {
                ...option,
                checked: checked,
            };
        });
        return (
            <>
                <div onChange={this.handleCheckChange}>
                    {options.map(option => {
                        return (
                            <div className="form-check" key={option.value}>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={option.value}
                                    defaultChecked={option.checked}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={option.value}>
                                    {option.showValue || option.value}
                                </label>
                            </div>
                        );
                    })}
                </div>
                <div className="btn-group btn-group-sm editable-buttons w-100">
                    <button
                        type="button"
                        onClick={this.handleCnacelClick}
                        className="btn btn-secondary w-100 round-left"
                    >
                        <FontAwesomeIcon icon={['fas', 'times']} />
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 round-right"
                    >
                        <FontAwesomeIcon icon={['fas', 'check']} />
                    </button>
                </div>
            </>
        );
    };

    render = (): JSX.Element => {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="editable-container">
                    {
                        this.props.title && (
                            <div className="w-100">
                                <small>
                                    <b>{this.props.title}</b>
                                </small>
                            </div>
                        )
                    }
                    {
                        (this.state.editig || this.props.wait)
                            ? (
                                (this.state.loading || this.props.wait)
                                    ? (<LoaderH position="left" />)
                                    : (<this.InputField />)
                            )
                            : <this.EditableField />
                    }
                </div>
            </form>
        );
    };
}