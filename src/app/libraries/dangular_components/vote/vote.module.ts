import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VOTE_SERVICE} from './types';
import {VoteService} from './vote.service';
import {VoteUpDownComponent} from './updown.component';


@NgModule({
  imports: [
    CommonModule,
    // StoreModule.forFeature('voteState', {voteState: reducer})
  ],
  exports: [VoteUpDownComponent],
  declarations: [VoteUpDownComponent],
  providers: [{provide: VOTE_SERVICE, useClass: VoteService}],
})
export class VoteUpDownModule {
}
