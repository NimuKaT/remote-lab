import { KonvaEventObject } from "konva/lib/Node";
import BBTools from "./BBTools";
import BBWireModal from "../Modal/BBWireModal";


export default class BBWireTool extends BBTools {
    color: string = 'red'
    isFirstnode: boolean = true;

    onInitialise(): void {
        this.board.deselect()
        this.isFirstnode = true;
        this.gotModalResponse = false;
        this.board.openModal({hideBackdrop: true},
            <BBWireModal closeFunc={this.board.getModalClose()} setFunc={this.setColor.bind(this)}/>,
            this.board.checkModalResponse.bind(this.board))
    }

    setColor(color: string) {
        this.color = color
        this.gotModalResponse = true;
    }

    onToolChange(newTool: BBTools): void {
        this.board.deleteComponents()
        
    }

    onKeyDown(evt: KeyboardEvent): Boolean {
        return true;
    }

    onMouseDown(evt: KonvaEventObject<MouseEvent>): void {
        let pos = this.getPointerPos();
        // pos = this.snap(pos)
        // console.log("Wire tool mouse Down");
        // console.log(evt.evt.button);
        
        

        if (evt.evt.button === 0) {
            let n = this.board.onBBNode(pos);
            
            // console.log(n);
            if (!n) {
                pos = this.snap(pos)
                n = this.board.onBBNode(pos)
            }
            if (n) {
            // console.log('has pos');
                pos.x = n.x;
                pos.y = n.y;
                if (this.isFirstnode) {
                    // Create new wire and place node
                    this.board.createNewWire(pos, this.color);
                    this.board.placeWireEnd(pos, 1)
                    this.isFirstnode = false;
                }
                else {
                    // Place second node
                    this.board.placeWireEnd(pos, 1)
                    this.isFirstnode = true;
                    this.board.placeComponents();
                    this.board.ref?.setTool("Stop")
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
        if (!this.isFirstnode && (Date.now() - this.lastMoved > this.moveInterval)) {
            this.lastMoved = Date.now()
            let pos = this.getPointerPos();
            let rawPos = {x: pos.x, y: pos.y}
            let Spos = this.snap(pos)
            let n = this.board.onBBNode(Spos);
            if (n) {
                this.board.placeWireEnd(n, 1)
                this.board.foreceUpdate();
            }
            else {
                n = this.board.onBBNode(rawPos);
                if (n) {
                    this.board.placeWireEnd(n, 1)
                }
                else {
                    this.board.placeWireEnd(rawPos, 1)
                }
                this.board.foreceUpdate();
            }
        }
        
    }

    onMouseUp(evt: KonvaEventObject<MouseEvent>): void {
        
    }

    render(): JSX.Element {
        return <></>
    }
}