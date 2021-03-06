var TASTEDIVE_BASE_URL = 'https://tastedive.com/api/similar?';

var state = {

  route: 'start',
  results: [],
  resultsMinusGPickIndices: [],
  resultsMinusGDPickIndices: [],
  genres: [],
  genreShorts: [],
  genrePicks: [],
  directors: [],
  directorShorts: [],
  directorPicks: [],
  stars: [],
  starShorts: [],
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
  state.results = [];
  //NEW
  state.resultsMinusGPickIndices = [],
  state.resultsMinusGDPickIndices = [],
  //NEW
  state.genres = [];
  state.genrePicks = [];
  state.directors = [];
  state.directorPicks = [];
  state.stars = [];
  state.starPicks = [];
  state.movieKeys = [];
  state.movieIdeas = [];
  setRoute(state, 'start');
};

function createStateArrays(state, data) {
  if (data.Similar.Results[0]) {
      state.results = data.Similar.Results;

      //NEW
      state.resultsMinusGPickIndices = data.Similar.Results.map(function(result, i) { return { index: i } });
      state.resultsMinusGDPickIndices = data.Similar.Results.map(function(result, i) { return { index: i } });
      //NEW
      //alert(state.resultsMinusGPickIndices[0].index);
      //state.resultsMinusGDPicks = state.results;
      
      createGenreArray(state);
      createRandom3GenrePicks(state);
      createDirectorArray(state);
      createRandom3DirectorPicks(state);
      createStarArray(state);
      createRandom3StarPicks(state);

      //NEW
      setRoute(state, 'genre');
      renderApp(state, PAGE_ELEMENTS);
      //NEW
  }
  else {
      //renderErrorPage()
      //alert("Movie not found.  Please try again.");
      setRoute(state, 'error');
      
      renderApp(state, PAGE_ELEMENTS);
      //PAGE_ELEMENTS[state.route].show();
  }
}

function createGenreArray(state) {
   
   var descriptions = state.results.map(function(movie) { return movie.wTeaser; });
   //var genres = descriptions.map(function(description) { return description.match(/(?:is a )(.+?film)/); });
   var genres = descriptions.map(function(description, i) { return { name: description.match(/(?:is a )(.+?film)/), index: i } });
   //state.genreShorts = genres.filter(function(genre) { if (genre) { return genre[1]; }});
   state.genreShorts = genres.filter(function(genre) { if (genre.name) { return genre; }});
   //state.genres = state.genreShorts.map(function(genre) { return genre[1].trim(); });
   state.genres = state.genreShorts.map(function(genre) { return { name: genre.name[1].trim(), index: genre.index} });
}

function createRandom3GenrePicks(state) {

    var max = state.genres.length - 1;
    var min = 0
    var randomPick;
    var words = 0;

    while (state.genrePicks.length < 3) {
      
      randomPick = state.genres[randomIntFromInterval(min,max)];
      words = randomPick.name.split(' ');
      //alert(randomPick.index)

      if (words.length < 11 && !randomPick.name.match(/^[a-z]/) && !randomPick.name.match(/[a-z][a-z]\./) && !randomPick.name.match(/,/) && state.genrePicks.indexOf(randomPick) === -1) {
          state.genrePicks.push(randomPick);
          //NEW
          delete state.resultsMinusGPickIndices[randomPick.index];
          delete state.resultsMinusGDPickIndices[randomPick.index];
          //NEW

      }
    // state.genrePicks.push(state.genres[randomIntFromInterval(min,max)]);
    // state.genrePicks.push(state.genres[randomIntFromInterval(min,max)]);
    }
}

