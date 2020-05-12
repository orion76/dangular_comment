import {Inject, ModuleWithProviders, NgModule, Pipe, PipeTransform} from '@angular/core';
import {ITranslateData, ITranslateService, TRANSLATE_DATA, TRANSLATE_SERVICE} from '@dangular-common/translate/types';
import {TranslateService} from '@dangular-common/translate/translate.service';


@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(@Inject(TRANSLATE_SERVICE) private service: ITranslateService) {

  }

  transform(value: string): string {
    return value ? this.service.translate(value) : null;
  }
}


@NgModule({
  imports: [],
  exports: [TranslatePipe],
  declarations: [TranslatePipe],
  providers: [],
})
export class TranslateModule {
  static forRoot(data: ITranslateData[]): ModuleWithProviders<TranslateModule> {
    return {
      ngModule: TranslateModule, providers: [
        {provide: TRANSLATE_DATA, useValue: data},
        {provide: TRANSLATE_SERVICE, useClass: TranslateService},
      ]
    };
  }

}
