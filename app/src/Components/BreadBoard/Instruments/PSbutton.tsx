import { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Group, Rect } from "react-konva";

type PSbuttonP = {
    x: number,
    y: number,
    callback?: (state: boolean) => any
}
type PSbuttonS = {
    buttonDown: boolean,
}

export default class PSbutton extends React.Component<PSbuttonP, PSbuttonS> {

    constructor(P: PSbuttonP, S: PSbuttonS) {
        super(P,S)
        this.state = {
            buttonDown: false
        }
    }

    onClick(evt: KonvaEventObject<MouseEvent>) {
        if (this.props.callback) {
            this.props.callback(!this.state.buttonDown)
        }
        this.setState({
            buttonDown: !this.state.buttonDown
        })
    }

    render(): React.ReactNode {
        return <Group x={this.props.x} y={this.props.y} onClick={this.onClick.bind(this)}>
            {/* Shadow of button */}
            <Rect x={-5} y={0} width={10} height={5} cornerRadius={2} fill={this.state.buttonDown? "#444444" : "#cccccc"}/> 
            <Rect x={-5} y={this.state.buttonDown? -4: -8} width={10} height={this.state.buttonDown? 8: 10} cornerRadius={2} fill="#aaaaaa"/>
            <Rect x={-5} y={this.state.buttonDown? -2: -6} width={10} height={2} fill="black"/>

        </Group>
    }
}