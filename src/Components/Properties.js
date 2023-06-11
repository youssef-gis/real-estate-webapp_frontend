import React from "react";
import {useNavigate} from "react-router-dom"
import  { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { Icon } from "leaflet";

import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  AppBar,
  CircularProgress,
  IconButton,
  CardActions
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import RoomIcon from "@mui/icons-material/Room";
import Dummydata from "./Assets/Data/Dummydata";

import houseIcon from "./Assets/Mapicons/house.png";
import appartIcon from "./Assets/Mapicons/apartment.png";
import officeIcon from "./Assets/Mapicons/office.png";

const useStyles = makeStyles({
  cardprop: {
    margin: "1rem",
    border: "1px solid black",
    position: "relative",
  },
  picturprop: {
    padding: "1rem",
    paddingTop: "0",
    cursor:'pointer'
  },
  priceprop: {
    fontWeight: "bolder",
    backgroundColor: "blue",
    color: "white",
    zIndex: "1000",
    padding: "5px",
    top: "60px",
    left: "15px",
    position: "absolute",
  },
});

export default function Properties() {
  const classes = useStyles();
  const navigate = useNavigate();
  const initialState = {
    mapInstance: '',

    };
  function functReducer(draft, action){
    switch (action.type) {
      case "catchMapInstance":
        draft.mapInstance = action.mapchosen
        break;
    
      default:
        break;
    }
  };
  const [state, dispatch] = useImmerReducer(functReducer, initialState)
  const houseicon = new Icon({
    iconUrl: houseIcon,
    iconSize: [40, 40],
  });

  const apparticon = new Icon({
    iconUrl: appartIcon,
    iconSize: [40, 40],
  });
  const officeicon = new Icon({
    iconUrl: officeIcon,
    iconSize: [40, 40],
  });
  const [coords, setCoords] = React.useState([51.505, -0.09]);


    function FlyMapTo() {
      const map = useMap();
      dispatch({type: 'catchMapInstance', mapchosen: map})
      return null;
    }

  const polyline = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ]

  const polygon = [
    [51.515, -0.09],
    [51.52, -0.1],
    [51.52, -0.12],
  ]
  // fetch("http://127.0.0.1:8000/api/list_properties/")
  // .then(res=>res.json()).then(data=>console.log(data))
  const [properties, setProperties] = React.useState([])
  const [loadingState, setLoadingState] = React.useState(true)
 
  React.useEffect( ()=>{
    const source = Axios.CancelToken.source();
    async function getProperties(){
      try {
        const res = await Axios.get("http://127.0.0.1:8000/api/list_properties/", {cancelToken: source.token})
        setProperties(res.data)
        setLoadingState(false)
      } catch (error) {
        console.log(error.response)
      }
    }
    getProperties();
    return () => {
      source.cancel()
    }
  } , [state.loadingState])
  console.log(properties)

  if(loadingState === true){
    return(
      <Grid container justifyContent="center" alignItems="center" style={{height: "100vh"}} >
          <CircularProgress />
      </Grid>
    )
  } 
  
  const markerProperties = properties.map((prop) => {
    function displaypopIcon() {
      if (prop.property_type === "House") {
        return houseicon;
      } else if (prop.property_type === "Appartment") {
        return apparticon;
      } else if (prop.property_type === "Office") {
        return officeicon;
      }
    }
    return (
      <Marker
        key={prop.id}
        position={[prop.latitude, prop.longitude]}
        icon={displaypopIcon()}
      >
        <Popup  onClick={()=>navigate(`/properties/${prop.id}`)} >
          <Typography variant="h4">{prop.name}</Typography>
          <img
            src={prop.picture1}
            style={{ width: "19rem", height: "10rem" , cursor:'pointer' }}
            onClick={()=>navigate(`/properties/${prop.id}`)}
            alt="popimg"
          />
          <Typography variant="p">
            {prop.description.substring(0, 200)}...
          </Typography>
          <Button variant="contained" fullWidth  onClick={()=>navigate(`/properties/${prop.id}`)} >
            Details
          </Button>
        </Popup>
      </Marker>
    );
  });


  const cardProperties = properties.map((prop) => {
    return (
      <Card key={prop.id} className={classes.cardprop}>
        <CardHeader title={prop.name}
                    action={
                      <IconButton onClick={()=>{state.mapInstance.flyTo([prop.latitude, prop.longitude], 17)}} >
                        <RoomIcon />
                      </IconButton>
                    } />
        <CardMedia
          component="img"
          onClick={()=>navigate(`/properties/${prop.id}`)}
          className={classes.picturprop}
          image={prop.picture1}
          alt={prop.title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {prop.description.substring(0, 200)}...
          </Typography>
        </CardContent>
        {prop.property_status === "Sale" ? (
          <Typography className={classes.priceprop}>
            {prop.property_type} :  ${prop.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </Typography>
        ) : (
            <Typography className={classes.priceprop}>
            {prop.property_type} :  ${prop.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/{prop.rental_frequency}
          </Typography>
        )}
        <CardActions disableSpacing>
          {prop.seller_agency_name}
        </CardActions>
      </Card>
    );
  });


  return (
    <>
      <Grid container>
        <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
          {cardProperties}
        </Grid>
        <Grid
          item
          xs={8}
          sm={8}
          md={8}
          lg={8}
          xl={8}
          style={{ marginTop: "1rem"}}
        >
          <AppBar position="sticky">
            <div style={{ height: "90vh" }}>
              <MapContainer center={coords} zoom={13} scrollWheelZoom={false}  >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerProperties}
                <FlyMapTo />
              </MapContainer>
            </div>
          </AppBar>
        </Grid>
      </Grid>
    </>
  );
}
