import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";

export default class BBPlaceStatic extends BBTools {

    onInitialise(): void {
        let pos = this.getPointerPos()
        this.mouseRef = pos;
        pos = this.snap(pos);
        this.board.createNewStaticComp('6 pin', pos);
        console.log(pos);

        
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        
        let pos = this.getPointerPos();
        let delta = this.getDelta(pos);
        this.board.moveComponents(delta);
        this.board.placeComponents();
        this.board.foreceUpdate();
        
        this.mouseRef = pos;
        console.log("raw pos" + pos.x + " " + pos.y);
        
        pos = this.snap(pos)
        console.log("Placing at " + pos.x + " " + pos.y);
        
        this.board.createNewStaticComp('6 pin', pos);
        this.board.moveComponents({x:0, y:0})
        this.board.foreceUpdate();
        

    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos();
        let delta = this.getDelta(pos);
        this.board.moveComponents(delta);
        this.board.foreceUpdate();
        console.log("On Move");
        console.log(pos);
        console.log(delta);
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
        
    }

    render(): JSX.Element {
        return <></>
    }

}