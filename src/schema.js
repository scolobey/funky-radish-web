// src/schema.js

enum DirectionSortByInput {
  _ID_ASC
  _ID_DESC
  AUTHOR_ASC
  AUTHOR_DESC
  TEXT_ASC
  TEXT_DESC
}
type Recipe {
  _id: String
  author: String
  dir: [String]
  directions: [Direction]
  ing: [String]
  ingredients: [Ingredient]
  tags: [String]
  title: String
}
input RecipeInsertInput {
  title: String
  _id: String
  author: String
  dir: [String]
  directions: RecipeDirectionsRelationInput
  ing: [String]
  ingredients: RecipeIngredientsRelationInput
  tags: [String]
}
scalar DateTime
input RecipeDirectionsRelationInput {
  link: [String]
  create: [DirectionInsertInput]
}
type InsertManyPayload {
  insertedIds: [ObjectId]!
}
input RecipeUpdateInput {
  ingredients: RecipeIngredientsRelationInput
  directions: RecipeDirectionsRelationInput
  tags_unset: Boolean
  _id: String
  ing: [String]
  tags: [String]
  title_unset: Boolean
  author: String
  dir_unset: Boolean
  directions_unset: Boolean
  author_unset: Boolean
  dir: [String]
  ing_unset: Boolean
  title: String
  _id_unset: Boolean
  ingredients_unset: Boolean
}
input DirectionQueryInput {
  text_lt: String
  _id_lt: String
  text_gt: String
  _id_gt: String
  _id_in: [String]
  _id: String
  AND: [DirectionQueryInput!]
  OR: [DirectionQueryInput!]
  text_lte: String
  _id_gte: String
  author_lt: String
  text_nin: [String]
  author: String
  text_in: [String]
  author_in: [String]
  author_gt: String
  author_nin: [String]
  _id_lte: String
  text_gte: String
  _id_exists: Boolean
  author_lte: String
  _id_nin: [String]
  author_exists: Boolean
  text_exists: Boolean
  text: String
  _id_ne: String
  author_gte: String
  text_ne: String
  author_ne: String
}
input IngredientQueryInput {
  _id_ne: String
  author_in: [String]
  author_nin: [String]
  _id: String
  _id_gt: String
  name_exists: Boolean
  author_ne: String
  name: String
  name_lte: String
  name_lt: String
  _id_lt: String
  author_gt: String
  OR: [IngredientQueryInput!]
  _id_lte: String
  _id_in: [String]
  author_lt: String
  author_exists: Boolean
  name_gt: String
  author_lte: String
  _id_nin: [String]
  _id_gte: String
  name_in: [String]
  name_ne: String
  name_nin: [String]
  _id_exists: Boolean
  name_gte: String
  author_gte: String
  author: String
  AND: [IngredientQueryInput!]
}
enum RecipeSortByInput {
  AUTHOR_DESC
  TITLE_ASC
  TITLE_DESC
  _ID_ASC
  _ID_DESC
  AUTHOR_ASC
}
input UserRecipesRelationInput {
  create: [RecipeInsertInput]
  link: [String]
}
type Ingredient {
  _id: String
  author: String!
  name: String!
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
  verified: Boolean
}
type DeleteManyPayload {
  deletedCount: Int!
}
input DirectionUpdateInput {
  author: String
  author_unset: Boolean
  text: String
  text_unset: Boolean
  _id: String
  _id_unset: Boolean
}
type Query {
  direction(query: DirectionQueryInput): Direction
  directions(query: DirectionQueryInput, limit: Int = 100, sortBy: DirectionSortByInput): [Direction]!
  ingredient(query: IngredientQueryInput): Ingredient
  ingredients(limit: Int = 100, sortBy: IngredientSortByInput, query: IngredientQueryInput): [Ingredient]!
  recipe(query: RecipeQueryInput): Recipe
  recipes(query: RecipeQueryInput, limit: Int = 100, sortBy: RecipeSortByInput): [Recipe]!
  user(query: UserQueryInput): User
  users(limit: Int = 100, sortBy: UserSortByInput, query: UserQueryInput): [User]!
}
input RecipeQueryInput {
  _id: String
  dir_exists: Boolean
  title_exists: Boolean
  ingredients_in: [IngredientQueryInput]
  _id_gte: String
  author_nin: [String]
  AND: [RecipeQueryInput!]
  OR: [RecipeQueryInput!]
  ingredients_nin: [IngredientQueryInput]
  author: String
  title_lt: String
  author_in: [String]
  directions_exists: Boolean
  title_in: [String]
  ing_nin: [String]
  directions: [DirectionQueryInput]
  dir_in: [String]
  ingredients: [IngredientQueryInput]
  author_gt: String
  author_lt: String
  dir_nin: [String]
  author_exists: Boolean
  ingredients_exists: Boolean
  dir: [String]
  tags_exists: Boolean
  _id_lt: String
  _id_nin: [String]
  author_ne: String
  title_ne: String
  directions_nin: [DirectionQueryInput]
  ing_exists: Boolean
  ing_in: [String]
  title: String
  _id_exists: Boolean
  author_gte: String
  ing: [String]
  _id_lte: String
  author_lte: String
  title_nin: [String]
  title_gt: String
  title_lte: String
  tags_in: [String]
  tags: [String]
  title_gte: String
  _id_ne: String
  tags_nin: [String]
  _id_gt: String
  _id_in: [String]
  directions_in: [DirectionQueryInput]
}
input UserInsertInput {
  author: String!
  verified: Boolean
  createdAt: DateTime
  name: String
  password: String
  _id: ObjectId
  recipes: UserRecipesRelationInput
  admin: Boolean
  email: String
  updatedAt: DateTime
}
scalar ObjectId
input DirectionInsertInput {
  _id: String
  author: String!
  text: String!
}
input IngredientInsertInput {
  _id: String
  author: String!
  name: String!
}
input UserUpdateInput {
  recipes: UserRecipesRelationInput
  createdAt_unset: Boolean
  _id_unset: Boolean
  author: String
  name: String
  recipes_unset: Boolean
  admin: Boolean
  name_unset: Boolean
  admin_unset: Boolean
  email_unset: Boolean
  password_unset: Boolean
  updatedAt_unset: Boolean
  updatedAt: DateTime
  createdAt: DateTime
  verified: Boolean
  _id: ObjectId
  author_unset: Boolean
  verified_unset: Boolean
  password: String
  email: String
}
enum UserSortByInput {
  _ID_ASC
  NAME_DESC
  EMAIL_ASC
  EMAIL_DESC
  NAME_ASC
  _ID_DESC
  CREATEDAT_DESC
  UPDATEDAT_ASC
  AUTHOR_DESC
  PASSWORD_DESC
  PASSWORD_ASC
  UPDATEDAT_DESC
  AUTHOR_ASC
  CREATEDAT_ASC
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
  updateManyRecipes(set: RecipeUpdateInput!, query: RecipeQueryInput): UpdateManyPayload
  updateManyUsers(query: UserQueryInput, set: UserUpdateInput!): UpdateManyPayload
  updateOneDirection(query: DirectionQueryInput, set: DirectionUpdateInput!): Direction
  updateOneIngredient(query: IngredientQueryInput, set: IngredientUpdateInput!): Ingredient
  updateOneRecipe(query: RecipeQueryInput, set: RecipeUpdateInput!): Recipe
  updateOneUser(query: UserQueryInput, set: UserUpdateInput!): User
  upsertOneDirection(data: DirectionInsertInput!, query: DirectionQueryInput): Direction
  upsertOneIngredient(query: IngredientQueryInput, data: IngredientInsertInput!): Ingredient
  upsertOneRecipe(query: RecipeQueryInput, data: RecipeInsertInput!): Recipe
  upsertOneUser(data: UserInsertInput!, query: UserQueryInput): User
}
input RecipeIngredientsRelationInput {
  create: [IngredientInsertInput]
  link: [String]
}
input IngredientUpdateInput {
  author: String
  author_unset: Boolean
  name: String
  name_unset: Boolean
  _id: String
  _id_unset: Boolean
}
type Direction {
  _id: String
  author: String!
  text: String!
}
enum IngredientSortByInput {
  _ID_ASC
  _ID_DESC
  AUTHOR_ASC
  AUTHOR_DESC
  NAME_ASC
  NAME_DESC
}
input UserQueryInput {
  author_gte: String
  password_exists: Boolean
  email_gt: String
  updatedAt_exists: Boolean
  admin: Boolean
  name_lt: String
  recipes: [RecipeQueryInput]
  _id_lt: ObjectId
  author_ne: String
  email_nin: [String]
  updatedAt_gt: DateTime
  email_lt: String
  _id: ObjectId
  name_gte: String
  _id_gte: ObjectId
  name_exists: Boolean
  author_lte: String
  author_exists: Boolean
  createdAt_lt: DateTime
  verified_ne: Boolean
  updatedAt_nin: [DateTime]
  updatedAt_ne: DateTime
  AND: [UserQueryInput!]
  _id_gt: ObjectId
  _id_ne: ObjectId
  password_ne: String
  author_gt: String
  recipes_exists: Boolean
  updatedAt_gte: DateTime
  author_lt: String
  author_in: [String]
  password_gte: String
  author: String
  name: String
  password: String
  email_ne: String
  createdAt_lte: DateTime
  name_nin: [String]
  createdAt: DateTime
  email_in: [String]
  updatedAt_lt: DateTime
  updatedAt_in: [DateTime]
  createdAt_gte: DateTime
  password_lt: String
  recipes_nin: [RecipeQueryInput]
  admin_ne: Boolean
  _id_nin: [ObjectId]
  createdAt_ne: DateTime
  OR: [UserQueryInput!]
  password_lte: String
  email_gte: String
  author_nin: [String]
  _id_exists: Boolean
  email_exists: Boolean
  password_gt: String
  updatedAt_lte: DateTime
  _id_lte: ObjectId
  email: String
  name_in: [String]
  name_lte: String
  createdAt_exists: Boolean
  name_ne: String
  password_in: [String]
  name_gt: String
  _id_in: [ObjectId]
  createdAt_in: [DateTime]
  email_lte: String
  createdAt_gt: DateTime
  updatedAt: DateTime
  verified: Boolean
  admin_exists: Boolean
  verified_exists: Boolean
  password_nin: [String]
  createdAt_nin: [DateTime]
  recipes_in: [RecipeQueryInput]
}
type UpdateManyPayload {
  matchedCount: Int!
  modifiedCount: Int!
}
