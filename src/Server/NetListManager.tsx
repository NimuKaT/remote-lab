import LabSpec from "../labSpec"
import { pinConfig } from "../pinConfig";

export default class NetListManger {
    labspec?: LabSpec;
    netLists: Array<netListMap> = []
    
    loadLabSpec(labspec: LabSpec) {
        this.labspec = labspec;
        this.genNetlists()
    }

    genNetlists() {
        let netLists: Array<netListMap> = [];
        let togglePins: Array<number> = []; // Array index of pin
        let excludePins: Array<number> = []; // Array index of pin
        this.labspec?.power.digital.forEach((pin) => {
            excludePins.push(pin - 1)
        })
        this.labspec?.signal.digital.forEach((pin) => {
            excludePins.push(pin-1)
        })
        console.log(this.labspec?.digitalPinsEnabled);
        
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
            netLists.push({netList: netList, pinConfig: {"digital": newPins, "analogue": []}})
            
        }
        this.netLists = netLists;
        
    }
}

type netListMap = {
    netList: Array<string>,
    pinConfig: {
        "digital": Array<Array<boolean>>,
        "analogue": Array<Array<boolean>>,
    }
}