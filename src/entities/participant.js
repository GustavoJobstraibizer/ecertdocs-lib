import SignaturePosition from './signature-position';
import EtipoDocumento from './tipo-documento';

class Participant {
  constructor() {
    this.email = '';
    this.document = '';
    this.role = EtipoDocumento.DIGITAL;
    this.name = '';
    this.tipo = '';
    this.position = new SignaturePosition();
  }
}

export default Participant;
