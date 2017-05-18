var TASTEDIVE_BASE_URL = 'https://tastedive.com/api/similar?';

var state = {

  route: 'start',
  results: [],
  genres: [],
  genrePicks: [],
  directors: [],
  directorPicks: [],
  stars: [],
  starPicks: [],
  movieKeys: [],
  movieIdeas: []
 
};

//function getDataFromApi(searchTerm, pageId, callback) {
function getDataFromApi(searchTerm, callback) {  
  var settings = {
    url: TASTEDIVE_BASE_URL,
    data: {
      q: 'movie:' + searchTerm,
      type: 'movies',
      k: '269724-PhilHeis-FQRV1O9N',
      info: 1,
      limit: 100
    },
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

// State modification functions
function setRoute(state, route) {
  state.route = route;
};

function resetGame(state) {
  // state.score = 0;
  // state.currentQuestionIndex = 0;
  setRoute(state, 'start');
};

// Render functions
function renderApp(state, elements) {
  // default to hiding all routes, then show the current route
  Object.keys(elements).forEach(function(route) {
    elements[route].hide();
  });
  elements[state.route].show();

  if (state.route === 'start') {
      renderStartPage(state, elements[state.route]);
  }
  // else if (state.route === 'question') {
  //     renderQuestionPage(state, elements[state.route]);
  // }
  // else if (state.route === 'answer-feedback') {
  //   renderAnswerFeedbackPage(state, elements[state.route]);
  // }
  // else if (state.route === 'final-feedback') {
  //   renderFinalFeedbackPage(state, elements[state.route]);
  // }
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
function renderStartPage(state, element) {
};

function createStateArrays(state, data) {
  if (data.Similar.Results) {
      state.results = data.Similar.Results;
      createGenreArray(state);
      createRandom3GenrePicks(state);
      createDirectorArray(state);
      createRandom3DirectorPicks(state);
      createStarArray(state);
      createRandom3StarPicks(state);
  }
  // else {
  //     renderErrorPage()
  // }
}

function createGenreArray(state) {
   
   var descriptions = state.results.map(function(movie) { return movie.wTeaser; });
   var genres = descriptions.map(function(description) { return description.match(/(?:is a )(.+?film)/); });
   var genreShorts = genres.filter(function(genre) { if (genre) { return genre[1]; }});
   state.genres = genreShorts.map(function(genre) { return genre[1].trim(); });

}

function createRandom3GenrePicks(state) {

    var max = state.genres.length - 1;
    var min = 0
    var randomPick;

    while (state.genrePicks.length < 3) {
      
      randomPick = state.genres[randomIntFromInterval(min,max)];

      if (state.genrePicks.indexOf(randomPick) === -1) {
          state.genrePicks.push(randomPick);
      }
    // state.genrePicks.push(state.genres[randomIntFromInterval(min,max)]);
    // state.genrePicks.push(state.genres[randomIntFromInterval(min,max)]);
    }
}

function createDirectorArray(state) {
   
   var descriptions = state.results.map(function(movie) { return movie.wTeaser; });
   var directors = descriptions.map(function(description) {
    return description.match(/(?:directed by )(.+?\b([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\']{1}[A-Z]{1}[a-z]{1,30}){1,3})/); });
   var directorShorts = directors.filter(function(director) { if (director) { return director[1]; }});
   state.directors = directorShorts.map(function(director) { return director[1].trim(); });

}

function createRandom3DirectorPicks(state) {

    var max = state.directors.length - 1;
    var min = 0
    var randomPick;

    while (state.directorPicks.length < 3) {
      
      randomPick = state.directors[randomIntFromInterval(min,max)];

      if (state.directorPicks.indexOf(randomPick) === -1) {
          state.directorPicks.push(randomPick);
      }
    }
}

// function createRandom3DirectorPicks(state) {

//     var max = state.directors.length - 1;
//     var min = 0

//     state.directorPicks.push(state.directors[randomIntFromInterval(min,max)]);
//     state.directorPicks.push(state.directors[randomIntFromInterval(min,max)]);
//     state.directorPicks.push(state.directors[randomIntFromInterval(min,max)]);

// }

function createStarArray(state) {
   
   var descriptions = state.results.map(function(movie) { return movie.wTeaser; });
   var stars = descriptions.map(function(description) { 
    return description.match(/(?:starring | stars )(.+?\b([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\']{1}[A-Z]{1}[a-z]{1,30}){1,3})/); });
   //var starShorts = stars.filter(function(star) { if (star) { return star[1] }});
   var starShorts = stars.filter(function(star) { if (star && star[1][0].match(/[A-Z]/)) { return star[1]; }});
   state.stars = starShorts.map(function(star) { return star[1].trim(); });

   for (var i = 0; i < state.stars.length; i++) {
      var asProbArray = state.stars[i].split(' ');
      var asTarget;
      for (var x = 0; x < asProbArray.length; x++) {
        if (asProbArray[x] === "as") {
            asTarget = x;
            state.stars[i] = asProbArray.splice(0, asTarget).join('');
        }
      }
   }
}

function createRandom3StarPicks(state) {

    var max = state.stars.length - 1;
    var min = 0
    var randomPick;

    while (state.starPicks.length < 3) {
      
      randomPick = state.stars[randomIntFromInterval(min,max)];

      if (state.starPicks.indexOf(randomPick) === -1) {
          state.starPicks.push(randomPick);
      }
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}



function displayTasteDiveSearchData(data) {
  var resultElement = '';
  // if (data.Similar.Results) {
  //   data.Similar.Results.forEach(function(item, index) {
     
  //       resultElement += item.Name + ':' + index + '<br>';

  //   });
  // }
  // else {
  //   resultElement += '<p>No results</p>';
  // }
 createStateArrays(state, data);

  state.directorPicks.forEach(function(item, index) {
  //state.genres.forEach(function(item, index) {  
     
        resultElement += item + ':' + index + '<br>';

    });
  
  $('.js-search-results').html(resultElement);
}




function watchSubmit(state) {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('.js-query').val();
    
    getDataFromApi(query, displayTasteDiveSearchData);
  });
}

// Event handlers
var PAGE_ELEMENTS = {
  'start': $('.start-page')
  //,
  // 'question': $('.question-page'),
  // 'answer-feedback': $('.answer-feedback-page'),
  // 'final-feedback': $('.final-feedback-page')
};



$(function(){
  
  renderApp(state, PAGE_ELEMENTS);
  watchSubmit(state);
  
});
