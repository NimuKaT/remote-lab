import { Box } from "@mui/material";
import React from "react";
// import AppTabBar from "./AppTabBar";
import BreadBoardWindow from "./BreadBoardWindow";
import SchematicWindow from "./SchematicWindow";

interface AppContainerP {
    schematic: boolean
    breadboard: boolean
}

export default class AppContainer extends React.Component<AppContainerP, {}> { 


    render () {
        return (
            <Box className="AppContainer" sx={{flexGrow: 1, flexDirection: 'column', height:'100%', display: 'flex', flexFlow: 'column'}}>
                {/* <AppTabBar tabList={["Schematic", "BreadBoard"]} activeTab={"Schematic"} ></AppTabBar> */}
                <SchematicWindow isActive={this.props.schematic}/>
                <BreadBoardWindow isActive={this.props.breadboard}/>

            </Box>
        )
    }
}