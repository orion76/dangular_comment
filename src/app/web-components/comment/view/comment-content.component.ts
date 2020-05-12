import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'comment-content',
  template: `
    <div [innerHTML]="content" ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentContentComponent implements OnInit {

  @Input() content: string;

  constructor() {
  }

  ngOnInit() {

  }

}


