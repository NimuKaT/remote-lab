import { Box } from "@mui/material";
import React, { DragEventHandler } from "react";
import { Layer, Line, Stage, Text } from "react-konva";
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
import BBToolBar from "./BBToolBar";
import BBDelete from "./BreadBoard/BBTool/BBDelete";
import e from "express";
import BBFileRep from "./BreadBoard/BBTypes/BBFileRep";
import BBFileLoadModal from "./BreadBoard/Modal/BBFileLoadModal";


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
    tools: Map<string, BBTools>,
    toolName: string,
    simState: string
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
        toolMap.set("Wire", tool);
        tool = new BBPlaceStretch(board, this.stageRef);
        toolMap.set("PlaceStretch", tool);
        board.cancelMovement()
        tool = new BBSelect(board, this.stageRef);
        toolMap.set("Select", tool);
        tool = new BBDelete(board, this.stageRef);
        toolMap.set("Delete", tool);
        
        this.state = {
            width: 50,
            height: 50,
            scale: 1.6,
            board: board,
            hasModalRef: false,
            currTool: undefined,
            tools: toolMap,
            toolName: "Pan",
            simState: "Off"
        }
        board.deleteComponents();
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
                let h = window.innerHeight - 164
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
                let h = window.innerHeight - 164
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
        if (this.state.scale > 0.1 && this.state.scale < 20) {
            this.setState({scale: this.state.scale - evt.deltaY/1000})
        }
    }

    setTool(toolName: string) {
        let element = document.getElementById("BBContainer")
        element?.focus();
        if (toolName === 'Pan') {
            this.state.currTool?.onToolChange(this.state.currTool)
            this.setState({
                currTool: undefined,
                toolName: 'Pan'
            })

        } else if (toolName === 'Select') {
            let tool: BBTools| undefined = this.state.tools.get("Select");
            if (tool instanceof BBSelect) {
                let select: BBSelect = tool;
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool,
                    toolName: "Select"
                })
            }
        } else if (toolName === 'Delete') {
            let tool: BBTools| undefined = this.state.tools.get("Delete");
            if (tool instanceof BBDelete) {
                let select: BBDelete = tool;
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool,
                    toolName: "Delete"
                })
            }
        } else if (toolName === 'Wire') {
            let tool: BBTools| undefined = this.state.tools.get("Wire");
            if (tool) {
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool,
                    toolName: 'Wire'
                })
            }
        } else if (toolName === 'Resistor') {
            let tool: BBTools | undefined = this.state.tools.get("PlaceStretch");
            if (tool instanceof BBPlaceStretch) {
                let placeStretch: BBPlaceStretch = tool;
                placeStretch.setComponent('res', '1k');
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool,
                    toolName: "Resistor"
                })
            }
        } else if (toolName === 'Capacitor') {
            let tool: BBTools | undefined = this.state.tools.get("PlaceStretch");
            if (tool instanceof BBPlaceStretch) {
                let placeStretch: BBPlaceStretch = tool;
                placeStretch.setComponent('cap', '1u');
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool,
                    toolName: 'Capacitor'
                })
            }
        } else if (toolName === 'IC') {
            this.state.currTool?.onInitialise();
            let tool: BBTools| undefined = this.state.tools.get("PlaceStatic");
            if (tool) {
                this.state.currTool?.onToolChange(tool);
                tool.onInitialise();
                this.setState({
                    currTool: tool,
                    toolName: 'IC'
                })
            }
        } else if (toolName === 'ZoomIn') {
            if (this.state.scale < 20) {
                this.setState({
                    scale: this.state.scale + 0.1
                })
            }
        } else if (toolName === 'ZoomOut') {
            if (this.state.scale > 0.1) {
                this.setState({
                    scale: this.state.scale - 0.1
                })
            }
        } else if (toolName === 'ResetZoom') {
            this.setState({
                scale: 1.6
            })
        } else if (toolName === 'Simulate') {
            this.state.currTool?.onToolChange(this.state.currTool)
            this.setState({
                currTool: undefined,
                toolName: "Pan",
                simState: "Running"
            })
            this.state.board.getNetList();
            this.submitNetList();
        } else if (toolName === 'Stop') {
            this.state.currTool?.onToolChange(this.state.currTool)
            this.stopSim()
        } else if (toolName === 'Save') {
            let comps = this.state.board.getComponents();
            localStorage.setItem("BreadBoard", JSON.stringify(comps))
        } else if (toolName === "Export") {
            this.state.board.cleanObjects()
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
                encodeURIComponent(JSON.stringify(this.state.board.getComponents())))
            element.setAttribute('download', 'schematic.bbsc')
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click()
            document.body.removeChild(element)
        }
    }

    keydown(evt: KeyboardEvent) {
        console.log("BBKey: " + evt.key);
        this.state.currTool?.onKeyDown(evt);
        if (evt.key === 'q') {
            this.setTool("IC")
        }
        if (evt.key === 'w') {
            this.setTool("Wire")
        }
        if (evt.key === 'r') {
            this.setTool("Resistor")
        }
        if (evt.key === 'c') {
            this.setTool("Capacitor")
        }
        if (evt.key === 's') {
            this.setTool("Select")
        }
        if (evt.key === 'd') {
            this.setTool("Delete")
        }
        if (evt.key === 'm') {
            this.setState({
                currTool: undefined,
                toolName: 'Pan'
            })
        }
        if (evt.key === 'Escape') {
            this.setTool('Pan')
        }
        if (evt.key === '`') {
            // this.state.board.getNetMap()
            this.setTool("Simulate")
        }
        if (evt.key === 'S') {
            this.setTool('Save')
        }
        if (evt.key === 'e') {
            this.setTool('Export')
        }
        

    }
    
    stopSim() {
        this.setState({
                // currTool: undefined,
                // toolName: "Pan",
                simState: "Stopped"
            })
        let url = "/api/stop"
        axios.get(url)
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
                this.props.SnackbarHook?.setSnackbar("Failed to implement circuit on PCB! The circuit has been turned off.", 'error', 6000)
                this.setState({
                    simState: "Stopped"
                })
            }
        });
    }

    handleFileDrag(event: React.DragEvent<HTMLFormElement>) { 
        event.preventDefault();
        event.stopPropagation();
        // console.log("Has drag event");
        
    }

    handleFileDrop(event: React.DragEvent<HTMLElement>) {
        event.preventDefault()
        event.stopPropagation()
        // console.log("got drop");
        
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            event.dataTransfer.files[0].text().then((value: string) => {
                try {
                    let data = JSON.parse(value);
                    let bb = data as BBFileRep;
                    console.log(bb);
                    this.props.modalHook?.openModal({}, 
                        <BBFileLoadModal closeFunc={this.props.modalHook.getClose()} submitFunc={this.state.board.loadCompoents.bind(this.state.board, bb)}/>,
                        () => {})
                    
                    // this.props.modalHook?.openModal()
                } catch(err) {}
            })
            
        }

    }

    render(): React.ReactNode {
        return <>
                {this.props.isActive?<BBToolBar activeTool={this.state.toolName} simState={this.state.simState} setTool={this.setTool.bind(this)}/>:""}
        <div id="BBContainer"
            onChange={this.updateStage.bind(this)}
            onContextMenu={(e) => {e.preventDefault()}}
        >
            <form id="breadboard-upload" onDragEnter={this.handleFileDrag.bind(this)} onDragLeave={(e) => {e.preventDefault()}} onDragOver={(e)=>{e.preventDefault()}} onDrop={this.handleFileDrop.bind(this)}>
                <input type="file" id="input-breadboard-file" multiple={false} style={{display: 'none'}} onClick={(e) => {e.preventDefault()}}/>
                <label htmlFor="input-breadboard-file" >
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
                        {/* <MultiMeter x={-450} y={-250}/> */}
                        <PowerSupply x={-50} y={-250}/>
                        <FunctionGenerator x={300} y={-250}/>
                        <Oscilloscope x={700} y={-300}/>

                        <Line points={[42, -62, 318, -62]} stroke={"#cc3355"} strokeWidth={3}/>
                        <Line points={[42, -58, 318, -58]} stroke={"#5533cc"} strokeWidth={3}/>

                        <Line points={[378, -62, 654, -62]} stroke={"#cc3355"} strokeWidth={3}/>
                        <Line points={[378, -58, 654, -58]} stroke={"#5533cc"} strokeWidth={3}/>

                        <Line points={[378, 298, 654, 298]} stroke={"#5533cc"} strokeWidth={3}/>
                        <Line points={[378, 302, 654, 302]} stroke={"#cc3355"} strokeWidth={3}/>
                        <Line points={[42, 298, 318, 298]} stroke={"#5533cc"} strokeWidth={3}/>
                        <Line points={[42, 302, 318, 302]} stroke={"#cc3355"} strokeWidth={3}/>

                        {this.state.board.getNodes().map((node, index) => {
                            return <BBNodeObj key={index} node={node}/>
                        })}
                        {this.state.board.getLabels().map((lable, index) => {
                            return <Text key={index} x={lable.pos.x} y={lable.pos.y} text={lable.text}
                            fontSize={18} width={24} align={"center"}/>
                        })}
                        {this.state.board.getWires().map((wire) => {
                            return <BBWireObj wire={wire}/>
                        })}
                        {this.state.board.getIC().map((ic) => {
                            return <BBFComp comp={ic}/>
                        })}
                        {this.state.board.getStretch().map((comp) => {
                            return <BBStretchObj comp={comp}/>
                        })}
                        {this.state.currTool !== undefined ? this.state.currTool.render() : ''}
                    </Layer>

                </Stage>
            </Box>
            </label>
            {/* <div style={{position: 'absolute', width: '100%', height: '100%'}}></div> */}
            </form>
        </div>
        </>
    }
}