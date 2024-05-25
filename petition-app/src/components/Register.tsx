import axios, { AxiosError } from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Button, Checkbox, Container, CssBaseline, Dialog, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, OutlinedInput, Paper, TextField, ThemeProvider, Typography, createTheme, styled } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {userStore} from "../store/userStore"
import { SnackbarProvider, VariantType, enqueueSnackbar } from "notistack";
import { blue } from "@mui/material/colors";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    paddingRight:"1%"


}




const Register = () => {
    const isLoggedIn = userStore((state) => state.isLoggedIn);
    const login = userStore((state) => state.login);
    const weakLogin = userStore((state) => state.weakLogin);
    const userId = userStore((state) => state.userId);
    const token = userStore((state) => state.token);



    const [isImageUpload, setIsImageUpload] = React.useState(false);
    const [imageFile, setImageFile] = React.useState<File>();

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      axios.post(" http://localhost:4941/api/v1/users/register", {email: data.get("email"), firstName: data.get("firstName"), 
      lastName: data.get("lastName"), password: data.get("password")
      }).then((response) => {
        const displaySuccess = (variant: VariantType) => {
            enqueueSnackbar('Successfully registered', {variant});
        }
        displaySuccess("success");

        axios.post(" http://localhost:4941/api/v1/users/login", {email: data.get("email"), password: data.get("password")})
            .then((response) => {
                weakLogin(response.data.userId, response.data.token);
                setIsImageUpload(true);
                
            });
      }).catch((reason: AxiosError) => {
        if (reason.response!.status === 400) {
            enqueueSnackbar("Invalid Information");
        } else if (reason.response!.status === 403) {
            enqueueSnackbar("Email already in use");
        } else {
            enqueueSnackbar("Server Error");
        }
      })
    };


    const skipImageUpload = () => {

        setIsImageUpload(false);
        window.location.replace("/");
        login(userId, token);
        
    }

    const uploadImage = () => {



        if (imageFile !== undefined) {
            const headers = {
                'X-Authorization': token,
                'Content-Type': imageFile!.type
              }
            const formData = new FormData();
            formData.append("image", imageFile);
            axios.put("http://localhost:4941/api/v1/users/" + userId + "/image", imageFile, {headers: headers})
                .then((response) => {
                    console.log(imageFile);
                    enqueueSnackbar("Success!");
                    setIsImageUpload(false);
                    window.location.replace("/");
                    login(userId, token);

            }, (error) => {
                console.log(error.toString())
                enqueueSnackbar("Error uploading file!");
            })
            
            // .finally(() => {
            //     window.location.replace("/");
            // })    
        } else {
            enqueueSnackbar("Please upload an image");
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
    
        if (!fileList) return;
        
        setImageFile(fileList[0]);
      };




    if (isLoggedIn) {
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


        <h1 style={{paddingBottom:"40%"}}>You are already logged in</h1>
        {/* <Dialog open={isImageUpload}>
                <DialogTitle>Upload an profile image</DialogTitle>

            </Dialog> */}

        </Box>
        </Paper>
        </Container>
        )
        
    } else {
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


            <h1>Register</h1>
            <h5>Sign up today to create your own petitions or support petitions made by the community!</h5>



                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
                </Avatar>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Dialog open={isImageUpload} >
                    <Paper style={{alignItems:"center"}} >
                    <DialogTitle>Upload an profile image</DialogTitle>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        style={{margin:"0 auto", marginBottom:"10%"}}
                        fullWidth
                        >
                        Upload file
                        <input type="file" name="file" style={{display: "none"}} onChange={handleImageChange} accept="image/gif, image/jpeg, image/png"/>
                    </Button>

                    {imageFile ? <div><p>Filename: {imageFile.name}</p>
                    <p>File type: {imageFile.type}</p></div> : <br></br>}

                    <Button style={{width: "50%"}} onClick={skipImageUpload}>Skip</Button>

                    <Button style={{width: "50%"}} onClick={uploadImage}>Submit</Button>
                    </Paper>
                </Dialog>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        inputProps={{
                            maxLength: 64
                        }}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        inputProps={{
                            maxLength: 64
                        }}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputProps={{
                            maxLength: 256
                        }}
                    />
                    </Grid>
                    <Grid item xs={12}>

                            <TextField
                                fullWidth
                                required
                                inputProps = {{
                                    minLength: 6,
                                    maxLength: 64
                                }}
                                InputProps={{
                                    endAdornment:(
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    )
                                }}
                                label="Password"
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="password"
                            />

                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>

                <Link to="/login">
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Already have an account? Login
                </Button>
                </Link>
                </Box>
            </Box>
            </Paper>
            </Container>

        );
    }
  }

export default Register;