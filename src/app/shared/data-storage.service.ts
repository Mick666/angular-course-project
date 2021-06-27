import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { Store } from "@ngrx/store";

@Injectable({
    providedIn: 'root'
})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private store: Store<fromApp.AppState>) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put('https://udemy-course-project-a4be3-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json', recipes)
            .subscribe(response => console.log(response))
    }

    fetchRecipes() {
        return this.http
                .get<Recipe[]>(
                    'https://udemy-course-project-a4be3-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
                )
                .pipe(
                    map(recipes => {
                        return recipes.map(recipe => {
                            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                            })
                        }),
                    tap((recipes: Recipe[]) => this.store.dispatch(new RecipesActions.SetRecipes(recipes)))
                );
    }
}