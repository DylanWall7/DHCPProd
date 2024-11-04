import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { useMsal } from "@azure/msal-react";

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const name = accounts[0] && accounts[0].name;

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Network DHCP Tool</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse class="flex items-center gap-4">
            <Navbar.Text>
              {isAuthenticated ? (
                <Navbar.Text className="Right">
                  Signed in as: <a href="#user">{name}</a>
                </Navbar.Text>
              ) : (
                ""
              )}
            </Navbar.Text>
            {isAuthenticated ? <SignOutButton /> : <SignInButton />}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {props.children}
    </>
  );
};
