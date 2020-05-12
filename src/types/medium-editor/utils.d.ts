export interface Util {

  // http://stackoverflow.com/questions/17907445/how-to-detect-ie11#comment30165888_17907562
  // by rg89
  isIE: boolean;

  isEdge: boolean;

  // if firefox
  isFF: boolean;

  // http://stackoverflow.com/a/11752084/569101
  isMac: boolean;

  // https://github.com/jashkenas/underscore
  // Lonely letter MUST USE the uppercase code
  keyCode: Record<string, number>
  blockContainerElementNames: [
    // elements our editor generates
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'ul', 'li', 'ol',
    // all other known block elements
    'address', 'article', 'aside', 'audio', 'canvas', 'dd', 'dl', 'dt', 'fieldset',
    'figcaption', 'figure', 'footer', 'form', 'header', 'hgroup', 'main', 'nav',
    'noscript', 'output', 'section', 'video',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'
  ];
  emptyElementNames: ['br', 'col', 'colgroup', 'hr', 'img', 'input', 'source', 'wbr'];

  /**
   * Returns true if it's metaKey on Mac, or ctrlKey on non-Mac.
   * See #591
   */
  isMetaCtrlKey(event): boolean;

  /**
   * Returns true if the key associated to the event is inside keys array
   *
   * @see : https://github.com/jquery/jquery/blob/0705be475092aede1eddae01319ec931fb9c65fc/src/event.js#L473-L484
   * @see : http://stackoverflow.com/q/4471582/569101
   */
  isKey(event, keys): boolean;

  getKeyCode(event: KeyboardEvent): number;

  extend<T>(...arguments: any[]): T;

  defaults<T>(...arguments: any[]): T;

  /*
   * Create a link around the provided text nodes which must be adjacent to each other and all be
   * descendants of the same closest block container. If the preconditions are not met, unexpected
   * behavior will result.
   */
  createLink(document: HTMLDocument, textNodes: HTMLElement[], href: string, target: string): HTMLAnchorElement;

  /*
   * Given the provided match in the format {start: 1, end: 2} where start and end are indices into the
   * textContent of the provided element argument, modify the DOM inside element to ensure that the text
   * identified by the provided match can be returned as text nodes that contain exactly that text, without
   * any additional text at the beginning or end of the returned array of adjacent text nodes.
   *
   * The only DOM manipulation performed by this function is splitting the text nodes, non-text nodes are
   * not affected in any way.
   */
  findOrCreateMatchingTextNodes(document: HTMLDocument, element: HTMLElement, match: { start: number, end: number }): HTMLElement[];

  /*
   * Given the provided text node and text coordinates, split the text node if needed to make it align
   * precisely with the coordinates.
   *
   * This function is intended to be called from Util.findOrCreateMatchingTextNodes.
   */
  splitStartNodeIfNeeded(currentNode: Text, matchStartIndex: number, currentTextIndex: number): Text;

  /*
   * Given the provided text node and text coordinates, split the text node if needed to make it align
   * precisely with the coordinates. The newNode argument should from the result of Util.splitStartNodeIfNeeded,
   * if that function has been called on the same currentNode.
   *
   * This function is intended to be called from Util.findOrCreateMatchingTextNodes.
   */
  splitEndNodeIfNeeded(currentNode: Text, newNode: Text, matchEndIndex: number, currentTextIndex: number): void;

  /*
  * Take an element, and break up all of its text content into unique pieces such that:
   * 1) All text content of the elements are in separate blocks. No piece of text content should span
   *    across multiple blocks. This means no element return by this function should have
   *    any blocks as children.
   * 2) The union of the textcontent of all of the elements returned here covers all
   *    of the text within the element.
   *
   *
   * EXAMPLE:
   * In the event that we have something like:
   *
   * <blockquote>
   *   <p>Some Text</p>
   *   <ol>
   *     <li>List Item 1</li>
   *     <li>List Item 2</li>
   *   </ol>
   * </blockquote>
   *
   * This function would return these elements as an array:
   *   [ <p>Some Text</p>, <li>List Item 1</li>, <li>List Item 2</li> ]
   *
   * Since the <blockquote> and <ol> elements contain blocks within them they are not returned.
   * Since the <p> and <li>'s don't contain block elements and cover all the text content of the
   * <blockquote> container, they are the elements returned.
   */
  splitByBlockElements(element: HTMLElement): HTMLElement[];

  // Find the next node in the DOM tree that represents any text that is being
  // displayed directly next to the targetNode (passed as an argument)
  // Text that appears directly next to the current node can be:
  //  - A sibling text node
  //  - A descendant of a sibling element
  //  - A sibling text node of an ancestor
  //  - A descendant of a sibling element of an ancestor
  findAdjacentTextNodeWithContentfindAdjacentTextNodeWithContent(rootNode: Node, targetNode: Node, ownerDocument: HTMLDocument);

  // Find an element's previous sibling within a medium-editor element
  // If one doesn't exist, find the closest ancestor's previous sibling
  findPreviousSibling(node: Node): ChildNode;

  isDescendantisDescendant(parent: Node, child: Node, checkEquality): boolean;

  // https://github.com/jashkenas/underscore
  isElementisElement(obj: Node): boolean;

  // https://github.com/jashkenas/underscore
  throttle(func: Function, wait: number): Function;

  traverseUp(current: Node, testElementFunction: Function): Node | false;

  htmlEntities(str: string): string;

  // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div
  insertHTMLCommand(doc: HTMLDocument, html: string): boolean;

  execFormatBlock(doc: HTMLDocument, tagName: string): boolean;

  /**
   * Set target to blank on the given el element
   *
   * TODO: not sure if this should be here
   *
   * When creating a link (using core -> createLink) the selection returned by Firefox will be the parent of the created link
   * instead of the created link itself (as it is for Chrome for example), so we retrieve all "a" children to grab the good one by
   * using `anchorUrl` to ensure that we are adding target="_blank" on the good one.
   * This isn't a bulletproof solution anyway ..
   */
  setTargetBlank(el: HTMLAnchorElement, anchorUrl: string): void;

  /*
   * this function is called to explicitly remove the target='_blank' as FF holds on to _blank value even
   * after unchecking the checkbox on anchor form
   */
  removeTargetBlank(el: HTMLAnchorElement, anchorUrl: string);

  /*
   * this function adds one or several classes on an a element.
   * if el parameter is not an a, it will look for a children of el.
   * if no a children are found, it will look for the a parent.
   */
  addClassToAnchors(el: HTMLAnchorElement, buttonClass: string);

  isListItem(node: Node): boolean;

  cleanListDOM(ownerDocument: HTMLDocument, element: HTMLElement);

  /* splitDOMTree
   *
   * Given a root element some descendant element, split the root element
   * into its own element containing the descendant element and all elements
   * on the left or right side of the descendant ('right' is default)
   *
   * example:
   *
   *         <div>
   *      /    |   \
   *  <span> <span> <span>
   *   / \    / \    / \
   *  1   2  3   4  5   6
   *
   *  If I wanted to split this tree given the <div> as the root and "4" as the leaf
   *  the result would be (the prime ' marks indicates nodes that are created as clones):
   *
   *   SPLITTING OFF 'RIGHT' TREE       SPLITTING OFF 'LEFT' TREE
   *
   *     <div>            <div>'              <div>'      <div>
   *      / \              / \                 / \          |
   * <span> <span>   <span>' <span>       <span> <span>   <span>
   *   / \    |        |      / \           /\     /\       /\
   *  1   2   3        4     5   6         1  2   3  4     5  6
   *
   *  The above example represents splitting off the 'right' or 'left' part of a tree, where
   *  the <div>' would be returned as an element not appended to the DOM, and the <div>
   *  would remain in place where it was
   *
  */
  splitOffDOMTree(rootNode: Node, leafNode: Node, splitLeft: true): Node;

  moveTextRangeIntoElement(startNode: Node, endNode: Node, newElement: HTMLElement): boolean;

  /* based on http://stackoverflow.com/a/6183069 */
  depthOfNode(inNode: Node): number;

  findCommonRoot(inNode1: Node, inNode2: Node): Node;

  /* END - based on http://stackoverflow.com/a/6183069 */

  isElementAtBeginningOfBlock(node: Node): boolean;

  isMediumEditorElement(element: HTMLElement): boolean;

  getContainerEditorElement(element: HTMLElement): HTMLElement;

  isBlockContainer(element: HTMLElement): boolean;

  /* Finds the closest ancestor which is a block container element
   * If element is within editor element but not within any other block element,
   * the editor element is returned
   */
  getClosestBlockContainer(node: Node): Node;

  /* Finds highest level ancestor element which is a block container element
   * If element is within editor element but not within any other block element,
   * the editor element is returned
   */
  getTopBlockContainer(element: HTMLElement): HTMLElement;

  getFirstSelectableLeafNode(element: HTMLElement): HTMLElement;

  // TODO: remove getFirstTextNode AND _getFirstTextNode when jumping in 6.0.0 (no code references)
  getFirstTextNode(element: HTMLElement): HTMLElement;

  ensureUrlHasProtocol(url: string): string;

  cleanupAttrs(el: HTMLElement, attrs: string[]);

  cleanupTags(el: HTMLElement, tags: string[]);

  unwrapTags(el: HTMLElement, tags: string[]);

  // get the closest parent
  getClosestTag(el: HTMLElement, tag: string): HTMLElement;

  unwrap(el: HTMLElement, doc: HTMLDocument);

  guid(): string;

}


