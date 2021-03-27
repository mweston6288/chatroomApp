import React from "react";
import Card from "react-bootstrap/Card"
import { useSearchContext } from "../../utils/SearchContext";
import axios from "axios";

function ContactList(){
	const [Users] = useSearchContext();

	setInterval(()=>{
		console.log("Here");
	}, 5000)

	return(
		<>
		{
			Users.users.map((user)=>(
				<Card>
					<Card.Body>
						
					</Card.Body>
				</Card>
			))
		}
		</>
	)
}
export default ContactList