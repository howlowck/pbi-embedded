import { Component, Prop, State } from "@stencil/core";
import * as pbi from "powerbi-client";

// const powerbi = new pbi.service.Service(
//   pbi.factories.hpmFactory,
//   pbi.factories.wpmpFactory,
//   pbi.factories.routerFactory
// );

interface ComponentState {}

@Component({
  tag: "pbi-embedded",
  styleUrl: "pbi-embedded.css",
  shadow: true
})
export class PbiEmbedded {
  rootElement: HTMLElement;

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

  constructor() {}

  updateState() {
    const props = this.getProps();
    const nextState = Object.assign({}, this.state, props, {
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
      navContentPaneEnabled: this.navContentPaneEnabled
    };
  }

  validateConfig(config) {
    const errors = pbi.models.validateReportLoad(config);
    console.log("error", errors);
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
