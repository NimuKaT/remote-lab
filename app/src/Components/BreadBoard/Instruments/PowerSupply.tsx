import React from "react"
import { Group, Line, Rect } from "react-konva"
import PSknob from "./PSknob"
import SpiceText from "../../../Spice/SpiceText"
import PSbutton from "./PSbutton"
import PSPowerButton from "./PSPowerButton"

type PowerSupplyP = {
    x: number,
    y: number,
    callback?: (state: PowerSupplyS) => any
}
export type PowerSupplyS = {
    ch1V: number,
    ch1A: number,
    ch2V: number,
    ch2A: number,
    mode1: boolean,
    mode2: boolean,
    pwr: boolean
}

export default class PowerSupply extends React.Component<PowerSupplyP, PowerSupplyS> {
    constructor(P: PowerSupplyP, S: PowerSupplyS) {
        super(P, S)
        this.state = {
            ch1V: 0,
            ch1A: 0,
            ch2V: 0,
            ch2A: 0,
            mode1: false,
            mode2: false,
            pwr: false
        }
    }

    setValue(channel: number, voltage: boolean, value: number) {
        if (channel === 1) {
            if (voltage) {
                this.setState({ch1V: 20*value})
            } else {
                this.setState({ch1A: 2*value})
            }
        } else if (channel === 2) {
            if (voltage) {
                this.setState({ch2V: 20*value})
            } else {
                this.setState({ch2A: 2*value})
            }
        }
    }

    setButton(which: number, state: boolean) {
        switch(which) {
            case 1:
                this.setState({
                    mode1: state
                })
                break;
            case 2:
                this.setState({
                    mode2: state
                })
                break;
            case 3:
                this.setState({
                    pwr: state
                })
                break;
        }

    }



    render(): React.ReactNode {
        if (this.props.callback) {
            this.props.callback(this.state)
        }
        return <Group x={this.props.x} y={this.props.y}>
            <Rect x={0} y={0} width={290} height={165} fill={'grey'} cornerRadius={5}/>
            <Rect x={10} y={10} width={270} height={50} fill={'black'}/>

            <SpiceText x={55} y={38} text={this.state.ch1A.toFixed(1)} justification="Right" color="red" fontSize={20}/>
            <SpiceText x={120} y={38} text={this.state.ch1V.toFixed(1)} justification="Right" color="green" fontSize={20}/>
            <SpiceText x={200} y={38} text={this.state.mode1 && this.state.mode2? this.state.ch1A.toFixed(1) : this.state.ch2A.toFixed(1)} justification="Right" color="red" fontSize={20}/>
            <SpiceText x={265} y={38} text={this.state.mode1? this.state.ch1V.toFixed(1) : this.state.ch2V.toFixed(1)} justification="Right" color="green" fontSize={20}/>
            <PSknob minAng={-60} maxAng={240} x={40} y={98} setNum={this.setValue.bind(this, 1, false)} initAng={240}/>
            <PSknob minAng={-60} maxAng={240} x={105} y={98} setNum={this.setValue.bind(this, 1, true)} initAng={240}/>
            <PSknob minAng={-60} maxAng={240} x={185} y={98} setNum={this.setValue.bind(this, 2, false)} initAng={240}/>
            <PSknob minAng={-60} maxAng={240} x={250} y={98} setNum={this.setValue.bind(this, 2, true)} initAng={240}/>

            <SpiceText x={40} y={20} text="A" justification="Center" color="red" fontSize={14}/>
            <SpiceText x={105} y={20} text="V" justification="Center" color="green" fontSize={14}/>
            <SpiceText x={185} y={20} text="A" justification="Center" color="red" fontSize={14}/>
            <SpiceText x={250} y={20} text="V" justification="Center" color="green" fontSize={14}/>

            <Rect x={20} y={46} width={110} height={12} fill="#aaaaaa" cornerRadius={2}/>
            <SpiceText x={70} y={53} text="ch1" justification="Center" color="black" fontSize={14}/>
            <Rect x={165} y={46} width={110} height={12} fill="#aaaaaa" cornerRadius={2}/>
            <SpiceText x={218} y={53} text="ch2" justification="Center" color="black" fontSize={14}/>

            <Rect x={30} y={120} width={90} height={18} fill="#aaaaaa" cornerRadius={2}/>
            <SpiceText x={50} y={130} text="-" justification="Center" color="black" fontSize={32}/>
            <SpiceText x={98} y={130} text="+" justification="Center" color="red" fontSize={32}/>

            <Rect x={174} y={120} width={90} height={18} fill="#aaaaaa" cornerRadius={2}/>
            <SpiceText x={194} y={130} text="-" justification="Center" color="black" fontSize={32}/>
            <SpiceText x={242} y={130} text="+" justification="Center" color="red" fontSize={32}/>

            <PSbutton x={135} y={90} callback={this.setButton.bind(this, 1)}/>
            <PSbutton x={155} y={90} callback={this.setButton.bind(this, 2)}/>

            <SpiceText x={146} y={110} text="Indep." justification="Center" fontSize={6}/>
            <SpiceText x={145} y={120} text="Series" justification="Center" fontSize={6}/>
            <SpiceText x={145} y={130} text="Parallel" justification="Center" fontSize={6}/>

        {/* Labels */}
            <Rect x={129} y={107} width={5} height={5} fill="#555555"/>
            <Line x={128} y={112} points={[0, 0, 7,0]} stroke={"#555555"} strokeWidth={2}/>
            <Rect x={157} y={107} width={5} height={5} fill="#555555"/>
            <Line x={156} y={112} points={[0, 0, 7,0]} stroke={"#555555"} strokeWidth={2}/>
            <Rect x={157} y={117} width={5} height={5} fill="#555555"/>
            <Line x={128} y={122} points={[0, 0, 7,0]} stroke={"#555555"} strokeWidth={2}/>
            <Line x={156} y={122} points={[0, 0, 7,0]} stroke={"#555555"} strokeWidth={2}/>
            <Line x={129} y={120} points={[0, 0, 5,0]} stroke={"#555555"} strokeWidth={3}/>
            <Line x={128} y={132} points={[0, 0, 7,0]} stroke={"#555555"} strokeWidth={2}/>
            <Line x={129} y={130} points={[0, 0, 5,0]} stroke={"#555555"} strokeWidth={3}/>
            <Line x={156} y={132} points={[0, 0, 7,0]} stroke={"#555555"} strokeWidth={2}/>
            <Line x={157} y={130} points={[0, 0, 5,0]} stroke={"#555555"} strokeWidth={3}/>

        {/* Power button */}

            <PSPowerButton x={15} y={135} callback={this.setButton.bind(this, 3)}/>
            <SpiceText x={15} y={157} text="Output" justification="Center" fontSize={6}/>
        </Group>
    }
}