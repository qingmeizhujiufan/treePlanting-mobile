/* 
 * This is an example build file that demonstrates how to use the build system for 
 * require.js. 
 * 
 * THIS BUILD FILE WILL NOT WORK. It is referencing paths that probably 
 * do not exist on your machine. Just use it as a guide. 
 * 
 * 
 */  
  
({  
    // app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径  
//  appDir: ".",  
  
    // 模块根目录。默认情况下所有模块资源都相对此目录。  
    // 若该值未指定，模块则相对build文件所在目录。  
    // 若appDir值已指定，模块根目录baseUrl则相对appDir。  
    baseUrl: "../",  
  
    // 配置文件目录  
//  mainConfigFile: '../require.config.js',   
  
    // 指定输出目录，若值未指定，则相对 build 文件所在目录  
    dir: "../../../js",  
  
    // 在 RequireJS 2.0.2 中，输出目录的所有资源会在 build 前被删除  
    // 值为 true 时 rebuild 更快，但某些特殊情景下可能会出现无法预料的异常  
    keepBuildDir: false,  
  
    // 国际化配置  
    locale: "en-us",  
  
    // JS 文件优化方式，目前支持以下几种：  
    //   uglify: （默认） 使用 UglifyJS 来压缩代码  
    //   closure: 使用 Google's Closure Compiler 的简单优化模式  
    //   closure.keepLines: 使用 closure，但保持换行  
    //   none: 不压缩代码  
    optimize: "none",  
  
    // 使用 UglifyJS 时的可配置参数   
    uglify: {  
        toplevel: true,  
        ascii_only: true,  
        beautify: true,  
        max_line_length: 1000  
    },   
  
    // 处理所有的文本资源依赖项，从而避免为加载资源而产生的大量单独xhr请求  
    inlineText: true,  
  
    // 是否开启严格模式  
    // 由于很多浏览器不支持 ES5 的严格模式，故此配置默认值为 false  
    useStrict: false,  

    // 处理级联依赖，默认为 false，此时能够在运行时动态 require 级联的模块。为 true 时，级联模块会被一同打包  
    findNestedDependencies: false,  
  
    //If set to true, any files that were combined into a build layer will be  
    //removed from the output folder.  
    removeCombined: true,  
  
    modules: [
//  	{
//  		name: 'mui.all'
//  	},  
//
//      // 将 alias 别名为 foo/bar/bop 和 foo/bar/bee 的模块打包成一个文件  
//      {  
//          name: "foo/bar/bop",  
//          include: ["foo/bar/bee"]  
//      },  
//
//      // 将 foo/bar/bip 及其依赖项一并打包，但不包括 foo/bar/bop  
//      {  
//          name: "foo/bar/bip",  
//          exclude: [  
//              "foo/bar/bop"  
//          ]  
//      },  
//
//      // 排除指定模块，但若该模块对所打包文件有级联依赖关系，则仍会被打包进去  
//      {  
//          name: "foo/bar/bin",  
//          excludeShallow: [  
//              "foo/bar/bot"  
//          ]  
//      },  
//
//      // insertRequire 在 RequireJS 2.0 中被引入，在 built 文件的末尾插入 require([]) 以触发模块加载并运行  
//      // insertRequire: ["foo/baz"] 即 require(["foo/baz"])  
//      // 详情见 https://github.com/jrburke/almond  
//      {  
//          name: "foo/baz",  
//          insertRequire: ["foo/baz"]  
//      }  
    ],    
  
    // 不优化某些文件  
//  fileExclusionRegExp: /^(r|build)\.js$/,
  
    // 默认保留模块的 license 注释  
    preserveLicenseComments: true
})  