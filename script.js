let work = document.querySelector('#work');
let stretch = document.querySelector('#stretch');
let now = document.getElementsByTagName('h2')[0];
let goal = document.getElementsByTagName('h3')[0];
let title = document.getElementsByTagName('title')[0];
let horse = document.getElementById("horseSound");
horse.play();
let horseInterval;

// get desired interval from user
function getWorkTime() {
    let userTime = Number(prompt("How many minutes would you like to work?"));
    while (isNaN(userTime) || userTime<= 0) {
        alert("Sorry, you did not enter a valid number.");
        userTime = Number(prompt("How many minutes would you like to work?"));
    }
    return userTime
}

let timeElapsed = 0;
let goalpost = new Date();
let currentTime = new Date();
let timerLastUpdated = new Date();
now.innerText = calculateTime(currentTime);

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

    now.innerText = calculateTime(currentTime);
        
    document.querySelector('#tally-work').innerText = 
        Math.floor(tally.work/60/60) + ':' + 
        prependZero(Math.floor(tally.work/60)) + ':' + 
        prependZero(Math.floor(tally.work%60));

    document.querySelector('#tally-break').innerText =
        Math.floor(tally.stretch/60/60) + ':' +
        prependZero(Math.floor(tally.stretch/60)) + ':' +
        prependZero(Math.floor(tally.stretch%60));

    if (Math.sign(tally.earned) >= 0) {
        document.querySelector('#saved-label').innerText = "Saved break time:";
    } else {
        document.querySelector('#saved-label').innerText = "Overused break time:";
    };
    document.querySelector('#saved-break').innerText = 
        prependZero(Math.floor(Math.abs(tally.earned)/60/60)) + ':' + 
        prependZero(Math.floor(Math.abs(tally.earned)/60)) + ':' + 
        prependZero(Math.floor(tally.earned%60));
    timerLastUpdated = currentTime;    
},1000);

function selectState(boolean) {
    if (boolean == true) {
        workState = true;
        clearInterval(horseInterval);
        let workTime = getWorkTime();
        setTimeout(function(){
            horse.play();
            goal.innerText = 'Take a minute to plan your next task, and then take a break.';
        }, (workTime*60)*1000 - 3000);
        // play sound once reach to the work time goal
        goalpost.setMinutes(currentTime.getMinutes() + workTime);
        goal.innerText = 'Alright, back to work! Try to keep going until ' + calculateTime(goalpost);
    } else {
        workState = false;
        goalpost.setMinutes(timerLastUpdated.getMinutes() + 4);
        // play sound every two minutes
        horseInterval = setInterval(function(){
            horse.play();
            goal.innerText = 'Back to work!';
        }, 120000);
        goal.innerText = 'Let\'s make this short. Walk around until ' + calculateTime(goalpost) + '!';
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

//Code meant to fix an error with adding minutes that rolled over the hour mark.
/*
let addTime = (timeSource,addedValue) => {
    if ((timeSource.getMinutes() + addedValue) > 59) {
        return timeSource.getMinutes() + addedValue - 60;
    } else {
        return timeSource.getMinutes() + addedValue;
    }
}*/

selectState(false);
work.addEventListener("click", event => selectState(true));
stretch.addEventListener("click", event => selectState(false));