import React from "react"
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form"

function LoginWindow() {

	return(
		<Modal show={true} background="static" keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title>
					Log in
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="formUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control type="text" placeholder="username"  />
					</Form.Group>

					<Form.Group controlId="formPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" autocomplete="on" />
					</Form.Group>
				</Form>
			</Modal.Body>
		</Modal>
	)

}


export default LoginWindow;