import React from "react";
import { Circle } from "react-konva";

type PSPowerButtonP = {
    x: number,
    y: number,
}
type PSPowerButtonS = {
    on: boolean
}

export default class PSPowerButton extends React.Component<PSPowerButtonP, PSPowerButtonS> {
    constructor(P: PSPowerButtonP, S: PSPowerButtonS) {
        super(P,S)
        this.state = {
            on: false
        }
    }

    onButtonPress() {
        this.setState({
            on: !this.state.on
        })

    }

    render(): React.ReactNode {
        return <>
            <Circle x={this.props.x} y={this.props.y} fill={this.state.on? "#11cc12": "#226611"} radius={3}/>
            <Circle x={this.props.x} y={this.props.y+12} fill={this.state.on? "#2c2c2c" : "#444444"} radius={5} onClick={this.onButtonPress.bind(this)}/>
            <Circle x={this.props.x} y={this.props.y+ (this.state.on? 11: 10)} fill="#999999" radius={5} onClick={this.onButtonPress.bind(this)}/>
        </>
    }

}