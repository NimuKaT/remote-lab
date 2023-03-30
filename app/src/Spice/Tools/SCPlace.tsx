import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import React from "react";
import SpiceSchematic from "../SpiceSchematic";
import SCTools from "./SCTools";


export default class SCPlace extends SCTools {
    compType: string;
    round: number = 16;
    force: () => void;
    constructor(schematic: SpiceSchematic, stageRef: React.RefObject<Stage>,
            currTool: SCTools|undefined = undefined, compType: string = "",
            force: () => void
            ) {
        super(schematic, stageRef, currTool);
        this.schematic.cancelMove();
        this.compType = compType;
        this.force = force;
        let pos = this.getPointerPos();
        pos.x = Math.round(pos.x/this.round)*this.round;
        pos.y = Math.round(pos.y/this.round)*this.round;
        this.schematic.createNewSpiceComponent(compType,
            pos, true, true);
        this.mouseRef = pos;
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
        this.schematic.createNewSpiceComponent(this.compType,
            rawPos, true, true);
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