import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs/operators";
import { Recipe } from "../recipe.model";

import * as RecipesActions from './recipes.actions';

@Injectable()
export class RecipeEffects {

    constructor(private action$: Actions, private http: HttpClient) {}

    @Effect()
    fetchRecipes = this.action$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() =>{
            return this.http
            .get<Recipe[]>(
                'https://udemy-course-project-a4be3-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json',
            )
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                }
            })
        }),
        map(recipes => new RecipesActions.SetRecipes(recipes))
    )

}