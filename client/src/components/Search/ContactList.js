/*
	Displays a list of users you are currently chatting with
	This is also where the app checks for status updates on your contacts
*/


import React, {useEffect} from "react";
import Card from "react-bootstrap/Card"
import { useContactListContext } from "../../utils/ContactListContext";
import { useUserContext } from "../../utils/UserContext";
import { useMessageContext } from "../../utils/MessageContext";
import axios from "axios";
import forge from "node-forge"
function ContactList(){
	const [Users, setUsers] = useContactListContext();
	const [{loggedIn}] = useUserContext();
	const [message, setMessage] = useMessageContext();
	
	// Due to technical issues between node-forge and SQL, whenever a public key needs to be used
	// a new key must be created and then modified with the specific values for n and e
	let publicKey;
	forge.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
		publicKey = keypair.publicKey
	})

	useEffect(() => {
		if (loggedIn) {
			const interval = setInterval(() => {
				// If there are contacts, make a reuest for updates
				// Sends a list of userIds
				// uses POST to work around GET not having an easy way to send bulk data
				if (Users.userIds.length > 0){
					axios.post("/api/contacts",{
						users: Users.userIds
					}).then((response)=>{
						// Rebuild the public key and then store the data
						response.data.forEach((data)=>{
							publicKey.e.data = data.publicKey.e.data
							publicKey.e.s = data.publicKey.e.s
							publicKey.e.t = data.publicKey.e.t
							publicKey.n.data = data.publicKey.n.data
							publicKey.n.s = data.publicKey.n.s
							publicKey.n.t = data.publicKey.n.t
							data.publicKey = publicKey
						})
						setUsers({type: "updateContacts", users: response.data})
					})
				}
			}, 5000)
			return ()=>clearInterval(interval)
			
		}
	})
	// When a user card is clicked, the message context will store the data of that user
	const handleSelect=(user)=>{
		setMessage({type: "updateTo", data: user})
	}
	return(
		<>
		{	/* 
				For each user, create a method that acts when clicked
				The active user card will have a different color
				Users will show whether or not they are online
				As an effect from the message API filtering out offline users and this
				component frequently updating users, an offline user will vanish from the list shortly after going offline
			*/
			Users.Users.map((user)=>(
				<Card onClick={() => handleSelect(user)} style={user.userId == message.to.userId ? { "backgroundColor": "#99defb" } : {}}>
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