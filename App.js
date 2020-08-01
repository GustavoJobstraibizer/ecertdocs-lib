import Modal from "modal-vanilla";
import React, { useState } from "react";
import ControlPage from "./src/components/ControlPage";
import ModalEcert from "./src/components/ModalEcert";

export default function App() {
  const [showModal, setShowModal] = useState(false);

  window.addEventListener("load", () => {
    const MyPackage = {
      user: null,
      message: [],
      file: null,

      test() {
        console.log("My Button");
      },

      init(name, surname, age) {
        this.user = new User(name, surname, age);
        console.log(this.user);
      },

      createParticipantSignature() {
        new Modal({ el: document.getElementById("static-modal") }).show();
        // setShowModal(true);
      },
    };
    globalThis.MyPackage = MyPackage;

    const myModal = new Modal({
      content: ControlPage(),
    });

    myModal.on("show", () => console.log(MyPackage.message));
    myModal.on("hidden", () => {
      MyPackage.message.push(`message_${Math.round(Math.random() * 100)}`);
    });
    console.log("criou");
  });

  return (
    <>
      {showModal && <ModalEcert />}
      {/* <ControlPage />

      <div className="d-flex justify-content-center align-items-center">
        <canvas
          id="pdfcanvas"
          style={{ width: "55vw", height: "55vh" }}
        ></canvas>
      </div> */}
    </>
  );
}
