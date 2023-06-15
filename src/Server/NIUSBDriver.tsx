import {execFile} from 'node:child_process'


export interface NIUSBParams {
    digital: Array<Array<boolean>>
    analogue: Array<Array<boolean>>
}

// Assume input is valid

export default class NIUSBDRiver {
    executable: string
    delimeter: string
    prevCmd?: NIUSBParams

    constructor(os: string, delimeter: string) {
        this.delimeter = delimeter;
        // this.executable = executable;
        if (os === "win32") {
            this.executable =  ".\\bin\\NIUSB\\digitalWrite.exe"
        } else {
            this.executable = "./bin/testWrite/digitalWrite"
        }

    }

    writeToDevice(data: NIUSBParams, callback?: ()  => void) {
        // console.log(data)
        let status = 0
        let digitalWriteParams: Array<string> = []
        let analogueWriteParams: Array<string> = []
        if (data.digital.length <= 2 && data.analogue.length <= 1) {
            // Digital Write
            data.digital.every((values, i) => {
                let writeValue = 0;
                if (values.length <= 8) {
                    writeValue = this._formatOutput(values)
                    digitalWriteParams.push(writeValue.toString(16))
                    return true
                } else {
                    status = 2;
                    console.log("Attempted to write more than 8 bits to digital pin %d", i)
                    return false
                }
            })
            // console.log(data)
        }
        else {
            status = 1;
            console.log(data)
            console.log("Attempted to write to device with invalid params")
        }
        if (!status && data.analogue.length <= 1) {
            data.analogue.every((values, index) => {
                if (values.length <= 8) {
                    analogueWriteParams.push(this._formatOutput(values).toString(16))
                    return true
                }
                else {
                    status = 3;
                    console.log("Attempted to write more than 8 bits to analogue pin %d", index)
                    return false
                }
            })
        }
        if (!status) {
            this.executeWrite(digitalWriteParams, analogueWriteParams, callback)
            // console.log(data)
            this.prevCmd = data
        }
        return status
    }

    _formatOutput(data: Array<boolean>): number {
        let writeValue = 0;
        data.forEach((value, index) => {
            if (value) {
                writeValue += 1 << index
            }
        })
        return writeValue
    }

    executeWrite(digitalWrite: Array<string>, analogueWrite: Array<string>, callback?: () => void) {
        // Assumes inputs are vaild
        // Improve asycn and genarality
        let process = execFile(this.executable, ['0', digitalWrite[0]], null, (err, stdout, stderr) => {
            if (err) {
                console.log(stderr)
            }
            // console.log(stdout)
            process = execFile(this.executable, ['1', digitalWrite[1]], null, (err, stdout, stderr) => {
                if (err) {
                    console.log(stderr);
                }
                // console.log(stdout);
                if (callback !== undefined) {
                    callback();
                }
            })
        })
        
        
    }
}


