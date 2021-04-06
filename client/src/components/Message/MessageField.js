import React from "react";
import { useMessageContext } from "../../utils/MessageContext";
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
function MessageField() {

	const [message, setMessage] = useMessageContext();
	const handleTextField = (e)=>{
		if (e.target.value.length >280 || message.to === "")
			return;
		setMessage({type: "updateNewMessage", message: e.target.value});
		console.log(message.newMessage);
	}
	
	return (
		<>
			<Form>
				<Form.Group>
					<Form.Control as="textarea" rows={2} onChange={handleTextField} value={message.newMessage}/>
				</Form.Group>

				<Button variant="primary">
					Send
				</Button>
			</Form>
		</>
	)
}
export default MessageField;