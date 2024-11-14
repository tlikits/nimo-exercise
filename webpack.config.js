const path = require('path');

module.exports = {
  entry: {
    'get-coin-current-price': './src/handlers/get-coin-current-price.ts',
    'get-search-history': './src/handlers/get-search-history.ts',
    'sign-up': './src/handlers/sign-up.ts',
    'cognito-login': './src/handlers/cognito-login.ts',
  },
  target: 'node',
  mode: 'production',
  externals: [
      '@aws-sdk',
      'aws-lambda'
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'handlers/[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
};
