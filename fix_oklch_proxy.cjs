const fs = require('fs');
let code = fs.readFileSync('src/DocumentExportEngine.ts', 'utf-8');

const targetProxy = `    const proxyGetComputedStyle = function(el: Element, pseudoElt?: string | null) {
      const style = originalGetComputedStyle(el, pseudoElt);
      return new Proxy(style, {
        get(target: any, prop: string | symbol) {
          if (prop === 'getPropertyValue') {
            return function(propName: string) {
              const val = target.getPropertyValue(propName);
              if (val && typeof val === 'string' && val.includes('oklch')) {
                if (propName.includes('background') || propName.includes('border') && val.includes('transparent')) return 'transparent';
                if (propName.includes('background')) return 'rgb(255, 255, 255)';
                return 'rgb(0, 0, 0)';
              }
              return val;
            };
          }
          let val = target[prop];
          if (typeof val === 'string' && val.includes('oklch')) {
            if (prop.toString().includes('background')) return 'rgb(255, 255, 255)';
            return 'rgb(0, 0, 0)';
          }
          if (typeof val === 'function') {
            return val.bind(target);
          }
          return val;
        }
      });
    };`;

const replacementProxy = `    const proxyGetComputedStyle = function(el: Element, pseudoElt?: string | null) {
      const style = originalGetComputedStyle(el, pseudoElt);
      return new Proxy(style, {
        get(target: any, prop: string | symbol) {
          if (prop === 'getPropertyValue') {
            return function(propName: string) {
              let val = target.getPropertyValue(propName);
              if (val && typeof val === 'string' && val.includes('oklch')) {
                // Approximate fallback for known tailwind shades
                if (val.includes('0.968 0.007 247.896')) return 'rgb(241, 245, 249)'; // slate-100
                if (val.includes('0.985 0 0')) return 'rgb(248, 250, 252)'; // slate-50
                if (val.includes('0.278 0.033 256.848')) return 'rgb(15, 23, 42)'; // slate-900
                if (val.includes('0.379 0.043 257.287')) return 'rgb(30, 41, 59)'; // slate-800
                if (val.includes('0.463 0.046 258.337')) return 'rgb(51, 65, 85)'; // slate-700
                
                if (propName.includes('background') && val.includes(' 0 ')) return 'rgb(255, 255, 255)'; // probably white
                
                if (propName.includes('background')) return 'rgb(241, 245, 249)'; // fallback light
                return 'rgb(15, 23, 42)'; // fallback dark text
              }
              return val;
            };
          }
          let val = target[prop];
          if (typeof val === 'string' && val.includes('oklch')) {
            if (prop.toString().includes('background')) return 'rgb(255, 255, 255)';
            return 'rgb(0, 0, 0)';
          }
          if (typeof val === 'function') {
            return val.bind(target);
          }
          return val;
        }
      });
    };`;

code = code.replace(targetProxy, replacementProxy);
fs.writeFileSync('src/DocumentExportEngine.ts', code);
console.log("Fixed OKLCH Proxy");
