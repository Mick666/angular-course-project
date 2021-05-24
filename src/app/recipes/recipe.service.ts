import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {

    private recipes: Recipe[] = [
        new Recipe(
            'Tasty schnitzel',
            'Super simple, super tasty',
            'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]
        ),
        new Recipe(
            'Big fat burger',
            'It\'s a burger mate',
            'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Patty', 1),
                new Ingredient('Lettuce', 1),
                new Ingredient('Cheese', 1),
            ]
            )
    ];

    constructor(private shoppingService: ShoppingService) {}

    getRecipes() {
        return [...this.recipes];
    }

    getRecipe(id: number) {
        console.log(id, this.recipes[id])
        return this.recipes[id]
    }

    addIngredients(ingredients: Ingredient[]) {
        this.shoppingService.addIngredients(ingredients);
    }
}