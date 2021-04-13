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
	let publicKey;
	forge.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
		publicKey = keypair.publicKey
	})

	useEffect(() => {
		if (loggedIn) {
			const interval = setInterval(() => {
				if (Users.userIds.length > 0){
					axios.post("/api/contacts",{
						users: Users.userIds
					}).then((response)=>{
						response.data.forEach((data)=>{
							// This is SO stupid but it's the only way I can get things to work.
							// the database doesn't save the encrypt function so I have to build a new key and
							// set the necessary datavalues to what I need
							publicKey.e.data = data.publicKey.e.data
							publicKey.e.s = data.publicKey.e.s
							publicKey.e.t = data.publicKey.e.t
							publicKey.n.data = data.publicKey.n.data
							publicKey.n.s = data.publicKey.n.s
							publicKey.n.t = data.publicKey.n.t
							data.publicKey = publicKey
						})
						setUsers({type: "updateContacts", users: response.data})
						console.log(Users.Users)
					})
				}
			}, 5000)
			return ()=>clearInterval(interval)
			
		}
	})

	const handleSelect=(userId, index)=>{
		setMessage({type: "updateTo", data: userId, index: index})
	}
	return(
		<>
		{
			Users.Users.map((user, index)=>(
				<Card onClick={() => handleSelect(user.userId, index)} style={user.userId == message.to ? { "backgroundColor": "#99defb" } : {}}>
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