import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import SpiceSchematic from "../SpiceSchematic";

export default abstract class SCTools {
    hasSelected: boolean = false;
    isSelecting: boolean = false;
    isDragging: boolean = false;
    hasMoved: boolean = false;
    mouseRef: Vector2d = {x:0, y:0};
    delta: Vector2d = {x: 0, y: 0};
    schematic: SpiceSchematic
    stageRef: React.RefObject<Stage>
    moveThreshold: number = 0.5;

    constructor (schematic: SpiceSchematic, stageRef: React.RefObject<Stage>, currTool?: SCTools) {
        this.schematic = schematic;
        currTool?.onToolChange(this);
        this.stageRef = stageRef;
    }

    abstract onMouseDown(evt: KonvaEventObject<MouseEvent>): void

    abstract onMouseMove(evt: KonvaEventObject<MouseEvent>): void

    abstract onMouseUp(evt: KonvaEventObject<MouseEvent>): void
    
    abstract onToolChange(newTool: SCTools): void

    getPointerPos(): Vector2d {
        let pos: Vector2d | null = {x:0,y:0};
        if (this.stageRef.current) {
           pos =  this.stageRef.current.getRelativePointerPosition();
            if (!pos) {
                pos = {x:0, y:0};
            }
        }
        return pos
    }

    abstract render(): JSX.Element;
}