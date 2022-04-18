/*
 * ancient-greek-translit.js
 * Version 1.0
 *
 * (c) 2022 Benjamin Nacar
 * Licensed Apache-2.0
 *
 * This is my best attempt at reverse-engineering the Perseus
 * (www.perseus.tufts.edu/hopper/search/) Greek text input. The
 * intended use case would be an Ancient Greek online resource
 * where the text is stored as ASCII and rendered into Unicode
 * or HTML codes for display, which should make programmatic
 * manipulation of diacritics simpler.
 */

/*
 * Easy access for compounded characters via 3-dimentional
 * arrays: character[accent][breathing mark/diaeresis][iota subscript]
 *
 * In cases where a certain compound is not available,
 * we just drop the diacritic, e.g. epsilon with a circumflex
 * becomes a plain epsilon.
 *
 * Note that there are some combinations with uppercase letters
 * not available in the Unicode standard
 * (this is based off of https://unicode.org/charts/PDF/U0370.pdf
 * and https://unicode.org/charts/PDF/U1F00.pdf)
 */
const NOACCENT = 0;
const ACUTE = 1;
const GRAVE = 2;
const CIRCUMFLEX = 3;
const NOBREATHING = 0;
const SMOOTH = 1;
const ROUGH = 2;
const DIAERESIS = 3;
const NOSUB = 0;
const IOTASUB = 1;
const lcAlpha = [
  [
    [ 0x3b1, 0x1fb3 ],
    [ 0x1f00, 0x1f80 ],
    [ 0x1f01, 0x1f81 ],
    [ 0x3b1, 0x1fb3 ]
  ],
  [
    [ 0x1f71, 0x1fb4 ],
    [ 0x1f04, 0x1f84 ],
    [ 0x1f05, 0x1f85 ],
    [ 0x1f71, 0x1fb4 ]
  ],
  [
    [ 0x1f70, 0x1fb2 ],
    [ 0x1f02, 0x1f82 ],
    [ 0x1f03, 0x1f83 ],
    [ 0x1f70, 0x1fb2 ]
  ],
  [
    [ 0x1fb6, 0x1fb7 ],
    [ 0x1f06, 0x1f86 ],
    [ 0x1f07, 0x1f87 ],
    [ 0x1fb6, 0x1fb7 ]
  ],
];
const ucAlpha = [
  [
    [ 0x391, 0x1fbc ],
    [ 0x1f08, 0x1f88 ],
    [ 0x1f09, 0x1f89 ],
    [ 0x391, 0x1fbc ]
  ],
  [
    [ 0x1fbb, 0x1fbb ],
    [ 0x1f0c, 0x1f8c ],
    [ 0x1f0d, 0x1f8d ],
    [ 0x1fbb, 0x1fbb ]
  ],
  [
    [ 0x1fba, 0x1fba ],
    [ 0x1f0a, 0x1f8a ],
    [ 0x1f0b, 0x1f8b ],
    [ 0x1fba, 0x1fba ]
  ],
  [
    [ 0x391, 0x1fbc ],
    [ 0x1f0e, 0x1f8e ],
    [ 0x1f0f, 0x1f8f ],
    [ 0x391, 0x1fbc ]
  ]
];
const lcEpsilon = [
  [
    [ 0x3b5, 0x3b5 ],
    [ 0x1f10, 0x1f10 ],
    [ 0x1f11, 0x1f11 ],
    [ 0x3b5, 0x3b5 ]
  ],
  [
    [ 0x1f73, 0x1f73 ],
    [ 0x1f14, 0x1f14 ],
    [ 0x1f15, 0x1f15 ],
    [ 0x1f73, 0x1f73 ]
  ],
  [
    [ 0x1f72, 0x1f72 ],
    [ 0x1f12, 0x1f12 ],
    [ 0x1f13, 0x1f13 ],
    [ 0x1f72, 0x1f72 ]
  ],
  [
    [ 0x3b5, 0x3b5 ],
    [ 0x1f10, 0x1f10 ],
    [ 0x1f11, 0x1f11 ],
    [ 0x3b5, 0x3b5 ]
  ]
];
const ucEpsilon = [
  [
    [ 0x395, 0x395 ],
    [ 0x1f18, 0x1f18 ],
    [ 0x1f19, 0x1f19 ],
    [ 0x395, 0x395 ]
  ],
  [
    [ 0x1fc9, 0x1fc9 ],
    [ 0x1f1c, 0x1f1c ],
    [ 0x1f1d, 0x1f1d ],
    [ 0x1fc9, 0x1fc9 ]
  ],
  [
    [ 0x1fc8, 0x1fc8 ],
    [ 0x1f1a, 0x1f1a ],
    [ 0x1f1b, 0x1f1b ],
    [ 0x1fc8, 0x1fc8 ]
  ],
  [
    [ 0x395, 0x395 ],
    [ 0x1f18, 0x1f18 ],
    [ 0x1f19, 0x1f19 ],
    [ 0x395, 0x395 ]
  ]
];
const lcEta = [
  [
    [ 0x3b7, 0x1fc3 ],
    [ 0x1f20, 0x1f90 ],
    [ 0x1f21, 0x1f91 ],
    [ 0x3b7, 0x1fc3 ]
  ],
  [
    [ 0x1f75, 0x1fc4 ],
    [ 0x1f24, 0x1f94 ],
    [ 0x1f25, 0x1f95 ],
    [ 0x1f75, 0x1fc4 ]
  ],
  [
    [ 0x1f74, 0x1fc2 ],
    [ 0x1f22, 0x1f92 ],
    [ 0x1f23, 0x1f93 ],
    [ 0x1f74, 0x1fc2 ]
  ],
  [
    [ 0x1fc6, 0x1fc7 ],
    [ 0x1f26, 0x1f96 ],
    [ 0x1f27, 0x1f97 ],
    [ 0x1fc6, 0x1fc7 ]
  ]
];
const ucEta = [
  [
    [ 0x397, 0x1fcc ],
    [ 0x1f28, 0x1f98 ],
    [ 0x1f29, 0x1f99 ],
    [ 0x397, 0x1fcc ]
  ],
  [
    [ 0x1fcb, 0x1fcb ],
    [ 0x1f2c, 0x1f9c ],
    [ 0x1f2d, 0x1f9d ],
    [ 0x1fcb, 0x1fcb ]
  ],
  [
    [ 0x1fca, 0x1fca ],
    [ 0x1f2a, 0x1f9a ],
    [ 0x1f2b, 0x1f9b ],
    [ 0x1fca, 0x1fca ]
  ],
  [
    [ 0x397, 0x1fcc ],
    [ 0x1f2e, 0x1f9e ],
    [ 0x1f2f, 0x1f9f ],
    [ 0x397, 0x1fcc ]
  ],
];
const lcIota = [
  [
    [ 0x3b9, 0x3b9 ],
    [ 0x1f30, 0x1f30 ],
    [ 0x1f31, 0x1f3 ],
    [ 0x3ca, 0x3ca ]
  ],
  [
    [ 0x1f77, 0x1f77 ],
    [ 0x1f34, 0x1f34 ],
    [ 0x1f35, 0x1f35 ],
    [ 0x1fd3, 0x1fd3 ]
  ],
  [
    [ 0x1f76, 0x1f76 ],
    [ 0x1f32, 0x1f32 ],
    [ 0x1f33, 0x1f33 ],
    [ 0x1fd2, 0x1fd2 ]
  ],
  [
    [ 0x1fd6, 0x1fd6 ],
    [ 0x1f36, 0x1f36 ],
    [ 0x1f37, 0x1f37 ],
    [ 0x1fd7, 0x1fd7 ]
  ]
];
const ucIota = [
  [
    [ 0x399, 0x399 ],
    [ 0x1f38, 0x1f38 ],
    [ 0x1f39, 0x1f39 ],
    [ 0x3aa, 0x3aa ]
  ],
  [
    [ 0x1fdb, 0x1fdb ],
    [ 0x1f3c, 0x1f3c ],
    [ 0x1f3d, 0x1f3d ],
    [ 0x1fdb, 0x1fdb ]
  ],
  [
    [ 0x1fda, 0x1fda ],
    [ 0x1f3a, 0x1f3a ],
    [ 0x1f3b, 0x1f3b ],
    [ 0x1fda, 0x1fda ]
  ],
  [
    [ 0x399, 0x399 ],
    [ 0x1f3e, 0x1f3e ],
    [ 0x1f3f, 0x1f3f ],
    [ 0x399, 0x399 ]
  ]
];
const lcOmicron = [
 [
   [ 0x3bf, 0x3bf ],
   [ 0x1f40, 0x1f40 ],
   [ 0x1f41, 0x1f41 ],
   [ 0x3bf, 0x3bf ]
 ],
 [
   [ 0x1f79, 0x1f79 ],
   [ 0x1f44, 0x1f44 ],
   [ 0x1f45, 0x1f45 ],
   [ 0x1f79, 0x1f79 ]
 ],
 [
   [ 0x1f78, 0x1f78 ],
   [ 0x1f42, 0x1f42 ],
   [ 0x1f43, 0x1f43 ],
   [ 0x1f78, 0x1f78 ]
 ],
 [
   [ 0x3bf, 0x3bf ],
   [ 0x1f40, 0x1f40 ],
   [ 0x1f41, 0x1f41 ],
   [ 0x3bf, 0x3bf ]
 ]
];
const ucOmicron = [
 [
   [ 0x39f, 0x39f ],
   [ 0x1f48, 0x1f48 ],
   [ 0x1f49, 0x1f49 ],
   [ 0x39f, 0x39f ]
 ],
 [
   [ 0x1ff9, 0x1ff9 ],
   [ 0x1f4c, 0x1f4c ],
   [ 0x1f4d, 0x1f4d ],
   [ 0x1ff9, 0x1ff9 ]
 ],
 [
   [ 0x1ff8, 0x1ff8 ],
   [ 0x1f4a, 0x1f4a ],
   [ 0x1f4b, 0x1f4b ],
   [ 0x1ff8, 0x1ff8 ]
 ],
 [
   [ 0x39f, 0x39f ],
   [ 0x1f48, 0x1f48 ],
   [ 0x1f49, 0x1f49 ],
   [ 0x39f, 0x39f ]
 ]
];
const lcUpsilon = [
 [
   [ 0x3c5, 0x3c5 ],
   [ 0x1f50, 0x1f50 ],
   [ 0x1f51, 0x1f51 ],
   [ 0x3cb, 0x3cb ]
 ],
 [
   [ 0x1f7b, 0x1f7b ],
   [ 0x1f54, 0x1f54 ],
   [ 0x1f55, 0x1f55 ],
   [ 0x1fe3, 0x1fe3 ]
 ],
 [
   [ 0x1f7a, 0x1f7a ],
   [ 0x1f52, 0x1f52 ],
   [ 0x1f53, 0x1f53 ],
   [ 0x1fe2, 0x1fe2 ]
 ],
 [
   [ 0x1fe6, 0x1fe6 ],
   [ 0x1f56, 0x1f56 ],
   [ 0x1f57, 0x1f57 ],
   [ 0x1fe7, 0x1fe7 ]
 ]
];
const ucUpsilon = [
 [
   [ 0x3a5, 0x3a5 ],
   [ 0x3a5, 0x3a5 ],
   [ 0x1f59, 0x1f59 ],
   [ 0x3ab, 0x3ab ]
 ],
 [
   [ 0x1feb, 0x1feb ],
   [ 0x1feb, 0x1feb ],
   [ 0x1f5d, 0x1f5d ],
   [ 0x1feb, 0x1feb ]
 ],
 [
   [ 0x1fea, 0x1fea ],
   [ 0x1fea, 0x1fea ],
   [ 0x1f5b, 0x1f5b ],
   [ 0x1fea, 0x1fea ]
 ],
 [
   [ 0x3a5, 0x3a5 ],
   [ 0x3a5, 0x3a5 ],
   [ 0x1f5f, 0x1f5f ],
   [ 0x3a5, 0x3a5 ]
 ]
];
const lcOmega = [
 [
   [ 0x3c9, 0x1ff3 ],
   [ 0x1f60, 0x1fa0 ],
   [ 0x1f61, 0x1fa1 ],
   [ 0x3c9, 0x1ff3 ]
 ],
 [
   [ 0x1f7d, 0x1ff4 ],
   [ 0x1f64, 0x1fa4 ],
   [ 0x1f65, 0x1fa5 ],
   [ 0x1f7d, 0x1ff4 ]
 ],
 [
   [ 0x1f7c, 0x1ff2 ],
   [ 0x1f62, 0x1fa2 ],
   [ 0x1f63, 0x1fa3 ],
   [ 0x1f7c, 0x1ff2 ]
 ],
 [
   [ 0x1ff6, 0x1ff7 ],
   [ 0x1f66, 0x1fa6 ],
   [ 0x1f67, 0x1fa7 ],
   [ 0x1ff6, 0x1ff7 ]
 ]
];
const ucOmega = [
 [
   [ 0x3a9, 0x1ffc ],
   [ 0x1f68, 0x1fa8 ],
   [ 0x1f69, 0x1fa9 ],
   [ 0x3a9, 0x1ffc ]
 ],
 [
   [ 0x1ffb, 0x1ffb ],
   [ 0x1f6c, 0x1fac ],
   [ 0x1f6d, 0x1fad ],
   [ 0x1ffb, 0x1ffb ]
 ],
 [
   [ 0x1ffa, 0x1ffa ],
   [ 0x1f6a, 0x1faa ],
   [ 0x1f6b, 0x1fab ],
   [ 0x1ffa, 0x1ffa ]
 ],
 [
   [ 0x3a9, 0x1ffc ],
   [ 0x1f6e, 0x1fae ],
   [ 0x1f6f, 0x1faf ],
   [ 0x3a9, 0x1ffc ]
 ]
];

