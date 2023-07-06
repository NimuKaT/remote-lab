import LabSpec from "../labSpec"
import { pinConfig } from "../pinConfig";
import { netListSolver } from "./NetListSolver";

export default class NetListManger {
    labspec?: LabSpec;
    netLists: Array<netListMap> = []
    
    loadLabSpec(labspec: LabSpec) {
        this.labspec = labspec;
        this.genNetlists()
    }

    getSwitches() {
        return this.labspec?.spiceNetlist.switches
    }

    getPSUSpec() {
        return this.labspec?.PSUCondition;
    }

    genNetlists() {
        let netLists: Array<netListMap> = [];
        let togglePins: Array<number> = []; // Array index of pin
        let excludePins: Array<number> = []; // Array index of pin
        this.labspec?.power.digital.forEach((pin) => {
            excludePins.push(pin - 1)
        })
        // this.labspec?.signal.digital.forEach((pin) => {
        //     excludePins.push(pin-1)
        // })
        // console.log(this.labspec?.digitalPinsEnabled);
        
        this.labspec?.digitalPinsEnabled.forEach((pin, index) => {
            if (pin && excludePins.findIndex((value) => {return value === index;}) === -1) {
                togglePins.push(index)
            }
        })
        //
        for (let i = 0; i <= Math.pow(2, togglePins.length)-1; i++) {
            // let pinConfig: pinConfig = {"digital": [], "analogue": []}
            let digtialPins: Array<boolean> = []
            let netList: Array<string> = [];
            this.labspec?.spiceNetlist.baseNetlist.forEach((net) => {
                netList.push(net)
            })
            // HARD CODE
            for (let j = 0; j < 16; j++) {
                digtialPins.push(false)
            } 
            excludePins.forEach((pin) => {
                digtialPins[pin] = true;
            })

            togglePins.forEach((pin, index) => {
                digtialPins[pin] = (i & (1 << index)) > 0
                
                // LAB 2 ONLY
                if (pin === 1 && !digtialPins[pin] && (i & (1 << (index+1))) > 0) {
                    // Skip
                    console.log("skipping pin 2 and 3")
                } else{



                let switchIndex = this.labspec?.spiceNetlist.switches.digital.findIndex((swConfig) => {
                    return swConfig.pinNum === pin+1
                })
                if (switchIndex !== undefined) {
                    if (digtialPins[pin]) {
                        // on
                        this.labspec?.spiceNetlist.switches.digital[switchIndex].on.forEach((net) => {
                            netList.push(net)
                        })
                    } else {
                        // off
                        this.labspec?.spiceNetlist.switches.digital[switchIndex].off.forEach((net) => {
                            netList.push(net)
                        })
                    }
                }



                }
               
            })
            // Add nets of exclude pins
            excludePins.forEach((pin) => {
                let switchIndex = this.labspec?.spiceNetlist.switches.digital.findIndex((swConfig) => {
                    return swConfig.pinNum === pin+1
                })
                if (switchIndex !== undefined && switchIndex >= 0) {
                    this.labspec?.spiceNetlist.switches.digital[switchIndex].on.forEach((net) => {
                        netList.push(net)
                    })
                }
            })

            // HardCode
            let newPins: Array<Array<boolean>> = [];
            
            newPins.push([])
            newPins.push([])
            digtialPins.forEach((value, pin) => {
                newPins[Math.floor(pin/8)].push(value);
            })
            netLists.push({netList: this.trimNetlist(netList), pinConfig: {"digital": newPins, "analogue": []}})
            
        }
        this.netLists = netLists;
        
    }

    compareNetlist(targetNet: Array<string>) {
        let pinconfig: {"digital": Array<Array<boolean>>,"analogue": Array<Array<boolean>>} = {"digital":[], "analogue": []}
        let newTarget: Array<string> = [];
        targetNet.forEach((net) => {
            let parts = net.split(" ");
            if (parts[parts.length-1] === "CA3083") {
                newTarget.push("XU " + parts[1] + " " + parts[16] + " " + parts[15] + " Qm")
                newTarget.push("XU " + parts[2] + " " + parts[3] + " " + parts[4] + " Qm")
                newTarget.push("XU " + parts[7] + " " + parts[6] + " " + parts[8] + " Qn")
                newTarget.push("XU " + parts[9] + " " + parts[10] + " " + parts[11] + " Qn")
                newTarget.push("XU " + parts[14] + " " + parts[13] + " " + parts[12] + " Qn")
            } else {
                newTarget.push(net)
            }
        })
        console.log(newTarget)


        let target = this.trimNetlist(newTarget)
        // console.log(target)
        this.netLists.every((ref) => {
            let matched = netListSolver(ref.netList, target);
            if (matched === 0) {
                // console.log("Found Matching netlist")
                // console.log(ref.netList)
                pinconfig = ref.pinConfig;
                return 0
            }
            return 1

        })
        // console.log(pinconfig)
        return pinconfig
    }

    trimNetlist(netlist: Array<string>): Array<string> {
        let nets: Array<Array<string>> = []
        let revMap: Map<string, Array<number>> = new Map<string, Array<number>>();
        let netCount: Array<number> = []
        netlist.forEach((net, i) => {
            let prefix = net.charAt(0);
            let currNets: Array<string> = [];
            let words = net.split(" ")
            if (prefix === 'R' || prefix === 'C' || prefix === 'V') {
                currNets.push(words[1])
                if (revMap.has(words[1])) {
                    revMap.get(words[1])?.push(i)
                } else {
                    revMap.set(words[1], [i])
                }
                currNets.push(words[2])
                if (revMap.has(words[2])) {
                    revMap.get(words[2])?.push(i)
                } else {
                    revMap.set(words[2], [i])
                }
                netCount.push(2)

            }
            if (prefix === 'X' || prefix === 'U') {
                words.forEach((word, index) => {
                    if (index !== 0 && index !== words.length-1) {
                        currNets.push(word)
                        if (revMap.has(word)) {
                            revMap.get(word)?.push(i)
                        } else {
                            revMap.set(word, [i])
                        }
                    }
                })
                netCount.push(words.length-2)
            }
            nets.push(currNets)
        })
        revMap.forEach((comps, nets) => {
            if (comps.length === 1) {
                // Find index of comp
                netCount[comps[0]] -= 1;
            }
        })
        let deletingNets: Array<number> = []
        netCount.forEach((count, i) => {
            if (count <= 1) {
                deletingNets.push(i)
            }
        })
        if (deletingNets.length !== 0) {
            let newNetList: Array<string> = []
            netlist.forEach((net, index) => {
            if (deletingNets.findIndex((value) => {return value===index}) === -1) {
                newNetList.push(net)
            }})
            return this.trimNetlist(newNetList)
        }
        else {
            return netlist;
        }
        
    }
}

type netListMap = {
    netList: Array<string>,
    pinConfig: {
        "digital": Array<Array<boolean>>,
        "analogue": Array<Array<boolean>>,
    }
}