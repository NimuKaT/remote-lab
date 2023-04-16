import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";

export default class BBPlaceStretch extends BBTools {
    compType: string = 'res'
    value: string = ''
    firstNode: boolean = true

    onInitialise(): void {
        let pos = this.getPointerPos()        
        pos = this.snap(pos)
        this.mouseRef = pos;
        this.board.createNewStretchComp(this.compType, pos)
        this.firstNode = true
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos()
        pos = this.snap(pos)
        let delta = this.getDelta(pos)
        if (this.firstNode) {
            this.board.moveComponents({x:0,y:0})
            this.board.placeStretchEnd(pos, 0)
            this.firstNode = false
            this.mouseRef.x = pos.x
            this.mouseRef.y = pos.y
        }
        else {
            this.board.moveComponents({x:0,y:0})
            this.board.placeStretchEnd(pos, 1)
            this.board.placeComponents();
            this.board.createNewStretchComp(this.compType, pos)
            this.board.moveComponents({x:0,y:0})
            this.mouseRef.x = pos.x
            this.mouseRef.y = pos.y
            this.firstNode = true;
        }
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos()
        pos = this.snap(pos)
        let delta = this.getDelta(pos)
        // console.log("Delta x: " + delta.x + " y: " + delta.y);
        // console.log("Pos x: " + pos.x + " y: " + pos.y);
        // console.log("MouseRef x: " + this.mouseRef.x + " Y: " + this.mouseRef.y)
        
        if (this.firstNode) {

            this.board.moveComponents(delta)
        }
        else {
            this.board.moveComponents({x:0,y:0})
            this.board.placeStretchEnd(pos, 1)
        }
        this.board.foreceUpdate()
    }
    
    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        
    }

    onKeyDown(evt: KeyboardEvent): Boolean {
         if (evt.key ===  "Escape") {
            this.board.deleteComponents();
        }
        return true
    }

    onToolChange(newTool: BBTools): void {
        this.board.deleteComponents()
    }

    render(): JSX.Element {
        return <></>
    }

    setComponent(name: string, value: string) {
        this.compType = name;
        this.value = value;
    }


}