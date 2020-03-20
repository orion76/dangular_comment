import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {COMMENT_SERVICE, ICommentService} from '../services/types';

@Component({
  selector: 'comment-list',
  template: `
    <comment *ngFor="let comment_id of items$|async; trackBy:trackByCommentId " [comment_id]="comment_id" class="comment"></comment>

  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent implements OnInit {
  @Input() parent_id: string;

  items$: Observable<string[]>;

  constructor(@Inject(COMMENT_SERVICE) private service: ICommentService,
              private cdr: ChangeDetectorRef) {
  }


  trackByCommentId(index: number, commentId: string): string {
    return commentId;
  }

  ngOnInit() {
    this.items$ = this.service.getChildren(this.parent_id);

    this.cdr.detectChanges();
  }


}
