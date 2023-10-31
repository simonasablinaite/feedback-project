// -- GLOBAL --
const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtntEl = document.querySelector('.submit-btn');

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

   // Dabar turime teksta, is kurio reikia istraukti kita informacija (imones pavadinimas, pirma imones pavadinimo raide, data, kada parasytas komentaras):
   const hashtag = text.split(' ').find(word => word.includes('#')); // su splitu gauname zodziu masyva, o su find, masyve ieskome zodzio, kuris turetu # simboli

   const companyName = hashtag.substring(1); // imanones pavadinimas be # simbolio

   const badgeLetter = companyName.substring(0, 1).toUpperCase(); // Gauname pirmaja kompanijos pavadinimo raide ir ja is karto paverciame didziaja raide

   const upVoteCount = 0;
   const daysAgo = 0;

   // Naujas komentaro elementas HTML'e:
   const feedbackItemHTML = `
   <li class='feedback'>
   <button class='upvote'>
   <i class='fa-solid fa-caret-up upvote__icon'></i>
   <span class='upvote__count'>${upVoteCount}</span>
   </button>

   <section class='feedback__badge'>
   <p class='feedback__letter'>${badgeLetter}</p>
   </section>

   <div class='feedback__content'>
   <p class='feedback__company'>${companyName}</p>
   <p class='feedback__text'>${text}</p>
   </div>
   <p class='feedback__date'>${daysAgo === 0 ? 'NEW' : `${daysAgo}d`}</p>
   </li>
   `
   // Naujo komentaro iterpimas i sarasa:
   feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);

   // Textarea laukelio isvalymas po submitinimo:
   textareaEl.value = '';

   // Uzblurinamas submito mygtukas:
   submitBtntEl.blur();

   // Nuresetinamas counteris:
   counterEl.textContent = 150;
}

formEl.addEventListener('submit', submitHandler);