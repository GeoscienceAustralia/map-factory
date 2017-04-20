import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";
import createMapper from "../lib/index";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("The createMapper() method");

group("when setting options", () => {

  lab.test("sets the defaults correctly when no options are provided", done => {

    const map = createMapper();

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.true();
    expect(mapping.alwaysTransform).to.be.true();

    return done();

  });

  lab.test("sets the defaults correctly when empty options are provided", done => {

    const map = createMapper({});

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.true();
    expect(mapping.alwaysTransform).to.be.true();

    return done();

  });

  lab.test("sets the alwaysTransform option correctly", done => {

    const map = createMapper({ alwaysTransform: false });

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.true();
    expect(mapping.alwaysTransform).to.be.false();

    return done();

  });

  lab.test("sets the alwaysSet option correctly", done => {

    const map = createMapper({ alwaysSet: false });

    const mapping = map("a");

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.true();

    return done();

  });

  lab.test("the existing modifier sets more alwaysSet and alwaysTransform to false", done => {

    const map = createMapper({ alwaysSet: true, alwaysTransform: true });

    const mapping = map("a").existing;

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.false();
    expect(mapping.alwaysTransform).to.be.false();

    return done();

  });

  lab.test("the always modifier sets more alwaysSet and alwaysTransform to true", done => {

    const map = createMapper({ alwaysSet: false, alwaysTransform: false });

    const mapping = map("a").always;

    expect(mapping).to.be.an.object();
    expect(mapping.alwaysSet).to.be.true();
    expect(mapping.alwaysTransform).to.be.true();

    return done();

  });

});

group("when executing with options set the single source mapper", () => {

  lab.test("suppresses a transform when the source value is not present", done => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };

    const map = createMapper({ alwaysTransform: false, alwaysSet: true });

    map("my.source.is.missing").to("your.source.is.missing", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });

  lab.test("suppresses a set when the source value is not present", done => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
    };

    const map = createMapper({ alwaysTransform: false, alwaysSet: false });
    let count = 0;

    map("my.source.is.missing").to("your.source.is.missing", () => {
      count++;
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);
    expect(count).to.equal(0);

    return done();

  });

  lab.test("a set is not supressed when the source value is not present if a transform returns a value", done => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "missing": "found"
          }
        }
      }
    };

    const map = createMapper({ alwaysTransform: true, alwaysSet: false });

    map("my.source.is.missing").to("your.source.is.missing", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });

  lab.test("if a transform returns undefined a set will be called", done => {

    const source = {
      "my": {
        "source": {
          "is": {}
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };

    const map = createMapper({ alwaysTransform: true, alwaysSet: true });

    map("my.source.is.missing").to("your.source.is.missing", () => {
      return undefined;
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });

  lab.test("if source value is false set will be called", done => {

    const source = {
      "my": {
        "source": {
          "is": {
            "missing": false
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "missing": false
          }
        }
      }
    };

    const map = createMapper({ alwaysTransform: false, alwaysSet: false });

    map("my.source.is.missing").to("your.source.is.missing");

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });

});

group("when executing with options set the multi source mapper", () => {

  lab.test("suppresses a transform when the source values are all not present", done => {

    const source = {
      "my": {
        "source": {
          "is": {}
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {}
        }
      }
    };

    const map = createMapper({ alwaysTransform: false, alwaysSet: true });

    map(["my.source.is.missing", "my.other.source.is.missing"]).to("your.source.is.missing", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });

  lab.test("a transform executes when one source value is present", done => {

    const source = {
      "my": {
        "source": {
          "is": {
            "here": "value"
          }
        },
        "other": {
          "source": {
            "is": {}
          }
        }
      }
    };

    const expected = {
      "your": {
        "source": {
          "is": {
            "here": "found"
          }
        }
      }
    };

    const map = createMapper({ alwaysTransform: false, alwaysSet: true });

    map(["my.source.is.here", "my.other.source.is.missing"]).to("your.source.is.here", () => {
      return "found";
    });

    const actual = map.execute(source);

    expect(actual).to.equal(expected);

    return done();

  });
});
