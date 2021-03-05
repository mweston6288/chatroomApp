import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginWindow from "./components/Login/LoginWindow";
import { UserProvider } from "./utils/UserContext";
import { LoginProvider } from "./utils/LoginContext";
import { SearchProvider } from "./utils/SearchContext";
import SearchBar from "./components/Search/SearchBar";
function App() {
  return (
    <>
      <UserProvider>
        <LoginProvider>
          <SearchProvider>
          <Container>
            <Row>
              <Col sm={3}>
                Hello World
                <SearchBar/>
              </Col>
              <Col sm={9}>
                Hello World
              </Col>
            </Row>
          </Container>
          <LoginWindow />
          </SearchProvider>
        </LoginProvider>
      </UserProvider>
      
     
    </>
  );
}

export default App;
