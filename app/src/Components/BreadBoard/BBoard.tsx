import { Vector2d } from "konva/lib/types";
import BreadBoardWindow from "../BreadBoardWindow";
import BBIC from "./BBIC";
import BBNode from "./BBNode";
import BBWire from "./BBWire";
import BBStretchComp from "./BBStretchComp";
import ModalHook from "../ModalHook";
import { ModalAttr } from "../ModalAttr";

interface BBlabels {
    text: string,
    pos: Vector2d
}

export default class BBoard {
    ref: BreadBoardWindow
    modalRef?: ModalHook
    mjCol: number
    mjRow: number
    mnCol: number
    nodes: Array<BBNode> = [];
    labels: Array<BBlabels> = [];
    nodeDist: number = 24;
    spacerSize: number = 1;
    ic: Array<BBIC> = [];
    wires: Array<BBWire> = [];
    stretchComp: Array<BBStretchComp> = []

    selectedIC: Array<BBIC> = [];
    selectedWire: Array<BBWire> = [];
    selectedStretch: Array<BBStretchComp> = []

    constructor(mjCol: number, mjRow: number, mnCol: number, ref: BreadBoardWindow) {
        this.ref = ref;
        this.mjCol = mjCol;
        this.mjRow = mjRow;
        this.mnCol = mnCol;
        let prefix = 'A';
        let labelLetter = 'A';
        for (let i = 0; i < this.mjCol; i++) {
           for (let j = 0; j < this.mjRow; j++) {
                for (let k = 0; k < this.mnCol; k++) {
                    this.nodes.push(new BBNode({x: j*this.nodeDist, y: k * this.nodeDist + i * (this.spacerSize + this.mnCol) * this.nodeDist},
                    prefix + j));
                    if (j === 0) {
                        this.labels.push({text: labelLetter,pos:{ x: - 1.5 *this.nodeDist, y:k * this.nodeDist + i * (this.spacerSize + this.mnCol) * this.nodeDist - 16/2}})
                        labelLetter = String.fromCharCode(labelLetter.charCodeAt(0) + 1)
                        
    
                    }
                    if (k === 0 && i === 0) {
                        this.labels.push({
                            text: (j+1).toString(),
                            pos: {x: (j-0.5)*this.nodeDist, y:  - 1.5 * this.nodeDist}
                        })
                    }
               }
           } 
           prefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
        }
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 20; col++) {
                this.nodes.push(new BBNode({
                    x: (2+col+Math.floor(col/5)*2)*this.nodeDist,
                    y: (-3 + row) * this.nodeDist
                }, "P" + row + Math.floor(col/10)))
            }
        }
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 20; col++) {
                this.nodes.push(new BBNode({
                    x: (2+col+Math.floor(col/5)*2)*this.nodeDist,
                    y: (this.mjCol * this.mnCol + 2 + row) * this.nodeDist
                }, "P" + (2+row) + Math.floor(col/10)))
            }
        }
        // Power Delivery

        this.nodes.push(new BBNode({x:0, y: -120}, "ch1-", 'black', 1))
        this.nodes.push(new BBNode({x:48, y: -120}, "ch1+", 'red', 1))
        this.nodes.push(new BBNode({x:144, y: -120}, "ch2-", 'black', 1))
        this.nodes.push(new BBNode({x:192, y: -120}, "ch2+", 'red', 1))

        // Signal Generator
        this.nodes.push(new BBNode({x:552, y: -120}, "Sig-", 'black', 1))
        this.nodes.push(new BBNode({x:600, y: -120}, "Sig+", 'red', 1))
        // this.nodes.push(new BBNode({x:700, y:-159}, "test", "green", 1))
        // Oscilloscope
        this.nodes.push(new BBNode({x:902, y: -105}, "Och1-", 'black', 1))
        this.nodes.push(new BBNode({x:918, y: -105}, "Och1+", 'red', 1))
        this.nodes.push(new BBNode({x:942, y: -105}, "Och2-", 'black', 1))
        this.nodes.push(new BBNode({x:958, y: -105}, "Och2+", 'red', 1))
        this.nodes.push(new BBNode({x:982, y: -105}, "Och3-", 'black', 1))
        this.nodes.push(new BBNode({x:998, y: -105}, "Och3+", 'red', 1))
        this.nodes.push(new BBNode({x:1022, y: -105}, "Och4-", 'black', 1))
        this.nodes.push(new BBNode({x:1038, y: -105}, "Och4+", 'red', 1))
        // MutliMeter
        // this.nodes.push(new BBNode({x:-135, y: -225}, "Mch1+", 'red', 1))
        this.nodes.push(new BBNode({x:-155, y: -125}, "Mch1-", 'black', 1))
        this.nodes.push(new BBNode({x:-155, y: -175}, "Mch1+", 'red', 1))
        
        this.nodes.push(new BBNode({x:-115, y: -225}, "Mch1+", 'red', 1))
        this.nodes.push(new BBNode({x:-115, y: -175}, "Mch1-", 'black', 1))
        this.nodes.push(new BBNode({x:-115, y: -125}, "Mch1+", 'red', 1))

    }

    foreceUpdate() {
        this.ref.forceUpdate();
    }

    getHookRef(ref: ModalHook) {
        this.modalRef = ref;
    }

    openModal(attr: ModalAttr, content: JSX.Element) {
        this.modalRef?.openModal(attr, content)
    }

    getModalClose() {
        if (this.modalRef) {
            return this.modalRef.getClose()
        }
        else {
            return () => {}
        }
    }

    createNewStaticComp(modelName: string, pos: Vector2d, pin: number, isPlaced?: boolean) {
        let ic = new BBIC(modelName, pos, pin)
        this.ic.push(ic);
        if (!isPlaced) {
            this.selectedIC.push(ic);
        }
    }

    createNewStretchComp(modelName: string, pos: Vector2d, val: string) {
        let stretch = new BBStretchComp(modelName, pos, val)
        this.stretchComp.push(stretch);
        this.selectedStretch.push(stretch);
    }

    createNewWire(pos: Vector2d, color: string = 'red') {
        let wire = new BBWire();
        wire.changeColor(color);
        wire.placeNode(pos, 0);
        this.wires.push(wire);
        this.selectedWire.push(wire);
    }

    placeWireEnd(pos: Vector2d, index: 0|1) {
        this.selectedWire.forEach((wire) => {
            wire.placeNode(pos, index);
        })
    }

    placeStretchEnd(pos:Vector2d, index: number) {
        this.selectedStretch.forEach((comp) => {
            comp.placeNode(index, pos);
        })
    }

    select(x: number, y: number, w: number, h: number) {
        // console.log("x: %d y: %d w: %d h: %d", x, y, w, h);
        this.selectedIC = []
        this.ic.forEach((comp) => {
            if (!comp.isDeleted() && comp.select(x, y, w, h)) {
                console.log(comp);
                this.selectedIC.push(comp)
            }
        })

        this.selectedWire = []
        this.wires.forEach((wire) => {
            if (!wire.deleted && wire.select(x, y, w, h)) {
                console.log(wire);
                this.selectedWire.push(wire)
            }
        })

        this.stretchComp.forEach((comp) => {
            if (!comp.isDeleted && comp.select(x,y,w,h,)) {
                console.log(comp)
                this.selectedStretch.push(comp)
            }
        })
    }

    deselect() {
        this.selectedIC = []
        this.selectedStretch = []
        this.selectedWire = []
    }

    moveComponents(shift: Vector2d) {
        this.selectedIC.forEach((ic) => {
            ic.shift(shift);
        })
        this.selectedStretch.forEach((comp) => {
            comp.shift(shift)
        })
    }

    placeComponents() {
        this.selectedIC.forEach((ic) => {
            ic.place();
        })
        this.selectedStretch.forEach((comp) => {
            comp.place()
        })
        this.selectedIC = [];
        this.selectedWire = [];
        this.selectedStretch = []
    }

    cancelMovement() {
        this.selectedIC.forEach((ic) => {
            ic.cancel();
        })
        this.selectedIC = [];
        this.selectedWire.forEach((wire) => {

        })
        this.selectedWire = [];
        this.selectedStretch.forEach((comp) => {

        })
        this.selectedStretch = []
    }

    deleteComponents() {
        this.selectedIC.forEach((ic) => {
            ic.delete();
        })
        this.selectedIC = []
        this.selectedStretch.forEach((comp) => {
            comp.delete();
        })
        this.selectedWire.forEach((wire) => {
            wire.delete()
        })
        this.selectedWire = []
        this.foreceUpdate()
    }

    onBBNode(pos: Vector2d): Vector2d | undefined {
    // onBBNode(pos: Vector2d)  {
        let flag: boolean = false;
        let retPos: Vector2d | undefined = undefined
        this.nodes.forEach((node) => {
            let n = node.isHover(pos);
            if (n) {
                flag = true;
                retPos = {x: node.getLocalX(), y:node.getLocalY()}
                // return n;
            }
        })
        // return undefined;
        return retPos

    }

    getNodes() {
        return this.nodes;
    }

    getWires() {
        return this.wires;
    }

    getLabels() {
        return this.labels;
    }
    getIC() {
        return this.ic;
    }

    getStretch() {
        return this.stretchComp;
    }

    getNetMap() {
        // Key is the original netName, value is new netName
        let netMap = new Map<string, string>();
        let revMap = new Map<string, Array<string>>();
        let count = 0;

        netMap.set("ch1+", "0")
        netMap.set("ch2-", "0")
        revMap.set("0", ["ch1+", "ch2-"])

        this.wires.forEach((wire) => {
            if (!wire.deleted) {
                let points = wire.getPoints();
                let netName1 = this.getNetName(points[0], points[1]);
                let newNet: string | undefined = "W"+count;
                let hasSet = false
                if (netName1 !== '') {
                    if (!netMap.has(netName1)) {
                        netMap.set(netName1, newNet)
                        hasSet = true
                        revMap.set(newNet, [netName1])
                    } else {
                        newNet = netMap.get(netName1);
                        if (newNet === undefined) {
                            // SHOULD NEVER RUN
                            newNet = "W"+count
                        }
                    }
                }
                let netName2 = this.getNetName(points[2], points[3])
                if (netName2 !== '') {
                    if (!netMap.has(netName2)) {
                        // Case where either both nets haven't been connected or only the first is connected
                        netMap.set(netName2, newNet)
                        hasSet = true
                        let revArray = revMap.get(newNet);
                        if (revArray) {
                            revArray.push(netName2)
                        }

                    } else {
                        // Case where both nets are connected to other nets
                        if (!hasSet) {
                            // Merge nets
                            let tempNet = netMap.get(netName2)
                            if (tempNet !== undefined) {
                                let revArray = revMap.get(tempNet)
                                let targetArray = revMap.get(newNet)
                                revArray?.forEach((net) => {
                                    if (newNet !== undefined) {
                                        netMap.set(net, newNet)
                                        targetArray?.push(net)
                                    }
                                })
                                revMap.delete(tempNet);
                            }
                        } else {
                            // Case where first is not connected and second is
                            // Delete previous newNet and assign to existing one
                            revMap.delete(newNet);
                            newNet = netMap.get(netName2)
                            if (newNet === undefined) {
                                // SHOULD NEVER RUN
                                newNet = "W"+count
                            }
                            netMap.set(netName1, newNet);
                        }
                    }
                }
                if (hasSet) {
                    count++;
                }
            }
        })
        console.log(netMap);
        return netMap
    }

    getNetName(x: number, y: number): string {
        let netName: string | undefined;
        this.nodes.every((n) => {
            if (n.isHover({x:x, y:y})) {
                netName = n.nodeNet
                return false
            }
            return true
        })
        if (netName === undefined) {
            netName = ""
        }
        return netName
    }

    getNetList() {
        let netlist: Array<string> = [];
        let netMap = this.getNetMap();
        let count = 0;
        let nets: Array<{prefix: string, nodes: Array<Vector2d>, value: string}> =  []
        this.stretchComp.forEach((comp) => {
            if (!comp.isDeleted) {
                console.log(comp.getNetlist());
                let net = comp.getNetlist();
                nets.push(net)
                // let nodes: Array<string> = []
                // net.nodes.forEach((n) => {
                //     let netName = this.getNetName(n.x, n.y)
                //     let map = netMap.get(netName) ;
                //     netName = map !== undefined? map : netName;  
                //     nodes.push(netName)
                // }) 
                // netlist.push(net.prefix + count + " " + nodes.join(" ") + " " + net.value)
                // count++
            }
        })
        this.ic.forEach((comp) => {
            if (!comp.isDeleted()) {
                console.log(comp.getNetList())
                let net = comp.getNetList();
                nets.push(net)
            //     let nodes: Array<string> = []
            //     net.nodes.forEach((n) => {
            //         let netName = this.getNetName(n.x, n.y)
            //         let map = netMap.get(netName) ;
            //         netName = map !== undefined? map : netName;  
            //         nodes.push(netName)
            //     }) 
            //     netlist.push(net.prefix + count + " " + nodes.join(" ") + " " + net.value)
            //     count++
            }
        })

        nets.push({prefix: 'V', nodes:[{x: 48, y:-120}, {x:0, y: -120}], value: "15"})
        nets.push({prefix: 'V', nodes:[{x: 192, y:-120}, {x:144, y: -120}], value: "15"})
        nets.push({prefix: 'V', nodes:[{x: 600, y:-120}, {x:552, y: -120}], value: "0"})

        nets.push({prefix: 'XU', nodes:[{x: 918, y:-105}, {x:902, y: -105}], value: "OscCH1"})
        nets.push({prefix: 'XU', nodes:[{x: 958, y:-105}, {x:942, y: -105}], value: "OscCH2"})
        nets.push({prefix: 'XU', nodes:[{x: 998, y:-105}, {x:982, y: -105}], value: "OscCH3"})
        nets.push({prefix: 'XU', nodes:[{x: 1038, y:-105}, {x:1022, y: -105}], value: "OscCH4"})
        nets.forEach((net) => {
                let nodes: Array<string> = []
                net.nodes.forEach((n) => {
                    let netName = this.getNetName(n.x, n.y)
                    let map = netMap.get(netName) ;
                    netName = map !== undefined? map : netName;  
                    nodes.push(netName)
                }) 
                netlist.push(net.prefix + count + " " + nodes.join(" ") + " " + net.value)
                count++
 
        })

        console.log(netlist)
    }
}