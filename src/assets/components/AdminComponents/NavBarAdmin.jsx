import React from 'react'
import { Container, Navbar } from 'react-bootstrap'

const NavBarAdmin = () => {
  return (
    <Navbar className='NavBarTop sticky'>
        <Container>
            <NavTopInfoToggle />
        </Container>
    </Navbar>
  )
}

export default NavBarAdmin;