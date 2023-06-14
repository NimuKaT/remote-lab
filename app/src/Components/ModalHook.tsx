import { Dialog, DialogContent, DialogTitle, Modal } from "@mui/material";
import React from "react";
import { ModalAttr } from "./ModalAttr";

type ModalHookP = {
    getRef: (ref: ModalHook) => void
}

type ModalHookS = {
    open: boolean
    attr: ModalAttr,
    closeFunc: () => void
    content?: JSX.Element
}

export default class ModalHook extends React.Component<ModalHookP, ModalHookS> {

    constructor(P: ModalHookP, S: ModalHookS) {
        super(P, S);
        this.state = {
            open: false,
            attr: {},
            closeFunc: () => {}
        }
    }
    
    componentDidMount(): void {
        this.props.getRef(this)
    }

    getRef() {
        this.props.getRef(this)
    }

    openModal(attr: ModalAttr, content: JSX.Element, closeFunc: () => void) {
        this.setState({
            open: true,
            attr: attr,
            content: content,
            closeFunc: closeFunc
        })
    }

    getClose() {
        return this.onClose.bind(this)
    }

    onClose(){
        this.state.closeFunc();
        this.setState({
            open: false
        })
    }

    render(): React.ReactNode {
        return <>
            <Dialog
                open={this.state.open}
                onClose={this.onClose.bind(this)}
                hideBackdrop={this.state.attr.hideBackdrop ? this.state.attr.hideBackdrop : false}
                keepMounted={this.state.attr.keepMounted ? this.state.attr.keepMounted : false}
                sx={this.state.attr.sx ? this.state.attr.sx : {}}
            > 
                {this.state.content ? this.state.content : <h2></h2>}
            </Dialog>
        </>
    }

}