import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

import { Button, Grid, Typography, TextField, Snackbar } from "@mui/material";

import { makeStyles } from "@mui/styles";

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
    uploaded_profile_picture: [],
    profile_picture: props.profile_picture,
    agencyNameform: props.agency_name,
    phoneNumberform: props.phone,
    aboutsellerForm: props.about,
    sendRequest: 0,
    openSnackbar : false, 
    disablBtn : false,
  };
  function funcReducer(draft, action) {
    switch (action.type) {
      case "catchAgencyNameForm":
        draft.agencyNameform = action.chosenAgencyNameForm;
        break;
      case "catchPhoneNumberForm":
        draft.phoneNumberform = action.chosenPhoneNumberForm;
        break;
      case "catchAboutSeller":
        draft.aboutsellerForm = action.chosenaboutsellerForm;
        break;
      case "catchUploadedProfilePicture":
        draft.uploaded_profile_picture = action.uploadedImgChose;
        break;
      case "catchProfilePicture":
        draft.profile_picture = draft.uploaded_profile_picture[0];
        break;
      case "catchSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "openSnack":
          draft.openSnackbar = true;
          break;
      case  "catchdisablBtn":
          draft.disablBtn = true;
          break;
      case  "catchallowBtn":
            draft.disablBtn = false;
            break;
        default:
          break;
    }
  }
  const [state, dispatch] = useImmerReducer(funcReducer, initialState);
  console.log(props.phone);
  React.useEffect(() => {
    if (state.uploaded_profile_picture[0]) {
      dispatch({
        type: "catchProfilePicture",
        profile_picture: state.uploaded_profile_picture[0],
      });
    }
  }, [state.uploaded_profile_picture[0]]);

  function formSubmit(e) {
    e.preventDefault();
    dispatch({ type: "catchSendRequest" });
    dispatch({type:"catchdisablBtn"})
  }

  React.useEffect(() => {
    if (state.sendRequest) {
      async function updatProfile() {
        const formData = new FormData();
        if(typeof state.profile_picture === "string" || state.profile_picture === null){
            formData.append("user", GlobalState.userId);
            formData.append("phone", state.phoneNumberform);
            formData.append("agency_name", state.agencyNameform);
            formData.append("about", state.aboutsellerForm);
        } else {
            formData.append("user", GlobalState.userId);
            formData.append("phone", state.phoneNumberform);
            formData.append("agency_name", state.agencyNameform);
            formData.append("profile_picture", state.profile_picture);
            formData.append("about", state.aboutsellerForm);
        }
        try {
          const res = await Axios.patch(
            `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/update/`,
            formData
          );
          console.log(res.data);
          dispatch({type:'openSnack'})
      
        } catch (error) {
          console.log(error.response.data);
          dispatch({type: 'allowBtn'})
        }
      }
      updatProfile();
    }
  }, [state.sendRequest]);

  function displayProfile() {
    if (typeof state.profile_picture !== "string") {
      return (
        <Grid item>{state.profile_picture && state.profile_picture.name}</Grid>
      );
    } else if (typeof state.profile_picture === "string") {
      return (
        <Grid item style={{ marginLeft: "auto", marginRight: "auto" }}>
          <img
            src={state.profile_picture}
            style={{ width: "5em", height: "5rem" }}
            alt="profile_pic"
          />
        </Grid>
      );
    }
  }
  console.log(state.profile_picture )
  React.useEffect(()=>{
    if(state.openSnackbar){
      setTimeout(() => {
        navigate(0)
      }, 1500);
    }
  }, [state.openSnackbar])
  return (
    <>
      <div className={classes.LoginForm}>
        <form onSubmit={formSubmit}>
          <Grid item container>
            <Typography variant="h4" justifyContent="center">
              Seller Profile
            </Typography>
          </Grid>
          <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
            <TextField
              id="agencyName"
              label="agency name* "
              variant="outlined"
              fullWidth
              defaultValue={state.agencyName}
              value={state.agencyNameform}
              onChange={(e) =>
                dispatch({
                  type: "catchAgencyNameForm",
                  chosenAgencyNameForm: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
            <TextField
              id="about"
              label="About The Seller"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              value={state.aboutsellerForm}
              onChange={(e) =>
                dispatch({
                  type: "catchAboutSeller",
                  chosenaboutsellerForm: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
            <TextField
              id="phonenumber"
              label="Phone number*"
              variant="outlined"
              fullWidth
              value={state.phoneNumberform}
              onChange={(e) =>
                dispatch({
                  type: "catchPhoneNumberForm",
                  chosenPhoneNumberForm: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item container>
            {displayProfile()}
          </Grid>

          <Grid item container style={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              className={classes.imgBtn}
              component="label"
            >
              <Typography variant="h8">Upload Profile picture</Typography>
              <input
                type="file"
                hidden
                accept="image/jpeg, image/png, image/gif"
                onChange={(e) => {
                  dispatch({
                    type: "catchUploadedProfilePicture",
                    uploadedImgChose: e.target.files,
                  });
                }}
              />
            </Button>
          </Grid>

          <Grid
            item
            container
            style={{ justifyContent: "center", marginTop: "1rem" }}
          >
            <Button
              variant="contained"
              type="submit"
              className={classes.loginBtn}
              disabled={state.disablBtn}
            >
              <Typography variant="h6">Update </Typography>
            </Button>
          </Grid>
        </form>
        <Snackbar
        open={state.openSnackbar}
        message="You have Successfully Updated your profile"
        anchorOrigin={
          {vertical: "bottom", horizontal: "center"}
        }
      />
      </div>
    </>
  );
}
