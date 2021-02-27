import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginWindow from "./components/Login/LoginWindow";
import { UserProvider } from "./utils/UserContext";
import { LoginProvider } from "./utils/LoginContext";
function App() {
  return (
    <>
      <UserProvider>
        <LoginProvider>
          <Container>
            <Row>
              <Col sm={3}>
                Hello World
              </Col>
              <Col sm={9}>
                Hello World
              </Col>
            </Row>
          </Container>
          <LoginWindow />

        </LoginProvider>
      </UserProvider>
      
     
    </>
  );
}

export default App;
