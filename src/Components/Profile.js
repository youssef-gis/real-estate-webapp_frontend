import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";
import ProfileUpdate from "./ProfileUpdate";
import {
  Button,
  Grid,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import defaultprofilepic from "../Components/Assets/defaultProfilePicture.jpg"

const useStyles = makeStyles({
  LoginForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem",
    marginTop: "1rem",
    marginLeft: "5rem",
    marginRight: "5rem",
    padding: "3rem",
    border: "3px solid black",
  },
  loginBtn: {
    backgroundColor: "white",
    color: "black",
    width: "15rem",
    fontSize: "1rem",
    border: "1px solid black",
    "&:hover": {
      backgroundColor: "#3366ff",
      color: "white",
    },
  },
  imgBtn: {
    backgroundColor: "gray",
    color: "black",
    width: "8rem",
    fontSize: "0.5rem",
    border: "1px solid black",
    marginBottom: "0.7rem",
  },
});

export default function Profile(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const initialState = {
    userProfile:{
      phoneNumber: "",
      agencyName: "",
      profilepic: "",
      about: "",
      sellerId: "",
      seller_properties: [],
    },  
    dataIsLoading: true,
  };
  function funcReducer(draft, action) {
    switch (action.type) {
      case "catchProfileDetail":
        draft.userProfile.phoneNumber = action.profileDta.phone;
        draft.userProfile.agencyName = action.profileDta.agency_name;
        draft.userProfile.profilepic =action.profileDta.profile_picture;
        draft.userProfile.about = action.profileDta.about;
        draft.userProfile.sellerId = action.profileDta.seller;
        draft.userProfile.seller_properties  = action.profileDta.seller_properties;
        break;
      case "catchDataIsLoading":
        draft.dataIsLoading = false;
        break;
      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(funcReducer, initialState);
  React.useEffect(() => {
    async function getProfileDetail() {
      try {
        const res = await Axios.get(
          `http://127.0.0.1:8000/api/profiles/${props.userid}`
        );
        dispatch({
          type: "catchProfileDetail",
          profileDta: res.data,
        });
        dispatch({
          type: "catchDataIsLoading"
        });
        console.log(res.data);
      } catch (error) {
        console.log(error.response.data);
      }
    }
    getProfileDetail();
  }, []);

  function headerDisplay() {
    if (
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === "" ||
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === ""
    ) {
      return (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          Please {props.username} Submit this Form to update your
          profile
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            border: "3px solid black",
            padding: "3px",
            marginTop: "1rem",
          }}
        >
          <Grid item xs={6}>
         
              <img
                style={{ height: "10rem", width: "15rem" }}
                src={state.userProfile.profilepic !== null ? 
                  state.userProfile.profilepic : defaultprofilepic}
                alt="profile_pic"
              />
       
          </Grid>

          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            xs={6}
          >
            <Grid item>
              <Button
                onClick={()=>navigate(`/agencies/${state.userProfile.sellerId}`)}
                style={{ textAlign: "center", margin: "1rem" }} >
                <Typography
                  variant="h5"
                >
                   Welcome {props.username} 
                   <br/>
                   You have {state.userProfile.seller_properties.length} Listed Proerties
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <>
      {headerDisplay()}
      <ProfileUpdate phone={state.userProfile.phoneNumber}
                     agency_name = {state.userProfile.agencyName}
                     profile_picture = {state.userProfile.profilepic}
                     about = {state.userProfile.about}
                     seller_properties = {state.userProfile.seller_properties} />
    </>
  );
}
