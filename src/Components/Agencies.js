import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";
import ProfileUpdate from "./ProfileUpdate";

import defaultprofilepic from "../Components/Assets/defaultProfilePicture.jpg"
import {
  Button,
  Grid,
  Typography,
  TextField,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

export default function Profile() {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const initialState = {
    agencyList: [],
    dataIsLoading: true,
  };
  function funcReducer(draft, action) {
    switch (action.type) {
      case "catchAgencies":
        draft.agencyList = action.agenciesData;
        break;
      case "catchlodingStatus":
        draft.dataIsLoading = false;
        break;

      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(funcReducer, initialState);
  React.useEffect(() => {
    async function getAgencies() {
      try {
        const res = await Axios.get("http://127.0.0.1:8000/api/profiles/");
        dispatch({ type: "catchAgencies", agenciesData: res.data });
      } catch (error) {
        console.log(error.response.data);
      }
    }
    getAgencies();
    dispatch({ type: "catchlodingStatus" });
  }, []);
  console.log(state.agencyList);
  if (state.dataIsLoading) {
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

  function propertyLabel(agency){
    if(agency.seller_properties.length > 1 ){
        return(
          
            <Button size="small" onClick={()=>navigate(`/agencies/${agency.seller}`)}  > {agency.seller_properties.length} properties for sell </Button>
        )}
    else if(agency.seller_properties.length === 1){
        return(
            <Button size="small" onClick={()=>navigate(`/agencies/${agency.seller}`)} > A property for sell </Button>
        )
    }else{
        return(
            <Button size="small" onClick={()=>navigate(`/agencies/${agency.seller}`)} > No prperty for sell </Button>
        )
    }
    
   
  }
  console.log(GlobalState.userUsername);
  return (
    <Grid item container   direction="row" justifyContent="flex-start" style={{padding: "10px",}}  spacing={1} >
         {state.agencyList && (
          state.agencyList.map((agency) => {
            if (agency.agency_name !== "" && agency.phone !== ""){
                return(
                    <Grid item key={agency.id} style={{   width:'15rem'}}>
                        <Card >
                        <CardMedia image={agency.profile_picture ? agency.profile_picture: defaultprofilepic} 
                        title="profile picture" style={{ height:"15rem", marginTop:"1", padding: "10px",}} component="img"/>
                        
                        <CardContent>
                        <Typography gutterBottom variant="h5">
                            {agency.agency_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {agency.about && agency.about.substring(0, 120)}...
                        </Typography>
                        </CardContent>
                        <CardActions>
                            {propertyLabel(agency)}
                        </CardActions>
                    </Card>
                    </Grid>
                )
            }
     })
         )}
    </Grid>
    );
}


