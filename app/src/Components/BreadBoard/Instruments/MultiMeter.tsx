
import React from "react";
import { Group, Line, Rect } from "react-konva";
import SpiceText from "../../../Spice/SpiceText";
import FGbutton from "./FGbutton";
import OSButton from "./OSButton";
import PSPowerButton from "./PSPowerButton";

type MultiMeterP =  {
    x: number,
    y: number

}

type MultiMeterS = {}

export default class MultiMeter extends React.Component<MultiMeterP, MultiMeterS> {

    render(): React.ReactNode {
        return <Group x={this.props.x} y={this.props.y}>
            <Rect x={0} y={0} width={370} height={165} fill={"#bbbbbb"} cornerRadius={5}/>
            <Rect x={5} y={5} width={265} height={90} fill={"#000000"} cornerRadius={5}/>

            <OSButton x={240} y={105} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="AUTO/MAN" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={205} y={105} width={30} height={15} fill={"#e2e2e2"}></OSButton>
            <OSButton x={170} y={105} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="MIN/MAX" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={135} y={105} width={30} height={15} fill={"#e2e2e2"}></OSButton>
            <OSButton x={100} y={105} width={30} height={15} fill={"#e2e2e2"}></OSButton>
            <OSButton x={65} y={105} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="ACV" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={30} y={105} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="DCV" justification="Center" fontSize={5}/></OSButton>

            <OSButton x={240} y={135} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="SHIFT" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={205} y={135} width={30} height={15} fill={"#e2e2e2"}></OSButton>
            <OSButton x={170} y={135} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="HOLD" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={135} y={135} width={30} height={15} fill={"#e2e2e2"}></OSButton>
            <OSButton x={100} y={135} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="AC-DC" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={65} y={135} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="ACA" justification="Center" fontSize={5}/></OSButton>
            <OSButton x={30} y={135} width={30} height={15} fill={"#e2e2e2"}><SpiceText x={15} y={7.5} text="DCA" justification="Center" fontSize={5}/></OSButton>


            {/* Label */}
            <SpiceText x={355} y={45} text="Max" justification="Center" fontSize={6}/>
            <SpiceText x={355} y={50} text="DC 1000V" justification="Center" fontSize={6}/>
            <SpiceText x={355} y={55} text="AC 1000V" justification="Center" fontSize={6}/>
            <Line x={340} y={25} points={[0,0, 15, 0, 15, 15]} stroke={"black"} strokeWidth={1}/>
            <Line x={355} y={60} points={[0,0, 0, 13, -15, 13]} stroke={"black"} strokeWidth={1}/>

            <SpiceText x={355} y={100} text="Max" justification="Center" fontSize={6}/>
            <SpiceText x={355} y={105} text="20 A" justification="Center" fontSize={6}/>
            <Line x={340} y={78} points={[0,0, 15, 0, 15, 15]} stroke={"black"} strokeWidth={1}/>
            <Line x={355} y={110} points={[0,0, 0, 15, -15, 15]} stroke={"black"} strokeWidth={1}/>

            <SpiceText x={315} y={55} text="Max" justification="Center" fontSize={6}/>
            <SpiceText x={315} y={60} text="2 A" justification="Center" fontSize={6}/>
            <Line x={295} y={70} points={[0,0, 0, -15, 10, -15]} stroke={"black"} strokeWidth={1}/>
            <Line x={335} y={70} points={[0,0, 0, -15, -10, -15]} stroke={"black"} strokeWidth={1}/>

            <SpiceText x={315} y={90} text="Max" justification="Center" fontSize={6}/>
            <SpiceText x={315} y={95} text="500V" justification="Center" fontSize={6}/>
            <Line x={315} y={85} points={[0,0, 0, -10, 15, -10]} stroke={"black"} strokeWidth={1}/>
            <Line x={315} y={100} points={[0,0, 0, 5]} stroke={"black"} strokeWidth={1}/>
            <Line x={311} y={105} points={[0,0, 8, 0]} stroke={"black"} strokeWidth={1}/>
            <Line x={313} y={107} points={[0,0, 4, 0]} stroke={"black"} strokeWidth={1}/>
            <Line x={314} y={109} points={[0,0, 2, 0]} stroke={"black"} strokeWidth={1}/>

            <PSPowerButton x={15} y={130}/>
            <SpiceText x={15} y={150} text="Power" justification="Center" fontSize={6}/>
        </Group>
    }

}