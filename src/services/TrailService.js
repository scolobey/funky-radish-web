export default class TrailService {

  build = (searchConfig, searchQuery) => {
    console.log("config: " + JSON.stringify(searchConfig));
    console.log("trail query: " + JSON.stringify(searchQuery));

    if(searchQuery.length == 0) {
      searchQuery = "home"

      searchConfig = {
        "children": [
          "cocktails",
          "cookies",
          "soups",
          "pizza"
        ],
        "parents": []
      }
    }

    var parentTrail = []
    var childTrail = []

    if (searchConfig && searchConfig.parents && searchConfig.parents.length > 0) {
      parentTrail = searchConfig.parents.map((item, index) => {
        let stub = "/recipes/" + item.toLowerCase().trim().replaceAll(" ", "-")
        if (item == "home") {
          stub = "/"
        }
        return (<a className="parent" href={stub}>{item}</a>)
      })
    }

    if (searchQuery && searchQuery.length > 0) {
      if (searchQuery == "home") {
        parentTrail.push(<a className="current" href="/">{searchQuery}</a>)
      } else {
        parentTrail.push(<a className="current">{searchQuery}</a>)
      }
    }

    if (searchConfig && searchConfig.children && searchConfig.children.length > 0) {
      childTrail = searchConfig.children.map((item, index) => {
        let stub = "/recipes/" + item.toLowerCase().trim().replaceAll(" ", "-")
        return (<a className="child" href={stub}>{item}</a>)
      })
    }

    // if (recipe && recipe.tags && recipe.tags.length > 0) {
    //   // Make sure you get the deepest category
    //   recipe.tags.forEach((tag, i) => {
    //     // if (searchTrail[tag]) {
    //     //   query = tag
    //     //
    //     //   // check for any matches between children and recipe.tags
    //     //   if (searchTrail[tag]["children"]) {
    //     //     console.log("children: " + searchTrail[tag]["children"])
    //     //     const intersection = recipe.tags.filter(element => searchTrail[tag]["children"].includes(element))
    //     //
    //     //     console.log("intersection: " + JSON.stringify(intersection));
    //     //     if (intersection.length > 0) {
    //     //       console.log("matched" + intersection[0])
    //     //       query = intersection[0]
    //     //     }
    //     //   }
    //     // }
    //   });
    // }
    //
    // if (searchTrail[query]) {
    //
    //   if (recipe) {
    //     let stub = "/recipes/" + query.toLowerCase().trim().replaceAll(" ", "-")
    //     parentTrail.push(<a className="parent" href={stub}>{query}</a>)
    //   } else {
    //     // parentTrail.push(<a className="current">{query}</a>)
    //   }
    //
    // }

    let trail = parentTrail.concat(childTrail)

    return trail
  }
}
