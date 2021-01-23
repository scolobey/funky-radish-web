
type Direction {
  realmID: ID!
  text: String
}

type Ingredient {
  realmID: ID!
  name: String
}

type Recipe {
  realmID: ID!
  title: String
  ingredients: [Ingredient]
  directions: [Direction]
}

type Query {
  getRecipe(id: ID!): Recipe
}

type Mutation {
  createRecipe(input: RecipeInput): Recipe
  updateRecipe(id: ID!, input: RecipeInput): Recipe
}
