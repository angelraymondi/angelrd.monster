const controls = Object.fromEntries(
  Array.from(document.querySelectorAll("section.about .controls button")).map(
    (e) => [e.classList[0], e]
  )
);
const picture = document.querySelector("section .picture");

controls["toggle-theme"].addEventListener("click", () => {
  const actualTheme = document.body.getAttribute("data-theme");
  if (actualTheme === "light") {
    document.body.setAttribute("data-theme", "dark");
  } else if (actualTheme === "dark") {
    document.body.setAttribute("data-theme", "light");
  }
});

function toggleBetweenSiblings(className, el1, el2) {
  if (el1.classList.contains(className)) {
    el1.classList.remove(className);
    el2.classList.add(className);
  } else if (el2.classList.contains(className)) {
    el2.classList.remove(className);
    el1.classList.add(className);
  }
}

controls["show-qr"].addEventListener("click", () => {
  picture.classList.toggle("flip");

  toggleBetweenSiblings('show', ...controls['show-qr'].children)
});

controls["toggle-theme"].addEventListener("click", () => {
  toggleBetweenSiblings('show', ...controls['toggle-theme'].children)
});
