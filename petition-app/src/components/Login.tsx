import axios, { AxiosError } from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Button, Container, CssBaseline, Grid, IconButton, InputAdornment, Paper, TextField } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { userStore } from "../store/userStore";
import { SnackbarProvider, VariantType, enqueueSnackbar, useSnackbar } from 'notistack';


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


const Login = () => {
    const isLoggedIn = userStore((state) => state.isLoggedIn);
    const login = userStore((state) => (state.login));
    
    const [showPassword, setShowPassword] = React.useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      // https://seng365.csse.canterbury.ac.nz/api/v1/users/login
      axios.post(" http://localhost:4941/api/v1/users/login", {email: data.get("email"), password: data.get("password")
      }).then((response) => {
        const temp = (variant: VariantType) => {
            enqueueSnackbar('Successfully logged in', {variant});
        }
        temp("success");
        login(response.data.userId, response.data.token);
        window.location.replace("/");
      }).catch((reason: AxiosError) => {
        if (reason.response!.status === 400) {
            enqueueSnackbar("Invalid Information");
        } else if (reason.response!.status === 401) {
            enqueueSnackbar("Invalid email or password");
        } else {
            enqueueSnackbar("Server Error");
        }
      })
    };


    if (isLoggedIn) {
        return (
            <Container component="main" style={{margin:"1% auto"}}>
            <Paper style={{backgroundColor: "white",
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
    paddingRight:"1%",}} >
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


            <h1>Login</h1>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
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
                    Login
                </Button>

                <Link to="/register">
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 0, mb: 10 }}
                >
                    Don't have an account? Register
                </Button>
                </Link>
                </Box>

            </Box>
            </Paper>
            </Container>

        );
    }
  }

export default Login;