/*
 * Note that if you use this in HTML contexts, any HTML code
 * character will be rendered as Unicode. Therefore, if you
 * want to display the actual HTML code character sequence
 * "&#xNUMBER;" be sure to pass the output of convertToAncientGreek
 * through something that replaces "&" with "&amp;".
 */
function htmlCode(num) {
  return `&#x${Number(num).toString(16)};`;
}

/*
 * I don't know what the most efficient way of doing this is, but
 * I can most easily imagine it as a finite state machine
 */
export default class AncientGreekConverter {

  /*
   * doHtml = true -> converts to "&#xNUMBER;" codes
   * doHtml = false -> converts to Unicode chars
   */
  constructor(doHtml) {
    this._doHtml = doHtml;
  }

  /* 
   * call this after compiling pending letter + diacritics
   * into the output string
   */
  clearPending() {
    this._accent = NOACCENT;
    this._breathing = NOBREATHING;
    this._iotasub = NOSUB;
    this._pendingLetter = null;
  }

  /*
   * only call this after converting the entire string
   * and saving the output
   */
  reset() {
    this.clearPending();
    this._output = "";
    this._isEndOfWord = false;
  }

  /*
   * duh
   */
  get output() {
    return this._output;
  }

  /*
   * Selects the appropriate glyph depending on specified
   * diacritics (vowels, rho) or whether the letter appears
   * at the end of a word (sigma), and appends that character
   * to the output string.
   */
  compilePendingToOutput() {
    let outc = null;
    switch (this._pendingLetter) {
      case 'a':
	outc = lcAlpha[this._accent][this._breathing][this._iotasub];
        break;
      case 'A':
	outc = ucAlpha[this._accent][this._breathing][this._iotasub];
        break;
      case 'e':
	outc = lcEpsilon[this._accent][this._breathing][this._iotasub];
        break;
      case 'E':
	outc = ucEpsilon[this._accent][this._breathing][this._iotasub];
        break;
      case 'h':
	outc = lcEta[this._accent][this._breathing][this._iotasub];
        break;
      case 'H':
	outc = ucEta[this._accent][this._breathing][this._iotasub];
        break;
      case 'i':
	outc = lcIota[this._accent][this._breathing][this._iotasub];
        break;
      case 'I':
	outc = ucIota[this._accent][this._breathing][this._iotasub];
        break;
      case 'o':
	outc = lcOmicron[this._accent][this._breathing][this._iotasub];
        break;
      case 'O':
	outc = ucOmicron[this._accent][this._breathing][this._iotasub];
        break;
      case 'r':
        outc = (this._breathing === ROUGH) ? 0x1fe5 : 0x3c1;
        break;
      case 'R':
        outc = (this._breathing === ROUGH) ? 0x1fec : 0x3a1;
        break;
      case 's':
        outc = this._isEndOfWord ? 0x3c2 : 0x3c3;
        break;
      case 'u':
	outc = lcUpsilon[this._accent][this._breathing][this._iotasub];
        break;
      case 'U':
	outc = ucUpsilon[this._accent][this._breathing][this._iotasub];
        break;
      case 'w':
	outc = lcOmega[this._accent][this._breathing][this._iotasub];
        break;
      case 'W':
	outc = ucOmega[this._accent][this._breathing][this._iotasub];
        break;
    }
    this.clearPending();
    if (outc) {
      this._output += this._doHtml ? htmlCode(outc) : String.fromCharCode(outc);
    }
  }

