import React from "react";
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
	const [search, setSearch] = useSearchContext();
	const [contactList, setContactList] = useContactListContext();
	let publicKey;
	forge.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
		publicKey = keypair.publicKey
	})

	const updateField= (e)=>{
		setSearch({type: "updateField", field: e.target.value})
	}
	const handleClick=(e)=>{
		axios.get("/api/user/" + search.field).then((response)=>{
			if (response.data.error){
				console.log("User does not exist");
			}
			else{
				const sessionKey = forge.random.getBytesSync(16);
				const iv = forge.random.getBytesSync(16);
				// This is SO stupid but it's the only way I can get things to work.
				// the database doesn't save the encrypt function so I have to build a new key and
				// set the necessary datavalues to what I need
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
				axios.post("/api/newMessage", {
					senderId: user.userId,
					receiverId: response.data.userId,
					message: response.data.publicKey.encrypt(JSON.stringify({sessionKey: sessionKey, iv: iv})),
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