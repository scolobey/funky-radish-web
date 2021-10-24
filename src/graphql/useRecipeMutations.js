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
      ingredients {
        _id
        author
        name
      }
      directions {
        _id
        author
        text
      }
    }
  }
`;

const UpdateRecipeMutation = gql`
  mutation UpdateRecipe(
    $recipeId: String!,
    $updates: RecipeUpdateInput!,
    $oldIngredients: [String],
    $oldDirections: [String]
  ){
    deletedIngredients: deleteManyIngredients(query: { _id_in: $oldIngredients }){
      deletedCount
    }
    deletedDirections: deleteManyDirections(query: { _id_in: $oldDirections }){
      deletedCount
    }
    updatedRecipe: updateOneRecipe(query: { _id: $recipeId }, set: $updates) {
      _id
      author
      title
      ingredients {
        name
      }
      directions {
        text
      }
    }
  }
`;

const DeleteRecipeMutation = gql`
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
  const updateRecipe = async (recipe) => {
    const { updatedRecipe } = await updateRecipeMutation({
      variables: {
        recipeId: recipe.recipeId,
        oldIngredients: recipe.oldIngredients,
        oldDirections: recipe.oldDirections,
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
        recipeId: recipe._id,
        ingredients: recipe.ingredients.create.map(ing => ing._id) || [],
        directions: recipe.directions.create.map(dir => dir._id) || []
      }
    });
    return deletedRecipe;
  };
  return deleteRecipe;
}
