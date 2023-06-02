import { Alert, AlertColor, Snackbar } from "@mui/material";
// import { Alert, Snackbar } from "material-ui";
import React from "react";

type SnackbarHookP = {
    getRef: (ref: SnackbarHook) => void
}
type SnackbarHookS = {
    open: boolean,
    autoHideDuration: number,
    message: string,
    severity: AlertColor
}

export default class SnackbarHook extends React.Component<SnackbarHookP, SnackbarHookS> {
    constructor(P: SnackbarHookP, S: SnackbarHookS) {
        super(P, S)
        this.state = {
            open: false,
            autoHideDuration: 0,
            message: "",
            severity: 'error'
        }
    }
    getRef() {
        this.props.getRef(this);
    }

    componentDidMount(): void {
        this.getRef()
    }

    setSnackbar(message: string, severity: AlertColor, autoHideDuration: number) {
        this.setState({
            open: true,
            autoHideDuration: autoHideDuration,
            message: message,
            severity: severity
        })
    }

    onClose() {
        this.setState({
            open: false
        })
    }

    render(): React.ReactNode {
        return <Snackbar open={this.state.open} onClose={this.onClose.bind(this)} anchorOrigin={{'vertical': 'bottom', "horizontal": "right"}} autoHideDuration={this.state.autoHideDuration}>
            <Alert onClose={this.onClose.bind(this)} severity={this.state.severity as AlertColor} sx={{width: '100%'}}>
                {this.state.message}
            </Alert>
        </Snackbar>
    }
}