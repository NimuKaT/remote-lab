import { env, exit } from "node:process"
import NIUSBDRiver from "./NIUSBDriver"
import express from 'express'
import readline from "readline"
import fs from "fs/promises"
import LabSpec from "../labSpec"
import NetListManger from "./NetListManager"
import bodyParser from "body-parser"
import { channel } from "node:diagnostics_channel"
import { netListSolver } from "./NetListSolver"
import { write } from "node:fs"

// const express = require('express')
// import express, { Express } from "express"
let app = express()
let port = 3000
let os = process.platform;
let niusb = new NIUSBDRiver(os, '/')


let prevPin = {digital: [[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false]], analogue: [[false, false]]}

express.static("app/build")
app.use(express.static('app/build'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.get('/', (req, res) => {
//     res.sendFile
// })

// app.get('/api/testWrite', (req, res) => {
//     niusb.writeToDevice({digital: [
//         [false, false, true, true, false,false,true, true],
//         [true,false,false,false,false,false,false,false]
//     ], analogue: [[false,false]]}, () => {

//     })
//     res.send("Hello")
// })

app.get('/api/currentLab', (req, res, next) => {
    res.json({
        "labFile": labFile
    })
})

app.get('/api/netlist', (req, res, next) => {
    res.json(netlistmanager.netLists)
})

app.post('/api/runNetlist', (req, res, next) => {
    // console.log("Received netlist")
    let netlist = req.body as Array<string>
    prevNetList = netlist;
    // console.log(netlist);
    let pinconfig = netlistmanager.compareNetlist(netlist);
    
    if (pinconfig.digital.length > 0) {
    // HARD CODE EXECUTE SEQUENCE
    
    prevPin.digital[0][0] = false
    niusb.writeToDevice(prevPin, ()=> {
    prevPin.digital[1][3] = false
    niusb.writeToDevice(prevPin, () => {
    pinconfig.digital[0][0] = false
    pinconfig.digital[1][3] = false
    niusb.writeToDevice(pinconfig, () => {
    pinconfig.digital[1][3] = true
    niusb.writeToDevice(pinconfig, () => {
    pinconfig.digital[0][0] = true
    niusb.writeToDevice(pinconfig)}) }) }) 
    prevPin = pinconfig
    })
    res.send("ok")
    } else {
        prevPin.digital[0][0] = false
        niusb.writeToDevice(prevPin, ()=> {
        prevPin.digital[1][3] = false
        niusb.writeToDevice(prevPin)})
        res.send("fail")
    }

}
)

app.get('/api/stop', (req, res, next) => {
    prevPin.digital[0][0] = false
    niusb.writeToDevice(prevPin, ()=> {
    prevPin.digital[1][3] = false
    niusb.writeToDevice(prevPin)
    // printPinState()
    })
    // rl.write("Curent key settings are: " + prevPin);})
    res.send("stopped")
})

app.get('/api/oscilloscope', (req, res, next) => {
    res.send(oscillo)
})
 
app.get('/api/psuSpec', (req, res, next) => {
    res.send(netlistmanager.getPSUSpec())
})
// Select Lab file

let specificationDir = "./bin/dist/Specifications/"
let labFile = ""
let rl = readline.createInterface({input: process.stdin, output: process.stdout})
let labspec: LabSpec;
let netlistmanager: NetListManger = new NetListManger();
let oscillo: string = "";
let prevNetList: Array<string> = [];
fs.readFile("./bin/dist/config.json", 'utf-8').then((data) => {
    oscillo = JSON.parse(data)?.Oscilloscope;
})

function printPinState() {

    rl.write("\nCurrent Pin state is:\n\tDigital:\n")
    prevPin.digital.forEach((digPin, index) => {
        rl.write("\t\tDigital Pins " + index + "\n")
        digPin.forEach((state, i) => {
            rl.write("\t\t\t" + (state? "1" : "0") + "\n")
        })
    })

}

function getLabFile() {
    rl.question("Please enter the file name of the lab file to be opened: ", (answer) => {
            readLabFile(answer)
    })
}

function readLabFile(fileName: string) {
    fs.readFile(specificationDir + fileName, 'utf-8').then((data) => {
            labFile = fileName
            labspec = JSON.parse(data) as LabSpec;
            netlistmanager.loadLabSpec(labspec)
            readCommand("")
            // rl.close()
    }).catch((err) => {
        console.log(err);
        getLabFile()
    })
}

function writeLabFile() {
    fs.writeFile(specificationDir + labFile, JSON.stringify(netlistmanager.labspec, null, 4), 'utf-8')
}

let pinNum = 0;
let isOn = true;
function readCommand(answer: string) {
    let values: Array<string> = answer.split(" ")
    let flag = false;
    let printNets = true;
    let command = values[0].toLocaleLowerCase()
    if (values.length === 1) {
        if (command === 'list') {
            console.log(netlistmanager.netLists)
            printNets = false
        }
        else if (command === '?') {
            rl.write("Command List:\n\tlist \t - lists the current valid netlists\n\tchange (switch number) (switch state) - prepares to change the net list for the specified switch and swicth state\n")
            printNets = false;
        }
        else if (command === 'q') {
            exit(0);
        }
        else if (command === "state") {
            printPinState();
            printNets = false
        }
    }
    if (values.length === 2) {
        
        if (command === "net") {
            console.log(netlistmanager.printNetlist(parseInt(values[1])))
            printNets = false
        }
        else if (command === "pin") {
            console.log(netlistmanager.printNetlist(parseInt(values[1])))
            printNets = false
        }
    }
    if (values.length === 3 ) {
        if (values[0].toLocaleLowerCase() === 'change') {
            if (parseInt(values[1]) === -1 || (parseInt(values[1]) >= 1 && parseInt(values[1]) <= 11)) {
                pinNum = parseInt(values[1]);
                // console.log("got pin: %d", pinNum);

                if (pinNum === -1) {
                    flag = true;
                    newNet = [];
                    netlistmanager.labspec?.spiceNetlist.baseNetlist.forEach((net) => {
                        newNet.push(net);
                    })
                    chagneNetList(" ")
                }
                else if (values[2].toLocaleLowerCase() === 'on' || values[2].toLocaleLowerCase() === 'off') {
                    if (values[2].toLocaleLowerCase() === 'on') {
                        isOn = true
                    } else {
                        isOn = false;
                    }
                    flag = true;
                    newNet = []
                    netlistmanager.getSwitches()?.digital.forEach((sw) => {
                        if (sw.pinNum === pinNum) {
                            if (isOn) {
                                sw.on.forEach((net) => {
                                    newNet.push(net.slice())
                                })
                            } else {
                                sw.off.forEach((net) => {
                                    newNet.push((net.slice()))
                                })
                            }
                        }
                    })
                    chagneNetList(" ");
                }
            }
        }
    }
    if (!flag) {

        if (printNets) {

            rl.write("Current setting for the PCB is:\n")
// rl.write(JSON.stringify(netlistmanager.getSwitches()))
            rl.write("\tBase Netlist:\n")
            netlistmanager.labspec?.spiceNetlist.baseNetlist.forEach((net) => {
                rl.write("\t\t" + net + "\n")
            })
            netlistmanager.getSwitches()?.digital.forEach((sw) => {
                rl.write("\tpin number: " + sw.pinNum + "\n\t\ton: \n")
                sw.on.forEach((net) => {
                    rl.write("\t\t\t" + net + "\n")
                })
                rl.write("\t\toff: \n")
                sw.off.forEach((net) => {
                    rl.write("\t\t\t" + net + "\n")
                })
            })
        }
    rl.question("Enter a command: ", readCommand);
    }
}

let newNet: Array<string> = []

function chagneNetList(answer: string) {
    let flag = false
    if (answer === '') {
        readCommand('')
    }
    else {
        let val = answer.split(" ")
        let cmd =val[0].toLocaleLowerCase() 
        if (cmd === "add") {
            val.splice(0,1);
            newNet.push(val.join(" "));
        } else if (cmd === 'remove') {
            if (val.length === 1) {
                newNet = [];
            } else {
                let i = parseInt(val[1]);
                if (0 <= i && i < newNet.length) {
                    newNet.splice(i,1);
                }
            }
        } else if (cmd === 'confirm') {
            flag = true;
            if (pinNum === -1) {
                if (netlistmanager.labspec !== undefined) {
                    netlistmanager.labspec.spiceNetlist.baseNetlist = newNet;
                    writeLabFile()
                }
            } else {

            netlistmanager.getSwitches()?.digital.every((sw) => {
                if (sw.pinNum === pinNum) {
                    if (isOn) {
                        sw.on = newNet;
                    } else {
                        sw.off = newNet;
                    }
                    newNet = []
                    writeLabFile()
                    return false
                }
                return true
            })
            }
            netlistmanager.genNetlists()
            readCommand('')
        } else if (cmd === 'cancel') {
            flag = true
            readCommand('')
        } else if (cmd === "?" || cmd === "help" || cmd === 'h') {
            rl.write("Command List:\n" +
            "\tadd (net list) \t - adds net list to the proposed changes\n" +
            "\tremove (net list index) \t - removes the netlist at the specified index from the proposed new netlist\n" +
            "\tconfirm \t - commits the changes to the netlist to the active netlist resolver\n" + 
            "\tcancel \t - cancels the changes to the netlists\n"
            )
        }



        if (!flag) {
        rl.write("Currently changing switch " + pinNum + " for state " + (isOn? "on": "off") + "\n")
        rl.write("Current Net:\n")
        if (pinNum === -1) {
            netlistmanager.labspec?.spiceNetlist.baseNetlist.forEach((net) => {
                rl.write("\t" + net + "\n");
                return false
            })
        } else {
            netlistmanager.getSwitches()?.digital.every((sw) => {
                if (sw.pinNum === pinNum) {
                    if (isOn) {
                        sw.on.forEach((net) => {
                            rl.write("\t" + net + "\n")
                        })
                    } else {
                        sw.off.forEach((net) => {
                            rl.write("\t" + net + "\n")
                        })
                    }
                    return false
                }
                return true
            })
        }
        rl.write("New Net:\n")
        newNet.forEach((net) => {
            rl.write("\t" + net + "\n")
        })
        rl.question('Enter changes: ', chagneNetList)
        }

    }
}

app.listen(port, () => {
    console.log('Server listening to ' + port)
// readLabFile("lab01.json")
    // readLabFile("")
    getLabFile();
})

// getLabFile()