// eslint-disable-next-line unicorn/prefer-module
module.exports = function babel(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
