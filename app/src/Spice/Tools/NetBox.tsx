
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React from 'react';

interface NetBoxP {
    open: boolean;
    submitFunc: () => void;
    closeFunc: () => void;
    setName: (name: string) => void;
}

interface NetBoxS {
    open: boolean
    value: string
}


export default class NetBox extends React.Component<NetBoxP, NetBoxS> {

    constructor(P: NetBoxP, S: NetBoxS) {
        super(P, S);
        this.state = {
            open: true,
            value: ''
        }
    }

    onClose() {
        this.props.closeFunc();
        this.setState({
            open: false
        })
    }
    
    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.props.setName(evt.target.value)
        this.setState({
            value: evt.target.value
        })
    }

    onSubmit() {
        this.props.submitFunc();
        this.setState({
            open: false
        })
    }


    render(): React.ReactNode {
        return <Dialog hideBackdrop={true} open={this.state.open} onClose={this.onClose.bind(this)}
            onContextMenu={(e) => {
                e.preventDefault();
            }}>
            <DialogTitle>Net Label</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth
                    value={this.state.value}
                    label="Net name"
                    onChange={this.onChange.bind(this)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.onSubmit.bind(this)}>Update</Button>
                <Button onClick={this.onClose.bind(this)}>Close</Button>
            </DialogActions>
            </Dialog>
    }
}