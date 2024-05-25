import axios from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Button, Container, CssBaseline, Grid, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { userStore } from "../store/userStore";


const petitionStyle: CSS.Properties = {
    backgroundColor: "white",
    marginTop: "1%",
    transition: "background-color 0.5s, box-shadow 0.5s",
    display: "block",
    border: "3px solid lightGrey",
    borderRadius:"3px",
    height: "auto",
    width:"100%",
    overflow: "hidden",
    minWidth: "900px",
    margin:"0 auto",
    zIndex: "1",
    position:"relative",
    paddingLeft:"1%",
    paddingRight:"1%",
    paddingBottom:"17%"


}

const imageStyle: CSS.Properties = {
    padding: "2%",
    margin: "auto",
    display: "inline-block",
    width: "100%",
    height: "100%",
    borderRadius: "5%",
    objectFit: "cover",



}


const Profile = () => {
    const isLoggedIn = userStore((state) => (state.isLoggedIn));
    const userId = userStore((state) => (state.userId));
    const token = userStore((state) => (state.token));
    
    

    return (

        <Container component="main" style={{margin:"1% auto"}}>
            <Paper style={petitionStyle} >
        <CssBaseline />
        <Box
            sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >


        <h1>Not Found - You shouldn't be here</h1>
            <Box  sx={{ mt: 3 }}>
            {/* Free to use without credit under the pixabay content license (https://pixabay.com/photos/silhouette-ghost-horror-halloween-3777403/) */}
            <img src={process.env.PUBLIC_URL + "/notfound.jpg"} style={imageStyle}/>
            </Box>
        </Box>
        </Paper>
        </Container>

    );
    
}
export default Profile;