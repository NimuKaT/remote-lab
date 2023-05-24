import { Box } from "@mui/material";
import React from "react";
// import AppTabBar from "./AppTabBar";
import BreadBoardWindow from "./BreadBoardWindow";
import SchematicWindow from "./SchematicWindow";
import ModalHook from "./ModalHook";

interface AppContainerP {
    schematic: boolean
    breadboard: boolean
}

type AppContainerS = {
    modalHook?: ModalHook
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

    render () {
        return (
            <Box className="AppContainer" sx={{flexGrow: 1, flexDirection: 'column', height:'100%', display: 'flex', flexFlow: 'column'}}>
                <ModalHook getRef={this.getRef.bind(this)}/>
                {/* <AppTabBar tabList={["Schematic", "BreadBoard"]} activeTab={"Schematic"} ></AppTabBar> */}
                <SchematicWindow isActive={this.props.schematic}/>
                <BreadBoardWindow isActive={this.props.breadboard} modalHook={this.state.modalHook}/>

            </Box>
        )
    }
}