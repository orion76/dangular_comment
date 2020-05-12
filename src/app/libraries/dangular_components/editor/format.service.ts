import {Injectable, InjectionToken, Renderer2, RendererFactory2} from '@angular/core';
import {ICommandConfig, IFormatService, IPlugin} from '@dangular-components/editor/types';
import {blockWrapper} from '@dangular-components/editor/plugins/blockWrapper';

export const EDITOR_BUTTONS = new InjectionToken<string[]>('EDITOR_BUTTONS');
export const EDITOR_FORMAT_SERVICE = new InjectionToken<string[]>('EDITOR_FORMAT_SERVICE');

export const commands: ICommandConfig[] = [
  {id: 'bold', label: 'B', description: 'Bold', plugin: blockWrapper, config: {tag: 'strong'}},
  {id: 'italic', label: 'I', description: 'Bold', plugin: blockWrapper, config: {tag: 'i'}},
  {id: 'blockquote', label: 'Q', description: 'Blockquote', plugin: blockWrapper, config: {tag: 'blockquote'}},
];

@Injectable()
export class FormatService implements IFormatService {

  plugins: Record<string, IPlugin> = {};
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  getConfig(id: string) {
    const index = commands.findIndex((config) => config.id === id);
    if (index > -1) {
      return commands[index];
    }
  }

  setFormat(id: string, range: Range, root: Node) {
    const config = this.getConfig(id);
    const plugin = this.getPlugin(config, root, this.renderer);
    plugin.setFormat(range);
  }

  deleteFormat(id: string, range: Range, root: Node) {
    const config = this.getConfig(id);
    const plugin = this.getPlugin(config, root, this.renderer);
    plugin.deleteFormat(range);
  }

  getActiveButtons(node: Node, root: Node): string[] {
    return Array.from(
      commands.reduce((acc, config) => {
        const plugin = this.getPlugin(config, root, this.renderer);
        return plugin.hasFormat(node) ? acc.add(plugin.id) : acc;
      }, new Set<string>())
    );
  }

  protected createPlugin<T>(config: ICommandConfig, root: Node, renderer: Renderer2): IPlugin {
    const plugin: IPlugin = new config.plugin(config, root, renderer);

    return plugin;
  }

  protected getPlugin<T>(config: ICommandConfig, root: Node, renderer: Renderer2) {
    const {id} = config;
    if (!this.plugins[id]) {
      this.plugins[id] = this.createPlugin(config, root, renderer);
    }
    return this.plugins[id];
  }
}
