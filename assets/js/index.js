const controls = Object.fromEntries(Array.from(document.querySelectorAll('section.about .controls button')).map(e => [e.getAttribute('class'), e]));
const picture = document.querySelector('section .picture')

controls['toggle-theme'].addEventListener('click', () => {
  document.body.classList.toggle('dark');
})

function toggleClass(el, [class_a1, class_a2], [class_b1, class_b2]) {
  if(el.classList.contains(class_a1) && el.classList.contains(class_a2)) {
    el.classList.remove(class_a1);
    el.classList.remove(class_a2);
    el.classList.add(class_b1);
    el.classList.add(class_b2);
  } else if(el.classList.contains(class_b1) && el.classList.contains(class_b2)) {
    el.classList.remove(class_b1);
    el.classList.remove(class_b2);
    el.classList.add(class_a1);
    el.classList.add(class_a2);
  }
}

controls['show-qr'].addEventListener('click', () => {
  picture.classList.toggle('flip');
  
  toggleClass(controls['show-qr'].querySelector('i'), ['fa-solid', 'fa-qrcode'], ['fa-regular', 'fa-circle-user']);
  controls['show-qr'].classList.toggle('active');
})