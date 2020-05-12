import {Renderer2} from '@angular/core';
import {ICommandConfig, IPlugin} from '@dangular-components/editor/types';

export class blockWrapper implements IPlugin {
  constructor(public config: ICommandConfig, public root: Node, public renderer: Renderer2) {

  }

  get id(): string {
    return this.config.id;
  }

  get tag(): string {
    return this.config.config.tag.toUpperCase();
  }

  hasFormat(node: Node): boolean {
    return node.nodeName === this.tag;
  }


  deleteFormat(range: Range) {
    let current = range.startContainer;
    let node: Node;
    while (!node && current.parentNode !== this.root) {
      if (current.nodeName === this.tag) {
        node = current;
      } else {
        current = current.parentNode;
      }
    }

    if (node) {
      const parent = node.parentNode;
      node.childNodes.forEach((child: Node) => parent.insertBefore(child, node));
      parent.removeChild(node);
      parent.normalize();
    }
  }

  setFormat(range: Range) {
    if (!range.collapsed) {
      const wrapper: HTMLElement = this.renderer.createElement(this.tag);
      range.surroundContents(wrapper);
    }
  }

}

