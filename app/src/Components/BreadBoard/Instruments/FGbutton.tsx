import React, { Children } from "react"
import { Group, Rect } from "react-konva"
import SpiceText from "../../../Spice/SpiceText"

type FGbuttonP = {
    x: number,
    y: number,
    children: string | JSX.Element | Array<JSX.Element>
}
type FGbuttonS = {}

export default class FGbutton extends React.Component<FGbuttonP, FGbuttonS> {

    render(): React.ReactNode {
        return <Group x={this.props.x} y={this.props.y}>
            <Rect x={-24} y={-10} width={48} height={20}  fill={'#dddddd'} cornerRadius={2}/>
            {this.props.children}
        </Group>
    }
}