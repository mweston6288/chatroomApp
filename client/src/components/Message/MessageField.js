import React from "react";
import { useMessageContext } from "../../utils/MessageContext";
import {useUserContext} from "../../utils/UserContext";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axios from "axios";

function MessageField() {

	const [{userId}] = useUserContext();
	const [message, setMessage] = useMessageContext();
	const handleTextField = (e)=>{
		if (e.target.value.length >280 || message.to === "")
			return;
		setMessage({type: "updateNewMessage", message: e.target.value});
		console.log(message.newMessage);
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
		</>
	)
}
export default MessageField;