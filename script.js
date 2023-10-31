// -- GLOBAL --
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');

// -- COUNTER COMPONENT --
const inputHandler = () => {
   // Nustatyti maksimalu simboliu skaiciu:
   const maxCharacters = 150;

   // Nustatyti siuo metu ivestu simboliu skaiciu:
   const currentlyTypedCharacters = textareaEl.value.length;

   // Suskaiciuoti kiek simbobliu dar galima ivesti (maxCharacters - currentlyTypedCharacters):
   const charactersLeft = maxCharacters - currentlyTypedCharacters;

   // Atvaizduoti likusiu simboliu skaiciu:
   counterEl.textContent = charactersLeft;
}
textareaEl.addEventListener('input', inputHandler);

// -- FORM COMPONENT --
const submitHandler = (event) => {
   //  Neleisti numatytojo narsykles veiksmo (puslapio persikrovimo po duomenu pasubmitinimo):
   event.preventDefault();

   // Gauti teksta is textarea elemnto:
   const text = textareaEl.value;

   // Teksto validacijos (pvz.: patikrinti ar nurodytas # ir ar tekstas nera per trumpas):
   if (text.includes('#') && text.length >= 5) {
      // Rodyti validzios formos stiliu
      formEl.classList.add('form--valid');

      // Panaikinti stiliu po 2s
      setTimeout(() => formEl.classList.remove('form--valid'), 2000);
   } else {
      // Rodyti nevalidzios formos stiliu
      formEl.classList.add('form--invalid');

      // Panaikinti stiliu po 2s
      setTimeout(() => {
         formEl.classList.remove('form--invalid');
      }, 2000);

      // Fokusuoti tekstine sriti
      textareaEl.focus();

      // Sustabdyti sios f-jos veikima:
      return;
   }
}

formEl.addEventListener('submit', submitHandler);