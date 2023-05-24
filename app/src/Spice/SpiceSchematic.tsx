import { Vector2d } from "konva/lib/types";
import { SCCoordinate } from "../Components/Schematic/SCCoordinate";
import { CollisionBox } from "./CollisionBox";
import IntegerTracker from "./IntegerTracker";
import NamedNet from "./NamedNet";
import SPNode from "./Node";
import NodeManager from "./NodeManager";
import SPCompObject from "./SPCompObject";
import { SPComponent } from "./SPComponent";
import SpiceWire from "./SpiceWire";
import { netListSolver } from "../NetListSolver";

export default class SpiceSchematic {
    fileName?: string;
    data?: Array<string>;
    isLoaded: boolean;
    isSaved: boolean;
    readonly labels: Map<string, string> = new Map(
        [
            ["Wire","W"],  
            ["Resistor", "R"], 
            ["Capacitor", "C"], 
            ["Inductor", "L"], 
            ["Voltage", "V"], 
            ["Current", "I"], 
            ["Diode", "D"], 
            ["Transistor", "Q"], 
            ["Switch", "S"], 
            ["IC", "U"],
            ["Net", "N"],
        ]
    );
    numberGen: Map<string, IntegerTracker>;
    nodeManager: NodeManager;
    components: Array<JSX.Element>;
    spiceComponents: Array<SPComponent> = [];
    selectedComponents: Array<SPComponent> = [];
    wires: Array<SpiceWire> = [];
    currentWire?: SpiceWire;
    selectedWires: Array<SpiceWire> = [];
    namedNets: Array<NamedNet> = [];
    selectedNets: Array<NamedNet> = [];

    

    constructor() {
        this.isLoaded = false;
        this.isSaved = true;
        this.wires = [];
        this.numberGen = new Map();
        this.labels.forEach((value: string, key: string) => {
            this.numberGen.set(key, new IntegerTracker());
        });
        this.nodeManager = new NodeManager();
        this.components = [];
    }

    loadNewData(newData: string) {
        if (this.isLoaded && !this.isSaved) {
            // Save file

            this.isSaved = true;
        }
        this.data = newData.split("\n");
        this.isLoaded = true;
    }

    getTool() : string {
        return "Move"
    }

    createSpiceObjects() {

    }


    addSpiceObjects() {

    }

    createNewWire(startPoint: SCCoordinate, endPoint?: SCCoordinate) {
        let gen = this.numberGen.get('Wire');
        if (gen) {
            // console.log('creating new wire')
            this.currentWire = new SpiceWire(startPoint, 'W' + gen.newNumber(), this.nodeManager);
            this.wires.push(this.currentWire);
            // Node stuff
        }
    }

    createNewSpiceComponent(compName: string, coord: SCCoordinate, isSelected: boolean = false, isFollowing: boolean = false) {
        if (compName === "Resistor") {
            // console.log("Create Resistor");
            let gen = this.numberGen.get("Resistor");
            if (gen) {

                let spiceComp = new SPComponent(coord, 'res', 'R0', this.nodeManager, "R"+ (gen.newNumber()));
                this.spiceComponents.push(spiceComp);
                this.components.push(<SPCompObject key={spiceComp.label} component={spiceComp}/>)
                if (isSelected) {
                    this.selectedComponents.push(spiceComp);
                    spiceComp.setSelected(isSelected);
                }
                if (isFollowing) {
                    spiceComp.setFollowing(isFollowing);
                }
            }
        }
        else if (compName === 'Capacitor') {
            let gen = this.numberGen.get("Capacitor");
            if (gen) {

                let spiceComp = new SPComponent(coord, 'cap', 'R0', this.nodeManager, "C"+ (gen.newNumber()));
                this.spiceComponents.push(spiceComp);
                this.components.push(<SPCompObject key={spiceComp.label} component={spiceComp}/>)
                if (isSelected) {
                    this.selectedComponents.push(spiceComp);
                    spiceComp.setSelected(isSelected);
                }
                if (isFollowing) {
                    spiceComp.setFollowing(isFollowing);
                }
            }
        }
        else if (compName === 'Inductor') {
            let gen = this.numberGen.get("Inductor");
            if (gen) {

                let spiceComp = new SPComponent(coord, 'ind', 'R0', this.nodeManager, "L"+ (gen.newNumber()));
                this.spiceComponents.push(spiceComp);
                this.components.push(<SPCompObject key={spiceComp.label} component={spiceComp}/>)
                if (isSelected) {
                    this.selectedComponents.push(spiceComp);
                    spiceComp.setSelected(isSelected);
                }
                if (isFollowing) {
                    spiceComp.setFollowing(isFollowing);
                }
            }
        } else if (compName === 'Voltage') {
            let gen = this.numberGen.get("Voltage");
            if (gen) {

                let spiceComp = new SPComponent(coord, 'voltage', 'R0', this.nodeManager, "V"+ (gen.newNumber()));
                this.spiceComponents.push(spiceComp);
                this.components.push(<SPCompObject key={spiceComp.label} component={spiceComp}/>)
                if (isSelected) {
                    this.selectedComponents.push(spiceComp);
                    spiceComp.setSelected(isSelected);
                }
                if (isFollowing) {
                    spiceComp.setFollowing(isFollowing);
                }
            }
        }
        else {
            let gen = this.numberGen.get("IC")
            console.log("Placing " + compName);
            
            if (gen) {
                let spiceComp = new SPComponent(coord, compName, 'R0', this.nodeManager, "XU" + gen.newNumber());
                this.spiceComponents.push(spiceComp);
                this.components.push(<SPCompObject key={spiceComp.label} component={spiceComp}/>)
                if (isSelected) {
                    this.selectedComponents.push(spiceComp);
                    spiceComp.setSelected(isSelected);
                }
                if (isFollowing) {
                    spiceComp.setFollowing(isFollowing);
                }
            }
        }
    }

