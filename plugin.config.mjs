//@ts-check
const hp = 'https://konomi.app/';
const cdn = 'https://kintone-plugin.konomi.app';
const key = 'concatenation';

/** @satisfies { Plugin.Meta.Config } */
export default /** @type { const } */ ({
  id: `ribbit-kintone-plugin-${key}`,
  pluginReleasePageUrl: `https://ribbit.konomi.app/kintone-plugin/`,
  server: {
    port: 24606,
  },
  lint: {
    build: false,
  },
  tailwind: {
    css: 'src/styles/global.css',
    config: {
      desktop: 'tailwind.config.desktop.mjs',
      config: 'tailwind.config.config.mjs',
    },
  },
  manifest: {
    base: {
      manifest_version: 1,
      version: '1.1.1',
      type: 'APP',
      name: {
        en: 'String Concatenation Plugin',
        ja: '文字列結合プラグイン',
        zh: '字符串拼接插件',
      },
      description: {
        en: 'Perform flexible string concatenation with fields that cannot be used in normal calculations or with app information',
        ja: '通常の計算では使用できないフィールドや、アプリ情報など、柔軟な文字列の結合を行います',
        zh: '使用无法在常规计算中使用的字段或应用程序信息进行灵活的字符串拼接',
      },
      icon: 'icon.png',
      homepage_url: { ja: hp, en: hp },
      desktop: { js: [`${cdn}/common/desktop.js`], css: [`${cdn}/common/desktop.css`] },
      mobile: { js: [`${cdn}/common/desktop.js`], css: [`${cdn}/common/desktop.css`] },
      config: {
        html: 'config.html',
        js: [`${cdn}/common/config.js`],
        css: [`${cdn}/common/config.css`],
        required_params: [],
      },
    },
    prod: {
      desktop: { js: [`${cdn}/${key}/desktop.js`], css: [`${cdn}/${key}/desktop.css`] },
      mobile: { js: [`${cdn}/${key}/desktop.js`], css: [`${cdn}/${key}/desktop.css`] },
      config: { js: [`${cdn}/${key}/config.js`], css: [`${cdn}/${key}/config.css`] },
    },
    standalone: {
      desktop: { js: ['desktop.js'], css: ['desktop.css'] },
      mobile: { js: ['desktop.js'], css: ['desktop.css'] },
      config: { js: ['config.js'], css: ['config.css'] },
    },
  },
});
