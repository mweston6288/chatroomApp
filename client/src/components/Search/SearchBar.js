import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useSearchContext } from "../../utils/SearchContext";

function SearchBar(){
	
	const [search, setSearch] = useSearchContext();

	const updateField= (e)=>{
		setSearch({type: "updateField", field: e.target.value})
		console.log(search);
	}
	const handleClick=(e)=>{
		setSearch({ type: "resetState"})
		console.log(search);


	}
	return(
		<>
			<InputGroup className="mb-3">
				<FormControl
					placeholder="Start a chat"
					onChange={updateField}
					value={search.field}
				/>
				<InputGroup.Append>
					<Button variant="outline-secondary" onClick={handleClick}>Search</Button>
				</InputGroup.Append>
			</InputGroup>
		</>
	)
}
export default SearchBar;