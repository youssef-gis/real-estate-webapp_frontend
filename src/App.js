import React, { useEffect }  from 'react';
import { StyledEngineProvider} from "@mui/material/styles";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './Components/Home';
import Login from './Components/Login';
import Properties from './Components/Properties';
import CssBaseline from "@mui/material/CssBaseline";
import Header from './Components/Header';
import Register from './Components/Register';
import { useImmerReducer } from 'use-immer';
import DispatchContext from './Contexts/DispatchContext';
import StateContext from './Contexts/StateContext';
import AddProperty from './Components/AddProperty';
import Profile from './Components/Profile';
import Agencies from './Components/Agencies';
import Agencydetial from "./Components/Agencydetail";
import PropertyDetail from "./Components/PropertyDetail";

function App() {
  const initialState = {
    userUsername : localStorage.getItem('username'),
    useEmail : localStorage.getItem('email'),
    userId: localStorage.getItem('userid'),
    usertoken : localStorage.getItem('token'),
    isLogedIn : localStorage.getItem('username') ? true : false ,
    phoneNumber :'',
    agencyName :'',
    
  };
  function functReducer(draft, action) {
    switch (action.type) {
      case "catchTokenValue":
        draft.usertoken =action.tokenValue;
      break;
      case "catchUserInfo":
        draft.userUsername = action.usernamevalue;
        draft.useEmail = action.useremailvalue;
        draft.userId = action.useridvalue;
        draft.phoneNumber = action.chosenPhone;
        draft.agencyName = action.chosenAgencyName;
        draft.isLogedIn = true;
        break;
      case "catchLogOut":
        draft.isLogedIn = false;
        break;
      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(functReducer, initialState);

  useEffect(()=>{
    if(state.isLogedIn){
  
      localStorage.setItem("token", state.usertoken)
      localStorage.setItem("username", state.userUsername)
      localStorage.setItem("email", state.useEmail)
      localStorage.setItem("userid", state.userId)
    }
    else {
    
      localStorage.clear()
   
    }
  }, [state.isLogedIn])
 console.log("global state : " +state.userUsername);
  return (
    <StateContext.Provider value={state}>
    <DispatchContext.Provider value={dispatch}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <CssBaseline />
            <Header  username={state.userUsername} isLogedIn = {state.isLogedIn} usertoken = {state.usertoken}/>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path= '/register' element = {<Register />} />
              <Route path='/profile' element={<Profile   userid={state.userId}
                isLogedIn = {state.isLogedIn}   username = {state.userUsername}/>} />
              <Route path= '/properties' element={<Properties />}/>
              <Route path= '/properties/:id' element={<PropertyDetail userid={state.userId}/>}/>
              <Route path= '/addproperty' element={<AddProperty  userid={state.userId}
                isLogedIn = {state.isLogedIn}   username = {state.userUsername} />}/>
              <Route path= '/agencies' element={<Agencies />}/>
              <Route path= '/agencies/:id' element={<Agencydetial />}/>
            </Routes>
          </BrowserRouter>
          </StyledEngineProvider>
      </DispatchContext.Provider>
      </StateContext.Provider>
  );
}

export default App;
