import sha256 from 'js-sha256'

export const generate = {
  HEX: (service, secret) => {
    return new Promise ((resolve, reject) => {
      let combined = secret + "-" + service;
      for (let i = 0; i < 65536; i++) {
        combined = sha256.digest(combined)
      }
      console.log(combined)
      resolve(combined)
    })
  },
  LEGACY: async () => {

  },
  BASE58: async () => {

  }
}

export const generatePassword = async () => {

}

export const bytesToBase56 = () => {

}

export const bytesToHex = () => {

}