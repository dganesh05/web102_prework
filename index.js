/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");


// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i=0; i < games.length; i++) {
        
        let game = games[i];

        // create a new div element, which will become the game card
        const div = document.createElement('div');

        // add the class game-card to the list
        div.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        div.innerHTML = `
        <img src="${game.img}" alt="${game.name} cover image" class="game-img" />
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        `;

        // append the game to the games-container
        gamesContainer.appendChild(div);

    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
}, 0)

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<h3>${totalContributions.toLocaleString('en-US')}</h3>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalPledged = GAMES_JSON.reduce ( (acc, game) => {
    return acc + game.pledged;
}, 0)

// set inner HTML using template literal
raisedCard.innerHTML=`<h3>$${totalPledged.toLocaleString('en-US')}</h3>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = GAMES_JSON.reduce ( (acc, games) => {
    return acc + 1;
}, 0)
gamesCard.innerHTML = `<h3>${totalGames.toLocaleString('en-US')}</h3>`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

    function adjustButtonSelect(button) {
        let buttons = document.getElementById('button-container').children;
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("button-selected");
        }
        button.classList.add("button-selected")
    }

// show only games that do not yet have enough funding
function filterUnfundedOnly(button) {
    deleteChildElements(gamesContainer);
    adjustButtonSelect(button)

    // use filter() to get a list of games that have not yet met their goal
    let listOfUnfundedGames = GAMES_JSON.filter( (game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfUnfundedGames);
}

// show only games that are fully funded
function filterFundedOnly(button) {
    deleteChildElements(gamesContainer);
    adjustButtonSelect(button)

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfFundedGames = GAMES_JSON.filter ((game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfFundedGames);
}

// show all games
function showAllGames(button) {
    deleteChildElements(gamesContainer);
    adjustButtonSelect(button)

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", () => filterUnfundedOnly(unfundedBtn));
fundedBtn.addEventListener("click", () => filterFundedOnly(fundedBtn));
allBtn.addEventListener("click", () => showAllGames(allBtn));

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const numUnfundedGames = GAMES_JSON.reduce ((acc, game) => {
    return (game.pledged < game.goal) ? acc + 1 : acc;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `
    A total of $${totalPledged.toLocaleString('en-US')} has been raised for ${totalGames.toLocaleString('en-US')} game${totalGames !== 1 ? "s" : ""}. 
    Currently, ${numUnfundedGames.toLocaleString('en-US')} game${totalGames !== 1 ? "s" : ""} remain${totalGames === 1 ? "s" : ""} unfunded. 
    We need your help to fund these amazing games!
`;

// create a new DOM element containing the template string and append it to the description container
const p = document.createElement('p');
p.innerHTML = displayStr;
descriptionContainer.append(p);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...otherGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const first = document.createElement('p');
first.innerHTML = `<h3>${firstGame.name}</h3>`;
firstGameContainer.append(first);

// do the same for the runner up item
const second = document.createElement('p');
second.innerHTML = `<h3>${secondGame.name}</h3>`;
secondGameContainer.append(second);