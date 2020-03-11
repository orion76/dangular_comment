import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {IEntityComment} from './types';
import {Observable} from 'rxjs';
import {COMMENT_SERVICE, ICommentService} from '../services/types';
import {IUserService, USER_SERVICE} from '../services/user/types';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'comment-list',
  template: `
    <comment-form *ngIf="addNew"
                  mode="create"
                  [parentId]="parentId"
    ></comment-form>
    <comment *ngFor="let comment of items$|async; trackBy:trackByCommentId " [comment]="comment"></comment>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent implements OnInit {
  addNew: boolean;
  @Input() entity_type: string;
  @Input() entity_id: string;

  @Input() parentId: string;


  items$: Observable<IEntityComment[]>;

  constructor(@Inject(USER_SERVICE) private user: IUserService, private cdr: ChangeDetectorRef,
              @Inject(COMMENT_SERVICE) private service: ICommentService) {
  }

  trackByCommentId(index: number, comment: IEntityComment): string {
    return comment.id;
  }

  ngOnInit() {
    if (!this.parentId && this.entity_id) {
      if (!this.entity_id) {
        console.error('Missing parentId and entity_id');
      }
      this.parentId = this.entity_id;
    }

    this.items$ = this.service.getSiblings(this.parentId).pipe(
      tap((data)=>{

    }));
    this.initEntity();
    this.initList();
  }

  initList() {
    // this.items$ = this.service.onListChange(this.parent.id);
  }


  initEntity() {
    if (this.entity_id) {
      const entity = {id: this.entity_id, type: this.entity_type};

      this.service.setEntity(entity);
      // this.parent = entity;
      this.addNew = true;
    }
  }

}
