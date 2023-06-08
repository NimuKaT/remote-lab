import { CropFree, Delete, HighlightAlt, Memory, PanTool, PlayArrow, Stop, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Button, Box, Typography, Stack, SvgIcon } from "@mui/material";

// import { IconButton } from "material-ui";
import React from "react";

type BBToolBarP = {
    activeTool: string,
    simState: string,
    setTool: (toolName: string) => any
}
type BBToolBarS = {}

export default class BBToolBar extends React.Component<BBToolBarP, BBToolBarS> {
    render(): React.ReactNode {
        return <Box className="BBToolBar" sx={{minHeight: 60, backgroundColor: "#b7b7b7", alignContent: 'left', display: 'flex'}}>
            <Box sx={{flexGrow: 1, xs: 'none', md:"flex", my: 1}}>
                <Stack direction='row' justifyContent='center' alignItems='center' spacing={3}>
                <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "Pan"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "Pan")}
                    >
                        <PanTool sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Pan</Typography>
                    <Typography fontSize={12}>Esc</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "Select"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "Select")}
                    >
                        <HighlightAlt sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Select</Typography>
                    <Typography fontSize={12}>S</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant="outlined" disabled>
                        <PanTool sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Move</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "Delete"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "Delete")}
                    >
                        <Delete sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Delete</Typography>
                    </Stack>
                </Box>
                </Stack>
                <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "Wire"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "Wire")}
                    >
                        {/* <ZoomOut sx={{flexGrow: 1}}/> */}
                        <SvgIcon>
                            <path d="M10 0 h4v24h-4 Z"/>
                        </SvgIcon>
                    </Button>
                    <Typography>Wire</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "Resistor"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "Resistor")}
                    >
                        <SvgIcon>
                            <path d="M0 11 v2h24v-2 Z"/>
                            <path d="M5 12 v-5h14v10h-14 Z"/>
                        </SvgIcon>
                    </Button>
                    <Typography>Resistor</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "Capacitor"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "Capacitor")}
                    >
                        {/* <ZoomOut sx={{flexGrow: 1}}/> */}
                        <SvgIcon>
                            <path d="M0 11 v2h10v-2 Z"/>
                            <path d="M14 11 v2h10v-2 Z"/>
                            <path d="M10 0 h-2v24h2 Z"/>
                            <path d="M16 0 h-2v24h2 Z"/>
                        </SvgIcon>
                    </Button>
                    <Typography>Capacitor</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.activeTool === "IC"? 'contained' : 'outlined'}
                        onClick={this.props.setTool.bind(null, "IC")}
                    >
                        <Memory sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>IC</Typography>
                    </Stack>
                </Box>
                </Stack>
                <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant="outlined"
                        onClick={this.props.setTool.bind(null, "ZoomIn")}
                    >
                        <ZoomIn sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Zoom in</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant="outlined"
                        onClick={this.props.setTool.bind(null, "ZoomOut")}
                    >
                        <ZoomOut sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Zoom out</Typography>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant="outlined"
                        onClick={this.props.setTool.bind(null, "ResetZoom")}
                    >
                        <CropFree sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Reset Zoom</Typography>
                    </Stack>
                </Box>
                </Stack>
                <Box>
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant={this.props.simState === "Running"? 'contained' : 'outlined'}
                        onClick={this.props.simState === "Running"? this.props.setTool.bind(null, "Stop"): this.props.setTool.bind(null, "Simulate")}
                    >
                        {this.props.simState === "Running"? 
                            <Stop sx={{flexGrow: 1}}/>
                        :
                            <PlayArrow sx={{flexGrow: 1}}/>
                        }
                    </Button>
                    <Typography>Simulate</Typography>
                    </Stack>
                </Box>
                </Stack>

            </Box>
        </Box>
    }
}