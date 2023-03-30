import { KonvaEventObject } from "konva/lib/Node";
import SCTools from "./SCTools";

export default class SCWireTool extends SCTools {
    round: number = 16;
    
    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        if (!this.hasSelected) {
            // Place wire down
            let pos = this.getPointerPos();
            pos.x = Math.round(pos.x/this.round)*this.round;
            pos.y = Math.round(pos.y/this.round)*this.round;
            this.mouseRef = pos;
            this.schematic.createNewWire(pos);
            this.hasSelected = true;


        } else {
            // Terminate Wire
            let rawPos = this.getPointerPos();
            let pos = {
                x: Math.round(rawPos.x/this.round)*this.round,
                y: Math.round(rawPos.y/this.round)*this.round
            }
            this.delta.x = pos.x - this.mouseRef.x;
            this.delta.y = pos.y - this.mouseRef.y;
            if (Math.abs(this.delta.x) > Math.abs(this.delta.y)) {
                this.delta.y = 0;
            }  else {
                this.delta.x = 0;
            }
            this.schematic.moveFollowers(this.delta)
            this.schematic.place();
            this.hasSelected = false;
        }
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
            let rawPos = this.getPointerPos();
            let pos = {
                x: Math.round(rawPos.x/this.round)*this.round,
                y: Math.round(rawPos.y/this.round)*this.round
            }
            this.delta.x = pos.x - this.mouseRef.x;
            this.delta.y = pos.y - this.mouseRef.y;
            if (Math.abs(this.delta.x) > Math.abs(this.delta.y)) {
                this.delta.y = 0;
            }  else {
                this.delta.x = 0;
            }
            this.schematic.moveFollowers(this.delta)
    }

    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        
    }

    onToolChange(newTool: SCTools): void {
        this.schematic.deleteSelected();
    }

    render(): JSX.Element {
        return <></>
    }
}