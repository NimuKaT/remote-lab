import IntegerTracker from "./IntegerTracker";
import SPNode from "./Node";

export default class NodeManager {
    nodeIDGen: IntegerTracker;
    nodes: Array<SPNode>;


    constructor() {
        this.nodeIDGen = new IntegerTracker(1);
        this.nodes = [];
    }

    newNode(parent: object) {
        let node: SPNode = new SPNode(this.nodeIDGen.newNumber(), this);
        this.nodes.push(node);
        return node;
    }

    removeNode(node: SPNode) {
        node.purgeConnected();
        let index: number = this.nodes.findIndex((target) => {
                return target.id === node.id
            }) ;
        this.nodes.splice(index, 1);
        this.nodeIDGen.freeNumber(node.id);
    }

    // connect detection
    checkConnection(node: SPNode) {
        // console.log("");
        // console.log("Checking id:" + node.id);
        
        
        for (let nodes of this.nodes) {
            if (node.id === nodes.id) {
            }
            if (!nodes.deleted) {
                node.checkConnected(nodes);
                // break;
            }
        }
    }

   forceUpdate() {
    this.nodes.forEach((node: SPNode) => {
        node.forceUpdate()
    })
   } 

   getNodes() {
    return this.nodes;
   }
}