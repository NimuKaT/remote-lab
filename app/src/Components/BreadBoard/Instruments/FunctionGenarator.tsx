import React, { Children } from "react";
import { Arc, Group, Line, Rect } from "react-konva";
import FGbutton from "./FGbutton";
import SpiceText from "../../../Spice/SpiceText";
import PSknob from "./PSknob";
import OSButton from "./OSButton";

type FunctionGeneratorP = {
    x: number,
    y: number
}
type FunctionGeneratorS = {}

export default class FunctionGenerator extends React.Component<FunctionGeneratorP, FunctionGeneratorS> {

    render(): React.ReactNode {
        return <Group x={this.props.x} y={this.props.y}>
            <Rect x={0} y={0} width={380} height={165} fill={"#888888"} cornerRadius={5}/>
            <Rect x={5} y={5} width={150} height={80} fill={"#000000"} cornerRadius={5}/>
            <OSButton x={165} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="1M" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={195} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="100K" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={225} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="10K" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={255} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="1K" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={285} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="100" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={315} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="10" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={345} y={20} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={7.5} text="1" justification="Center" fontSize={8}/>
            </OSButton>
            <OSButton x={255} y={60} width={25} height={15} fill="#cccccc">
                <Line x={12.5} y={7.5} points={[-5,2.5,-5,-2.5, 0, -2.5, 0, 2.5, 5, 2.5, 5, -2.5]} stroke='black' strokeWidth={.5}/>
            </OSButton>
            <OSButton x={285} y={60} width={25} height={15} fill="#cccccc">
                <Line x={12.5} y={7.5} points={[-5,0,-2.5,-2.5,2.5,2.5,5,0]} stroke={'Black'} strokeWidth={.5}/>
            </OSButton>
            <OSButton x={315} y={60} width={25} height={15} fill="#cccccc">
                <Arc x={10} y={7.5} innerRadius={2.5} outerRadius={2.5} angle={180} rotation={180} stroke={'black'} strokeWidth={.5}/>
                <Arc x={15} y={7.5} innerRadius={2.5} outerRadius={2.5} angle={180} stroke={'black'} strokeWidth={.5}/>
            </OSButton>
            <OSButton x={345} y={60} width={25} height={15} fill="#cccccc">
                <SpiceText x={12.5} y={5} text="ATT" justification="Center" fontSize={6}/>
                <SpiceText x={12.5} y={9.5} text="-20dB" justification="Center" fontSize={6}/>
            </OSButton>

            <PSknob minAng={-60} maxAng={240} x={40} y={130} setNum={(num: number)=>{}} initAng={240} radius={15} strokeWidth={2}/>
            <SpiceText x={40} y={105} text="Frequency" justification="Center" fontSize={6}/>
            <PSknob minAng={-60} maxAng={240} x={90} y={130} setNum={(num: number)=>{}} initAng={240} radius={15} strokeWidth={2}/>
            <SpiceText x={90} y={105} text="DUTY" justification="Center" fontSize={6}/>
            <PSknob minAng={-60} maxAng={240} x={140} y={130} setNum={(num: number)=>{}} initAng={240} radius={15} strokeWidth={2}/>
            <SpiceText x={140} y={105} text="OFFSET" justification="Center" fontSize={6}/>
            <PSknob minAng={-60} maxAng={240} x={190} y={130} setNum={(num: number)=>{}} initAng={240} radius={15} strokeWidth={2}/>
            <SpiceText x={190} y={105} text="AMPL" justification="Center" fontSize={6}/>

            <Rect x={230} y={120} width={90} height={18} fill="#aaaaaa" cornerRadius={2}/>
            <SpiceText x={252} y={130} text="-" justification="Center" color="black" fontSize={32}/>
            <SpiceText x={298} y={130} text="+" justification="Center" color="red" fontSize={32}/>
        </Group>
    }

}