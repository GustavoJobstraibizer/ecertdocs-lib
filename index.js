import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "modal-vanilla";
import { ControlPage } from "./src/components/ControlPage";
import { User } from "./src/entities/User";
import * as helper from "./src/helpers/helper";

window.addEventListener("load", () => {
  const MyPackage = {
    user: null,
    message: [],
    pdf: null,
    cropper: null,

    test() {
      console.log("My Button");
    },

    init(name, surname, age) {
      this.user = new User(name, surname, age);
      console.log(this.user);
    },

    createParticipantSignature() {
      myModal.show();
    },
  };
  window.MyPackage = MyPackage;

  const inputFile = document.querySelector("#inputFile");
  const btnFile = document.querySelector("#btnTest");

  btnFile.addEventListener("click", () => inputFile.click());
  inputFile.addEventListener("change", (e) => {
    MyPackage.pdf = e.target.files;
    console.log(MyPackage.pdf);
  });

  const myModal = new Modal({
    content: ControlPage(),
  });

  myModal.on("shown", () => {
    console.log(MyPackage.message);

    const previousBtn = document.querySelector("#previousBtn");
    previousBtn.addEventListener("click", () => console.log("previous"));

    debugger;

    helper.exibePdf(MyPackage.pdf, document.querySelector("pdfcanvas"));
  });

  myModal.on("hidden", () => {
    MyPackage.message.push(`message_${Math.round(Math.random() * 100)}`);
  });
});
