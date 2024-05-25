import axios, { AxiosError } from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Button, Container, CssBaseline, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { userStore } from "../store/userStore";
import NotFound from "./NotFound";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VariantType, enqueueSnackbar } from "notistack";

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


const CreatePetition = () => {
    const token = userStore((state) => (state.token));
    const isLoggedIn = userStore((state) => (state.isLoggedIn));
    const [categories, setCategories] = React.useState < Array<Category>> ([]);
    const [supportTiers] = React.useState <Array<supportTierPost>> ([]);

    const [imageFile, setImageFile] = React.useState<File>();

    const [tierTitle, setTierTitle] = React.useState("");
    const [tierDescription, setTierDescription] = React.useState("");
    const [tierCost, setTierCost] = React.useState(0);
    let [numTiers, setNumTiers] = React.useState <Array<number>> ([1]);
    
    React.useEffect(() => (
        getCategories()
    ), []);

    const handleTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTierTitle(e.target.value);
    }

    const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTierDescription(e.target.value);
    }

    const handleCostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTierCost(parseInt(e.target.value, 10));
    }

    const checkAndHandleTier = () => {
        if (tierTitle.length > 0 && tierTitle.length <= 128 ) {
            if (tierDescription.length > 0 && tierDescription.length <= 1024) {
                if (tierCost >= 0) {
                    if (supportTiers.length === 3) {
                        enqueueSnackbar("You have already added 3 tiers");
                    } else {
                        let nameInUse = false;
                        for (let i = 0; i < supportTiers.length; i++ ) {
                            if (supportTiers[i].title === tierTitle) {
                                nameInUse = true;
                            }
                        }
                        if (nameInUse) {
                            enqueueSnackbar("Title is already the name of one of the tiers")
                        } else {
                            supportTiers.push({"title": tierTitle, "description": tierDescription, "cost": tierCost});
                            setTierCost(0);
                            setTierTitle("");
                            setTierDescription("");
                            console.log(supportTiers);
                        }
                    }
                } else {
                    enqueueSnackbar("Tier cost cannot be negative");
                }
            } else {
                enqueueSnackbar("Tier description length not within range")
            }
        } else {
            enqueueSnackbar("Title length not within range");
        }
    }


    const submitPetition = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (imageFile !== undefined) {
            const headers = {
                'X-Authorization': token,
              }
            const data = new FormData(event.currentTarget);
            const title = data.get('title');
            const description = data.get('description');
            const category = data.get('category') as string;

            const params: {[k: string]: any} = {};

            params["title"] = title;
            params["description"] = description;
            params["categoryId"] = parseInt(category, 10);
            params["supportTiers"] = supportTiers;


            axios.post("http://localhost:4941/api/v1/petitions",params , {headers: headers})
            .then((response) => {
                const imageHeaders = {
                    'X-Authorization': token,
                    'Content-Type': imageFile!.type
                }
                axios.put("http://localhost:4941/api/v1/petitions/" + response.data.petitionId + "/image", imageFile, {headers: imageHeaders})
                .then((response) => {
                        const temp = (variant: VariantType) => {
                            enqueueSnackbar('Successfully added petition!', {variant});
                        }
                        temp("success");
                        window.location.replace("/MyPetitions");
            }, (error) => {
                console.log(error.toString())
                enqueueSnackbar("Error uploading file!");
            })
                }).catch((reason: AxiosError) => {
                    console.log(reason);
                    if (reason.response!.status === 400) {
                        console.log(title);
                        enqueueSnackbar("Invalid Information");
                    } else if (reason.response!.status === 403) {
                        enqueueSnackbar("Petition title already exists");
                    } else {
                        enqueueSnackbar("Server Error");
                    }
                })
        } else {
            enqueueSnackbar("Image not attached");
        }


    }

    const getCategories = () => {
        axios.get("http://localhost:4941/api/v1/petitions/categories")
        .then((response) => {

            setCategories(response.data)
        }, (error) => {

        })
    }


    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
    
        if (!fileList) return;
        
        setImageFile(fileList[0]);
      };

    if (isLoggedIn) {
        return (

            <Container component="main" style={{margin:"1% auto"}}>
                <Paper style={petitionStyle} component="form" onSubmit={submitPetition}>
            <CssBaseline />
            <Box
                sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                }}
            >


            <h1>Create Petition</h1>


            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Title</InputLabel>
                            <TextField name="title" style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"
                        required
                        inputProps={{
                            maxLength: 128
                        }}
                    />

                        <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Description</InputLabel>
                            <TextField name="description" style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"
                        required
                        inputProps={{
                            maxLength: 1024
                        }}
                    />

                               <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Category</InputLabel>
                            <Select
                            name="category"
                            type="number"
                            style={{marginLeft:"10%", marginRight: "10%", textAlign:"left", display:"block", width:"auto"}}
                            // onChange={handleChange}
                            >
                            {categories.map((item: category) => {
                                return( 
                                    <MenuItem value={item.categoryId} style={{textAlign:"left"}}>{item.name}</MenuItem>
                            )})}
                            
                            </Select>

                            <br></br>
                            <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            style={{margin:"0 auto"}}
                            
                            >
                            Upload Image
                            <input type="file" name="file" style={{display: "none"}} onChange={handleImageChange} accept="image/gif, image/jpeg, image/png"/>
                        </Button>
                            {imageFile ? <div><p>Filename: {imageFile.name}</p>
                            <p>File type: {imageFile.type}</p></div> : <div></div>}

                            <div>
                        <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Title</InputLabel>
                            <TextField name="tierTitle" value={tierTitle} style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"
                        inputProps={{
                            maxLength: 128
                        }}
                        onChange={handleTitleInput}
                             />

                        <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Description</InputLabel>
                            <TextField name="tierDescription" value={tierDescription} style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"

                        inputProps={{
                            maxLength: 1024
                        }}
                        onChange={handleDescriptionInput}
                        
                    />

                        <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Cost</InputLabel>
                            <TextField name="tierCost" value={tierCost} style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="number"

                        onChange={handleCostInput}
                         />


                        <Button style={{width: "100%"}} onClick={checkAndHandleTier}>Add Support Tier</Button>

                        <h2>Support Tiers</h2>
                        {supportTiers.map((item: supportTierPost) => {
                            return(
                                <div>
                                    <hr></hr>
                                    <p>Title: {item.title}</p>
                                    <p>Description: {item.description}</p>
                                    <p>Cost: ${item.cost}</p>
                                </div>
                            )
                        })}

                        </div>

                        <Button style={{width: "25%", marginTop:"5%"}} type="submit" variant="contained">Submit Petition</Button>
            </Box>
            </Paper>
            </Container>

        );
    } else {
        return <NotFound/>
    }
}

export default CreatePetition;