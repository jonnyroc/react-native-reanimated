"use strict";(self.webpackChunkreact_native_reanimated_docs=self.webpackChunkreact_native_reanimated_docs||[]).push([[8466],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>f});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),u=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),d=u(n),f=a,m=d["".concat(p,".").concat(f)]||d[f]||c[f]||o;return n?r.createElement(m,i(i({ref:t},s),{},{components:n})):r.createElement(m,i({ref:t},s))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},2945:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var r=n(7462),a=(n(7294),n(3905));const o={},i=void 0,l={unversionedId:"nodes/interpolate",id:"version-1.x.x/nodes/interpolate",title:"interpolate",description:"interpolate",source:"@site/versioned_docs/version-1.x.x/nodes/interpolate.md",sourceDirName:"nodes",slug:"/nodes/interpolate",permalink:"/react-native-reanimated/docs/1.x.x/nodes/interpolate",draft:!1,tags:[],version:"1.x.x",frontMatter:{},sidebar:"version-1.x.x/docs",previous:{title:"event",permalink:"/react-native-reanimated/docs/1.x.x/nodes/event"},next:{title:"interpolateColors",permalink:"/react-native-reanimated/docs/1.x.x/nodes/interpolateColors"}},p={},u=[{value:"<code>interpolate</code>",id:"interpolate",level:2},{value:"Note: In order to interpolate color output values, use <code>interpolateColors</code> instead.",id:"note-in-order-to-interpolate-color-output-values-use-interpolatecolors-instead",level:5}],s={toc:u};function c(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"interpolate"},(0,a.kt)("inlineCode",{parentName:"h2"},"interpolate")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"interpolate(node, {\n  // Input range for the interpolation. Should be monotonically increasing.\n  inputRange: [nodeOrValue...],\n  // Output range for the interpolation, should be the same length as the input range.\n  outputRange: [nodeOrValue...],\n  // Sets the left and right extrapolate modes.\n  extrapolate?: Extrapolate.EXTEND | Extrapolate.CLAMP | Extrapolate.IDENTITY,\n  // Set the left extrapolate mode, the behavior if the input is less than the first value in inputRange.\n  extrapolateLeft?: Extrapolate.EXTEND | Extrapolate.CLAMP | Extrapolate.IDENTITY,\n  // Set the right extrapolate mode, the behavior if the input is greater than the last value in inputRange.\n  extrapolateRight?: Extrapolate.EXTEND | Extrapolate.CLAMP | Extrapolate.IDENTITY,\n})\n\nExtrapolate.EXTEND; // Will extend the range linearly.\nExtrapolate.CLAMP; // Will clamp the input value to the range.\nExtrapolate.IDENTITY; // Will return the input value if the input value is out of range.\n")),(0,a.kt)("p",null,"Maps an input value within a range to an output value within a range. Also supports different types of extrapolation for when the value falls outside the range and mapping to strings. For example, if you wanted to animate a rotation you could do:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"concat(\n  interpolate(node, { inputRange: [0, 360], outputRange: [0, 360] }),\n  'deg'\n);\n")),(0,a.kt)("h5",{id:"note-in-order-to-interpolate-color-output-values-use-interpolatecolors-instead"},"Note: In order to interpolate color output values, use ",(0,a.kt)("a",{parentName:"h5",href:"/react-native-reanimated/docs/1.x.x/nodes/interpolateColors"},(0,a.kt)("inlineCode",{parentName:"a"},"interpolateColors"))," instead."))}c.isMDXComponent=!0}}]);