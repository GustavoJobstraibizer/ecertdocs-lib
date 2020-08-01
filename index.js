// import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "modal-vanilla";
import "./main.scss";
import { ControlPage } from "./src/components/ControlPage";
import { User } from "./src/entities/User";
import * as helper from "./src/helpers/helper";

((window) => {
  const MyPackage = {
    user: null,
    message: [],
    pdf: null,
    cropper: null,
    WIDTH: null,
    HEIGHT: null,

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

    helper.exibePdf(MyPackage.pdf, document.querySelector("#pdfCanvas"));
  });

  myModal.on("hidden", () => {
    MyPackage.message.push(`message_${Math.round(Math.random() * 100)}`);
  });
})(window);
