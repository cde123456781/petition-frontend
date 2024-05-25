import React, { ReactEventHandler, SyntheticEvent } from "react";
import { Paper } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { Link } from "react-router-dom";



interface IPetitionProps {
    petition: petition,
    category: string
}




const PetitionListObject = (props: IPetitionProps) => {
    const [petition] = React.useState<petition> (props.petition)
    const [category] = React.useState<string> (props.category)
    const [isHover, setIsHover] = React.useState(false);




    // const getCategories = () => {
    //     axios.get("https://seng365.csse.canterbury.ac.nz/api/v1/petitions/categories")
    //     .then((response) => {
    //         setErrorFlag(false)
    //         setErrorMessage("")
    //         setCategories(response.data)
    //     }, (error) => {
    //         setErrorFlag(true)
    //         setErrorMessage(error.toString())
    //     })
    // }

    // const getCategoryFromId = (id: number) => {
    //     for (let i = 0; i < categories.length; i++) {
    //         if (categories[i].categoryId === id) {
    //             return categories[i].name;
    //         }
    //     }
    // }




    const imageStyle: CSS.Properties = {
        padding: "2%",
        margin: "auto",
        display: "inline-block",
        maxWidth: "80%",
        maxHeight: "80%",
        width: "80%",
        height: "80%",
        borderRadius: "5%",
        objectFit: "cover",

    
    
    }


    //        boxShadow: isHover ? "-10px -10px 2px rgba(0,0,0, 0.2) inset" : "0px 0px",
    const petitionStyle: CSS.Properties = {
        backgroundColor: isHover ? 'lightblue' : "white",
        padding:"1%",
        marginTop: "1%",
        transition: "background-color 0.5s, box-shadow 0.5s",
        display: "block",
        border: "3px solid lightGrey",
        borderRadius:"3px",
        height: "300px",
        width:"800px",
        overflow: "hidden",
        minWidth: "800px",
        minHeight: "300px",
        marginLeft: "auto",
        marginRight: "auto",


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

    const handleMouseEnter = () => {
       setIsHover(true);
    };
    const handleMouseLeave = () => {
       setIsHover(false);
    };

    const addDefaultImg = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = process.env.PUBLIC_URL + '/logo192.png';
     }

    const date = new Date(petition.creationDate);
    return(
        <Link to={"/petitions/" + petition.petitionId} style={{textDecoration:"none"}} onClick={() => window.scroll({top:0, left:0, behavior:"smooth"})}>
            <Paper style={petitionStyle} onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}>
                <h3 style={{textAlign:"center", margin: "auto",}}>{petition.title}</h3>
                <br></br>
                <div style={{display:"inline-block", marginTop:"auto", marginBottom:"auto", width:"40%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                    <img src={"http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image"}  onError={addDefaultImg} style={imageStyle}
                    />
                </div>
                <div style={{font: "Roboto", fontSize: "1rem", display:"inline-block", margin: "auto", marginTop:"auto", marginBottom:"auto", verticalAlign:"top", width:"40%", height:"20%", justifyContent:"center", alignItems:"center"}}>
                    <p>Category: {category}</p>
                    <p>Creation Date: {date.toLocaleString('en-nz')}</p>
                    <p>Supporting Cost: ${petition.supportingCost}</p>
                    <div>
                    <hr></hr>
                    <img style={profileStyle} src={"http://localhost:4941/api/v1/users/" + petition.ownerId + "/image"} onError={addDefaultImg}/>
                    <p style={{display:"inline-block", marginLeft:"3%", verticalAlign:"top"}}>Owner: {petition.ownerFirstName + " " + petition.ownerLastName}</p>
                    
                    </div>
                </div>
            </Paper>
        </Link>
    )
}

export default PetitionListObject;