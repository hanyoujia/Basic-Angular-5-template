module.exports =  {
    plugins: [
        require('postcss-rtl')( {
            addPrefixToSelector: false, // customized function for joining prefix and selector
            prefixType: 'attribute',    // type of dir-prefix: attribute [dir] or class .dir,
            onlyDirection: false        // "ltr", "rtl": compile only one-direction version
          })
    ],
    ident: 'postcss',
  };