// src/schema.js

scalar DateTime
type DeleteManyPayload {
  deletedCount: Int!
}
type Direction {
  _id: String
  author: String!
  text: String!
}
input DirectionInsertInput {
  author: String!
  text: String!
  _id: String
}
input DirectionQueryInput {
  _id_lt: String
  AND: [DirectionQueryInput!]
  text_exists: Boolean
  author_gt: String
  _id_in: [String]
  _id: String
  _id_nin: [String]
  text_lt: String
  text_nin: [String]
  author_exists: Boolean
  _id_lte: String
  text_lte: String
  text_gt: String
  _id_gt: String
  author_ne: String
  author_lt: String
  _id_ne: String
  OR: [DirectionQueryInput!]
  text_in: [String]
  author_gte: String
  author_nin: [String]
  text_gte: String
  _id_exists: Boolean
  text: String
  author: String
  text_ne: String
  _id_gte: String
  author_in: [String]
  author_lte: String
}
enum DirectionSortByInput {
  AUTHOR_ASC
  AUTHOR_DESC
  TEXT_ASC
  TEXT_DESC
  _ID_ASC
  _ID_DESC
}
input DirectionUpdateInput {
  text: String
  text_unset: Boolean
  _id: String
  _id_unset: Boolean
  author: String
  author_unset: Boolean
}
type Ingredient {
  _id: String
  author: String!
  name: String!
}
input IngredientInsertInput {
  author: String!
  name: String!
  _id: String
}
input IngredientQueryInput {
  name_nin: [String]
  _id_ne: String
  _id_gte: String
  name_in: [String]
  _id_gt: String
  _id_in: [String]
  author_ne: String
  author_gt: String
  name_gte: String
  AND: [IngredientQueryInput!]
  author_in: [String]
  _id_nin: [String]
  _id_exists: Boolean
  name_ne: String
  author_nin: [String]
  _id: String
  author_gte: String
  name_lt: String
  _id_lte: String
  author_lte: String
  author_exists: Boolean
  _id_lt: String
  name: String
  name_lte: String
  name_gt: String
  author: String
  name_exists: Boolean
  OR: [IngredientQueryInput!]
  author_lt: String
}
enum IngredientSortByInput {
  _ID_DESC
  AUTHOR_ASC
  AUTHOR_DESC
  NAME_ASC
  NAME_DESC
  _ID_ASC
}
input IngredientUpdateInput {
  _id: String
  _id_unset: Boolean
  author: String
  author_unset: Boolean
  name: String
  name_unset: Boolean
}
type InsertManyPayload {
  insertedIds: [ObjectId]!
}
type Mutation {
  deleteManyDirections(query: DirectionQueryInput): DeleteManyPayload
  deleteManyIngredients(query: IngredientQueryInput): DeleteManyPayload
  deleteManyRecipes(query: RecipeQueryInput): DeleteManyPayload
  deleteManyUsers(query: UserQueryInput): DeleteManyPayload
  deleteOneDirection(query: DirectionQueryInput!): Direction
  deleteOneIngredient(query: IngredientQueryInput!): Ingredient
  deleteOneRecipe(query: RecipeQueryInput!): Recipe
  deleteOneUser(query: UserQueryInput!): User
  insertManyDirections(data: [DirectionInsertInput!]!): InsertManyPayload
  insertManyIngredients(data: [IngredientInsertInput!]!): InsertManyPayload
  insertManyRecipes(data: [RecipeInsertInput!]!): InsertManyPayload
  insertManyUsers(data: [UserInsertInput!]!): InsertManyPayload
  insertOneDirection(data: DirectionInsertInput!): Direction
  insertOneIngredient(data: IngredientInsertInput!): Ingredient
  insertOneRecipe(data: RecipeInsertInput!): Recipe
  insertOneUser(data: UserInsertInput!): User
  replaceOneDirection(query: DirectionQueryInput, data: DirectionInsertInput!): Direction
  replaceOneIngredient(query: IngredientQueryInput, data: IngredientInsertInput!): Ingredient
  replaceOneRecipe(query: RecipeQueryInput, data: RecipeInsertInput!): Recipe
  replaceOneUser(query: UserQueryInput, data: UserInsertInput!): User
  updateManyDirections(query: DirectionQueryInput, set: DirectionUpdateInput!): UpdateManyPayload
  updateManyIngredients(query: IngredientQueryInput, set: IngredientUpdateInput!): UpdateManyPayload
  updateManyRecipes(query: RecipeQueryInput, set: RecipeUpdateInput!): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
  updateOneDirection(query: DirectionQueryInput, set: DirectionUpdateInput!): Direction
  updateOneIngredient(query: IngredientQueryInput, set: IngredientUpdateInput!): Ingredient
  updateOneRecipe(query: RecipeQueryInput, set: RecipeUpdateInput!): Recipe
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneDirection(query: DirectionQueryInput, data: DirectionInsertInput!): Direction
  upsertOneIngredient(query: IngredientQueryInput, data: IngredientInsertInput!): Ingredient
  upsertOneRecipe(query: RecipeQueryInput, data: RecipeInsertInput!): Recipe
  upsertOneUser(query: UserQueryInput, data: UserInsertInput!): User
}
scalar ObjectId
type Query {
  direction(query: DirectionQueryInput): Direction
  directions(query: DirectionQueryInput, limit: Int = 100, sortBy: DirectionSortByInput): [Direction]!
  ingredient(query: IngredientQueryInput): Ingredient
  ingredients(query: IngredientQueryInput, limit: Int = 100, sortBy: IngredientSortByInput): [Ingredient]!
  recipe(query: RecipeQueryInput): Recipe
  recipes(query: RecipeQueryInput, limit: Int = 100, sortBy: RecipeSortByInput): [Recipe]!
  user(query: UserQueryInput): User
  users(query: UserQueryInput, limit: Int = 100, sortBy: UserSortByInput): [User]!
}
type Recipe {
  _id: String
  author: String!
  directions: [Direction]
  ingredients: [Ingredient]
  title: String
}
input RecipeDirectionsRelationInput {
  link: [String]
  create: [DirectionInsertInput]
}
input RecipeIngredientsRelationInput {
  create: [IngredientInsertInput]
  link: [String]
}
input RecipeInsertInput {
  title: String
  ingredients: RecipeIngredientsRelationInput
  directions: RecipeDirectionsRelationInput
  _id: String
  author: String!
}
input RecipeQueryInput {
  title_gt: String
  ingredients: [IngredientQueryInput]
  _id_lte: String
  OR: [RecipeQueryInput!]
  title_lte: String
  _id_in: [String]
  _id_exists: Boolean
  ingredients_exists: Boolean
  author: String
  title_in: [String]
  _id_lt: String
  author_gte: String
  title_gte: String
  ingredients_nin: [IngredientQueryInput]
  directions_exists: Boolean
  _id_nin: [String]
  _id_gt: String
  _id: String
  AND: [RecipeQueryInput!]
  ingredients_in: [IngredientQueryInput]
  directions_in: [DirectionQueryInput]
  title_lt: String
  directions_nin: [DirectionQueryInput]
  _id_ne: String
  author_gt: String
  author_nin: [String]
  title_exists: Boolean
  directions: [DirectionQueryInput]
  author_in: [String]
  title: String
  _id_gte: String
  title_nin: [String]
  author_exists: Boolean
  title_ne: String
  author_lte: String
  author_ne: String
  author_lt: String
}
enum RecipeSortByInput {
  _ID_ASC
  _ID_DESC
  AUTHOR_ASC
  AUTHOR_DESC
  TITLE_ASC
  TITLE_DESC
}
input RecipeUpdateInput {
  title_unset: Boolean
  directions: RecipeDirectionsRelationInput
  author: String
  author_unset: Boolean
  title: String
  ingredients: RecipeIngredientsRelationInput
  _id_unset: Boolean
  _id: String
  ingredients_unset: Boolean
  directions_unset: Boolean
}
type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}
type User {
  _id: ObjectId
  admin: Boolean
  author: String!
  createdAt: DateTime
  email: String
  name: String
  password: String
  recipes: [Recipe]
  updatedAt: DateTime
  user: ObjectId!
}
input UserInsertInput {
  updatedAt: DateTime
  recipes: UserRecipesRelationInput
  _id: ObjectId
  author: String!
  createdAt: DateTime
  email: String
  name: String
  password: String
  user: ObjectId!
  admin: Boolean
}
input UserQueryInput {
  updatedAt_gt: DateTime
  email_ne: String
  author_gte: String
  updatedAt_in: [DateTime]
  updatedAt_lt: DateTime
  user_in: [ObjectId]
  password_ne: String
  _id_gte: ObjectId
  password_gte: String
  admin_exists: Boolean
  createdAt_ne: DateTime
  password_lt: String
  email_lte: String
  author_ne: String
  password_exists: Boolean
  OR: [UserQueryInput!]
  name_nin: [String]
  updatedAt_nin: [DateTime]
  _id_nin: [ObjectId]
  author_in: [String]
  _id_ne: ObjectId
  user_gt: ObjectId
  user_ne: ObjectId
  recipes_nin: [RecipeQueryInput]
  password: String
  AND: [UserQueryInput!]
  createdAt_in: [DateTime]
  createdAt_gte: DateTime
  name_in: [String]
  updatedAt_gte: DateTime
  author_lte: String
  createdAt: DateTime
  createdAt_gt: DateTime
  user_gte: ObjectId
  user_exists: Boolean
  email_gte: String
  email_nin: [String]
  name_lte: String
  name: String
  _id_in: [ObjectId]
  updatedAt: DateTime
  user: ObjectId
  user_nin: [ObjectId]
  recipes_exists: Boolean
  admin_ne: Boolean
  _id_lte: ObjectId
  author_nin: [String]
  _id_lt: ObjectId
  author_gt: String
  createdAt_exists: Boolean
  createdAt_lte: DateTime
  password_nin: [String]
  user_lte: ObjectId
  _id_exists: Boolean
  author_lt: String
  name_gt: String
  recipes_in: [RecipeQueryInput]
  _id_gt: ObjectId
  user_lt: ObjectId
  email_in: [String]
  name_ne: String
  name_lt: String
  updatedAt_exists: Boolean
  email: String
  password_lte: String
  name_gte: String
  recipes: [RecipeQueryInput]
  admin: Boolean
  name_exists: Boolean
  createdAt_nin: [DateTime]
  password_gt: String
  _id: ObjectId
  email_gt: String
  email_lt: String
  updatedAt_ne: DateTime
  password_in: [String]
  author_exists: Boolean
  updatedAt_lte: DateTime
  createdAt_lt: DateTime
  author: String
  email_exists: Boolean
}
input UserRecipesRelationInput {
  link: [String]
  create: [RecipeInsertInput]
}
enum UserSortByInput {
  AUTHOR_ASC
  CREATEDAT_DESC
  PASSWORD_DESC
  NAME_DESC
  EMAIL_DESC
  PASSWORD_ASC
  USER_DESC
  AUTHOR_DESC
  CREATEDAT_ASC
  NAME_ASC
  UPDATEDAT_ASC
  EMAIL_ASC
  _ID_ASC
  _ID_DESC
  UPDATEDAT_DESC
  USER_ASC
}
input UserUpdateInput {
  _id: ObjectId
  password_unset: Boolean
  author: String
  createdAt_unset: Boolean
  recipes: UserRecipesRelationInput
  updatedAt_unset: Boolean
  name_unset: Boolean
  email_unset: Boolean
  recipes_unset: Boolean
  admin: Boolean
  name: String
  email: String
  createdAt: DateTime
  _id_unset: Boolean
  user: ObjectId
  password: String
  user_unset: Boolean
  admin_unset: Boolean
  author_unset: Boolean
  updatedAt: DateTime
}
