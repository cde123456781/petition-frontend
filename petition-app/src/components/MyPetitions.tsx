import axios from "axios";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Avatar, Box, Button, Container, CssBaseline, Grid, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, TextField } from "@mui/material";
import CSS from 'csstype';
import '@fontsource/roboto/500.css';
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { userStore } from "../store/userStore";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import PetitionListObject from "./PetitionListObject";


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


const MyPetitions = () => {

    const isLoggedIn = userStore((state) => (state.isLoggedIn));
    const userId = userStore((state) => (state.userId));
    const token = userStore((state) => (state.token));
    const setPrevious = userStore((state) => (state.setPrevious));
    

    const [myPetitions, setMyPetitions] = React.useState<Array<petition>>([]);
    const [supportedPetitions, setSupportedPetitions] = React.useState<Array<petition>>([]);

    const [myPetitionsPage, setMyPetitionsPage] = React.useState(0);
    const [rowsPerMyPetitionsPage, setRowsPerMyPetitionsPage] = React.useState(5);

    const [supportedPage, setSupportedPage] = React.useState(0);
    const [rowsPerSupportedPage, setRowsPerSupportedPage] = React.useState(5);


    const [categories, setCategories] = React.useState < Array<Category>> ([]);
    const [isCategoriesSet, setIsCategoriesSet] = React.useState(false);
    const [isMyPetitionsSet, setIsMyPetitionsSet] = React.useState(false);
    const [isSupportedPetitionsSet, setIsSupportedPetitionsSet] = React.useState(false);

    React.useEffect(() => {

        const params = {"ownerId": userId}
        const getMyPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions', {params})
                .then((response) => {

                setMyPetitions(response.data.petitions)
            }, (error) => {
                console.log(error)
            }).finally(() => {
              setIsMyPetitionsSet(true);
              console.log(myPetitions);
              console.log(myPetitions.length);
            })
        }
        getMyPetitions();
    },[]) 


    
    React.useEffect(() => {

        const params = {"supporterId": userId}
        const getSupportedPetitions = () => {
            axios.get('http://localhost:4941/api/v1/petitions', {params})
                .then((response) => {

                setSupportedPetitions(response.data.petitions)
            }, (error) => {
                console.log(error)
            }).finally(() => {
              setIsSupportedPetitionsSet(true);
            })
        }
        getSupportedPetitions();
    },[]) 

    React.useEffect(() => (
        getCategories()

    ), [])


    React.useEffect(() => (
        setPrevious("/MyPetitions")
        
    ), [])


    const getCategories = () => {
        axios.get("http://localhost:4941/api/v1/petitions/categories")
        .then((response) => {
            setCategories(response.data)
        }, (error) => {
            console.log(error);
        }).finally(() =>{
            setIsCategoriesSet(true);
        })
    }

    const getCategoryFromId = (id: number) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryId === id) {
                return categories[i].name;
            }
        }
    }

    const emptyRowsMyPetitions =
    myPetitionsPage > 0 ? Math.max(0, (1 + myPetitionsPage) * rowsPerMyPetitionsPage - myPetitions.length) : 0;

    const emptyRowsSupportedPetitions =
    supportedPage > 0 ? Math.max(0, (1 + supportedPage) * rowsPerSupportedPage - supportedPetitions.length) : 0;

    const handleChangeMyPage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setMyPetitionsPage(newPage);
        
    };

    const handleChangeSupportedPage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setSupportedPage(newPage);
        
    };

  const handleChangeRowsPerMyPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerMyPetitionsPage(parseInt(event.target.value, 10));
    setMyPetitionsPage(0);
  };

  const handleChangeRowsPerSupportedPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerSupportedPage(parseInt(event.target.value, 10));
    setSupportedPage(0);
  };

    console.log(myPetitions.length);
    if (isLoggedIn && isMyPetitionsSet && isSupportedPetitionsSet) {
        return (
            <div>
                <TableContainer component={Paper} style={{zIndex:"1", position:"relative",width:"50%", minWidth:"900px",  marginTop: "1%", marginLeft:"auto", marginRight:"auto", left:"0", right:"0"}}>
            
                        <h1 style={{display:"inline-block"}}>My Petitions</h1>
                        
                    <Table aria-label="custom pagination table">
                    <TableBody>
                        {(rowsPerMyPetitionsPage > 0
                        ? myPetitions.slice(myPetitionsPage * rowsPerMyPetitionsPage, myPetitionsPage * rowsPerMyPetitionsPage + rowsPerMyPetitionsPage)
                        : myPetitions
                        ).map((row: petition) => (
                        <TableRow key={row.petitionId}>
                            <TableCell component="th" scope="row">
                                {(isCategoriesSet) ?<PetitionListObject key={ row.petitionId} petition={row} category={getCategoryFromId(row.categoryId)!}/> : <p></p>}
                            </TableCell>
                        </TableRow>
                        ))}
                        {emptyRowsMyPetitions > 0 && (
                        <TableRow style={{ height: 53 * emptyRowsMyPetitions }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={1}
                            count={myPetitions.length}
                            rowsPerPage={rowsPerMyPetitionsPage}
                            page={myPetitionsPage}
                            slotProps={{
                            select: {
                                inputProps: {
                                'aria-label': 'rows per page',
                                },
                                native: true,
                            },
                            }}
                            onPageChange={handleChangeMyPage}
                            onRowsPerPageChange={handleChangeRowsPerMyPage}
                            ActionsComponent={TablePaginationActions}
                        />
                        </TableRow>
                    </TableFooter>
                    </Table>
                    
                </TableContainer>

                

                <TableContainer component={Paper} style={{zIndex:"1", position:"relative",width:"50%", minWidth:"900px", marginLeft:"auto", marginRight:"auto", left:"0", right:"0"}}>
                    
                    <h1 style={{display:"inline-block"}}>Supported Petitions</h1>
                    
                <Table aria-label="custom pagination table">
                <TableBody>
                    {(rowsPerSupportedPage > 0
                    ? supportedPetitions.slice(supportedPage * rowsPerSupportedPage, supportedPage * rowsPerSupportedPage + rowsPerSupportedPage)
                    : supportedPetitions
                    ).map((row: petition) => (
                    <TableRow key={row.petitionId}>
                        <TableCell component="th" scope="row">
                            {(isCategoriesSet) ?<PetitionListObject key={ row.petitionId} petition={row} category={getCategoryFromId(row.categoryId)!}/> : <p></p>}
                        </TableCell>
                    </TableRow>
                    ))}
                    {emptyRowsSupportedPetitions > 0 && (
                    <TableRow style={{ height: 53 * emptyRowsSupportedPetitions }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={1}
                        count={supportedPetitions.length}
                        rowsPerPage={rowsPerSupportedPage}
                        page={supportedPage}
                        slotProps={{
                        select: {
                            inputProps: {
                            'aria-label': 'rows per page',
                            },
                            native: true,
                        },
                        }}
                        onPageChange={handleChangeSupportedPage}
                        onRowsPerPageChange={handleChangeRowsPerSupportedPage}
                        ActionsComponent={TablePaginationActions}
                    />
                    </TableRow>
                </TableFooter>
                </Table>
            
            </TableContainer>


        </div>

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


            <h1>Unauthorized</h1>
                <Box  sx={{ mt: 3 }}>
                
                </Box>
            </Box>
            </Paper>
            </Container>
        )
    }
  }

export default MyPetitions;