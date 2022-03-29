import React from 'react';
import searchTrail from '../utils/SearchTrail.json'

export default function SearchTrail(props) {
  let path = window.location.pathname
  var query = ''

  if (path.includes("/recipes/")) {
    query = path.replace("/recipes/", "").replace("-", " ")
  }

  var [ trail, setTrail ] = React.useState([])

  React.useEffect(() => {
    console.log("query: " + query)

    if(query.length == 0) {
      query = "home"
    }

    if (searchTrail[query]) {
      let parentTrail = searchTrail[query]["parents"].map((item, index) => {
        let stub = "/recipes/" + item.toLowerCase().trim().replace(" ", "-")
        if (item == "home") {
          stub = "/"
        }
        return (<a className="parent" href={stub}>{item}</a>)
      })

      parentTrail.push(<a className="current">{query}</a>)

      let childTrail = searchTrail[query]["children"].map((item, index) => {
        let stub = "/recipes/" + item.toLowerCase().trim().replace(" ", "-")
        return (<a className="child" href={stub}>{item}</a>)
      })

      let assembledTrail = parentTrail.concat(childTrail)

      setTrail(assembledTrail)

      console.log("setting Trail: " + trail)
    }
  }, []);

  return (
    <div className="search-trail">
      {trail}
    </div>
  );
}
