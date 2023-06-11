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
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
  CardActions,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Link,
  Dialog,
  Snackbar,
  DialogTitle
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckBox from '@mui/icons-material/CheckBox';
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import StadiumIcon from './Assets/Mapicons/stadium.png';
import HospitalIcon from './Assets/Mapicons/hospital.png';
import UniversityIcon from './Assets/Mapicons/university.png';

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  imgSlider:{
    position: 'relative',
    borderRadius:"10px",
    width: '25rem',
    height: '20rem',
    margin: 'auto',
    overflow: 'hidden',
    '& img':{
      objectFit: 'cover',
      width: '100%',
      height: '100%',
      transition: 'all 1s ease',
    }

  },
  rightArrow:{
    position: 'absolute',
    top: '50%',
    right: '1rem',
    fontSize: '3rem',
    cursor: 'pointer',
    zIndex: '1000'
  },
  leftArrow:{
    position: 'absolute',
    top: '50%',
    left: '1rem',
    fontSize: '3rem',
    cursor: 'pointer',
    zIndex: '1000'
  }
});

export default function PropertyDetail(props){
    const classes = useStyles();
    const params = useParams();
    const navigate = useNavigate();
    const GlobalState = useContext(StateContext);
    const GlobalDispatch = useContext(DispatchContext);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const stadium = new Icon(
      {
        iconUrl: StadiumIcon,
        iconSize: [35, 35],
      }
      );

    const hospital = new Icon(
        {
          iconUrl: HospitalIcon,
          iconSize: [35, 35],
        }
    )

    const university = new Icon(
      {
        iconUrl: UniversityIcon,
        iconSize: [35, 35],
      }
  )
    const initialState = {
      data: "",
      dataIsLoading: true,
      sellerInfo: "",
      openSnackbar : false, 
      disablBtn : false,
    };
    function funcReducer(draft, action) {
      switch (action.type) {
        case "catchPropertyDetail":
          draft.data = action.data;
          break;
        case "catchDataIsLoading":
          draft.dataIsLoading = action.dataIsLoadedStatus;
          break;
          case "catchUseInfo":
            draft.sellerInfo = action.SellerInfo;
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
    React.useEffect(() => {
      async function getProfileDetail() {
        try {
          const res = await Axios.get(
            `http://127.0.0.1:8000/api/list_properties/${params.id}/`
          );
          dispatch({
            type: "catchPropertyDetail",
            data: res.data,
          });

          console.log(res.data);
        } catch (error) {
          console.log(error.response.data);
        }
      }
      getProfileDetail();
    }, []);
    console.log(state.data);
    const property_pic = [
        state.data.picture1,
        state.data.picture2,
        state.data.picture3,   
    ].filter(pic=>pic !== null);
    const [current_pic, setCurrent_pic] = React.useState(0);
    function nextPicture(){
      if (current_pic === property_pic.length-1) {
        setCurrent_pic(0)
      } else {
        setCurrent_pic(current_pic+1);    
      }
    
    }
    function prevPicture(){
      if (current_pic === 0) {
        setCurrent_pic(property_pic.length-1)
      } else {
        setCurrent_pic(current_pic-1);    
      }
    
    }

    React.useEffect(() => {
      if (state.data){
        async function getProfileDetail() {
          try {
            const res = await Axios.get(
              `http://127.0.0.1:8000/api/profiles/${state.data.seller}/`
            );
            dispatch({
              type: "catchUseInfo",
              SellerInfo: res.data,
            });
            dispatch({
              type: "catchDataIsLoading",
              dataIsLoadedStatus: false,
            });
            console.log(res.data);
          } catch (error) {
            console.log(error.response.data);
          }
        }
        getProfileDetail();
      }
    }, [state.data]);

  

  async function deleteProperty(){
      const confirmDelete = window.confirm('Ae you sure you want to delete this property?') 
      if(confirmDelete){
        try {
          const res = await Axios.delete( `http://127.0.0.1:8000/api/list_properties/${params.id}/delete`)
         
          dispatch({type:'openSnack'})
         
        } catch (error) {
          console.log(error.response);
          dispatch({type: 'allowBtn'})
        }
       
      }
    }

    React.useEffect(()=>{
      if(state.openSnackbar){
        setTimeout(() => {
          navigate('/properties')   
        }, 1500);
      }
    }, [state.openSnackbar])

    if (state.dataIsLoading) {
      return (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      );
    }

  function displaypopIcon(prop) {
      if (prop.type === "Stadium") {
        return stadium;
      } else if (prop.type === "Hospital") {
        return hospital;
      } else if (prop.type === "University") {
        return university;
      }
    }

  

    return(
        <div>
            <Grid item role="presentation"  style={{marginLeft: "1rem", marginTop:'1rem'}} >
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" 
                        onClick={()=>navigate('/properties')} style={{cursor:'pointer'}}>
                    Properties
                    </Link>
                    <Typography color="text.primary" >{state.data.name}</Typography>
                </Breadcrumbs>
            </Grid>
  
                <Grid item container justifyContent="center" alignItems="center" className={classes.imgSlider} >
                              <ArrowCircleLeftIcon onClick={prevPicture} className={classes.leftArrow} />
                            {
                              property_pic.length > 0 ? property_pic.map((pic, index)=>{
                             
                                      return(
                                        <div key={index} >
                                          {
                                              index === current_pic ?(
                                                <CardMedia component="img" src={pic} 
                                                            style={{width:"25rem", height: '20rem'}} 
                                                                    alt='property_pic'
                                                                    
                                                 />
                                              ): ""
                                          }
                
                                        </div>
                                      )
                                  }
                                
                              ) : "No pictures"
                            }
                            <ArrowCircleRightIcon onClick={nextPicture} className={classes.rightArrow} />                   
                </Grid>
                <Grid item container justifyContent="center" alignItems="center" >
                    <Grid item container direction="column" justifyContent="center" alignItems="center" >
                        <Grid item>
                          <Typography variant="h4" style={{marginTop:'1rem'}} >{state.data.name}</Typography>
                        </Grid>

                        <Grid item display={"flex"} >
                          <LocationOnIcon/> <Typography variant="h6"  >{state.data.borough}</Typography>
                        </Grid>
                        
                        <Grid item display={"flex"} >
                          <CalendarMonthIcon/><Typography variant="h6"  >{ new Date(state.data.date_posted).toString().split('GMT')[0]}</Typography>
                        </Grid>                        
                    </Grid>

                    <Grid item container direction="column" alignItems="center" >
                            <Typography variant="h7" style={{fontWeight:'bolder'}} >{state.data.property_type} | 
                                        {state.data.property_status === "Sale" ? 
                                          `$${state.data.price.toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                         :`$${state.data.price.toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${state.data.rental_frequency}`} 
                            </Typography>
                    </Grid>
                </Grid>    

                <Grid item container 
                      justifyContent="flex-start" 
                      style={{border:'1px solid black', marginTop:"1rem", padding:'1rem'}} >
                      {
                        state.data.property_type !== 'Office' && (
                          <Grid item xs={2} >
                            <Typography variant="h6" >{state.data.rooms} Rooms</Typography>
                          </Grid>
                        ) 
                      }
                      {
                        state.data.cctv && (
                          <Grid item xs={2} display="flex" >
                            <CheckBox style={{fontSize:'2rem'}} /> <Typography variant="h6" >CCTV</Typography>
                          </Grid>
                        )
                      }
                      {
                        state.data.elevator && (
                          <Grid item xs={2} display="flex" >
                            <CheckBox style={{fontSize:'2rem'}} /> <Typography variant="h6" >elevator</Typography>
                          </Grid>
                        )
                      }
                      {
                        state.data.furnished && (
                          <Grid item xs={2} display="flex" >
                            <CheckBox style={{fontSize:'2rem'}} /> <Typography variant="h6" >furnished</Typography>
                          </Grid>
                        )
                      }
                      {
                        state.data.parking && (
                          <Grid item xs={2} display="flex" >
                            <CheckBox style={{fontSize:'2rem'}} /> <Typography variant="h6" >parking</Typography>
                          </Grid>
                        )
                      }
                      {
                        state.data.pool && (
                          <Grid item xs={2} display="flex" >
                            <CheckBox style={{fontSize:'2rem'}} /> <Typography variant="h6" >pool</Typography>
                          </Grid>
                        )
                      }
                </Grid>
                
                {state.data.description && (
                <Grid item  style={{border:'1px solid black', margin:"1rem",padding:'1rem'}}  >
                <Typography variant = "h5" >Description: </Typography>
                <Typography variant = "body2" >{state.data.description} </Typography>
                </Grid>
                )}

                <Card
                    style={{
                      width: "30rem",
                      alignItems: "center",
                      marginTop: "0.5rem",
                      marginBottom: "0.5rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                      border: "1px solid black",
                    }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        height="240"
                        style={{ padding: "1rem", width: "30rem" }}
                        onClick={()=>navigate(`/agencies/${state.sellerInfo.seller}`)}
                        image={state.sellerInfo.profile_picture}
                        alt={state.sellerInfo.agency_name}
                      />
                      <CardContent>
                        <Typography  variant="h5" component="div">
                          {state.sellerInfo.agency_name}
                        </Typography>
                        <Typography
                          display="flex"
                          variant="h5"
                          component="div"
                          style={{ alignItems: "center", marginTop: "1rem" }}
                        >
                         
                            <LocalPhoneIcon /> {state.sellerInfo.phone}
                     
                        </Typography>
                        {
                          props.userid === state.data.seller  ?(
                            <Grid item container justifyContent="space-around" >
                                <Button variant="contained" color="primary" onClick={handleClickOpen} >Update</Button>
                                <Button variant="contained" color="error" disabled={state.disablBtn} onClick={deleteProperty} >Delete</Button>
                                <Dialog open={open} onClose={handleClose} fullScreen >
                                  <ProprtyUpdate propertyDetail = {state.data}  closeDialog = {handleClose} />
                                    </Dialog>
                            </Grid>
                          ):""
                        }
                        <Typography>Seller id : {state.data.seller}</Typography>
                        <Typography>User logged in Id : {GlobalState.userId}</Typography>
                      </CardContent>
                    </CardActionArea>
                 </Card>



                 <Grid item container spacing={1} justifyContent={"space-between"} >
                    <Grid item xs={3} style={{overflow:'auto', height:'30rem'}} >
                      {state.data.propertyPoi && (
                        state.data.propertyPoi.map(poi=>{
                          
                          function degreeToRadian(coordinates){
                            return (coordinates*Math.PI)/180
                          }
                          function CalculateDistance() {
                            const latitude1 = degreeToRadian(state.data.latitude);
                            const longitude1 = degreeToRadian(state.data.longitude);
                            const latitude2 = degreeToRadian(poi.location.coordinates[0]);
                            const longitude2 = degreeToRadian(poi.location.coordinates[1]);
                            // The formula
                            const latDiff = latitude2 - latitude1;
                            const lonDiff = longitude2 - longitude1;
                            const R = 6371000 / 1000;
              
                            const a =
                              Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                              Math.cos(latitude1) *
                                Math.cos(latitude2) *
                                Math.sin(lonDiff / 2) *
                                Math.sin(lonDiff / 2);
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              
                            const d = R * c;
              
                            const dist =
                              Math.acos(
                                Math.sin(latitude1) * Math.sin(latitude2) +
                                  Math.cos(latitude1) *
                                    Math.cos(latitude2) *
                                    Math.cos(lonDiff)
                              ) * R;
                            return dist.toFixed(2);
                          }
                          return(
                            <Card
                              key={poi.id}
                              style={{
                                marginBottom: "0.5rem",

                                border: "1px solid black",
                              }}
                            >
                              <CardActionArea>
                                <CardContent>
                                  <Typography
                                    variant="h5"
                                    component="div"
                                    style={{ alignItems: "center" }}
                                  >
                                    {poi.name}
                                  </Typography>
                                  <Typography
                                  variant="h5"
                                    component="div"
                                    style={{ alignItems: "center" }}
                                  >
                                    {poi.type} | 
                                    <span style={{fontWeight:'bold', color:'black'}} >
                                      {CalculateDistance()} km
                                    </span>
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          )
                        })
                      )}
                    </Grid>
                    <Grid item xs={9} style={{height:'30rem', paddingRight:'1rem'}} >
                      <MapContainer
                        center={[state.data.latitude , state.data.longitude]}
                        zoom={13}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[state.data.latitude , state.data.longitude]}
                         
                        >
                          <Popup>{state.data.name}</Popup>
                        </Marker>
                        {
                          state.data.propertyPoi && state.data.propertyPoi.map((poi, index)=>{

                            return(
                              <Marker
                                key={index}
                                position={[poi.location.coordinates[0] , poi.location.coordinates[1] ]}
                                icon={displaypopIcon(poi)}
                              >
                                <Popup>{poi.name}</Popup>
                              </Marker>
                            )
                          }
                        )
                        }
                      
                      </MapContainer>
                    </Grid>
                 </Grid>
                 <Snackbar
                    open={state.openSnackbar}
                    message="You have Successfully Deleted the Property"
                    anchorOrigin={
                      {vertical: "bottom", horizontal: "center"}
                    }
                  />
        </div>
    )
}