'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Homam Mohialdeen',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Amer Zakaria',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Roberto Carl',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const userName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(theName => theName[0])
      .join('');
  });
};
userName(accounts);
// console.log(account1, account2, account3);

containerMovements.innerHTML = '';

const printMovements = function (theSpecificArray, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? theSpecificArray.slice().sort((a, b) => a - b)
    : theSpecificArray;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Reduce Method to find the balance
let balance;
const printBalance = function (currentUser) {
  //Here i can switch the parameter to forof loop but the parameter better
  //to calling the function later
  // for (let account of accounts) {
  // if (currentUser.userName === inputLoginUsername.value) { // this is a stupid idea
  balance = currentUser.movements.reduce(
    (acc, key, index, arr) => acc + key,
    0
  );

  labelBalance.innerHTML = `${balance} €`;
  // console.log(balance);
};

// print the income,outcomes and intersts in ₤ $ by chaining methods
const dollarToEuro = 1.1;

const calcDisplaySummery = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${Math.trunc(incomes)}€`;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(Math.trunc(outcomes))}€`;

  const entries = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter((mov, index) => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${entries} €`;
  console.log(entries);
};
const updateUI = function (account) {
  // for (let account of accounts) { //Here i switch foreach by parameters too
  // if (
  //   account.userName === inputLoginUsername.value &&
  //   account.pin === Number(inputLoginPin.value)
  // ) {
  // print the balance (for each user)
  printBalance(account);
  // print the movements
  printMovements(account.movements);
  calcDisplaySummery(account);
  labelWelcome.textContent = `Welcome ${account.owner.split(' ')[0]}`;
  // }
};

// Login EventListener

let findUnObj;
let findPin;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  findPin = accounts.find(
    account => account.pin === Number(inputLoginPin.value)
  );

  findUnObj = accounts.find(
    account => account.userName === inputLoginUsername.value
  );

  // my HBD for username and pin checks
  if (findUnObj && findPin) {
    console.log('done');
    containerApp.style.opacity = 100;

    updateUI(findUnObj);
    inputLoginPin.value = inputLoginUsername.value = '';

    // Transfer money EventListener
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('ee');
  const currentReciverObj = accounts.find(
    mov => mov.userName === inputTransferTo.value
  );

  if (
    currentReciverObj &&
    currentReciverObj.userName !== findUnObj.userName &&
    inputTransferAmount.value > 0 &&
    inputTransferAmount.value <= balance
  ) {
    // for of the account i want to push to its movemnts
    // if the account.username= currentreciver.username push the positve amount to its movement
    // and if the account.username = findun.username push the negative amouont to its movement
    currentReciverObj.movements.push(+inputTransferAmount.value);
    findUnObj.movements.push(-inputTransferAmount.value);
    console.log(findUnObj.movements, currentReciverObj.movements);

    updateUI(findUnObj);
    // calcDisplaySummery(findUnObj);
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const findClsoeObj = accounts.find(
    acc =>
      acc.pin === Number(inputClosePin.value) &&
      acc.userName === inputCloseUsername.value
  );
  console.log(findClsoeObj);

  if (findClsoeObj && findClsoeObj === findUnObj) {
    console.log('will be closed');
    const deletedAccountIndex = accounts.findIndex(
      acc =>
        acc.pin === Number(inputClosePin.value) &&
        acc.userName === inputCloseUsername.value
    );
    console.log(deletedAccountIndex);

    accounts.splice(deletedAccountIndex, 1);
    containerApp.style.opacity = 0;
  }
  console.log(findClsoeObj === findUnObj);
  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    findUnObj.movements.some(mov => mov >= Number(inputLoanAmount.value) * 0.1)
  ) {
    findUnObj.movements.push(Number(inputLoanAmount.value));
    console.log(findUnObj.movements);
    updateUI(findUnObj);
  }
  inputLoanAmount.value = '';
});
let sortStaute = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  printMovements(findUnObj.movements, !sortStaute);
  sortStaute = !sortStaute;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
// // slice
// const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// console.log(arr.slice(2));

// console.log(arr.slice(0, 2));
// console.log(arr.slice(-2));
// // splice
// console.log(arr);
// console.log(arr.splice(2, 3));

// console.log(arr.splice(1, 2));

// console.log(arr);
// console.log(arr.splice(-2));
// console.log(arr);

// // Reverse
// // HBD Swap between 1,2 array elements
// const newArr = ['a', 'b', 'c', 'd', 'e'];
// let swp12 = newArr[2];
// newArr[2] = newArr[1];
// newArr[1] = swp12;
// console.log(newArr);
// // revers function
// console.log(newArr.reverse());

// // Concatentate
// const arr2 = [1, 2, 3];
// console.log(arr2.concat(newArr));
// // We can do it also by spread operation
// console.log([...arr2, ...newArr]);

// // Join (to print elements of a array and put between them that thing i put it in join's parameter)
// console.log(arr2.join('-'));

// // HBD Printing separate string characters in an array
// const jo = 'jonas';
// console.log(jo[0]);

// let joArr = [];
// console.log(jo.length);
// for (let i = 0; i < jo.length; i++) {
//   joArr.push(jo[i]);
//   console.log(joArr);
// }

// // printing first latter of array
// let arr = [1, 2, 3, 4, 5];
// console.log(arr[0]);
// console.log(arr.at(0));

// // printing last latter of array
// console.log(arr.slice(-1)[0]);
// console.log(arr[arr.length - 1]);
// console.log(arr.at(-1));

// //  for of loop
// for (let [i, movment] of movements.entries()) {
//   if (movment > 0) {
//     console.log(`${i + 1} deposited is  ${movment}`);
//   } else {
//     console.log(`${i + 1} withdrew is  ${Math.abs(movment)}`);
//   }
// }

// // forEach Method
// movements.forEach(function (movment, i) {
//   if (movment > 0) {
//     console.log(`${i + 1} deposited is  ${movment}`);
//   } else {
//     console.log(`${i + 1} withdrew is  ${Math.abs(movment)}`);
//   }
// });

// // HBD Forof loop
// let players = ['messi', 'cr7', 'bale'];
// for (let [place, player] of players.entries()) {
//   console.log(player, place);
// }

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // forEach with Maps
// currencies.forEach(function (value, index) {
//   console.log(`${index}:${value}`);
// });

// // forEach with sets
// const currenciesUnique = new Set(['EUR', 'USD', 'GBP']);

// currenciesUnique.forEach(function (value, index) {
//   console.log(index, value);
// });

// // Challange 1 :
// const checkDogs = function (dogsJulia, dogsKate) {
//   const correctedDogsJulia = dogsJulia.slice(1, -2);
//   console.log(correctedDogsJulia);
//   const bothDogs = [...correctedDogsJulia, ...dogsKate]; // can also solve it by concat method but i perefer this :)
//   console.log(bothDogs);
//   bothDogs.forEach(function (key, index) {
//     if (key >= 3) {
//       console.log(
//         `Dog number ${index + 1} is an adult, and is ${key} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// // Map Method
// const movementMultiplication = movements.map(
//   numberMultiple => numberMultiple * 2
// );
// username function with Map Method
// const user = 'Steven Thomas Williams'
//   .toLowerCase()
//   .split(' ')
//   .map(theName => theName[0])
//   .join('');
// console.log(user);
// // Find the maximum value of movements array by reduce method
// const maxMovements = movements.reduce((acc, key) => (acc > key ? acc : key));
// console.log(maxMovements);

// //  Map Mehod with challang 1
// const checkDogs = function (dogsJulia, dogsKate) {
//   const correctedDogsJulia = dogsJulia.slice(1, -2);
//   const bothDogs = [...correctedDogsJulia, ...dogsKate]; // can also solve it by concat method but i perefer this :)
//   const theDogStatus = bothDogs.map(function (key, index) {
//     return `Dog number ${
//       index + 1
//     } is ${key >= 3 ? `an adult, and is ${key} years old ` : 'still a puppy 🐶'}`;
//   });
//   console.log(theDogStatus);
// };
// checkDogs([1, 4, 5, 5], [4, 4, 4, 4, 1]);

// console.log(movementMultiplication);

// // HBD trying to make one word from the string in different color
// const redColor = 'color:red;';
// const spain = `%c Spain`;
// const theChampionsString = `the champions is${spain} `; // or i can put inside the templetral `%c Spain` direct
// console.log(theChampionsString, redColor);

// console.log('%c GeeksforGeeks', 'color:green;');

// // Filter Method to filter the widthdrawl and deposts

// const deposits = movements.filter(num => num > 0);
// const widthdrawl = movements.filter(num => num < 0);
// console.log(deposits, widthdrawl);

// // challange 2:

// const calcAverageHumanAge = function (ages) {
//   let humanAge;
//   let adults = [];
//   // solution by transformation methods

//   humanAge = ages.map(dogAge =>
//     dogAge <= 2 ? (humanAge = 2 * dogAge) : (humanAge = 16 + dogAge * 4)
//   );
//   console.log(humanAge);
//   adults = humanAge.filter(age => age > 18);
//   console.log(adults);
//   const avgAdults = adults.reduce((acc, key) => acc + key / adults.length, 0);
//   console.log(adults);
//   console.log('the average is ', avgAdults);
// };

//   ////////////////////////////////

//   // solution by traditional loops and conditions
//   // for (let dogAge of ages) {
//   //   if (dogAge <= 2) {
//   //     humanAge = 2 * dogAge;
//   //     if (humanAge > 18) {
//   //       adults.push(humanAge);
//   //       // console.log(adults);
//   //     }
//   //     console.log(humanAge);
//   //   } else {
//   //     humanAge = 16 + dogAge * 4;
//   //     if (humanAge > 18) {
//   //       adults.push(humanAge);
//   //       // console.log(adults);
//   //       console.log(humanAge);
//   //     }
//   //   }
//   // }
//   // const avgAdults = adults.reduce((acc, key) => acc + key / adults.length, 0);
//   // console.log(adults);
//   // console.log('the average is ', avgAdults);
// };

// calcAverageHumanAge([3, 4, 2, 5, 5]);
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// // challange 3:

// const calcAverageHumanAge2 = ages =>
//   ages
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(age => age > 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));

// // find Method
// // find specific account by find method
// const account = accounts.find(key => key.owner === 'Jonas Schmedtmann');
// console.log(account);
// for (let account of accounts) {
//   if (account.owner === 'Jonas Schmedtmann') {
//     console.log(account);
//   }
// }

// // Some Method
// console.log(movements.some(mov => mov > 4000));

// // every Method
// const arrFours = [4, 4, 4, 4];
// console.log(arrFours.every(el => el === 4));

// // flat Method
// let arr = [1, 2, 3, [4, 5]];
// console.log(arr.flat());
// arr = [1, 2, 3, [4, 5, 6], [[4, 4, 4]]];
// console.log(arr.flat(2));

// // calcutate the whole balane with flat
// let wholeBalance = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);
// console.log(wholeBalance);
// // another way with flatmap method
// let wholeBalance2 = accounts
//   .flatMap(mov => mov.movements)
//   .reduce((acc, mov) => acc + mov);
// console.log(wholeBalance2);

// // sorting Array by sort method:
// // with strings
// const names = ['amer', 'zakaria', 'yazan', 'bahaa'];
// console.log(names.sort());
// // with numbers
// const numbers = [1, 2, 5, 6, 600, 4999, 5888];
// // console.log(numbers.sort());
// // assending

// numbers.sort((a, b) => (a > b ? 1 : -1));
// console.log(numbers);
// // dessinding
// // sort = numbers.sort((a, b) => (a > b ? -1 : 1));
// // console.log(sort);

// // fill Method
// console.log(new Array(4, 5, 6, 7, 8));
// let arr = new Array(4, 5, 6, 7, 8);
// console.log(arr.fill(6, 2));

// // from Method
// new Array(1, 2, 3, 4, 5);
// console.log(Array.from({ length: 5 }, () => 5));
// let ig = 0;
// const x = Array.from({ length: 5 }, (_, i, arr) => {
//   i = i - 1 + 3;
//   return i;
// });
// console.log(x);

// arr.fill(0);
// console.log(arr.length);

// // Multiples of number 3
// for (let i = 1; i < arr.length; i++) {
//   arr[i] = arr[i - 1] + 3;
// }
// console.log(arr);
// arr.fill(0);
// console.log(
//   arr.map((el, i) => {
//     return (el = i * 3);
//   })
// );

// // names that starts with H
// const names = [
//   'Homam',
//   'rafaat',
//   'amer',
//   'mouner',
//   'hani',
//   'hussam',
//   'hajar',
//   'somar',
// ];

// console.log(names.filter(nameH => nameH[0] != 'h' && nameH[0] != 'H'));

// challange 4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
// first task
dogs.forEach(function (dog, index) {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
  console.log(dog);
});
// second task
const sarahsDog = dogs.find(theDogObj => theDogObj.owners.includes('Sarah'));
console.log(
  sarahsDog.curFood > sarahsDog.recommendedFood
    ? 'eating too much'
    : 'eating too little'
);
// third task
const ownersEatTooMuch = dogs
  .filter(dogFood => dogFood.curFood > dogFood.recommendedFood)
  .flatMap(owner => owner.owners);
console.log('too much eat owners', ownersEatTooMuch);
const ownersEatTooLittle = dogs
  .filter(dogFood => dogFood.curFood < dogFood.recommendedFood)
  .flatMap(owner => owner.owners);
console.log('too little eat owners', ownersEatTooLittle);
// forth task
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// fifth task
console.log(dogs.some(dogFood => dogFood.curFood === dogFood.recommendedFood));
// sixth task
console.log(
  dogs.some(
    dogFood =>
      dogFood.curFood > dogFood.recommendedFood * 0.9 &&
      dogFood.curFood < dogFood.recommendedFood * 1.1
  )
);
// seventh task
console.log(
  dogs.filter(
    dogFood =>
      dogFood.curFood > dogFood.recommendedFood * 0.9 &&
      dogFood.curFood < dogFood.recommendedFood * 1.1
  )
);
// Eighth task
const dogSort = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogSort);
