import React, {useEffect} from "react";
import Card from "react-bootstrap/Card"
import { useContactListContext } from "../../utils/ContactListContext";
import { useUserContext } from "../../utils/UserContext";
import { useMessageContext } from "../../utils/MessageContext";

import axios from "axios";

function ContactList(){
	const [Users, setUsers] = useContactListContext();
	const [{loggedIn}] = useUserContext();
	const [message, setMessage] = useMessageContext();


	useEffect(() => {
		if (loggedIn) {
			setInterval(() => {
				if (Users.userIds.length > 0){
					axios.post("/api/contacts",{
						users: Users.userIds
					}).then((response)=>{
						setUsers({type: "updateContacts", users: response.data})
					})
				}
			}, 5000)
		}
	})

	const handleSelect=(userId)=>{
		setMessage({type: "updateTo", data: userId})
	}
	return(
		<>
		{
			Users.Users.map((user)=>(
				<Card onClick={() => handleSelect(user.userId)} >
					<Card.Body>
						{user.username}
					</Card.Body>
					<Card.Subtitle>
						{
							user.online + 20000 < Date.now() ? 
								<p>Offline</p>
							:
								<p>Online</p>
						}
					</Card.Subtitle>
				</Card>
			))
		}
		</>
	)
}
export default ContactList