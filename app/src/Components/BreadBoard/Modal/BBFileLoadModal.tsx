import React from "react";
import BBFileRep from "../BBTypes/BBFileRep";
import { Button, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

type BBFileLoadModalP = {
    closeFunc: () => void
    submitFunc: () => void
};
type BBFileLoadModalS = {};

export default class BBFileLoadModal extends React.Component<BBFileLoadModalP, BBFileLoadModalS> {
    constructor(P: BBFileLoadModalP, S: BBFileLoadModalS) {
        super(P, S);
    }

    render(): React.ReactNode {
        return <>
        <DialogTitle>
            <Typography>Load File?</Typography>
        </DialogTitle>
        <DialogContent dividers>
            <Typography>Are you sure you want to load this file? The current circuit will be erased with the new file.</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {this.props.submitFunc(); this.props.closeFunc()}}>Yes</Button>
            <Button onClick={this.props.closeFunc}>Cancel</Button>
        </DialogActions>
        </>
    }
}