import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import React from "react";
import ReactDOM from "react-dom";
import SpiceSchematic from "../SpiceSchematic";
import NetBox from "./NetBox";
import SCTools from "./SCTools";


export default class SCNet extends SCTools {
    netName: string = '';
    round: number = 16;
    force: () => void;
    isOpened: boolean;
    box?: Node;

    constructor(schematic: SpiceSchematic, stageRef: React.RefObject<Stage>,
            currTool: SCTools|undefined = undefined,
            force: () => void,
            gnd: boolean = false
            ) {
        super(schematic, stageRef, currTool);
        this.schematic.cancelMove();
        this.force = force;
        let pos = this.getPointerPos();
        pos.x = Math.round(pos.x/this.round)*this.round;
        pos.y = Math.round(pos.y/this.round)*this.round;
        this.mouseRef = pos;
        this.isOpened = true;
        if (gnd) {
            this.netName = '0';
            let pos: Vector2d = {x:0, y:0};
            let rawPos = this.getPointerPos();
            pos.x = Math.round(rawPos.x/this.round)*this.round;
            pos.y = Math.round(rawPos.y/this.round)*this.round;
            this.mouseRef = rawPos;
            this.schematic.createNamedNet(this.netName,
                pos
            );   
        }
        else {
            let element = document.createElement('div');
            element.id = 'NetNameBox'
            document.body.appendChild(element);
            this.box = element;
            ReactDOM.render(<NetBox
                open={true}
                closeFunc={this.cancel.bind(this)}
                submitFunc={this.close.bind(this)}
                setName={this.setName.bind(this)}
                />
                ,
                document.getElementById('NetNameBox')
            );
        }
        // Create Netname window
    }

    setName(name: string) {
        this.netName = name;
    }

    close() {
        if (this.box) {
            document.body.removeChild(this.box);
        }
        let pos: Vector2d = {x:0, y:0};
        let rawPos = this.getPointerPos();
        pos.x = Math.round(rawPos.x/this.round)*this.round;
        pos.y = Math.round(rawPos.y/this.round)*this.round;
        this.mouseRef = rawPos;
        this.schematic.createNamedNet(this.netName,
            pos
        );
        console.log("net at" + pos);
        
        this.force();
    }

    cancel() {
        if (this.box) {
            document.body.removeChild(this.box);
        }
        // Change to Pan
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        // Place component and make new component
        let pos: Vector2d = {x:0, y:0};
        let rawPos = this.getPointerPos();
        pos.x = Math.round(rawPos.x/this.round)*this.round - this.mouseRef.x;
        pos.y = Math.round(rawPos.y/this.round)*this.round - this.mouseRef.y;
        this.schematic.moveFollowers(pos);
        this.schematic.place();
        
        rawPos.x = Math.round(rawPos.x/this.round)*this.round;
        rawPos.y = Math.round(rawPos.y/this.round)*this.round;
        this.schematic.createNamedNet(this.netName,
            rawPos);
        this.mouseRef = rawPos;
        this.force();
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos();
        pos.x = Math.round(pos.x/this.round)*this.round - this.mouseRef.x;
        pos.y = Math.round(pos.y/this.round)*this.round - this.mouseRef.y;
        this.schematic.moveFollowers(pos);
    }

    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        
    }

    onToolChange(newTool: SCTools): void {
        // Remove current Component        
        this.schematic.deleteSelected();
    }



    render(): JSX.Element {
        return (<></>)
    }
}