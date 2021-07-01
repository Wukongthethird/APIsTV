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
 * [{id,name,summary,image}, ...]
 */


async function getShowsByTerm( term ) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  //to customize resources search
  // let singleSearch = "singlesearch/shows?"
  let multipleSearch= "search/shows?"
  
  // send a request to retrieve term's and episode 
  let showsData  =  await axios.get(  TV_MAZE_URL + multipleSearch  , {params: {q:term , embed:"episodes" }})  
  // return an array of show objects with required data
  return showsData.data.map(showData =>{
    let newImage = showData.show.image !== null  
      ?  showData.show.image.medium
      : "https://tinyurl.com/tv-missing" ;

    let newSummary = showData.show.summary !== null  
      ?  showData.show.summary
      : "" ;

    return {
      id : showData.show.id, 
      name : showData.show.name,
      summary : newSummary,
      image:  newImage
    }
  });
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  
  for (let show of shows) {
  
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src= "${show.image}"
              alt= "${show.name}"
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

async function getEpisodesOfShow(id) { 


  let episodeURL = TV_MAZE_URL+ `shows/${id}/episodes`
  let showsData  =  (await axios.get(  episodeURL )).data
  
  return showsData.map( episode => {

    return  {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    }

  })


}

/** populateEpisodes
 * Description: Given the episodes param, the function will populate the DOM in the episodesList
 *              section with the episode season, number, name and id,
 * 
 * @param {array} episodes ---- array of objects containing episode id, name, season and number
 * [{id, name, season, number}...] 
 */ 

function populateEpisodes(episodes) { 

  // find the episodeList element in DOM
  const $episodesList = $("#episodesList");

  // create a list JQuery list element and fill it with <li> name, (season, number))

  episodes.forEach( episode => {
    let $li = $('<li>')
        .html(`${episode.name}, (${episode.season}, ${episode.number})`)
        .css({"list-style-type":"none"});
    $episodesList.append($li);
    
  });

}

// controller + event handler

//$showID = $("#showsList").find("div").attr("data-show-id")
