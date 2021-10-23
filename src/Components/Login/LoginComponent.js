import React from 'react';
import './LoginComponent.scss';
import axios from 'axios';
import {BrowserRouter as Router, Route, Redirect, Switch, withRouter} from 'react-router-dom';
import NavHeader from "../NavHeader/NavHeader";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import DataSearchEngine from "../DataSearchEngine/DataSearchEngine";
import ParseNStore from "../ParseNStore/ParseNStore";




class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = localStorage.getItem("app_state") ? JSON.parse(localStorage.getItem("app_state")) : {
            passAccount: {
                email: "",
                password: ""
            },
            errorMessage: "",
            token: "",
            //authenticated: false,
            loading: false
        };

    }


    generateOTP = async (email) => {
        //this.state.passAccount.email === 'Email' ? this.setState({errorMessage:'Please enter a valid email'}) : axios.post(`http://localhost:5000/otp/generate-passcode/${this.state.passAccount.email.toString()}`, this.state.passAccount)
        //Note in axios, we pass url, {data} as an object, {config} as an object as well.
        //let emailArgToken;

        //console.log(emailArgToken);
        if(undefined || email === undefined || email.length < 2){
            this.setState({errorMessage: `fields Need to have an input!`});
        }else{
            await axios.post(`http://3.17.144.146:5000/auth/generate-passcode`, {email}, {withCredentials: true})
                .then((response) => {
                    //let result = response.data;
                    //this.setState({errorMessage: "Code Sent To Email!"});
                    //console.log(`response: ` + response.data.message);
                    this.setState({errorMessage: `${response.data.message}`});
                }).catch((error) => {
                    //console.log(error);
                    this.setState({errorMessage: `${JSON.stringify(error.response.data.message)}`});
                });


        }

    }



    handleChange = (event) =>{
        console.log("input detected!");
        const {name, value} = event.target;
        this.setState({passAccount:{...this.state.passAccount, [name]: value}});
    }



    handleSubmit = (event) => {
        //console.log(`Form Submitted Successfully`);
        event.preventDefault();
    }



    //method for confirming the email and One-Time-Passowrd
    confirmPassCode = async (email, otpcode) => {
        let result;
        let stateAccount;
        let authToken;
        let storedCookie;

        try {
            //confirming passcode
            result = await axios.post(`http://3.17.144.146:5000/auth/findbyemail`, {email: email, otpcode: otpcode}, {withCredentials: true});

            //loading
            this.setState({loading: true});


            stateAccount = this.state.passAccount
            stateAccount.email = email;
            stateAccount.password = otpcode
            this.setState({stateAccount});


            //console.log(result);

            if (this.state.passAccount.email === result.headers.email && this.state.passAccount.password === result.headers.otpcode) {
                //console.log(`Permisson Granted!`);
                this.setState({errorMessage: "Permission Granted"});


                authToken = result.headers.accesstoken;
                this.setState({token: authToken});
                //console.log("My Access Token: ", authToken);

                //this.addCookies();
                localStorage.setItem("accessToken", this.state.token);
                //change to accessToken and test to see if it works or no
                storedCookie = localStorage.getItem("app_state");
                //this.setState({authenticated: true});

            } else {
                //console.log(`Permisson Denied!`);
                this.setState({errorMessage: "Permission Denied!"});
            }


            let history = this.props.history;


            //check the accessToken, if not found/expired/tampered with then
            //console.log(this.state.token);
            //console.log(storedCookie);

            if (storedCookie) {
                this.setState({errorMessage: "Permisson Granted!"});
                this.setState({loading: false});
                //console.log(`found cookie: ${storedCookie}`);
                history.push({pathname: "/data/retrieval/list", state: {stateAccount}});

            } else {
                this.setState({loading: false});
                this.setState({errorMessage: "Token Mismatch - Permission Denied!"});
            }


        } catch (error) {

            this.setState({errorMessage: `${JSON.stringify(error.response.data.message)}`});
        }
    }


    addCookies = () => {
        /**** client side cookies */
        //1) save the accessToken in local storage
        return localStorage.setItem("accessToken", this.state.token);
    }


    notLoggedInhomePage = () => {
        let storedToken = localStorage.getItem("accessToken");
        if (!storedToken) {
            return (
                <form className="form_container" onSubmit={this.handleSubmit}>

                    <label htmlFor="email_field" className="email_label">Email Address</label>
                    <input type="text" className="email_field" value={this.state.passAccount.email} onChange={this.handleChange} placeholder="Enter Email Address" name="email"/>

                    <label htmlFor="password_field" className="password_label">Password</label>
                    <input type="password" className="password_field" value={this.state.passAccount.password} onChange={this.handleChange} placeholder="Enter One Time Password" name="password"/>

                    <hr className="horizontal_separator" />
                    <div className="error_message_container">
                        eee
                        {this.state.errorMessage}
                    </div>

                    {/**this.state.errorMessage.concat("Please check your email, to access the portal using the link sent.") */}
                    <button type="submit" className="generate_passcode_button" onClick={() => this.generateOTP(this.state.passAccount.email.toString())}>Get OTP</button>
                    <button type="submit" className="confirm_credentials_button" onClick={() => {
                        this.confirmPassCode(String(this.state.passAccount.email), String(this.state.passAccount.password));
                    }}>
                        Sign In</button>
                </form>
            );
        }

        if (storedToken && this.props.location.pathname === "/") {
            return (<Redirect to="/data/retrieval/list"/>);
        }

    }


    componentDidUpdate(prevProps, prevState) {
        if (this.state.token !== prevState.token) { //set a new state if token changes
            localStorage.setItem("app_state", JSON.stringify(this.state));
        }
    }


    render(){
        let storedAccessToken = localStorage.getItem("accessToken");


        return(
                <div className="main_app">
                    <h1 className="form_header_text">Nuspire Data Logging & Retrieval System</h1>
                    {this.notLoggedInhomePage()}
                </div>
        );
    }


}

export default withRouter(LoginComponent);

