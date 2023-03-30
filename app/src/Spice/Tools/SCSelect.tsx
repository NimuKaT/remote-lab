import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { Rect } from "react-konva";
import { CollisionBox } from "../CollisionBox";
import SCTools from "./SCTools";

export default class SCSelect extends SCTools {
    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        // Check if Left click
        if (evt.evt.button === 0) {
            if (this.hasSelected) {
                // Deselct items

                this.hasSelected = false;
            }
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
            if (this.isSelecting) {
                let pos: Vector2d = this.getPointerPos();
                this.delta.x = pos.x - this.mouseRef.x;
                this.delta.y = pos.y - this.mouseRef.y;
                this.isSelecting = false;
                this.hasMoved = false;
                this.hasSelected = true;
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
                this.schematic.selectComponents(rect);
                this.mouseRef = pos;
            }
        }
    }

    onToolChange(newTool: SCTools): void {
        newTool.hasSelected = this.hasSelected;
        newTool.mouseRef = this.mouseRef;
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