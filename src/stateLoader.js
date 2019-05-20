// Manage persistence of state via local storage.
export const loadState = () => {
  try {
    let serializedState = localStorage.getItem("funkyradish.com:state");
    console.log(JSON.stringify(serializedState));

    initializeState();

    serializedState = localStorage.getItem("funkyradish.com:state");
    console.log(JSON.stringify(serializedState));

    if (serializedState === undefined) {
      return initializeState();
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
    warnings: [],
    remoteRecipes: []
  }

  localStorage.setItem("funkyradish.com:state", JSON.stringify(initializeState));
  return initialState;
}
