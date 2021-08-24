import sha256 from 'js-sha256'
import { binary_to_base58 } from 'base58-js'

export const generate = {
  HEX: (service, secret) => {
    let combined = secret + "-" + service;
    for (let i = 0; i < 65536; i++) {
      combined = sha256(combined)
    }
    combined = formatPassword(combined)
    console.log(combined)
    return combined
  },
  LEGACY: (service, secret) => {
    let combined = secret + '-' + service
    combined = generate.DIGEST(combined)
    combined = sha256(combined)
    combined = formatPassword(combined)
    console.log(combined)
    return combined
  },
  BASE58: (service, secret) => {
    let combined = secret + '-' + service
    combined = generate.DIGEST(combined)
    combined = sha256.digest(combined)
    console.log(combined)
    combined = binary_to_base58(combined)
    combined = formatPassword(combined)
    console.log(combined)
    return combined
  },
  DIGEST: (combined) => {
    for (let i = 0; i < 65535; i++) {
      combined = sha256.digest(combined)
    }
    return combined
  }
}

export const formatPassword = hash => {
  let password = ''
  password = `z${[hash.slice(1, 4)]}7${hash.slice(5,9)}H${hash.slice(10, 15)}!`
  return password
}

export const generatePassword = async () => {
}

export const bytesToBase56 = () => {

}

export const bytesToHex = () => {

}