import { SignaturePosition } from "./signature-position";
import { EtipoDocumento } from "./tipo-documento";

export class Participant {
  email = "";
  document = "";
  role = EtipoDocumento.DIGITAL;
  name = "";
  tipo = "";
  position = new SignaturePosition();

  constructor(props) {
    Object.assign(this, props);
  }
}
