import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polygon,
} from "react-leaflet";
import { useImmerReducer } from "use-immer";
import Axios from "axios";

import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  Paper,
  Snackbar,
  MenuItem,
  Alert,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import StateContext from "../Contexts/StateContext.js";
import DispatchContext from "../Contexts/DispatchContext.js";

import Camden from "./Assets/Boroughs/Camden";
import Greenwich from "./Assets/Boroughs/Greenwich";
import Hackney from "./Assets/Boroughs/Hackney";
import Hammersmith from "./Assets/Boroughs/Hammersmith";
import Islington from "./Assets/Boroughs/Islington";
import Kensington from "./Assets/Boroughs/Kensington";
import Lambeth from "./Assets/Boroughs/Lambeth";
import Lewisham from "./Assets/Boroughs/Lewisham";
import Southwark from "./Assets/Boroughs/Southwark";
import Hamlets from "./Assets/Boroughs/Hamlets";
import Wandsworth from "./Assets/Boroughs/Wandsworth";
import Westminster from "./Assets/Boroughs/Westminster";
import City_of_London from "./Assets/Boroughs/City_of_London";
import Barking from "./Assets/Boroughs/Barking";
import Barnet from "./Assets/Boroughs/Barnet";
import Bexley from "./Assets/Boroughs/Bexley";
import Brent from "./Assets/Boroughs/Brent";
import Bromley from "./Assets/Boroughs/Bromley";
import Croydon from "./Assets/Boroughs/Croydon";
import Ealing from "./Assets/Boroughs/Ealing";
import Enfield from "./Assets/Boroughs/Enfield";
import Haringey from "./Assets/Boroughs/Haringey";
import Harrow from "./Assets/Boroughs/Harrow";
import Havering from "./Assets/Boroughs/Havering";
import Hillingdon from "./Assets/Boroughs/Hillingdon";
import Hounslow from "./Assets/Boroughs/Hounslow";
import Kingston from "./Assets/Boroughs/Kingston";
import Merton from "./Assets/Boroughs/Merton";
import Newham from "./Assets/Boroughs/Newham";
import Redbridge from "./Assets/Boroughs/Redbridge";
import Richmond from "./Assets/Boroughs/Richmond";
import Sutton from "./Assets/Boroughs/Sutton";
import Waltham from "./Assets/Boroughs/Waltham";

