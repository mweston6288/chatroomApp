

import React, { useReducer, useContext, createContext } from "react";

const ContactListContext = createContext();
const { Provider } = ContactListContext;

const reducer = (state, action) => {
	switch (action.type) {
		case "addContact": {
			state.Users.push(action.user);
			state.userIds.push(action.userId);
			console.log(state);
			return ({ ...state });
		}
		case "updateContacts":{
			return ({...state, Users: action.users})
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
