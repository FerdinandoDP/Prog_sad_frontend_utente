import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import { Button, Stack, Col} from 'react-bootstrap';
import {BrowserRouter,Switch,Route,Link, Routes} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Home from '../pages/Home.js';
import Accedi from '../pages/Accedi.js';
import Iscriviti from '../pages/Iscriviti.js';
import Profilo from '../pages/Profilo.js';
import './MyNavBar.css';
import history_b from '../history.js';



export class MyNavBar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            logged: false
        }
        this.init= this.init.bind(this);
    }


    init(){
        //this.setState({logged: window.logged})
        if(window.logged == true){
            console.log('arrivaaaaaaaaa')
        }
       
    }

    componentDidMount(){
        this.init();
        console.log(window.logged)
    }

    render(){
        return( 
            <BrowserRouter history={history_b}>
                <div className='cont_img'> 
                <Navbar expand="lg" >
                    <Container fluid>
                        <Navbar.Brand>Coworking</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            navbarScroll
                        >
                            <Nav.Link as={Link} to='/' >Home</Nav.Link>
                        </Nav>
                        <Col md={1}>
                        <Form className='d-flex'> 
                            <Button variant="outline-dark" as={Link} to='/Accedi' className='button_link me-2'>Accedi</Button>
                        </Form>
                        </Col>
                        <Col md={1}>
                        <Form>
                            <Button variant="outline-dark" as={Link} to='/Iscriviti' className='button_link'>Iscriviti</Button>
                        </Form>
                        </Col>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                </div>
                <div>
                <Routes >
                    <Route path='/' element={<Home/>}>
                        
                    </Route>
                    <Route path='/Profilo' element={<Profilo/>}>
                        
                    </Route>
                    <Route path='/Accedi' element={<Accedi/>}>
                        
                    </Route>
                    <Route path='/Iscriviti' element={<Iscriviti/>}>
                    </Route>
                </Routes>
                </div>
            </BrowserRouter>
        );
    }
}