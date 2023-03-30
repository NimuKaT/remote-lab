import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import AttrField from './AttrField';
import { SPComponent } from './SPComponent';

interface SpicePropertyP {
    comp: SPComponent;
    open: boolean;
    closeFunc: () => void;
}

interface SpicePropertyS {
    open: boolean
    attr: Map<string, string>
}


export default class SpiceProperty extends React.Component<SpicePropertyP, SpicePropertyS> {

    constructor(P: SpicePropertyP, S: SpicePropertyS) {
        super(P, S);
        this.state = {
            open: true,
            attr: new Map<string, string>()
        }
    }

    onClose() {
        this.props.closeFunc();
        this.setState({
            open: false
        })
    }
    
    onClick() {
        
    }

    onSubmit() {
        this.state.attr.forEach((val, key) => {
            this.props.comp.setAttribute(key, val);
        })
        this.onClose();
    }

    proposeChange(attr: string, value: string) {
        this.state.attr.set(attr, value);
    }

    render(): React.ReactNode {
        let ele: Array<React.ReactNode> = [];
        this.props.comp.getAttributeList().forEach((key) => {
            ele.push(<AttrField
                comp={this.props.comp}
                attr={key}
                propseChange={this.proposeChange.bind(this)}
                />);
        })
        return <Dialog hideBackdrop={true} open={this.state.open} onClose={this.onClose.bind(this)}
            onContextMenu={(e) => {
                e.preventDefault();
            }}>
            <DialogTitle>{this.props.comp.getName()}</DialogTitle>
            <DialogContent>
                {ele}
            </DialogContent>
            <DialogActions>
                <Button onClick={this.onSubmit.bind(this)}>Update</Button>
                <Button onClick={this.onClose.bind(this)}>Close</Button>
            </DialogActions>
            </Dialog>
    }
}