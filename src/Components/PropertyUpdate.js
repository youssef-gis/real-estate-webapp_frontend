import React, { useContext } from "react";
import { useNavigate,
   useParams } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    Polygon,
  } from "react-leaflet";
import { Icon } from "leaflet";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";
import ProfileUpdate from "./ProfileUpdate";
import ProprtyUpdate from "./PropertyUpdate";
import defaultprofilepic from "../Components/Assets/defaultProfilePicture.jpg";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  Paper,
  MenuItem,
  Link,
  Dialog,
  DialogTitle,
  Snackbar,
  DialogActions
} from "@mui/material";


import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    RegisterForm: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "5rem",
      marginBottom: "5rem",
      marginLeft: "5rem",
      marginRight: "5rem",
      padding: "3rem",
      border: "3px solid black",
      height: "50rem",
    },
    registerBtn: {
      backgroundColor: "white",
      color: "black",
      width: "15rem",
      fontSize: "1rem",
      marginTop: "1rem",
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
  
  const innerLondonOptions = [
    {
      value: '',
      label: '',
    },
    {
      value: "Camden",
      label: "Camden",
    },
    {
      value: "Greenwich",
      label: "Greenwich",
    },
    {
      value: "Hackney",
      label: "Hackney",
    },
    {
      value: "Hammersmith and Fulham",
      label: "Hammersmith and Fulham",
    },
    {
      value: "Islington",
      label: "Islington",
    },
    {
      value: "Kensington and Chelsea",
      label: "Kensington and Chelsea",
    },
    {
      value: "Lambeth",
      label: "Lambeth",
    },
    {
      value: "Lewisham",
      label: "Lewisham",
    },
    {
      value: "Southwark",
      label: "Southwark",
    },
    {
      value: "Tower Hamlets",
      label: "Tower Hamlets",
    },
    {
      value: "Wandsworth",
      label: "Wandsworth",
    },
    {
      value: "Westminster",
      label: "Westminster",
    },
    {
      value: "City of London",
      label: "City of London",
    },
  ];
  
  const outerLondonOptions = [
    {
      value:'',
      label: '',
    },
    {
      value: "Barking and Dangenham",
      label: "Barking and Dangenham",
    },
    {
      value: "Barnet",
      label: "Barnet",
    },
    {
      value: "Bexley",
      label: "Bexley",
    },
    {
      value: "Brent",
      label: "Brent",
    },
    {
      value: "Bromley",
      label: "Bromley",
    },
    {
      value: "Croydon",
      label: "Croydon",
    },
    {
      value: "Ealing",
      label: "Ealing",
    },
    {
      value: "Enfield",
      label: "Enfield",
    },
    {
      value: "Haringey",
      label: "Haringey",
    },
    {
      value: "Harrow",
      label: "Harrow",
    },
    {
      value: "Havering",
      label: "Havering",
    },
    {
      value: "Hillingdon",
      label: "Hillingdon",
    },
    {
      value: "Hounslow",
      label: "Hounslow",
    },
    {
      value: "Kingston upon Thames",
      label: "Kingston upon Thames",
    },
    {
      value: "Merton",
      label: "Merton",
    },
    {
      value: "Newham",
      label: "Newham",
    },
    {
      value: "Redbridge",
      label: "Redbridge",
    },
    {
      value: "Richmond upon Thames",
      label: "Richmond upon Thames",
    },
    {
      value: "Sutton",
      label: "Sutton",
    },
    {
      value: "Waltham Forest",
      label: "Waltham Forest",
    },
  ];
  
  const propertyType = [
    {
      label: " ",
      value: " ",
    },
    {
      label: "Appartment",
      value: "Appartment",
    },
    {
      label: "Office",
      value: "Office",
    },
    {
      label: "House",
      value: "House",
    },
  ];
  
  const propertyStatus = [
    {
      label:'',
      value: '',
    },
    {
      label: "Rent",
      value: "Rent",
    },
    {
      label: "Sale",
      value: "Sale",
    },
  ];
  
  const rentalFrequency = [
    {
      label: "",
      value: "",
    },
    {
      label: "Day",
      value: "Day",
    },
    {
      label: "Week",
      value: "Week",
    },
    {
      label: "Month",
      value: "Month",
    },
  ];
  
export default function PropertyDetail(props){

    const classes = useStyles();
    const navigate = useNavigate();
    const GlobalState = React.useContext(StateContext);
    const GlobalDispatch = React.useContext(DispatchContext);
    const initialState = {
      titleValue: String(props.propertyDetail.name),
      propertyTypeValue: String(props.propertyDetail.property_type) ,
      descriptionValue: String(props.propertyDetail.description)  ,
      propertyStatusValue: String(props.propertyDetail.property_status)  ,
      priceValue: String(props.propertyDetail.price) ,
      rentalFrequencyValue: String(props.propertyDetail.rental_frequency)  ,
      roomsValue: String(props.propertyDetail.rooms) ,
      furnishedValue: Boolean( props.propertyDetail.furnished),
      poolValue: Boolean(props.propertyDetail.rooms),
      elevatorValue: Boolean(props.propertyDetail.elevator) ,
      cctvValue: Boolean(props.propertyDetail.cctv),
      parkingValue: Boolean(props.propertyDetail.parking),
      sendRequest: 0,
      agencyNameform: String(props.propertyDetail.seller_agency_name),
      phoneNumberform: String(props.propertyDetail.seller_username)  ,
      seller:String(props.propertyDetail.seller),
      openSnackbar : false, 
      disablBtn : false,
    };
    function functReducer(draft, action) {
      switch (action.type) {
        case "catchTitleValue":
          draft.titleValue = action.titleChose;
          break;
        case "catchPropertyTypeValue":
          draft.propertyTypeValue = action.propertyTypeChose;
          break;
        case "catchDescriptionValue":
          draft.descriptionValue = action.descriptionChose;
          break;
        case "catchPropertyStatusValue":
          draft.propertyStatusValue = action.propertyStatusChose;
          break;
        case "catchPriceValue":
          draft.priceValue = action.priceValueChose;
          break;
        case "catchRentalFrequencyValue":
          draft.rentalFrequencyValue = 
          action.rentalFrequencyChose;
          break;
        case "catchRoomsValue":
          draft.roomsValue = action.roomsValueChose;
          break;
        case "catchFurnishedValue":
          draft.furnishedValue = action.furnishedValueChose;
          break;
        case "catchPoolValue":
          draft.poolValue = action.poolValueChose;
          break;
        case "catchElevatorValue":
          draft.elevatorValue = action.elevatorValueChose;
          break;
        case "catchCctvValue":
          draft.cctvValue = action.cctvValueChose;
          break;
        case "catchParkingValue":
          draft.parkingValue = action.parkingValueChose;
          break;
        case "changeSendRequest":
          draft.sendRequest = draft.sendRequest + 1;
          break;
        case "catchProfileDetail":
          draft.phoneNumberform = action.chosenPhoneform;
          draft.agencyNameform = action.chosenAgencyNameform;
          draft.seller = action.choseSellerid
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
    const [state, dispatch] = useImmerReducer(functReducer, initialState);
  

 
  
    function FormSubmit(e) {
      e.preventDefault();
      dispatch({ type: "changeSendRequest" });
      dispatch({type:"catchdisablBtn"})
    }
    // {GlobalState.userId && console.log(GlobalState.userId)};
  
    function priceLabel() {
      if (
        state.propertyStatusValue === "Rent" &&
        state.rentalFrequencyValue === "Day"
      ) {
        return "Price Per Day*";
      } else if (
        state.propertyStatusValue === "Rent" &&
        state.rentalFrequencyValue === "Week"
      ) {
        return "Price Per Week*";
      } else if (
        state.propertyStatusValue === "Rent" &&
        state.rentalFrequencyValue === "Month"
      ) {
        return "Price Per Month*";
      } else {
        return "Price";
      }
    }
  
    React.useEffect(() => {
      if (state.sendRequest) {
      async function sendProperty() {
        const formdata = new FormData();
        if(state.propertyTypeValue === "Office"){
            formdata.append("name", state.titleValue);
            formdata.append("description", state.descriptionValue);
            formdata.append("property_status", state.propertyStatusValue);
            formdata.append("property_type", state.propertyTypeValue);
            formdata.append("price", state.priceValue);
            formdata.append("rental_frequency", state.rentalFrequencyValue);
       
            formdata.append("furnished", state.furnishedValue);
            formdata.append("pool", state.poolValue);
            formdata.append("elevator", state.elevatorValue);
            formdata.append("cctv", state.cctvValue);
            formdata.append("parking", state.parkingValue);
            formdata.append("seller", GlobalState.userId );
        } else {
            formdata.append("name", state.titleValue);
            formdata.append("description", state.descriptionValue);
            formdata.append("property_status", state.propertyStatusValue);
            formdata.append("property_type", state.propertyTypeValue);
            formdata.append("price", state.priceValue);
            formdata.append("rental_frequency", state.rentalFrequencyValue);
            formdata.append("rooms", state.roomsValue);
            formdata.append("furnished", state.furnishedValue);
            formdata.append("pool", state.poolValue);
            formdata.append("elevator", state.elevatorValue);
            formdata.append("cctv", state.cctvValue);
            formdata.append("parking", state.parkingValue);
            formdata.append("seller", GlobalState.userId );
        }
             
        try {
     
            const res = await Axios.patch(
              `http://127.0.0.1:8000/api/list_properties/${props.propertyDetail.id}/update/`,
              formdata
            );
            console.log("response data: ",res.data);
          
            dispatch({type:'openSnack'})
         
            } catch (error) {
            console.log(error.response);
            dispatch({type: 'allowBtn'})
        }
      }
      sendProperty();
    
    }}, [
      state.sendRequest
    ]);
    
    console.log(typeof  props.property_type)
    React.useEffect(()=>{
        if(state.openSnackbar){
          setTimeout(() => {
            navigate(0)
          }, 1500);
        }
      }, [state.openSnackbar])
    
    return (
        <div className={classes.RegisterForm}>
        
     
          <form onSubmit={FormSubmit}>
            <Grid item container style={{ width: "100%" }}>
              <Typography variant="h3" justifyContent="center">
                Submit Your Property
              </Typography>
            </Grid>
            <Grid item container style={{ width: "100%" }}>
              <TextField
                id="title"
                label="title*"
                variant="standard"
                fullWidth
                value={state.titleValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchTitleValue",
                    titleChose: e.target.value,
                  })
                }
              />
            </Grid>
    
            <Grid item container style={{ width: "100%" }}>
              <TextField
                id="propertyType"
                label="Property Type*"
                variant="standard"
                fullWidth
                value={state.propertyTypeValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPropertyTypeValue",
                    propertyTypeChose: e.target.value,
                  })
                }
                select
                SelectProps={{ native: true }}
              >
                {propertyType.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
    
            <Grid item container>
              <Grid item style={{ width: "50%" }}>
                <TextField
                  id="propertyStatus"
                  label="Property Status*"
                  variant="standard"
                  fullWidth
                  value={state.propertyStatusValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchPropertyStatusValue",
                      propertyStatusChose: e.target.value,
                    })
                  }
                  select
                  SelectProps={{
                    native: true,
                  }}
                >
                  {propertyStatus.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item style={{ width: "50%" }}>
                <TextField
                  id="rentalFrequency"
                  label="Rental Frequency*"
                  variant="standard"
                  fullWidth
                  disabled={state.propertyStatusValue === "Sale" ? true : false}
                  value={state.rentalFrequencyValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchRentalFrequencyValue",
                      rentalFrequencyChose: e.target.value,
                    })
                  }
                  select
                  SelectProps={{
                    native: true,
                  }}
                >
                  {rentalFrequency.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
    
            <Grid item container style={{ width: "100%" }}>
              <TextField
                id="price"
                label={priceLabel()}
                type="number"
                variant="standard"
                fullWidth
                value={state.priceValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchPriceValue",
                    priceValueChose: e.target.value,
                  })
                }
              />
            </Grid>
    
            <Grid item container style={{ width: "100%" }}>
              {state.propertyTypeValue !== "Office" ? (
                <TextField
                  id="roomsValue"
                  type="number"
                  label="Number of Rooms*"
                  variant="standard"
                  fullWidth
                  value={state.roomsValue}
                  onChange={(e) =>
                    dispatch({
                      type: "catchRoomsValue",
                      roomsValueChose: e.target.value,
                    })
                  }
                />
              ) : (
                ""
              )}
            </Grid>
            <Grid item container style={{ width: "100%", marginTop: "1rem" }}>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                multiline
                rows={6}
                fullWidth
                value={state.descriptionValue}
                onChange={(e) =>
                  dispatch({
                    type: "catchDescriptionValue",
                    descriptionChose: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid
              item
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item>
                <FormControlLabel
                  control={<Checkbox checked={state.furnishedValue} />}
                  label="Furnished"
                  onChange={(e) =>
                    dispatch({
                      type: "catchFurnishedValue",
                      furnishedValueChose: e.target.checked,
                    })
                  }
                />
              </Grid>
    
              <Grid item>
                <FormControlLabel
                  control={<Checkbox checked={state.poolValue} />}
                  label="Pool"
                  onChange={(e) =>
                    dispatch({
                      type: "catchPoolValue",
                      poolValueChose: e.target.checked,
                    })
                  }
                />
              </Grid>
    
              <Grid item>
                <FormControlLabel
                  control={<Checkbox checked={state.elevatorValue} />}
                  label="Elevator"
                  onChange={(e) =>
                    dispatch({
                      type: "catchElevatorValue",
                      elevatorValueChose: e.target.checked,
                    })
                  }
                />
              </Grid>
    
              <Grid item>
                <FormControlLabel
                  control={<Checkbox checked={state.cctvValue} />}
                  label="CctV"
                  onChange={(e) =>
                    dispatch({
                      type: "catchCctvValue",
                      cctvValueChose: e.target.checked,
                    })
                  }
                />
              </Grid>
    
              <Grid item>
                <FormControlLabel
                  control={<Checkbox checked={state.parkingValue} />}
                  label="Parking"
                  onChange={(e) =>
                    dispatch({
                      type: "catchParkingValue",
                      parkingValueChose: e.target.checked,
                    })
                  }
                />
              </Grid>
            </Grid>

            <Grid
              item
              container
              style={{ justifyContent: "center", marginBottom: "1rem" }}

            >
                <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={state.disablBtn}
                    className={classes.registerBtn}
                >Update
                </Button>
            </Grid>
          </form>
          <DialogActions>
            <Button onClick={props.closeDialog}>Cancel</Button>
          </DialogActions>
          <Snackbar
                open={state.openSnackbar}
                message="You have Successfully Updated your Property"
                anchorOrigin={
                {vertical: "bottom", horizontal: "center"}
                }
        />
        </div>
      );
}