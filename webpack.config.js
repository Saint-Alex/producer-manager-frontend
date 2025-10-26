const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/store': path.resolve(__dirname, 'src/store'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/styles': path.resolve(__dirname, 'src/styles'),
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProduction,
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_URL': JSON.stringify(
          process.env.REACT_APP_API_URL ||
            (isProduction
              ? 'https://producer-manager-backend-053a5c3a64be.herokuapp.com'
              : 'http://localhost:3001')
        ),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || argv.mode),
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      host: '0.0.0.0',
    },
    optimization: isProduction
      ? {
          splitChunks: {
            chunks: 'all',
          },
        }
      : {},
    mode: argv.mode || 'development',
  };
};
