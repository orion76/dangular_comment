import {Action} from '@ngrx/store';

export class Scenario {
  actions: string[];


  constructor(actions: string[] = [], private exclude: string[]) {
    this.actions = [...actions];
  }

  expectedAction() {
    return this.actions.shift();
  }

  isExclude(action: Action) {
    return this.exclude.findIndex((item) => item === action.type) > -1;
  }

  checkAction(action: Action, state: any) {

    if (this.isExclude(action)) {
      return;
    }
    if (action.type === this.expectedAction()) {
      console.log('[action]', action.type, {action, state});
    } else {
      console.error('[action]', action.type, {action, state});
    }
  }

}
