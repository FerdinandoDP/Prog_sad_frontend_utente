import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import { Row , Col, Form, Button, Container, ListGroup, ListGroupItem, Stack, Alert, Modal} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Link} from 'react-router-dom';
//import Image from "./src/images/COWORKING-GUIDA.jpg"

const compare_dates = (d1,d2) =>{
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();
  if(date1 > date2){
    return false;
  }else if (date2 > date1){
    return false;
  }else {
    console.log("equal");
    return true
  }
}
export default class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      sale: [],
      postazioni: [],
      sale_non_occupate: [],
      postazioni_non_occupate: [],
      prenotazioni: [],
      connected: false,
      initialized: false,
      data_inizio: new Date(),
      data_fine: new Date(),
      sale_search: true,
      logged: false,
      show_alert: true,
      costo_sala: 0,
      nome_sala: '',
      id_sala: '',
      show_modal_sale: false,
      show_alert_pren: false,
      show_modal_postazioni: false,
      costo_postazione: 0,
      nome_postazione: '',
      id_postazione: '',
      show_alert_post_pren: false,
      show_alert_success: false,
      show_alert_warning: false,
      show_alert_warning_post: false
    };
    this.init = this.init.bind(this);
    this.cerca_sale_e_post = this.cerca_sale_e_post.bind(this);
    this.show = this.show.bind(this);
    this.add_list_items = this.show.bind(this);
    this.ShowModalPrenotaSale = this.ShowModalPrenotaSale.bind(this);
    this.close_modal_sale = this.close_modal_sale.bind(this);
    this.prenota = this.prenota.bind(this);
    this.showModalPrenotaPostazione = this.showModalPrenotaPostazione.bind(this);
    this.close_modal_postazioni = this.close_modal_postazioni.bind(this);
    this.prenota_p = this.prenota_p.bind(this);
  }

  init(){
    console.log(window.server_url)
    fetch(window.server_url+'prenotazioni')
    .then(res => res.json())
    .then(res => this.setState({prenotazioni: res}))
    .then(()=>fetch(window.server_url+'postazioni'))
    .then(res2 => res2.json())
    .then(res2 => this.setState({postazioni: res2}))
    .then(()=> fetch(window.server_url+'sale'))
    .then(res3 => res3.json())
    .then(res3 => this.setState({sale: res3}))
    .then(() => {
      this.setState({logged: window.logged});
    })
    .then(()=> this.setState({initialized: true}))
  };

  componentDidMount(){
    this.init();
    console.log(window._id);
  };

  cerca_sale_e_post(){
    console.log(this.state.data_inizio);
    var data_i = this.state.data_inizio
    console.log(this.state.data_fine);
    var data_f = this.state.data_fine;
    var today = new Date();
    var to = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    var di = new Date(data_i);
    this.setState({show_alert_success: false});
    if(data_i > data_f || di < to){
      console.log("errore");
      this.setState({show_alert: false});
    }else{
      this.setState({show_alert: true});
      var pt_occ=[];
      var sl_occ =[];
      var pt_n_occ=[];
      var sl_n_occ=[];
      for(let i=0; i<this.state.prenotazioni.length; i++){
        console.log(compare_dates(this.state.prenotazioni[i].data_inizio,data_i));
        console.log(compare_dates(this.state.prenotazioni[i].data_fine,data_f));
        if((data_i <= this.state.prenotazioni[i].data_inizio && data_f >= this.state.prenotazioni[i].data_fine) || (data_i >= this.state.prenotazioni[i].data_inizio && data_i <= this.state.prenotazioni[i].data_fine) || (data_f >= this.state.prenotazioni[i].data_inizio && data_f <= this.state.prenotazioni[i].data_fine) || compare_dates(data_i, this.state.prenotazioni[i].data_inizio) || compare_dates(data_f, this.state.prenotazioni[i].data_fine)){
          if(this.state.prenotazioni[i].Posto == null){
            sl_occ.push(this.state.prenotazioni[i].Sala);
          }else{
            pt_occ.push(this.state.prenotazioni[i].Posto);
          }
        }
      }
      for(let j=0;j<this.state.postazioni.length;j++){
        var check = false;
        for(let k = 0; k<pt_occ.length;k++){
          if(this.state.postazioni[j]._id == pt_occ[k]){
            check=true;
          }
        }
        if(check == false && this.state.postazioni[j].stato == true){
          pt_n_occ.push(this.state.postazioni[j]);
        }
      }
      console.log(pt_n_occ);
      this.setState({postazioni_non_occupate: pt_n_occ});
      for(let j=0;j<this.state.sale.length;j++){
        var check = false;
        for(let k = 0; k<sl_occ.length;k++){
          if(this.state.sale[j]._id == sl_occ[k]){
            check=true;
          }
        }
        if(check == false){
          if(this.state.sale[j].stato == true){
            sl_n_occ.push(this.state.sale[j]);
          }
        }
      }
      console.log(sl_n_occ);
      this.setState({sale_non_occupate: sl_n_occ});
    }
    if(sl_n_occ.length === 0){
      this.setState({show_alert_warning: true});
    }else{
      this.setState({show_alert_warning: false});
    }
    if(pt_n_occ.length === 0){
      this.setState({show_alert_warning_post: true});
    }else{
      this.setState({show_alert_warning_post: false});
    }
    console.log('not show warning p:'+!this.state.show_alert_warning_post);
    console.log('sale search: '+ this.state.sale_search);
  };

  add_list_items(element, types){
    if(types === 'postazione'){
      return(
          <ListGroupItem hidden={this.state.sale_search}>
              <Stack direction='horizontal'>
                    <div className='d-flex justify-content-start'>
                      <img className='image_list' width={160} height={160} src={'https://mh-1-agenzia-di-stock.panthermedia.net/media/media_detail/0028000000/28532000/~simbolo-dell-icona-della-sedia-da_28532199_detail.jpg'} />
                      <div className='mx-2'>
                        <h4>{element.id}</h4>
                        <p>{types+' '}</p>
                      </div>
                    </div>
                    <div className='ms-auto'>
                      <h5>{element.costo+'$'}</h5>
                      <Button variant="dark" className='h-50 mt-2' /*onClick={()=>this.ShowModalModify(element)}*/>Modifica</Button>
                    </div>
              </Stack>
          </ListGroupItem>
      );
    }else{
      return(
        <ListGroupItem hidden={!this.state.sale_search}>
            <Stack direction='horizontal'>
                  <div className='d-flex justify-content-start'>
                    <img className='image_list' width={160} height={160} src={'https://thumbs.dreamstime.com/b/icona-sala-riunioni-illustrazione-semplice-dell-della-158395205.jpg'} />
                    <div className='mx-2'>
                      <h4>{element.id}</h4>
                      <p>{types+' '}</p>
                      <p>{element.stato}</p>
                      <p><b>Capienza:</b> {element.capienza} persone</p>
                      <p><b>Servizi:</b> {element.extra}</p>
                    </div>
                  </div>
                  <div className='ms-auto'>
                    <h5>{element.costo+'$'}</h5>
                    <Button variant="dark" className='h-50 mt-2' onClick={() => this.ShowModalPrenotaSale(element)}>Modifica</Button>
                  </div>
            </Stack>
        </ListGroupItem>
      );
    }
  };

  show(){
    var array=[];
    if(this.state.initialized==true){
      var type = 'sala';
      if(this.state.sale_non_occupate.length === 0){
        //this.setState({show_alert_warning: true});
      }else{
        for(let i=0; i<this.state.sale_non_occupate.length;i++){
          console.log(this.state.sale_non_occupate)
          var element = this.state.sale_non_occupate[i];
          console.log(this.state.sale_non_occupate[i].costo)
          array.push(<ListGroupItem key={element._id} hidden={!this.state.sale_search}>
            <Stack direction='horizontal'>
                  <div className='d-flex justify-content-start'>
                    <img className='image_list' width={160} height={160} src={'https://thumbs.dreamstime.com/b/icona-sala-riunioni-illustrazione-semplice-dell-della-158395205.jpg'} />
                    <div className='mx-2'>
                      <h4>{element.id}</h4>
                      <p>{element.stato}</p>
                      <p><b>Capienza:</b> {element.capienza} persone</p>
                      <p><b>Servizi:</b> {element.extra}</p>
                    </div>
                  </div>
                  <div className='ms-auto'>
                    <h5>{element.costo+'$ al giorno'}</h5>
                    <Button variant="dark" className='h-50 mt-2'  onClick={()=>this.ShowModalPrenotaSale(this.state.sale_non_occupate[i])}>Prenota</Button>
                  </div>
            </Stack>
        </ListGroupItem>);
        }}
        //ins
        if(this.state.postazioni_non_occupate.length === 0){
         // this.setState({show_alert_warning_post: true});
        }else{
          for(let j=0;j<this.state.postazioni_non_occupate.length;j++){
            var element = this.state.postazioni_non_occupate[j];
            array.push(<ListGroupItem key={element._id} hidden={this.state.sale_search}>
              <Stack direction='horizontal'>
                    <div className='d-flex justify-content-start'>
                      <img className='image_list' width={160} height={160} src={'https://mh-1-agenzia-di-stock.panthermedia.net/media/media_detail/0028000000/28532000/~simbolo-dell-icona-della-sedia-da_28532199_detail.jpg'} />
                      <div className='mx-2'>
                        <h4>{element.id}</h4>
                      </div>
                    </div>
                    <div className='ms-auto'>
                      <h5>{element.costo+'$ al giorno'}</h5>
                      <Button variant="dark" className='h-50 mt-2' onClick={()=>this.showModalPrenotaPostazione(this.state.postazioni_non_occupate[j])}>Prenota</Button>
                    </div>
              </Stack>
          </ListGroupItem>);
          }
        }
      
      //
      return array;
    }
    
    
    
  };

  ShowModalPrenotaSale(element){
    console.log(element);
    var data_i = new Date(this.state.data_inizio);
    var data_f = new Date(this.state.data_fine);
    var num_giorni = data_f.getTime() - data_i.getTime();
    var n_g = Math.ceil(num_giorni / (1000 * 3600 * 24));
    var tot_giorni = n_g +1;
    var prezzo_tot = element.costo*tot_giorni
    this.setState({costo_sala: prezzo_tot});
    this.setState({nome_sala: element.id});
    this.setState({id_sala: element._id});
    this.setState({show_modal_sale: true});
    this.setState({show_alert_pren: false});
  };

  close_modal_sale(){
    this.setState({show_modal_sale: false});
  };

  prenota(){
    if(this.state.logged == true){
      var data_i = new Date(this.state.data_inizio);
      var data_f = new Date(this.state.data_fine);

      var num_giorni = data_f.getTime() - data_i.getTime();
      var n_g = Math.ceil(num_giorni / (1000 * 3600 * 24));
      var tot_giorni = n_g +1;
      var num_abb = 0;
      var st_n = this.state.prenotazioni[(this.state.prenotazioni.length)-1].id;
      var st_n_sp = st_n.split('A');
      var num = parseInt(st_n_sp[1])+1;
      var id_abb = 'A'+ num;
      console.log(id_abb);
      var today = new Date();
      var t_str = today.toUTCString();
      var mon = today.getMonth()+1;
      var day = today.getDate()+1;
      var data_e = today.getFullYear()+'-'+mon+'-'+day
      console.log(data_e)
      if(tot_giorni > 1){
        var prenotazione = {
          id: id_abb,
          costo: this.state.costo_sala,
          data_inizio: this.state.data_inizio,
          data_fine: this.state.data_fine,
          data_emissione: data_e,
          tipologia: 'multi-giorno',
          Utente: window._id,
          Sala: this.state.id_sala
        };
        fetch(window.server_url+'prenotazioni',{
          headers: {'Content-Type':'application/json'},
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(prenotazione)
        }).then(()=>{
          var arr_abb = this.state.prenotazioni;
          arr_abb.push(prenotazione);
          this.setState({prenotazioni: arr_abb});
        }).then(()=>{
          this.close_modal_sale();
        })
      }else{
        var prenotazione = {
          id: id_abb,
          costo: this.state.costo_sala,
          data_inizio: this.state.data_inizio,
          data_fine: this.state.data_fine,
          data_emissione: data_e,
          tipologia: 'giornaliero',
          Utente: window._id,
          Sala: this.state.id_sala
        };
        fetch(window.server_url+'prenotazioni',{
          headers: {'Content-Type':'application/json'},
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(prenotazione)
        }).then(()=>{
          var arr_abb = this.state.prenotazioni;
          arr_abb.push(prenotazione);
          this.setState({prenotazioni: arr_abb});
        }).then(()=>{
          this.close_modal_sale();
        })

      }
      this.setState({show_alert_success: true});
    }else{
      this.setState({show_alert_pren: true});
    }
  };

  showModalPrenotaPostazione(element){
    console.log(element);
    var data_i = new Date(this.state.data_inizio);
    var data_f = new Date(this.state.data_fine);
    var num_giorni = data_f.getTime() - data_i.getTime();
    var n_g = Math.ceil(num_giorni / (1000 * 3600 * 24));
    var tot_giorni = n_g +1;
    var prezzo_tot = element.costo*tot_giorni;
    console.log(prezzo_tot);
    this.setState({costo_postazione: prezzo_tot});
    this.setState({nome_postazione: element.id});
    this.setState({id_postazione: element._id});
    this.setState({show_modal_postazioni: true});
    this.setState({show_alert_post_pren: false});
  };

  close_modal_postazioni(){
    this.setState({show_modal_postazioni: false});
  }

  prenota_p(){
    console.log('a');
    if(this.state.logged == true){
      var data_i = new Date(this.state.data_inizio);
      var data_f = new Date(this.state.data_fine);

      var num_giorni = data_f.getTime() - data_i.getTime();
      var n_g = Math.ceil(num_giorni / (1000 * 3600 * 24));
      var tot_giorni = n_g +1;
      var st_n = this.state.prenotazioni[(this.state.prenotazioni.length)-1].id;
      var st_n_sp = st_n.split('A');
      var num = parseInt(st_n_sp[1])+1;
      var id_abb = 'A'+ num;
      var today = new Date();
      var t_str = today.toUTCString();
      var mon = today.getMonth()+1;
      var day = today.getDate()+1;
      var data_e = today.getFullYear()+'-'+mon+'-'+day
      if(tot_giorni > 1){
        var prenotazione = {
          id: id_abb,
          costo: this.state.costo_postazione,
          data_inizio: this.state.data_inizio,
          data_fine: this.state.data_fine,
          data_emissione: data_e,
          tipologia: 'multi-giorno',
          Utente: window._id,
          Posto: this.state.id_postazione
        };
        fetch(window.server_url+'prenotazioni',{
          headers: {'Content-Type':'application/json'},
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(prenotazione)
        }).then(()=>{
          var arr_abb = this.state.prenotazioni;
          arr_abb.push(prenotazione);
          this.setState({prenotazioni: arr_abb});
        }).then(()=>{
          this.close_modal_postazioni();
        })
      }else{
        var prenotazione = {
          id: id_abb,
          costo: this.state.costo_postazione,
          data_inizio: this.state.data_inizio,
          data_fine: this.state.data_fine,
          data_emissione: data_e,
          tipologia: 'giornaliero',
          Utente: window._id,
          Posto: this.state.id_postazione
        };
        fetch(window.server_url+'prenotazioni',{
          headers: {'Content-Type':'application/json'},
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(prenotazione)
        }).then(()=>{
          var arr_abb = this.state.prenotazioni;
          arr_abb.push(prenotazione);
          this.setState({prenotazioni: arr_abb});
        }).then(()=>{
          this.close_modal_postazioni();
        })
      }
      this.setState({show_alert_success: true});
    }else{
      this.setState({show_alert_post_pren: true});
    }
  }

  render(){
    return(
      <Container fluid >
        <Row fluid className='cont_img_home' style={{backgroundImage: 'url(https://www.voglioviverecosi.com/wp-content/uploads/2020/03/COWORKING-GUIDA.jpg)', backgroundSize: 'cover', minHeight:600}}>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12} className="my-2"></Col>
          <Col xs={4}></Col>
          <Col xs={4}><h1 id='text_shadow' className='text-white'>PRENOTA DA NOI:</h1></Col>
          <Col xs={4}></Col>
          <Col></Col>
          <Col className='col_search d-md-flex justify-content-center' md={10}>
                <Form.Label className='my-4'>Data Inizio:</Form.Label>
                <Form.Control type="date" className='w-50 me-md-2 my-3' onChange={(event) => {this.setState({data_inizio: event.target.value});}}></Form.Control> 
                <Form.Label className='my-4'>Data Fine:</Form.Label>
                <Form.Control type="date" className='w-50 me-2 my-3' onChange={(event) => this.setState({data_fine: event.target.value})}></Form.Control>
                {['checkbox'].map((type) => (
                  <div key={`inline-${type}`} className="my-4">
                    <Form.Check
                      inline
                      label="Sale"
                      name="group1"
                      checked={this.state.sale_search}
                      type={type}
                      id={`inline-${type}-1`}
                      onChange={()=>this.setState({sale_search: true})}
                    />
                    <Form.Check
                      inline
                      label="Postazioni"
                      name="group1"
                      checked={!this.state.sale_search}
                      type={type}
                      id={`inline-${type}-2`}
                      onChange={()=>this.setState({sale_search: false})}
                    />
                  </div>
                ))}
                <Button variant="dark" className='h-md-50 my-4' onClick={()=> this.cerca_sale_e_post()}>Cerca</Button>
            </Col>
          <Col></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
          <Col xs={12}></Col>
        </Row>
        <Row className='my-2'>
          <Col xs={4}></Col>
          <Col xs={4} className='mx-md-5'>
          </Col>
          <Col xs={4}></Col>
        </Row>
        <Row className='mx-2 my-2'>
          <Col xs={12}>
            <Alert className='my-2' variant='danger' hidden={this.state.show_alert}>Date non valide!</Alert>
            <Alert className='my-2' variant='danger' hidden={!this.state.show_alert_warning || (this.state.show_alert_warning && !this.state.sale_search)}>Nessuna sala disponibile per tale data!</Alert>
            <Alert className='my-2' variant='danger' hidden={!this.state.show_alert_warning_post || (this.state.show_alert_warning_post && this.state.sale_search)}>Nessuna postazione disponibile per tale data!</Alert>
            <Alert className='my-2' variant='success' hidden={!this.state.show_alert_success}>Prenotazione Effettuata!</Alert>
          </Col>
          <Col xs={4}>
             <Button variant="outline-dark" as={Link} to={'/'} hidden={!this.state.logged} onClick={()=>{ this.setState({logged: false}); window.logged=false; window._id=''}}>Log out</Button>
             <Button variant="outline-dark" as={Link} to={'/Profilo'} hidden={!this.state.logged} className='mx-md-2 my-2 my-md-0'> Visualizza Profilo</Button>
          </Col>
          <Col xs={4}>
          </Col>
          <Col xs={4}>
          </Col>
          
        </Row>
        <Row className='my-2'>
          <ListGroup>
            {this.show()}
          </ListGroup>
        </Row>
        <Row>
        <Modal show={this.state.show_modal_sale} onHide={()=>this.close_modal_sale()}>
            <Modal.Header closeButton>
              <Modal.Title>Sala Da Prenotare</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className='my-2 mx-2'>
                <Form.Group className="mb-3" controlId="formBasicsala">
                  <Form.Label>Id Sala:</Form.Label>
                  <Form.Control type="Name" value={this.state.nome_sala} disabled />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicsoldi">
                  <Form.Label>Prezzo:</Form.Label>
                  <Form.Control type="Int" value={this.state.costo_sala} disabled />
                </Form.Group>
              </Form>
              <Alert variant='danger' className='my-2' hidden={!this.state.show_alert_pren}>Devi prima accedere per poter prenotare!</Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-dark' className="mx-2" onClick={()=> this.prenota()}>Prenota</Button>
              <Button variant='outline-danger' onClick={()=>this.close_modal_sale()}>Chiudi</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.show_modal_postazioni} onHide={()=>this.close_modal_postazioni()}>
            <Modal.Header closeButton>
              <Modal.Title>Postazione Da Prenotare</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form className='my-2 mx-2'>
                <Form.Group className="mb-3" controlId="formBasicsala">
                  <Form.Label>Id Postazione:</Form.Label>
                  <Form.Control type="Name" value={this.state.nome_postazione} disabled />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicsoldi">
                  <Form.Label>Prezzo:</Form.Label>
                  <Form.Control type="Int" value={this.state.costo_postazione} disabled />
                </Form.Group>
              </Form>
              <Alert variant='danger' className='my-2' hidden={!this.state.show_alert_post_pren}>Devi prima accedere per poter prenotare!</Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-dark' className="mx-2" onClick={()=> this.prenota_p()}>Prenota</Button>
              <Button variant='outline-danger' onClick={()=>this.close_modal_postazioni()}>Chiudi</Button>
            </Modal.Footer>
          </Modal>
        </Row>
      </Container>
    );
  }
};