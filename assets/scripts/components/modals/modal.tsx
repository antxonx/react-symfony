import React from 'react';
import ButtonClose from '@components/buttons/buttonClose';
import LoaderH from '@components/loader/loaderH';
import Button from '@components/buttons/button';

interface ModalPropsI {
    show: boolean;
    size?: number;
    onClose: (name: string) => void;
    title?: string;
    name?: string;
    loading: boolean;
}

export default class Modal extends React.Component<ModalPropsI, {}> {

    private size: number;

    private bodyOverflow: string;

    constructor (props: ModalPropsI) {
        super(props);
        this.bodyOverflow = "";
        this.size = this.props.size || 50;
    }

    handleClick = () => {
        (
            (this.props.name && this.props.onClose(this.props.name)) ||
            this.props.onClose("_")
        );
    };

    hideScroll = () => {
        if (this.props.show) {
            this.bodyOverflow = document.body.style.overflowY;
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = this.bodyOverflow;
        }
    };

    render = (): JSX.Element => {
        this.hideScroll();
        return (
            <div
                className={"modal-component" + (this.props.show ? " show" : "")}
            >
                <div
                    className="modal-component-content"
                    style={{
                        width: `${this.props.size || 50}%`,
                    }}
                >
                    <div className="w-100 h-100 pt-2">
                        <h5 className="text-center">
                            {this.props.title}
                            <ButtonClose
                                onClick={this.handleClick}
                                float="right"
                                extraClass="hide-on-mobile"
                            />
                        </h5>
                        {this.props.title && <hr />}
                        <div className="modal-component-body">
                            {
                                this.props.loading
                                    ? <LoaderH position="center" />
                                    : this.props.children
                            }
                        </div>
                        <Button
                            color="danger"
                            content="Cerrar"
                            extraClass="w-100 mt-2 hide-on-desktop"
                            onClick={this.handleClick}
                        />
                    </div>
                </div>
            </div>

        );
    };
}