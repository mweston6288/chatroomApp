/*
	The searchbar component
	Handles searches for new users
*/

import React, {useState} from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { useSearchContext } from "../../utils/SearchContext";
import { useContactListContext } from "../../utils/ContactListContext";
import {useUserContext} from "../../utils/UserContext"
import axios from "axios";
import forge from "node-forge";

function SearchBar(){
	
	const [user] = useUserContext()
	// stores the current text in the search bar
	const [search, setSearch] = useState({field: ""})
	const [contactList, setContactList] = useContactListContext();
	
	// Due to technical issues between node-forge and SQL, whenever a public key needs to be used
	// a new key must be created and then modified with the specific values for n and e
	let publicKey;
	forge.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
		publicKey = keypair.publicKey
	})

	// update the search context
	const updateField= (e)=>{
		setSearch({field: e.target.value})
	}
	// Triggers when the search button is clicked
	// Makes an API call for a user and if a find is made
	// A session key is made and sent to that user
	const handleClick=(e)=>{
		axios.get("/api/user/" + search.field).then((response)=>{
			if (response.data.error){
				console.log("User does not exist");
			}
			else{
				// create a session key and iv to send to the user
				const sessionKey = forge.random.getBytesSync(16);
				const iv = forge.random.getBytesSync(16);

				// rebuild the public key and add it and the session key info to the user data
				// and store it
				publicKey.e.data = response.data.publicKey.e.data
				publicKey.e.s = response.data.publicKey.e.s
				publicKey.e.t = response.data.publicKey.e.t
				publicKey.n.data = response.data.publicKey.n.data
				publicKey.n.s = response.data.publicKey.n.s
				publicKey.n.t = response.data.publicKey.n.t
				response.data.publicKey = publicKey
				response.data.sessionKey = sessionKey;
				response.data.iv = iv;
				setContactList({ type: "addContact", user: response.data, userId: response.data.userId })
				
				// Send the encrypted session key info to the user
				// key is first converted from a JSON object into a string
				axios.post("/api/newMessage", {
					senderId: user.userId,
					receiverId: response.data.userId,
					message: response.data.publicKey.encrypt(JSON.stringify({sessionKey: sessionKey, iv: iv})),
					type: 1
				})
			} 
		})
		// reset search field
		setSearch({ field: ""})
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