  /*
   * Handle consonants other than rho and sigma.
   */
  addStaticCharacterToOutput(c) {
    let outc = null;
    switch (c) {
      case 'b':
        this._doHtml ? outc = htmlCode(0x3b2) : outc = '\u03b2';
        break;
      case 'B':
        this._doHtml ? outc = htmlCode(0x392) : outc = '\u0392';
        break;
      case 'g':
        this._doHtml ? outc = htmlCode(0x3b3) : outc = '\u03b3';
        break;
      case 'G':
        this._doHtml ? outc = htmlCode(0x393) : outc = '\u0393';
        break;
      case 'd':
        this._doHtml ? outc = htmlCode(0x3b4) : outc = '\u03b4';
        break;
      case 'D':
        this._doHtml ? outc = htmlCode(0x394) : outc = '\u0394';
        break;
      case 'z':
        this._doHtml ? outc = htmlCode(0x3b6) : outc = '\u03b6';
        break;
      case 'Z':
        this._doHtml ? outc = htmlCode(0x396) : outc = '\u0396';
        break;
      case 'q':
        this._doHtml ? outc = htmlCode(0x3b8) : outc = '\u03b8';
        break;
      case 'Q':
        this._doHtml ? outc = htmlCode(0x398) : outc = '\u0398';
        break;
      case 'k':
        this._doHtml ? outc = htmlCode(0x3ba) : outc = '\u03ba';
        break;
      case 'K':
        this._doHtml ? outc = htmlCode(0x39a) : outc = '\u039a';
        break;
      case 'l':
        this._doHtml ? outc = htmlCode(0x3bb) : outc = '\u03bb';
        break;
      case 'L':
        this._doHtml ? outc = htmlCode(0x39b) : outc = '\u039b';
        break;
      case 'm':
        this._doHtml ? outc = htmlCode(0x3bc) : outc = '\u03bc';
        break;
      case 'M':
        this._doHtml ? outc = htmlCode(0x39c) : outc = '\u039c';
        break;
      case 'n':
        this._doHtml ? outc = htmlCode(0x3bd) : outc = '\u03bd';
        break;
      case 'N':
        this._doHtml ? outc = htmlCode(0x39d) : outc = '\u039d';
        break;
      case 'c':
        this._doHtml ? outc = htmlCode(0x3be) : outc = '\u03be';
        break;
      case 'C':
        this._doHtml ? outc = htmlCode(0x39e) : outc = '\u039e';
        break;
      case 'p':
        this._doHtml ? outc = htmlCode(0x3c0) : outc = '\u03c0';
        break;
      case 'P':
        this._doHtml ? outc = htmlCode(0x3a0) : outc = '\u03a0';
        break;
      case 'S':
        this._doHtml ? outc = htmlCode(0x3a3) : outc = '\u03a3';
        break;
      case 't':
        this._doHtml ? outc = htmlCode(0x3c4) : outc = '\u03c4';
        break;
      case 'T':
        this._doHtml ? outc = htmlCode(0x3a4) : outc = '\u03a4';
        break;
      case 'f':
        this._doHtml ? outc = htmlCode(0x3c6) : outc = '\u03c6';
        break;
      case 'F':
        this._doHtml ? outc = htmlCode(0x3a6) : outc = '\u03a6';
        break;
      case 'x':
        this._doHtml ? outc = htmlCode(0x3c7) : outc = '\u03c7';
        break;
      case 'X':
        this._doHtml ? outc = htmlCode(0x3a7) : outc = '\u03a7';
        break;
      case 'y':
        this._doHtml ? outc = htmlCode(0x3c8) : outc = '\u03c8';
        break;
      case 'Y':
        this._doHtml ? outc = htmlCode(0x3a8) : outc = '\u03a8';
        break;
    }
    this.clearPending();
    if (outc) {
      this._output += outc;
    }
  }

