import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import Axios from "axios";
import StateContext from "../Contexts/StateContext";
import DispatchContext from "../Contexts/DispatchContext"; 

const useStyles = makeStyles({
  logoNav: {
    marginRight: "auto",
    alignItems: "center",
    backgroundColor: "white",
    color: "black",
    borderRadius: "5px",
  },
  hostNav: {
    marginLeft: "auto",
    marginRight: "5rem",
  },
  loginbtn: {
    backgroundColor: "white",
    color: "black",
    width: "15rem",
    fontSize: "1rem",
    marginLeft: "2rem",
    "&:hover": {
      backgroundColor: "	 #3366ff",
      color: "white",
    },
  },

  propbtn: {
    backgroundColor: "white",
    color: "black",
    width: "15rem",
    fontSize: "1rem",
    marginRight: "2rem",
    "&:hover": {
      backgroundColor: "	 #3366ff",
      color: "white",
    },
  },
  
});

export default function Header(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [disablBtn, setDisablBtn] = React.useState(false)
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    navigate('/profile')
  };



  // async function getProfileDetail() {
  //     try {
  //       const res = await Axios.get(`http://127.0.0.1:8000/api/profiles/${GlobalState.userId}`) 
  //       console.log(res.data )
  //       GlobalDispatch({type: 'catchUserInfo', 
        
  //       usernamevalue: res.data.username,
  //       useridvalue: res.data.seller})
  //     } catch (error) {
  //       console.log(error.response)
  //     }
  
  //   }
  //   getProfileDetail();
    

 

  async function  handleLogout(){
    setAnchorEl(null);
    const confirmLogout = window.confirm("Ae you sure you want to logout ?");
    if(confirmLogout){
      setDisablBtn(true)
      try {
        const res = await Axios.post( "http://127.0.0.1:8000/api-auth-djoser/token/logout/",
           GlobalState.usertoken,
           {
             headers: { Authorization: "Token ".concat(GlobalState.usertoken) },
           })
          
           GlobalDispatch({type: 'catchLogOut'})
         
           setOpenSnackbar(true)
      } catch (error) {
        console.log(error.response)
      }
    };
    }
  
    console.log("userNAME :", GlobalState.userUsername)
    React.useEffect(()=>{
      if(openSnackbar){
        setTimeout(() => {
          navigate(0)
        }, 1500);
      }
    }, [openSnackbar])

  
   
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#302c49" }}>
        <Toolbar>
          <div className={classes.logoNav}>
            <Button color="inherit" onClick={(event) => navigate("/")}>
              <Typography variant="h5">Real Estate</Typography>
            </Button>
          </div>
          <div>
            <Button
              color="inherit"
              style={{ marginRight: "2rem" }}
              onClick={(event) => navigate("/properties")}
            >
              <Typography variant="h7">Properties</Typography>
            </Button>
            <Button color="inherit" style={{ marginLeft: "2rem" }} 
              onClick={(event) => navigate("/agencies") }>
              <Typography variant="h7">Agencies</Typography>
            </Button>
          </div>
          <div className={classes.hostNav}>
            <Button className={classes.propbtn} onClick={()=>navigate('/addproperty')} >Adding Property</Button>
            {props.isLogedIn ? (
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className={classes.loginbtn}
              >
                {GlobalState.userUsername}
                
              </Button>
            ) : (
              <Button
                className={classes.loginbtn}
               
                onClick={(event) => navigate("/login")}
              >
                Login
              </Button>
            )}

            <Menu
              className={classes.menulist}
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem className={classes.profilBtn} onClick={handleClose}>
                Profile
              </MenuItem>
              <MenuItem className={classes.logoutBtn}
                     onClick={handleLogout}  disabled={disablBtn}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
        <Snackbar
        open={openSnackbar}
        message="You have Successfully logged out "
        anchorOrigin={
          {vertical: "bottom", horizontal: "center"}
        }
      />
      </AppBar>

    </>
  );
}
