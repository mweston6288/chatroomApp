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

				console.log(message)
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