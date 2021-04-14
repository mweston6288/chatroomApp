/*
	A set of variables and methods related to the list of contacts
	Users is an array of objects with the following values:
		username: the user's name
		userId: their ID in the database
		publicKey: The user's public key information
		sessionKey: The session key
		iv: the iv used in the session key

	UserIds are also stored separately to make it easier to check for updates on them with the server
*/

import React, { useReducer, useContext, createContext } from "react";

const ContactListContext = createContext();
const { Provider } = ContactListContext;

const reducer = (state, action) => {
	switch (action.type) {
		// add a new contact if they are not already in the list
		case "addContact": {
			if (!state.userIds.includes(action.user.userId)){
				state.Users.push(action.user);
				state.userIds.push(action.userId);
			}
			return ({ ...state });
		}
		// Update the entire contact list
		// The session key and iv for each contact must be found and added into the new copy of contacts
		// before replacing it
		case "updateContacts":{
			state.userIds = [];
			const contacts = []
			action.users.forEach((user)=>{
				state.userIds.push(user.userId)
				const find = state.Users.find((u)=>
					u.userId == user.userId
				)
				user.sessionKey = find.sessionKey
				user.iv = find.iv
				contacts.push(user);
			})
			return ({...state, Users: contacts})
		}
		default: {
			return ({ ...state });
		}
	}
};

// default state of the context
const ContactListProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		Users: [],
		userIds:[]
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useContactListContext = () => {
	return useContext(ContactListContext);
};
export { ContactListProvider, useContactListContext };
