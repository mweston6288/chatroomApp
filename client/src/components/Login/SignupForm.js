/* eslint-disable react/prop-types */
/**
 * Subsection of LoginWindow. Displays a signup form that has
 * a field for username, password, and confirmPassword.
 * Receives handleUsernameChange, handlePasswordChange, 
 * handleConfirmPasswordChange, handleSignup, and handleClose from
 * LoginWindow
 */

import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
function SignupForm(props) {
	return (
		<Form>
			<Form.Group controlId="formUsername">
				<Form.Label>Username</Form.Label>
				<Form.Control type="text" placeholder="username" onChange={props.handleUsernameChange} />
			</Form.Group>

			<Form.Group controlId="formPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control type="password" placeholder="Password" autocomplete="on" onChange={props.handlePasswordChange}/>
			</Form.Group>

			<Form.Group controlId="formConfirmPassword">
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control type="password" placeholder="Password" autocomplete="on" onChange={props.handleConfirmPasswordChange}/>
			</Form.Group>
			<Form.Group as={Row} controlId="buttons">
				<Col sm={3}>
					<Button variant="primary" onClick={props.handleSignup}>
						Sign up
					</Button>
				</Col>
				<Col>
					<Button variant="link" onClick={props.handleClose}>Continue without making an account</Button>
				</Col>
			</Form.Group>
		</Form>
	);
}
export default SignupForm;