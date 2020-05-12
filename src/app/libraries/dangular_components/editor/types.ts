import {InjectionToken, Renderer2} from '@angular/core';

export const EDITOR_SERVICE = new InjectionToken<IEditorService>('EDITOR_SERVICE');

export enum EEditorMode {
  EDIT, VIEW
}

export interface IBlockWrapperData {
  tag: string;
}

export interface IPluginConstructor {
  new(config: ICommandConfig, root: Node, renderer: Renderer2);
}

export interface IPlugin {
  readonly  id: string;

  hasFormat(node: Node): boolean;

  setFormat(range: Range);

  deleteFormat(range: Range);
}

export interface ICommand {
  id: string;
  argument?: string;
}

export interface ICommandConfig {
  id: string;
  label: string;
  description: string;
  plugin: IPluginConstructor;
  config: any;
}

export interface IFormatService {
  getActiveButtons(node: Node, root: Node): string[];

  setFormat(id: string, range: Range, root: Node);

  deleteFormat(id: string, range: Range, root: Node);
}

export interface IEditorService {

  getRange():Range;

  setCursor(index?: number);

  executeCommand(commandId: string);

  select(index: number, length: number);

  initTextarea(textarea: HTMLElement);

  setContent(content: string);

  setMode(mode: EEditorMode);
}

export interface IRangeNode {
  node: Node;
  offset: number;
}

export interface IButton {
  label: string;
  command: string;
  active?: boolean
}
