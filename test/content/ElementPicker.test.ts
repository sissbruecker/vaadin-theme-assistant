import { expect } from "@esm-bundle/chai";
import { fixture, html } from "@open-wc/testing";
import { ElementPicker } from "../../src/content/ElementPicker";
import {
  Message,
  MessageType,
  PickElementMessage,
} from "../../src/shared/messages";
import {
  DatePickerToggleButtonSnapshotTest,
  ElementPickerSnapshotTest,
} from "./snapshots";
import { clickElementWithClientPosition, MockPort, mockPort } from "./utils";

describe("ElementPicker", () => {
  let elementPicker: ElementPicker;
  let portMock: MockPort;

  beforeEach(() => {
    portMock = mockPort();
    elementPicker = new ElementPicker(portMock as any);
  });

  afterEach(() => {
    elementPicker.cancel();
  });

  describe("pick element", () => {
    let el: HTMLElement;

    beforeEach(async () => {
      el = await fixture(html` <span>Test</span> `);
    });

    it("should send pick element message on click", () => {
      elementPicker.start();
      clickElementWithClientPosition(el);

      expect(portMock.postMessage.calledOnce).to.be.true;
      const message = portMock.postMessage.args[0][0] as Message;
      expect(message.type).to.equal(MessageType.PickElement);
    });

    it("should not pick elements if it is not started", () => {
      clickElementWithClientPosition(el);

      expect(portMock.postMessage.called).to.be.false;
    });

    it("should not pick elements after it is canceled", () => {
      elementPicker.start();
      elementPicker.cancel();
      clickElementWithClientPosition(el);

      expect(portMock.postMessage.called).to.be.false;
    });

    it("should stop picking after click", () => {
      elementPicker.start();
      clickElementWithClientPosition(el);
      clickElementWithClientPosition(el);
      clickElementWithClientPosition(el);

      expect(portMock.postMessage.calledOnce).to.be.true;
    });

    it("should increase pick ref with each pick", () => {
      elementPicker.start();
      clickElementWithClientPosition(el);
      let pickElementMessage = portMock.postMessage.lastCall.args[0];
      expect(pickElementMessage.payload.pickedElement.pickRef).to.equal(1);

      elementPicker.start();
      clickElementWithClientPosition(el);
      pickElementMessage = portMock.postMessage.lastCall.args[0];
      expect(pickElementMessage.payload.pickedElement.pickRef).to.equal(2);

      elementPicker.start();
      clickElementWithClientPosition(el);
      pickElementMessage = portMock.postMessage.lastCall.args[0];
      expect(pickElementMessage.payload.pickedElement.pickRef).to.equal(3);
    });
  });

  describe("snapshot tests", () => {
    async function verifySnapshot(snapshot: ElementPickerSnapshotTest) {
      await snapshot.setupFixture();
      elementPicker.start();

      clickElementWithClientPosition(snapshot.elementToPick);

      // Verify we received a pick element message
      expect(portMock.postMessage.calledOnce).to.be.true;
      const {
        payload: { pickedElement, suggestions },
      } = portMock.postMessage.args[0][0] as PickElementMessage;

      // Element should match exactly the first element in compose path
      expect(pickedElement.element).to.deep.equal(snapshot.composedPath[0]);

      // Computed composed path matches exactly
      expect(pickedElement.composedPath).to.deep.equal(snapshot.composedPath);

      // Number of suggestions matches
      expect(suggestions.length).to.equal(snapshot.suggestions.length);

      // Suggestions are in specific order, and each suggestion matches the partial ElementPickSnapshot
      snapshot.suggestions.forEach((expected, index) => {
        const actual = suggestions[index];

        expect(actual).to.have.deep.property("type", expected.type);
        expect(actual).to.have.deep.property("element", expected.element);
        expect(actual).to.have.deep.property("location", expected.location);
        if (expected.part) {
          expect(actual).to.have.nested.property(
            "part.name",
            expected.part.name
          );
        } else {
          expect(actual).not.to.have.property("part");
        }
        expect(actual).to.have.deep.property(
          "partHierarchy",
          expected.partHierarchy
        );
      });
    }

    it("DatePicker snapshot", async () => {
      await verifySnapshot(new DatePickerToggleButtonSnapshotTest());
    });
  });
});
