import { Vector2d } from "konva/lib/types";
import SpiceSchematic from "./SpiceSchematic";



export default class SpiceObject {
    absPos: Vector2d;
    isSelected: boolean;
    isMoving: boolean;
    schematic: SpiceSchematic;


    constructor(absPos: Vector2d, schematic: SpiceSchematic,
         isSelected: boolean = false, isMoving: boolean = false) {
        this.absPos = absPos;
        this.isSelected = isSelected;
        this.isMoving = isMoving;
        this.schematic = schematic;
    }


    onClick() {
        let tool = this.schematic.getTool();
        if (tool == "Move") {
            if (this.isSelected && this.isMoving) {
                

            }
        }
    }
}