

import React, { useReducer, useContext, createContext } from "react";

const SearchContext = createContext();
const { Provider } = SearchContext;

const reducer = (state, action) => {
	switch (action.type){
	case "updateField":{
		return ({ ...state, field: action.field });

	}
	case "resetState":{
		return ({ ...state, field: ""});

	}
	default:{
		return({...state});
	}
	}
};

// default state of the context
const SearchProvider = ({ value = [], ...props }) => {
	const [state, dispatch] = useReducer(reducer, {
		field: ""
	});
	return <Provider value={[state, dispatch]}{...props} />;
};
const useSearchContext = () => {
	return useContext(SearchContext);
};
export { SearchProvider, useSearchContext };
