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
import forge from "node-forge";
function LoginWindow(){
	// password must be 8-32 characters with at least 1
	// capital and lowercase letter, a number, and special character
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,32}$/;
	const rsa = forge.rsa;

	// access context objects
	const [login, setLogin] = useLoginContext();
	const [userContext, setUserContext] = useUserContext();
	
	// an alert if login fails
	const [alert, setAlert] = useState({
		show: false,
		message: ""
	})

	// After a user has logged in, ping the server to update online status
	// Interval runs every 5 seconds
	useEffect(()=>{
		if (userContext.loggedIn){

			const interval = setInterval(()=>{
				axios.put("/api/online", {
					userId: userContext.userId,
				})
			}, 5000)
			// Required so multiple intervals are not made
			return ()=>clearInterval(interval);
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
			// If login is successful, make a public keypair.
			// Public key is sent to the server. Private key is stored in in a context variable
			rsa.generateKeyPair({bits: 2048}, (err, keypair)=>{
				axios.post("/api/publicKey", {userId: response.data.userId, publicKey: keypair.publicKey}).then(()=>{})
				setUserContext({ type: "key", data: keypair.privateKey })
			})

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
		axios.post("/api/newUser", login).then((response)=>{
			if(!response.data.errors){
				// Like in login, make a keypiar and store them aprropriately
				rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
					axios.post("/api/publicKey", { userId: response.data.userId, publicKey: keypair.publicKey }).then(() => {})
					setUserContext({type: "key", data: keypair.privateKey})
				})
				// store data and close login window
				setUserContext({type: "login", data: response.data});
				setLogin({ type: "close" });
			}else{
				// alert for failure
				setTimeout(closeAlert, 5000);
				setAlert({
					show: true,
					message: "Username already taken"
				})
			}
		}).catch((err)=>{});
	};
	// Closes the failed login alert
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
