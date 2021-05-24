import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() pageChange = new EventEmitter<{ page: string }>();
  constructor() { }

  ngOnInit(): void {
  }

  changePage(event: Event) {
    this.pageChange.emit({ page: (<HTMLAnchorElement>event.target).innerText });
  }

}
