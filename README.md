# Elementi app
Nel progetto non è presente un file bat per l'esecuzione del frontend in locale perchè è stato deployato. Nella cartella src sono presenti:
- un index.js che richiama il file App.js e lo renderizza
- un file App.js che renderizza al suo interno il Footer e la Navbar
Come è possibile osservare nel file gitignore è stato escluso il file .env che contiene al suo interno link al server
# Cartella style components 
In questa cartella sono presenti:
- Footer che rappresenta la fine di ogni pagina web e contiene informazioni sui contatti
- Navbar che presenta due componenti una Navbar (importato da bootstrap-react) e un BrowserRouter che permette la navgabilità tra le pagine in base al cambiamento del path
# Cartella pages 
In questa cartella sono presenti:
- Home: che rappresenta la pagina home dell'app relativa alla prenotazione e visualizzazione di sale e postazioni disponibili
- Accedi: che rappresenta la pagina di Accesso che reindirizza alla pagina home una volta acceduto al sistema
- Iscriviti: che rappresenta la pagina relativa all'iscrizione
- Profilo: che rappresenta la pagina relativa alla visualizzazione del profilo utente e dei ticket 

Infine sono presenti alcuni file css per visualizzare al meglio i contenuti
