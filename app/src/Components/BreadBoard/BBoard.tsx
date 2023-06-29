import { Vector2d } from "konva/lib/types";
import BreadBoardWindow from "../BreadBoardWindow";
import BBIC from "./BBIC";
import BBNode from "./BBNode";
import BBWire from "./BBWire";
import BBStretchComp from "./BBStretchComp";
import ModalHook from "../ModalHook";
import { ModalAttr } from "../ModalAttr";
import BBICRep from "./BBTypes/BBICRep";
import BBWireRep from "./BBTypes/BBWireRep";
import BBcompRep from "./BBTypes/BBcompRep";
import BBFileRep from "./BBTypes/BBFileRep";

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

        this.nodes.push(new BBNode({x:0, y: -100}, "ch1-", 'black', 1))
        this.nodes.push(new BBNode({x:48, y: -100}, "ch1+", 'red', 1))
        this.nodes.push(new BBNode({x:144, y: -100}, "ch2-", 'black', 1))
        this.nodes.push(new BBNode({x:192, y: -100}, "ch2+", 'red', 1))

        // Signal Generator
        this.nodes.push(new BBNode({x:552, y: -100}, "Sig-", 'black', 1))
        this.nodes.push(new BBNode({x:600, y: -100}, "Sig+", 'red', 1))
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
        // this.nodes.push(new BBNode({x:-155, y: -125}, "Mch1-", 'black', 1))
        // this.nodes.push(new BBNode({x:-155, y: -175}, "Mch1+", 'red', 1))
        
        // this.nodes.push(new BBNode({x:-115, y: -225}, "Mch1+", 'red', 1))
        // this.nodes.push(new BBNode({x:-115, y: -175}, "Mch1-", 'black', 1))
        // this.nodes.push(new BBNode({x:-115, y: -125}, "Mch1+", 'red', 1))



        // Load File from localStorage

        let localFile = localStorage.getItem('BreadBoard');
        if (localFile !== null) {
            let localObject = JSON.parse(localFile);
            // if (localObject instanceof BBFileRep) {
            try {
                let file = localObject as BBFileRep
                this.loadCompoents(file)
            } catch (err) {}
            // }
        }

    }

    foreceUpdate() {
        this.ref.forceUpdate();
    }

    getHookRef(ref: ModalHook) {
        this.modalRef = ref;
    }

    openModal(attr: ModalAttr, content: JSX.Element, closeFunc: ()=>void) {
        this.modalRef?.openModal(attr, content, closeFunc)
    }

    getModalClose() {
        if (this.modalRef) {
            return (() => {if (this.modalRef) {this.modalRef.getClose()()};  this.checkModalResponse();
            }).bind(this)
        }
        else {
            return () => {}
        }
    }

    checkModalResponse() {
        // console.log("Checking modal response");
        // console.log(this.ref?.state.toolName);
        
        
        if (this.ref?.state.currTool?.gotModalResponse === false) {
            this.ref?.setTool("Pan")
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
        // this.ref.setTool("Stop")
    }

    placeStretchEnd(pos:Vector2d, index: number) {
        this.selectedStretch.forEach((comp) => {
            comp.placeNode(index, pos);
        })
        // this.ref.setTool("Stop")
    }

    select(x: number, y: number, w: number, h: number) {
        // console.log("x: %d y: %d w: %d h: %d", x, y, w, h);
        this.selectedIC = []
        this.ic.forEach((comp) => {
            if (!comp.isDeleted() && comp.select(x, y, w, h)) {
                // console.log(comp);
                this.selectedIC.push(comp)
            }
        })

        this.selectedWire = []
        this.wires.forEach((wire) => {
            if (!wire.deleted && wire.select(x, y, w, h)) {
                // console.log(wire);
                this.selectedWire.push(wire)
            }
        })

        this.stretchComp.forEach((comp) => {
            if (!comp.isDeleted && comp.select(x,y,w,h,)) {
                // console.log(comp)
                this.selectedStretch.push(comp)
            }
        })
    }

    deselect() {
        this.selectedIC.forEach((ic) => {
            ic.deselect()
        })
        this.selectedStretch.forEach((comp) => {
            comp.deselect()
        })
        this.selectedWire.forEach((wire) => {
            wire.deselect()
        })
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
        this.saveBB()
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
        this.saveBB()
        this.ref.setTool("Stop")
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
        this.ref.stopSim();
        this.saveBB()
        this.foreceUpdate()
    }

    onBBNode(pos: Vector2d, highlight?: boolean): Vector2d | undefined {
    // onBBNode(pos: Vector2d)  {
        let flag: boolean = false;
        let retPos: Vector2d | undefined = undefined
        this.nodes.forEach((node) => {
            let n = node.isHover(pos);
            if (n) {
                flag = true;
                retPos = {x: node.getLocalX(), y:node.getLocalY()}
                if (highlight) {
                    // Highlight nodee
                }
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
        this.saveBB()
        // Key is the original netName, value is new netName
        let netMap = new Map<string, string>();
        let revMap = new Map<string, Array<string>>();
        let count = 0;

        netMap.set("ch1+", "0")
        netMap.set("ch2-", "0")
        netMap.set("Sig-", "0")
        netMap.set("Och1-", "0")
        netMap.set("Och2-", "0")
        revMap.set("0", ["ch1+", "ch2-", "Sig-", "Och1-", "Och2-"])

        this.wires.forEach((wire) => {
            // console.log(revMap)
            console.log(netMap);
            
            if (!wire.deleted) {
                let points = wire.getPoints();
                let netName1 = this.getNetName(points[0], points[1]);
                let netName2 = this.getNetName(points[2], points[3])
                let newNet: string | undefined = "W"+count;
                let hasSet = false
                let hasNet1 = netMap.has(netName1)
                let hasNet2 = netMap.has(netName2);
                if (!hasNet1 && !hasNet2) {
                    netMap.set(netName1, newNet);
                    netMap.set(netName2, newNet);
                    revMap.set(newNet, [netName1, netName2]);
                    hasSet = true;
                } else if (!hasNet1) {
                    newNet = netMap.get(netName2);
                    if (newNet !== undefined) {
                        netMap.set(netName1, newNet); 
                        revMap.get(newNet)?.push(netName1);
                    }
                } else if (!hasNet2) {
                    newNet = netMap.get(netName1);
                    if (newNet !== undefined) {
                        netMap.set(netName2, newNet);
                        revMap.get(newNet)?.push(netName2)
                    }
                } else {
                    let net1 = netMap.get(netName1);
                    let net2 = netMap.get(netName2);
                    if (net1 !== net2) {
                        if (net1 !== undefined && net2 !== undefined) {
                            let net1c = net1
                            let net2c = net2
                            if (net2 === '0') {
                                revMap.get(net1)?.forEach((n) => {
                                    netMap.set(n, net2c)
                                })
                                revMap.delete(net1)
                            } else {
                                revMap.get(net2)?.forEach((n) => {
                                    netMap.set(n, net1c)
                                })
                            }
                        }

                    }

                }

                // if (netName1 !== '') {
                //     if (!netMap.has(netName1)) {
                //         netMap.set(netName1, newNet)
                //         hasSet = true
                //         revMap.set(newNet, [netName1])
                //     } else {
                //         newNet = netMap.get(netName1);
                //         if (newNet === undefined) {
                //             // SHOULD NEVER RUN
                //             newNet = "W"+count
                //         }
                //     }
                // }
                // if (netName2 !== '' && netName1 !== netName2) {
                //     if (!netMap.has(netName2)) {
                //         // Case where either both nets haven't been connected or only the first is connected
                //         netMap.set(netName2, newNet)
                //         hasSet = true
                //         let revArray = revMap.get(newNet);
                //         if (revArray) {
                //             revArray.push(netName2)
                //         }

                //     } else {
                //         // Case where both nets are connected to other nets
                //         if (!hasSet) {
                //             // Merge nets
                //             let tempNet = netMap.get(netName2)
                //             if (netName2 === '0') {
                //                 newNet = tempNet;
                //                 tempNet = netMap.get(netName1)
                //             }
                //             if (tempNet !== undefined && newNet !== undefined) {
                //                 let revArray = revMap.get(tempNet)
                //                 let targetArray = revMap.get(newNet)
                //                 revArray?.forEach((net) => {
                //                     if (newNet !== undefined) {
                //                         netMap.set(net, newNet)
                //                         targetArray?.push(net)
                //                     }
                //                 })
                //                 revMap.delete(tempNet);
                //             }
                //         } else {
                //             // Case where first is not connected and second is
                //             // Delete previous newNet and assign to existing one
                //             revMap.delete(newNet);
                //             newNet = netMap.get(netName2)
                //             if (newNet === undefined) {
                //                 // SHOULD NEVER RUN
                //                 newNet = "W"+count
                //             }
                //             netMap.set(netName1, newNet);
                //         }
                //     }
                // }
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

        nets.push({prefix: 'V', nodes:[{x: 48, y:-100}, {x:0, y: -100}], value: "15"})
        nets.push({prefix: 'V', nodes:[{x: 192, y:-100}, {x:144, y: -100}], value: "15"})
        nets.push({prefix: 'V', nodes:[{x: 600, y:-100}, {x:552, y: -100}], value: "0"})

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
        return netlist
    }

    cleanObjects() {
        let cleanICs: Array<BBIC> = []
        let cleanWire: Array<BBWire> = []
        let cleanStretch: Array<BBStretchComp> = []

        this.ic.forEach((ic) => {
            if (!ic.isDeleted()) {
                cleanICs.push(ic);
            }
        })
        this.wires.forEach((wire) => {
            if (!wire.deleted) {
                cleanWire.push(wire)
            }
        })
        this.stretchComp.forEach((comp) => {
            if (!comp.isDeleted) {
                cleanStretch.push(comp)
            }
        })
        this.ic = cleanICs;
        this.wires = cleanWire;
        this.stretchComp = cleanStretch;
    }

    getComponents() {
        // console.log(this.ic)
        // this.cleanObjects();
        let icRep: Array<BBICRep> = []
        let wireRep: Array<BBWireRep> = []
        let compRep: Array<BBcompRep> = []

        this.ic.forEach((ic) => {
            if (!ic.isDeleted()) {
                icRep.push(ic.getRep())
            }
        })
        this.wires.forEach((wire) => {
            if (!wire.deleted) {
                wireRep.push(wire.getRep())
            }
        })
        this.stretchComp.forEach((comp) => {
            if (!comp.isDeleted) {
                compRep.push(comp.getRep())
            }
        })

        return {
            'ic': icRep,
            'wire': wireRep,
            'comp': compRep
        }
    }

    loadCompoents(data: BBFileRep) {
        this.wires.forEach((wire) => {
            wire.delete()
        })
        this.ic.forEach((ic) => {
            ic.delete()
        })
        this.stretchComp.forEach((comp) => {
            comp.delete()
        })
        this.wires = [];
        this.ic = [];
        this.stretchComp = [];
        data.wire.forEach((wire) => {
            let w: BBWire = new BBWire()
            w.changeColor(wire.color)
            wire.nodePos.forEach((n: Vector2d, i: number) => {
                w.placeNode(n, i);
            })
            this.wires.push(w)
        })
        data.ic.forEach((ic) => {
            let chip: BBIC = new BBIC(ic.modelName, ic.localPos, ic.pinCount);
            this.ic.push(chip)
        })
        data.comp.forEach((comp) => {
            let item: BBStretchComp = new BBStretchComp(comp.type, comp.mainBodyPos, comp.value)
            comp.nodes.forEach((n: Vector2d, i: number) => {
                item.placeNode(i, n)
            })
            this.stretchComp.push(item)
        })
        this.foreceUpdate()
    }

    saveBB() {
        let comp = this.getComponents();
        localStorage.setItem("BreadBoard", JSON.stringify(comp))
    }
    
    hasSelected() {
        return this.selectedIC.length + this.selectedWire.length + this.selectedStretch.length > 0;
    }

    hover(pos: Vector2d) {
        this.wires.every((wire) => {
            let flag = wire.isHover(pos)
            if (flag) {
                this.selectedWire.push(wire)
                this.foreceUpdate()
            }
            return !flag
        })
        // if (!this.hasSelected()) {
        //     this.stretchComp.every((comp) => {
        //         let flag = comp.isHover(pos)
        //         if (flag) {
        //             this.selectedStretch.push(comp)
        //             this.foreceUpdate()
        //         }
        //         return !flag;
        //     })
                if (!this.hasSelected()) {
                    this.ic.every((comp) => {
                        let flag = comp.isHover(pos);
                        if (flag) {
                            this.selectedIC.push(comp);
                            this.foreceUpdate()
                        }
                        return !flag
                    })
                }
        // }
    }
}