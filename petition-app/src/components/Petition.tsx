import axios from "axios";
import React, { SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button, Container, CssBaseline, Dialog, DialogTitle, FormControlLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import Recommendation from "./Recommendation";
import { userStore } from "../store/userStore";
import { SnackbarProvider, VariantType, enqueueSnackbar } from "notistack";
import DeleteIcon from '@mui/icons-material/Delete';






const Petition = () => {
    const previous = userStore((state) => (state.previous));
    const userId = userStore((state) => (state.userId));
    const token = userStore((state) => (state.token))
    const isLoggedIn = userStore((state) => (state.isLoggedIn));

    const {id} = useParams();
    const navigate = useNavigate();
    const [petition, setPetition] = React.useState<petitionFull>({petitionId:0, title:"", description: "", categoryId:0, creationDate:"", ownerId:0, 
    ownerFirstName:"", ownerLastName:"", numberOfSupporters:0, moneyRaised: 0, supportingCost:0, supportTiers: []})

    const [supporters, setSupporters] = React.useState<Array<supporter>>([])

    const [petitions, setPetitions] = React.useState<Array<petition>>([])
    const [isPetitionsSet, setIsPetitionsSet] = React.useState(false)

    let [recommendations, setRecommendations] = React.useState<Array<petition>>([])
    const [isRecommendationsExtracted, setIsRecommendationsExtracted] = React.useState(false)

    const [categories, setCategories] = React.useState < Array<Category>> ([]);


    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openSupportDialog, setOpenSupportDialog] = React.useState(false);
    const [openTiersDialog, setOpenTiersDialog] = React.useState(false);

    const [mode, setMode] = React.useState("");
    




    React.useEffect(() => {
        setIsRecommendationsExtracted(false);
        setRecommendations([]);
    }, [petition])




    React.useEffect(() => {
        const getUser = () => {
            axios.get('http://localhost:4941/api/v1/petitions/'+id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setPetition(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
            }
        getUser()
    }, [id])




    const getSupporters = () => {
        axios.get('http://localhost:4941/api/v1/petitions/'+id + "/supporters")
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSupporters(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
        }
    React.useEffect(() => {
        getSupporters()
    }, [id])

    
    React.useEffect(() => {
        const getPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions')
                .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setPetitions(response.data.petitions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            }).finally(() => {
                setIsPetitionsSet(true);
            })
        } 
        getPetitions()
        }, [setPetitions])

    
    React.useEffect(() => (
        getCategories()
    ), [])

    const petitionStyle: CSS.Properties = {
        backgroundColor: "white",
        marginTop: "1%",
        transition: "background-color 0.5s, box-shadow 0.5s",
        display: "block",
        border: "3px solid lightGrey",
        borderRadius:"3px",
        height: "auto",
        width:"50%",
        overflow: "hidden",
        minWidth: "900px",
        marginLeft: "auto",
        marginRight: "auto",
        zIndex: "1",
        left: "0",
        right:"0",
        position:"relative"


    }






    const imageStyle: CSS.Properties = {
        padding: "2%",
        margin: "auto",
        display: "inline-block",
        maxWidth: "300px",
        maxHeight: "300px",
        width: "80%",
        height: "80%",
        borderRadius: "5%",
        objectFit: "cover",

    
    
    }



    const profileStyle: CSS.Properties = {
        width: "25%",
        height: "25%",
        borderRadius:"5%", 
        minHeight:"50px",
        minWidth:"50px",
        maxWidth:"50px",
        maxHeight:"50px",

    }


    const list_of_support_tiers = () => {
        return petition.supportTiers.map((item: supportTier) =>
            <tr key={item.supportTierId}>
            <td style={{border:"2px solid #E7E3E2"}}>{item.title}</td>
            <td style={{border:"2px solid #E7E3E2"}}>{item.description}</td>
            <td style={{border:"2px solid #E7E3E2"}}>${item.cost}</td>
            </tr>
        )
    }

    const list_of_supporters = () => {

        const getSupportTier = (id:number) => {
            for (let i = 0; i < petition.supportTiers.length; i++ ) {
                if (petition.supportTiers[i].supportTierId === id) {
                    return petition.supportTiers[i].title;
                }
            }
        }

        supporters.sort((a, b) => a.supportId > b.supportId ? 1 : -1);


        
        return supporters.map((item: supporter) =>
            
            <tr key={item.supporterId}>
            <td style={{border:"2px solid #E7E3E2"}}>{getSupportTier(item.supportTierId)}</td>
            
            <td style={{border:"2px solid #E7E3E2"}}>{item.message}</td>
            <td style={{border:"2px solid #E7E3E2"}}>{new Date(item.timestamp).toLocaleString("en-nz")}</td>
            <td style={{border:"2px solid #E7E3E2"}}>{item.supporterFirstName + " " + item.supporterLastName}</td>
            <td style={{border:"2px solid #E7E3E2"}}><img style={profileStyle} src={"http://localhost:4941/api/v1/users/" + item.supporterId + "/image"} onError={addDefaultImg}/></td>
            </tr>
        )
    }


    const extractRecommendations = () => {
        // Remove recommendations whose categories don't match this current petition
        for (let i = petitions.length - 1; i >= 0; i -- ) {
            if (petitions[i].categoryId === petition.categoryId && petitions[i].petitionId !== petition.petitionId) {
                recommendations.push(petitions[i]);
            }
        }
        console.log("recs");
        console.log(recommendations);

        // Shuffle recommendations 

        for (let i = recommendations.length - 1; i >= 0; i -- ) {
            let j = Math.floor(Math.random() * (i + 1));
            [recommendations[i], recommendations[j]] = [recommendations[j], recommendations[i]];
        }

        setIsRecommendationsExtracted(true);
    
    }

    const list_of_recommendations = () => {

        const date = new Date(petition.creationDate);
        if (recommendations.length === 0) {
            return (<p>No other petitions exist of this category</p>)
        } else {
            return (recommendations.slice(0, 3).map((item: petition) =>
                <div style={{alignContent:"center", overflow:"visible"}}>
                <Recommendation key={ item.petitionId} petition={item} category={getCategoryFromId(item.categoryId)!}/>
                </div>
            ))
        }
    }



    const getCategories = () => {
        axios.get("http://localhost:4941/api/v1/petitions/categories")
        .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setCategories(response.data)
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
    }

    const getCategoryFromId = (id: number) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryId === id) {
                return categories[i].name;
            }
        }
    }

    
    const addDefaultImg = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = process.env.PUBLIC_URL + '/logo192.png';
     }


     const handleDeleteButtonClick = () => {
        setOpenDeleteDialog(true);
      };

      const handleSupportButtonClick = () => {
        setOpenSupportDialog(true);
      };

      const handleEditButtonClick = () => {
        setOpenEditDialog(true);
      };

      const handleClose = () => {
        setOpenDeleteDialog(false);
        setOpenEditDialog(false);
        setOpenSupportDialog(false);
        setOpenTiersDialog(false);
        setMode("");
      }

      const handleTiersClick = () => {
        setOpenTiersDialog(true);
      }


      
      const handleDelete = () => {
        const headers = {
            'X-Authorization': token
           }
        axios.delete("http://localhost:4941/api/v1/petitions/" + petition.petitionId, {headers: headers})
        .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            const temp = (variant: VariantType) => {
                enqueueSnackbar('Successfully deleted', {variant});
            }
            temp("success");
            window.location.replace("/Petitions");
        }, (error) => {
            enqueueSnackbar("Cannot delete petition")
        })
      }

      const handleDetail = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
           const data = new FormData(event.currentTarget);
           const title = data.get("title");
           const description = data.get("description");
           const category = data.get("category") as string;
           const headers = {
            'X-Authorization': token
           }
           const params: {[k: string]: any} = {};

           if (title !== "") {
            params["title"] = title;
           }

           if (description !== "") {
            params["description"] = description;
           }

           if (category !== "") {
            params["categoryId"] = parseInt(category, 10);
 

           }


           if (description !== "" || title !== "" || category !== "") {
            axios.patch("http://localhost:4941/api/v1/petitions/" + petition.petitionId , params, {headers: headers} )
                    .then((response) => {
                    const temp = (variant: VariantType) => {
                        enqueueSnackbar('Successfully changed details ', {variant});
                    }
                    temp("success");
                    window.location.replace("/petitions/" + petition.petitionId);
                    console.log(category);



                
                }, (error) => {
                    if (error.response.status === 403) {
                        enqueueSnackbar("Title is already in use");
                    } else {
                        enqueueSnackbar("Bad request");

                    }
                })
        }



      }


      const handleTierDelete = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const deleteTier = data.get("deleteTier") as string;
        const headers = {'X-Authorization': token}
        if (deleteTier !== "") {
            axios.delete("http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/supportTiers/" + deleteTier, {headers: headers} )
                    .then((response) => {
                    const temp = (variant: VariantType) => {
                        enqueueSnackbar('Successfully delete', {variant});
                    }
                    temp("success");
                    handleClose();
                    window.location.replace("/petitions/" + petition.petitionId);

                
                }, (error) => {
                    if (error.response.status === 403)
                    {
                        enqueueSnackbar("Forbidden");
                    } else if (error.response.status === 404) {
                        enqueueSnackbar("Not Found")
                    } else {
                        enqueueSnackbar("Bad request")
                    }
                    
                })
        }
      }

      const handleTierAdd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = data.get("title");
        const description = data.get("description");
        const cost = data.get("cost") as string;
        const params: {[k: string]: any} = {};

        if (cost !== "") {
            const headers = {'X-Authorization': token}
            params["title"] = title;
            params["description"] = description;
            params["cost"] = parseInt(cost, 10);
            axios.put("http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/supportTiers", params, {headers: headers})
            .then((response) => {
                const temp = (variant: VariantType) => {
                    enqueueSnackbar('Successfully added support tier', {variant});
                }
                temp("success");
                handleClose();
                window.location.replace("/petitions/" + petition.petitionId);

            
            }, (error) => {
                if (error.response.status === 403)
                {
                    enqueueSnackbar("Forbidden");
                } else if (error.response.status === 404) {
                    enqueueSnackbar("Not Found");
                } else {
                    enqueueSnackbar("Bad request");
                }
                
            })
        } else {
            enqueueSnackbar("Cost cannot be empty");
        }
      }



      const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const temp = e.target.value;
        setMode(temp);
      };

      const handleSupport = (event: React.FormEvent<HTMLFormElement>) => {
           event.preventDefault();
           const data = new FormData(event.currentTarget);
           const tier = data.get("tier") as string;
           const message = data.get("message");
           const headers = {'X-Authorization': token}
           if (tier !== null) {
            if (data.get("message") === "") {
                    axios.post("http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/supporters", {"supportTierId": parseInt(tier, 10)},  {headers: headers} )
                    .then((response) => {
                    const temp = (variant: VariantType) => {
                        enqueueSnackbar('Successfully supported ' + petition.title, {variant});
                    }
                    temp("success");
                    handleClose();
                    getSupporters();

                
                }, (error) => {
                    console.log(error);
                    enqueueSnackbar("You are already supporting this tier")
                })
            } else {
                axios.post("http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/supporters", {"supportTierId": parseInt(tier, 10), "message": message},  
                {headers: headers} )
                .then((response) => {
                const temp = (variant: VariantType) => {
                    enqueueSnackbar('Successfully supported ' + petition.title, {variant});
                }
                temp("success");
                handleClose();
                getSupporters();

            
            }, (error) => {
                console.log(error.status);
                enqueueSnackbar("You are already supporting this tier")
            })
            }
           }
        }
      


    if (errorFlag || petition.petitionId === 0) {
        return (
            <Paper style={petitionStyle}>
                <h1>Petition</h1>
                <div style={{color: "red" }}>
                    There was an error with locating this petition
                </div>
            </Paper>
        )
    } else {

        if (isPetitionsSet && !isRecommendationsExtracted) {
            extractRecommendations();
        }
        const date = new Date(petition.creationDate);
        return (
            <Container component="main" style={{margin:"1% auto"}}>
                <CssBaseline />
                <Paper style={petitionStyle}>
                    <h1 style={{position:"static", top:"0px", backgroundColor:"white"}}>{petition.title}</h1>
                    

                    <div style={{paddingLeft:"10%", paddingRight:"10%", paddingTop: "1%", paddingBottom:"1%",marginLeft:"5%", marginRight:"5%"}}>
                    <img style={imageStyle} width={250} height={250} src={"http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image"}  onError={addDefaultImg}/>
                    

                    <p>Created: {date.toLocaleString("en-nz")}</p>
                    <p>Category: {getCategoryFromId(petition.categoryId)}</p>
                    <p>Description: {petition.description}</p>
                    <p>Number of Supporters: {petition.numberOfSupporters}</p>
                    {petition.moneyRaised !== null ?<p>Total Money Raised: ${petition.moneyRaised}</p> : <p>Total Money Raised: $0</p>}

                    <div style={{display:"block", overflow:"hidden", whiteSpace:"nowrap", textOverflow: "ellipsis", width:"calc(100%)"}}>
                            <hr></hr>
                            <img style={profileStyle} src={"http://localhost:4941/api/v1/users/" + petition.ownerId + "/image"} onError={addDefaultImg}/>
                            <p style={{display:"block", marginLeft:"3%", verticalAlign:"top", marginTop:"0%"}}>Owner: {petition.ownerFirstName + " " + petition.ownerLastName}</p>
                        
                    </div>



                    <div style={{display:"block", overflow:"hidden", whiteSpace:"nowrap", textOverflow: "ellipsis", width:"calc(100%)"}}>
                        {userId !== petition.ownerId ? <Button variant="contained" onClick={handleSupportButtonClick}>Support Petition</Button> : <div></div>}
                        {userId === petition.ownerId ? <Button variant="contained" onClick={handleEditButtonClick}>Edit Petition</Button> : <div></div>}
                        {userId === petition.ownerId ? <Button variant="contained" style={{marginLeft:"1%"}}onClick={handleDeleteButtonClick} endIcon={<DeleteIcon/>}>Delete Petition</Button> : <div></div>}
                        {userId === petition.ownerId ? <Button variant="contained" style={{marginLeft:"1%"}}onClick={handleTiersClick} >Edit Supporter Tiers</Button> : <div></div>}
                    </div>

                    {/* Tiers dialog */}
                    <Dialog open={openTiersDialog} onClose={handleClose}  >
                        <Paper style={{alignItems:"center"}} component="form" onSubmit={mode === "Delete"? handleTierDelete  : handleTierAdd} >
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Edit Support Tiers</DialogTitle>
                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Choose a setting</InputLabel>
                            <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="setting"
                            onChange={handleModeChange}
                        >
                            <FormControlLabel value="Delete" control={<Radio />} label="Delete" />
                            <FormControlLabel value="Add" control={<Radio />} label="Add" />

                        </RadioGroup>

                        {mode === "Delete" ? 
                        <div>
                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Choose a tier to delete</InputLabel>
                        <Select
                        name="deleteTier"
                        
                        type="number"
                        style={{marginLeft:"10%", marginRight: "10%", textAlign:"left", display:"block", width:"auto"}}
                        // onChange={handleChange}
                        >
                        {petition.supportTiers.map((item: supportTier) => {
                            return( 
                                <MenuItem value={item.supportTierId} style={{textAlign:"left"}}>{item.title}</MenuItem>
                        )})}

                        
                        
                        </Select>

                        <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>

                        <Button style={{width: "50%"}} type="submit">Confirm</Button>
                        </div> : <div></div>}
                        {mode === "Add" ? 
                        <div>
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

                        <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Cost</InputLabel>
                            <TextField name="cost" style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="number"
                        required
                         />
                        <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>

                        <Button style={{width: "50%"}} type="submit">Confirm</Button>


                        </div>
                        
                        
                        
                            :
                        
                        

                        
                        
                        
                        
                        <div></div>}
                        </Paper>
                    </Dialog>


                    {/* Edit dialog */}
                    <Dialog open={openEditDialog} onClose={handleClose} >
                        <Paper style={{alignItems:"center"}} component="form" onSubmit={handleDetail}>
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Edit a petition</DialogTitle>
                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Title</InputLabel>
                            <TextField name="title" style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"
                        inputProps={{
                            maxLength: 128
                        }}
                    />

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Description</InputLabel>
                    <TextField name="description" style={{paddingLeft:"5%", paddingRight:"5%"}}
                            fullWidth
                            type="text"
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

                            <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>

                            <Button style={{width: "50%"}} type="submit">Confirm</Button>
                        </Paper>
                    </Dialog>


                    {/* Delete Dialog */}
                        <Dialog open={openDeleteDialog} onClose={handleClose} >
                        <Paper style={{alignItems:"center"}} >
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Delete a petition</DialogTitle>
                            <p style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Are you sure you want to delete this petition?</p>

                            <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>

                            <Button style={{width: "50%"}} onClick={handleDelete}>Confirm</Button>
                        </Paper>
                    </Dialog>

                    <Dialog open={openSupportDialog} onClose={handleClose} >
                        {isLoggedIn ?
                        <Paper style={{alignItems:"center", width:"30vw", overflow:"hidden"}} component="form" onSubmit={handleSupport}>
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Support a petition</DialogTitle>

                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Tier</InputLabel>
                            <Select
                            name="tier"
                            required
                            type="number"
                            style={{marginLeft:"10%", marginRight: "10%", textAlign:"left", display:"block", width:"auto"}}
                            // onChange={handleChange}
                            >
                            {petition.supportTiers.map((item: supportTier) => {
                                return( 
                                    <MenuItem value={item.supportTierId} style={{textAlign:"left"}}>{item.title}</MenuItem>
                            )})}
                            
                            </Select>
                            <br></br>
                            <InputLabel style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Message</InputLabel>
                            <TextField name="message" style={{paddingLeft:"5%", paddingRight:"5%"}}
                        fullWidth
                        type="text"
                        inputProps={{
                            maxLength: 512
                        }}
                    />

                            <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>

                            <Button style={{width: "50%"}} type="submit">Support</Button>
                        </Paper>
                        :
                        <Paper style={{alignItems:"center"}} >
                            <DialogTitle style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>Support a Petition</DialogTitle>
                            <p style={{marginLeft:"10%", marginRight: "10%", textAlign:"center"}}>In order to support this petition, you will need to login</p>

                            <Button style={{width: "50%"}} onClick={handleClose}>Close</Button>

                            <Button style={{width: "50%"}} component={Link} to="/Login" onClick={() => window.scroll({top:0, left:0})}>Login</Button>
                        </Paper>

                        }
                    </Dialog>




                    <div>
                        <table className='table' style={{position:"relative", width:"100%", border:"2px solid #E7E3E2"}}>
                            <caption><h3>Support Tiers</h3></caption>
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list_of_support_tiers()}
                            </tbody>
                        </table>
                    </div>
                    <br></br>

                    <div>
                        <table className='table' style={{width: "100%", position:"relative", border:"2px solid #E7E3E2"}}>
                            <caption><h3>Supporters</h3></caption>
                            <thead>
                                <tr>
                                    <th scope="col">Support Tier</th>
                                    <th scope="col">Message</th>
                                    <th scope="col">Timestamp</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Profile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list_of_supporters()}
                            </tbody>
                        </table>


                    </div>

                    <div>
                        <h3>You may also be interested in: </h3>

                        {isRecommendationsExtracted && isPetitionsSet ? list_of_recommendations(): <p></p>}

                    </div>

                    </div>

                    {previous === "/MyPetitions" ? <Link to={"/MyPetitions"}><Button variant="text">Back to My Petitions</Button></Link> : <Link to={"/petitions"}><Button variant="text">Back to Petitions</Button></Link>}
                </Paper>
                </Container>
        )
    }

}

export default Petition;