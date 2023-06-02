import { Box } from "@mui/material";
import React from "react";
// import AppTabBar from "./AppTabBar";
import BreadBoardWindow from "./BreadBoardWindow";
import SchematicWindow from "./SchematicWindow";
import ModalHook from "./ModalHook";
import SnackbarHook from "./SnackbarHook";

interface AppContainerP {
    schematic: boolean
    breadboard: boolean
}

type AppContainerS = {
    modalHook?: ModalHook,
    SnackbarHook?: SnackbarHook
}

export default class AppContainer extends React.Component<AppContainerP, AppContainerS> { 
    constructor(P: AppContainerP, S: AppContainerS) {
        super(P, S)
        this.state = {}
    }
    getRef(ref: ModalHook) {
        this.setState({
            modalHook: ref
        })
    }
    getSnackbarRef(ref: SnackbarHook) {
        this.setState({
            SnackbarHook: ref
        })
    }

    render () {
        return (
            <Box className="AppContainer" sx={{flexGrow: 1, flexDirection: 'column', height:'100%', display: 'flex', flexFlow: 'column'}}>
                <ModalHook getRef={this.getRef.bind(this)}/>
                <SnackbarHook getRef={this.getSnackbarRef.bind(this)}/>
                {/* <AppTabBar tabList={["Schematic", "BreadBoard"]} activeTab={"Schematic"} ></AppTabBar> */}
                <SchematicWindow isActive={this.props.schematic}/>
                <BreadBoardWindow isActive={this.props.breadboard} modalHook={this.state.modalHook} SnackbarHook={this.state.SnackbarHook}/>

            </Box>
        )
    }
}