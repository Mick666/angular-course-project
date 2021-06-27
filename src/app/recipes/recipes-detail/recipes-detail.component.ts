import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.css']
})
export class RecipesDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   this.store.select('recipes')
    //   .pipe(
    //     map(recipesState => recipesState.recipes
    //       .find((recipe, index) => index === this.id)
    //     )
    //   ).subscribe(recipe => this.recipe = recipe);
    // })
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => {
          this.id = id
          return this.store.select('recipes')
        }),
        map(recipesState => recipesState.recipes
          .find((recipe, index) => index === this.id)
        )
      )
      .subscribe(recipe => this.recipe = recipe)
  }

  addIngredientsToShoppingList() {
    this.recipeService.addIngredients(this.recipe.ingredients)
  }

  onDelete() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['recipes'])
  }

}
