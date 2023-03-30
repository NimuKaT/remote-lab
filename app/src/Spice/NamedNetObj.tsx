import React from "react";
import { Group, Line } from "react-konva";
import { Group as group} from 'konva/lib/Group'
import NamedNet from "./NamedNet";
import NodeObject from "./NodeObject";
import SpiceText from "./SpiceText";

interface NamedNetObjP {
    namedNet: NamedNet
}

interface NamedNetObjS {

}

export default class NamedNetObj extends React.Component<NamedNetObjP, NamedNetObjS> {
    grpRef: React.RefObject<group> = React.createRef<group>();

    componentDidMount() {
        this.props.namedNet.setUpdate(this.update.bind(this));
        this.props.namedNet.setRef(this.grpRef);
    }

    update() {
        this.forceUpdate();
    }

    render(): React.ReactNode {
        // let colBox = this.props.namedNet.getCollisionBox();
        return <Group x={0} y={0}>
        <Group
            ref={this.grpRef}
            x={this.props.namedNet.getX()}
            y={this.props.namedNet.getY()}
            visible={!this.props.namedNet.deleted}
        >
            {   this.props.namedNet.getname() === '0' || this.props.namedNet.getname().toLocaleLowerCase() === 'gnd'?
            <>
            <Line key={1} x={-16} y={0}
                points={[0, 0, 32,0]}
             stroke={'black'} strokeWidth={0.5}/>
            <Line key={2} x={-16} y={0}
                points={[0, 0, 16, 16]}
             stroke={'black'} strokeWidth={0.5}/>
            <Line key={3} x={16} y={0}
                points={[0, 0, -16,16]}
             stroke={'black'} strokeWidth={0.5}/>
             </>
            :
            <>
            <SpiceText
                x={0}
                y={0}
                orientation={''}
                justification={"Bottom"}
                text={this.props.namedNet.getname()}
            />
            </>
            }
           <NodeObject
                node={this.props.namedNet.getNode()}
                initialCoord={{x:0, y:0}}
            />
        </Group>
            {/* <Rect x={colBox.x1} y={colBox.y1} width={colBox.x2-colBox.x1} height={colBox.y2 - colBox.y1} stroke={'black'} strokeWidth={0.1} visible={!this.props.namedNet.deleted}/> */}

        </Group>

    }
}