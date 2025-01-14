const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const { gitTokin } = require('./secretConfig.json');

const commonLinuxConfig = {
  categories: ['Development', 'Utility'],
  icon: {
    '1024x1024': 'src/assets/favicon.png',
    scalable: 'src/assets/favicon.png',
  },
  mimeType: ['x-scheme-handler/electron-fiddle'],
};

module.exports = {
  packagerConfig: {
    asar: true,
    icon: 'src/assets/favicon'
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: gitTokin,
        repository: {
          owner: 'Sergey-Khomyakov',
          name: 'AdamDesktopApp'
        },
        prerelease: true,
      }
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Sergey-Khomyakov',
        description: 'Demo app Electron'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-pkg',
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.js',
            config: 'vite.main.config.mjs',
            target: 'main',
          },
          {
            entry: 'src/preload.js',
            config: 'vite.preload.config.mjs',
            target: 'preload',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.mjs',
          },
        ],
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
