import {Component, Inject, Input, NgModule, OnInit} from '@angular/core';
import {ICommentState} from '../state/comment_state';
import {combineLatest, Observable} from 'rxjs';
import {COMMENT_FORM_SERVICE, COMMENT_SERVICE, COMMENT_STATE_SERVICE, ICommentFormService, ICommentService, ICommentStateService} from '../services/types';
import {TimerModule, UTimerUpDown} from '@dangular-components/timer/timer.component';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@dangular-common/translate/translate.pipe';
import {map} from 'rxjs/operators';


export interface IActionTimer {
  start: number;
  end: number;
  type: UTimerUpDown;
  onComplete: any;
}

export interface ICommentActionData {
  formEditId: number;
  formReplyId: number;
}

export interface ICommentAction {
  label: string;
  name: string;
  command?: any;
  timer?: IActionTimer;
  suffix?: string;
  visible?: boolean;
  disabled?: boolean;
  data?: any;
}

export interface ICommentFormsState {
  isFormReplyOpen: boolean;
  isFormEditOpen: boolean
}

@Component({
  selector: 'comment-action',
  template: `
    <button (click)="action.command()"
            [attr.disabled]="action.disabled"
            class="comment-actions__button">

      <time-counter *ngIf="action.timer" [timer]="action.timer"></time-counter>
      {{action.label|translate}}
      <ng-container *ngIf="action.suffix">{{action.suffix}}</ng-container>
    </button>
  `,
  styles: [],
})
export class CommentActionComponent {
  @Input() action: ICommentAction;
}


@Component({
  selector: 'comment-actions',
  template: `
    <!-- ACTIONS -->
    <comment-action *ngFor="let action of actions$|async" [action]="action"></comment-action>
  `,
  styles: [],
})
export class CommentActionsComponent implements OnInit {

  @Input() comment_id: string;
  @Input() data: ICommentActionData;

  isFormReplyOpen$: Observable<boolean>;
  isFormEditOpen$: Observable<boolean>;

  actions: ICommentAction[] = [
    {name: 'edit', label: 'edit', command: () => this.form.openForm(this.data.formEditId)},
    {name: 'reply', label: 'reply', command: () => this.form.openForm(this.data.formReplyId)},
    {name: 'collapse', label: 'collapse', command: this.Collapse.bind(this)},
    {name: 'expand', label: 'expand', command: this.Expand.bind(this)},
  ];

  actions$: Observable<ICommentAction[]>;

  constructor(
    @Inject(COMMENT_SERVICE) private commentService: ICommentService,
    @Inject(COMMENT_STATE_SERVICE) private stateService: ICommentStateService,
    @Inject(COMMENT_FORM_SERVICE) private form: ICommentFormService,
  ) {
  }

  ngOnInit() {

    this.isFormEditOpen$ = this.form.onFormOpen(this.data.formEditId).pipe();
    this.isFormReplyOpen$ = this.form.onFormOpen(this.data.formReplyId).pipe();

    this.actions$ = combineLatest([
      this.stateService.getCommentState(this.comment_id),
      this.isFormReplyOpen$,
      this.isFormEditOpen$
    ]).pipe(
      map(([state, isFormReplyOpen, isFormEditOpen]) => this.actionsUpdate(state, {isFormReplyOpen, isFormEditOpen}))
    );


  }

  actionsUpdate(state: ICommentState, formState: ICommentFormsState): ICommentAction[] {
    return this.actions
      .map((action) => {
        switch (action.name) {
          case 'edit':
            action.visible = state.editable && !formState.isFormEditOpen;
            break;
          case 'reply':
            action.visible = state.can_reply && !formState.isFormReplyOpen;
            break;
          case 'collapse':
            action.visible = state.expanded;
            action.suffix = `(${state.child_count})`;
            break;
          case 'expand':
            action.visible = state.child_count > 0 && !state.expanded;
            action.suffix = `(${state.child_count})`;
            break;
        }
        return action;
      })
      .filter((action) => action.visible);

  }


  Expand() {
    this.commentService.nodeExpand({id: this.comment_id});
  }

  Collapse() {
    this.commentService.nodeCollapse({id: this.comment_id});
  }
}

@NgModule({
  imports: [
    CommonModule,
    TimerModule,
    TranslateModule,
  ],
  exports: [
    CommentActionsComponent,
  ],
  declarations: [
    CommentActionComponent,
    CommentActionsComponent,
  ],
  providers: [],
})
export class CommentActionsModule {
}
