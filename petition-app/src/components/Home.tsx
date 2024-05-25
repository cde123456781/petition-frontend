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
    paddingBottom:"1%"


}

const imageStyle: CSS.Properties = {
    padding: "2%",
    margin: "auto",
    display: "static",
    width: "90%",
    height: "90%",
    borderRadius: "5%",
    objectFit: "cover",
    zIndex:"5"



}


const Home = () => {
    const isLoggedIn = userStore((state) => (state.isLoggedIn));
    const userId = userStore((state) => (state.userId));
    const token = userStore((state) => (state.token));
    
    

    return (

        <Container component="main" style={{margin:"1% auto"}}>
            <Paper style={petitionStyle} >


            {/* Free to use without credit under the pixabay content license (https://pixabay.com/photos/volunteer-pollution-bottle-plastic-7788809/) */}
            <img src={process.env.PUBLIC_URL + "/volunteer.jpg"} style={imageStyle}/>
            <h1 style={{position:"absolute", zIndex:"9", textAlign:"center",   top: "75%",
  left: "50%",
  transform: "translate(-50%, -50%)"}}>Welcome to NotPatreon! Explore and support petitions that matter!</h1>


        </Paper>
        </Container>

    );
    
}
export default Home;