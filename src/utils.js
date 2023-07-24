export function getRanChar(min, max) {
    const limit = max - min + 1;
    return String.fromCharCode(Math.floor(Math.random() * limit) + min);
  }
  
export function getSym() {
    const specialChar = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~'";
    return specialChar[Math.floor(Math.random() * specialChar.length)];
  }
  