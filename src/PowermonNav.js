import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
 } from 'reactstrap';
  import './App.css';


class PowermonNav extends Component {
  constructor(props) {
   super(props);

   this.toggleNavbar = this.toggleNavbar.bind(this);
   this.state = {
     isOpen: false
   };
 }


  toggleNavbar() {
    this.setState({
       isOpen: !this.state.isOpen
     });
  }

  render() {
    return (
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">PowerMon</NavbarBrand>

          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/smartmeter/">Slimme Meter</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/meter/">Meter</NavLink>
            </NavItem>

            </Nav>
          </Collapse>
        </Navbar>
    );
  }
}

export default PowermonNav;
