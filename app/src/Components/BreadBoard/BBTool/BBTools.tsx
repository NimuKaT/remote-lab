import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import React from "react";
import BBoard from "../BBoard";

export default abstract class BBTools {
    hasSelected: boolean = false;
    isSelecting: boolean = false;
    isDragging: boolean = false;
    hasMoved: boolean = false;
    mouseRef: Vector2d = {x:0,y:0};
    stageRef: React.RefObject<Stage>;
    board: BBoard;
    moveThreshold: number = 0.5;
    lastMoved: number = 0;
    lastEvt?: KonvaEventObject<MouseEvent>;
    moveInterval: number = 10;
    gotModalResponse: boolean = true
    lastMovement: number = Date.now();
    timeout: number = -1;
    period: number = 13;

    constructor(board: BBoard, stageRef: React.RefObject<Stage>) {
        this.stageRef = stageRef;
        this.board = board;
    }

    abstract onInitialise(): void

    abstract onMouseDown(evt: KonvaEventObject<MouseEvent>): void

    abstract onMouseMove(evt: KonvaEventObject<MouseEvent>): void

    abstract onMouseUp(evt: KonvaEventObject<MouseEvent>): void

    abstract onKeyDown(evt: KeyboardEvent): Boolean
    
    abstract onToolChange(newTool: BBTools): void

    getPointerPos(): Vector2d {
        let pos: Vector2d = {x:0, y:0}
        if (this.stageRef.current) {
            pos = this.stageRef.current.getRelativePointerPosition();
        }
        // TEMP
            pos.x = pos.x - 120;
            pos.y = pos.y - 120;
        return pos
    }

    getDelta(pos: Vector2d) {
        let delta = {x: pos.x, y: pos.y}
        delta.x = delta.x - this.mouseRef.x
        delta.y = delta.y - this.mouseRef.y
        delta.x = Math.round(delta.x/this.board.nodeDist)*this.board.nodeDist;
        delta.y = Math.round(delta.y/this.board.nodeDist)*this.board.nodeDist;
        return delta;
    }

    snap(pos: Vector2d) {
        pos.x = Math.round(pos.x/this.board.nodeDist)*this.board.nodeDist;
        pos.y = Math.round(pos.y/this.board.nodeDist)*this.board.nodeDist;
        return pos
    }

    abstract render(): JSX.Element;

}