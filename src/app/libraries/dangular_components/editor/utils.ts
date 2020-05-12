import {IRangeNode} from '@dangular-components/editor/types';
import {Renderer2} from '@angular/core';


function getRangeByOffset(root: Node, length = 0): IRangeNode {

  let rangeNode: IRangeNode = {node: root, offset: length};
  let child: Node;

  for (var lp = 0; lp < root.childNodes.length; lp++) {
    child = root.childNodes[lp];

    if (child.textContent.length >= length) {
      if (child.nodeType === Node.TEXT_NODE) {
        rangeNode = {node: child, offset: length};
      } else {
        rangeNode = getRangeByOffset(child, length);
      }
      break;
    }
    length -= child.textContent.length;
  }
  return rangeNode;
}

export function createRange(node: Node, startIndex = 0, endIndex = 0) {

  const range: Range = document.createRange();
  const start: IRangeNode = getRangeByOffset(node, startIndex);
  range.selectNode(start.node);
  range.setStart(start.node, start.offset);


  if (endIndex === 0) {
    range.setEnd(start.node, start.offset);
    return range;
  }

  if (node.textContent.length <= endIndex) {
    range.setEnd(node, node.textContent.length);
    return range;
  }

  if (node.nodeType === Node.TEXT_NODE) {
    range.setEnd(node, endIndex);
    return range;
  }

  const lastNode = getRangeByOffset(node, endIndex);

  range.setEnd(lastNode.node, lastNode.offset);
  return range;

}
export function wrapNode(parent:Node,wrapper: HTMLElement, node: HTMLElement) {
  parent.insertBefore(wrapper, parent.firstChild);
  wrapper.appendChild(node);
}
