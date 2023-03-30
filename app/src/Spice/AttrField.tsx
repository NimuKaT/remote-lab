import { TextField } from "@mui/material";
import React from "react";
import { SPComponent } from "./SPComponent";

interface AttrFieldP {
    comp: SPComponent
    attr: string
    propseChange: (attr: string, value: string) => void
}

interface AttrFieldS {
    value: string
}

export default class AttrField extends React.Component<AttrFieldP, AttrFieldS> {
    constructor(P: AttrFieldP, S: AttrFieldS) {
        super(P, S);
        let val = P.comp.getAttribute(P.attr); 
        if (!val) {
            val = "";
        }
        this.state= {
            value: val
        }
    }

    onChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.props.propseChange(this.props.attr, evt.target.value)
        this.setState({
            value: evt.target.value
        })
    }

    render() {
        return <TextField
            fullWidth
            margin="normal"
            id={this.props.attr}
            label={this.props.attr}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
        >

        </TextField>
    }
}