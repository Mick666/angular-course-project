import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "../app-routing.module";

import { NoRecipeComponent } from "./no-recipe/no-recipe.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesDetailComponent } from "./recipes-detail/recipes-detail.component";
import { RecipeItemComponent } from "./recipes-list/recipe-item/recipe-item.component";
import { RecipesListComponent } from "./recipes-list/recipes-list.component";
import { RecipesRoutingModule } from "./recipes-routing.module";
import { RecipesComponent } from "./recipes.component";

@NgModule({
    declarations: [
        RecipesComponent,
        RecipesDetailComponent,
        RecipesListComponent,
        RecipeItemComponent,
        NoRecipeComponent,
        RecipeEditComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        RecipesRoutingModule
    ]
})
export class RecipesModule {}