module.exports = {
    entry: {
        'index': './src/index.ts',
        'worker': './src/worker/worker.ts'
    },
    output: {
        filename: 'dist/[name].js'
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
