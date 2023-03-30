import { Node } from "konva/lib/Node";
import { Circle, Line, Rect, Text } from "react-konva";
import NodeManager from "./NodeManager";
import NodeObject from "./NodeObject";
import SPNode from "./Node";
import { compList } from "./compList";

export default class AsyToSymbol {
    konvaNodes: Array<SPNode>;
    manager: NodeManager

    constructor(manager: NodeManager) {
        this.konvaNodes = [];
        this.manager = manager;
    }


    getKonvaNode(cmd: string): JSX.Element {
        let values: Array<string> = cmd.split(' ');
        let type = values[0];
        if (type == 'LINE') {
            return (<Line points={[parseInt(values[2]), parseInt(values[3]),
                parseInt(values[4]), parseInt(values[5])]}/>);
        }
        else if (type == 'RECTANGLE'){
            let x = parseInt(values[2]);
            let y = parseInt(values[3]);
            return (<Rect x={x} y={y}
                width={x-parseInt(values[4])} height={y-parseInt(values[5])}/>);
        } else if (type == 'CIRCLE') {
            let x1 = parseInt(values[2]);
            let y1 = parseInt(values[3]);
            let x2 = parseInt(values[4]);
            let y2 = parseInt(values[5]);
            return (<Circle x={(x1+x2)/2} y={(y1+y2)/2}
                radius={Math.abs(x1-x2)}
            />);
        } else if (type == 'ARC') {
        } else if (type == 'TEXT') {
            let x = parseInt(values[1]);
            let y = parseInt(values[2]);
            return (<Text x={x} y={y} text={values[5]}/>)
        } else if (type == 'PIN') {
            let x = parseInt(values[1]);
            let y = parseInt(values[2]);
            this.konvaNodes.push(this.manager.newNode({}));
            return <NodeObject node={this.manager.newNode({})} initialCoord={{x: x, y: y}}/>
        }
        return <></>
    }

    createComponent(compName: string) {
        let cmds: Array<string>;
        let elements: Array<JSX.Element>;
        if (compList.has(compName)) {
            cmds = compList.get(compName).split('\n');
            cmds.forEach((cmd: string) => {
                elements.push(this.getKonvaNode(cmd));
            })
        } 
    }
}