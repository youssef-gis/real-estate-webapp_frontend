import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../Contexts/DispatchContext";
import StateContext from "../Contexts/StateContext";
import ProfileUpdate from "./ProfileUpdate";

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
} from "@mui/material";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({});

export default function Profile() {
  const classes = useStyles();
  const params = useParams();
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const GlobalDispatch = useContext(DispatchContext);

  const initialState = {
    data: [],
    dataIsLoading: true,
  };
  function funcReducer(draft, action) {
    switch (action.type) {
      case "catchProfileDetail":
        draft.data = action.data;
        break;
      case "catchDataIsLoading":
        draft.dataIsLoading = action.dataIsLoadedStatus;
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
          `http://127.0.0.1:8000/api/profiles/${params.id}/`
        );
        dispatch({
          type: "catchProfileDetail",
          data: res.data,
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
  }, []);
  console.log(state.data);

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

  return (
    <>
      <Card
        style={{
          width: "30rem",
          alignItems: "center",
          marginTop: "0.5rem",
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
            image={state.data.profile_picture}
            alt={state.data.agency_name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {state.data.agency_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {state.data.about}
            </Typography>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              style={{ alignItems: "center", marginTop: "1rem" }}
            >
              <IconButton>
                <LocalPhoneIcon /> {state.data.phone}
              </IconButton>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Grid
        item
        container
        spacing={1}
        style={{ marginTop: "0.5rem", marginLeft: "auto", marginRight: "auto" }}
      >
        {state.data.seller_properties.map((seller) => {
          return (
            <Grid
              item
              key={seller.id}
              direction="row"
              style={{ padding: "10px", width: "20rem" }}
            >
              <Card>
                <CardMedia
                  image={
                    `http://127.0.0.1:8000${seller.picture1}`
                      ? `http://127.0.0.1:8000${seller.picture1}`
                      : defaultprofilepic
                  }
                  onClick={()=>navigate(`/properties/${seller.id}`)}
                  title="profile picture"
                  style={{ height: "10rem" , cursor:'pointer'}}
                  component="img"
                />

                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {seller.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {seller.description}...
                  </Typography>
                </CardContent>

                <CardActions>
                  {seller.property_status === "Sale"
                    ? `${seller.property_type} :  $ ${seller.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} `
                    : `${seller.property_type} :  $ ${seller.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} /${
                        seller.rental_frequency
                      }`}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
