import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import { userStore } from '../store/userStore';
import axios from 'axios';
import { Link } from '@mui/material';
import { VariantType, enqueueSnackbar } from 'notistack';

const pages = ['Petitions'];
const settings = ['Profile', 'Account', 'My Petitions', 'Logout'];

const ResponsiveAppBar = () => {

  const isLoggedIn = userStore((state) => (state.isLoggedIn));
  const userId = userStore((state) => (state.userId));
  const token = userStore((state) => (state.token));

  const logout = userStore((state) => (state.logout));
  const name = userStore((state) => (state.name));
  const setName = userStore((state) => (state.setName));


  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const getNameFromId = () => {
      axios.get('http://localhost:4941/api/v1/users/' + userId)
                .then((response) => {
                setName(response.data.firstName + " " + response.data.lastName);
            }, (error) => {
                setName("Unknown");
                console.log(error);
                console.log(userId);
            })
    }
    getNameFromId()
  }, [name])

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };





  const handleLogout = () => {
    handleCloseUserMenu();
    // https://seng365.csse.canterbury.ac.nz/api/v1/users/logout
    const test = {
      'X-Authorization': token
     }
    axios.post("http://localhost:4941/api/v1/users/logout",{},  {headers: test})
      .then((response) => {
        logout();
      const temp = (variant: VariantType) => {
          enqueueSnackbar('Successfully logged out', {variant});
      }
      temp("success");
      window.location.replace("/");

  }, (error) => {
      console.log(test);
      console.log(error)
      console.log(error.data);
  })
  }

  const handleMyProfile = () => {
    window.location.replace("/profile");
  }

  const handleMyPetitions = () => {
    window.location.replace("/MyPetitions");
  }

  return (
    <AppBar position="sticky" style={{zIndex:"5", top:"0"}}>
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NOTPATREON
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, mr: 10 }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link href={"/" + page} style={{textDecoration:"none"}}>
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                  </Link>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NOTPATREON
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                    <Link href={"/" + page} style={{textDecoration:"none"}}>
                        <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
                    </Link>

            ))}
          </Box>
          {isLoggedIn ?
            <Box sx={{ flexGrow: 0 }}>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 10 }}>
                  <Button  sx={{ my: 2, color: 'white', display: 'block' }} >{name}</Button>
                </IconButton>

              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                    <MenuItem key="Profile" onClick={handleMyProfile}>
                      <Typography textAlign="center">My Profile</Typography>
                    </MenuItem>
                    <MenuItem key="Petitions" onClick={handleMyPetitions}>
                      <Typography textAlign="center">My Petitions</Typography>
                    </MenuItem>

  
                    <MenuItem key="logout" onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                    

              </Menu>

              
            </Box> :

          <Box sx={{ flexGrow: 0 }}> 
            <Link href="/register">
            <IconButton sx={{ p: 0, mr: 0 }}>
                <Button  sx={{ my: 2, color: 'white', display: 'block' }} >Register</Button>
              </IconButton>
              </Link>

              <Link href="/login">
              <IconButton sx={{ p: 0, mr: 5 }}>
                <Button  sx={{ my: 2, color: 'white', display: 'block' }} >Login</Button>
              </IconButton>
              </Link>
          </Box>}     
        </Toolbar>

    </AppBar>
  );
}
export default ResponsiveAppBar;