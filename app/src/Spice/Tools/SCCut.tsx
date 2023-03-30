import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import React from "react";
import { Rect } from "react-konva";
import { CollisionBox } from "../CollisionBox";
import SpiceSchematic from "../SpiceSchematic";
import SCTools from "./SCTools";

export default class SCCut extends SCTools {

    constructor(schematic: SpiceSchematic, stageRef: React.RefObject<Stage>, currTool: SCTools | undefined) {
        super(schematic, stageRef, currTool);
        if (this.hasSelected) {
            this.schematic.deleteSelected();
            this.hasSelected = false;
        }
    }
    
    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        if (evt.evt.button == 0) {
            this.isSelecting = true;
            this.mouseRef = this.getPointerPos();
        }
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        if (this.isSelecting) {
            let pos: Vector2d = this.getPointerPos();
            this.delta.x = pos.x - this.mouseRef.x;
            this.delta.y = pos.y - this.mouseRef.y;
            if (Math.abs(this.delta.x) > this.moveThreshold ||
                Math.abs(this.delta.y) > this.moveThreshold) {
                    this.hasMoved = true;
            }
        }
    }

    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        if (evt.evt.button === 0) {
            this.onMouseMove(evt);
            if (this.isSelecting) {
                // check if clicked on component

                if (this.hasMoved) {
                    // Select items
                    let pos: Vector2d = this.getPointerPos();
                    this.isSelecting = false;
                    this.hasMoved = false;
                    let rect: CollisionBox = {
                        x1: this.mouseRef.x,
                        y1: this.mouseRef.y,
                        x2: pos.x,
                        y2: pos.y
                    }
                    if (rect.x1 > rect.x2) {
                        rect.x1 = rect.x2;
                        rect.x2 = this.mouseRef.x;
                    }
                    if (rect.y1 > rect.y2) {
                        rect.y1 = rect.y2;
                        rect.y2 = this.mouseRef.y;
                    }
                    this.hasSelected = this.schematic.selectComponents(rect);
                    this.schematic.deleteSelected();
                }
            }
        }
    }

    onToolChange(newTool: SCTools): void {
        
    }

    render(): JSX.Element {
        return (<>
        {this.isSelecting && this.hasMoved ? 
        <Rect x={this.mouseRef.x} y={this.mouseRef.y}
            width={this.delta.x}
            height={this.delta.y}
            stroke={'black'}
            strokeWidth={0.2}
            draggable={false}
        /> : ''}
        </>)
    }
}