import { ObjectId } from "bson";
import { useMutation } from "@apollo/client";
import { compose } from 'recompose';
import gql from "graphql-tag";

export default function useRecipeMutations(recipe) {
  return {
    addRecipe: useAddRecipe(recipe),
    updateRecipe: useUpdateRecipe(recipe),
    deleteRecipe: useDeleteRecipe(recipe)
  };
}

const AddRecipeMutation = gql`
  mutation DeleteRecipe(
    $recipeId: String!
  	$ingredients: [String!]
    $directions: [String!]
  ){
    deletedRecipe: deleteOneRecipe(query: { _id: $recipeId }) {
    	_id
      author
      title
      ingredients {
        _id
      }
    }
    deletedIngredients: deleteManyIngredients(query: { _id_in: $ingredients }) {
      deletedCount
    }
    deletedDirections: deleteManyDirections(query: { _id_in: $directions }) {
      deletedCount
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
  mutation DeleteRecipe(
    $recipeId: String!
  	$ingredients: [String!]
  ){
  	deletedRecipe: deleteOneRecipe(query: { _id: $recipeId }) {
    	_id
      author
      title
      ingredients {
        _id
      }
    }
    deletedIngredients: deleteManyIngredients(query: { _id_in: $ingredients }) {
      deletedCount
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

function useDeleteRecipe(recipe) {
  const [deleteRecipeMutation] = useMutation(DeleteRecipeMutation);
  const deleteRecipe = async (recipe) => {
    console.log("useDeleteRecipe: " + JSON.stringify(recipe))
    const { deletedRecipe } = await deleteRecipeMutation({
      variables: {
        recipeId: recipe._id,
        ingredients: recipe.ingredients.create.map(ing => ing._id) || [],
        directions: recipe.directions.create.map(dir => dir._id) || []
      }
    });
    return deletedRecipe;
  };
  return deleteRecipe;
}
