import '../css/common.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

refs = {
  startBtn: document.querySelector('button[data-start]'),
  dateInput: document.querySelector('#datetime-picker'),
};

//Нотификатор
function alertMesseg() {
  return Notiflix.Notify.failure('Please choose a date in the future');
}

//Календарь
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose() {
    verificetionDate();
  },
};
const fp = flatpickr(refs.dateInput, options);

onDisabled(refs.startBtn);
let startTime = fp.selectedDates[0];

refs.startBtn.addEventListener('click', startTimer);

function startTimer(ev) {
  startTime = fp.selectedDates[0];
  dateTimer();
  onDisabled(refs.startBtn, refs.dateInput);
  timeForMagic();
}

function dateTimer() {
  const idInterval = setInterval(() => {
    if (startTime - new Date() > 0) {
      nowTime = convertMs(startTime - new Date());
      onPageDate(nowTime);
    } else {
      stopDateTimer(idInterval);
      timeForMagicRemove();
      onDisabled(refs.startBtn);
    }
  }, 1000);
}

function verificetionDate() {
  if (fp.selectedDates[0] > new Date()) {
    ofDisabled(refs.startBtn);
  } else {
    alertMesseg();
  }
}

function stopDateTimer(id) {
  clearInterval(id);
  ofDisabled(refs.startBtn, refs.dateInput);
}

function onDisabled(...el) {
  el.map(e => e.setAttribute('disabled', true));
}

function ofDisabled(...el) {
  el.map(e => e.removeAttribute('disabled'));
}

function onPageDate({ days, hours, minutes, seconds }) {
  document.querySelector('span[data-days]').textContent = days;
  document.querySelector('span[data-hours]').textContent = hours;
  document.querySelector('span[data-minutes]').textContent = minutes;
  document.querySelector('span[data-seconds]').textContent = seconds;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = addLeadingZero(Math.floor(ms / day));
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function timeForMagic() {
  document.querySelector('.text-magic').textContent = '🧙‍♂️ Time for magic...';
}

function timeForMagicRemove() {
  document.querySelector('.text-magic').textContent = 'Please choose date in top, and push start';
  return Notiflix.Notify.warning('Ouch! Magic still in development');
}
