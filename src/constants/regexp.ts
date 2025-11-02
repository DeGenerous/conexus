// Shared validation regexes used across auth and settings flows
export const regexpEmail: RegExp =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const regexpPasswordValidation: RegExp =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[.,@$!%*#?&])[A-Za-z\d.,@$!%*#?&]{8,24}$/;

export const regexpLengthCheck: RegExp = /^[a-z\d.,@$!%*#?&]{8,24}$/i;
export const regexpCapitalLetterCheck: RegExp = /(?=.*[A-Z])/;
export const regexpLowercaseLetterCheck: RegExp = /(?=.*[a-z])/;
export const regexpNumberCheck: RegExp = /(?=.*\d)/;
export const regexpSpecialCharCheck: RegExp = /[.,@$!%*#?&]/;
export const regexpRestrictedCharsCheck: RegExp = /^[a-z\d.,@$!%*#?&]+$/i;

export const regexpWeb3Address: RegExp = /^0x[a-fA-F0-9]{40}$/;

export const regexpURI: RegExp =
  /^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
export const regexpURIwithProtocol: RegExp =
  /^(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
