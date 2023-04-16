import { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Layer, Stage} from "react-konva";
import {Stage as stage} from "konva/lib/Stage"
import SpiceSchematic from "../Spice/SpiceSchematic";
import SpiceWire from "../Spice/SpiceWire";
import SCTools from "../Spice/Tools/SCTools";
import SCMove from "../Spice/Tools/SCMove";
import SCSelect from "../Spice/Tools/SCSelect";
import SCPlace from "../Spice/Tools/SCPlace";
import SCPan from "../Spice/Tools/SCPan";
import SCCut from "../Spice/Tools/SCCut";
import SCWireObject from "../Spice/SCWireObject";
import SCWireTool from "../Spice/Tools/SCWireTool";
import { Box } from "@mui/material";
import NamedNet from "../Spice/NamedNet";
import NamedNetObj from "../Spice/NamedNetObj";
import SCNet from "../Spice/Tools/SCNet";


interface SchematicWindowProp {
    isActive: boolean;
    
}

interface SchematicWindowState {
    width: number;
    height: number
    scale: number;
    spiceSchematic: SpiceSchematic;
    tool: string;
    isFollowed: boolean;
    tools?: SCTools;
}


// TOOLS
// Pan
// Move
// Wire
// Copy
// Select

export default class SchematicWindow extends React.Component<SchematicWindowProp, SchematicWindowState> {
    ref: React.RefObject<stage>;
    
    constructor (props: SchematicWindowProp) {
        super(props);
        this.ref = React.createRef<stage>();
        this.state = {
            width: 500,
            height: 500,
            scale: 2.5,
            spiceSchematic: new SpiceSchematic(),
            tool: 'Pan',
            isFollowed: false
        }
    }
    
    componentDidMount() {
        if (this.ref.current) {
            this.ref.current.container().tabIndex = 1;
            this.ref.current.container().addEventListener('keydown', this.keydown.bind(this));
            this.ref.current.container().addEventListener('wheel', this.onScroll.bind(this))
        }
        this.setState({...this.updateStage(), scale: 2.5, 
            tool: 'Pan',
            isFollowed: false
        });
        window.addEventListener('resize', this.updateStage.bind(this), true);
        // let div = document.getElementById('Stage-container');
        // if (div) {
        //     let parent = document.body;
        //     parent?.addEventListener('onChange', this.updateStage.bind(this), true);
        //     if (parent) {
        //         new ResizeObserver(this.updateStage.bind(this)).observe(parent);
        //     }
        // }
        
    }
    
    onMouseDown(evt: KonvaEventObject<MouseEvent>) {
        this.state.tools?.onMouseDown(evt);
    }
    
    onMouseMove(evt: KonvaEventObject<MouseEvent>) {
        this.state.tools?.onMouseMove(evt);
        this.forceUpdate();
    }
    
    onMouseUp(evt: KonvaEventObject<MouseEvent>) {
        this.state.tools?.onMouseUp(evt);
    }
    
