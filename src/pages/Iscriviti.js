import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Container, Form, Row,Col, Alert} from 'react-bootstrap';

export default class Iscriviti extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      utenti: [],
      initialized: false,
      nome: '',
      cognome: '',
      email: '',
      user_id: '',
      password: '',
      indirizzo: '',
      codice_fiscale: '',
      show_alert_1: true,
      show_alert_2: true,
      show_alert_3: true
    }

    this.init = this.init.bind(this);
    this.crea_utente = this.crea_utente.bind(this);
  }

  init(){
    fetch(window.server_url+'utenti')
    .then(res => res.json())
    .then(res => {
      this.setState({utenti: res});
    })
    .then(()=>{
      this.setState({initialized: true});
    })
  };

  componentDidMount(){
    this.init();
  }

  crea_utente(){
    this.setState({show_alert_1: true});
    this.setState({show_alert_2: true});
    this.setState({show_alert_3: true});
     if(this.state.nome == '' || this.state.cognome == '' || this.state.email == '' || this.state.user_id == '' || this.state.password == ''){
      console.log('assicurati di aver inserito i dati nei campi constrassegnati con un asterisco!');
      this.setState({show_alert_1: false});
     }else{
      var check = false;
      for(let i=0;i<this.state.utenti.length;i++){
        if(this.state.user_id == this.state.utenti[i].user_id){
          check = true;
        }
      }
      if(check == true){
        console.log('username già in uso!');
        this.setState({show_alert_2: false});
      }else{
        console.log('ok');
        this.setState({show_alert_3: false});
        var body_post={
            codice_fiscale: this.state.codice_fiscale,
            nome: this.state.nome,
            cognome: this.state.cognome,
            email: this.state.email,
            user_id: this.state.user_id,
            password: this.state.password,
            indirizzo: this.state.indirizzo
        };
        console.log(body_post)
        fetch(window.server_url+'utenti',{
          headers: {'Content-Type':'application/json'},
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(body_post)
        }).then(()=>{
          var array = this.state.utenti;
          array.push(body_post);
          this.setState({utenti: array})
        }).then(()=>{
          this.setState({codice_fiscale: ''});
          this.setState({nome: ''});
          this.setState({cognome: ''});
          this.setState({indirizzo: ''});
          this.setState({user_id: ''});
          this.setState({password: ''});
          this.setState({email: ''});
        })
        
      }
     }
  }


  render(){
    return(
      <Container fluid>
        <Row className='cont_img_home'>
          <Col xs={12} className="my-2"></Col>
          <Col xs={5}></Col>
          <Col xs={2} className=''>
           <h1 id='text_shadow' className='text-white'>ISCRIVITI:</h1>
          </Col>
          <Col xs={5}></Col>
        </Row>
        <Row className='my-5'>
          <Col xs={4}></Col>
          <Col xs={4} className='form_col'>
            <Form className='my-4 mx-2'>
              <Form.Group className="mb-3" controlId="formBasicCF">
                <Form.Label>Codice Fiscale*:</Form.Label>
                <Form.Control type="Name" placeholder="Codice Fiscale" value={this.state.codice_fiscale} onChange={(event) => this.setState({codice_fiscale: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nome*:</Form.Label>
                <Form.Control type="Name" placeholder="Nome" value={this.state.nome} onChange={(event) => this.setState({nome: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicSurname">
                <Form.Label>Cognome*:</Form.Label>
                <Form.Control type="Surname" placeholder="Cognome" value={this.state.cognome} onChange={(event) => this.setState({cognome: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicMail">
                <Form.Label>E-Mail*:</Form.Label>
                <Form.Control type="Mail" placeholder="E-Mail" value={this.state.email} onChange={(event) => this.setState({email: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>User Id*:</Form.Label>
                <Form.Control type="email" placeholder="Inserisci User Id" value={this.state.user_id} onChange={(event) => this.setState({user_id: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password*:</Form.Label>
                <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={(event) => this.setState({password: event.target.value})}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicAddress">
                <Form.Label>Indirizzo:</Form.Label>
                <Form.Control type="address" placeholder='Indirizzo' value={this.state.indirizzo} onChange={(event) => this.setState({indirizzo: event.target.value})}/>
              </Form.Group>

              <Button variant='dark' onClick={()=>this.crea_utente()}>Invia</Button>
              <Alert className='my-2' variant='danger' hidden={this.state.show_alert_1}>Inserisci i campi contrassegnati!</Alert>
              <Alert className='my-2' variant='danger' hidden={this.state.show_alert_2}>Username già in uso!</Alert>
              <Alert className='my-2' variant='success' hidden={this.state.show_alert_3}>Utente creato con successo!</Alert>
          </Form>
        </Col>
        <Col xs={4}></Col>
        </Row>
          
        
       
      </Container>
    );
  }
};