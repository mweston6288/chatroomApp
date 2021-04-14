/*
	Displays the entire conversation field and the text field to make a new message
	This is also where new messages are retrieved and processed
*/

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
	
	// Due to technical issues between node-forge and SQL, whenever a public key needs to be used
	// a new key must be created and then modified with the specific values for n and e
	let publicKey;
	forge.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
		publicKey = keypair.publicKey
	})

	// Make API calls every 5 seconds to check for new messages
	useEffect(() => {
		const interval = setInterval(() => {
			if (loggedIn) {
				// API GET call for messages
				axios.get("/api/message/"+userId).then((response)=>{
					response.data.forEach((m)=>{
						// If a message's type = 2, then it is a regular message encrypted using AES
						if (m.type == 2){
							// Find the sender in my list of contacts so I can retrieve the info needed
							// to decrypt the message
							const sender = contactList.Users.find(user=>
								user.userId == m.senderId)

							// Again, there are issues with how SQL and node-forge interact
							// One result is that the output of a cipher encryption cannot properly
							// be decrypted after moving it in SQL due to a necessary method in the ciphertext being lost
							// The workaround solution involves making another cipher using the same key and iv
							// and then manually replacing the output ciphertext with the ciphertext I want to decrypt
							const cipher = forge.cipher.createCipher('AES-CBC', sender.sessionKey);
							cipher.start({ iv: sender.iv });
							cipher.update();
							cipher.finish();
							cipher.output.data = m.message

							// After rebuilding the ciphertext so it is compatible with the decryptor,
							// I make the decryptor and decrypt the message
							const decipher = forge.cipher.createDecipher('AES-CBC', sender.sessionKey);
							decipher.start({ iv: sender.iv });
							decipher.update(cipher.output);
							decipher.finish();
							// Finally, I replace the ciphertext in the original message object and store it
							m.message = decipher.output.data
							setMessage({ type: "addMessage", data: m })
						}
						// If we are here, the message type = 1, which means we were sent a session key encrypted using RSA
						else{
							// First, we need to retrieve the sender's info to get their public key
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

									// The session key is a JSON object converted into a string and then encrypted
									// So it needs to be decrypted and then restored as a JSON object
									m.message = JSON.parse(privateKey.decrypt(m.message))
									// The session key contains the iv and key values needed to
									// make the proper cipher and decryptor
									const iv = m.message.iv
									const sessionKey = m.message.sessionKey
									
									// Add the keys into the user data and then store the contact
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

	// Update the text field. Block user from making a message with 281+ characters or if they haven't selected anyone to chat with
	const handleTextField = (e)=>{
		if (e.target.value.length >280 || message.to === "")
			return;
		setMessage({type: "updateNewMessage", message: e.target.value});
	}

	// Runs when the user sends a message
	// Encrypts the message and then makes a POST request to upload the message to the database
	const handleSubmit=(e)=>{
		// use the sessionkey and iv linked to the receiver
		const cipher = forge.cipher.createCipher('AES-CBC', message.to.sessionKey);
		cipher.start({ iv: message.to.iv });
		cipher.update(forge.util.createBuffer(message.newMessage));
		cipher.finish();

		// POST the message then save a copy of the unencrypted message locally so it can be displayed
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
				{/* For each message saved in context, only display the ones sent between the user and the one they are chatting with */}
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