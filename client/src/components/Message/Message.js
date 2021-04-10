import React from "react";
import {useMessageContext} from "../../utils/MessageContext"

function Message(props) {
	
	const [messages] = useMessageContext()
	const fromStyle = {
		backgroundColor: "#abc0ab",
		textAlign:"left",
		width:"30%"
	}

	const toStyle = {
		backgroundColor: "#89a4bf",
		textAlign: "right",
		width: "30%"
	}
	return(
		<>
		{props.message.senderId == messages.to ?
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