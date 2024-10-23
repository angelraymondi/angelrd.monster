const controls = Object.fromEntries(Array.from(document.querySelectorAll('section.about .controls button')).map(e => [e.getAttribute('class'), e]));
const picture = document.querySelector('section .picture')

controls['toggle-theme'].addEventListener('click', () => {
  document.body.classList.toggle('dark');
})
controls['show-qr'].addEventListener('click', () => {
  picture.classList.toggle('flip');
})