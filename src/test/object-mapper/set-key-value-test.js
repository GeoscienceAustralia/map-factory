import { expect } from "code";
import * as Lab from "lab";
import getHelper from "lab-testing";

const lab = exports.lab = Lab.script();
const testing = getHelper(lab);
const group = testing.createExperiment("map-factory", "object-mapper");

import setKeyValue from "../../lib/object-mapper/set-key-value";

group("The setKeyValue() method", () => {

  lab.test("sets correct value and creates base object", done => {
    const key = "foo";
    const value = "bar";

    const expected = {
      foo: "bar"
    };

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("sets correct value when base object is provided", done => {
    const key = "foo";
    const value = "bar";

    const base = {
      baz: "foo"
    };

    const expected = {
      baz: "foo",
      foo: "bar"
    };

    const result = setKeyValue(base, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("works correctly when the root key is an array", done => {
    const key = "[]";
    const value = "bar";

    const expected = ["bar"];

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("simple array with base array", done => {
    const key = "[]";
    const value = "bar";

    const base = ["foo"];
    const expected = ["bar"];

    const result = setKeyValue(base, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("simple array in index 0", done => {
    const key = "[0]";
    const value = "bar";

    const expected = ["bar"];

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("simple array in index 0 with base array", done => {
    const key = "[0]";
    const value = "bar";

    const base = ["foo"];
    const expected = ["bar"];

    const result = setKeyValue(base, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("simple array in index 1", done => {
    const key = "[1]";
    const value = "bar";

    const expected = [, "bar"];

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });

  lab.test("one level deep", done => {
    const key = "foo.bar";
    const value = "baz";

    const expected = {
      foo: {
        bar: "baz"
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("object inside simple array", done => {
    const key = "[].foo";
    const value = "bar";

    const expected = [{
      foo: "bar"
    }];

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("array to object inside simple array", done => {
    const key = "[].foo";
    const value = ["bar", "baz"];

    const expected = [
      {
        foo: "bar"
      },
      {
        foo: "baz"
      }
    ];

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("object inside simple array defined index", done => {
    const key = "[3].foo";
    const value = "bar";

    const expected = [, , , {
      foo: "bar"
    }];

    const result = setKeyValue(null, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("two levels deep", done => {
    const key = "foo.bar.baz";
    const value = "foo";

    const expected = {
      foo: {
        bar: {
          baz: "foo"
        }
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("one level deep inside array", done => {
    const key = "foo.bar[]";
    const value = "baz";

    const expected = {
      foo: {
        bar: ["baz"]
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("one level deep inside array with one level deep", done => {
    const key = "foo.bar[].baz";
    const value = "foo";

    const expected = {
      foo: {
        bar: [{
          baz: "foo"
        }]
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("one level deep inside array with one level deep inside a existing array", done => {
    const key = "foo.bar[].baz";
    const value = "foo";

    const base = {
      foo: {
        bar: [{
          bar: "baz"
        }]
      }
    };

    const expected = {
      foo: {
        bar: [{
          bar: "baz", baz: "foo"
        }]
      }
    };

    const result = setKeyValue(base, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("one level deep inside array at defined index with one level deep", done => {
    const key = "foo.bar[1].baz";
    const value = "foo";

    const expected = {
      foo: {
        bar: [, {
          baz: "foo"
        }]
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("array to simple object", done => {
    const key = "foo[].baz";
    const value = ["foo", "const"];

    const expected = {
      foo: [
        {
          baz: "foo"
        },
        {
          baz: "const"
        }
      ]
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("array to two level object", done => {
    const key = "bar.foo[].baz";
    const value = ["foo", "const"];

    const expected = {
      bar: {
        foo: [
          {
            baz: "foo"
          },
          {
            baz: "const"
          }
        ]
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("array to two level object", done => {
    const key = "bar.foo[].baz.foo";
    const value = ["foo", "const"];

    const expected = {
      bar: {
        foo: [
          {
            baz: {
              foo: "foo"
            }
          },
          {
            baz: {
              foo: "const"
            }
          }
        ]
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("array to object", done => {
    const key = "foo[].bar[].baz";
    const value = ["foo", "const"];

    const expected = {
      foo: [{
        bar: [{
          baz: "foo"
        }, {
          baz: "const"
        }]
      }]
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });
  lab.test("crazy", done => {
    const key = "foo.bar[1].baz[2].thing";
    const value = "foo";

    const expected = {
      foo: {
        bar: [, {
          baz: [, , {
            thing: "foo"
          }]
        }]
      }
    };

    const result = setKeyValue({}, key, value);

    expect(result).to.equal(expected);
    return done();
  });

});
