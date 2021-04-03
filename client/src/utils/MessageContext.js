/**
 * Context file that stores data on the message component
 * 
 */

import React, { useReducer, useContext, createContext } from "react";

const MessageContext = createContext();
const { Provider } = MessageContext;

const reducer = (state, action) => {
	switch (action.type) {
		case "getMessage":{
			state.messages.push({message: action.message, sender: action.sender, time: action.time});
			return ({ ...state });
		}
		default: {
			return ({ ...state });
		}
	}
};

// default state of the context
const MessageProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		messages:[]
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useMessageContext = () => {
	return useContext(MessageContext);
};
export { MessageProvider, useMessageContext };
