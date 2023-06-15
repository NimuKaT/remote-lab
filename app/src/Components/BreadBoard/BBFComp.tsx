import React from "react";
import { Arc, Group, Line, Rect } from "react-konva";
import BBIC from "./BBIC";
import BBNodeObj from "./BBNodeObj";
import SpiceText from "../../Spice/SpiceText";

interface BBFCompP {
    comp: BBIC
}

interface BBFCompS {

}

export default class BBFComp extends React.Component<BBFCompP, BBFCompS> {

    render(): React.ReactNode {
        let sym = this.props.comp.getSymbol();
        let color = this.props.comp.isSelected? "#3324a5": 'black'
        let strokeWidth = this.props.comp.isSelected? 2: 0.4
        return <Group 
            visible={!this.props.comp.isDeleted()}
         x={this.props.comp.getLocalX()} y={this.props.comp.getLocalY()}>
        {sym.lines.map((cmd) => {
            return <Line x={0} y={0} points={cmd.points} stroke={color} strokeWidth={strokeWidth}/>
        })}
        {sym.rects.map((cmd) => {
            return <Rect x={cmd.x} y={cmd.y} width={cmd.w} height={cmd.h} stroke={color} strokeWidth={strokeWidth}/>
        })}
        {sym.arcs.map((cmd) => {
            return <Arc
                x={cmd.x}
                y={cmd.y}
                innerRadius={cmd.r}
                outerRadius={cmd.r}
                angle={cmd.startAng - cmd.endAng}
                clockwise={cmd.clockwise}
                rotation={cmd.startAng}
                stroke={color}
                strokeWidth={strokeWidth}
            />
        })}
        {this.props.comp.getNodes().map((node) => {
            return <BBNodeObj node={node} valid={true}/>
        })}
        <SpiceText x={this.props.comp.pinCount/4*24-12} y={24} orientation="R0" justification="Center" text={this.props.comp.modelName}
         fontSize={12} color={color}/>
        </Group>
    }
}