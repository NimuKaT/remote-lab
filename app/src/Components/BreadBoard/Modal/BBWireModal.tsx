import { Box, Button, DialogContent, DialogTitle, Divider, Grid, List, ListItemButton, ListItemText, TextField, styled } from "@mui/material";
import React from "react";
import BBCompSearch from "./BBCompSearch";

type BBWireModalP = {
    closeFunc: () => void
    setFunc:(val: string) => void
}

type BBWireModalS = {
    value: string,
    result: Array<string>
}

export default class BBWireModal extends React.Component<BBWireModalP,BBWireModalS> {
    compSerach: BBCompSearch = new BBCompSearch();

    constructor(P: BBWireModalP, S: BBWireModalS) {
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
        let colors: Array<string> = [
            "#D0312D", // Red
            "#3CB043", // Green
            "#3944BC", // Blue
            "#000000", // Black
            "#D4D4D4", // Grey
            "#FFF200", // Yellow
        ]
        let buttonsMap = colors.map((item, index) => {
                return styled(Button)({
                    backgroundColor: item
                })});
        return <>
        <DialogTitle>
            Set Wire Colour
        </DialogTitle>
        <DialogContent dividers>
            <Grid container spacing={{xs:2,md:3}} columns={{xs:4,sm:8,md:12}}>
                {colors.map((item, index) => {
                return <Grid item container xs={2} sm={4} md={4} key={index} sx={{backgroundColor: item}} margin={0} paddingTop={0}><Button sx={{width:100, height:30}}  fullWidth size="medium" onClick={()=>{this.props.setFunc(item);this.props.closeFunc()}}></Button></Grid>
                    // return <><ListItemButton key={index} onClick={() =>{this.props.setFunc(item);this.props.closeFunc();}} ><ListItemText primary={item}/></ListItemButton>{this.state.result.length === index+1 ? '' : <Divider />}</>
                })}
            </Grid>

        </DialogContent>
        </>
    }
}