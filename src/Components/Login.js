import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";

import { Button, Grid, Typography, TextField, Snackbar ,Alert } from "@mui/material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  LoginForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "3rem",
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
});

export default function Login() {
  const classes = useStyles();
  const navigate = useNavigate();

  const GlobalDispatch = useContext(DispatchContext);
  const GlobalStateContext = useContext(StateContext);

  const initialState = {
    userNameValue: "",
    userPasswordValue: "",
    userSendRequest: 0,
    token: "",
    openSnackbar : false, 
    disablBtn : false,
    serverError: false,
  };
  function functReducer(draft, action) {
    switch (action.type) {
      case "catchUserNameValue":
        draft.userNameValue = action.userNameChose;
        draft.serverError = false;
        break;

      case "catchUserPasswordValue":
        draft.userPasswordValue = action.userPasswordhose;
        draft.serverError = false;
        break;

      case "changeSendRequest":
        draft.userSendRequest = draft.userSendRequest + 1;
        break;
      case "catchTokenValue":
        draft.token = action.tokenValue;
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
        case  "catchserverError":
            draft.serverError = true;
            break;
      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(functReducer, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({type:"catchdisablBtn"});
  }

  React.useEffect(() => {
    if (state.userSendRequest) {
      const source = Axios.CancelToken.source();
      async function SignIn() {
        try {
          const res = await Axios.post(
            "http://127.0.0.1:8000/api-auth-djoser/token/login/",
            {
              username: state.userNameValue,
              password: state.userPasswordValue,
            },
            { cancelToken: source.token }
          );
          console.log(res);
          dispatch({
            type: "catchTokenValue",
            tokenValue: res.data.auth_token,
          });
          GlobalDispatch({
            type: "catchTokenValue",
            tokenValue: res.data.auth_token,
          });
          dispatch({type:'openSnack'})
         
        } catch (error) {
          console.log(error.response);
          dispatch({type: 'catchallowBtn'})
          dispatch({type:'catchserverError'})
        }
      }
      SignIn();
      return () => {
        source.cancel();
      };
    }
  }, [
    state.userSendRequest,
  ]);

  React.useEffect(() => {
    if (state.token !== "") {
      const source = Axios.CancelToken.source();
      async function GetUserInfo() {
        try {
          const res = await Axios.get(
            "http://127.0.0.1:8000/api-auth-djoser/users/me/",
            {
              headers: { Authorization: "Token ".concat(state.token) },
            },
            { cancelToken: source.token }
          );
          console.log("130 : "+ res.data.id);
          GlobalDispatch({
            type: "catchUserInfo",
            usernamevalue: res.data.username,
            useremailvalue: res.data.email,
            useridvalue: res.data.id,
          });
          
        } catch (error) {
          console.log(error.response);
        }
      }
      GetUserInfo();
      return () => {
        source.cancel();
      };
    }
  }, [GlobalDispatch, state.token]);

  React.useEffect(()=>{
    if(state.openSnackbar){
      setTimeout(() => {
        navigate('/')
      }, 1500);
    }
  }, [state.openSnackbar])

  return (
    <div className={classes.LoginForm}>
      <form onSubmit={FormSubmit}>
        <Grid item container style={{ width: "400px" }}>
          <Typography variant="h3" justifyContent="center">
            Login to your account
          </Typography>
        </Grid>
        {
          state.serverError && (
            <Alert severity="error">Either the username or the password are incorrect</Alert>
          )
        }
       
        <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
          <TextField
            id="username"
            label="username"
            variant="outlined"
            fullWidth
            value={state.userNameValue}
            onChange={(e) =>
              dispatch({
                type: "catchUserNameValue",
                userNameChose: e.target.value,
              })
            }
            error = {state.serverError ? true : false}
          />
        </Grid>

        <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
          <TextField
            id="password"
            label="password"
            variant="outlined"
            fullWidth
            type="password"
            value={state.userPasswordValue}
            onChange={(e) =>
              dispatch({
                type: "catchUserPasswordValue",
                userPasswordhose: e.target.value,
              })
            }
            error = {state.serverError ? true : false}
          />
        </Grid>

        <Grid
          item
          container
          style={{ justifyContent: "center", marginTop: "1rem" }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={state.disablBtn}
            className={classes.loginBtn}
          >
            <Typography variant="h6">Sign In</Typography>
          </Button>
        </Grid>
      </form>

      <Grid item container style={{ justifyContent: "center" }}>
        <Typography variant="small">
          Do not have an account Yet?
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "blue" }}
            
          >
            Sign Up
          </span>
        </Typography>
      </Grid>

      <Snackbar
        open={state.openSnackbar}
        message="You have Successfully logged In"
        anchorOrigin={
          {vertical: "bottom", horizontal: "center"}
        }
      />

    </div>
  );
}
