import { ObjectId } from "bson";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export default function useRecipeMutations(recipe) {
  return {
    addRecipe: useAddRecipe(recipe),
    updateRecipe: useUpdateRecipe(recipe),
    deleteRecipe: useDeleteRecipe(recipe)
  };
}

const AddRecipeMutation = gql`
  mutation AddRecipe($recipe: RecipeInsertInput!) {
    addedRecipe: insertOneRecipe(data: $recipe) {
    	_id
      author
      title
      ing
      dir
    }
  }
`;

const UpdateRecipeMutation = gql`
  mutation UpdateRecipe(
    $recipeId: String!,
    $updates: RecipeUpdateInput!
  ){
    updatedRecipe: updateOneRecipe(query: { _id: $recipeId }, set: $updates) {
      _id
      author
      title
      ing
      dir
    }
  }
`;

const DeleteRecipeMutation = gql`
  mutation DeleteRecipe(
    $recipeId: String!
  ){
    deletedRecipe: deleteOneRecipe(query: { _id: $recipeId }) {
      _id
      author
      title
    }
  }
`;

const RecipeFieldsFragment = gql`
  fragment RecipeFields on Recipe {
    _id
    author
    title
  }
`;

function useAddRecipe(recipe) {

  const [addRecipeMutation] = useMutation(AddRecipeMutation, {
    // Manually save added Recipes into the Apollo cache so that Recipe queries automatically update
    // For details, refer to https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    update: (cache, { data: { addedRecipe } }) => {
      cache.modify({
        fields: {
          recipes: (existingRecipes = []) => [
            ...existingRecipes,
            cache.writeFragment({
              data: addedRecipe,
              fragment: RecipeFieldsFragment,
            }),
          ],
        },
      });
    },
  });

  const addRecipe = async (recipe) => {
    let currentTime = new Date()

    const { addedRecipe } = await addRecipeMutation({
      variables: {
        recipe: {
          _id: recipe._id,
          author: recipe.author,
          lastUpdated: currentTime,
          ...recipe,
        },
      },
    });

    return addedRecipe;
  };

  return addRecipe;
}

function useUpdateRecipe(recipe) {
  const [updateRecipeMutation] = useMutation(UpdateRecipeMutation);

  console.log("time be here");

  const updateRecipe = async (recipe) => {
    let currentTime = new Date()
    recipe.updates.lastUpdated = currentTime

    const { updatedRecipe } = await updateRecipeMutation({
      variables: {
        recipeId: recipe.recipeId,
        updates: recipe.updates
      }
    });

    return updatedRecipe;
  };

  return updateRecipe;
}

function useDeleteRecipe(recipe) {
  const [deleteRecipeMutation] = useMutation(DeleteRecipeMutation);
  const deleteRecipe = async (recipe) => {
    const { deletedRecipe } = await deleteRecipeMutation({
      variables: {
        recipeId: recipe._id
      }
    });
    return deletedRecipe;
  };
  return deleteRecipe;
}
