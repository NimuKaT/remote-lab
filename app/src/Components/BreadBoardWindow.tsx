import { Box } from "@mui/material";
import React from "react";
import { Layer, Stage, Text } from "react-konva";
import BBFComp from "./BreadBoard/BBFComp";
import BBNodeObj from "./BreadBoard/BBNodeObj";
import BBoard from "./BreadBoard/BBoard";
import BBPlaceStatic from "./BreadBoard/BBTool/BBPlaceStatic";
import BBTools from "./BreadBoard/BBTool/BBTools";
import {Stage as stage} from "konva/lib/Stage"
import { KonvaEventObject } from "konva/lib/Node";
import BBWireObj from "./BreadBoard/BBWireObj";
import BBWireTool from "./BreadBoard/BBTool/BBWireTool";
import BBPlaceStretch from "./BreadBoard/BBTool/BBPlaceStretch";
import BBStretchObj from "./BreadBoard/BBStretchObj";
import ModalHook from "./ModalHook";
import PowerSupply from "./BreadBoard/Instruments/PowerSupply";
import FunctionGenerator from "./BreadBoard/Instruments/FunctionGenarator";
import Oscilloscope from "./BreadBoard/Instruments/Oscilloscope";
import MultiMeter from "./BreadBoard/Instruments/MultiMeter";
import BBSelect from "./BreadBoard/BBTool/BBSelect";
import axios, { AxiosRequestConfig } from "axios";
import SnackbarHook from "./SnackbarHook"


interface BBWindowP {
    isActive: boolean,
    modalHook?: ModalHook,
    SnackbarHook?: SnackbarHook
}

interface BBWindowS {
    width: number,
    height: number,
    scale: number,
    board: BBoard,
    hasModalRef: boolean,
    currTool?: BBTools
    tools: Map<string, BBTools>
}

export default class BreadBoardWindow extends React.Component<BBWindowP, BBWindowS> {
    stageRef: React.RefObject<stage> = React.createRef<stage>();
    tools: Map<string, BBTools> = new Map<string, BBTools>();
    constructor(P: BBWindowP, S: BBWindowS) {
        super(P, S);
        let board = new BBoard(2, 30, 5, this);
        
        // Initialises tools
        let tool: BBTools = new BBPlaceStatic(board, this.stageRef);
        tool.onInitialise();
        let toolMap: Map<string, BBTools> = new Map<string, BBTools>();
        toolMap.set('PlaceStatic', tool);
        tool = new BBWireTool(board, this.stageRef);
        board.deleteComponents();
        toolMap.set("Wire", tool);
        tool = new BBPlaceStretch(board, this.stageRef);
        toolMap.set("PlaceStretch", tool);
        board.cancelMovement()
        tool = new BBSelect(board, this.stageRef);
        toolMap.set("Select", tool);
        
        this.state = {
            width: 50,
            height: 50,
            scale: 1.6,
            board: board,
            hasModalRef: false,
            currTool: undefined,
            tools: toolMap
        }
        window.addEventListener('resize', this.updateStage.bind(this), true);
        
    }

