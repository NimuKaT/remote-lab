import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";
import BBICModal from "../Modal/BBICModal";

export default class BBPlaceStatic extends BBTools {
    compName: string = ''
    pinCount: number = 0

    onInitialise(): void {
        this.board.deselect()
        this.gotModalResponse = false
        this.board.openModal({hideBackdrop: true},
            <BBICModal closeFunc={this.board.getModalClose()} setFunc={this.setValue.bind(this)}/>,
            this.board.checkModalResponse.bind(this.board))

        
    }

    setValue(val: string, pinCount: number) {
        this.compName = val;
        this.pinCount = pinCount
        let pos = this.getPointerPos()
        this.mouseRef = pos;
        pos = this.snap(pos);
        this.board.createNewStaticComp(this.compName, pos, this.pinCount);
        this.gotModalResponse = true
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        
        let pos = this.getPointerPos();
        let delta = this.getDelta(pos);
        this.board.moveComponents(delta);
        this.board.placeComponents();
        this.board.foreceUpdate();
        
        this.mouseRef = pos;
        // console.log("raw pos" + pos.x + " " + pos.y);
        
        pos = this.snap(pos)
        // console.log("Placing at " + pos.x + " " + pos.y);
        
        this.board.createNewStaticComp(this.compName, pos, this.pinCount);
        this.board.moveComponents({x:0, y:0})
        this.board.foreceUpdate();
        

    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos();
        let delta = this.getDelta(pos);
        this.board.moveComponents(delta);
        this.board.foreceUpdate();
        // console.log("On Move");
        // console.log(pos);
        // console.log(delta);
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

}