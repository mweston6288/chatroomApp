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
				console.log(Users.userIds)
				axios.get("/api/contacts",{
					users: Users.userIds
				}).then((response)=>{
					console.log(response)
				})
			}, 5000)
		}
	})
	return(
		<div>
		{
			Users.Users.map((user)=>(
				<Card>
					<Card.Body>
						
					</Card.Body>
				</Card>
			))
		}
		</div>
	)
}
export default ContactList