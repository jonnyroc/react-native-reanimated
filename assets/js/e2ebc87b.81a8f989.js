"use strict";(self.webpackChunkreact_native_reanimated_docs=self.webpackChunkreact_native_reanimated_docs||[]).push([[482],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>b});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=s(n),b=a,d=m["".concat(l,".").concat(b)]||m[b]||u[b]||o;return n?r.createElement(d,p(p({ref:t},c),{},{components:n})):r.createElement(d,p({ref:t},c))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,p=new Array(o);p[0]=m;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,p[1]=i;for(var s=2;s<o;s++)p[s]=n[s];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9875:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var r=n(7462),a=(n(7294),n(3905));const o={id:"web-support",title:"Web Support",sidebar_label:"Web Support"},p=void 0,i={unversionedId:"web-support",id:"version-2.1.x/web-support",title:"Web Support",description:"Since the",source:"@site/versioned_docs/version-2.1.x/web-support.md",sourceDirName:".",slug:"/web-support",permalink:"/react-native-reanimated/docs/2.1.x/web-support",draft:!1,tags:[],version:"2.1.x",frontMatter:{id:"web-support",title:"Web Support",sidebar_label:"Web Support"},sidebar:"version-2.1.x/docs",previous:{title:"Migration from v1",permalink:"/react-native-reanimated/docs/2.1.x/migration"},next:{title:"Troubleshooting",permalink:"/react-native-reanimated/docs/2.1.x/troubleshooting"}},l={},s=[{value:"Webpack support",id:"webpack-support",level:2}],c={toc:s};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Since the\n",(0,a.kt)("a",{parentName:"p",href:"https://github.com/software-mansion/react-native-reanimated/releases/tag/2.0.0-alpha.7"},"2.0.0-alpha.7"),"\nrelease it's possible to launch reanimated 2 in a web browser. For that case all of the functionalities are implemented purely in javascript, hence the efficiency of the animations might drop."),(0,a.kt)("p",null,"If you use our\n",(0,a.kt)("a",{parentName:"p",href:"https://github.com/software-mansion-labs/reanimated-2-playground"},"playground"),"\napp and want to start it in the browser just type:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"yarn web\n")),(0,a.kt)("p",null,"If you want to start the example applications from the\n",(0,a.kt)("a",{parentName:"p",href:"https://github.com/software-mansion/react-native-reanimated"},"reanimated repository"),"\nyou need to run the following command inside the ",(0,a.kt)("inlineCode",{parentName:"p"},"Example")," directory:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"yarn start-web\n")),(0,a.kt)("h2",{id:"webpack-support"},"Webpack support"),(0,a.kt)("p",null,"If you want to use Reanimated in a ",(0,a.kt)("inlineCode",{parentName:"p"},"webpack")," app you should adjust your ",(0,a.kt)("inlineCode",{parentName:"p"},"webpack")," config."),(0,a.kt)("p",null,"Example webpack config file with Reanimated support:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js",metastring:"{6,14,15,34}","{6,14,15,34}":!0},"const HtmlWebpackPlugin = require('html-webpack-plugin');\nconst webpack = require('webpack');\n\nmodule.exports = {\n  entry: [\n    'babel-polyfill', \n    './index.js'\n  ],\n  plugins: [\n    new HtmlWebpackPlugin({\n      filename: 'index.html',\n      template: './index.html',\n    }),\n    new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),\n    new webpack.DefinePlugin({ process: { env: {} } })\n  ],\n  module: {\n    rules: [\n      {\n        test: /\\.(js|jsx)$/,\n        use: {\n          loader: 'babel-loader',\n          options: {\n            presets: [\n              '@babel/preset-react',\n              { plugins: ['@babel/plugin-proposal-class-properties'] }\n            ],\n          },\n        },\n      },\n    ],\n  },\n  resolve: {\n    alias: { 'react-native$': 'react-native-web', },\n    extensions: ['.web.js', '.js'],\n  },\n};\n")))}u.isMDXComponent=!0}}]);