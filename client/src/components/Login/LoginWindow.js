/**
 * Primary component for user login. Contains the methods for both
 * the loginForm and SignupForm.
 * Sets the userContext on submit.
 * 
 * This is a supercomponenet to LoginForm and SignupForm
 */
import React, {useEffect, useState} from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert"
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import {useUserContext} from "../../utils/UserContext";
import {useLoginContext} from "../../utils/LoginContext";
function LoginWindow(){
	// password must be 8-32 characters with at least 1
	// capital and lowercase letter, a number, and special character
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/;

	const [login, setLogin] = useLoginContext();
	const [userContext, setUserContext] = useUserContext();
	const [alert, setAlert] = useState({
		show: false,
		message: ""
	})
	useEffect(()=>{
		if (userContext.userId !== ""){
			setInterval(()=>{
				axios.put("/api/online", {
					userId: userContext.userId,
					time: Date.now() + 20000
				})
			}, 5000)
		}
	})


	// Methods that update input's state when user writes into the 
	// username, password, or confirmPassword fields
	const handleUsernameChange = (event)=>{
		setLogin({type:"username", username: event.target.value });
	};
	const handlePasswordChange = (event) => {
		setLogin({ type: "password", password: event.target.value });
	};
	const handleConfirmPasswordChange = (event) => {
		setLogin({ type: "confirmPassword", confirmPassword: event.target.value });
	};
	
	// Close the login window and reset the input State
	const handleClose = () => {
		setLogin({type: "close"});
	};

	// switch the login window to the loginForm and reset input
	const handleLoginPage = () => {
		setLogin({type:"loginPage"});
	};
	// Retrieve the user information using the given username and password info.
	// This uses a POST request because GET requests would store the 
	// password as a visible parameter
	const handleLogin = () =>{
		// Request user information. Will proceed to .then() only if passport returns
		// a successful value
		axios.post("/api/user", login).then((response) => {
			// Update user Context and close window
			setUserContext({ type: "login", data: response.data });
			setLogin({ type: "close" });

		// If passport fails, return an error
		}).catch((err) => {
			setTimeout(closeAlert, 5000);
			setAlert({
				show: true,
				message: "Incorrect Username or Password"
			})
		});
	};

	// switch the login window to the signupForm and reset input
	const handleSignupPage = () => {
		setLogin({type: "signupPage"});
	};
	// Method that does several checks prior to
	// making a POST request for a new user
	const handleSignup = () =>{
		// check that password has all requirements
		if(!login.password.match(regex)){
			setTimeout(closeAlert, 5000);
			setAlert({
				show: true,
				message: "Password must contain a capital, lowercase, number, and special character"
			})
			return;
		}
		// check that password and confirmPassword match
		if(login.password !== login.confirmPassword){
			setTimeout(closeAlert, 5000);
			setAlert({
				show: true,
				message: "Passwords do not match"
			})
			return;
		}
		// Make a POST request
		// If response does not contain an error,
		// update userContext
		// else return an error
		// Signup does not make calls to get notes or categories 
		// because reasonably, new users do not have any
		axios.post("/api/newUser", login).then((response)=>{
			if(!response.data.errors){
				setUserContext({type: "login", data: response.data});
				localStorage.setItem("UserInfo", JSON.stringify(response.data))
				setLogin({ type: "close" });
			}else{
				setTimeout(closeAlert, 5000);
				setAlert({
					show: true,
					message: "Username already taken"
				})
			}
		}).catch((err)=>{});
	};
	const closeAlert = () => {
		setAlert({ show: false, message: "" })
	}
	return (
		// If loginPage is true, create the loginForm component
		// and pass the login methods to it
		// Otherwise, create the SignupForm and pass the signup
		// methods to it 
		<Modal show={login.show} onHide={handleClose} backdrop="static" keyboard={false}>
			<Modal.Header>
				{
					login.loginPage ?
						<Modal.Title>Login</Modal.Title>
						:
						<Modal.Title>Create an account</Modal.Title>
				}
			</Modal.Header>
			<Modal.Body>
				{
					login.loginPage ?
						<LoginForm 
							handleClose={handleClose} 
							handleUsernameChange={handleUsernameChange} 
							handlePasswordChange={handlePasswordChange}
							handleLogin={handleLogin}
						/>
						:
						<SignupForm 
							handleClose={handleClose} 
							handleUsernameChange={handleUsernameChange} 
							handlePasswordChange={handlePasswordChange} 
							handleConfirmPasswordChange={handleConfirmPasswordChange} 
							handleSignup={handleSignup}
						/>
				}
			</Modal.Body>
			<Modal.Footer>
				{
					login.loginPage ?
						<a>Don't have an account? <a onClick={handleSignupPage} href={"#"}>Sign up</a></a>
						:
						<a>Already have an account? <a onClick={handleLoginPage} href={"#"}>Log in</a></a>
				}
			</Modal.Footer>
			<Alert show={alert.show} variant="warning">{alert.message}</Alert>

		</Modal>
	);
}
export default LoginWindow;
