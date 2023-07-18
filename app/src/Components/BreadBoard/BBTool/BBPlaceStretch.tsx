import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";
import BBResModal from "../Modal/BBResModal";
import BBCapModal from "../Modal/BBCapModal";

export default class BBPlaceStretch extends BBTools {
    compType: string = 'res'
    value: string = ''
    firstNode: boolean = true

    onInitialise(): void {
        this.board.deselect()
        this.gotModalResponse = false
        if (this.compType === 'res') {
            this.board.openModal({hideBackdrop: true}, <BBResModal closeFunc={this.board.getModalClose()} setFunc={this.setValue.bind(this)}/>,
                this.board.checkModalResponse.bind(this.board))
        }
        else if (this.compType === 'cap') {

            this.board.openModal({hideBackdrop: true}, <BBCapModal closeFunc={this.board.getModalClose()} setFunc={this.setValue.bind(this)}/>,
                this.board.checkModalResponse.bind(this.board))
        }
        else if (this.compType === 'diode') {
            this.value = "diode"        // Temp
        let pos = this.getPointerPos()
        pos = this.snap(pos)
            this.board.createNewStretchComp(this.compType, pos, this.value)
            this.mouseRef.x = pos.x
            this.mouseRef.y = pos.y
        }
        this.firstNode = true
    }

    setValue(val: string) {
        this.value = val;
        let pos = this.getPointerPos()        
        pos = this.snap(pos)
        // console.log(pos);
        
        this.mouseRef = pos;
        this.gotModalResponse = true
        this.board.createNewStretchComp(this.compType, pos, this.value)
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
            this.board.createNewStretchComp(this.compType, pos, this.value)
            this.board.moveComponents({x:0,y:0})
            this.mouseRef.x = pos.x
            this.mouseRef.y = pos.y
            this.firstNode = true;
            this.board.ref.setTool("Stop")
        }
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        let dt = Date.now() - this.lastMovement
        if (dt >= this.period) {
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
            this.timeout = -1;
            this.lastMovement = Date.now();
        } else {
            if (this.timeout <= 0) {
                this.timeout = setTimeout(this.onMouseMove.bind(this, evt), this.period - dt) as unknown as number;
            } 
        }
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
        if (this.timeout > 0) {
            clearTimeout(this.timeout)
        }
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