function createDirectorArray(state) {
   
   var descriptions = state.results.map(function(movie) { return movie.wTeaser; });
   // var directors = descriptions.map(function(description) {
   //  return description.match(/(?:directed by )(.+?\b([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\']{1}[A-Z]{1}[a-z]{1,30}){1,3})/); });
   var directors = descriptions.map(function(description, i) { 
       return { name: description.match(/(?:directed by )(.+?\b([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\']{1}[A-Z]{1}[a-z]{1,30}){1,3})/), index: i } });
   //state.directorShorts = directors.filter(function(director) { if (director) { return director[1]; }});
   state.directorShorts = directors.filter(function(director) { if (director.name) { return director; }});
   //state.directors = state.directorShorts.map(function(director) { return director[1].trim(); });
   //state.directors = state.directorShorts.map(function(director, i) { return { name: director[1].trim(), index: i } });
   state.directors = state.directorShorts.map(function(director) { return { name: director.name[1].trim(), index: director.index} });

}

function createRandom3DirectorPicks(state) {

    var max = state.directors.length - 1;
    var min = 0
    var randomPick;
    var words = 0;

    while (state.directorPicks.length < 3) {
      
      randomPick = state.directors[randomIntFromInterval(min,max)];
      words = randomPick.name.split(' ');
      //alert(state.resultsMinusGPicks[randomPick.index]);

      //Use JSONstringify to compare existing directorPicks.names with randomPicks.name
      // !state.directorPicks.filter(function(pick) { return pick.name === randomPick.name});
      //NEW
      if (words.length < 5 && !randomPick.name.match(/^[a-z]/) && !randomPick.name.match(/[a-z][a-z]\./) && !randomPick.name.match(/,/) && state.directorPicks.indexOf(randomPick) === -1 && state.resultsMinusGPickIndices[randomPick.index]) {
          state.directorPicks.push(randomPick);
          delete state.resultsMinusGDPickIndices[randomPick.index];

      //NEW
      // if (state.directorPicks.indexOf(randomPick) === -1) {
      //     state.directorPicks.push(randomPick);
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
   // var stars = descriptions.map(function(description) { 
   //  return description.match(/(?:starring | stars )(.+?\b([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\']{1}[A-Z]{1}[a-z]{1,30}){1,3})/); });
   var stars = descriptions.map(function(description, i) { 
    return { name: description.match(/(?:starring | stars )(.+?\b([A-Z]{1}[a-z]{1,30}[- ]{0,1}|[A-Z]{1}[- \']{1}[A-Z]{0,1}[a-z]{1,30}[- ]{0,1}|[a-z]{1,2}[ -\']{1}[A-Z]{1}[a-z]{1,30}){1,3})/), index: i } });
  // MAY HAVE TO TRIM STAR NAME EARLIER HERE
   //var starShorts = stars.filter(function(star) { if (star) { return star[1] }});
   //state.starShorts = stars.filter(function(star) { if (star && star[1][0].match(/[A-Z]/)) { return star[1]; }});
   state.starShorts = stars.filter(function(star) { if (star.name && star.name[1][0].match(/[A-Z]/)) { return star; }});
   //state.stars = state.starShorts.map(function(star) { return star[1].trim(); } );
   state.stars = state.starShorts.map(function(star) { return {name: star.name[1].trim(), index: star.index } } );
   //state.starIndices = state.starShorts.map(function(star, index) { return index: });

   for (var i = 0; i < state.stars.length; i++) {
      var asProbArray = state.stars[i].name.split(' ');
      var asTarget;
      for (var x = 0; x < asProbArray.length; x++) {
        if (asProbArray[x] === "as") {
            asTarget = x;
            state.stars[i].name = asProbArray.splice(0, asTarget).join(' ');
        }
      }
   }

   // for (var i = 0; i < state.stars.length; i++) {
   //    var asProbArray = state.stars[i].split(' ');
   //    var asTarget;
   //    for (var x = 0; x < asProbArray.length; x++) {
   //      if (asProbArray[x] === "as") {
   //          asTarget = x;
   //          state.stars[i] = asProbArray.splice(0, asTarget).join(' ');
   //      }
   //    }
   // }
}

function createRandom3StarPicks(state) {

    var max = state.stars.length - 1;
    var min = 0
    var randomPick;
    var words = 0;

    while (state.starPicks.length < 3) {
      
      randomPick = state.stars[randomIntFromInterval(min,max)];
      words = randomPick.name.split(' ');

      //NEW
      if (words.length < 4 && !randomPick.name.match(/^[a-z]/) && !randomPick.name.match(/[a-z][a-z]\./) && !randomPick.name.match(/,/) && state.starPicks.indexOf(randomPick) === -1 && state.resultsMinusGDPickIndices[randomPick.index]) {
          state.starPicks.push(randomPick);
      //NEW
      // if (state.starPicks.indexOf(randomPick) === -1) {
      //     state.starPicks.push(randomPick);
      }
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}


// function answerQuestion(state, answer) {
//   var currentQuestion = state.questions[state.currentQuestionIndex];
//   state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
//   if (state.lastAnswerCorrect) {
//     state.score++;
//   }
//   selectFeedback(state);
//   setRoute(state, 'answer-feedback');
// };

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
  else if (state.route === 'genre') {
      renderGenrePage(state, elements[state.route]);
  }
  else if (state.route === 'director') {
      renderDirectorPage(state, elements[state.route]);
  }
  else if (state.route === 'star') {
      renderStarPage(state, elements[state.route]);
  }
  else if (state.route === 'final') {
      renderFinalPage(state, elements[state.route]);
  }
  //NEW
  else if (state.route === 'error') {
      renderErrorPage(state, elements[state.route]);
   

  }
  //NEW
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
function renderStartPage(state, element) {
};

function renderErrorPage(state, element) {

};

// function renderErrorPage(state, element) {
//   element.find('.js-query').text('blah');
// }

function renderGenrePage(state, element) {
  //renderQuestionCount(state, element.find('.question-count'));
  //renderQuestionText(state, element.find('.question-text'));
  renderGenreText(state, element.find('.genre-text'));
  renderGenreChoices(state, element.find('.choices'));
};

// function renderQuestionText(state, element) {
//   var currentQuestion = state.questions[state.currentQuestionIndex];
//   element.text(currentQuestion.text);
// };

function renderGenreChoices(state, element) {
  //var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = state.genrePicks.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer1" value="' + index + '" required>' +
        '<label>' + choice.name + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderGenreText(state, element) {
  //var currentQuestion = state.questions[state.currentQuestionIndex];
  var text = 'Choose one of the genres below!';
  element.text(text);
};

function renderDirectorPage(state, element) {
  //renderQuestionCount(state, element.find('.question-count'));
  //renderQuestionText(state, element.find('.question-text'));
  renderDirectorText(state, element.find('.director-text'));
  renderDirectorChoices(state, element.find('.choices'));
};

// function renderQuestionText(state, element) {
//   var currentQuestion = state.questions[state.currentQuestionIndex];
//   element.text(currentQuestion.text);
// };

function renderDirectorChoices(state, element) {
  //var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = state.directorPicks.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer2" value="' + index + '" required>' +
        '<label>' + choice.name + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderDirectorText(state, element) {
  //var currentQuestion = state.questions[state.currentQuestionIndex];
  var text = 'Choose one of the directors below!';
  element.text(text);
};

function renderStarPage(state, element) {
  //renderQuestionCount(state, element.find('.question-count'));
  //renderQuestionText(state, element.find('.question-text'));
  renderStarText(state, element.find('.star-text'));
  renderStarChoices(state, element.find('.choices'));
};

// function renderQuestionText(state, element) {
//   var currentQuestion = state.questions[state.currentQuestionIndex];
//   element.text(currentQuestion.text);
// };

function renderStarChoices(state, element) {
  //var currentQuestion = state.questions[state.currentQuestionIndex];
  var choices = state.starPicks.map(function(choice, index) {
    return (
      '<li>' +
        '<input type="radio" name="user-answer3" value="' + index + '" required>' +
        '<label>' + choice.name + '</label>' +
      '</li>'
    );
  });
  element.html(choices);
};

function renderStarText(state, element) {
  //var currentQuestion = state.questions[state.currentQuestionIndex];
  var text = 'Choose one of the stars below!';
  element.text(text);
};

//Modify this to create links to three movies with choices as label
function renderFinalPage(state, element) {

  //yUrL

  // var resultElement1 = '<div class="js-movie-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + '"><img src="' +
  //       + '"></a></div>';

  // var resultElement1 = '<div class="js-movie-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + 
  // '">' + findMovieName(state, state.movieKeys[0], state.genres) + '</a></div>';

  // var resultElement1 = '<div class="js-movie-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + 
  // '"><img class="js-movie1" src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[0], state.genres) + '/mqdefault.jpg"></a></div>';

// var resultElement2 = '<div class="js-movie-trailer2"><a href="' + findMovieUrl(state, state.movieKeys[1], state.directors) + 
//   '"><img class="js-movie2" src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[1], state.directors) + '/mqdefault.jpg"></a></div>';

//   var resultElement3 = '<div class="js-movie-trailer3"><a href="' + findMovieUrl(state, state.movieKeys[2], state.stars) + 
//   '"><img class="js-movie3" src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[2], state.stars) + '/mqdefault.jpg"></a></div>';
  var text = "You chose " + state.movieKeys[0] + ", " +
    state.movieKeys[1] + ", and " + state.movieKeys[2] + 
    ". Your movie matches are " + findMovieName(state, state.movieKeys[0], state.genres) + 
    ", " + findMovieName(state, state.movieKeys[1], state.directors) + ", and " +
    findMovieName(state, state.movieKeys[2], state.stars) + ".";

  var resultElement1 = '<a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + 
  '"><img class="movie-image" src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[0], state.genres) + '/mqdefault.jpg"></a>';
      
  var resultElement2 = '<a href="' + findMovieUrl(state, state.movieKeys[1], state.directors) + 
  '"><img class="movie-image" src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[1], state.directors) + '/mqdefault.jpg"></a>';

  var resultElement3 = '<a href="' + findMovieUrl(state, state.movieKeys[2], state.stars) + 
  '"><img class="movie-image" src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[2], state.stars) + '/mqdefault.jpg"></a>';


  var resultLink1 = '<a href="' + + findMovieUrl(state, state.movieKeys[0], state.genres) + '">' + 
  findMovieName(state, state.movieKeys[0], state.genres) + ' - A ' + state.movieKeys[0] + '</a>';

  var resultLink2 = '<a href="' + + findMovieUrl(state, state.movieKeys[1], state.directors) + '">' + 
  findMovieName(state, state.movieKeys[1], state.directors) + ' - Directed by ' + state.movieKeys[1] + '</a>';

  var resultLink3 = '<a href="' + + findMovieUrl(state, state.movieKeys[2], state.stars) + '">' + 
  findMovieName(state, state.movieKeys[2], state.stars)  + ' - Starring ' + state.movieKeys[2] + '</a>';


  element.find('.results-text').text(text);
  element.find('.results-trailer1').html(resultElement1);
  element.find('.results-trailer2').html(resultElement2);
  element.find('.results-trailer3').html(resultElement3);

  //Trailer links
  element.find('.trailer1-link').html(resultLink1);
  element.find('.trailer2-link').html(resultLink2);
  element.find('.trailer3-link').html(resultLink3);

  // var results = 
  // '<h1>Results</h1>' + 
  //       '<p class="results-text"></p>' +
  // '<div class="col-4">' + 
  //   '<div class="results-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + 
  //     '"><img src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[0], state.genres) + '/mqdefault.jpg"></a>' +
  //   '</div>' + 
  //   '<div class="trailer1-link"><a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + '">' + 
  //   findMovieName(state, state.movieKeys[0], state.genres) + '</a>' +
  //   '</div>' +
  // '</div>' + 
  // '<div class="col-4">' + 
  //   '<div class="results-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[1], state.directors) + 
  //     '"><img src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[1], state.directors) + '/mqdefault.jpg"></a>' +
  //   '</div>' + 
  //   '<div class="trailer1-link"><a href="' + findMovieUrl(state, state.movieKeys[1], state.directors) + '">' + 
  //   findMovieName(state, state.movieKeys[1], state.directors) + '</a>' +
  // '</div>' +
  // '<div class="col-4">' + 
  //   '<div class="results-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[2], state.stars) + 
  //     '"><img src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[2], state.stars) + '/mqdefault.jpg"></a>' +
  //   '</div>' + 
  //   '<div class="trailer1-link"><a href="' + findMovieUrl(state, state.movieKeys[2], state.stars) + '">' + 
  //   findMovieName(state, state.movieKeys[2], state.stars) + '</a>' +
  // '</div>';

  // var resultElement1 = '<p class="js-title1">' + findMovieName(state, state.movieKeys[0], state.genres) + '</p><div class="js-movie-trailer1"><a href="' + findMovieUrl(state, state.movieKeys[0], state.genres) + 
  // '"><img src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[0], state.genres) + '/mqdefault.jpg"></a></div>';
      
  // var resultElement2 = '<p class="js-title2">' + findMovieName(state, state.movieKeys[1], state.directors) + '</p><div class="js-movie-trailer2"><a href="' + findMovieUrl(state, state.movieKeys[1], state.directors) + 
  // '"><img src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[1], state.directors) + '/mqdefault.jpg"></a></div>';

  // var resultElement3 = '<p class="js-title3">' + findMovieName(state, state.movieKeys[2], state.stars) + '</p><div class="js-movie-trailer3"><a href="' + findMovieUrl(state, state.movieKeys[2], state.stars) + 
  // '"><img src="https://i.ytimg.com/vi/' + findYouTubeID(state, state.movieKeys[2], state.stars) + '/mqdefault.jpg"></a></div>';

  //https://i.ytimg.com/vi/O90-DO9P6q0/mqdefault.jpg

  // var resultElement2 = '<div class="js-movie-trailer2"><a href="' + findMovieUrl(state, state.movieKeys[1], state.directors) + 
  // '">' + findMovieName(state, state.movieKeys[1], state.directors) + '</a></div>';

  //  var resultElement3 = '<div class="js-movie-trailer3"><a href="' + findMovieUrl(state, state.movieKeys[2], state.stars) + 
  // '">' + findMovieName(state, state.movieKeys[2], state.stars) + '</a></div>';

  // var resultElement2 = '<div class="js-movie-trailer2"><a href="' + findMovieUrl(state, state.movieKeys[1], state.genres) + '"><img src="' +
  //       + '"></a></div>';

  // var resultElement3 = '<div class="js-movie-trailer3"><a href="' + findMovieUrl(state, state.movieKeys[2], state.genres) + '"><img src="' +
  //        + '"></a></div>';
       // +
       // '<div class="js-movie-trailer"><a href="' + findMovieUrl(state, state.movieKeys[1], state.genres) + '"><img src="' +
       // findMovieName(state, state.movieKeys[1], state.genres)  + '"></a></div>' +
       // '<div class="js-movie-trailer"><a href="' + findMovieUrl(state, state.movieKeys[2], state.genres) + '"><img src="' +
       // findMovieName(state, state.movieKeys[2], state.genres)  + '"></a></div>';

  // element.find('.row').html(results);
}

function findMovieName(state, movieKey, type) {
   var typeShort = type.filter(function(short) { return short.name === movieKey; });

//alert(typeShort[0].name);
   var movieIndex = typeShort[0].index;
  // alert(movieIndex);

   return state.results[movieIndex].Name;

}

function findMovieUrl(state, movieKey, type) {
  var typeShort = type.filter(function(short) { return short.name === movieKey; });

//alert(typeShort[0].name);
   var movieIndex = typeShort[0].index;
  // alert(movieIndex);

   return state.results[movieIndex].yUrl;
}

function findYouTubeID(state, movieKey, type) {
  var typeShort = type.filter(function(short) { return short.name === movieKey; });

//alert(typeShort[0].name);
   var movieIndex = typeShort[0].index;
  // alert(movieIndex);

   return state.results[movieIndex].yID;
}
// Event handlers


$(".restart-game").click(function(event){
  event.preventDefault();
  resetGame(state);
  renderApp(state, PAGE_ELEMENTS);
});


$("form[name='genre-choices']").submit(function(event) {
  event.preventDefault();
  var answer1 = $("input[name='user-answer1']:checked").val();
  state.movieKeys.push(state.genrePicks[answer1].name);
  //alert(state.movieKeys);
  //answer = parseInt(answer, 10);
  //answerQuestion(state, answer);
  setRoute(state, 'director');
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='director-choices']").submit(function(event) {
  event.preventDefault();
  var answer2 = $("input[name='user-answer2']:checked").val();
  state.movieKeys.push(state.directorPicks[answer2].name);
  //alert(state.movieKeys);
  //answer = parseInt(answer, 10);
  //answerQuestion(state, answer);
  setRoute(state, 'star');
  renderApp(state, PAGE_ELEMENTS);
});


$("form[name='star-choices']").submit(function(event) {
  event.preventDefault();
  var answer3 = $("input[name='user-answer3']:checked").val();
  state.movieKeys.push(state.starPicks[answer3].name);
  //answer = parseInt(answer, 10);
  //answerQuestion(state, answer);
  setRoute(state, 'final');
  renderApp(state, PAGE_ELEMENTS);
});

$("form[name='js-search-again']").submit(function(event) {
  event.preventDefault();
  var query = $(this).find('.js-query').val();
  
    //getDataFromApi(query, displayTasteDiveSearchData);
  getDataFromApi(query, startProcess);
});




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
    //getDataFromApi(query, displayTasteDiveSearchData);
    getDataFromApi(query, startProcess);
  });
}

// function watchSubmit(state) {
//   $('.js-search-form').submit(function(e) {
//     e.preventDefault();
//     var query = $(this).find('.js-query').val();
    
//     //getDataFromApi(query, displayTasteDiveSearchData);
//     getDataFromApi(query, startProcess);
//   });
//   $('.js-search-again').submit(function(e) {
//     e.preventDefault();
//     var query = $(this).find('.js-query').val();
    
//     //getDataFromApi(query, displayTasteDiveSearchData);
//     getDataFromApi(query, startProcess);
//   });
// }

function startProcess(data) {
  createStateArrays(state, data);
  // setRoute(state, 'genre');
  // renderApp(state, PAGE_ELEMENTS);
}



var PAGE_ELEMENTS = {
  'start': $('.start-page'),
  'genre': $('.genre-page'),
  'director': $('.director-page'),
  'star': $('.star-page'),
  'final': $('.final-page'),
  //NEW
  'error': $('.error-page')
  //neW
  // 'question': $('.question-page'),
  // 'answer-feedback': $('.answer-feedback-page'),
  // 'final-feedback': $('.final-feedback-page')
};



$(function(){
  
  renderApp(state, PAGE_ELEMENTS);
  watchSubmit(state);
  
});
