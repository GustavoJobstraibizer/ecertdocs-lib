import './button.scss';

export class ButtonComponent {

  constructor() {}

  createBtn() {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.id = 'inputFileSelectPDF';
    inputFile.hidden = true;
    document.body.appendChild(inputFile);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = 'Select the PDF';
    btn.classList.add('btn', 'btn--success');
    document.body.appendChild(btn);
    btn.addEventListener('click', () => inputFile.click());
    return btn;
  }

  testMyBtn() {
    console.log('Hello im a button');
  }

}