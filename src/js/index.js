// Global app controller
import Search from './models/SearchModel';
import Recipe from './models/RecipeModel';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/SearchView' ;
import * as recipeView from './views/RecipeView' ;


/* Global State of the app

    1) Search Object
    2) Recipes Object
    3) Shopping List Object
    4) Liked Recipes
*/ 
const state = {};

// Search Controller
const controlSearch = async () => {
    // 1) get query for the search
    const query = searchView.getInput();

    if(query){
        //2) New search object and add it to the state
        state.Search = new Search(query);

        try{

             //3) Prepare the UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        //4) Search for Recipies
        await state.Search.getResults();

        //5) Render results to UI
        clearLoader();
        searchView.renderResults(state.Search.result);

        } catch(error){
            alert('Something went wrong :(')
        }
    }
}
elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn){
        const goToPage = parseInt(btn.dataset.goto , 10);
        searchView.clearResults();
        searchView.renderResults(state.Search.result, goToPage);

    }
    console.log(e.target);
});

//Recipe Controller
const controlRecipe = async () => {

    //Get hash (id) from the URL
    const id = window.location.hash.replace('#', '');

    if(id){

        
        //Prepare the UI  
        renderLoader(elements.recipe);

          //Highlight Selected recipe
          if(state.Search) searchView.highlightSelected(id);

        //New recipe object, add it to the state
        state.recipe = new Recipe(id);

        try{

                //Get recipe data and parse it
                await state.recipe.getRecipe();
                state.recipe.parseIngredients();
                //Calculate servings and time
                state.recipe.calcTime();
                state.recipe.calcServings();
                //Render it to the UI
                recipeView.clearRecipe();
                clearLoader();
                recipeView.renderRecipe(state.recipe);

        } catch(error){
            alert(error)
        }
       
    }
    
}


['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));


elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease', '.btn-decrease *')){

        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    } else  if(e.target.matches('.btn-increase', '.btn-increase *')){

        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    
})