import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput') shoppingListName: ElementRef
  @ViewChild('amountInput') shoppingListAmount: ElementRef

  constructor(private shoppingService: ShoppingService) { }

  ngOnInit(): void {
  }

  createNewShoppingList() {
    this.shoppingService.addIngredient(new Ingredient(this.shoppingListName.nativeElement.value,this.shoppingListAmount.nativeElement.value))
  }

}
