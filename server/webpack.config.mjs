import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
  entry: './script/server.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify")
    }
  }
};
