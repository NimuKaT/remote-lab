import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import AppContainer from "./AppContainer";
import { Menu as MenuIcon } from "@mui/icons-material";

interface EditorS {
    schematic: boolean
    breadboard: boolean,
    oscilloscope: boolean
}

export default class Editor extends React.Component<{}, EditorS> {

    constructor(P: any, S: EditorS) {
        super(P, S)
        this.state = {
            schematic: false,
            breadboard: true,
            oscilloscope: false
        }
    }


    setSchematic() {
        this.setState({
            schematic: true,
            breadboard: false,
            oscilloscope: false
        })
    }

    setBreadboard() {
        this.setState({
            schematic: false,
            breadboard: true,
            oscilloscope: false
        })
    }

    setOscilloscope() {
      this.setState({
            schematic: false,
            breadboard: false,
            oscilloscope: true
      })
    }



    render(): React.ReactNode {
        return <>
        <Box>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr:2}}
          >
            <MenuIcon/>  
              
          </IconButton>
          {/* <Menu
            open={true}
            onClick={()=>{}}
          >
                <MenuItem key={"Schematic"} onClick={this.setSchematic.bind(this)}>
                  <Typography textAlign='center'>Schematic</Typography>
                </MenuItem>
                <MenuItem key={"BreadBoard"} onClick={this.setBreadboard.bind(this)}>
                  <Typography textAlign='center'>BreadBoard</Typography>
                </MenuItem>
                

          </Menu> */}
          <Typography variant='h6' component="div" sx={{flexGrow: 1, alignContent: "left", display: 'flex'}}>
            Editor
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {/* <Button
                key='schematic'
                onClick={this.setSchematic.bind(this)}
                sx={{my: 2, color: 'white', display: 'block'}}
                disabled={this.state.schematic}
            >Schematic</Button> */}
            <Button
                key='breadboard'
                onClick={this.setBreadboard.bind(this)}
                sx={{my: 2, color: 'white', display: 'block'}}
                disabled={this.state.breadboard}
            >Breadboard</Button>
            <Button
                key='Oscilloscope'
                onClick={this.setOscilloscope.bind(this)}
                sx={{my: 2, color: 'white', display: 'block'}}
                disabled={this.state.oscilloscope}
            >Oscilloscope</Button>

          </Box>
          {/* <Button color='inherit'>Login</Button> */}
        </Toolbar>
      </AppBar>
      </Box>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferw
          rer"
        >
          Learn React
        </a>
      </header> */}

      <AppContainer schematic={this.state.schematic} breadboard={this.state.breadboard} oscilloscope={this.state.oscilloscope}></AppContainer>
      </>       
    }
}