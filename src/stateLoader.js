// Manage persistence of state via local storage.
export const loadState = () => {
  try {
    let serializedState = localStorage.getItem("funkyradish.com:state");

    let initialState = initializeState();
    localStorage.setItem("funkyradish.com:state", JSON.stringify(initialState));

    return JSON.parse(initialState);

    if (!serializedState || serializedState === undefined || serializedState === "undefined" || serializedState == null) {
      let initialState = initializeState();
      localStorage.setItem("funkyradish.com:state", JSON.stringify(initialState));

      return JSON.parse(initialState);
    }

    return JSON.parse(serializedState);
  }
  catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    let serializedState = JSON.stringify(state);
    localStorage.setItem("funkyradish.com:state", serializedState);
  }
  catch (err) {
    console.log("error writing state.")
  }
};

export const initializeState = () => {
  let initialState = {
    recipes: [],
    recipe: null,
    warnings: []
  }

  return initialState;
}
