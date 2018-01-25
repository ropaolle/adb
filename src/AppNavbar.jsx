import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

export default class AppNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand to="/" tag={RRNavLink}>Artdatabanken</NavbarBrand>
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
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}