    createNamedNet(name: string, coord: Vector2d) {
        let net: NamedNet = new NamedNet(name, this.nodeManager, coord.x, coord.y);
        this.namedNets.push(net);
        this.selectedNets.push(net);
    }

    mergeWire() {

    }

    getNewNet() {
        return (this.labels.get('Net') ?? '') + (() => {return String((this.numberGen.get('Net') ?? new IntegerTracker()).newNumber()).padStart(3, '0') ;});
    }

    getNewNode(pinNum: number, parent: object) {
        return this.nodeManager.newNode(parent);
    }

    getComponents() {
        return this.components;
    }

    getNets() {
        return this.namedNets;
    }

    dumpNode() {
        this.nodeManager.forceUpdate();
        return this.nodeManager.nodes;
    }

    deselectComponents() {
        this.selectedComponents.forEach((comp: SPComponent) => {
            comp.setSelected(false);
        })
        this.selectedComponents = [];
    }
    
    selectComponents(rect: CollisionBox) {
        // console.log("Selecting")
        this.selectedComponents = [];
        this.spiceComponents.forEach((comp: SPComponent) => {
            let compBox = comp.getCollisionBox();
            if (compBox) {
                // console.log('compairing')
                // console.log(rect)
                // console.log(compBox)
                if (rect.x1 <= compBox.x1 && compBox.x2 <= rect.x2) {
                    if (rect.y1 <= compBox.y1 && compBox.y2 <= rect.y2) {
                        comp.setSelected(true);
                        this.selectedComponents.push(comp);
                    }
                }
            }
        })
        this.wires.forEach((wire: SpiceWire) => {
            if (rect.x1 <= wire.x1 && rect.x1 <= wire.x2 && 
                wire.x1 <= rect.x2 && wire.x2 <= rect.x2) {
                if (rect.y1 <= wire.y1 && rect.y1 <= wire.y2 && 
                    wire.y1 <= rect.y2 && wire.y2 <= rect.y2) {
                        this.selectedWires.push(wire);
                }
            }
        });
        // Select NET                                                        TODO
        this.namedNets.forEach((net: NamedNet) => {
            let box = net.getCollisionBox();
            if (box) {
                if (rect.x1 <= box.x1 && box.x2 <= rect.x2) {
                    if (rect.y1 <= box.y1 && box.y2 <= rect.y2) {
                        this.selectedNets.push(net);
                    }
                }
            }
        })
       return this.hasSelected();
    }

    setFollowing() {
        this.selectedComponents.forEach((comp: SPComponent) => {
            comp.setFollowing(true);
        })
    }

    hasSelected() {
        return this.selectedComponents.length + this.selectedWires.length + this.selectedNets.length > 0
    }

    moveFollowers(shift: Vector2d) {
        let interval = 16;
        let realShift = {x: Math.round(shift.x/interval)*interval, y:Math.round(shift.y/interval)*interval};
        if (this.currentWire) {
            this.currentWire.updateEndPoint(realShift);
        } else {
            this.selectedComponents.forEach((comp: SPComponent) => {
                comp.setShift(realShift);
            })
            this.selectedWires.forEach((wire: SpiceWire) => {
                wire.shift(realShift);
            })
            this.selectedNets.forEach((net: NamedNet) => {
                net.shift(realShift);
            })
        }
    }

    place() {
        if (this.currentWire) {
            // console.log('placing wire')
            this.currentWire.placeWire();
            this.wires.push(this.currentWire);
            this.currentWire = undefined;
        } else {
            // this.spiceComponents.forEach((comp: SPComponent) => {
                // console.log(comp.getX());
            // })
            this.selectedComponents.forEach((comp: SPComponent) => {
                comp.place();
                comp.setSelected(false);
                comp.setFollowing(false);
                comp.checkNodes();
            })
            this.selectedWires.forEach((wire: SpiceWire) => {
                wire.placeWire();
            })
            this.selectedNets.forEach((net: NamedNet) => {
                net.place();
            })
            this.selectedComponents = [];
            this.selectedWires = [];
            this.selectedNets = [];
        }
    }

