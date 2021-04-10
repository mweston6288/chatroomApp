import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useSearchContext } from "../../utils/SearchContext";
import { useContactListContext } from "../../utils/ContactListContext";
import {useUserContext} from "../../utils/UserContext"
import axios from "axios";

function SearchBar(){
	
	const [user] = useUserContext()
	const [search, setSearch] = useSearchContext();
	const [contactList, setContactList] = useContactListContext();

	const updateField= (e)=>{
		setSearch({type: "updateField", field: e.target.value})
	}
	const handleClick=(e)=>{
		axios.get("/api/user/" + search.field).then((response)=>{
			if (response.data.error){
				console.log("User does not exist");
			}
			else{
				setContactList({ type: "addContact", user: response.data, userId: response.data.userId })
				axios.post("/api/newMessage", {
					senderId: user.userId,
					receiverId: response.data.userId,
					message: "message.newMessage",
					type: 1
				})
			} 
		})
		setSearch({ type: "resetState"})
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