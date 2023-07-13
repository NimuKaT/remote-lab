import { DialogContent, DialogTitle, Divider, List, ListItem, ListItemButton, ListItemText, TextField } from "@mui/material";
import React from "react";
import { BBResItem } from "./BBResItem";
import BBCompSearch from "./BBCompSearch";

type BBResModalP = {
    closeFunc: () => void
    setFunc:(val: string) => void
}

type BBResModalS = {
    value: string,
    result: Array<BBResItem>,
    first: boolean
}

export default class BBResModal extends React.Component<BBResModalP,BBResModalS> {
    compSerach: BBCompSearch = new BBCompSearch();

    constructor(P: BBResModalP, S: BBResModalS) {
        super(P, S);
        this.state = {
            value: '',
            result: [{value: '4.7', tolerance:'5%',band:4}, {value:'4.7k', tolerance:'5%',band:4}],
            first: true
        }
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        if (this.state.first) {
            this.setState({
                first: false
            })
        } else {
            this.setState({
                value: evt.target.value,
                result: this.compSerach.findRes(evt.target.value)
            })
        }
    }

    componentDidMount(): void {
        
    }

    render() {
        return <>
        <DialogTitle>
                <TextField value={this.state.value} onChange={this.onChange.bind(this)} placeholder={"Enter resistor value. E.g. 4.7k"} sx={{minWidth: 250}} autoFocus/>
        </DialogTitle>
        {this.state.value === '' ? <></> :
        <DialogContent dividers>
            <List
                sx={{width: "100%", maxHeight: 300, overflow: 'auto'}}
            >

            {this.state.result.map((item, index) => {
               return <><ListItemButton key={item.value} onClick={() =>{this.props.setFunc(item.value);this.props.closeFunc();}}><ListItemText primary={item.value}/></ListItemButton>{this.state.result.length === index+1 ? '' : <Divider />}</>
            })}
            </List>

        </DialogContent>}
        </>
    }
}