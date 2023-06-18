import { KonvaEventObject } from "konva/lib/Node"
import { Vector2d } from "konva/lib/types"
import React from "react"
import { Circle, Group, Rect } from "react-konva"

type PSknobP = {
    minAng: number,
    maxAng: number,
    initAng?: number
    x: number,
    y: number,
    setNum: (val: number) => void,
    radius?: number
    strokeWidth?: number,
}

type PSknobS = {
    currAng: number
    isMouseDown: boolean
    inKnob: boolean
    hasMoved: boolean
    refPos: Vector2d
}


export default class PSknob extends React.Component<PSknobP, PSknobS> {
    constructor(P: PSknobP, S: PSknobS) {
        super(P, S)
        this.state = {
            currAng: this.props.initAng ? this.props.initAng : 0,
            isMouseDown: false,
            inKnob: false,
            hasMoved: false,
            refPos: {x:0,y:0}
        }
        let ele = document.getElementById("BBWindow")
        if (ele) {
            ele.addEventListener('wheel', this.onScroll.bind(this))
        }
    }

    onClick(evt: KonvaEventObject<MouseEvent>) {
        evt.cancelBubble = true
        this.setState({isMouseDown: true, hasMoved: false, refPos: evt.target.getRelativePointerPosition()})
        // console.log(evt.target.getRelativePointerPosition())
    }
    
    onMouseMove(evt: KonvaEventObject<MouseEvent>) {
        evt.cancelBubble = true
        if (this.state.isMouseDown) {
            let pos = evt.currentTarget.getRelativePointerPosition()
            let x = pos.x ; // - this.state.refPos.x
            let y = - pos.y; // this.state.refPos.y 
            let angle = 180 * Math.atan(y/x) / Math.PI;
            if (x < 0) {
                angle = angle + 180
            }
            // console.log(pos);
            if (angle < this.props.minAng) {
                angle = this.props.minAng
            }
            if (angle > this.props.maxAng) {
                angle = this.props.maxAng
            }
            
            // console.log(angle)
            this.props.setNum(1-(this.state.currAng-this.props.minAng) / (this.props.maxAng - this.props.minAng))
            this.setState({currAng: angle})
        }
    }

    onScroll(evt: globalThis.WheelEvent) {
        if (this.state.inKnob) {
            let angle = this.state.currAng + (this.props.maxAng - this.props.minAng) / 10000 * evt.deltaY;
            if (angle < this.props.minAng) {
                angle = this.props.minAng;
            }
            if (angle > this.props.maxAng) {
                angle = this.props.maxAng;
            }
            this.props.setNum(1-(this.state.currAng-this.props.minAng) / (this.props.maxAng - this.props.minAng))
            this.setState({
                currAng: angle
            })
            evt.stopImmediatePropagation()
        }
    }

    onMouseUp(evt: KonvaEventObject<MouseEvent>) {
        evt.cancelBubble = true
        this.setState({
            isMouseDown: false
        })
    }

    onMouseEnter(evt: KonvaEventObject<MouseEvent>) {
        this.setState({inKnob: true})
    }

    onMouseLeave(evt: KonvaEventObject<MouseEvent>) {
        this.setState({
            isMouseDown: false,
            inKnob: false
        })
    }

    render(): React.ReactNode {
        return  <Group x={this.props.x} y={this.props.y}
            onMouseDown={this.onClick.bind(this)}
            onMouseMove={this.onMouseMove.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseEnter={this.onMouseEnter.bind(this)}
            onMouseLeave={this.onMouseLeave.bind(this)}
            >
            <Circle
                radius={this.props.radius? this.props.radius:20}
                stroke={'grey'}
                strokeWidth={0.2}
                fill="#aaaaaa"
            />
            <Rect x={0} y={0} width={this.props.radius? this.props.radius : 20}
                height={this.props.strokeWidth? this.props.strokeWidth : 4}
                stroke={'black'} strokeWidth={0.2}
                fill="black"
                rotation={-this.state.currAng}
                offset={{x:0, y:2}}
            />
        </Group>
    }
}