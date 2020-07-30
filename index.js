import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'modal-vanilla';
import { User } from './src/entities/User';

window.addEventListener('load', () => {

  const MyPackage = {

    user: null,
    message: [],
    file: null,

    test() {
      console.log('My Button')
    },

    init(name, surname, age) {
      this.user = new User(name, surname, age);
      console.log(this.user);
    },

    createParticipantSignature() {
      // const modal = document.createElement('div');
      // modal.id = 'my-modal';

      // document.body.appendChild(modal);

      
      myModal.show();
      // const modal = new Modal();
      // modal.showModal();
      // return new Promise((resolve) => {
      //   resolve(`file is ${file} and name is ${name}`)
      // }).then((data) => alert(data))
    }
  
  }
  window.MyPackage = MyPackage;

  const inputFile = document.querySelector('#inputFile');
  const btnFile = document.querySelector('#btnTest');

  btnFile.addEventListener('click', () => inputFile.click());
  inputFile.addEventListener('change', (e) => {
    MyPackage.file = e.target.files;
    console.log(MyPackage.file)
  });

  const myModal = new Modal({
    content: '<canvas id="pdfContent"></canvas>'
  });

  myModal.on('show', () => console.log(MyPackage.message));
  myModal.on('hidden', () => {
    MyPackage.message.push(`message_${Math.round(Math.random() * 100)}`)
  });
  // const myBtnTest = new ButtonComponent().createBtn();
  
  // myBtnTest.addEventListener('click', () => MyPackage.createParticipantSignature());
});