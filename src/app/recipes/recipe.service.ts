import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Tasty schnitzel',
    //         'Super simple, super tasty',
    //         'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]
    //     ),
    //     new Recipe(
    //         'Big fat burger',
    //         'It\'s a burger mate',
    //         'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Patty', 1),
    //             new Ingredient('Lettuce', 1),
    //             new Ingredient('Cheese', 1),
    //         ]
    //         )
    // ];

    private recipes: Recipe[] = [];

    constructor(private shoppingService: ShoppingService) {}

    getRecipes() {
        return [...this.recipes];
    }

    getRecipe(id: number) {
        return this.recipes[id]
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next([...this.recipes]);
    }

    addIngredients(ingredients: Ingredient[]) {
        this.shoppingService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe): number {
        this.recipes.push(recipe);
        this.recipesChanged.next([...this.recipes]);
        return this.recipes.length-1;
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipesChanged.next([...this.recipes]);
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next([...this.recipes]);
    }
}