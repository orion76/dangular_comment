import {EventEmitter, Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {EEditorMode, ICommand, IEditorService} from '@dangular-components/editor/types';
import {createRange} from '@dangular-components/editor/utils';
import {DOCUMENT} from '@angular/common';


const commands: Record<string, any> = {
  bold: {actions: [{id: 'bold'}]},
  italic: {actions: [{id: 'italic'}]},
  blockquote: {actions: [{id: 'formatBlock', argument: 'tag'}], data: {tag: 'blockquote'}},
};


@Injectable()
export class EditorService implements IEditorService {

  textarea: HTMLElement;

  mode: EEditorMode;
  onChange = new EventEmitter<string>();
  private renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument) {


  }

  executeCommand(commandId: string) {
    const command = commands[commandId];
    command.actions.forEach((action: ICommand) => {
      const argument = action.argument ? command.data[action.argument] : null;
      this.document.execCommand(action.id, false, argument);
    });
  }

  getRange(): Range {
    const selection = this.document.getSelection();
    const range = selection.getRangeAt(0);
    return range;
  }

  initTextarea(textarea: HTMLElement) {
    this.textarea = textarea;
  }

  setContent(content: string) {
    this.textarea.innerHTML = content;
  }

  setMode(mode: EEditorMode) {
    this.mode = mode;
    switch (mode) {
      case EEditorMode.EDIT:
        this.textarea.contentEditable = 'true';
        break;
      case EEditorMode.VIEW:
        this.textarea.contentEditable = 'false';
        break;
    }
  }

  select(index: number, length: number) {
    const range = createRange(this.textarea, index, index + length);
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }


  setCursor(start = 0) {
    const range = createRange(this.textarea, start);
    const selection = document.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

}


