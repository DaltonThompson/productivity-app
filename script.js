let work = document.querySelector('#work');
let stretch = document.querySelector('#stretch');
let now = document.getElementsByTagName('h2')[0];
let goal = document.getElementsByTagName('h3')[0];
let title = document.getElementsByTagName('title')[0];
let horse = document.getElementById("horseSound");


work.addEventListener("click", event => selectState(true));
stretch.addEventListener("click", event => selectState(false));

let timeElapsed = 0;
let goalpost = new Date();
let currentTime = new Date();
let timerLastUpdated = new Date();
now.innerHTML = calculateTime(currentTime);

let workState = false;
let tally = {'work': 0, 'stretch': 0, 'earned':0};

let interval = setInterval(() => {
    currentTime = new Date();
    let elapsed = currentTime - timerLastUpdated;
    if (workState == true) {
        tally.work += Math.round(elapsed/1000);
        tally.earned += elapsed/6/1000;
    } else {
        tally.stretch += Math.round(elapsed/1000);
        tally.earned -= elapsed/1000;
    }

    now.innerHTML = calculateTime(currentTime);
        
    document.querySelector('#tally-work').innerHTML = 
        Math.floor(tally.work/60/60) + ':' + 
        prependZero(Math.floor(tally.work/60)) + ':' + 
        prependZero(Math.floor(tally.work%60));

    document.querySelector('#tally-break').innerHTML =
        Math.floor(tally.stretch/60/60) + ':' +
        prependZero(Math.floor(tally.stretch/60)) + ':' +
        prependZero(Math.floor(tally.stretch%60));

    if (Math.sign(tally.earned) >= 0) {
        document.querySelector('#saved-label').innerHTML = "Saved break time:";
    } else {
        document.querySelector('#saved-label').innerHTML = "Overused break time:";
    };
    document.querySelector('#saved-break').innerHTML = 
        prependZero(Math.floor(Math.abs(tally.earned)/60/60)) + ':' + 
        prependZero(Math.floor(Math.abs(tally.earned)/60)) + ':' + 
        prependZero(Math.floor(tally.earned%60));
    timerLastUpdated = currentTime;

    if (tally.earned < 0 && workState == false) horse.play();
},1000);

function selectState(boolean) {
    if (boolean == true) {
        workState = true;
        goalpost.setMinutes(timerLastUpdated.getMinutes() + 23);
        goal.innerHTML = 'Alright, back to work! Try to keep going until ' + calculateTime(goalpost) + '. Then, take a minute to plan your next task before you take a break.';
    } else {
        workState = false;
        goalpost.setMinutes(timerLastUpdated.getMinutes() + 4);
        goal.innerHTML = 'Let\'s make this short. Walk around until ' + calculateTime(goalpost) + '!';
    };
}

function prependZero(number) {
    if (Math.abs(number) > 9) {
        return Math.abs(number);
    } else {
        return '0' + Math.abs(number);
    }
}
function calculateTime(input) {
    return input.getHours() + ':' + prependZero(input.getMinutes()) + ':' + prependZero(input.getSeconds());
}

let addTime = (timeSource,addedValue) => {
    if ((timeSource.getMinutes() + addedValue) > 59) {
        return timeSource.getMinutes() + addedValue - 60;
    } else {
        return timeSource.getMinutes() + addedValue;
    }
}