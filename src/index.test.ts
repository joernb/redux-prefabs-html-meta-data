import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from "redux";
import { FSA } from "flux-standard-action";
import { htmlMetaData, HtmlMetaDataChangeAction } from "./index";

interface FooAction extends FSA<void> {
  type: "Foo";
}

const fooAction: FooAction = {
  type: "Foo"
};

const sampleMetaData = {
  title: "Foo",
  metaTags: {},
  links: {}
};

const htmlMetaDataChangeAction: HtmlMetaDataChangeAction = {
  type: "HtmlMetaDataChange",
  payload: sampleMetaData
};

describe("htmlMetaData", () => {
  let api: MiddlewareAPI<Dispatch<AnyAction>, {}>;
  let next: Dispatch<AnyAction>;

  beforeEach(() => {
    api = {
      dispatch: jest.fn(),
      getState: jest.fn()
    };
    next = jest.fn();
  });

  it("should emit HtmlMetaDataChangeAction", () => {
    const actionHandler = htmlMetaData<FooAction>({
      input: "Foo",
      mapper: () => sampleMetaData
    })(api)(next);
    actionHandler(fooAction);

    expect(api.dispatch).toHaveBeenCalledTimes(1);
    expect(api.dispatch).toHaveBeenNthCalledWith(1, htmlMetaDataChangeAction);
  });
});
