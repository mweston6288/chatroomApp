/**
 * Context file that stores data on the message component
 * 
 * to: the user data of the contact the message is for. 
 * 	Contains all the fields that a Users object in ContactListContext would have
 * newMessage: The message in the text field
 * messages: an array of previous messages made or received. Each message has the following fields:
 * 		senderId: userId of the sender
 * 		receiverId: userId of the recipient
 * 		message: The actual message in plaintext
 * 
 */

import React, { useReducer, useContext, createContext } from "react";

const MessageContext = createContext();
const { Provider } = MessageContext;

const reducer = (state, action) => {
	switch (action.type) {
		case "getMessage":{
			action.data.forEach((data)=>{
				state.messages.push(data);
			})
			return ({ ...state });
		}
		case "addMessage":{
			state.messages.push(action.data);
			return ({ ...state });
		}
		case "updateNewMessage":{
			return ({ ...state, newMessage: action.message });

		}
		case "updateTo":{
			return ({ ...state, newMessage: "", to: action.data});

		}
		case "resetMessage":{
			return ({ ...state, newMessage: ""});

		}
		default: {
			return ({ ...state });
		}
	}
};

// default state of the context
const MessageProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		to: "",
		newMessage:"",
		messages:[],
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useMessageContext = () => {
	return useContext(MessageContext);
};
export { MessageProvider, useMessageContext };
