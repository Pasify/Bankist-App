'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-01-25T14:11:59.604Z',
    '2022-01-26T17:01:17.194Z',
    '2022-01-27T23:36:17.929Z',
    '2022-01-28T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2021-10-25T14:18:46.235Z',
    '2021-12-05T16:33:06.386Z',
    '2021-03-10T14:43:26.374Z',
    '2021-06-25T18:49:59.371Z',
    '2021-12-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const displayForematedDate = function (date, locale) {
  const CalcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = CalcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days go`;
  else {
    // const day = date.getDate();
    // const month = `${date.getMonth() + 1}`.padStart(2, '0');
    // const year = date.getFullYear();
    // return `${day}  / ${month} / ${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// a general function to format currency
const formatCurr = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = displayForematedDate(date, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formattedBalnce = formatCurr(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedBalnce}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurr(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurr(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// time out function
const timmm = function () {
  // set the time to any value
  let time = 30;
  const tick = function () {
    // convert the time to seconds and minutes
    const min = String(Math.trunc(time / 60)).padStart(2, 0);

    // take what ever remains and make it he seconds
    const sec = String(time % 60).padStart(2, 0);
    // display time on UI
    labelTimer.textContent = `${min} : ${sec}`;

    // when thw timer gets to 0 stop the coubt down
    if (time === 0) {
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      clearInterval(tt);
      // alert(`you are logged out`)
    }
    // minus 1second from the time every 1 second
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// stay loged in //////////
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
///////////////

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // creating date

    // const day = now.getDate();

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'short',
    };
    // const local = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // `${day} / ${month} / ${year}, ${hours}:${minutes}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // start logout timer
    // timer starts running
    if (timer) clearInterval(timer);
    timer = timmm();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    // reset timer
    clearInterval(timer);
    timer = timmm();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';

  // reset timer
  clearInterval(timer)
  timer=timmm()
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(account1, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// working with numbers
console.log(23 === 23.0);
// to convert a string to a number
console.log(Number(23));
console.log(+'23');

// we coujd also do what we call parsing

const maintimer = document.querySelector('.maintimer');
labelSumIn.addEventListener('click', function () {
  timmm();
});

// isNaN is used to check if value is not a number
console.log(Number.isNaN(+'12px'));
console.log(+'12px');

// isFinite is considered the best way of checking if  a value is a number or not
console.log(Number.isFinite(23));
console.log(Number.isFinite('45'));

console.log(Number.isFinite(Number.parseInt('34kkj')));

// Math and rounding
console.log(Math.sqrt(25)); // to get the aquare root of a number
console.log(25 ** (1 / 2));

console.log(Math.max(2.3, 4, 6, 67, 89898, 345634, 2333, 6756));
const sum = [2.3, 4, 6, 67, 89898, 345634, 2333, 6756];
console.log(Math.max(...sum));
console.log(Math.min(...sum));

// //  to get the max using the the reduce method
// const max = sum.reduce((accum, ele) => {
//   if (accum > ele) {
//     return accum;
//   } else return ele;
// }, sum[0]);
// console.log(max);

// // to get the min using the reduce method
// const minn = sum.reduce((accum, ele) => {
//   if (accum < ele) {
//     return accum;
//   } else {
//     return ele;
//   }
// }, sum[0]);
// console.log(minn);

// to get th max eleent in an array using the fotr of loop
// let x = 0;
// for (const [i, ele] of sum.entries()) {
//   let maxx = ele;
//   if (maxx > x) x = maxx;
// }
// console.log(x);

// console.log(Math.PI * Math.sqrt(Number.parseFloat('10px')));
// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// creat a random diceroll between 1 to 20
// console.log(Math.trunc(Math.random() * 20) + 1);

// generating a random number between a min ad a max
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(1, 5));

// rounding up
console.log(Math.round(23.5)); // rounds up a decimal number to the nearest integer

console.log(Math.ceil(44.1));

console.log(Math.floor('10.9'));

// rounding decimals
console.log(+(23.5408947649094).toFixed(2));

//  working with dates
const today = new Date(account1.movementsDates[0]);
console.log(today);
const backthen = new Date(3 * 24 * 60 * 60 * 1000);
console.log(backthen);
console.log(backthen.getFullYear());
console.log(backthen.getMonth());
console.log(backthen.getDate());
console.log(backthen.toISOString());
console.log(backthen.getTime());

console.log(Date.now());
console.log(new Date(Date.now()));

// doing operations with date
const bday = new Date(1997, 4, 9);
console.log(bday.getTime());
console.log(+bday);

const dayspassed = function (date1, date2) {
  return (date2 - date1) / (1000 * 60 * 60 * 24);
};
const days1 = dayspassed(bday, new Date(2022, 0, 29));
console.log(days1);
console.log(new Intl.DateTimeFormat('en-GB').format(bday));
console.log(navigator);
/*
internalization API
allows us to format numbers and strigs according to differnt languages
*/
// internalization of numbers
const opt = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
};
const nos = 6664484.88;
console.log(`Great Britain:`, Intl.NumberFormat('en-GB', opt).format(nos));
console.log(`USA:`, Intl.NumberFormat('en-US', opt).format(nos));
console.log(`Germany:`, Intl.NumberFormat('de-DE', opt).format(nos));

// implememnting the set timeout
const goodies = ['competence', 'knowledge'];
const goodnesstimer = setTimeout(
  function (good1, good2) {
    console.log(`i have arrived eith my goodies of ${good1} and ${good2}`);
  },
  3000,
  ...goodies
);
if (goodies.includes('knowledge')) {
  clearTimeout(goodnesstimer);
}

// setinterval

setInterval(() => {
  const now = new Date();
  const formatter = Intl.DateTimeFormat(navigator.language, {
    hour: '2-digit',
    minute: 'numeric',
    second: 'numeric',
  }).format(now);
}, 1000);
// ready to be added to github