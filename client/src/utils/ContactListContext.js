

import React, { useReducer, useContext, createContext } from "react";

const ContactListContext = createContext();
const { Provider } = ContactListContext;

const reducer = (state, action) => {
	switch (action.type) {
		case "addContact": {
			if (!state.userIds.includes(action.user.userId)){
				state.Users.push(action.user);
				state.userIds.push(action.userId);
			}
			return ({ ...state });
		}
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
