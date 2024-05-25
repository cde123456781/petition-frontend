import axios from "axios";
import React, { SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Button, Container, CssBaseline, Dialog, DialogTitle, Grid, IconButton, InputAdornment, InputLabel, Paper, TextField } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { userStore } from "../store/userStore";
import { VariantType, enqueueSnackbar } from "notistack";
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
    paddingRight:"1%",
    paddingBottom:"17%"


}

const profileStyle: CSS.Properties = {
    width: "25%",
    height: "25%",
    borderRadius:"5%", 
    minHeight:"100px",
    minWidth:"100px",
    maxWidth:"100px",
    maxHeight:"100px",
    display:"absolute"

}


const Profile = () => {
    const isLoggedIn = userStore((state) => (state.isLoggedIn));
    const userId = userStore((state) => (state.userId));
    const token = userStore((state) => (state.token));

    const logout = userStore((state) => (state.logout));

    const name = userStore((state) => (state.name));
    const setName = userStore((state) => (state.setName));
    const [email, setEmail] = React.useState("");

    const [imageFile, setImageFile] = React.useState<File>();


    const [openImageDialog, setOpenImageDialog] = React.useState(false);
    const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
    const [openPasswordDialog, setOpenPasswordDialog] = React.useState(false);

    const addDefaultImg = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = process.env.PUBLIC_URL + '/logo192.png';
     }


     const headers = {'X-Authorization': token}


        

      const getNameFromId = () => {
        axios.get('http://localhost:4941/api/v1/users/' + userId, {headers: headers})
                  .then((response) => {
                  setName(response.data.firstName + " " + response.data.lastName);
                  setEmail(response.data.email);
              }, (error) => {
                  console.log(error);
              })
      }


    React.useEffect(() => {
        getNameFromId()
      }, [name])
    
    const handleClose = () => {
        setOpenImageDialog(false);
        setOpenDetailDialog(false);
        setOpenPasswordDialog(false);
      }


    const handleImageClick = () => {
        setOpenImageDialog(true);
    }

    const handleDetailClick = () => {
        setOpenDetailDialog(true);
    }

    const handlePasswordClick = () => {
        setOpenPasswordDialog(true);
    }


    const handleChangeDetails = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const firstName = data.get("firstName");
        const lastName = data.get("lastName");
        const email = data.get("email");
        const params: {[k: string]: any} = {};


        if (firstName !== "") {
            params["firstName"] = firstName;
        }

        if (lastName !== "") {
            params["lastName"] = lastName;
        }

        if (email !== "" ) {
            params["email"] = email;
        }

        if (email !== "" || lastName !== "" || firstName !== "") {
            axios.patch("http://localhost:4941/api/v1/users/" + userId , params, {headers: headers} )
                    .then((response) => {
                    const temp = (variant: VariantType) => {
                        enqueueSnackbar('Successfully changed details ', {variant});
                    }
                    temp("success");
                    getNameFromId();
                    handleClose();



                
                }, (error) => {
                    if (error.response.status === 403) {
                        enqueueSnackbar("Email is already in use");
                    } else {
                        enqueueSnackbar("Bad request");

                    }
                })
        }


    }

    const removeImage = () => {
        axios.delete("http://localhost:4941/api/v1/users/" + userId + "/image" , {headers: headers} )
        .then((response) => {

            enqueueSnackbar("Image has been deleted");

        }, (error) => {
            enqueueSnackbar("You have no image to remove");
        }
    )}


    const handlePasswordChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const newPassword = data.get("newPassword") as string;
        const currentPassword = data.get("oldPassword");

        const params: {[k: string]: any} = {};
        params["password"] = newPassword;
        params["currentPassword"] = currentPassword;
        if (newPassword.length >= 6 && newPassword.length <= 64) {
            axios.patch("http://localhost:4941/api/v1/users/" + userId , params, {headers: headers} )
                    .then((response) => {
                    const temp = (variant: VariantType) => {
                        enqueueSnackbar('Successfully changed password', {variant});
                    }
                    temp("success");
                    handleClose();
                
                }, (error) => {
                    if (error.response.status === 403) {
                        enqueueSnackbar("Password cannot be the same as the old password");
                    } else if (error.response.status === 401) {
                        enqueueSnackbar("Invalid current password");
                    } else {
                        enqueueSnackbar("Bad Request");
                    }
                })

        }

        



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
                    enqueueSnackbar("Successfully changed image!");
                    handleClose();

            }, (error) => {
                console.log(error.toString())
                enqueueSnackbar("Error uploading file!");
            })
             
        } else {
            enqueueSnackbar("No image was uploaded");
        }
    }
    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
    
        if (!fileList) return;
        
        setImageFile(fileList[0]);
      };


    if (isLoggedIn && email !== undefined && email !== "") {
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


            <h1>My Profile</h1>
                <Box  sx={{ mt: 3 }}>
                <div style={{font: "Roboto", fontSize: "1rem", display:"inline-block", margin: "auto", marginTop:"auto", marginBottom:"auto", verticalAlign:"top", width:"80%", height:"20%", justifyContent:"center", alignItems:"center"}}>
                <div style={{display:"block", overflow:"hidden", whiteSpace:"nowrap", textOverflow: "ellipsis", width:"calc(100%)"}}>
                        <img style={profileStyle} src={"http://localhost:4941/api/v1/users/" + userId + "/image"} onError={addDefaultImg}/>
                        <hr></hr>
                    </div>
                    <p>Name: {name}</p>
                    <p>Email: {email}</p>
                </div>
                
                <div style={{display:"block", width:"calc(100%)"}}>
                        <Button variant="contained" onClick={handleImageClick}>Change Image</Button>
                        <Button variant="contained" style={{marginLeft:"1%"}} onClick={handleDetailClick}>Change Details</Button> 
                        <Button variant="contained" style={{marginLeft:"1%"}} onClick={handlePasswordClick}>Change Password</Button>

                    </div>


                    <Dialog open={openImageDialog} onClose={handleClose} >
                        <Paper style={{alignItems:"center"}} component="form" onSubmit={uploadImage}>
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Edit Image</DialogTitle>
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
                            <Button style={{width: "33%"}} onClick={handleClose}>Close</Button>

                            <Button style={{width: "33%"}} onClick={removeImage}>Remove</Button>
                            <Button style={{width: "33%"}} type="submit">Replace</Button>
                        </Paper>
                    </Dialog>


                    <Dialog open={openDetailDialog} onClose={handleClose} >
                        <Paper style={{alignItems:"center"}} component="form" onSubmit={handleChangeDetails}>
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Edit Details</DialogTitle>

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>First Name</InputLabel>
                            <TextField name="firstName" style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"
                        inputProps={{
                            maxLength: 64
                        }}
                    />

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Last Name</InputLabel>
                    <TextField name="lastName" style={{paddingLeft:"5%", paddingRight:"5%"}}
                            fullWidth
                            type="text"
                            inputProps={{
                                maxLength: 64
                            }}
                        />

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Email</InputLabel>
                        <TextField name="email" style={{paddingLeft:"5%", paddingRight:"5%"}}
                            fullWidth
                            type="email"
                            inputProps={{
                                maxLength: 256
                            }}
                        />

                            <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>
                            <Button style={{width: "50%"}} type="submit">Update</Button>
                        </Paper>
                    </Dialog>

                    <Dialog open={openPasswordDialog} onClose={handleClose} >
                        <Paper style={{alignItems:"center"}} component="form" onSubmit={handlePasswordChange}>
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Change Password</DialogTitle>

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>New Password</InputLabel>
                    <TextField name="newPassword" style={{paddingLeft:"5%", paddingRight:"5%"}}
                            fullWidth
                            type="password"
                            inputProps={{
                                maxLength: 64,
                                minLength: 6
                            }}
                        />

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Old Password</InputLabel>
                        <TextField name="oldPassword" style={{paddingLeft:"5%", paddingRight:"5%"}}
                            fullWidth
                            type="password"
                            inputProps={{
                                maxLength: 64,
                                minLength: 6
                            }}
                        />

                            <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>
                            <Button style={{width: "50%"}} type="submit">Change Password</Button>
                        </Paper>
                    </Dialog>
                </Box>
            </Box>
            </Paper>
            </Container>

        );
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


            <h1>Unauthorised</h1>
                <Box  sx={{ mt: 3 }}>
                
                </Box>
            </Box>
            </Paper>
            </Container>

        );
    }
}
export default Profile;