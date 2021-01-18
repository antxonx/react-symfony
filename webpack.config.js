var Encore = require('@symfony/webpack-encore');
const dotenv = require('dotenv');
const path = require('path');

const env = dotenv.config({ path: '.env' });

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath(env.parsed.BASE_ROUTE + '/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')
    .copyFiles([
        {
            from: './assets/images',
            to: 'images/[path][name].[hash:8].[ext]'
        }, {
            from: './assets/files',
            to: 'files/[path][name].[hash:8].[ext]'
        }
    ])

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/scripts/app.tsx')

    // enables the Symfony UX Stimulus bridge (used in assets/bootstrap.js)
    // .enableStimulusBridge('./assets/controllers.json')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-proposal-class-properties');
    })

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

    .configureDefinePlugin(options => {
        if (env.error) {
            throw env.error;
        }
        Object.keys(env.parsed).forEach(key => {
            options[ `process.env` ][ `${key}` ] = JSON.stringify(env.parsed[ key ]);
        });
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader()

    // uncomment if you use React
    .enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    .autoProvidejQuery()
    ;

// module.exports = Encore.getWebpackConfig();
const config = Encore.getWebpackConfig();
config.resolve.alias[ "@pages" ] = path.resolve(__dirname, 'assets/scripts/pages');
config.resolve.alias[ "@components" ] = path.resolve(__dirname, 'assets/scripts/components');
config.resolve.alias[ "@services" ] = path.resolve(__dirname, 'assets/scripts/services');
config.resolve.alias[ "@scripts" ] = path.resolve(__dirname, 'assets/scripts');
config.resolve.alias[ "@styles" ] = path.resolve(__dirname, 'assets/styles');

module.exports = config;
