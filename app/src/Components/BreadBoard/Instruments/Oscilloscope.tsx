import React from "react";
import { Group, Rect } from "react-konva";
import SpiceText from "../../../Spice/SpiceText";
import OSButton from "./OSButton";
import PSknob from "./PSknob";

type OscilloscopeP =  {
    x: number,
    y: number

}

type OscilloscopeS = {}

export default class Oscilloscope extends React.Component<OscilloscopeP, OscilloscopeS> {

    render(): React.ReactNode {
        return <Group x={this.props.x} y={this.props.y}>
            <Rect x={0} y={0} width={390} height={215} fill={"#cccccc"} cornerRadius={5}/>
            <Rect x={5} y={5} width={210} height={160} fill={"#000000"} cornerRadius={5}/>
            <Rect x={220} y={5} width={80} height={160} fill={"#528AAE"}/>
            <Rect x={300} y={5} width={80} height={160} fill={"#414141"}/>

            <SpiceText x={225} y={10} text="Horizontal" justification="Left" color="#dddddd" fontSize={6}/>
            <OSButton x={225} y={17} width={20} height={12} fill="#666666">
                <SpiceText x={10} y={5} text="Zoom" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={225} y={33} width={20} height={13} fill="#666666">
                <SpiceText x={10} y={6} text="Horizontal" justification="Center" fontSize={6} width={16}/>
            </OSButton>
            <OSButton x={225} y={49} width={20} height={13} fill="#666666">
                <SpiceText x={9} y={6} text="Aquisition" justification="Center" fontSize={6} width={16}/>
            </OSButton>

            <SpiceText x={268} y={13.5} text="Position" justification="Center" fontSize={6} color="white"/>
            <PSknob minAng={-60} maxAng={240} initAng={240} x={268} y={24} setNum={(val:number)=>{}} radius={8} strokeWidth={1.5}/>
            <SpiceText x={268} y={41.5} text="Scale" justification="Center" fontSize={6} color="white"/>
            <PSknob minAng={-60} maxAng={240} initAng={240} x={268} y={54} setNum={(val:number)=>{}} radius={10} strokeWidth={1.5}/>


            <Rect x={225} y={70} width={60} height={2} fill="#dddddd"></Rect>
            <SpiceText x={225} y={79} text="Vertical" justification="Left" color="#dddddd" fontSize={6}/>


            <OSButton x={225} y={85} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Ch1" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={225} y={101} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Ch2" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={225} y={117} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Ch3" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={225} y={133} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Ch4" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={225} y={149} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Logic" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={250} y={149} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Ref" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={275} y={149} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={5} text="Math" justification="Center" fontSize={6}/>
            </OSButton>


            <SpiceText x={305} y={10} text="Trigger" justification="Left" color="#dddddd" fontSize={6}/>
            <OSButton x={305} y={17} width={20} height={12} fill="#666666">
                <SpiceText x={10} y={5} text="Trigger" justification="Center" fontSize={6}/>
            </OSButton>
            <OSButton x={305} y={33} width={20} height={13} fill="#666666">
                <SpiceText x={10} y={5} text="Source" justification="Center" fontSize={6} />
            </OSButton>
            <OSButton x={305} y={49} width={20} height={13} fill="#666666">
                <SpiceText x={9} y={6} text="Auto Norm" justification="Center" fontSize={6} width={16}/>
            </OSButton>
            <OSButton x={355} y={17} width={20} height={12} fill="#666666">
                <SpiceText x={8} y={5} text="Run Stop" justification="Center" fontSize={6} width={16}/>
            </OSButton>
            <OSButton x={355} y={33} width={20} height={13} fill="#666666">
                <SpiceText x={10} y={5} text="Single" justification="Center" fontSize={6} />
            </OSButton>
            <OSButton x={355}y={49} width={20} height={13} fill="#666666">
                <SpiceText x={9} y={6} text="Force Trigger" justification="Center" fontSize={6} width={18}/>
            </OSButton>

            <Rect x={305} y={103} width={60} height={2} fill="#dddddd"></Rect>
            <SpiceText x={305} y={112} text="Analysis" justification="Left" color="#dddddd" fontSize={6}/>
            
            <OSButton x={305} y={117} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="Cursor" justification="Center" fontSize={5}/>
            </OSButton>
            <OSButton x={305} y={133} width={20} height={12} fill="#cccccc">
                <SpiceText x={7} y={6} text="Quick Meas" justification="Center" fontSize={5} width={18}/>
            </OSButton>
            <OSButton x={305} y={149} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="Protocol" justification="Center" fontSize={5}/>
            </OSButton>
            <OSButton x={330} y={117} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="Meas" justification="Center" fontSize={5}/>
            </OSButton>
            <OSButton x={330} y={133} width={20} height={12} fill="#cccccc">
                <SpiceText x={8} y={6} text="Search" justification="Center" fontSize={5} width={18}/>
            </OSButton>
            <OSButton x={330} y={149} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="Gen" justification="Center" fontSize={5}/>
            </OSButton>

            <OSButton x={355} y={117} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="Bright" justification="Center" fontSize={5}/>
            </OSButton>
            <OSButton x={355} y={133} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="FFT" justification="Center" fontSize={5}/>
            </OSButton>
            <OSButton x={355} y={149} width={20} height={12} fill="#cccccc">
                <SpiceText x={10} y={6} text="" justification="Center" fontSize={5}/>
            </OSButton>







            {/* <SpiceText x={268} y={93.5} text="Position" justification="Center" fontSize={6} color="white"/> */}
            <PSknob minAng={-60} maxAng={240} initAng={240} x={268} y={95} setNum={(val:number)=>{}} radius={8} strokeWidth={1.5}/>
            <SpiceText x={268} y={115.5} text="Scale" justification="Center" fontSize={6} color="white"/>
            <PSknob minAng={-60} maxAng={240} initAng={240} x={268} y={130} setNum={(val:number)=>{}} radius={10} strokeWidth={1.5}/>






            <SpiceText x={210} y={180} text="Ch1" justification="Center" color="black" fontSize={8}/>
            <SpiceText x={250} y={180} text="Ch2" justification="Center" color="black" fontSize={8}/>
            <SpiceText x={290} y={180} text="Ch3" justification="Center" color="black" fontSize={8}/>
            <SpiceText x={330} y={180} text="Ch4" justification="Center" color="black" fontSize={8}/>
        </Group>
    }

}