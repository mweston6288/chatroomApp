import React, {useEffect} from "react";
import { useMessageContext } from "../../utils/MessageContext";
import {useUserContext} from "../../utils/UserContext";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios";
import Message from "./Message"
import {useContactListContext} from "../../utils/ContactListContext"
function MessageField() {

	const [{userId, loggedIn}] = useUserContext();
	const [message, setMessage] = useMessageContext();
	const [contactList, setContactList] = useContactListContext()

	useEffect(() => {
		const interval = setInterval(() => {
			if (loggedIn) {

				axios.get("/api/message/"+userId).then((response)=>{
					console.log(response)
					response.data.forEach((m)=>{
						console.log(m)
						if (m.type == 2){
							setMessage({ type: "getMessage", data: response.data })
						}
						else{
							axios.get("/api/userId/" + m.senderId).then((response) => {
								if (response.data.error) {
									console.log("User does not exist");
								}
								else {
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
		axios.post("/api/newMessage",{
			senderId: userId,
			receiverId: message.to,
			message: message.newMessage,
			type: 2
		}).then(()=>{
			setMessage({type:"addMessage", data:{senderId: userId, receiverId: message.to, message: message.newMessage}})
			console.log(message.messages)
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
					{m.senderId == message.to || m.receiverId == message.to ?
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