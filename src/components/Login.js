import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history=useHistory();
  const [isLoading,setIsLoading] =useState(false);
  const [formData, setFormData]=useState({
    username: "", password: "" 
  });

  let handleInput = (e)=>{
      // const name=e.target.name;
      // const value=e.target.value
      setFormData((preState) =>({
        ...preState,
        [e.target.name]: e.target.value,
      }))
  }



  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  // const login = async (formData) => {
  //   if(!validateInput(formData)) return;
  //   setIsLoading(true);
  //   try{
  //     const data={
  //       username : formData.username,
  //       password: formData.password
  //     };
  //      let response =await axios.post(`${config.endpoint}/auth/login`,formData);
  //       persistLogin(response.data.token, response.data.username,response.data.balance);
  //       // Redirect to products page
  //      history.push("/")

  //      if(response.data.success){
  //       enqueueSnackbar("Logged in successfully",{variant:"success"})
  //      }

  //   }
  //   //catch function close
  //   catch(e){  
  //           if(e.response && e.response.status ===400){
  //             enqueueSnackbar(e.response.data.massage,{variant:"error"});
  //           }else{
  //             enqueueSnackbar(
  //              "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
  //              { variant: 'error' }
  //             )
  //             }
  //            }
  //            setIsLoading(false)

  // };
  const login = async (formData) => {
    if (!validateInput(formData)) return;
    console.log(formData);
    try {
      const response = await axios.post(
        `${config.endpoint}/auth/login`,
        formData
      );

      console.log(response);

      persistLogin(
        response.data.token,
        response.data.username,
        response.data.balance
      );
      enqueueSnackbar("Logged in  Successful", { varient: "success" });
      history.push("/");

      setFormData({ username: "", password: "" });
    } catch (e) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
    }
    
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    let {username,password} =data;
    if(!username){
      enqueueSnackbar("Username is a required field",{variant:"warning"})
      return false
    }
    if(!password){
      enqueueSnackbar("Password is a required field",{variant:"warning"})
      return false
    }
    return true
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
   const persistLogin = (token, username, balance) => {
    window.localStorage.setItem("token",token);
    window.localStorage.setItem("username",username);
    window.localStorage.setItem("balance",balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
           id="username"
           label="Username"
           variant="outlined"
           title="Username"
           name="username"
           placeholder="Enter Username"
           value={formData.username}
           onChange={handleInput}
           fullWidth
           />
           
           <TextField
            id="password"
            label="Password"
            variant="outlined"
            title="Password"
            type="password"
            helperText="Password must be at least 6 characters length"
            name="password"
            placeholder="Enter a Password with munimum 6 characterspres"
            value={formData.password}
            onChange={handleInput}

            />

              {isLoading?( <Box sx={{ display: 'flex',justifyContent:"center" }}>
                    <CircularProgress color="success" />
                   </Box>)
                  :(<Button 
                  className="button" 
                  variant="contained" 
                  onClick={() => login(formData)}
                  >
            LOGIN TO QKART
           </Button>
                  )}
                  <p className=".secondary-action">
                    Don't have an account?{" "}
                  </p>
                  <Link className="link" to="/register">
                    Register now
                  </Link>

        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
