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

  var [ trailVisible, setTrailVisible ] = React.useState(true)

  var recipe = useSelector((state) => state.recipe)
  var externalRecipes = useSelector((state) => state.externalRecipes)
  var searchConfig = useSelector((state) => state.searchConfig)

  React.useEffect(() => {
    if(query.length == 0) {
      query = ""
    }
    if (path.includes("/builder") || path.includes("/perfectSearch")) {
      setTrailVisible(false)
    }
  }, []);

  return trailVisible ? (
    <div >
      <SearchTrailRow config={searchConfig} query={query} recipe={recipe}/>
    </div>
  ) : (
    <div></div>
  )

}
