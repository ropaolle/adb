import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { firebaseAuth } from './utils/firebase';
import userIcon from './user.svg';

const formatUserObj = (user) => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName || '',
    phoneNumber: user.phoneNumber || '',
    photoURL: user.photoURL/*  || getPhotoURL(user) */,
  };
};

export default class AppNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      user: null,
    };
  }


  componentDidMount = () => {
    this.removeAuthListener = firebaseAuth().onAuthStateChanged((user) => {
      console.log(formatUserObj(user));
      this.setState({ user: formatUserObj(user) });
    });
  };


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  login = () => {
    // https://firebase.google.com/docs/auth/web/google-signin?authuser=0
    const provider = new firebaseAuth.GoogleAuthProvider();
    firebaseAuth().signInWithRedirect(provider);
  }

  logout = () => {
    firebaseAuth().signOut();
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand to="/" tag={RRNavLink}><img src="./favicon-32x32.png" alt="" />Artdatabanken</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink to="/generator" activeClassName="active" tag={RRNavLink}>Sidgenerator</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/images" activeClassName="active" tag={RRNavLink}>Bilder</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/help" activeClassName="active" tag={RRNavLink}>Hjälp</NavLink>
              </NavItem>

              {!user && <NavItem>
                <NavLink href="#" onClick={this.login}>Logga in</NavLink>
              </NavItem>}
              {user && <UncontrolledDropdown nav>
                <DropdownToggle nav className="user-menu">
                  <img className="user-icon" src={userIcon} alt="user" />
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>
                    {user.displayName}
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={this.logout}>
                    Logga ut
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