    cancelMove() {
        this.selectedComponents.forEach((comp: SPComponent) => {
            comp.cancelMove();
        })
        this.selectedComponents = [];
        this.selectedWires.forEach((wire: SpiceWire) => {
            wire.cancelMove();
        })
        this.selectedWires = [];
        this.selectedNets.forEach((net: NamedNet) => {
            net.cancel();
        })
        this.selectedNets = [];
    }

    deleteSelected() {
        this.selectedComponents.forEach((comp) => {
            // let i = -1;
            comp.delete();
            this.spiceComponents.forEach((item) => {
                if (item === comp) {
                    // i = index;
                } 
            })
            this.spiceComponents.splice(this.spiceComponents.indexOf(comp), 1);
            
        })
        this.selectedComponents = [];
        this.selectedWires.forEach((wire) => {
            wire.delete();
            // Search in all wires and delete                            TODO
        })
        if (this.currentWire) {
            this.currentWire.delete();
            this.currentWire = undefined;
        }
        this.selectedNets.forEach((net) => {
            net.delete();
            // Search in all Nets and delete                            TODO
        })
        this.selectedNets = [];
    }

    transform(rotation: number, flip: boolean) {
        if (this.hasSelected()) {
            this.selectedComponents.forEach(comp => {
               comp.transform(rotation, flip);
            });
        }
    }
    
    getSchemtaic() {
        let text: Array<string> = [];
        this.wires.forEach((wire) => {
            text = text.concat(wire.getSchematic());
        })
        this.namedNets.forEach((net) => {
            text = text.concat(net.getSchematic());
        })
        this.spiceComponents.forEach((comp) => {
            text = text.concat(comp.getSchematic())
        })
        return text
    }

    getNetlist() {
        let visitedNodes: Array<number> = [];
        let netNames: Array<string> = [];
        let compString = [];
        let netID: Map<number, number> = new Map<number, number>();
        let itemID: Map<string, number> = new Map<string, number>();
        let netCount = 0;
        let itemCount = 0;
        this.nodeManager.getNodes().forEach((node) => {
            if (visitedNodes.findIndex((id) => {
                return id === node.id
            }) >= 0
            ) {
                // Do nothing
            }
            else {
                visitedNodes.push(node.id);
                // Find what is the node a part of
                let parent = node.getParent();
                if (parent != undefined) {
                    let checkNodes: Array<SPNode> = [];
                    let currNodes: Array<SPNode> = [];
                    if (parent instanceof SPComponent) {
                        netID.set(node.id, netCount);
                        netNames.push('');
                        // Add the other nodes connected to the node of this comp
                    }
                    if (parent instanceof NamedNet) {
                        netNames.push(parent.getname());
                    }
                    if (parent instanceof SpiceWire) {
                        netNames.push('');
                        // Add nodes of other wire
                        let otherNode = parent.getOtherNode(node);
                        if (otherNode !== undefined) {
                            checkNodes = otherNode.getConnected();
                        }
                    }
                    // visitedNodes.push(node.id);
                    checkNodes = checkNodes.concat(node.getConnected());
                    checkNodes.forEach((n) => {
                        let ret = visitedNodes.findIndex((id) => {
                            return id === n.id;
                        })
                        if (ret >= 0) {
                            // DO nothing
                        }
                        else {
                            currNodes.push(n)
                        }
                    })
                    // console.log("Checking connected nodes");
                    // console.log(currNodes);
                    
                    
                    while (currNodes.length > 0) {
                        
                        // console.log("Checking connected nodes");
                        // console.log(currNodes);


                        let nextNodes: Array<SPNode> = []
                        currNodes.forEach((n) => {
                            parent = n.getParent();
                            visitedNodes.push(n.id)
                            checkNodes = []
                            if (parent != undefined) {
                                if (parent instanceof SPComponent) {
                                    netID.set(n.id, netCount);
                                    // console.log("Its a comp");
                                    
                                }
                                if (parent instanceof NamedNet) {
                                    if (netNames[netCount] === '') {
                                        netNames[netCount] = parent.getname()
                                    }
                                }
                                if (parent instanceof SpiceWire) {
                                    // console.log("its a wire");
                                    let otherNode = parent.getOtherNode(n);
                                    if (otherNode !== undefined) {
                                        checkNodes = otherNode.getConnected();
                                    }
                                    // Add other nodes
                                }
                                // console.log(visitedNodes);
                                
                                checkNodes = checkNodes.concat(n.getConnected());
                                checkNodes.forEach((no) => {
                                    let ret = visitedNodes.findIndex((id) => {
                                        return id === no.id
                                    })
                                    if (ret >= 0) {}
                                    else {
                                        ret = nextNodes.findIndex((nod) => {
                                            return nod.id === no.id
                                        })
                                        if (ret >= 0) {}
                                        else {
                                            nextNodes.push(no)
                                        }
                                    }
                                })
                            }
                        })
                        currNodes = nextNodes;
                    }
                    netCount++;
                    
                }

                // node.getConnected();
            }
        })
        let netlist: Array<string> = [];
        this.spiceComponents.forEach((comp) => {
            
            // console.log(comp.getAttribute('InstName'));
            // console.log(comp.getAttribute('Prefix'));
            // console.log(comp.getAttribute('Value'));
            let nets = ''
            comp.getNodes().forEach((node) => {
                let i = netID.get(node.id);
                if (i !== undefined) {
                    if (netNames[i] === '') {
                        // console.log("N00"+ i + ": " + i);
                        nets = nets.concat(" N00" + i)
                    }
                    else {
                        // console.log(netNames[i] + ': ' + i);
                        nets = nets.concat(" " + netNames[i])
                    }
                }
            })
            netlist.push(comp.getAttribute('InstName') + nets + ' ' + comp.getAttribute('Value'));
        })
        
        return netlist;

    }

