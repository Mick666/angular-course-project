import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingListRoutingModule } from "./shopping-list.routing";

@NgModule({
    declarations: [
        ShoppingListComponent,
        ShoppingEditComponent,
    ], 
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ShoppingListRoutingModule
    ]
})
export class ShoppingListModule {}