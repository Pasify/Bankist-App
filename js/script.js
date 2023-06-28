import { users } from './user.js';
//

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale
let [user1, user2, user3, user4] = users;
const accounts = [user1, user2, user3, user4];

/////////////////////////////////////////////////
// ELEMENT
const loginContainer = document.querySelector('.container');
const labelWelcome = document.querySelector('.welcome');
const user = document.querySelector('.user');
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

const LogoutButton = document.querySelector('.logout__btn');
const navButton = document.querySelector('.navigation__button');
const checkBox = document.querySelector('.navigation__checkbox');
const actionsContainer = document.querySelector('.actions');
/////////////////////////////////////////////////
// Functions
const displayForematedDate = function (date, locale) {
  const CalcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = CalcDaysPassed(new Date(), date);
  // console.log(daysPassed);

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

// DISPLAY MOVEMENTS
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

// CALCULATE AND DISPLAY BALANCE
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

// GENERATE USERNAME
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

// UPDATE UI
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
let time;
// time out function
const timmm = function () {
  // set the time to any value
  time = 120;
  const tick = function () {
    // convert the time to seconds and minutes
    const min = String(Math.trunc(time / 60)).padStart(2, 0);

    // take what ever remains and make it he seconds
    const sec = String(time % 60).padStart(2, 0);
    // display time on UI
    labelTimer.textContent = `${min}m : ${sec}s`;

    // when thw timer gets to 0 stop the coubt down
    if (time === 0) {
      // labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      loginContainer.classList.remove('hide');
      clearInterval(tick);
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
// EVENT HANDLERS
let currentAccount, timer;
// stay logged in //////////
currentAccount = user1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
// containerApp.style.display = 'grid';
// loginContainer.style.display = 'none';
///////////////

// LOGGING IN
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    user.textContent = `Hello, ${currentAccount.owner.split(' ')[0]} !`;

    loginContainer.classList.add('hide');
    containerApp.style.opacity = 100;
    containerApp.style.display = 'grid';

    // creating date

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
  } else {
    alert(`invalid user`);
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
  clearInterval(timer);
  timer = timmm();
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
    // console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

// sorting the transctions
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(account1, !sorted);
  sorted = !sorted;
});

// logout
LogoutButton.addEventListener('click', function () {
  const confirm = window.confirm(`are you sure you want to log out`);
  if (confirm) {
    time = 0;
  }
  console.log(time);
});

navButton.addEventListener('click', function () {
  if (!checkBox.checked) {
    actionsContainer.style.display = 'grid';

    actionsContainer.classList.add('display');
  } else if (checkBox.checked) {
    actionsContainer.style.display = 'none';
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
