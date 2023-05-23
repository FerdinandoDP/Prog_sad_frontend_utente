import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate, redirect} from 'react-router-dom';
import {Button, Container, Form, Row,Col, Alert} from 'react-bootstrap';
import './Accedi.css'


function HomeButton(props) {
  var [show_alert, show] = useState(true);
  const navigate = useNavigate();

  function handleClick() {
    fetch(window.server_url+'utenti')
    .then(res => res.json())
    .then(res =>{
      var utenti = res;
      var check=false;
      var id_ut = '';
      console.log(props.User)
      console.log(props.Password)
      console.log(utenti)
      for(let i =0;i<utenti.length;i++){
        if(props.User == utenti[i].user_id && props.Password == utenti[i].password){
          check = true;
          console.log('a');
          id_ut = utenti[i]._id;
        }else{
          
        }
      }
      if(check==true){
        //navigate('/?logged_id='+id_ut);
        navigate('/');
        window.logged=true;
        window._id = id_ut;
      }else{
        show(show_alert = false)
      }
    })
    
  }

  return (
    <div>
      <Button variant='dark' onClick={handleClick}>
      Accedi
      </Button>
      <Alert className='my-2' variant='danger' hidden={show_alert}>User Id o password errate!</Alert>
    </div>
  );
}

export default class Accedi extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      logged:  false,
      utenti: [],
      initialized: false,
      utente: '',
      password: '',
      show_alert: true
    }
    this.init = this.init.bind(this);
    this.go_to = this.go_to.bind(this);
  }

  init(){
    fetch(window.server_url+'utenti')
    .then(res => res.json())
    .then(res => this.setState({utenti: res}))
    .then(()=> this.setState({initialized: true}))
  };

  go_to(){
    
    console.log('ass')
  };

  componentDidMount(){
    this.init();
  };


  render(){
    return(
      <Container fluid>
        <Row className='cont_img_home'>
          <Col xs={12} className="my-2"></Col>
          <Col xs={5}></Col>
          <Col xs={2} className=''>
           <h1 id='text_shadow' className='text-white'>ACCEDI:</h1>
          </Col>
          <Col xs={5}></Col>
        </Row>
        <Row className='my-5'>
          <Col xs={4}></Col>
          <Col xs={4} className='form_col'>
            <Form className='my-4 mx-2'>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>User Id:</Form.Label>
                <Form.Control type="email" placeholder="Inserisci User Id" onChange={(event) => this.setState({utente: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(event) => this.setState({password: event.target.value})}/>
              </Form.Group>
              <HomeButton User={this.state.utente} Password={this.state.password} ></HomeButton>
              
          </Form>
        </Col>
        <Col xs={4}></Col>
        </Row>
          
        
       
      </Container>
    );
  }
};