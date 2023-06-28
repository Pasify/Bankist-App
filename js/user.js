const users = [
  {
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
  },

  {
    owner: 'John Doe',
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
  },

  {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  },
  {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  },
];
export { users };
