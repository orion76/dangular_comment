import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'comment-actions',
  template: `
    <button (click)="edit()">Edit</button>
    <button (click)="reply()">Reply</button>
  `,
  styles: [],
})
export class CommentActionsComponent implements OnInit {

  @Input() content: string;

  constructor() {
  }

  edit() {

  }
  reply() {

  }

  ngOnInit() {

  }

}


