// Enable strict mode to eliminate some JavaScript silent errors 
// by changing them to throw errors. And help JavaScript engines 
// to perform optimizations to run our code faster.
'use strict';

console.log('It works!');

const container = document.querySelector('.container');
console.log(container);

const moveHandler = (e) => {
   // console.log('Clicked');
   const boxSelected = e.target.id;
   console.log('boxSelected: ' + boxSelected);
}

container.addEventListener('click', moveHandler);


