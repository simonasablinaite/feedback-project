// -- GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtntEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');

const renderFeedbackItem = feedbackItem => {
   // Naujas komentaro elementas HTML'e:
   const feedbackItemHTML = `
<li class='feedback'>
<button class='upvote'>
<i class='fa-solid fa-caret-up upvote__icon'></i>
<span class='upvote__count'>${feedbackItem.upVoteCount}</span>
</button>

<section class='feedback__badge'>
<p class='feedback__letter'>${feedbackItem.badgeLetter}</p>
</section>

<div class='feedback__content'>
<p class='feedback__company'>${feedbackItem.companyName}</p>
<p class='feedback__text'>${feedbackItem.text}</p>
</div>
<p class='feedback__date'>${feedbackItem.daysAgo === 0 ? 'NEW' : `${feedbackItem.daysAgo}d`}</p>
</li>
`;

   // Naujo komentaro iterpimas i sarasa:
   feedbackListEl.insertAdjacentHTML('beforeend', feedbackItemHTML);
};

// -- COUNTER COMPONENT --
const inputHandler = () => {
   // Nustatyti maksimalu simboliu skaiciu:
   const maxCharacters = MAX_CHARS;

   // Nustatyti siuo metu ivestu simboliu skaiciu:
   const currentlyTypedCharacters = textareaEl.value.length;

   // Suskaiciuoti kiek simbobliu dar galima ivesti (maxCharacters - currentlyTypedCharacters):
   const charactersLeft = maxCharacters - currentlyTypedCharacters;

   // Atvaizduoti likusiu simboliu skaiciu:
   counterEl.textContent = charactersLeft;
}

textareaEl.addEventListener('input', inputHandler);

// -- FORM COMPONENT --
const showVisualIndicator = textCheck => {
   const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid';
   // Rodyti validzios formos stiliu
   formEl.classList.add(className);

   // Panaikinti stiliu po 2s
   setTimeout(() => formEl.classList.remove(className), 2000);
};

const submitHandler = (event) => {
   //  Neleisti numatytojo narsykles veiksmo (puslapio persikrovimo po duomenu pasubmitinimo):
   event.preventDefault();

   // Gauti teksta is textarea elemnto:
   const text = textareaEl.value;

   // Teksto validacijos (pvz.: patikrinti ar nurodytas # ir ar tekstas nera per trumpas):
   if (text.includes('#') && text.length >= 5) {
      showVisualIndicator('valid');
   } else {
      showVisualIndicator('invalid')
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

   // Sukuriamas komentaru elemento objektas ir pateikiami atsiliepimu elementai
   const feedbackItem = {
      upVoteCount,
      companyName,
      badgeLetter,
      daysAgo,
      text
   };

   renderFeedbackItem(feedbackItem);

   // Issiunciamas komentaro elementas i serveri:
   fetch(`${BASE_API_URL}/feedbacks`, { // POST 
      method: 'POST',
      body: JSON.stringify(feedbackItem),
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
      }
   }).then(response => {
      if (!response.ok) {
         console.log('Something went wrong');
         return;
      }
      console.log('Successfully submitted');
   }).catch(error => console.log(error));


   // Textarea laukelio isvalymas po submitinimo:
   textareaEl.value = '';

   // Uzblurinamas submito mygtukas:
   submitBtntEl.blur();

   // Nuresetinamas counteris:
   counterEl.textContent = MAX_CHARS;
}

formEl.addEventListener('submit', submitHandler);

// -- FEEDBACK LIST COMPONENT --
fetch(`${BASE_API_URL}/feedbacks`) // GET request
   .then(response => response.json())
   .then(data => {
      // panaikinamas spineris, pries gaunant duomenis:
      spinnerEl.remove();

      // Pakartoti kiekviena elementa is atsiliepimu masyvo ir pateikti ji sarase:
      data.feedbacks.forEach(feedbackItem => {
         // Naujas komentaro elementas HTML'e:
         renderFeedbackItem(feedbackItem);
      });

   })
   .catch(error => {
      feedbackListEl.textContent = `Failed to fetch feedback items. Erroe message: ${error.message}`;
   });