    compareNetlist() {
        let refNetlist = ['XU1 0 N001 Vdd Vss N002 AD549', 
        'V1 Vdd 0 15', 
        'V2 0 Vss 15', 
        'R1 N002 N001 10k', 
        'R2 N001 input 4.7k']
        let refComps: Array<[string, string]> = [];
        let refNet: Map<string, number> = new Map<string, number>();
        let count = 1;
        // Creates a list of components in refComps, and a list of nets in refNet
        // with each net being assigned an ID. Each component is identified
        // with their InstName
        refNetlist.forEach((line) => {
            let words = line.split(' ');
            refComps.push([words[0].charAt(0), words[words.length-1]]);
            words.forEach((word, index) => {
                if (index !== 0 && index !== words.length-1) {
                    if (word !== '0') {
                        if (!refNet.has(word)) {
                            refNet.set(word, count);
                            count++;
                        }
                    }
                }
            })
        })
        
        // Creates a list of components in curComps, and a list of nets in curNet
        // with each net being assigned an ID. Each component is identified
        // with their InstName
        let curNetlist = this.getNetlist();
        let curComps: Array<[string, string]> = [];
        let curNet: Map<string, number> = new Map<string, number>();
        count = 1;
        curNetlist.forEach((line) => {
            let words = line.split(' ')
            curComps.push([words[0].charAt(0), words[words.length-1]])
            words.forEach((word, index) => {
                if (index !== 0 && index !== words.length-1) {
                    if (word !== '0') {
                        if (!curNet.has(word)) {
                            curNet.set(word, count);
                            count++;
                        }
                    }
                }
            })
        })

        //
            console.log(netListSolver(refNetlist, curNetlist));
            // console.log('ref net')
        //
        
        // console.log(refComps);
        // console.log(refNet);
        
        // console.log(curComps);
        // console.log(curNet);
        // Begining of Net list comparison
        let matchingCompIndex: Array<Array<number>> = [];
        let matchedIndex: Array<number> = [];

        // Checks if each component in the two netlists has a component
        // that matches its attributes and values such that it will have at least
        // One unique match. Matches are recorded in matchingCompIndex with the index
        // Of the array being the index of component in refComps and values in the array
        // corresponding to the index of compoenents in curComps
        if (refComps.length === curComps.length &&
            refNet.size === curNet.size) {
            refComps.forEach((Rcomp, i) => {
                matchingCompIndex.push([])
                curComps.forEach((CComp, j) => {
                    // Only check if prefix is equal for a possible match
                    if (Rcomp[0] === CComp[0] && Rcomp[1] === CComp[1]) {
                        if (matchedIndex.length === i) {
                            console.log(matchedIndex);
                            
                            if (matchedIndex.findIndex((val) => {
                                return val === j
                            }) < 0) {

                                matchedIndex.push(j);
                            }
                        }
                        matchingCompIndex[i].push(j);
                    }
                })
            })
            console.log(matchingCompIndex)
            console.log(matchedIndex)
            if (matchedIndex.length === refComps.length) {
                console.log("Has required unique matches");
                // Add Recursive check for netlist combination
                // Add case for flipped connections for resistors, non-polar capacitors
                
            }
            else {
                console.log("Requies unique matches not met\n Values of components or ICs maybe different.");
                
            }
        } else {
            console.log("Schematic cannot match due to miss match in component count or net count");
            
        }
        
        
    }

};