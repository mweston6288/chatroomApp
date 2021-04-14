/*
	An individual message object
	Receives message info and selects appearance based on the info
*/

import React from "react";
import {useMessageContext} from "../../utils/MessageContext"

function Message(props) {
	
	const [messages] = useMessageContext() // used to determine which user we are actively speaking to
	// CSS for messages sent from someone else
	const fromStyle = {
		backgroundColor: "#abc0ab",
		textAlign:"left",
		width:"30%"
	}
	// CSS for messages sent by user
	const toStyle = {
		backgroundColor: "#89a4bf",
		textAlign: "right",
		width: "30%"
	}
	return(
		<>
		{/* Compare the senderId of the message to who we are chatting with. If they match the message is made by us */}
		{props.message.senderId == messages.to.userId ?
			<div>
				<p style={toStyle}>
					{props.message.message}
				</p>
			</div>
			:
				
			<div>
				<p style={fromStyle}>
					{props.message.message}
				</p>
			</div>
		}

		</>

	)
}
export default Message;