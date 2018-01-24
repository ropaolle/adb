import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AppNav extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink href="#" disabled className="logo">Artdatabanken</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#" active><Link to="/">Home</Link></NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#"><Link to="/adb">Adb</Link></NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}
