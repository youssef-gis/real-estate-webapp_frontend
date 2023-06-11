import React from "react";
import { Button, Typography } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles"

import city from'./Assets/city.jpg'


const useStyles = makeStyles({
  logoNav : {
    marginRight:"auto",
    alignItems: "center",
    backgroundColor:"white",
    color:"black",
    borderRadius: "5px"
  },
  hostNav : {
    marginLeft:"auto",
    marginRight: "5rem"
  },
  loginbtn: {
    backgroundColor:"white",
    color:"black",
    width:"15rem",
    fontSize:'1rem',
    marginLeft:'2rem',
    '&:hover':{
      backgroundColor:"	 #3366ff",
      color:"white"
    }

  },
  
  propbtn:{
    backgroundColor:"white",
    color:"black",
    width:"15rem",
    fontSize:'1rem',
    marginRight:'2rem',
    '&:hover':{
      backgroundColor:"	 #3366ff",
      color:"white"
    }
  },
  homePage:{
    position:"relative",
  },
  content:{
    position:"absolute",
    textAlign:'center',
    top:"4rem",
    zIndex:"100"

  },
  WelcomeTxt:{
    fontWeight:'bolder',
    color:'white'
  },
  homeBtn: {
    fontSize:'1.6rem',
    borderRadius: '14px',
    marginTop:'1.3rem',
    '&:hover':{
      backgroundColor:"green",
      color:"white"
    }
  }
})

export default function Home() {
  const classes = useStyles()
  return (
    <>
   
      <div className={classes.homePage} >
      <img src={city}  alt='background' width={"100%"} height={"585vh"} />
      <div className={classes.content}>
        <Typography variant="h1" className={classes.WelcomeTxt}>
          Explore The Best Properties in Your area
        </Typography>
        <Button variant="contained" className={classes.homeBtn} >Find Your Next Property</Button>
      </div>
      </div>
    </>
  );
}
