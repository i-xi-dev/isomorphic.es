import { assertStrictEquals, assertThrows } from "std/testing/asserts";
import { IsomorphicEncoding } from "../mod.ts";

Deno.test("IsomorphicEncoding.decode", () => {
  // decode()
  assertStrictEquals(IsomorphicEncoding.decode(), "");

  // decode(ArrayBuffer)
  assertStrictEquals(IsomorphicEncoding.decode(new ArrayBuffer(0)), "");
  assertStrictEquals(
    IsomorphicEncoding.decode(Uint8Array.of(0x41, 0x42, 0x43, 0x44).buffer),
    "ABCD",
  );

  // decode(Uint8Array)
  assertStrictEquals(IsomorphicEncoding.decode(Uint8Array.of()), "");
  assertStrictEquals(
    IsomorphicEncoding.decode(Uint8Array.of(0x41, 0x42, 0x43, 0x44)),
    "ABCD",
  );
  assertStrictEquals(
    IsomorphicEncoding.decode(Uint8Array.of(0x0, 0xFF)),
    "\u0000\u00FF",
  );

  const c = 1200000;
  const t = "\u0000".repeat(c);
  //const bf = performance.now();
  assertStrictEquals(IsomorphicEncoding.decode(new Uint8Array(c)), t);
  //console.log(performance.now() - bf);

  // decode(any)
  assertThrows(
    () => {
      IsomorphicEncoding.decode([] as unknown as Uint8Array);
    },
    TypeError,
    undefined,
    "buffer",
  );
});

Deno.test("IsomorphicEncoding.encode", () => {
  // encode()
  assertStrictEquals(JSON.stringify([...IsomorphicEncoding.encode()]), "[]");

  // encode(string)
  assertStrictEquals(JSON.stringify([...IsomorphicEncoding.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...IsomorphicEncoding.encode("ABCD")]),
    "[65,66,67,68]",
  );
  assertStrictEquals(
    JSON.stringify([...IsomorphicEncoding.encode("\u0000\u00FF")]),
    "[0,255]",
  );

  const c = 1200000;
  const t = "\u0000".repeat(c);
  //const bf = performance.now();
  const rs = JSON.stringify([...IsomorphicEncoding.encode(t)]);
  //console.log(performance.now() - bf);
  assertStrictEquals(rs, JSON.stringify([...new Uint8Array(c)]));

  assertThrows(
    () => {
      IsomorphicEncoding.encode("\u0100");
    },
    TypeError,
    undefined,
    "input",
  );
});
