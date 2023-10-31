// COUNTER COMPONENT
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');

const inputHandler = () => {
   // Nustatyti maksimalu simboliu skaiciu:
   const maxCharacters = 150;

   // Nustatyti siuo metu ivestu simboliu skaiciu:
   const currentlyTypedCharacters = textareaEl.value.length;

   // Suskaiciuoti kiek simbobliu dar galima ivesti (maxCharacters - currentlyTypedCharacters):
   const charactersLeft = maxCharacters - currentlyTypedCharacters;
   console.log(charactersLeft);

   // Atvaizduoti likusiu simboliu skaiciu:
   counterEl.textContent = charactersLeft;
}
textareaEl.addEventListener('input', inputHandler);