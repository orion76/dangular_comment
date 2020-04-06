import {NgModule} from '@angular/core';

import {TextSelectionDirective} from '@dangular-components/text-selection/text-selection.directive';
import {CommonModule} from '@angular/common';
import {TextSelectionService} from '@dangular-components/text-selection/text-selection.service';
import {TEXT_SELECTION_SERVICE} from '@dangular-components/text-selection/types';

@NgModule({
  imports: [CommonModule],
  exports: [TextSelectionDirective],
  declarations: [TextSelectionDirective],
  providers: [
    {provide: TEXT_SELECTION_SERVICE, useClass: TextSelectionService}
  ],
})
export class TextSelectionModule {
}
