import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";



const Petitions = () => {
    const [petitions, setPetitions] = React.useState < Array<petition>> ([]);
    const [categories, setCategories] = React.useState < Array<Category>> ([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");


    React.useEffect(() => (
        getPetitions()
    ), [])

    React.useEffect(() => (
        getCategories()
    ), [])


    // https://seng365.csse.canterbury.ac.nz/api/v1/petitions
    // http://localhost:4941/api/v1/petitions
    const getPetitions = () => {
        axios.get("http://localhost:4941/api/v1/petitions")
        .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setPetitions(response.data.petitions)
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
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

    



    const list_of_petitions = () => {
        return petitions.map((item: petition) =>
            <tr key={item.petitionId}>
            <td><img width={250} height={250} src={"http://localhost:4941/api/v1/petitions/" + item.petitionId + "/image"}/></td>
            <td><Link to={"/petitions/" + item.petitionId}>{item.title}</Link></td>
            <td>{getCategoryFromId(item.categoryId)}</td>
            <td>{item.creationDate.split("T")[0]}</td>
            <td>{item.ownerFirstName + " " + item.ownerLastName}</td>
            <td>${item.supportingCost}</td>


            </tr>
        )
    }
    








    if (errorFlag) {
        return (
            <div>
                <h1>Petitions</h1>
                <div style={{color: "red" }}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Petitions</h1>
                <table className='table' style={{position:"absolute", marginRight:"10%", marginLeft: "10%", paddingLeft:"5%", paddingRight:"5%", border:"2px solid #E7E3E2"}}>
                    <thead style={{position:"sticky", top: "0px", backgroundColor: "white"}}>
                        <tr>
                            <th scope="col">Hero Profile</th>
                            <th scope="col">Title</th>
                            <th scope="col">Category</th>
                            <th scope="col">Creation Date</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Supporting Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list_of_petitions()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Petitions;