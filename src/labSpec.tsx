export default interface LabSpec {
    "labName": string | undefined,
    "driverName": string,
    "digitalPinsEnabled": Array<number>,
    "analoguePinsEnabled": Array<number>,
    "defaultPinState": pinState,
    "power": pinState,
    "signal": pinState,
    "spiceNetlist": {
        "baseNetlist": Array<string>,
        "switches": {
            "digital": Array<{
                "pinNum": number,
                "on": Array<string>,
                "off": Array<string>
            }>
        }
    },
    "PSUCondition"?: {
        "V1": number,
        "V2": number,
        "A1": number,
        "A2": number,
        "buttonState": [boolean, boolean],
        "netlist": [string]
    }
}

type pinState = {
    "digital": Array<number>,
    "analogue": Array<number>
}