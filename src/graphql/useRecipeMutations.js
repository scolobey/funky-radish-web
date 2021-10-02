import { ObjectId } from "bson";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

export default function useRecipeMutations(recipe) {
  console.log("bringing in the mutations: " + recipe)
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
      ingredients {
        _id
        author
        name
      }
    }
  }
`;

const UpdateRecipeMutation = gql`
  mutation UpdateRecipe($recipeId: ObjectId!, $updates: RecipeUpdateInput!) {
    updatedRecipe: updateOneRecipe(query: { _id: $recipeId }, set: $updates) {
      _id
      author
      title
    }
  }
`;

const DeleteRecipeMutation = gql`
  mutation DeleteRecipe($recipeId: ObjectId!) {
    deletedRecipe: deleteOneRecipe(query: { _id: recipeId }) {
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
  console.log("using recipe adder function: " + JSON.stringify(recipe))
  //Check if this worked? Check if it's needed, or if we

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
    console.log("using recipe adder: " + JSON.stringify(recipe))
    const { addedRecipe } = await addRecipeMutation({
      variables: {
        recipe: {
          _id: recipe._id,
          author: recipe.author,
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
  const updateRecipe = async (recipe, updates) => {
    const { updatedRecipe } = await updateRecipeMutation({
      variables: { recipeId: recipe._id, updates },
    });
    return updatedRecipe;
  };
  return updateRecipe;
}

function useDeleteRecipe(recipeId) {
  const [deleteRecipeMutation] = useMutation(DeleteRecipeMutation);
  const deleteRecipe = async (recipe) => {
    const { deletedRecipe } = await deleteRecipeMutation({
      variables: { recipeId: recipe._id },
    });
    return deletedRecipe;
  };
  return deleteRecipe;
}
