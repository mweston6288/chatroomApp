/**
 * Context file that stores data on the User.
 *
 * loggedIn: a boolean. if true, there is an active user
 * username: a string. The user's name
 * userId: a number. The userId according to the database
 * privateKey: the user's private key for RSA encryption
 */

import React, { useReducer, useContext, createContext } from "react";

const UserContext = createContext();
const { Provider } = UserContext;

const reducer = (state, action) => {
	switch (action.type){
	// log in and update fields with user details
	case "login":
		return ({...state, loggedIn: true, username: action.data.username, userId: action.data.userId});

	// reset user details after logging out
	case "logout":{
		return ({ ...state, loggedIn:false, username:"",userId:""});
	}
	case "key":{
	
		return ({ ...state, privateKey:action.data});

	}
	default:
		return ({ ...state });

	}
};


// default state of the context
const UserProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		loggedIn: false,
		username:"",
		userId:"",
		privateKey:[]
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useUserContext = () => {
	return useContext(UserContext);
};
export { UserProvider, useUserContext };
