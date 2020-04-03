# van de velde
![Node.js package](https://github.com/gdelpu/vandevelde/workflows/Node.js%20package/badge.svg)

Helper plugin to decorate Hapi objects with module's exports.

#### Note:
Named after "Henry Van de Velde" a famous belgian interior **decorator**  

## Usage

Register **vandevelde** plugin in an Hapi server

```javascript
server.register({
    plugin: require('vandevelde'),
    options: {
        module: './modules/myModule.js',
        name: 'm1',
        decorator: [
            'server',
            'request'        
        ]       
    }
});
```
Vandevelde decorates the mentioned object with an object containing module's exports.

```javascript
server.m1.moduleFunction1();
```
### Options:
- `module` - path to the module hosting the methods for decoration, should be relative to working directory.
- `name` - the decoration name
- `decorator` - List of Hapi objects to decorate (see [HAPI documentation](https://hapi.dev/api/?v=19.1.1#-serverdecoratetype-property-method-options) for more information).