    keydown(evt: KeyboardEvent) {
        console.log(evt.key)
        if(evt.key === 'p') {
            this.setState({tool: 'Pan', tools: new SCPan(this.state.spiceSchematic, this.ref, this.state.tools)});
        } else if(evt.key === 'm') {
            this.setState({tool: 'Move', tools: new SCMove(this.state.spiceSchematic, this.ref, this.state.tools)})
        } else if(evt.key === 'w') {
            this.setState({tool: 'Wire', tools: new SCWireTool(this.state.spiceSchematic, this.ref, this.state.tools)});
        } else if (evt.key === '') {
            this.setState({tool: 'Place'});
        } else if (evt.key === "Escape") {
            this.setState({tool: 'Pan', tools: new SCPan(this.state.spiceSchematic, this.ref, this.state.tools)});
        } else if (evt.key === 'd') {
            this.forceUpdate();
            console.log(this.state.spiceSchematic.dumpNode());
        } else if (evt.key === 's') {
            this.setState({tool: 'Select', tools: new SCSelect(this.state.spiceSchematic, this.ref, this.state.tools)})
        } else if (evt.key === 'r') {
            this.setState({tool: 'Resistor', tools: new SCPlace(this.state.spiceSchematic, this.ref, this.state.tools, 'Resistor', this.forceUpdate.bind(this))})
        } else if (evt.key === 'c') {
            this.setState({tool: 'Capacitor', tools: new SCPlace(this.state.spiceSchematic, this.ref, this.state.tools, 'Capacitor', this.forceUpdate.bind(this))})
        } else if (evt.key === 'l') {
            this.setState({tool: 'Inductor', tools: new SCPlace(this.state.spiceSchematic, this.ref, this.state.tools, 'Inductor', this.forceUpdate.bind(this))})
        } else if (evt.key === 'v') {
            this.setState({tool: 'Voltage', tools: new SCPlace(this.state.spiceSchematic, this.ref, this.state.tools, 'Voltage', this.forceUpdate.bind(this))})
        } else if (evt.key === 'x') {
            this.setState({tool: 'Cut', tools: new SCCut(this.state.spiceSchematic, this.ref, this.state.tools)})
        } else if (evt.key === '-') {
            console.log(this.state.spiceSchematic.getSchemtaic().join("\n"));
            let ele = document.createElement('a');
            ele.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(['Version 4', 'SHEET 1 880 680'].concat(this.state.spiceSchematic.getSchemtaic()).join("\n")));
            ele.setAttribute('download', 'schematic.asc');
            ele.style.display = 'none';
            document.body.appendChild(ele);
            ele.click();
            document.body.removeChild(ele);
        } else if (evt.key === 'n') {
            this.setState({tool: 'Net', tools: new SCNet(this.state.spiceSchematic, this.ref, this.state.tools, this.forceUpdate.bind(this))});
        } else if (evt.key === 'g') {
            this.setState({tool: 'Net', tools: new SCNet(this.state.spiceSchematic, this.ref, this.state.tools, this.forceUpdate.bind(this), true)});
        } else if (evt.key === '`') {
            console.log(this.state.spiceSchematic.getNetlist())
            this.state.spiceSchematic.compareNetlist()
        } else if (evt.key === 'q') {
            console.log("placing comp");
            this.setState({tool: 'IC', tools: new SCPlace(this.state.spiceSchematic, this.ref, this.state.tools, 'LM301', this.forceUpdate.bind(this))})
        }
    }

    toPan() {
        this.setState({tool: 'Pan', tools: new SCPan(this.state.spiceSchematic, this.ref, this.state.tools)});
    }
    
    getMousePos() {
        return this.ref.current?.getRelativePointerPosition();
    }
    
    onScroll(evt: globalThis.WheelEvent) {
        console.log(evt.deltaY);
        evt.preventDefault();
        if (this.state.scale > 0.01 && this.state.scale < 20) {
            
            this.setState({scale: this.state.scale - evt.deltaY/1000})
        }
    }
    
    updateStage() {
        let ele = document.getElementById("Stage-container");
        if (ele) {
            let par = ele.parentElement;
            if (par) {
                let w = par.offsetWidth;
                let h = par.offsetHeight;
                this.setState({
                    width: w,
                    height: h
                });
                console.log("new size w: " + w + "h: " + h);
                
                return {width: w, height: h}
            }
        }
        return {width: this.state.width, height: this.state.height}
    }
    
    render() {
        return (
            <div id="Stage-container" onChange={this.updateStage.bind(this)} onContextMenu={(e) => {e.preventDefault()}}>
            <Box
            className="SchematicWindow"
            sx={{height: "100%", flexGrow: 1}}
            >
            <Stage width={this.state.width} height={this.state.height}
            scale={this.state ? {x: this.state.scale, y: this.state.scale} : {x: 2.5, y: 2.5}}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseMove={this.onMouseMove.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            draggable={this.state ? this.state.tool === 'Pan': false} 
            ref={this.ref}
            visible={this.props.isActive}
            >
            
            <Layer x={0} y={0}>
            {this.state && this.state.spiceSchematic.getComponents().map((element) => {
                return (element);
            })}
            {this.state && this.state.spiceSchematic.wires.map((wire: SpiceWire) => {
                // console.log(wire);
                return <SCWireObject wire={wire} x1={wire.getX1()} y1={wire.getY1()} 
                x2={wire.getX2()} y2={wire.getY2()} isPlaced={wire.isPlaced} nodes={wire.nodes}
                deleted={wire.deleted}
                />
            })}
            {
                this.state && this.state.spiceSchematic.getNets().map((net: NamedNet) => {
                    return <NamedNetObj namedNet={net} />
                })
            }
            </Layer>
            <Layer x={0} y={0}>
            {/* <Text x={0} y={0} text={this.state ? this.state.tool : ''}/> */}
            {this.state ? this.state.tools?.render(): ''}
            </Layer>
            {/* <Layer>
            {this.state && 
                this.state.tool === 'Select' && 
                this.state.isMouseDown ?
                <Rect x={this.state.mouseDownPos.x}
                y={this.state.mouseDownPos.y}
                width={this.state.mouseDelta.x}
                height={this.state.mouseDelta.y}
                stroke={'black'}
                strokeWidth={0.2}
                draggable={false}
                />  
                : ''}
            </Layer> */}
            </Stage>
            </Box>
            </div>
            
            )
        }
        
    }