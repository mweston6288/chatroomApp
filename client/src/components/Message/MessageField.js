import React, {useEffect} from "react";
import { useMessageContext } from "../../utils/MessageContext";
import {useUserContext} from "../../utils/UserContext";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios";
import Message from "./Message"
import {useContactListContext} from "../../utils/ContactListContext"
import forge from "node-forge";

function MessageField() {

	const [{userId, loggedIn, privateKey}] = useUserContext();
	const [message, setMessage] = useMessageContext();
	const [contactList, setContactList] = useContactListContext()
	let publicKey;
	forge.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
		publicKey = keypair.publicKey
	})
	useEffect(() => {
		const interval = setInterval(() => {
			if (loggedIn) {
				axios.get("/api/message/"+userId).then((response)=>{
					response.data.forEach((m)=>{
						if (m.type == 2){
							const sender = contactList.Users.find(user=>
								user.userId == m.senderId)

							const cipher = forge.cipher.createCipher('AES-CBC', sender.sessionKey);
							cipher.start({ iv: sender.iv });
							cipher.update();
							cipher.finish();
							cipher.output.data = m.message
							const decipher = forge.cipher.createDecipher('AES-CBC', sender.sessionKey);
							decipher.start({ iv: sender.iv });
							decipher.update(cipher.output);
							decipher.finish();
							
							m.message = decipher.output.data
							setMessage({ type: "addMessage", data: m })
						}
						else{
							axios.get("/api/userId/" + m.senderId).then((response) => {
								if (response.data.error) {
									console.log("User does not exist");
								}
								else {
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

									
									m.message = JSON.parse(privateKey.decrypt(m.message))
									const iv = m.message.iv
									const sessionKey = m.message.sessionKey
	
									response.data.iv = iv
									response.data.sessionKey = sessionKey
									setContactList({ type: "addContact", user: response.data, userId: response.data.userId })
								}
							})
						}
					})
				})
			}
		}, 5000)
		return ()=> clearInterval(interval)
	})

	const handleTextField = (e)=>{
		if (e.target.value.length >280 || message.to === "")
			return;
		setMessage({type: "updateNewMessage", message: e.target.value});
	}
	const handleSubmit=(e)=>{
		const cipher = forge.cipher.createCipher('AES-CBC', message.to.sessionKey);
		cipher.start({ iv: message.to.iv });
		cipher.update(forge.util.createBuffer(message.newMessage));
		cipher.finish();
		axios.post("/api/newMessage",{
			senderId: userId,
			receiverId: message.to.userId,
			message: cipher.output.data,
			type: 2
		}).then(()=>{
			setMessage({type:"addMessage", data:{senderId: userId, receiverId: message.to.userId, message: message.newMessage}})
			setMessage({type: "resetMessage"})
		})
	}
	
	return (
		<>
			<Form>
				<Form.Group>
					<Form.Control as="textarea" rows={2} onChange={handleTextField} value={message.newMessage}/>
				</Form.Group>

				<Button variant="primary" onClick={handleSubmit}>
					Send
				</Button>
			</Form>
			<div >
				{message.messages.map((m) => (
					<>
					{m.receiverId == message.to.userId || m.senderId == message.to.userId ?
					<Message message={m}/>
						:
					<></>}
					</>
				))}
			</div>
		</>
	)
}
export default MessageField;