import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit, OnDestroy {
  recipes: Recipe[]
  private recipeServiceSubscription: Subscription;

  constructor( private router: Router, private route: ActivatedRoute, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.recipeServiceSubscription = this.store
      .select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => this.recipes = recipes);
  }

  ngOnDestroy(): void {
    this.recipeServiceSubscription.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

}