  /*
   * It begins
   */
  convert(text) {

    let i, c;
    this.reset();
    for (i = 0; i < text.length; ++i) {
      c = text[i];
      switch (c) {
        // letters that may change depending on subsequent characters
        case '*':
        case 'a':
        case 'A':
        case 'e':
        case 'E':
        case 'h':
        case 'H':
        case 'i':
        case 'I':
        case 'o':
        case 'O':
        case 'r':
        case 'R':
        case 's':
        case 'u':
        case 'U':
        case 'w':
        case 'W':
          if (this._pendingLetter) {
            if (this._pendingLetter === '*') {
              this._pendingLetter = c.toUpperCase();
              this.compilePendingToOutput();
            } else {
              this.compilePendingToOutput();
              this._pendingLetter = c;
            }
  	  } else {
            this._pendingLetter = c;
          }
          this._isEndOfWord = false;
          break;
        // static characters
        case 'b':
        case 'B':
        case 'g':
        case 'G':
        case 'd':
        case 'D':
        case 'z':
        case 'Z':
        case 'q':
        case 'Q':
        case 'k':
        case 'K':
        case 'l':
        case 'L':
        case 'm':
        case 'M':
        case 'n':
        case 'N':
        case 'c':
        case 'C':
        case 'p':
        case 'P':
        case 'S':
        case 't':
        case 'T':
        case 'f':
        case 'F':
        case 'x':
        case 'X':
        case 'y':
        case 'Y':
          if (this._pendingLetter) {
            if (this._pendingLetter === '*') {
              this.addStaticCharacterToOutput(c.toUpperCase());
            } else {
              this.compilePendingToOutput();
              this.addStaticCharacterToOutput(c);
            }
          } else {
            this.addStaticCharacterToOutput(c);
          }
          this._isEndOfWord = false;
          break;
        // diacritics: in case of multiple conflicting diacritics,
        // like both an acute and a grave, we drop all but the first
        case '/':
          if (this._accent === NOACCENT) {
            this._accent = ACUTE;
          }
          break;
        case '\\':
          if (this._accent === NOACCENT) {
            this._accent = GRAVE;
          }
          break;
        case '=':
          if (this._accent === NOACCENT) {
            this._accent = CIRCUMFLEX;
          }
          break;
        case ')':
          if (this._breathing === NOBREATHING) {
            this._breathing = SMOOTH;
          }
          break;
        case '(':
          if (this._breathing === NOBREATHING) {
            this._breathing = ROUGH;
          }
          break;
        case '+':
          if (this._breathing === NOBREATHING) {
            this._breathing = DIAERESIS;
          }
          break;
        case '|':
          if (this._iotasub == NOSUB) {
            this._iotasub = IOTASUB;
          }
          break;
        // punctuation and whitespace
        case '.':
        case ',':
        case ';':
        case '\'':
        case '"':
        case '!':
        case ' ':
        case '\t':
        case '\r':
        case '\n':
          this._isEndOfWord = true;
          this.compilePendingToOutput();
          this._output += c;
          break;
        // custom punctuation
        case '?':
          this._isEndOfWord = true;
          this.compilePendingToOutput();
          this._output += ';';
          break;
        case ':':
          this._isEndOfWord = true;
          this.compilePendingToOutput();
          this._doHtml ? this._output += htmlCode(0x387) : this._output += '\u0387';
          break;
        default:
          // ignore all unknown characters
          break;
      }
    }

    // handle any pending operations at the end of the string
    this._isEndOfWord = true;
    this.compilePendingToOutput();
    return this.output;
  }

}

