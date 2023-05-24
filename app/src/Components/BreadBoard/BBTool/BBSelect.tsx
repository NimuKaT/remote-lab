import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";
import { Rect } from "react-konva";


export default class BBSelect extends BBTools {
    onInitialise(): void {
        console.log("BBSelect");
        
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
       this.isSelecting = true 
       let pos = this.getPointerPos();
       this.mouseRef.x = pos.x;
       this.mouseRef.y = pos.y;
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        if (this.isSelecting) {
            let pos = this.getPointerPos();
            if (Math.sqrt(Math.pow(this.mouseRef.x - pos.x, 2) + Math.pow(this.mouseRef.y - pos.y,2)) >= this.moveThreshold) {
                this.hasMoved = true
            }
            this.board.foreceUpdate();
            
        }
   }

    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        this.isSelecting = false 
        let pos = this.getPointerPos();
        let x = this.mouseRef.x;
        let y = this.mouseRef.y;
        let w = Math.abs(x - pos.x)
        let h = Math.abs(y - pos.y)
        if (x > pos.x) {
            x = pos.x
        }
        if (y > pos.y) {
            y = pos.y
        }
        this.board.select(x, y, w, h);

        this.board.foreceUpdate();
    }

    onKeyDown(evt: KeyboardEvent): Boolean {
        let flag = true;
        if (evt.key === 'd') {
            this.board.deleteComponents();
            flag = false;
        }
       return flag 
    }

    onToolChange(newTool: BBTools): void {
        
    }

    render(): JSX.Element {
        let pos = this.getPointerPos();

        // console.log("rendering");
        // console.log(this.mouseRef)
        // console.log(pos);
        
        return <>
            {this.isSelecting && this.hasMoved ?
                <Rect x={this.mouseRef.x} y={this.mouseRef.y}
                    width={pos.x-this.mouseRef.x}
                    height={pos.y-this.mouseRef.y}
                    stroke={'Black'}
                    strokeWidth={0.2}
                />
            : ""}
        </>
    }
}