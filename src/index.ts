import { FSA } from "flux-standard-action";
import { Middleware } from "redux";

export interface HtmlMetaData {
  title: string;
  metaTags: {
    [name: string]: string;
  };
  links: {
    [rel: string]: string;
  }
}

export interface HtmlMetaDataChangeAction extends FSA<HtmlMetaData> {
  type: "HtmlMetaDataChange";
  payload: HtmlMetaData;
}

export const changeMetaData = (payload: HtmlMetaData): HtmlMetaDataChangeAction => ({
  type: "HtmlMetaDataChange",
  payload
});

export const htmlMetaData = <InputAction extends FSA<any>>(
  {
    input,
    mapper
  }: {
    input: InputAction["type"];
      mapper: (payload: InputAction["payload"]) => HtmlMetaData;
  }
): Middleware =>
  api => next => (action: InputAction) => {
    const result = next(action);

    if(action.type === input) {
      api.dispatch({
        type: "HtmlMetaDataChange",
        payload: mapper(action.payload)
      });
    }

    return result;
  };

/**
 * Create a client which applies meta data changes in a specific environment:
 * - Client-side code running in the browser might want to update the document.title after route changes
 * - Server-side code might want to store the latest meta data values for server-side rendering
 */
export const htmlMetaDataClient = (
  {
    applyMetaData
  }: {
    applyMetaData: (metaData: HtmlMetaData) => void;
  }
): Middleware =>
  api => next => (action: HtmlMetaDataChangeAction) => {
    const result = next(action);
    if (action.type === "HtmlMetaDataChange" && !action.error) {
      applyMetaData(action.payload);
    }
    return result;
  };
