import React from "react";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import { Button, Grid, Typography, TextField, Snackbar , Alert } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  RegisterForm: {
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
  registerBtn: {
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

export default function Register() {
  const classes = useStyles();
  const navigate = useNavigate();

  const initialState = {
    userNameValue: "",
    userEmailValue: "",
    userPasswordValue: "",
    userConfirmPasswordValue: "",
    userSendRequest: 0,
    openSnackBar : false,
    disabledBtn : false,
    userNameError : {
      hasError : false,
      errorMessg : '',
    },
    userEmailError : {
      hasError : false,
      errorMessg : '',
    },
    userPasswordError : {
      hasError : false,
      errorMessg : '',
    },
    userPswdConfirmErrTxt : '',
    userNameErrMsg : '',
    userEmailErrMsg : '',
    pswrdNumericErrMsg :'',
    pswrdCommonErrMsg:'',
    pswrdSimilarErrMsg:'',
    userPasswordConfirmError : {
      hasError : false,
      errorMessg : '',
    },
  };
  function functReducer(draft, action) {
    switch (action.type) {
      case "catchUserNameValue":
        draft.userNameValue = action.userNameChose;
        draft.userNameError.hasError = false;
        draft.userNameError.errorMessg = "";
        draft.userNameErrMsg = "";
        break;
      case "catchUserEmailValue":
        draft.userEmailValue = action.userEmailChose;
        draft.userEmailError.hasError = false;
        draft.userEmailError.errorMessg = "";
        draft.userEmailErrMsg = "";
        break;
      case "catchUserPasswordValue":
        draft.userPasswordValue = action.userPasswordhose;
        draft.userPasswordError.hasError = false;
        draft.userPasswordError.errorMessg = '';
        draft.pswrdSimilarErrMsg = "";
        draft.pswrdCommonErrMsg = "";
        draft.pswrdNumericErrMsg = "";
        break;
      case "catchUserConfirmPasswordValue":
        draft.userConfirmPasswordValue =action.userConfirmPasswordChose;
        if(action.userConfirmPasswordChose !== draft.userConfirmPasswordValue){
            draft.userPswdConfirmErrTxt = "password must match"
        } else if (action.userConfirmPasswordChose === draft.userConfirmPasswordValue) {
            draft.userPswdConfirmErrTxt = ""; 
        }
        draft.userPasswordConfirmError.hasError = false;
        draft.userPasswordConfirmError.errorMessg = "";
        break;
      case "changeSendRequest":
        draft.userSendRequest = draft.userSendRequest + 1;
        break;
        case "catchSnackBar":
          draft.openSnackBar = true;
          break;
        case "catchdisabledBtn":
          draft.disabledBtn = true;
          break;
        case "catchAllowdBtn":
          draft.disabledBtn = false;
          break;
        case "catchUsernameError":
          if(action.userNameError.length === 0){
            draft.userNameError.hasError = true;
            draft.userNameError.errorMessg = 'This field must not be empty';
          }
          else if (action.userNameError.length < 5){
            draft.userNameError.hasError = true;
            draft.userNameError.errorMessg = 'This field must have at least  five characters';
          }
          else if (!/^([a-zA-Z0-9]+)$/.test(action.userNameError)){
            draft.userNameError.hasError = true;
            draft.userNameError.errorMessg = 'This field must not have Special characters';             
          }
          break;
        case "catchuserEmailError":
            if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(action.userEmailErrorchosen)){
              draft.userEmailError.hasError = true;
              draft.userEmailError.errorMessg = 'Please Provide a valid Email';
            }
          break;

        case "catchuserPasswodError":
            if(action.userPasswordErrorchosen.length < 8){
              draft.userPasswordError.hasError = true;
              draft.userPasswordError.errorMessg = 'A password must have at least eight characters';
            }
          break;
        case "catchuserNameErrMsg":
            draft.userNameErrMsg = "This User Name already Exits"
          break;
        case "catchuserEmailErrMsg":
            draft.userEmailErrMsg = "This Email already Exits"
          break;
        case "catchuPswrdSimilarErrMsg":
            draft.pswrdSimilarErrMsg = "The password is too similar to the username."
          break;
        case "catchuPswrdCommonErrMsg":
            draft.pswrdCommonErrMsg = "This password is too common." 
          break;
        case "catchuPswrdNumericErrMsg":
            draft.pswrdNumericErrMsg = "This password is entirely numeric."
          break;
          case "catchuserPasswodConfirmError":
            if(draft.userPasswordValue !== action.userConfirmPasswordChose){
            draft.userPasswordConfirmError.hasError = true;
            draft.userPasswordConfirmError.errorMessg = "The two password fields didn't match."
            } else if(draft.userPasswordValue === action.userConfirmPasswordChose){
            draft.userPasswordConfirmError.hasError = false;
            draft.userPasswordConfirmError.errorMessg = ""
        
            }
            break;
      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(functReducer, initialState);

  function FormSubmit(e) {
    e.preventDefault();
    if(!state.userNameError.hasError && !state.userEmailError.hasError
       && !state.userPasswordError.hasError && state.userPswdConfirmErrTxt === ""){
      dispatch({ type: "changeSendRequest" });
      dispatch({type:'catchdisabledBtn'});
    }

  }

  React.useEffect(() => {
    if (state.userSendRequest) {
      const source = Axios.CancelToken.source();
      async function SignUp() {
        try {
          const res = await Axios.post(
            "http://127.0.0.1:8000/api-auth-djoser/users/",
            {
              username: state.userNameValue,
              email: state.userEmailValue,
              password: state.userPasswordValue,
              re_password: state.userConfirmPasswordValue,
            },
            { cancelToken: source.token }
          );
          console.log(res);
          dispatch({type:"catchSnackBar"});

        
        } catch (error) {
          console.log(error.response);
          dispatch({type:'catchAllowdBtn'});
          if(error.response.data.username){
            dispatch({type: 'catchuserNameErrMsg'})
          }else if(error.response.data.email){
            dispatch({type: 'catchuserEmailErrMsg'})
          } else if (error.response.data.password[0] === "The password is too similar to the username."){
            dispatch({type:"catchuPswrdSimilarErrMsg"})
          } else if (error.response.data.password[0] === "This password is too common."){
            dispatch({type:"catchuPswrdCommonErrMsg"})
          } else if (error.response.data.password[0] === "This password is entirely numeric."){
            dispatch({type:"catchuPswrdNumericErrMsg"})
          }
          else if(error.response.data.non_field_errors){
            dispatch({type: "catchuserPasswodConfirmError"})
          }
        }
      }
      SignUp();
      return () => {
        source.cancel();
      };
    }
  }, [
    state.userSendRequest,
  ]);

  React.useEffect(()=>{
    if(state.openSnackBar){
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  },[state.openSnackBar])
  console.log(" password value"+state.userPasswordValue);
  console.log("Confirm password value"+state.userConfirmPasswordValue);
  return (
    <div className={classes.RegisterForm}>
      <form onSubmit={FormSubmit}>
        <Grid item container style={{ width: "400px" }}>
          <Typography variant="h3" justifyContent="center">
            Create an account
          </Typography>
        </Grid>
            {state.userNameErrMsg && (<Alert severity="error" >{state.userNameErrMsg}</Alert>)}
            {state.userEmailErrMsg && (<Alert severity="error" >{state.userEmailErrMsg}</Alert>)}
            {state.pswrdSimilarErrMsg && (<Alert severity="error" >{state.pswrdSimilarErrMsg}</Alert>)}
            {state.pswrdCommonErrMsg && (<Alert severity="error" >{state.pswrdCommonErrMsg}</Alert>)}
            {state.pswrdNumericErrMsg && (<Alert severity="error" >{state.pswrdNumericErrMsg}</Alert>)}
            {state.userPasswordConfirmError.errorMessg && (<Alert severity="error" >{state.userPasswordConfirmError.errorMessg}</Alert>)}
        <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
          <TextField
            id="username"
            label="username"
            variant="outlined"
            fullWidth
            value={state.userNameValue}
            onBlur={(e) =>
              dispatch({
                type: "catchUsernameError",
                userNameError: e.target.value,
              })
            }
            onChange={(e) =>
              dispatch({
                type: "catchUserNameValue",
                userNameChose: e.target.value,
              })
            }
            error = {state.userNameError.hasError ? true : false}
            helperText = {state.userNameError.errorMessg}
          />
        </Grid>

        <Grid item container style={{ width: "400px", marginBottom: "1rem" }}>
          <TextField
            id="email"
            label="email"
            variant="outlined"
            fullWidth
            type="email"
            value={state.userEmailValue}
            onChange={(e) =>
              dispatch({
                type: "catchUserEmailValue",
                userEmailChose: e.target.value,
              })
            }
            onBlur={(e) =>
              dispatch({
                type: "catchuserEmailError",
                userEmailErrorchosen: e.target.value,
              })
            }
            error = {state.userEmailError.hasError ? true: false}
            helperText = {state.userEmailError.errorMessg}
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
            onBlur={(e) =>
              dispatch({
                type: "catchuserPasswodError",
                userPasswordErrorchosen: e.target.value,
              })
            }
            error = {state.userPasswordError.hasError ? true: false}
            helperText = {state.userPasswordError.errorMessg}
          />
        </Grid>

        <Grid item container style={{ width: "400px" }}>
          <TextField
            id="password_confirm"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            type="password"
            value={state.userConfirmPasswordValue}
            onChange={(e) =>
              dispatch({
                type: "catchUserConfirmPasswordValue",
                userConfirmPasswordChose: e.target.value,
              })

            }
            onBlur={(e) =>
              dispatch({
                type: "catchuserPasswodConfirmError",
                userConfirmPasswordChose: e.target.value,
              })
            }
            error = {state.userPasswordConfirmError.hasError ? true: false}
            helperText = {state.userPasswordConfirmError.errorMessg}  />
        
        </Grid>
        <Grid
          item
          container
          style={{ justifyContent: "center", marginTop: "1rem" }}
        >
          <Button
            variant="contained"
            type="submit"
            disabled={state.disabledBtn}
            className={classes.registerBtn}
          >
            <Typography variant="h6">Register</Typography>
          </Button>
        </Grid>
        <Grid item container style={{ justifyContent: "center" }}>
          <Typography variant="small">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Sign In
            </span>
          </Typography>
        </Grid>
      </form>
      <Snackbar 
      open={state.openSnackBar}
      message="You have Successfully Created an account"
      anchorOrigin={
        {
          vertical:"bottom",
          horizontal:"center"
        }
      }
      />
 
    </div>
  );
}
