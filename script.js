// -- GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api';

const textareaEl = document.querySelector('.form__textarea');
const counterEl = document.querySelector('.counter');
const formEl = document.querySelector('.form');
const feedbackListEl = document.querySelector('.feedbacks');
const submitBtntEl = document.querySelector('.submit-btn');
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags');

const renderFeedbackItem = feedbackItem => {
   // Naujas komentaro elementas HTML'e:
   const feedbackItemHTML = `
<li class='feedback'>
<button class='upvote'>
<i class='fa-solid fa-caret-up upvote__icon'></i>
<span class='upvote__count'>${feedbackItem.upvoteCount}</span>
</button>

<section class='feedback__badge'>
<p class='feedback__letter'>${feedbackItem.badgeLetter}</p>
</section>

<div class='feedback__content'>
<p class='feedback__company'>${feedbackItem.company}</p>
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
      upvoteCount: upVoteCount,
      company: companyName,
      badgeLetter: badgeLetter,
      daysAgo: daysAgo,
      text: text
   };

   renderFeedbackItem(feedbackItem);

   // Issiunciamas komentaro elementas i serveri:
   fetch(`${BASE_API_URL}/feedbacks`, {
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
const clickHandler = event => {
   // Gauti spusteleta HTML elementa:
   const clickedEl = event.target;

   // Nustatoma, ar vartotojas ketino balsuoti, ar isskleisti elementa:
   const upvoteIntention = clickedEl.className.includes('upvote');

   // Paleisti atitinkama logika:
   if (upvoteIntention) {
      // Gauti upvote mygtuka:
      const upvoteBtnEl = clickedEl.closest('.upvote');

      // Paspaudus upvote mygtuka, nebeleisti jo paspausti antra karta:
      upvoteBtnEl.disabled = true;

      // Pasirenkamas upvote skaiciavimas su upvote mygtuku:
      const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');

      // Gaunamas siuo metu rodomu balsu skaicius:
      let upvoteCount = +upvoteCountEl.textContent;

      // Pridedamas balsas 1-nu vienetu ir atvaizduojamas ekrane:
      upvoteCountEl.textContent = ++upvoteCount;
   } else {      // Isskleide spusteleta atsiliepimo elementa:
      clickedEl.closest('.feedback').classList.toggle('feedback--expand');
   }
};

feedbackListEl.addEventListener('click', clickHandler);

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

// HASHTAG LIST COMPONENT
const clickHandler2 = event => {
   // Gauti paspausta elementa:
   const clickedEl = event.target;

   // Sustabdyti funkcija, jei ivyko paspaudimas isoriniu mygtuku sarase:
   if (clickedEl.className === 'hashtags') return;

   // Istraukiamas imones pavadinimas is hashtago:
   const companyNameFromHashtag = clickedEl.textContent.substring(1).toLowerCase().trim();

   // Pereiti per visus sarase esancius elementus:
   feedbackListEl.childNodes.forEach(childNode => {
      // Sustabdoma sunkcijos iteracija, jei text yra node:
      if (childNode.nodeType === 3) return;

      // Istraukiamas imones pavadinimas is saraso:
      const companyNameFromFeedbackItem = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

      // Istrinami komentarai is saraso, kuriu hashtagas ir imopnes pavadinimas nesutampa:
      if (companyNameFromHashtag !== companyNameFromFeedbackItem) {
         childNode.remove();
      }
   });
};

hashtagListEl.addEventListener('click', clickHandler2);