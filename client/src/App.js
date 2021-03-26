import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginWindow from "./components/Login/LoginWindow";
import MessageField from "./components/Message/MessageField"
import { UserProvider } from "./utils/UserContext";
import { LoginProvider } from "./utils/LoginContext";
import { SearchProvider } from "./utils/SearchContext";
import { MessageProvider } from "./utils/MessageContext";

import SearchBar from "./components/Search/SearchBar";
function App() {
  return (
    <>
      <UserProvider>
        <LoginProvider>
          <SearchProvider>
            <MessageProvider>
              <Container>
                <Row>
                  <Col sm={3}>
                    <SearchBar/>
                  </Col>
                  <Col sm={9}>
                    <MessageField/>
                  </Col>
                </Row>
              </Container>
              <LoginWindow />
            </MessageProvider>
          </SearchProvider>
        </LoginProvider>
      </UserProvider>
      
     
    </>
  );
}

export default App;
