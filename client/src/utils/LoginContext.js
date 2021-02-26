/**
 * Context file that stores data on the login page
 * 
 * show: boolean value. If true, the login window appears on-screen
 * loginPage:boolean value. If true, LoginForm displays. Otherwise, SignupForm displays
 * username: a string. The current value in the username text field
 * password:a string. The current value in the password text field
 * confirmPassword:a string. The current value in the confirmPasssword text field
 */

import React, { useReducer, useContext, createContext } from "react";

const LoginContext = createContext();
const { Provider } = LoginContext;

const reducer = (state, action) => {
	switch (action.type){
	// update username text value
	case "username":{
		return ({ ...state, username: action.username });

	}
	// update password text value
	case "password":{
		return ({ ...state,password: action.password });

	}
	// update confirmPassword text value
	case "confirmPassword":{
		return ({ ...state,confirmPassword: action.confirmPassword });

	}
	// set show to false and reset all text fields. Used when login windoww is closed
	case "close":{
		return ({ show: false, username: "", password: "", confirmPassword: "" });
	}
	// show the login page. Used when user performs an action that should display the login window
	case "show":{
		return ({ show: true, loginPage:true, username: "", password: "", confirmPassword: "" });

	}
	// swap to LoginForm
	case "loginPage":{
			return ({ ...state, loginPage: true, username: "", password: "", confirmPassword: ""})
	}
	// swap to SignupForm
	case "signupPage": {
			return ({ ...state, loginPage: false, username: "", password: "", confirmPassword: ""})
	}
	default:{
		return({...state});
	}
	}
};

// default state of the context
const LoginProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		show: true,
		loginPage:true,
		username:"",
		password:"",
		confirmPassword:""
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useLoginContext = () => {
	return useContext(LoginContext);
};
export { LoginProvider, useLoginContext };
