export const Form = () => {
  let x = document.createElement('input');
  x.type = 'text';

  let y = document.createElement('input');
  y.type = 'text';

  let name = document.createElement('input');
  name.type = 'text';

  let form = document.createElement('form');
  form.appendChild(x)
  form.appendChild(y)
  form.appendChild(name)
  return form;
}
