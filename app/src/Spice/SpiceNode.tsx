import { KonvaNodeEvents, Rect } from "react-konva";
import React from "react";
import { Rect as rect} from "konva/lib/shapes/Rect";
import { SCCoordinate } from "../Components/Schematic/SCCoordinate";
import { KonvaNodeEvent, Vector2d } from "konva/lib/types";
import NodeManager from "./NodeManager";
import { FastRewind } from "@mui/icons-material";

export default class SpiceNode {
    nodeNum: number;
    relPos: SCCoordinate;
    absPos: SCCoordinate;
    parentComponent: object;
    ref: React.RefObject<rect>;
    connected: Array<SpiceNode>;
    manager: NodeManager;

    constructor(nodeNum: number,
        pinNum: number, parentCompoenent: object, manager: NodeManager) {
        this.nodeNum = nodeNum;
        this.relPos = {x:0, y:0};
        this.absPos = {x:0, y:0};
        this.parentComponent = parentCompoenent;
        this.ref = React.createRef<rect>();
        this.connected = [];
        this.manager = manager;

    }

    updateRelPos(relPos: SCCoordinate) {
        this.relPos = relPos;
    }

    updateAbsPos() {
        console.log("update pos");
        if (this.ref) {
            if (this.ref.current) {
                this.absPos = this.ref.current.absolutePosition();
                this.updateConnected();
                // this.manager.checkConnection(this);
                console.log(this.connected);
            }
        }
    }

    updateConnected() {
        this.connected.map((node: SpiceNode) => {
            let pos: Vector2d = node.getAbsPos();
            if (Math.abs(pos.x - this.absPos.x) > 1 || Math.abs(pos.y - this.absPos.y) > 1) {
                this.removeConnected(node);
                node.removeConnected(this);
            }
        })
    }

    checkConnected(node: SpiceNode) : boolean {
        let pos: Vector2d = node.getAbsPos();
        if (this === node) {
            return false;
        }
        if (Math.abs(pos.x - this.absPos.x) < 1 && Math.abs(pos.y - this.absPos.y) < 1) {
            console.log("Connected")
            this.getConnected().map((connected :SpiceNode) => {
                connected.addConnected(node);
                node.addConnected(connected);
            })
            node.getConnected().map((connected :SpiceNode) => {
                connected.addConnected(this);
                this.addConnected(connected);
            })
            this.addConnected(node);
            node.addConnected(this);
            return true;
        }
        return false;
    }

    addConnected(node: SpiceNode) {
        if (!this.connected.includes(node)) {
            this.connected.push(node);
        }
    }

    removeConnected(node: SpiceNode) {
        let index = this.connected.indexOf(node)
        if (index >= 0) {
            this.connected.splice(index, 1);
        }
    }

    detachConnected() {
        for (let node of this.connected) {
            node.removeConnected(this);
        }
        this.connected = [];
    }

    getConnected() {
        return this.connected;
    }


    getAbsPos() {
        return this.absPos;
    }

    getElement(): JSX.Element {
        return (
            <>
            {this.connected.length == 0 ?
            <Rect
                ref={this.ref}
                x={this.relPos.x}
                y={this.relPos.y}
                width={8}
                height={8}
                offset={{x:4, y:4}}
                stroke='blue'
                strokeWidth={this.connected.length? 0 : 0.5}
                onChange={this.updateAbsPos.bind(this)}
                listening={true}
            /> : ''
            }   
           </>
        )
    }

    

}