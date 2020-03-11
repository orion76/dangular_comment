import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'comment-state',
  template: `
  `,
  styles: [],
})
export class CommentStateComponent implements OnInit {
  @Input() state: any[];

  constructor() {
  }

  ngOnInit() {
  }

}

