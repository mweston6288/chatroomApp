import React, { useEffect } from "react";

function Message(props) {
	return(
		<div>
			{props.message.message}
		</div>
	)
}
export default Message;