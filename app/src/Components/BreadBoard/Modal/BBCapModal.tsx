import { DialogContent, DialogTitle, Divider, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import React from "react";
import BBCompSearch from "./BBCompSearch";

type BBCapModalP = {
    closeFunc: () => void
    setFunc:(val: string) => void
}

type BBCapModalS = {
    value: string,
    result: Array<string>
}

export default class BBCapModal extends React.Component<BBCapModalP,BBCapModalS> {
    compSerach: BBCompSearch = new BBCompSearch();

    constructor(P: BBCapModalP, S: BBCapModalS) {
        super(P, S);
        this.state = {
            value: '',
            result: []
        }
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: evt.target.value,
            result: this.compSerach.findCap(evt.target.value)
        })
    }

    render() {
        return <>
        <DialogTitle>
            <TextField value={this.state.value} onChange={this.onChange.bind(this)} placeholder={"Enter capacitor value. E.g. 4.7u"} sx={{minWidth: 250}}/>
        </DialogTitle>
        {this.state.value === '' ? <></> :
        <DialogContent dividers>
            <List
                sx={{width: "100%", maxHeight: 300, overflow: 'auto'}}
            >

            {this.state.result.map((item, index) => {
               return <><ListItemButton key={item} onClick={() =>{this.props.setFunc(item);this.props.closeFunc();}}><ListItemText primary={item}/></ListItemButton>{this.state.result.length === index+1 ? '' : <Divider />}</>
            })}
            </List>

        </DialogContent>}
        </>
    }
}