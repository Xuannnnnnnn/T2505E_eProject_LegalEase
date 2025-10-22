import { Navbar, Container, Nav } from "react-bootstrap";

function TopNavbar(){
return (
<Navbar expand="lg" bg="light" variant="light" className="shadow-sm">
<Container>
<Navbar.Brand href="#">
<img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=200&auto=format&fit=crop&crop=faces&ixlib=rb-4.0.3&s=7b1d0c9c9f9b4f6e3c6f3e8d3c9f2a1f" alt="logo" height="32" className="me-2" />
<strong>LegalMatch</strong>
</Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
<Nav className="ms-auto">
<Nav.Link href="#">Explore LegalMatch</Nav.Link>
<Nav.Link href="#">Find a Lawyer</Nav.Link>
<Nav.Link href="#">Sign In</Nav.Link>
</Nav>
</Navbar.Collapse>
</Container>
</Navbar>
);
}
export default TopNavbar;