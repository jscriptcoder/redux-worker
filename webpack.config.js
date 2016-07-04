module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'dist/script.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            {test: /\.scss/, loaders: ['style', 'css', 'sass']},
            {test: /\.ts/, loaders: ['ts']}
        ]
    }
};
