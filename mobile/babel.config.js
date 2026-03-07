// eslint-disable-next-line unicorn/prefer-module
module.exports = function babel(api) {
  api.cache(true);
  return {
    plugins: ["react-native-reanimated/plugin"],
    presets: ["babel-preset-expo"],
  };
};
