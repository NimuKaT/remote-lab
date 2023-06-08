import { Box } from "@mui/material";
import axios from "axios";
import React from "react";

type OscilloscopeFrameP = {
    isActive: boolean
}
type OscilloscopeFrameS = {
    oscilloAddr: string,
    width: number,
    height: number
}


export default class OscilloscopeFrame extends React.Component<OscilloscopeFrameP, OscilloscopeFrameS> {
    constructor(P: OscilloscopeFrameP, S: OscilloscopeFrameS) {
        super(P,S);
        this.state = {
            oscilloAddr: "",
            width: 1280,
            height: 520
        }
        axios.get("/api/oscilloscope").then((response) => {
            console.log('got request')
                this.setState({
                    oscilloAddr: response.data
                })
        })
        window.addEventListener('resize', this.updateSize.bind(this), true)
    }

    updateSize() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight - 200
        })
    }

    componentDidMount(): void {
        this.updateSize()
    }

    render(): React.ReactNode {
        return <div id="Oscilloscope-Container">
            {this.state.oscilloAddr !== "" && this.props.isActive ? <iframe src={this.state.oscilloAddr} sandbox="allow-same-origin allow-scripts"
                width={this.state.width} height={this.state.height}
            />:""}
        </div>
    }
}