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
import BBStretchComp from "./BreadBoard/BBStretchComp";
import BBPlaceStretch from "./BreadBoard/BBTool/BBPlaceStretch";
import BBStretchObj from "./BreadBoard/BBStretchObj";


interface BBWindowP {
    isActive: boolean
}

interface BBWindowS {
    width: number,
    height: number,
    scale: number,
    board: BBoard,
    currTool?: BBTools
    tools: Map<string, BBTools>
}

export default class BreadBoardWindow extends React.Component<BBWindowP, BBWindowS> {
    stageRef: React.RefObject<stage> = React.createRef<stage>();
    tools: Map<string, BBTools> = new Map<string, BBTools>();
    constructor(P: BBWindowP, S: BBWindowS) {
        super(P, S);
        let board = new BBoard(2, 10, 5, this);
        let tool = new BBPlaceStatic(board, this.stageRef);
        tool.onInitialise();
        let toolMap = new Map<string, BBTools>();
        toolMap.set('PlaceStatic', tool);
        tool = new BBWireTool(board, this.stageRef);
        board.deleteComponents();
        toolMap.set("Wire", tool);
        tool = new BBPlaceStretch(board, this.stageRef);
        toolMap.set("PlaceStretch", tool);
        board.cancelMovement()
        
        this.state = {
            width: 500,
            height: 500,
            scale: 3,
            board: board,
            currTool: tool,
            tools: toolMap
        }
        window.addEventListener('resize', this.updateStage.bind(this), true);
        
    }

    componentDidMount(): void {
        let element = document.getElementById("BBContainer");
        if (element) {
            element.tabIndex = 1;
            element.addEventListener('keydown', this.keydown.bind(this))
            let parentElement = element.parentElement;
            if (parentElement) {
                let w = parentElement.offsetWidth;
                let h = parentElement.offsetHeight;
                this.setState({
                    width: w,
                    height: h
                })
            }
        }
    }



    updateStage() {
        let element = document.getElementById("BBContainer");
        if (element) {
            let parentElement = element.parentElement;
            if (parentElement) {
                let w = parentElement.offsetWidth;
                let h = parentElement.offsetHeight;
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
                    draggable={true}
                    visible={this.props.isActive}
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                >
                    <Layer x={120} y={120}>
                        {this.state.board.getNodes().map((node) => {
                            return <BBNodeObj node={node}/>
                        })}
                        {this.state.board.getLabels().map((lable) => {
                            return <Text x={lable.pos.x} y={lable.pos.y} text={lable.text}
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
                    </Layer>

                </Stage>
            </Box>
        </div>
    }
}