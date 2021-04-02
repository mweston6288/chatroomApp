import React, {useEffect} from "react";
import Card from "react-bootstrap/Card"
import { useContactListContext } from "../../utils/ContactListContext";
import { useUserContext } from "../../utils/UserContext";
import axios from "axios";

function ContactList(){
	const [Users] = useContactListContext();
	const [{loggedIn}] = useUserContext();

	useEffect(() => {
		if (loggedIn) {
			setInterval(() => {
				if (Users.userIds.length > 0){
					axios.post("/api/contacts",{
						users: Users.userIds
					}).then((response)=>{
						console.log(response)
					})
				}
			}, 5000)
		}
	})
	return(
		<>
		{
			Users.Users.map((user)=>(
				<Card>
					<Card.Body>
						{user.username}
					</Card.Body>
					<Card.Subtitle>
						{
							user.online + 20 < Date.now() ? 
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