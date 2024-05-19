import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";


const Petitions = () => {
    const [petitions, setPetitions] = React.useState < Array<Petition>> ([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => (
        getPetitions()
    ), [])


    // https://seng365.csse.canterbury.ac.nz/api/v1/petitions
    // http://localhost:4941/api/v1/petitions
    const getPetitions = () => {
        axios.get("https://seng365.csse.canterbury.ac.nz/api/v1/petitions")
        .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setPetitions(response.data.petitions)
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
    }


    const list_of_petitions = () => {
        return petitions.map((item: Petition) =>
        <tr key={item.petitionId}>
        <th scope="row">{item.petitionId}</th>
        <td><Link to={"/petitions/" + item.petitionId}>{item.title}</Link></td>
        <td>
        <button type="button">Delete</button>
        <button type="button">Edit</button>
        </td>
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
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Category</th>
                            <th scope="col">CreationDate</th>
                            <th scope="col">Owner</th>
                            <th scope="col">CreationDate</th>
                            <th scope="col">Minimum Supporting Cost</th>
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