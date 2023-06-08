import axios from "axios";
import React from "react";

type OscilloscopeFrameP = {
    isActive: boolean
}
type OscilloscopeFrameS = {
    oscilloAddr: string
}


export default class OscilloscopeFrame extends React.Component<OscilloscopeFrameP, OscilloscopeFrameS> {
    constructor(P: OscilloscopeFrameP, S: OscilloscopeFrameS) {
        super(P,S);
        this.state = {
            oscilloAddr: ""
        }
        axios.get("/api/oscilloscope").then((response) => {
            console.log('got request')
                this.setState({
                    oscilloAddr: response.data
                })
        })
    }

    render(): React.ReactNode {
        return <>
            {this.state.oscilloAddr !== "" && this.props.isActive ? <iframe src={this.state.oscilloAddr} sandbox="allow-same-origin allow-scripts"
                width={'100%'} height={"100%"}
            />:""}
        </>
    }
}