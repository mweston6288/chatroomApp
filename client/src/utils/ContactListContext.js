

import React, { useReducer, useContext, createContext } from "react";

const ContactListContext = createContext();
const { Provider } = ContactListContext;

const reducer = (state, action) => {
	switch (action.type) {
		case "addContact": {
			state.Users.push(action.user);
			return ({ ...state });
		}
		case "updateContacts":{
			return ({...state})
		}
		default: {
			return ({ ...state });
		}
	}
};

// default state of the context
const ContactListProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		Users: []
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useContactListContext = () => {
	return useContext(ContactListContext);
};
export { ContactListProvider, useContactListContext };
