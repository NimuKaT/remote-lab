export default interface LabSpec {
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
    }
}

type pinState = {
    "digital": Array<number>,
    "analogue": Array<number>
}