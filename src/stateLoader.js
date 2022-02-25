// Manage persistence of state via local storage.
export const loadState = () => {
  try {
    let serializedState = localStorage.getItem("funkyradish.com:state");

    if (!serializedState || serializedState === undefined || serializedState === "undefined" || serializedState == null) {
      console.log("setting state cuz it aint")
      let initialState = initializeState();
      localStorage.setItem("funkyradish.com:state", JSON.stringify(initialState));
      return initialState;
    }

    console.log("unparsed state: " + serializedState)
    console.log("type: " + typeof(serializedState))

    return JSON.parse(serializedState);
  }
  catch (err) {
    console.log("error loading state: " + err.message)
    return undefined;
  }
};

export const saveState = (state) => {

  console.log("writing state.")

  try {
    let serializedState = JSON.stringify(state);
    localStorage.setItem("funkyradish.com:state", serializedState);
  }
  catch (err) {
    console.log("error writing state.")
  }
};

export const initializeState = () => {
  console.log("setting initial state.")

  let initialState = {
    recipes: [],
    filteredRecipes: [],
    menu: false,
    recipe: null,
    loader: false,
    redirect: null,
    warnings: []
  }

  return initialState;
}
