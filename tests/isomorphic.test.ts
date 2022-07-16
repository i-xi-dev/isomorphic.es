import { assertStrictEquals, assertThrows } from "std/testing/asserts";
import { Isomorphic } from "../mod.ts";

Deno.test("Isomorphic.decode", () => {
  // decode()
  assertStrictEquals(Isomorphic.decode(), "");

  // decode(ArrayBuffer)
  assertStrictEquals(Isomorphic.decode(new ArrayBuffer(0)), "");
  assertStrictEquals(
    Isomorphic.decode(Uint8Array.of(0x41, 0x42, 0x43, 0x44).buffer),
    "ABCD",
  );

  // decode(Uint8Array)
  assertStrictEquals(Isomorphic.decode(Uint8Array.of()), "");
  assertStrictEquals(
    Isomorphic.decode(Uint8Array.of(0x41, 0x42, 0x43, 0x44)),
    "ABCD",
  );
  assertStrictEquals(
    Isomorphic.decode(Uint8Array.of(0x0, 0xFF)),
    "\u0000\u00FF",
  );

  const c = 1200000;
  const t = "\u0000".repeat(c);
  //const bf = performance.now();
  assertStrictEquals(Isomorphic.decode(new Uint8Array(c)), t);
  //console.log(performance.now() - bf);

  // decode(any)
  assertThrows(
    () => {
      Isomorphic.decode([] as unknown as Uint8Array);
    },
    TypeError,
    undefined,
    "buffer",
  );
});

Deno.test("Isomorphic.encode", () => {
  // encode()
  assertStrictEquals(JSON.stringify([...Isomorphic.encode()]), "[]");

  // encode(string)
  assertStrictEquals(JSON.stringify([...Isomorphic.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...Isomorphic.encode("ABCD")]),
    "[65,66,67,68]",
  );
  assertStrictEquals(
    JSON.stringify([...Isomorphic.encode("\u0000\u00FF")]),
    "[0,255]",
  );

  const c = 1200000;
  const t = "\u0000".repeat(c);
  //const bf = performance.now();
  const rs = JSON.stringify([...Isomorphic.encode(t)]);
  //console.log(performance.now() - bf);
  assertStrictEquals(rs, JSON.stringify([...new Uint8Array(c)]));

  assertThrows(
    () => {
      Isomorphic.encode("\u0100");
    },
    TypeError,
    undefined,
    "input",
  );
});