const useStyles = makeStyles({
  RegisterForm: {
    display: "flex",
    position: 'relative',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5rem",
    marginBottom: "5rem",
    marginLeft: "5rem",
    marginRight: "5rem",
    padding: "3rem",
    border: "3px solid black",
    height: "60rem",
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
    value: "",
    label: "",
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
    value: "",
    label: "",
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
    label: "",
    value: "",
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
    label: "",
    value: "",
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

export default function AddProperty(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const GlobalState = React.useContext(StateContext);
  const GlobalDispatch = React.useContext(DispatchContext);
  const initialState = {
    titleValue: "",
    propertyTypeValue: "",
    descriptionValue: "",
    boroughValue: "",
    areaValue: "",
    propertyStatusValue: "",
    priceValue: "",
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    cctvValue: false,
    parkingValue: false,
    picture1Value: "",
    picture2Value: "",
    picture3Value: "",
    mapValue: "",
    latValue: "",
    lngValue: "",
    markerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    uploadedImgs: [],
    sendRequest: 0,
    agencyNameform: "",
    phoneNumberform: "",
    seller:'',
    openSnackBar : false,
    disabledBtn : false,
    titleError : {
      hasError: false,
      errMsg : '',
    },
    PropertyTypeError : {
      hasError: false,
      errMsg : '',
    },
    PropertyStatusError : {
      hasError: false,
      errMsg : '',
    },
    PriceError : {
      hasError: false,
      errMsg : '',
    },
    AreaError : {
      hasError: false,
      errMsg : '',
    },
    BoroughError : {
      hasError: false,
      errMsg : '',
    },
  };
  function functReducer(draft, action) {
    switch (action.type) {
      case "catchTitleValue":
        draft.titleValue = action.titleChose;
        draft.titleError.hasError = false;
        draft.titleError.errMsg = "";
        break;
      case "catchPropertyTypeValue":
        draft.propertyTypeValue = 
        action.propertyTypeChose;
        draft.PropertyTypeError.hasError = false;
        draft.PropertyTypeError.errMsg = "";
        break;
      case "catchDescriptionValue":
        draft.descriptionValue = action.descriptionChose;
        break;
      case "catchAreaValue":
        draft.areaValue = action.areaChose;
        draft.AreaError.hasError = false;
        draft.AreaError.errMsg = "";
        break;
      case "catchBoroughValue":
        draft.boroughValue = action.boroughChose;
        draft.BoroughError.hasError = false;
        draft.BoroughError.errMsg = "";
        break;
      case "catchPropertyStatusValue":
        draft.propertyStatusValue = action.propertyStatusChose;
        draft.PropertyStatusError.hasError = false;
        draft.PropertyStatusError.errMsg = "";
        break;
      case "catchPriceValue":
        draft.priceValue = action.priceValueChose;
        draft.PriceError.hasError = false;
        draft.PriceError.errMsg = "";
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
      case "catchPicture1Value":
        draft.picture1Value = action.picture1ValueChose;
        break;
      case "catchPicture2Value":
        draft.picture2Value = action.picture2ValueChose;
        break;
      case "catchPicture3Value":
        draft.picture3Value = action.picture3ValueChose;
        break;
      case "getMap":
        draft.mapInstance = action.mapData;
        break;
      case "catchLatitudeValue":
        draft.latValue = action.LatitudeChose;
        break;
      case "catchLongitudeValue":
        draft.lngValue = action.LongitudeChose;
        break;
      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latValue = "";
        draft.lngValue = "";
        break;
      case "catchUploadImgs":
        draft.uploadedImgs = action.uploadedImgsChose;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;
      case "catchProfileDetail":
        draft.phoneNumberform = action.chosenPhoneform;
        draft.agencyNameform = action.chosenAgencyNameform;
        draft.seller = action.choseSellerid
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
      case  "catchTitleError":
        if(action.titleChose.length === 0){
        draft.titleError.hasError = true; 
        draft.titleError.errMsg = "This field must not be empty";  
        }
        break;
      case  "catchPropertyTypeError":
          if(action.propertyTypeChose.length === 0){
          draft.PropertyTypeError.hasError = true; 
          draft.PropertyTypeError.errMsg = "This field must not be empty";  
          }
        break;
      case  "catchPropertyStatusError":
            if(action.propertyStatusChose.length === 0){
            draft.PropertyStatusError.hasError = true; 
            draft.PropertyStatusError.errMsg = "This field must not be empty";  
            }
          break;
      case "catchPriceError":
          if(action.priceValueChose.length === 0){
              draft.PriceError.hasError = true;
              draft.PriceError.errMsg = "This field must not be empty";  
            }
          break;
      case "catchAreaError":
            if(action.areaChose.length === 0){
              draft.AreaError.hasError = true;
              draft.AreaError.errMsg = "This field must not be empty";                
            };
          break;
      case "catchBoroughError":
            if(action.boroughChose.length===0){
              draft.BoroughError.hasError = true;
              draft.BoroughError.errMsg = "This field must not be empty";  
            }
          break;
      case "emptyTitle":
        draft.titleError.hasError = true;
        draft.titleError.errMsg = "This field must not be empty"
          break;
      case "emptyPropertyType":
        draft.PropertyTypeError.hasError = true;
        draft.PropertyTypeError.errMsg = "This field must not be empty";
          break;
      case "emptyPropertyStatus":
        draft.PropertyStatusError.hasError = true;
        draft.PropertyStatusError.errMsg = "This field must not be empty";
          break;
      case "emptyPrice":
        draft.PriceError.hasError = true;
        draft.PriceError.errMsg = "This field must not be empty";
          break;
      case "emptyArea":
        draft.AreaError.hasError = true;
        draft.AreaError.errMsg = "This field must not be empty";
          break;
      case "emptyBorough":
        draft.BoroughError.hasError = true;
        draft.BoroughError.errMsg = "This field must not be empty";
          break;
      default:
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(functReducer, initialState);
  console.log("533 outside try block : ",`http://127.0.0.1:8000/api/profiles/${state.seller}`);
  function ThemapComponent() {
    const map = useMap();
    React.useEffect(() => {
      dispatch({ type: "getMap", mapData: map });
    }, []);

    return null;
  }
  React.useEffect(() => {
    if (state.boroughValue === "Camden") {
      state.mapInstance.setView([51.54103467179952, -0.14870897037846917], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.54103467179952,
        changeLongitude: -0.14870897037846917,
      });
    } else if (state.boroughValue === "Greenwich") {
      state.mapInstance.setView([51.486316313935134, 0.005925763550159742], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.486316313935134,
        changeLongitude: 0.005925763550159742,
      });
    } else if (state.boroughValue === "Hackney") {
      state.mapInstance.setView([51.55421119118178, -0.061054618357071246], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.55421119118178,
        changeLongitude: -0.061054618357071246,
      });
    } else if (state.boroughValue === "Hammersmith and Fulham") {
      state.mapInstance.setView([51.496961673854216, -0.22495912738555046], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.496961673854216,
        changeLongitude: -0.22495912738555046,
      });
    } else if (state.boroughValue === "Islington") {
      state.mapInstance.setView([51.54974373783584, -0.10746608414711818], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.54974373783584,
        changeLongitude: -0.10746608414711818,
      });
    } else if (state.boroughValue === "Kensington and Chelsea") {
      state.mapInstance.setView([51.49779579272461, -0.1908227388030137], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.49779579272461,
        changeLongitude: -0.1908227388030137,
      });
    } else if (state.boroughValue === "Lambeth") {
      state.mapInstance.setView([51.457598293463874, -0.12030697867735651], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.457598293463874,
        changeLongitude: -0.12030697867735651,
      });
    } else if (state.boroughValue === "Lewisham") {
      state.mapInstance.setView([51.45263474786279, -0.017657579903930083], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.45263474786279,
        changeLongitude: -0.017657579903930083,
      });
    } else if (state.boroughValue === "Southwark") {
      state.mapInstance.setView([51.47281414549159, -0.07657080658293915], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.47281414549159,
        changeLongitude: -0.07657080658293915,
      });
    } else if (state.boroughValue === "Tower Hamlets") {
      state.mapInstance.setView([51.52222760075287, -0.03427379217816716], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.52222760075287,
        changeLongitude: -0.03427379217816716,
      });
    } else if (state.boroughValue === "Wandsworth") {
      state.mapInstance.setView([51.45221859319854, -0.1910578642162312], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.45221859319854,
        changeLongitude: -0.1910578642162312,
      });
    } else if (state.boroughValue === "Westminster") {
      state.mapInstance.setView([51.51424692365236, -0.1557886924596714], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.51424692365236,
        changeLongitude: -0.1557886924596714,
      });
    } else if (state.boroughValue === "City of London") {
      state.mapInstance.setView([51.51464652712437, -0.09207257068971077], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.51464652712437,
        changeLongitude: -0.09207257068971077,
      });
    } else if (state.boroughValue === "Barking and Dangenham") {
      state.mapInstance.setView([51.54475354441844, 0.13730036835406337], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.54475354441844,
        changeLongitude: 0.13730036835406337,
      });
    } else if (state.boroughValue === "Barnet") {
      state.mapInstance.setView([51.61505810569654, -0.20104146847921367], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.61505810569654,
        changeLongitude: -0.20104146847921367,
      });
    } else if (state.boroughValue === "Bexley") {
      state.mapInstance.setView([51.45784336604241, 0.1386755093498764], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.45784336604241,
        changeLongitude: 0.1386755093498764,
      });
    } else if (state.boroughValue === "Brent") {
      state.mapInstance.setView([51.55847917911348, -0.2623697479848262], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.55847917911348,
        changeLongitude: -0.2623697479848262,
      });
    } else if (state.boroughValue === "Bromley") {
      state.mapInstance.setView([51.37998089785619, 0.056091833685512606], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.37998089785619,
        changeLongitude: 0.056091833685512606,
      });
    } else if (state.boroughValue === "Croydon") {
      state.mapInstance.setView([51.36613815034951, -0.08597242883896719], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.36613815034951,
        changeLongitude: -0.08597242883896719,
      });
    } else if (state.boroughValue === "Ealing") {
      state.mapInstance.setView([51.52350664933499, -0.33384540332179463], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.52350664933499,
        changeLongitude: -0.33384540332179463,
      });
    } else if (state.boroughValue === "Enfield") {
      state.mapInstance.setView([51.650718869158275, -0.07999628038008409], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.650718869158275,
        changeLongitude: -0.07999628038008409,
      });
    } else if (state.boroughValue === "Haringey") {
      state.mapInstance.setView([51.591214467057085, -0.10319530898095737], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.591214467057085,
        changeLongitude: -0.10319530898095737,
      });
    } else if (state.boroughValue === "Harrow") {
      state.mapInstance.setView([51.60218606442213, -0.33540294600548437], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.60218606442213,
        changeLongitude: -0.33540294600548437,
      });
    } else if (state.boroughValue === "Havering") {
      state.mapInstance.setView([51.57230623503768, 0.2256095005492423], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.57230623503768,
        changeLongitude: 0.2256095005492423,
      });
    } else if (state.boroughValue === "Hillingdon") {
      state.mapInstance.setView([51.5430033964411, -0.4435905982156584], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.5430033964411,
        changeLongitude: -0.4435905982156584,
      });
    } else if (state.boroughValue === "Hounslow") {
      state.mapInstance.setView([51.475988836438525, -0.3660060903075389], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.475988836438525,
        changeLongitude: -0.3660060903075389,
      });
    } else if (state.boroughValue === "Kingston upon Thames") {
      state.mapInstance.setView([51.39401320084246, -0.2841003136670212], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.39401320084246,
        changeLongitude: -0.2841003136670212,
      });
    } else if (state.boroughValue === "Merton") {
      state.mapInstance.setView([51.41148120353897, -0.18805584151013174], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.41148120353897,
        changeLongitude: -0.18805584151013174,
      });
    } else if (state.boroughValue === "Newham") {
      state.mapInstance.setView([51.533282275935306, 0.031692014878610064], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.533282275935306,
        changeLongitude: 0.031692014878610064,
      });
    } else if (state.boroughValue === "Redbridge") {
      state.mapInstance.setView([51.585885574074965, 0.07764760021283491], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.585885574074965,
        changeLongitude: 0.07764760021283491,
      });
    } else if (state.boroughValue === "Richmond upon Thames") {
      state.mapInstance.setView([51.450368976651696, -0.30801386088548505], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.450368976651696,
        changeLongitude: -0.30801386088548505,
      });
    } else if (state.boroughValue === "Sutton") {
      state.mapInstance.setView([51.363672040828504, -0.1702200806863363], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.363672040828504,
        changeLongitude: -0.1702200806863363,
      });
    } else if (state.boroughValue === "Waltham Forest") {
      state.mapInstance.setView([51.59466635701797, -0.012215840493378892], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 51.59466635701797,
        changeLongitude: -0.012215840493378892,
      });
    }
  }, [state.boroughValue]);

  function BoroughDisplay() {
    if (state.boroughValue === "Camden") {
      return <Polygon positions={Camden} />;
    } else if (state.boroughValue === "Greenwich") {
      return <Polygon positions={Greenwich} />;
    } else if (state.boroughValue === "Hackney") {
      return <Polygon positions={Hackney} />;
    } else if (state.boroughValue === "Hammersmith and Fulham") {
      return <Polygon positions={Hammersmith} />;
    } else if (state.boroughValue === "Islington") {
      return <Polygon positions={Islington} />;
    } else if (state.boroughValue === "Kensington and Chelsea") {
      return <Polygon positions={Kensington} />;
    } else if (state.boroughValue === "Lambeth") {
      return <Polygon positions={Lambeth} />;
    } else if (state.boroughValue === "Lewisham") {
      return <Polygon positions={Lewisham} />;
    } else if (state.boroughValue === "Southwark") {
      return <Polygon positions={Southwark} />;
    } else if (state.boroughValue === "Tower Hamlets") {
      return <Polygon positions={Hamlets} />;
    } else if (state.boroughValue === "Wandsworth") {
      return <Polygon positions={Wandsworth} />;
    } else if (state.boroughValue === "Westminster") {
      return <Polygon positions={Westminster} />;
    } else if (state.boroughValue === "City of London") {
      return <Polygon positions={City_of_London} />;
    } else if (state.boroughValue === "Barking and Dangenham") {
      return <Polygon positions={Barking} />;
    } else if (state.boroughValue === "Barnet") {
      return <Polygon positions={Barnet} />;
    } else if (state.boroughValue === "Bexley") {
      return <Polygon positions={Bexley} />;
    } else if (state.boroughValue === "Brent") {
      return <Polygon positions={Brent} />;
    } else if (state.boroughValue === "Bromley") {
      return <Polygon positions={Bromley} />;
    } else if (state.boroughValue === "Croydon") {
      return <Polygon positions={Croydon} />;
    } else if (state.boroughValue === "Ealing") {
      return <Polygon positions={Ealing} />;
    } else if (state.boroughValue === "Enfield") {
      return <Polygon positions={Enfield} />;
    } else if (state.boroughValue === "Haringey") {
      return <Polygon positions={Haringey} />;
    } else if (state.boroughValue === "Harrow") {
      return <Polygon positions={Harrow} />;
    } else if (state.boroughValue === "Havering") {
      return <Polygon positions={Havering} />;
    } else if (state.boroughValue === "") {
      return <Polygon positions={Havering} />;
    } else if (state.boroughValue === "Hillingdon") {
      return <Polygon positions={Hillingdon} />;
    } else if (state.boroughValue === "Hounslow") {
      return <Polygon positions={Hounslow} />;
    } else if (state.boroughValue === "Kingston") {
      return <Polygon positions={Kingston} />;
    } else if (state.boroughValue === "Merton") {
      return <Polygon positions={Merton} />;
    } else if (state.boroughValue === "Newham") {
      return <Polygon positions={Newham} />;
    } else if (state.boroughValue === "Redbridge") {
      return <Polygon positions={Redbridge} />;
    } else if (state.boroughValue === "Richmond") {
      return <Polygon positions={Richmond} />;
    } else if (state.boroughValue === "Sutton") {
      return <Polygon positions={Sutton} />;
    } else if (state.boroughValue === "Waltham") {
      return <Polygon positions={Waltham} />;
    }
  }
  const markerRef = React.useRef(null);
  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: "catchLatitudeValue",
          LatitudeChose: marker.getLatLng().lat,
        });
        dispatch({
          type: "catchLongitudeValue",
          LongitudeChose: marker.getLatLng().lng,
        });
        //console.log(marker.getLatLng())
      },
    }),
    []
  );

  React.useEffect(() => {
    if (state.uploadedImgs[0]) {
      dispatch({
        type: "catchPicture1Value",
        picture1ValueChose: state.uploadedImgs[0],
      });
    }
    if (state.uploadedImgs[1]) {
      dispatch({
        type: "catchPicture2Value",
        picture2ValueChose: state.uploadedImgs[1],
      });
    }
    if (state.uploadedImgs[2]) {
      dispatch({
        type: "catchPicture3Value",
        picture3ValueChose: state.uploadedImgs[2],
      });
    }
  }, [state.uploadedImgs]);

  React.useEffect(()=>{
    async function getProfileDetail() {
      try {
        const res = await Axios.get(`http://127.0.0.1:8000/api/profiles/${GlobalState.userId}`) 
        console.log(res.data )
        console.log("inside try block : ",`http://127.0.0.1:8000/api/profiles/${GlobalState.userId}`);
        dispatch({type: 'catchProfileDetail', 
          chosenPhoneform: res.data.phone ,
          chosenAgencyNameform: res.data.agency_name,
          choseSellerid:res.data.seller, 
            });
        GlobalDispatch({type: 'catchUserInfo', 
   
        chosenPhone: res.data.phone, 
        chosenAgencyName: res.data.agency_name,
        useridvalue: res.data.seller})
      } catch (error) {
        console.log(error.response)
      }
  
    }
    getProfileDetail();
    
  },[])

  function FormSubmit(e) {
    e.preventDefault();
    if(!state.titleError.hasError && !state.PropertyTypeError.hasError 
        && !state.propertyTypeValue.hasError && !state.PriceError.hasError
        && ! state.AreaError.hasError && !state.BoroughError.hasError && state.latValue && state.lngValue){
      dispatch({ type: "changeSendRequest" });
      dispatch({type:'catchdisabledBtn'});
    } else if(state.titleValue === ""){
      dispatch({type:'emptyTitle'})
      window.scroll(0,0)
    } else if(state.propertyTypeValue === ""){
      dispatch({type:'emptyPropertyType'})
      window.scroll(0,0)
    } else if(state.propertyStatusValue === ""){
      dispatch({type:'emptyPropertyStatus'})
      window.scroll(0,0)
    }   else if(state.priceValue === ""){
      dispatch({type:'emptyPrice'})
      window.scroll(0,0)
    }   else if(state.areaValue === ""){
      dispatch({type:'emptyArea'})
      window.scroll(0,0)
    }   else if(state.boroughValue === ""){
      dispatch({type:'emptyBorough'})
      window.scroll(0,0)
    }  
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
      return "Price*";
    }
  }

  React.useEffect(() => {
    if (state.sendRequest) {
    async function sendProperty() {
      const formdata = new FormData();
      formdata.append("name", state.titleValue);
      formdata.append("description", state.descriptionValue);
      formdata.append("areas", state.areaValue);
      formdata.append("borough", state.boroughValue);
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
      formdata.append("latitude", state.latValue);
      formdata.append("longitude", state.lngValue);
      formdata.append("picture1", state.picture1Value);
      formdata.append("picture2", state.picture2Value);
      formdata.append("picture3", state.picture3Value);
      formdata.append("seller", state.seller  );
      console.log("after clicking submitting button: " + GlobalState.userId );
      try {
   
          const res = await Axios.post(
            "http://127.0.0.1:8000/api/list_properties/create/",
            formdata
          );
          console.log("response data: ",res.data);
 
          dispatch({type:"catchSnackBar"});
          console.log("993 opensnackbar in post request: "+state.openSnackBar);
        
        } catch (error) {
          console.log(error.response.data);
          dispatch({type:'catchAllowdBtn'});
 
          
        }
    }
    sendProperty();

  }}, [
    state.sendRequest
  ]);
  

  function SubmitState() {
    console.log(GlobalState.isLogedIn);
    if(GlobalState.isLogedIn && 
      state.agencyNameform !== '' && 
      state.agencyNameform !== null &&
      state.phoneNumberform !=="" && 
      state.phoneNumberform !== null){
        return(
          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={state.disabledBtn}
            className={classes.registerBtn}
          >Submit</Button>
        )
      } else if(GlobalState.isLogedIn && 
        (state.agencyNameform === '' || 
        state.agencyNameform === null || 
        state.phoneNumberform ==="" || 
        state.phoneNumberform === null)){
        return(
          <Button
            variant="outlained"
            fullWidth
            onClick={()=>navigate('/profile')}
            className={classes.registerBtn}
          >Please Complete your Profile to add a Property</Button>
        )
      } else if (!GlobalState.isLogedIn){
        return(
          <Button
            variant="outlained"
            fullWidth
            onClick={()=>navigate('/login')}
            className={classes.registerBtn}
          >Please Sign In to add a Property</Button>
        )
      }
  }
  React.useEffect(()=>{
    if(state.openSnackBar){
      setTimeout(() => {
        navigate("/properties");
      }, 1500);
    }
  },[state.openSnackBar])
  console.log("outside the block ", GlobalState.username);
  return (
    <div className={classes.RegisterForm}>
    
 
      <form onSubmit={FormSubmit}>
        <Grid item container style={{ position:'absolute', marginLeft:"10rem"}}>
          <Typography variant="h5" justifyContent="center">
            Submit Your Property
          </Typography>
        </Grid>
        <Grid item container style={{ width: "100%", marginTop: "1rem"}}>
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
            onBlur={(e) =>
              dispatch({
                type: "catchTitleError",
                titleChose: e.target.value,
              })
            }
            error = {state.titleError.hasError ? true : false}
            helperText={ state.titleError.errMsg }
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

            onBlur={(e) =>
              dispatch({
                type: "catchPropertyTypeError",
                propertyTypeChose: e.target.value,
              })
            }
            error={state.PropertyTypeError.hasError ?
                     true : false}
            helperText={state.PropertyTypeError.errMsg}
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
              
              onBlur={(e) =>
                dispatch({
                  type: "catchPropertyStatusError",
                  propertyStatusChose: e.target.value,
                })
              }
              error= {state.PropertyStatusError.hasError ? true : false}
              helperText = {state.PropertyStatusError.errMsg}
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
              label="Rental Frequency"
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
            onBlur={(e) =>
              dispatch({
                type: "catchPriceError",
                priceValueChose: e.target.value,
              })
            }
            error= {state.PriceError.hasError ? true:false}
            helperText = {state.PriceError.errMsg}
          />
        </Grid>

        <Grid item container style={{ width: "100%" }}>
          {state.propertyTypeValue !== "Office" ? (
            <TextField
              id="roomsValue"
              type="number"
              label="Rooms"
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
          <Grid item style={{ width: "50%" }}>
            <TextField
              id="area"
              label="Area*"
              variant="standard"
              fullWidth
              select
              value={state.areaValue}
              onChange={(e) =>
                dispatch({
                  type: "catchAreaValue",
                  areaChose: e.target.value,
                })
              }
              onBlur={(e) =>
                dispatch({
                  type: "catchAreaError",
                  areaChose: e.target.value,
                })
              }
              error = {state.AreaError.hasError?true:false}
              helperText = {state.AreaError.errMsg}
            >
              <MenuItem value={"Inner London"}>Inner London</MenuItem>
              <MenuItem value={"Outer London"}>Outer London</MenuItem>
            </TextField>
          </Grid>
          <Grid item style={{ width: "50%" }}>
            <TextField
              id="borough"
              label="Borough*"
              variant="standard"
              fullWidth
              value={state.boroughValue}
              onChange={(e) =>
                dispatch({
                  type: "catchBoroughValue",
                  boroughChose: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
              onBlur={(e) =>
                dispatch({
                  type: "catchBoroughError",
                  boroughChose: e.target.value,
                })
              }
              error = {state.BoroughError.hasError?true:false}
              helperText = {state.BoroughError.errMsg}
            >
              {state.areaValue === "Inner London"
                ? innerLondonOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : ""}
              {state.areaValue === "Outer London"
                ? outerLondonOptions.map((option) => {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    );
                  })
                : ""}

            </TextField>
          </Grid>
        </Grid>

        <Grid item  style={{ marginTop: "1rem" }}>
              {state.latValue && state.lngValue ?(
                <Alert severity="success" > 
                  Your property is located at {state.latValue}, {state.lngValue} 
                </Alert>
              ):(
                <Alert severity="warning" >Please locate your property before submitting the form</Alert>
              ) }
        </Grid>
        <Grid item container style={{ height: "15rem" }}>
          <MapContainer
            center={state.markerPosition}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ThemapComponent />
            {BoroughDisplay()}
            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={state.markerPosition}
              ref={markerRef}
            ></Marker>
          </MapContainer>
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

        <Grid item container style={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            className={classes.imgBtn}
            component="label"
          >
            <Typography variant="h8">Upload 3 pictures</Typography>
            <input
              type="file"
              multiple
              hidden
              accept="image/jpeg, image/png, image/gif"
              onChange={(e) => {
                dispatch({
                  type: "catchUploadImgs",
                  uploadedImgsChose: e.target.files,
                });
              }}
            />
          </Button>
        </Grid>
        <Grid
          item
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {state.picture1Value && <Grid item>{state.picture1Value.name}</Grid>}
          {state.picture2Value && <Grid item>{state.picture2Value.name}</Grid>}
          {state.picture3Value && <Grid item>{state.picture3Value.name}</Grid>}
        </Grid>

        <Grid
          item
          container
          style={{ justifyContent: "center", marginBottom: "1rem" }}
        >
          {SubmitState()}
        </Grid>
      </form>
      <Snackbar 
      open={state.openSnackBar}
      message="You have Successfully Submitted a Property"
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
