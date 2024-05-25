import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import { Paper, FormGroup, Checkbox, AlertTitle, Alert, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, useTheme, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControlLabel, InputAdornment, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Container, Snackbar } from "@mui/material";
import PetitionListObject from "./PetitionListObject";
import { KeyboardArrowRight, KeyboardArrowLeft } from '@mui/icons-material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { userStore } from '../store/userStore';


interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement>,
      newPage: number,
    ) => void;
  }
  
  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }


  





const PetitionList = () => {
    const [petitions, setPetitions] = React.useState<Array<petition>>([])
    const [categories, setCategories] = React.useState < Array<Category>> ([]);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [open, setOpen] = React.useState(false);

    const setPrevious = userStore((state) => state.setPrevious);


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [isCategoriesSet, setIsCategoriesSet] = React.useState(false);
    const [isPetitionsSet, setIsPetitionsSet] = React.useState(false);

    const [openDialog, setOpenDialog] = React.useState(false);

    const [dialogCategories, setDialogCategories] = React.useState<Array<number>>([]);
    const [sortBy, setSortBy] = React.useState("");

    const handleClickOpen = () => {
      setOpenDialog(true);
    };
  
    const handleClose = () => {
      setOpenDialog(false);
      setDialogCategories([]);
      setSortBy("");
    };
  
    React.useEffect(() => {
      setPrevious("/petitions");
    })


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


    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - petitions.length) : 0;
  
    const handleChangePage = (
      event: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPage(newPage);
      
    };
  
    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleCheckbox = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const temp = Number(event.target.value);
      if (dialogCategories.includes(temp)) {
        dialogCategories.splice(dialogCategories.indexOf(temp), 1);
      } else {
        dialogCategories.push(temp);
      }
      console.log(dialogCategories);
    }

    const handleDropDown = (event: SelectChangeEvent) => {
      setSortBy(event.target.value as string);
    };



    const getCategories = () => {
        axios.get("http://localhost:4941/api/v1/petitions/categories")
        .then((response) => {
            setErrorFlag(false)
            setErrorMessage("")
            setCategories(response.data)
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        }
        
      ).finally(() => {
        setIsCategoriesSet(true);
      })
    }

    const queryPetitions = (params: unknown) => {
      axios.get('http://localhost:4941/api/v1/petitions', {params: params})
          .then((response) => {
              setErrorFlag(false)
              setErrorMessage("")
              setPetitions(response.data.petitions)
              setPage(0);
              handleClose();
          }, (error) => {

            setOpen(true);
          }).finally(() => {
            setIsPetitionsSet(true);
          })
  }

  const close = () => {
    setOpen(false);
  }

    const getCategoryFromId = (id: number) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categoryId === id) {
                return categories[i].name;
            }
        }
    }

    const card: CSS.Properties = {
        padding: "10px",
        margin: "auto",
        display: "block",
        width: "fit-content",

    }


    if (errorFlag) {
        return (
          <TableContainer component={Paper} style={{zIndex:"1", position:"relative",width:"50%", minWidth:"900px",marginTop: "1%", marginLeft:"auto", marginRight:"auto", left:"0", right:"0"}}>
                <h1>Petitions</h1>
                <div style={{color: "red" }}>
                    {errorMessage}
                </div>
          </TableContainer>
        )
    } else {
      if (isPetitionsSet) {
        if (petitions.length === 0) {
          return (
            <TableContainer component={Paper} style={{zIndex:"1", position:"relative",width:"50%", minWidth:"900px",marginTop: "1%", marginLeft:"auto", marginRight:"auto", left:"0", right:"0"}}>
                  <h1 style={{display:"inline-block"}}>Petitions</h1>
                      <div>
                      <Button variant="contained" style={{display:"block", marginLeft:"auto", marginRight:"5%", marginBottom:"0%"}} onClick={handleClickOpen}>Query Petitions</Button>
                      </div>
                      <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    message="There was an error with your query"
                    onClose={close}
                  />
                      <Dialog
                        open={openDialog}
                        onClose={handleClose}
                        PaperProps={{
                          component: 'form',
                          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const q = formJson.q;
                            const categoryIds: number[] = dialogCategories;
                            const supportingCost = formJson.supportingCost;
                            const params: {[k: string]: any} = {};
                            

                            

                            if (q !== "") {
                              params["q"] = q;
                            }
                            if (categoryIds.length > 0) {
                              params["categoryIds"] = categoryIds;
                            }
                            if (supportingCost !== "") {
                              params["supportingCost"] = supportingCost;
                            }
                            if (sortBy !== "") {
                              params["sortBy"] = sortBy;
                            }

                            setIsPetitionsSet(false);

            

                            queryPetitions(params);
                          },
                        }}
                      >
                        <DialogTitle>Query</DialogTitle>
                        <DialogContent>
                          <h4>
                            Query petitions through the use of search, filter, and sort options
                          </h4>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="search query"
                            name="q"
                            label="Search Query"
                            type="text"
                            fullWidth
                            variant="standard"
                            inputProps={{
                              maxLength: 64
                            }}
                          />
                          <hr></hr>
                          <DialogContentText>
                            Filter by category
                          </DialogContentText>
                          <FormGroup>
                          {categories.map((item:category) => {
                            return(<FormControlLabel control={<Checkbox value={item.categoryId} name="test" onChange={handleCheckbox}/>} label={item.name} />)
                          })}
                          </FormGroup>
                          <hr></hr>
                          <DialogContentText>
                            Supporting Cost
                          </DialogContentText>
                          <TextField
                            margin="dense"
                            id="supporting cost"
                            name="supportingCost"
                            label="Supporting Cost"
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            fullWidth
                            variant="standard"
                          />
                        <hr></hr>
                        <DialogContentText>Sort</DialogContentText>
                        <FormControl fullWidth>
                        
                          <InputLabel id="select-label">Sort By</InputLabel>
                          <Select
                            labelId="select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            label="Sort By"
                            onChange={handleDropDown}
                          >
                            <MenuItem value={"ALPHABETICAL_ASC"}>Title in ascending order</MenuItem>
                            <MenuItem value={"ALPHABETICAL_DESC"}>Title in descending order</MenuItem>
                            <MenuItem value={"COST_ASC"}>Supporting cost in ascending order</MenuItem>
                            <MenuItem value={"COST_DESC"}>Supporting cost in descending order</MenuItem>
                            <MenuItem value={"CREATED_ASC"}>Creation date from oldest to newest</MenuItem>
                            <MenuItem value={"CREATED_DESC"}>Creation date from newest to oldest</MenuItem>
                          </Select>
                        </FormControl>
                        <br></br>
                        <br></br>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button type="submit">Find Petitions</Button>
                        </DialogActions>
                      </Dialog>

                <h3>No petitions found</h3>
            </TableContainer>
          )
        } else {
          return (

                  <TableContainer component={Paper} style={{zIndex:"1", position:"relative",width:"50%", minWidth:"900px",  marginTop: "1%", marginLeft:"auto", marginRight:"auto", left:"0", right:"0"}}>
         
                      <h1 style={{display:"inline-block"}}>Petitions</h1>
                      <div>
                      <Button variant="contained" style={{display:"block", marginLeft:"auto", marginRight:"5%", marginBottom:"0%"}} onClick={handleClickOpen}>Query Petitions</Button>
                      </div>

                      <Dialog
                        open={openDialog}
                        onClose={handleClose}
                        PaperProps={{
                          component: 'form',
                          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const q = formJson.q;
                            const categoryIds: number[] = dialogCategories;
                            const supportingCost = formJson.supportingCost;
                            const params: {[k: string]: any} = {};
                            

                            

                            if (q !== "") {
                              params["q"] = q;
                            }
                            if (categoryIds.length > 0) {
                              params["categoryIds"] = categoryIds;
                            }
                            if (supportingCost !== "") {
                              params["supportingCost"] = supportingCost;
                            }
                            if (sortBy !== "") {
                              params["sortBy"] = sortBy;
                            }

                            setIsPetitionsSet(false);

            

                            queryPetitions(params);
                          },
                        }}
                      >
                        <DialogTitle>Query</DialogTitle>
                        <DialogContent>
                          <h4>
                            Query petitions through the use of search, filter, and sort options
                          </h4>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="search query"
                            name="q"
                            label="Search Query"
                            type="text"
                            fullWidth
                            variant="standard"
                            inputProps={{
                              maxLength: 64
                            }}
                          />
                          <hr></hr>
                          <DialogContentText>
                            Filter by category
                          </DialogContentText>
                          <FormGroup>
                          {categories.map((item:category) => {
                            return(<FormControlLabel control={<Checkbox value={item.categoryId} name="test" onChange={handleCheckbox}/>} label={item.name} />)
                          })}
                          </FormGroup>
                          <hr></hr>
                          <DialogContentText>
                            Supporting Cost
                          </DialogContentText>
                          <TextField
                            margin="dense"
                            id="supporting cost"
                            name="supportingCost"
                            label="Supporting Cost"
                            type="number"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            fullWidth
                            variant="standard"
                          />
                        <hr></hr>
                        <DialogContentText>Sort</DialogContentText>
                        <FormControl fullWidth>
                        
                          <InputLabel id="select-label">Sort By</InputLabel>
                          <Select
                            labelId="select-label"
                            id="demo-simple-select"
                            value={sortBy}
                            label="Sort By"
                            onChange={handleDropDown}
                          >
                            <MenuItem value={"ALPHABETICAL_ASC"}>Title in ascending order</MenuItem>
                            <MenuItem value={"ALPHABETICAL_DESC"}>Title in descending order</MenuItem>
                            <MenuItem value={"COST_ASC"}>Supporting cost in ascending order</MenuItem>
                            <MenuItem value={"COST_DESC"}>Supporting cost in descending order</MenuItem>
                            <MenuItem value={"CREATED_ASC"}>Creation date from oldest to newest</MenuItem>
                            <MenuItem value={"CREATED_DESC"}>Creation date from newest to oldest</MenuItem>
                          </Select>
                        </FormControl>
                        <br></br>
                        <br></br>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancel</Button>
                          <Button type="submit">Find Petitions</Button>
                        </DialogActions>
                      </Dialog>





                  <Table aria-label="custom pagination table">
                  <TableBody>
                      {(rowsPerPage > 0
                      ? petitions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : petitions
                      ).map((row: petition) => (
                      <TableRow key={row.petitionId}>
                          <TableCell component="th" scope="row">
                              {(isCategoriesSet) ?<PetitionListObject key={ row.petitionId} petition={row} category={getCategoryFromId(row.categoryId)!}/> : <p></p>}
                          </TableCell>
                      </TableRow>
                      ))}
                      {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                      </TableRow>
                      )}
                  </TableBody>
                  <TableFooter>
                      <TableRow>
                      <TablePagination
                          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                          colSpan={1}
                          count={petitions.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                          select: {
                              inputProps: {
                              'aria-label': 'rows per page',
                              },
                              native: true,
                          },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                      />
                      </TableRow>
                  </TableFooter>
                  </Table>
                  <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    message="There was an error with your query"
                    onClose={close}
                  />
                
              </TableContainer>


              )
            }
        } else {
          return(<p></p>)
        }
      }
}
export default PetitionList;