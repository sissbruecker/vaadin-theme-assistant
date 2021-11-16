export const getBrowser = (): typeof chrome => {
  // Get extension api for Chrome or Firefox
  // @ts-ignore
  return chrome || browser;
};
