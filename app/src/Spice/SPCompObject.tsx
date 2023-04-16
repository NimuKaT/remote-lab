import { Box, Modal } from "@mui/material";
import { Group as group } from "konva/lib/Group";
import { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import ReactDOM from "react-dom";
import { Arc, Circle, Group, Line, Rect } from "react-konva";
import { attributeMap } from "./attributeMap";
import { CollisionBox } from "./CollisionBox";
import { compList } from "./compList";
import SPNode from "./Node";
import NodeObject from "./NodeObject";
import { SPComponent } from "./SPComponent";
import SpiceProperty from "./SpiceProperty";
import SpiceText from "./SpiceText";

interface SPCompObjectP {
    component: SPComponent;
}

interface SPCompObjectS {
    konvaNodes: Array<JSX.Element>;
    spiceNodes: Array<JSX.Element>;
    isSelected: boolean;
    isFollowing: boolean;
    collisionBox: CollisionBox;
    stroke: string
    dialogOpen: boolean
}

export default class SPCompObject extends React.Component<SPCompObjectP, SPCompObjectS> {
    pinNum: number = 0;
    ref: React.RefObject<group>;
    shapeNum: number = 0;
    cmds: Array<string> = [];
    dialogBox: Node = document.createElement('div');

    constructor(prop: SPCompObjectP) {
        super(prop);
        this.ref = React.createRef<group>();
        this.state = {
            konvaNodes: [],
            spiceNodes: [],
            isSelected: false,
            isFollowing: false,
            collisionBox: {x1: 0, y1: 0, x2: 0, y2: 0},
            stroke: 'black',
            dialogOpen: false
        }
    }

    setSelected(selected: boolean) {
        this.setState({isSelected: selected,
            stroke: selected? "blue" : "black"});
    }

    setFollowing(following: boolean) {
        this.setState({isFollowing: following})
    }

    updateCollisonBox() {
        if (this.ref.current) {
            let pos = this.ref.current.getPosition();
            let width = this.ref.current.width();
            let height = this.ref.current.height();
            let rect = this.ref.current.getClientRect({skipTransform: true});
            // pos.x = rect.x;
            // pos.y = rect.y;
            width = rect.width;
            height = rect.height
            // width = 32;
            // height = 96;
            // console.log(this.ref.current.getClientRect({skipTransform: true}))
            this.setState({collisionBox: {
                x1: pos.x,
                y1: pos.y,
                x2: pos.x+width,
                y2: pos.y+height
            }})
        }
 
    }

    getCollisionBox() {
        this.updateCollisonBox()
        return this.state.collisionBox;
    }

    componentDidMount(): void {
        this.props.component.setRef(this);
        this.getSymbol();
        if (this.ref.current) {
            let pos = this.ref.current.getPosition();
            let width = this.ref.current.width();
            let height = this.ref.current.height();
            let rect = this.ref.current.getClientRect({skipTransform: true});
            width = rect.width;
            height = rect.height
            // width = 32;
            // height = 96;
            // console.log(this.ref.current.getClientRect({skipTransform: true}))
            this.setState({collisionBox: {
                x1: pos.x,
                y1: pos.y,
                x2: pos.x+width,
                y2: pos.y+height
            }})
        }
    }

    componentDidUpdate(prevProps: Readonly<SPCompObjectP>, prevState: Readonly<SPCompObjectS>, snapshot?: any): void {
        // this.updateCollisonBox();
    }

    getElements(cmd: string) {
        let values, type: string;
        let x1, x2, y1, y2, x3, y3, x4, y4: number;
        let element: JSX.Element;
        values = cmd.split(' ');
        type = values[0];

        if (type.match('LINE')) {
            // console.log('drawing: ' + cmd)
            x1 = parseInt(values[2]);
            y1 = parseInt(values[3]);
            x2 = parseInt(values[4]);
            y2 = parseInt(values[5]);
            element = <Line
                key={this.shapeNum}
                x={0}
                y={0}
                points={[x1, y1, x2, y2]}
                stroke={this.state.stroke}
                strokeWidth={0.5}
            />;
        } else if (type.match('RECTANGLE')) {
            x1 = parseInt(values[2]);
            y1 = parseInt(values[3]);
            x2 = parseInt(values[4]);
            y2 = parseInt(values[5]);
            let temp = 0;
            if (x2 < x1) {
                temp = x1;
                x1 = x2;
                x2 = temp
            }
            if (y2 < y1) {
                temp = y1;
                y1 = y2;
                y2 = temp
            }
            element = <Rect
                key={this.shapeNum}
                x={x1}
                y={y1}
                width={Math.abs(x1-x2)}
                height={Math.abs(y1-y2)}
                stroke={this.state.stroke}
                strokeWidth={0.5}
            />;
        } else if (type.match('CIRCLE')) {
            x1 = parseInt(values[2]);
            y1 = parseInt(values[3]);
            x2 = parseInt(values[4]);
            y2 = parseInt(values[5]);
            element = <Circle 
                key={this.shapeNum}
                x={(x1+x2)/2}
                y={(y1+y2)/2}
                radius={Math.abs((x1-x2))/2}
                stroke={'black'}
                strokeWidth={0.5}/>
        } else if (type.match('ARC')) {
            x1 = parseInt(values[2]);
            y1 = parseInt(values[3]);
            x2 = parseInt(values[4]);
            y2 = parseInt(values[5]);
            x3 = parseInt(values[6]);
            y3 = parseInt(values[7]);
            x4 = parseInt(values[8]);
            y4 = parseInt(values[9]);
            // console.log(x1, y1, x2, y2, x3, y3, x4, y4)
            let radius = Math.abs(x1-x2)/2;
            let x = (x1 + x2)/2
            let y = (y1 + y2)/2
            let angle = Math.atan2((y3-y), (x3-x))/Math.PI*180;
            let rot = -Math.atan2((y4-y), (x4-x))/Math.PI*180 
            // console.log(angle);
            // console.log(rot)
            element = <Arc
                key={this.shapeNum}
                x={x} 
                y={y} 
                innerRadius={radius}
                outerRadius={radius}
                angle={Math.abs(angle+rot)}
                clockwise={false}
                rotation={-rot}
                stroke={'black'}
                strokeWidth={0.2}
            />;
        } else if (type.match('TEXT')) {
            x1 = parseInt(values[1]);
            y1 = parseInt(values[2]);
            console.log("Rendering text");
            let justification = values[3];
            let content = values.slice(5).join(' ');
            // For Coments in Spice File
            // content = content.slice(1, content.length);


            element = <SpiceText
                key={this.shapeNum}
                x={x1}
                y={y1}
                justification={justification}
                text={content}
                orientation={""}
                />
        } else if (type.match("WINDOW")) {
            let index: number = parseInt(values[1]);
            x1 = parseInt(values[2]);
            y1 = parseInt(values[3]);
            let justification: string = values[4];

            let text = this.props.component.getAttribute(attributeMap.get(index));
            if (!text) {
                text = "";
            }
            element = <SpiceText
                key={attributeMap.get(index)}
                x={x1}
                y={y1}
                justification={justification}
                text={text}
                orientation={""}
            />
        }
        // else if (type.match('pin')) {
        //     x1 = parseInt(values[1]);
        //     y1 = parseInt(values[2]);
            
        // } 
        else {
            console.log("Could not draw: " + cmd);
            element = <></>;
        }
        this.shapeNum = this.shapeNum + 1;
        return element;

    }

    getSymbol() {
        let name: string = this.props.component.getName();
        if (compList.has(name)) {
            let commands: string = compList.get(name);
            this.cmds = commands.split('\n');
            let shapes: Array<JSX.Element> = [];
            let nodes: Array<JSX.Element> = [];
            this.cmds.forEach((cmd: string) => {shapes.push(this.getElements(cmd))});
            this.props.component.getNodes().forEach((node: SPNode) => {
                
                nodes.push(<NodeObject key={node.id} node={node} initialCoord={node.getInitPos()}/>)
            })
            this.setState({konvaNodes: shapes, spiceNodes: nodes});
        }

    }

    onDragEnd() {
        this.props.component.getNodes().forEach((node: SPNode) => {
            node.updateConnection();
        })
        this.updateCollisonBox();
        this.forceUpdate();
    }

    changeAttribute(attr: string, value: string) {
        // this.ref.current?.getChildren((item) => {
        //     item.
        // })
    }

    closeDialog() {
        this.setState({
            dialogOpen: false
        })
        document.body.removeChild(this.dialogBox);
    }

    onClick(evt: KonvaEventObject<MouseEvent>) {
        console.log("Clicked with: " + evt.evt.button);
        evt.evt.preventDefault();
        evt.evt.stopImmediatePropagation();
        if (evt.evt.button === 2) {
            // Create property menu
            this.setState({
                dialogOpen: true
            })
            let ele = document.createElement('div');
            ele.id = 'SpiceProperty'
            this.dialogBox = ele;
            document.body.appendChild(ele);
            ReactDOM.render(<SpiceProperty comp={this.props.component} open={this.state.dialogOpen} closeFunc={this.closeDialog.bind(this)}/>, document.getElementById('SpiceProperty'));
            // let d = <SpiceProperty comp={this.props.component} open={this.state.dialogOpen} closeFunc={this.closeDialog.bind(this)}/>
            // document.body.appendChild(d);
        }
    }

    render() {
        // console.log(this.props.component.getNodes())
        // this.getSymbol();

        let konvanodes: Array<React.ReactElement> = [];
        this.cmds.forEach((value, index) => {
            konvanodes.push(this.getElements(value));
        })
        return <Group
                x={0}
                y={0} 
                opacity={this.state.isSelected ? 0.5 : 1}
                setRotation={this.props.component.rotation}
                scaleX={this.props.component.flip ? -1 : 1}
                visible={!this.props.component.deleted}
                onClick={this.onClick.bind(this)}
            >
                <Group ref={this.ref}
                // x={this.props.component.getX()}
                // y={this.props.component.getY()}
                // draggable={true}
                // onDragEnd={this.onDragEnd.bind(this)}
                x={this.props.component.getX()}
                y={this.props.component.getY()}
                >
                    {/* {this.state.konvaNodes} */}
                    {konvanodes}
                    {/* {this.cmds.forEach(element => {
                        return this.getElements(element);
                    })} */}
                    {/* {this.state.spiceNodes} */}
                    {this.props.component.getNodes().map((node: SPNode, index: number) => {
                        return <NodeObject key={node.id} node={node} initialCoord={node.getInitPos()} isSelected={this.state.isSelected}/>
                    })}
                </Group>
{/* ENABLE FOR COLLISION BOX */}
            {/* {this.state.collisionBox ? <Rect x={this.state.collisionBox.x1}
                y={this.state.collisionBox.y1}
                width={(this.state.collisionBox.x2-this.state.collisionBox.x1)}
                height={this.state.collisionBox.y2-this.state.collisionBox.y1}
                stroke={'black'}
                strokeWidth={0.1}/>
            : ''} */}
            </Group>
    }
}