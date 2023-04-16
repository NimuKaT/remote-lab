import { Vector2d } from "konva/lib/types";
import NamedNet from "./NamedNet";
import NodeManager from "./NodeManager";
import NodeObject from "./NodeObject";
import { SPComponent } from "./SPComponent";
import SpiceWire from "./SpiceWire";

let fpError: number = 1;


export default class SPNode {
    initPos: Vector2d= {x:0, y:0};
    pos: Vector2d;
    id: number;
    connectedNodes: Array<SPNode>;
    manager: NodeManager;
    nodeObj?: NodeObject;
    deleted: boolean = false;
    shiftX: number = 0;
    shiftY: number = 0;
    netName: string | undefined;
    parent: SpiceWire | SPComponent | NamedNet | undefined;

    constructor(id: number, manager: NodeManager) {

        this.pos = {x: 0, y: 0};
        this.id = id;
        this.connectedNodes = [];
        this.manager = manager;
    }

    setParent(parent: SpiceWire | SPComponent | NamedNet) {
        this.parent = parent;
    }

    getParent(): SpiceWire | SPComponent | NamedNet | undefined {
        return this.parent;
    }

    setRef(nodeObj: NodeObject) {
        this.nodeObj = nodeObj;
    }

    forceUpdate() {
        // console.log("node forcing update");
        // console.log(this.nodeObj);
        if (this.nodeObj) {
            this.nodeObj?.forceUpdate();
        }
    }

    setShift(x: number, y: number) {
        this.shiftX = x;
        this.shiftY = y;
    }

    setInitPos(x: number, y: number) {
        this.initPos.x = x;
        this.initPos.y = y;
    }

    getX() {
        return this.pos.x;// + this.shiftX;
    }

    getY() {
        return this.pos.y;// + this.shiftY;
    }

    getInitPos() {
        return this.initPos;
    }

    setPos(pos: Vector2d) {
        // console.log("current pos")
        // console.log(this.pos);

        // console.log("new pos")
        // console.log(pos);
        // this.pos = pos;
        this.pos.x = pos.x;
        this.pos.y = pos.y;
        this.manager.checkConnection(this);
    }

    getPos(): Vector2d  {
        let vec = this.nodeObj?.ref.current?.getAbsolutePosition();
        if (vec) {
            this.pos = vec;
        }
        return this.pos;
    }

    getConnected() {
        return this.connectedNodes;
    }

    isConnected(): boolean {
        return this.connectedNodes.length > 0;
    }

    updateConnection() {
        // this.nodeObj?.updatePos();
        this.manager.checkConnection(this);
    }

    addConnected(node: SPNode) {
        let index: number = this.connectedNodes.findIndex((target) => {
                return target.id === node.id
        }) ;
        if (index < 0 ) {
            if (node !== this) {
                this.connectedNodes.push(node);
                this.forceUpdate();
            }
        }
    }

    removeConnected(node: SPNode) {
        let index: number = this.connectedNodes.findIndex((target) => {
            return target.id === node.id
        }) ;
        // console.log("removing index: " + index);
        
        if (index >= 0 ) {
           this.connectedNodes.splice(index, 1); 
           this.forceUpdate();
        }
            // node.forceUpdate();
        // this.forceUpdate);
    }

    purgeConnected() {
        // console.log("purging");
        
        this.connectedNodes.forEach((node: SPNode): void => {
            node.removeConnected(this);
            // node.forceUpdate();
        });
        this.connectedNodes = [];
        this.forceUpdate();
    }

    checkConnected(node: SPNode): boolean {
        let flag: boolean = false;
        if (this !== node) {
            let index: number = this.connectedNodes.findIndex((target) => {
                return target.id === node.id
            }) ;
                // console.log("Checking nodes");
                // console.log("Node id: " + this.id + " with coord x: " + this.getX() + " y: " + this.getY());
                // console.log("Node id: " + node.id + " with coord x: " + node.getX() + " y: " + node.getY());
                // console.log("Diff x: " + (Math.abs(this.getX() - node.getX())) + " y: " + (Math.abs(this.getY() - node.getY())));
                
                
                
            if (Math.abs(this.getX() - node.getX()) <= fpError && 
            Math.abs(this.getY() - node.getY()) <= fpError && !node.deleted) {
                if (this.connectedNodes.indexOf(node) < 0) {
                    // this.connectedNodes.forEach((nodes: SPNode) => {
                    //     nodes.addConnected(node);
                    //     node.addConnected(nodes);
                    // })
                    // node.connectedNodes.forEach((nodes: SPNode) => {
                    //     this.addConnected(nodes);
                    //     nodes.addConnected(this);
                    // })
                    this.addConnected(node);
                    node.addConnected(this);
                    // console.log("CONNECT");
                    
                    // flag = true;
                }
            }
            else {
                this.removeConnected(node);
                node.removeConnected(this);
                // console.log("REMOVE");
                
            }
 
            }

       return flag;
    }

    delete() {
        this.deleted = true;
        this.purgeConnected();
        this.manager.removeNode(this);
    }


    setNetName(name: string) {
        this.netName = name;
    }

    getNetName(): string | undefined{
        return this.netName;
    }

}