//

function _isIsomorphicEncoded(value: string): boolean {
  // deno-lint-ignore no-control-regex
  return /^[\u{0}-\u{FF}]*$/u.test(value);
}

namespace IsomorphicEncoding {
  export function decode(input: BufferSource = new Uint8Array(0)): string {
    let bytes: Uint8Array;
    if (ArrayBuffer.isView(input)) {
      bytes = new Uint8Array(input.buffer);
    } else if (input instanceof ArrayBuffer) {
      bytes = new Uint8Array(input);
    } else {
      throw new TypeError("buffer");
    }

    // A: Bの2倍以上遅い（Node.js）
    // let chars: string = "";
    // for (const byte of bytes) {
    //   chars = chars + String.fromCharCode(byte);
    // }
    // return chars;

    // B:
    const chars = Array.from(bytes, (byte) => {
      return String.fromCharCode(byte);
    });
    return chars.join("");
  }

  export function encode(input = ""): Uint8Array {
    if (_isIsomorphicEncoded(input) !== true) {
      throw new TypeError("input");
    }

    const bytes = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      bytes[i] = input.charCodeAt(i);
    }
    return bytes;
  }
}
Object.freeze(IsomorphicEncoding);

export { IsomorphicEncoding };
