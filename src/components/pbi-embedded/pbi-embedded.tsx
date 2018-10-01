import { Component, Prop, State } from "@stencil/core";
import pbi from "powerbi-client";

const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory
);

interface ComponentState {
  type: string;
  [key: string]: any;
}

@Component({
  tag: "pbi-embedded",
  styleUrl: "pbi-embedded.css",
  shadow: true
})
export class PbiEmbedded {
  private rootElement: HTMLElement;
  private embeddedElement: pbi.Embed;

  @State()
  state: ComponentState;

  @Prop()
  id: string;
  @Prop()
  embedUrl: string;
  @Prop()
  accessToken: string;
  @Prop()
  filterPaneEnabled: boolean = false;
  @Prop()
  navContentPaneEnabled: boolean = false;
  @Prop()
  mobile: boolean = false;
  @Prop()
  pageName: string = "";
  @Prop()
  onEmbedded: (embeddedEl: any) => void;

  constructor() {
    this.state = {
      type: "report"
    };
  }

  componentWillLoad() {
    this.updateState();
  }

  componentDidLoad() {
    if (this.validateConfig(this.state)) {
      this.embed(this.state);
    }
  }

  componentDidUpdate() {
    if (this.validateConfig(this.state)) {
      this.embed(this.state);
    }
  }

  embed(config) {
    this.embeddedElement = powerbi.embed(this.rootElement, config);
    if (this.onEmbedded) {
      this.onEmbedded(this.embeddedElement);
    }
    return this.embeddedElement;
  }

  updateState() {
    const props = this.getProps();
    const nextState = Object.assign({}, this.state, props, {
      pageName: this.pageName,
      settings: {
        filterPaneEnabled: this.filterPaneEnabled,
        navContentPaneEnabled: this.navContentPaneEnabled,
        layoutType: this.mobile
          ? pbi.models.LayoutType.MobilePortrait
          : undefined
      }
    });

    // delete nextState.onEmbedded;
    this.state = nextState;
  }

  getProps() {
    return {
      id: this.id,
      embedUrl: this.embedUrl,
      accessToken: this.accessToken,
      filterPaneEnabled: this.filterPaneEnabled,
      navContentPaneEnabled: this.navContentPaneEnabled,
      pageName: this.pageName
    };
  }

  validateConfig(config) {
    const errors = pbi.models.validateReportLoad(config);
    console.log("config validation error", errors || "none");
    return errors === undefined;
  }

  render() {
    // console.log(this.prop);
    return (
      <div
        class="powerbi-frame"
        ref={el => {
          this.rootElement = el;
        }}
      />
    );
  }
}

/*

id={`${YOUR_REPORT_ID}`}
embedUrl={`${YOUR_EMBED_URL}`}
accessToken={`${YOUR_EMBED_TOKEN}`}
filterPaneEnabled={false}
navContentPaneEnabled={false}
*/
