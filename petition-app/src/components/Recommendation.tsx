import React, { SyntheticEvent } from "react";
import { Paper } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { Link } from "react-router-dom";


interface IRecommendationProps {
    petition: petition,
    category: string
}




const Recommendation = (props: IRecommendationProps) => {
    const [petition] = React.useState<petition> (props.petition)
    const [category] = React.useState<string> (props.category)
    const [isHover, setIsHover] = React.useState(false);



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




    const recommendationsStyle: CSS.Properties = {
            backgroundColor: isHover ? 'lightblue' : "white",
            padding:"1%",
            marginTop: "1%",
            transition: "background-color 0.5s, box-shadow 0.5s",
            display: "block",
            border: "3px solid lightGrey",
            borderRadius:"3px",
            height: "300px",
            width:"600px",
            overflow: "hidden",
            minWidth: "600px",
            minHeight: "300px",

            marginLeft:"auto"
    
    
        }

        const profileStyle: CSS.Properties = {
            width: "25%",
            height: "25%",
            borderRadius:"5%", 
            minHeight:"30px",
            minWidth:"30px",
            maxWidth:"30px",
            maxHeight:"30px",
            display:"absolute"
    
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
            <Link to={"/petitions/" + petition.petitionId} onClick={() => window.scroll({top:0, left:0})}>
            <Paper key={petition.petitionId} style={recommendationsStyle} onMouseOver={handleMouseEnter} onMouseOut={handleMouseLeave}>
                <h3 style={{textAlign:"center", margin: "auto"}}>{petition.title}</h3>
                <br></br>
                <div style={{display:"inline-block", marginTop:"auto", marginBottom:"auto", width:"40%", height:"100%", justifyContent:"center", alignItems:"center"}}>
                    <img src={"http://localhost:4941/api/v1/petitions/" + petition.petitionId + "/image"} style={imageStyle} onError={addDefaultImg}
                    />
                </div>
                <div style={{font: "Roboto", fontSize: "1rem", display:"inline-block", margin: "auto", marginTop:"auto", marginBottom:"auto", verticalAlign:"top", width:"40%", height:"20%", justifyContent:"center", alignItems:"center"}}>
                    <p>Category: {category}</p>
                    <p>Creation Date: {date.toLocaleString('en-nz')}</p>
                    <p>Supporting Cost: ${petition.supportingCost}</p>
                    <div style={{display:"block", overflow:"hidden", whiteSpace:"nowrap", textOverflow: "ellipsis", width:"calc(100%)"}}>
                        <hr></hr>
                        <img style={profileStyle} src={"http://localhost:4941/api/v1/users/" + petition.ownerId + "/image"} onError={addDefaultImg}/>
                        <p style={{display:"block", marginLeft:"3%", verticalAlign:"top", marginTop:"0%"}}>Owner: {petition.ownerFirstName + " " + petition.ownerLastName}</p>
                    
                    </div>
                </div>
            </Paper>
        </Link>
    )
}

export default Recommendation;