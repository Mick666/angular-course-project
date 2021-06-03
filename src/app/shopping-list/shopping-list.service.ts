import { Subject } from 'rxjs';

import { Ingredient } from "../shared/ingredient.model";

export class ShoppingService {
    ingredientAdded = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
      ];

    getIngredients() {
        return [...this.ingredients];
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    updateIngredient(index: number, ingredient: Ingredient) {
        this.ingredients[index] = ingredient;
        this.ingredientAdded.next([...this.ingredients])
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient)
        this.ingredientAdded.next([...this.ingredients])
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients)
        this.ingredientAdded.next([...this.ingredients])
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1)
        this.ingredientAdded.next([...this.ingredients])
    }

}