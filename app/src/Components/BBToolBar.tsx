import { PanTool, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Button, Box, Typography, Stack } from "@mui/material";

import ContentCutIcon from '@mui/icons-material/ContentCut'

// import { IconButton } from "material-ui";
import React from "react";

type BBToolBarP = {}
type BBToolBarS = {}

export default class BBToolBar extends React.Component<BBToolBarP, BBToolBarS> {
    render(): React.ReactNode {
        return <Box className="BBToolBar" sx={{minHeight: 60, backgroundColor: "#b7b7b7", alignContent: 'left', display: 'flex'}}>
            <Box sx={{flexGrow: 1, xs: 'none', md:"flex"}}>
                <Stack direction='row' justifyContent='center' alignItems='center' spacing={1}>
                <Box>
                    <Button variant="outlined"><Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                        <PanTool sx={{flexGrow: 1}}/>
                    <Typography>Pan tool</Typography>
                    </Stack>
                    </Button>
                </Box>

                <Box>
                    <Button variant="outlined"><Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                        <ContentCutIcon sx={{flexGrow: 1}}/>
                    <Typography>Delete</Typography>
                    </Stack>
                    </Button>
                </Box>
                <Box>
                    <Button variant="outlined"><Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                        <ZoomIn sx={{flexGrow: 1}}/>
                    <Typography>Zoom in</Typography>
                    </Stack>
                    </Button>
                </Box>
                <Box>
<Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                    <Button variant="outlined">
                        <ZoomOut sx={{flexGrow: 1}}/>
                    </Button>
                    <Typography>Zoom out</Typography>
                    </Stack>
                </Box>
                </Stack>

            </Box>
        </Box>
    }
}