    componentDidMount(): void {
        let element = document.getElementById("BBContainer");
        if (element) {
            element.tabIndex = 1;
            element.addEventListener('keydown', this.keydown.bind(this))
            element.addEventListener('wheel', this.onScroll.bind(this))
            let parentElement = element.parentElement;
            if (parentElement) {
                let w = parentElement.offsetWidth;
                let h = window.innerHeight - 70
                // let h = parentElement.offsetHeight;
                this.setState({
                    width: w,
                    height: h
                })
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<BBWindowP>, prevState: Readonly<BBWindowS>, snapshot?: any): void {
        if (this.props.modalHook && !this.state.hasModalRef) {
                this.state.board.getHookRef(this.props.modalHook);
                this.setState({
                    hasModalRef: true
                })
        }
    }



    updateStage() {
        let element = document.getElementById("BBContainer");
        if (element) {
            let parentElement = element.parentElement;
            if (parentElement) {
                let w = parentElement.offsetWidth -2;
                // let h = parentElement.offsetHeight;
                let h = window.innerHeight - 70
                this.setState({
                    width: w,
                    height: h
                })
            }
        }
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>) {
        this.state.currTool?.onMouseDown(evt);
    }
    onMouseMove(evt: KonvaEventObject<MouseEvent>) {
        this.state.currTool?.onMouseMove(evt);
    }
    onMouseUp(evt: KonvaEventObject<MouseEvent>) {
        this.state.currTool?.onMouseUp(evt);
    }
    onScroll(evt: globalThis.WheelEvent) {
        evt.preventDefault()
        if (this.state.scale > 0.01 && this.state.scale < 20) {
            this.setState({scale: this.state.scale - evt.deltaY/1000})
        }
    }

    keydown(evt: KeyboardEvent) {
        console.log("BBKey: " + evt.key);
        this.state.currTool?.onKeyDown(evt);
        if (evt.key === 'i') {
            this.state.currTool?.onInitialise();
            let tool: BBTools| undefined = this.state.tools.get("PlaceStatic");
            if (tool) {
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool
                })
            }
        }
        if (evt.key === 'w') {
            let tool: BBTools| undefined = this.state.tools.get("Wire");
            if (tool) {
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool
                })
            }
        }
        if (evt.key === 'r') {
            let tool: BBTools | undefined = this.state.tools.get("PlaceStretch");
            if (tool instanceof BBPlaceStretch) {
                let placeStretch: BBPlaceStretch = tool;
                placeStretch.setComponent('res', '1k');
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool
                })
            }
        }
        if (evt.key === 'c') {
            let tool: BBTools | undefined = this.state.tools.get("PlaceStretch");
            if (tool instanceof BBPlaceStretch) {
                let placeStretch: BBPlaceStretch = tool;
                placeStretch.setComponent('cap', '1u');
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool
                })
            }
        }
        if (evt.key === 's') {
            let tool: BBTools| undefined = this.state.tools.get("Select");
            if (tool instanceof BBSelect) {
                let select: BBSelect = tool;
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool
                })
            }
        }
        if (evt.key === 'm') {
            this.setState({
                currTool: undefined
            })
        }
        if (evt.key === 'Escape') {
            if (this.state.currTool) {
                this.state.currTool.onToolChange(this.state.currTool)
            }
            this.setState({
                currTool: undefined
            })
        }
        if (evt.key === '`') {
            // this.state.board.getNetMap()
            this.state.board.getNetList();
            this.submitNetList();
        }

    }

    submitNetList() {
        let data: Array<string> = this.state.board.getNetList();
        let url = "/api/runNetList";
        let config: AxiosRequestConfig = {
            "headers": {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
        axios.post(url, data, config).then((value) => {
            console.log(this.props.SnackbarHook)
            if (value.data === "ok") {
                console.log("ok")
                this.props.SnackbarHook?.setSnackbar("Successfully implemented circuit on PCB!", "success", 6000);
            } else {
                this.props.SnackbarHook?.setSnackbar("Failed to implement circuit on PCB!", 'error', 6000)
            }
        });
    }

    render(): React.ReactNode {
        return <div id="BBContainer"
            onChange={this.updateStage.bind(this)}
            onContextMenu={(e) => {e.preventDefault()}}
        >
            <Box
                className="BreadBoardWindow"
                sx={{height: "100%", flexGrow: 1}}
            >
                <Stage
                ref={this.stageRef}
                    width={this.state.width}
                    height={this.state.height}
                    scale={{x: this.state.scale, y:this.state.scale}}
                    draggable={this.state.currTool === undefined}
                    visible={this.props.isActive}
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                >
                    <Layer x={120} y={120}>
                        <MultiMeter x={-450} y={-250}/>
                        <PowerSupply x={-50} y={-250}/>
                        <FunctionGenerator x={300} y={-250}/>
                        <Oscilloscope x={700} y={-300}/>
                        {this.state.board.getNodes().map((node, index) => {
                            return <BBNodeObj key={index} node={node}/>
                        })}
                        {this.state.board.getLabels().map((lable, index) => {
                            return <Text key={index} x={lable.pos.x} y={lable.pos.y} text={lable.text}
                            fontSize={18} width={24} align={"center"}/>
                        })}
                        {this.state.board.getIC().map((ic) => {
                            return <BBFComp comp={ic}/>
                        })}
                        {this.state.board.getWires().map((wire) => {
                            return <BBWireObj wire={wire}/>
                        })}
                        {this.state.board.getStretch().map((comp) => {
                            return <BBStretchObj comp={comp}/>
                        })}
                        {this.state.currTool !== undefined ? this.state.currTool.render() : ''}
                    </Layer>

                </Stage>
            </Box>
        </div>
    }
}