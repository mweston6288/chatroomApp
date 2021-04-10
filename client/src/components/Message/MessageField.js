import React, {useEffect} from "react";
import { useMessageContext } from "../../utils/MessageContext";
import {useUserContext} from "../../utils/UserContext";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios";
import Message from "./Message"
function MessageField() {

	const [{userId, loggedIn}] = useUserContext();
	const [message, setMessage] = useMessageContext();

	useEffect(() => {
		const interval = setInterval(() => {
			if (loggedIn) {

				console.log(Date.now())
				axios.get("/api/message/"+userId).then((response)=>{
					setMessage({type: "getMessage", data: response.data})
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
			<div>
				{message.messages.map((message, index) => (
					<>
					{message.senderId == message.to || (message.senderId == userId && message.receiverId == message.to) ?
					<Message message={message}/>
						:
					<></>}
					</>
				))}
			</div>
		</>
	)
}
export default MessageField;