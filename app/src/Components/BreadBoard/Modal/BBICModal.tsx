import { DialogContent, DialogTitle, Divider, List, ListItemButton, ListItemText, TextField } from "@mui/material";
import React from "react";
import BBCompSearch from "./BBCompSearch";

type BBICModalP = {
    closeFunc: () => void
    setFunc:(val: string, pinCount: number) => void
}

type BBICModalS = {
    value: string,
    result: Array<{name: string, pin: number}>
}

export default class BBICModal extends React.Component<BBICModalP,BBICModalS> {
    compSerach: BBCompSearch = new BBCompSearch();

    constructor(P: BBICModalP, S: BBICModalS) {
        super(P, S);
        this.state = {
            value: '',
            result: []
        }
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: evt.target.value,
            result: this.compSerach.findIC(evt.target.value.toUpperCase())
        })
    }

    render() {
        return <>
        <DialogTitle>
            <TextField value={this.state.value} onChange={this.onChange.bind(this)} placeholder={"Enter name of IC component. E.g. LM301"} sx={{minWidth: 350}}/>
        </DialogTitle>
        {this.state.value === '' ? <></> :
        <DialogContent dividers>
            <List
                sx={{width: "100%", maxHeight: 300, overflow: 'auto'}}
            >

            {this.state.result.map((item, index) => {
               return <><ListItemButton key={item.name} onClick={() =>{this.props.setFunc(item.name, item.pin);this.props.closeFunc();}}><ListItemText primary={item.name}/></ListItemButton>{this.state.result.length === index+1 ? '' : <Divider />}</>
            })}
            </List>

        </DialogContent>}
        </>
    }
}