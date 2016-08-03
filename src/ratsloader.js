(function(global, undefined){

    "use strict";
    var
        doc = global.document,
        wating = [],
        ratsloader = {
            version : '0.0.1',
            setting :{
                base:'',
                paths:{}
            },
            debug:false
        };

    ratsloader.config = function(setting){
        this.setting = extend(this.setting,setting);
    };


    ratsloader.require = function(deps,callback) {
        if( typeof(deps) === 'string') {
            loadPath(deps,callback);
        }


        if(isArray(deps) ) {
            wating.push(deps);
            for(var i = 0; i < deps.length; i++){
                loadPath(deps[i],function(){
                    wating.shift(deps[i]);
                    if(wating.length===0) {
                        callback();
                    }
                });
            }
        }
    }

    var loadPath =function(module,callback){
        var urls =  ratsloader.setting &&  ratsloader.setting.paths && ratsloader.setting.paths[module];

        if(!urls) {
            alert('加载模块失败:'+module);
            return;
        }

        var _load = function(url){

            if(isStyle(url)  ){
                ratsloader.setting.debug && console.log('css',url);
                loadStyle(url,callback);
            }

            if(isScript(url)  ){
                ratsloader.setting.debug && console.log('js',url);
                loadScript(url,callback);
            }
        };

        if( typeof(urls) === 'string') {
            var url = urls;
            _load(url,callback)
        }

        if( isArray(urls)) {
            each(urls,function(i,url){
                _load(url);
            });
        }
    }


    var loadStyle = function(url,callback){
        url = ratsloader.setting.base + url;
        var _head = document.getElementsByTagName('head')[0] || document.documentElement,
            _link = doc.createElement("link");
        _link.type = "text/css";
        _link.rel = "stylesheet";
        _link.href = url;

        _head.appendChild(_link);

    };

    var loadScript = function(url,callback){
        url = ratsloader.setting.base + url;

        var _head = document.getElementsByTagName('head')[0] || document.documentElement,
            _script = document.createElement('script');

        _script.type = 'text/javascript';
        _script.charset = 'utf-8';

        if( typeof(callback) === 'function'){
            if(_script.addEventListener) {
                _script.addEventListener("load",callback,false);
            }
            else if(_script.attachEvent){ // 适配ie6-8
                _script.onreadystatechange = function() {
                    if (/loaded|complete/.test(_script.readyState)) {
                        callback();
                    }
                }
            }
        }
        _head.appendChild(_script);

    };


    ratsloader.import = function(deps,callback) {
        if( typeof(deps) === 'string') {
            importPath(deps,callback);
        }

        if(isArray(deps) ) {
            for(var i = 0; i < deps.length; i++){
                importPath(deps[i], callback);
            }
        }

    };


    var importPath =function(module,callback){

        var urls =  ratsloader.setting &&  ratsloader.setting.paths && ratsloader.setting.paths[module];
        if(!urls) {
            alert('加载模块失败:'+module);
            return;
        }

        var _load = function(url){

            if(isStyle(url)  ){
                ratsloader.setting.debug && console.log('css',url);
                importStyle(url);
            }

            if(isScript(url)  ){
                ratsloader.setting.debug && console.log('js',url);
                importScript(url);
            }
        };

        if( typeof(urls) === 'string') {
            var url = urls;
            _load(url)
        }

        if( isArray(urls)) {
            each(urls,function(i,url){
                _load(url);
            });
        }

        if( typeof(callback) === 'function'){
            callback();
        }
    };

    var importStyle = function(url){

        url = ratsloader.setting.base + url;
        if (!document.body || document.readyState == 'loading') {
            document.write('<link rel="stylesheet" type="text/css" href="' + url + '" />');
        }
        else{
            loadScript(url)
        }

    };

    var importScript = function(url){
        url = ratsloader.setting.base + url;

        if (!document.body || document.readyState == 'loading') {
            document.write('<script type="text/javascript" src="' + url + '"><\/script>');
        }
        else{
            loadScript(url)
        }

    };

    var extend = function (target, source) {
        for (var property in source){
            target[property] = source[property];
        }
        return target;
    };

    var each = function (list, callback, isReverse) {
        var i;
        var j;

        if (isArray(list)) {
            for (i = isReverse ? list.length - 1 : 0, j = isReverse ? 0 : list.length;
                 isReverse ? i > j : i < j;
                 isReverse ? i-- : i++) {
                 callback(i, list[i]);
            }
        } else if (typeof(list) === 'object') {
            for (i in list) {
                callback(i, list[i]);
            }
        }
    };

    var isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    var isHttpUrl = function  (url){
        return /^http(s)?:\/\//.test(url);
    };

    var isStyle = function  (url) {
        return /\.css$/i.test(url);
    };

    var isScript = function (url) {
        return /\.js$/i.test(url)
    };

    if(window.ratsloader === undefined) {
        window.ratsloader = ratsloader;
    }

})(window);