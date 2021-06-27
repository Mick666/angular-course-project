import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../auth/auth.guard";
import { NoRecipeComponent } from "./no-recipe/no-recipe.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipesDetailComponent } from "./recipes-detail/recipes-detail.component";
import { RecipesResolverService } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const routes: Routes = [
    {
      path: '',
      component: RecipesComponent,
      canActivate: [AuthGuard],
      children: [
        { path: '', component: NoRecipeComponent },
        { path: 'new', component: RecipeEditComponent },
        {
          path: ':id',
          component: RecipesDetailComponent,
          resolve: [RecipesResolverService]
        },
        {
          path: ':id/edit',
          component: RecipeEditComponent,
          resolve: [RecipesResolverService]
        }
      ]
    }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}