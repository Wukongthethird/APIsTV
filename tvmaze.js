"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const TV_MAZE_URL = "http://api.tvmaze.com/"
//const EPISODE use the single show search and ebedd episodes to get a list of the episodes on the URL 


/** getShowsByTerm
 * async function that takes in a search term and returns an array of objects containing relevant show data
 *  @param {String} term --- search term for the query string
 *  @returns {array | object} --- returns an array of objects containing relevant show data
 */


async function getShowsByTerm( term ) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let singleSearch = "singlesearch/shows?"
  let multipleSearch= "search/shows?"
  
  // send a request to retrieve term's and episode 
  let showsData  =  await axios.get(  TV_MAZE_URL + multipleSearch  , {params: {q:term , embed:"episodes" }})  
  
  // return an array of show objects with required data
  return showsData.data.map(showData =>{
    //let image = showData.show.image.medium === null ? "https://tinyurl.com/tv-missing" : showData.show.image.medium;

    return {
      id : showData.show.id, 
      name : showData.show.name,
      summary : showData.show.summary,
      image:'https://tinyurl.com/tv-missing'
    }
  });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  // let missingImgLink = "https://tinyurl.com/tv-missing";
  
  for (let show of shows) {
    // handle missing image
    // if(!show.image){
    //   show.image = missingImgLink;
    // }
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.image} 
              alt=${show.name} 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 * 
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
