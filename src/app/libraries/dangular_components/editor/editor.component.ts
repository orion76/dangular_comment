import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {EDITOR_SERVICE, EEditorMode, IButton, IEditorService, IFormatService} from '@dangular-components/editor/types';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {EDITOR_FORMAT_SERVICE, FormatService} from '@dangular-components/editor/format.service';


@Component({
  selector: 'editor',
  template: `
    <div class="editor__toolbar editor-toolbar">
      <button *ngFor="let button of buttons"
              (click)="executeCommand(button.command)"
              [ngClass]="setActiveClass(button)"
              class="editor-toolbar__button"

      >{{button.label}}</button>
    </div>
    <div #textArea class="editor__textarea"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => EditorComponent), multi: true}
  ]
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input() placeholder: string;

  buttons: IButton[] = [
    {label: 'B', command: 'bold'},
    {label: 'I', command: 'italic'},
    {label: 'Q', command: 'blockquote'},
  ];
  onModelChange: (value) => void;
  onTouched: () => void;
  onChange = new EventEmitter<string>();
  isFocus$ = new EventEmitter<boolean>();
  isBlur$ = new EventEmitter<boolean>();
  selection$ = new BehaviorSubject<Range>(null);

  @ViewChild('textArea', {static: true}) textArea: ElementRef;

  dispatchListeners = [];

  constructor(@Inject(EDITOR_SERVICE) private service: IEditorService,
              @Inject(EDITOR_FORMAT_SERVICE) private format: IFormatService,
              private renderer: Renderer2,
              private cdr: ChangeDetectorRef
  ) {
  }

  setActiveClass(button: IButton) {
    return {['editor-toolbar__button-active']: button.active};
  }

  ngOnInit() {
    this.eventsSubscribe();
  }

  ngOnDestroy(): void {
    this.eventsUnSubscribe();
  }

  eventsSubscribe() {
    this.dispatchListeners.push(
      this.renderer.listen(this.textArea.nativeElement, 'focus', (event) => this.isFocus$.emit(true))
    );
    this.dispatchListeners.push(
      this.renderer.listen(this.textArea.nativeElement, 'blur', (event) => this.isBlur$.emit(true))
    );

    this.dispatchListeners.push(
      this.renderer.listen(this.textArea.nativeElement, 'click', (event) => this.onTextareaClick(event))
    );

    this.dispatchListeners.push(
      this.renderer.listen(this.textArea.nativeElement, 'input', (event) => {

        const content = this.textArea.nativeElement.innerHTML;
        this.onChange.emit(content);
        this.onModelChange(content);
      })
    );

  }

  getContent() {
    return this.textArea.nativeElement.innerHTML;
  }

  eventsUnSubscribe() {
    this.dispatchListeners.forEach((callback) => callback());
  }


  onTextareaClick(event: MouseEvent) {
    const buttons = this.format.getActiveButtons(event.target as Node, this.textArea.nativeElement);
    const activate = [];
    const deactivate = [];
    this.buttons.forEach((button) => {
      if (buttons.includes(button.command)) {
        if (!button.active) {
          activate.push(button);
        }
      } else {
        if (button.active) {
          deactivate.push(button);
        }
      }
    });


    if (activate.length > 0) {
      activate.forEach((button) => button.active = true);

    }
    if (deactivate.length > 0) {
      deactivate.forEach((button) => button.active = false);

    }
    if (activate.length > 0 || deactivate.length > 0) {
      this.cdr.detectChanges();
    }

  }


  getButton(command: string): IButton {
    const index = this.buttons.findIndex((button) => button.command === command);
    return this.buttons[index];
  }

  executeCommand(command: string) {

    const button = this.getButton(command);
    const range: Range = this.service.getRange();
    if (!button.active) {
      this.format.setFormat(command, range, this.textArea.nativeElement);
    } else {
      this.format.deleteFormat(command, range, this.textArea.nativeElement);
    }

    button.active = !button.active;
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.service.initTextarea(this.textArea.nativeElement);
    this.service.setMode(EEditorMode.EDIT);
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    const mode: EEditorMode = isDisabled ? EEditorMode.VIEW : EEditorMode.EDIT;
    this.service.setMode(mode);
  }

  writeValue(value: any): void {
    this.textArea.nativeElement.innerHTML = value;
  }

}


@NgModule({
  imports: [CommonModule],
  exports: [EditorComponent],
  declarations: [EditorComponent],
  providers: [{provide: EDITOR_FORMAT_SERVICE, useClass: FormatService}],
})
export class EditorModule {
}
