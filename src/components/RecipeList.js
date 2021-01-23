import React from "react";
import useRecipes from "../graphql/useRecipes";
import { useRealmApp } from "../RealmApp";

export default function RecipeList() {

  const app = useRealmApp();

  const { recipes, loading, error } = useRecipes();

  // const getTaskById = (id) => tasks.find((task) => task._id === id);
  // const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  // const selectedTask = getTaskById(selectedTaskId);
  //
  // const {
  //   draftTask,
  //   createDraftTask,
  //   deleteDraftTask,
  //   setDraftTaskName,
  //   submitDraftTask,
  // } = useDraftTask({ addTask });

  return loading ? (
      <div>
        Loading
      </div>
    ) : (
      <div>
        {recipes.length === 0 ? (
          <div>
            <h1>No Recipes</h1>
          </div>
        ) : (
          recipes.map((recipe) => (
            <div key={recipe._id}>
              {recipe.title}
            </div>
          ))
        )}
      </div>
  );
}
