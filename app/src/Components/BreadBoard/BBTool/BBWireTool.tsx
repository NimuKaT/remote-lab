import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";


export default class BBWireTool extends BBTools {
    isFirstnode: boolean = true;

    onInitialise(): void {
        this.isFirstnode = true;
    }

    onToolChange(newTool: BBTools): void {
        
    }

    onKeyDown(evt: KeyboardEvent): Boolean {
        return true;
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos();
        pos = this.snap(pos)
        console.log("Wire tool mouse Down");
        console.log(evt.evt.button);
        
        

        if (evt.evt.button === 0) {
            let n = this.board.onBBNode(pos);
            
            console.log(n);
            
            if (n) {
            console.log('has pos');
                // pos.x = n.x;
                // pos.y = n.y;
                if (this.isFirstnode) {
                    // Create new wire and place node
                    this.board.createNewWire(pos);
                    this.board.placeWireEnd(pos, 1)
                    this.isFirstnode = false;
                }
                else {
                    // Place second node
                    this.board.placeWireEnd(pos, 1)
                    this.isFirstnode = true;
                    this.board.placeComponents();
                }
                this.board.foreceUpdate();
            }
       }
        if (evt.evt.button === 2) {
            if (!this.isFirstnode) {
                // Place anchor
            }
        }
        
    }

    onMouseMove(evt: KonvaEventObject<MouseEvent>): void {
        if (!this.isFirstnode) {
            let pos = this.getPointerPos();
            pos = this.snap(pos)
            this.board.placeWireEnd(pos, 1)
            this.board.foreceUpdate();
        }
        
    }

    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        
    }

    render(): JSX.Element {
        return <></>
    }
}