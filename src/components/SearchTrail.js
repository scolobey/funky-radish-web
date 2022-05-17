import React from 'react';
// import searchTrail from '../utils/SearchTrail.json'
import { useSelector } from 'react-redux'
import SearchTrailRow from './SearchTrailRow'


// Trail Format

export default function SearchTrail(props) {
  let path = window.location.pathname
  var query = ''

  if (path.includes("/recipes/")) {
    query = path.replace("/recipes/", "").replaceAll("-", " ")
  }

  var [ trail, setTrail ] = React.useState([])

  var recipe = useSelector((state) => state.recipe)
  var externalRecipes = useSelector((state) => state.externalRecipes)
  var searchConfig = useSelector((state) => state.searchConfig)

  React.useEffect(() => {

    if(query.length == 0) {
      query = "home"
    }

    // if (recipe && recipe.tags && recipe.tags.length > 0) {
    //
    //   console.log(recipe.tags[0]);
    //   // Make sure you get the deepest category
    //   recipe.tags.forEach((tag, i) => {
    //     if (searchTrail[tag]) {
    //       query = tag
    //
    //       // check for any matches between children and recipe.tags
    //       if (searchTrail[tag]["children"]) {
    //         console.log("children: " + searchTrail[tag]["children"])
    //         const intersection = recipe.tags.filter(element => searchTrail[tag]["children"].includes(element))
    //
    //         console.log("intersection: " + JSON.stringify(intersection));
    //         if (intersection.length > 0) {
    //           console.log("matched" + intersection[0])
    //           query = intersection[0]
    //         }
    //       }
    //     }
    //   });
    // }

    // if (searchTrail[query]) {
    //   let parentTrail = searchTrail[query]["parents"].map((item, index) => {
    //     let stub = "/recipes/" + item.toLowerCase().trim().replaceAll(" ", "-")
    //     if (item == "home") {
    //       stub = "/"
    //     }
    //     return (<a className="parent" href={stub}>{item}</a>)
    //   })
    //
    //   if (recipe) {
    //     let stub = "/recipes/" + query.toLowerCase().trim().replaceAll(" ", "-")
    //     parentTrail.push(<a className="parent" href={stub}>{query}</a>)
    //   } else {
    //     parentTrail.push(<a className="current">{query}</a>)
    //   }
    //
    //   let childTrail = searchTrail[query]["children"].map((item, index) => {
    //     let stub = "/recipes/" + item.toLowerCase().trim().replaceAll(" ", "-")
    //     return (<a className="child" href={stub}>{item}</a>)
    //   })
    //
    //   let assembledTrail = parentTrail.concat(childTrail)
    //
    //   console.log("setting Trail: " + JSON.stringify(assembledTrail))
    //   setTrail(assembledTrail)
    // }

  }, []);

  return (
    <div >
      <SearchTrailRow config={searchConfig} query={query} recipe={recipe}/>
    </div>
  );
}
