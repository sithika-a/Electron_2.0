(function(root, factory) {
    root.compareVersions = factory();
}(this, function() {

    var patchPattern = /-([\w-.]+)/;

    function split(v) {
        var temp = v.split('.');
        var arr = temp.splice(0, 2);
        arr.push(temp.join('.'));
        return arr;
    }

    return function compareVersions(v1, v2) {
        var s1 = split(v1);
        var s2 = split(v2);

        for (var i = 0; i < 3; i++) {
            var n1 = parseInt(s1[i] || 0, 10);
            var n2 = parseInt(s2[i] || 0, 10);

            if (n1 > n2) return 1;
            if (n2 > n1) return -1;
        }

        if ((s1[2] + s2[2] + '').indexOf('-') > -1) {
            var p1 = (patchPattern.exec(s1[2]) || [''])[0];
            var p2 = (patchPattern.exec(s2[2]) || [''])[0];

            if (p1 === '') return 1;
            if (p2 === '') return -1;
            if (p1 > p2) return 1;
            if (p2 > p1) return -1;
        }

        return 0;
    };

}));;(function(global,factory){if(typeof module==="object"&&typeof module.exports==="object")factory(global)})(typeof window!=="undefined"?window:this,function(window,noGlobal){var arr=[];var slice=arr.slice;var concat=arr.concat;var push=arr.push;var indexOf=arr.indexOf;var class2type={};var toString=class2type.toString;var hasOwn=class2type.hasOwnProperty;var support={};var document=window.document,version="2.1.4",jQuery=function(selector,context){return new jQuery.fn.init(selector,context)},rtrim=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
rmsPrefix=/^-ms-/,rdashAlpha=/-([\da-z])/gi,fcamelCase=function(all,letter){return letter.toUpperCase()};jQuery.fn=jQuery.prototype={jquery:version,constructor:jQuery,selector:"",length:0,toArray:function(){return slice.call(this)},get:function(num){return num!=null?num<0?this[num+this.length]:this[num]:slice.call(this)},pushStack:function(elems){var ret=jQuery.merge(this.constructor(),elems);ret.prevObject=this;ret.context=this.context;return ret},each:function(callback,args){return jQuery.each(this,
callback,args)},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem)}))},slice:function(){return this.pushStack(slice.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(i){var len=this.length,j=+i+(i<0?len:0);return this.pushStack(j>=0&&j<len?[this[j]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:push,sort:arr.sort,splice:arr.splice};jQuery.extend=jQuery.fn.extend=
function(){var options,name,src,copy,copyIsArray,clone,target=arguments[0]||{},i=1,length=arguments.length,deep=false;if(typeof target==="boolean"){deep=target;target=arguments[i]||{};i++}if(typeof target!=="object"&&!jQuery.isFunction(target))target={};if(i===length){target=this;i--}for(;i<length;i++)if((options=arguments[i])!=null)for(name in options){src=target[name];copy=options[name];if(target===copy)continue;if(deep&&copy&&(jQuery.isPlainObject(copy)||(copyIsArray=jQuery.isArray(copy)))){if(copyIsArray){copyIsArray=
false;clone=src&&jQuery.isArray(src)?src:[]}else clone=src&&jQuery.isPlainObject(src)?src:{};target[name]=jQuery.extend(deep,clone,copy)}else if(copy!==undefined)target[name]=copy}return target};jQuery.extend({expando:"jQuery"+(version+Math.random()).replace(/\D/g,""),isReady:true,error:function(msg){throw new Error(msg);},noop:function(){},isFunction:function(obj){return jQuery.type(obj)==="function"},isArray:Array.isArray,isWindow:function(obj){return obj!=null&&obj===obj.window},isNumeric:function(obj){return!jQuery.isArray(obj)&&
obj-parseFloat(obj)+1>=0},isPlainObject:function(obj){if(jQuery.type(obj)!=="object"||obj.nodeType||jQuery.isWindow(obj))return false;if(obj.constructor&&!hasOwn.call(obj.constructor.prototype,"isPrototypeOf"))return false;return true},isEmptyObject:function(obj){var name;for(name in obj)return false;return true},type:function(obj){if(obj==null)return obj+"";return typeof obj==="object"||typeof obj==="function"?class2type[toString.call(obj)]||"object":typeof obj},globalEval:function(code){var script,
indirect=eval;code=jQuery.trim(code);if(code)if(code.indexOf("use strict")===1){script=document.createElement("script");script.text=code;document.head.appendChild(script).parentNode.removeChild(script)}else indirect(code)},camelCase:function(string){return string.replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase)},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toLowerCase()===name.toLowerCase()},each:function(obj,callback,args){var value,i=0,length=obj.length,isArray=isArraylike(obj);
if(args)if(isArray)for(;i<length;i++){value=callback.apply(obj[i],args);if(value===false)break}else for(i in obj){value=callback.apply(obj[i],args);if(value===false)break}else if(isArray)for(;i<length;i++){value=callback.call(obj[i],i,obj[i]);if(value===false)break}else for(i in obj){value=callback.call(obj[i],i,obj[i]);if(value===false)break}return obj},trim:function(text){return text==null?"":(text+"").replace(rtrim,"")},makeArray:function(arr,results){var ret=results||[];if(arr!=null)if(isArraylike(Object(arr)))jQuery.merge(ret,
typeof arr==="string"?[arr]:arr);else push.call(ret,arr);return ret},inArray:function(elem,arr,i){return arr==null?-1:indexOf.call(arr,elem,i)},merge:function(first,second){var len=+second.length,j=0,i=first.length;for(;j<len;j++)first[i++]=second[j];first.length=i;return first},grep:function(elems,callback,invert){var callbackInverse,matches=[],i=0,length=elems.length,callbackExpect=!invert;for(;i<length;i++){callbackInverse=!callback(elems[i],i);if(callbackInverse!==callbackExpect)matches.push(elems[i])}return matches},
map:function(elems,callback,arg){var value,i=0,length=elems.length,isArray=isArraylike(elems),ret=[];if(isArray)for(;i<length;i++){value=callback(elems[i],i,arg);if(value!=null)ret.push(value)}else for(i in elems){value=callback(elems[i],i,arg);if(value!=null)ret.push(value)}return concat.apply([],ret)},guid:1,proxy:function(fn,context){var tmp,args,proxy;if(typeof context==="string"){tmp=fn[context];context=fn;fn=tmp}if(!jQuery.isFunction(fn))return undefined;args=slice.call(arguments,2);proxy=function(){return fn.apply(context||
this,args.concat(slice.call(arguments)))};proxy.guid=fn.guid=fn.guid||jQuery.guid++;return proxy},now:Date.now,support:support});jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(i,name){class2type["[object "+name+"]"]=name.toLowerCase()});function isArraylike(obj){var length="length"in obj&&obj.length,type=jQuery.type(obj);if(type==="function"||jQuery.isWindow(obj))return false;if(obj.nodeType===1&&length)return true;return type==="array"||length===0||
typeof length==="number"&&length>0&&length-1 in obj}var Sizzle=function(window){var i,support,Expr,getText,isXML,tokenize,compile,select,outermostContext,sortInput,hasDuplicate,setDocument,document,docElem,documentIsHTML,rbuggyQSA,rbuggyMatches,matches,contains,expando="sizzle"+1*new Date,preferredDoc=window.document,dirruns=0,done=0,classCache=createCache(),tokenCache=createCache(),compilerCache=createCache(),sortOrder=function(a,b){if(a===b)hasDuplicate=true;return 0},MAX_NEGATIVE=1<<31,hasOwn=
{}.hasOwnProperty,arr=[],pop=arr.pop,push_native=arr.push,push=arr.push,slice=arr.slice,indexOf=function(list,elem){var i=0,len=list.length;for(;i<len;i++)if(list[i]===elem)return i;return-1},booleans="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",whitespace="[\\x20\\t\\r\\n\\f]",characterEncoding="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",identifier=characterEncoding.replace("w","w#"),attributes="\\["+whitespace+"*("+characterEncoding+
")(?:"+whitespace+"*([*^$|!~]?=)"+whitespace+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+identifier+"))|)"+whitespace+"*\\]",pseudos=":("+characterEncoding+")(?:\\(("+"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|"+"((?:\\\\.|[^\\\\()[\\]]|"+attributes+")*)|"+".*"+")\\)|)",rwhitespace=new RegExp(whitespace+"+","g"),rtrim=new RegExp("^"+whitespace+"+|((?:^|[^\\\\])(?:\\\\.)*)"+whitespace+"+$","g"),rcomma=new RegExp("^"+whitespace+"*,"+whitespace+"*"),rcombinators=new RegExp("^"+
whitespace+"*([>+~]|"+whitespace+")"+whitespace+"*"),rattributeQuotes=new RegExp("="+whitespace+"*([^\\]'\"]*?)"+whitespace+"*\\]","g"),rpseudo=new RegExp(pseudos),ridentifier=new RegExp("^"+identifier+"$"),matchExpr={"ID":new RegExp("^#("+characterEncoding+")"),"CLASS":new RegExp("^\\.("+characterEncoding+")"),"TAG":new RegExp("^("+characterEncoding.replace("w","w*")+")"),"ATTR":new RegExp("^"+attributes),"PSEUDO":new RegExp("^"+pseudos),"CHILD":new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+
whitespace+"*(even|odd|(([+-]|)(\\d*)n|)"+whitespace+"*(?:([+-]|)"+whitespace+"*(\\d+)|))"+whitespace+"*\\)|)","i"),"bool":new RegExp("^(?:"+booleans+")$","i"),"needsContext":new RegExp("^"+whitespace+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+whitespace+"*((?:-\\d)?\\d*)"+whitespace+"*\\)|)(?=[^-]|$)","i")},rinputs=/^(?:input|select|textarea|button)$/i,rheader=/^h\d$/i,rnative=/^[^{]+\{\s*\[native \w/,rquickExpr=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,rsibling=/[+~]/,rescape=/'|\\/g,runescape=
new RegExp("\\\\([\\da-f]{1,6}"+whitespace+"?|("+whitespace+")|.)","ig"),funescape=function(_,escaped,escapedWhitespace){var high="0x"+escaped-65536;return high!==high||escapedWhitespace?escaped:high<0?String.fromCharCode(high+65536):String.fromCharCode(high>>10|55296,high&1023|56320)},unloadHandler=function(){setDocument()};try{push.apply(arr=slice.call(preferredDoc.childNodes),preferredDoc.childNodes);arr[preferredDoc.childNodes.length].nodeType}catch(e){push={apply:arr.length?function(target,els){push_native.apply(target,
slice.call(els))}:function(target,els){var j=target.length,i=0;while(target[j++]=els[i++]);target.length=j-1}}}function Sizzle(selector,context,results,seed){var match,elem,m,nodeType,i,groups,old,nid,newContext,newSelector;if((context?context.ownerDocument||context:preferredDoc)!==document)setDocument(context);context=context||document;results=results||[];nodeType=context.nodeType;if(typeof selector!=="string"||!selector||nodeType!==1&&nodeType!==9&&nodeType!==11)return results;if(!seed&&documentIsHTML){if(nodeType!==
11&&(match=rquickExpr.exec(selector)))if(m=match[1])if(nodeType===9){elem=context.getElementById(m);if(elem&&elem.parentNode){if(elem.id===m){results.push(elem);return results}}else return results}else{if(context.ownerDocument&&(elem=context.ownerDocument.getElementById(m))&&contains(context,elem)&&elem.id===m){results.push(elem);return results}}else if(match[2]){push.apply(results,context.getElementsByTagName(selector));return results}else if((m=match[3])&&support.getElementsByClassName){push.apply(results,
context.getElementsByClassName(m));return results}if(support.qsa&&(!rbuggyQSA||!rbuggyQSA.test(selector))){nid=old=expando;newContext=context;newSelector=nodeType!==1&&selector;if(nodeType===1&&context.nodeName.toLowerCase()!=="object"){groups=tokenize(selector);if(old=context.getAttribute("id"))nid=old.replace(rescape,"\\$&");else context.setAttribute("id",nid);nid="[id='"+nid+"'] ";i=groups.length;while(i--)groups[i]=nid+toSelector(groups[i]);newContext=rsibling.test(selector)&&testContext(context.parentNode)||
context;newSelector=groups.join(",")}if(newSelector)try{push.apply(results,newContext.querySelectorAll(newSelector));return results}catch(qsaError){}finally{if(!old)context.removeAttribute("id")}}}return select(selector.replace(rtrim,"$1"),context,results,seed)}function createCache(){var keys=[];function cache(key,value){if(keys.push(key+" ")>Expr.cacheLength)delete cache[keys.shift()];return cache[key+" "]=value}return cache}function markFunction(fn){fn[expando]=true;return fn}function assert(fn){var div=
document.createElement("div");try{return!!fn(div)}catch(e){return false}finally{if(div.parentNode)div.parentNode.removeChild(div);div=null}}function addHandle(attrs,handler){var arr=attrs.split("|"),i=attrs.length;while(i--)Expr.attrHandle[arr[i]]=handler}function siblingCheck(a,b){var cur=b&&a,diff=cur&&a.nodeType===1&&b.nodeType===1&&(~b.sourceIndex||MAX_NEGATIVE)-(~a.sourceIndex||MAX_NEGATIVE);if(diff)return diff;if(cur)while(cur=cur.nextSibling)if(cur===b)return-1;return a?1:-1}function createInputPseudo(type){return function(elem){var name=
elem.nodeName.toLowerCase();return name==="input"&&elem.type===type}}function createButtonPseudo(type){return function(elem){var name=elem.nodeName.toLowerCase();return(name==="input"||name==="button")&&elem.type===type}}function createPositionalPseudo(fn){return markFunction(function(argument){argument=+argument;return markFunction(function(seed,matches){var j,matchIndexes=fn([],seed.length,argument),i=matchIndexes.length;while(i--)if(seed[j=matchIndexes[i]])seed[j]=!(matches[j]=seed[j])})})}function testContext(context){return context&&
typeof context.getElementsByTagName!=="undefined"&&context}support=Sizzle.support={};isXML=Sizzle.isXML=function(elem){var documentElement=elem&&(elem.ownerDocument||elem).documentElement;return documentElement?documentElement.nodeName!=="HTML":false};setDocument=Sizzle.setDocument=function(node){var hasCompare,parent,doc=node?node.ownerDocument||node:preferredDoc;if(doc===document||doc.nodeType!==9||!doc.documentElement)return document;document=doc;docElem=doc.documentElement;parent=doc.defaultView;
if(parent&&parent!==parent.top)if(parent.addEventListener)parent.addEventListener("unload",unloadHandler,false);else if(parent.attachEvent)parent.attachEvent("onunload",unloadHandler);documentIsHTML=!isXML(doc);support.attributes=assert(function(div){div.className="i";return!div.getAttribute("className")});support.getElementsByTagName=assert(function(div){div.appendChild(doc.createComment(""));return!div.getElementsByTagName("*").length});support.getElementsByClassName=rnative.test(doc.getElementsByClassName);
support.getById=assert(function(div){docElem.appendChild(div).id=expando;return!doc.getElementsByName||!doc.getElementsByName(expando).length});if(support.getById){Expr.find["ID"]=function(id,context){if(typeof context.getElementById!=="undefined"&&documentIsHTML){var m=context.getElementById(id);return m&&m.parentNode?[m]:[]}};Expr.filter["ID"]=function(id){var attrId=id.replace(runescape,funescape);return function(elem){return elem.getAttribute("id")===attrId}}}else{delete Expr.find["ID"];Expr.filter["ID"]=
function(id){var attrId=id.replace(runescape,funescape);return function(elem){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return node&&node.value===attrId}}}Expr.find["TAG"]=support.getElementsByTagName?function(tag,context){if(typeof context.getElementsByTagName!=="undefined")return context.getElementsByTagName(tag);else if(support.qsa)return context.querySelectorAll(tag)}:function(tag,context){var elem,tmp=[],i=0,results=context.getElementsByTagName(tag);if(tag===
"*"){while(elem=results[i++])if(elem.nodeType===1)tmp.push(elem);return tmp}return results};Expr.find["CLASS"]=support.getElementsByClassName&&function(className,context){if(documentIsHTML)return context.getElementsByClassName(className)};rbuggyMatches=[];rbuggyQSA=[];if(support.qsa=rnative.test(doc.querySelectorAll)){assert(function(div){docElem.appendChild(div).innerHTML="<a id='"+expando+"'></a>"+"<select id='"+expando+"-\f]' msallowcapture=''>"+"<option selected=''></option></select>";if(div.querySelectorAll("[msallowcapture^='']").length)rbuggyQSA.push("[*^$]="+
whitespace+"*(?:''|\"\")");if(!div.querySelectorAll("[selected]").length)rbuggyQSA.push("\\["+whitespace+"*(?:value|"+booleans+")");if(!div.querySelectorAll("[id~="+expando+"-]").length)rbuggyQSA.push("~=");if(!div.querySelectorAll(":checked").length)rbuggyQSA.push(":checked");if(!div.querySelectorAll("a#"+expando+"+*").length)rbuggyQSA.push(".#.+[+~]")});assert(function(div){var input=doc.createElement("input");input.setAttribute("type","hidden");div.appendChild(input).setAttribute("name","D");if(div.querySelectorAll("[name=d]").length)rbuggyQSA.push("name"+
whitespace+"*[*^$|!~]?=");if(!div.querySelectorAll(":enabled").length)rbuggyQSA.push(":enabled",":disabled");div.querySelectorAll("*,:x");rbuggyQSA.push(",.*:")})}if(support.matchesSelector=rnative.test(matches=docElem.matches||docElem.webkitMatchesSelector||docElem.mozMatchesSelector||docElem.oMatchesSelector||docElem.msMatchesSelector))assert(function(div){support.disconnectedMatch=matches.call(div,"div");matches.call(div,"[s!='']:x");rbuggyMatches.push("!=",pseudos)});rbuggyQSA=rbuggyQSA.length&&
new RegExp(rbuggyQSA.join("|"));rbuggyMatches=rbuggyMatches.length&&new RegExp(rbuggyMatches.join("|"));hasCompare=rnative.test(docElem.compareDocumentPosition);contains=hasCompare||rnative.test(docElem.contains)?function(a,b){var adown=a.nodeType===9?a.documentElement:a,bup=b&&b.parentNode;return a===bup||!!(bup&&bup.nodeType===1&&(adown.contains?adown.contains(bup):a.compareDocumentPosition&&a.compareDocumentPosition(bup)&16))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return true;return false};
sortOrder=hasCompare?function(a,b){if(a===b){hasDuplicate=true;return 0}var compare=!a.compareDocumentPosition-!b.compareDocumentPosition;if(compare)return compare;compare=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1;if(compare&1||!support.sortDetached&&b.compareDocumentPosition(a)===compare){if(a===doc||a.ownerDocument===preferredDoc&&contains(preferredDoc,a))return-1;if(b===doc||b.ownerDocument===preferredDoc&&contains(preferredDoc,b))return 1;return sortInput?indexOf(sortInput,
a)-indexOf(sortInput,b):0}return compare&4?-1:1}:function(a,b){if(a===b){hasDuplicate=true;return 0}var cur,i=0,aup=a.parentNode,bup=b.parentNode,ap=[a],bp=[b];if(!aup||!bup)return a===doc?-1:b===doc?1:aup?-1:bup?1:sortInput?indexOf(sortInput,a)-indexOf(sortInput,b):0;else if(aup===bup)return siblingCheck(a,b);cur=a;while(cur=cur.parentNode)ap.unshift(cur);cur=b;while(cur=cur.parentNode)bp.unshift(cur);while(ap[i]===bp[i])i++;return i?siblingCheck(ap[i],bp[i]):ap[i]===preferredDoc?-1:bp[i]===preferredDoc?
1:0};return doc};Sizzle.matches=function(expr,elements){return Sizzle(expr,null,null,elements)};Sizzle.matchesSelector=function(elem,expr){if((elem.ownerDocument||elem)!==document)setDocument(elem);expr=expr.replace(rattributeQuotes,"='$1']");if(support.matchesSelector&&documentIsHTML&&(!rbuggyMatches||!rbuggyMatches.test(expr))&&(!rbuggyQSA||!rbuggyQSA.test(expr)))try{var ret=matches.call(elem,expr);if(ret||support.disconnectedMatch||elem.document&&elem.document.nodeType!==11)return ret}catch(e){}return Sizzle(expr,
document,null,[elem]).length>0};Sizzle.contains=function(context,elem){if((context.ownerDocument||context)!==document)setDocument(context);return contains(context,elem)};Sizzle.attr=function(elem,name){if((elem.ownerDocument||elem)!==document)setDocument(elem);var fn=Expr.attrHandle[name.toLowerCase()],val=fn&&hasOwn.call(Expr.attrHandle,name.toLowerCase())?fn(elem,name,!documentIsHTML):undefined;return val!==undefined?val:support.attributes||!documentIsHTML?elem.getAttribute(name):(val=elem.getAttributeNode(name))&&
val.specified?val.value:null};Sizzle.error=function(msg){throw new Error("Syntax error, unrecognized expression: "+msg);};Sizzle.uniqueSort=function(results){var elem,duplicates=[],j=0,i=0;hasDuplicate=!support.detectDuplicates;sortInput=!support.sortStable&&results.slice(0);results.sort(sortOrder);if(hasDuplicate){while(elem=results[i++])if(elem===results[i])j=duplicates.push(i);while(j--)results.splice(duplicates[j],1)}sortInput=null;return results};getText=Sizzle.getText=function(elem){var node,
ret="",i=0,nodeType=elem.nodeType;if(!nodeType)while(node=elem[i++])ret+=getText(node);else if(nodeType===1||nodeType===9||nodeType===11)if(typeof elem.textContent==="string")return elem.textContent;else for(elem=elem.firstChild;elem;elem=elem.nextSibling)ret+=getText(elem);else if(nodeType===3||nodeType===4)return elem.nodeValue;return ret};Expr=Sizzle.selectors={cacheLength:50,createPseudo:markFunction,match:matchExpr,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},
"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{"ATTR":function(match){match[1]=match[1].replace(runescape,funescape);match[3]=(match[3]||match[4]||match[5]||"").replace(runescape,funescape);if(match[2]==="~=")match[3]=" "+match[3]+" ";return match.slice(0,4)},"CHILD":function(match){match[1]=match[1].toLowerCase();if(match[1].slice(0,3)==="nth"){if(!match[3])Sizzle.error(match[0]);match[4]=+(match[4]?match[5]+(match[6]||1):2*(match[3]==="even"||match[3]==="odd"));match[5]=
+(match[7]+match[8]||match[3]==="odd")}else if(match[3])Sizzle.error(match[0]);return match},"PSEUDO":function(match){var excess,unquoted=!match[6]&&match[2];if(matchExpr["CHILD"].test(match[0]))return null;if(match[3])match[2]=match[4]||match[5]||"";else if(unquoted&&rpseudo.test(unquoted)&&(excess=tokenize(unquoted,true))&&(excess=unquoted.indexOf(")",unquoted.length-excess)-unquoted.length)){match[0]=match[0].slice(0,excess);match[2]=unquoted.slice(0,excess)}return match.slice(0,3)}},filter:{"TAG":function(nodeNameSelector){var nodeName=
nodeNameSelector.replace(runescape,funescape).toLowerCase();return nodeNameSelector==="*"?function(){return true}:function(elem){return elem.nodeName&&elem.nodeName.toLowerCase()===nodeName}},"CLASS":function(className){var pattern=classCache[className+" "];return pattern||(pattern=new RegExp("(^|"+whitespace+")"+className+"("+whitespace+"|$)"))&&classCache(className,function(elem){return pattern.test(typeof elem.className==="string"&&elem.className||typeof elem.getAttribute!=="undefined"&&elem.getAttribute("class")||
"")})},"ATTR":function(name,operator,check){return function(elem){var result=Sizzle.attr(elem,name);if(result==null)return operator==="!=";if(!operator)return true;result+="";return operator==="="?result===check:operator==="!="?result!==check:operator==="^="?check&&result.indexOf(check)===0:operator==="*="?check&&result.indexOf(check)>-1:operator==="$="?check&&result.slice(-check.length)===check:operator==="~="?(" "+result.replace(rwhitespace," ")+" ").indexOf(check)>-1:operator==="|="?result===check||
result.slice(0,check.length+1)===check+"-":false}},"CHILD":function(type,what,argument,first,last){var simple=type.slice(0,3)!=="nth",forward=type.slice(-4)!=="last",ofType=what==="of-type";return first===1&&last===0?function(elem){return!!elem.parentNode}:function(elem,context,xml){var cache,outerCache,node,diff,nodeIndex,start,dir=simple!==forward?"nextSibling":"previousSibling",parent=elem.parentNode,name=ofType&&elem.nodeName.toLowerCase(),useCache=!xml&&!ofType;if(parent){if(simple){while(dir){node=
elem;while(node=node[dir])if(ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)return false;start=dir=type==="only"&&!start&&"nextSibling"}return true}start=[forward?parent.firstChild:parent.lastChild];if(forward&&useCache){outerCache=parent[expando]||(parent[expando]={});cache=outerCache[type]||[];nodeIndex=cache[0]===dirruns&&cache[1];diff=cache[0]===dirruns&&cache[2];node=nodeIndex&&parent.childNodes[nodeIndex];while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop())if(node.nodeType===
1&&++diff&&node===elem){outerCache[type]=[dirruns,nodeIndex,diff];break}}else if(useCache&&(cache=(elem[expando]||(elem[expando]={}))[type])&&cache[0]===dirruns)diff=cache[1];else while(node=++nodeIndex&&node&&node[dir]||(diff=nodeIndex=0)||start.pop())if((ofType?node.nodeName.toLowerCase()===name:node.nodeType===1)&&++diff){if(useCache)(node[expando]||(node[expando]={}))[type]=[dirruns,diff];if(node===elem)break}diff-=last;return diff===first||diff%first===0&&diff/first>=0}}},"PSEUDO":function(pseudo,
argument){var args,fn=Expr.pseudos[pseudo]||Expr.setFilters[pseudo.toLowerCase()]||Sizzle.error("unsupported pseudo: "+pseudo);if(fn[expando])return fn(argument);if(fn.length>1){args=[pseudo,pseudo,"",argument];return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase())?markFunction(function(seed,matches){var idx,matched=fn(seed,argument),i=matched.length;while(i--){idx=indexOf(seed,matched[i]);seed[idx]=!(matches[idx]=matched[i])}}):function(elem){return fn(elem,0,args)}}return fn}},pseudos:{"not":markFunction(function(selector){var input=
[],results=[],matcher=compile(selector.replace(rtrim,"$1"));return matcher[expando]?markFunction(function(seed,matches,context,xml){var elem,unmatched=matcher(seed,null,xml,[]),i=seed.length;while(i--)if(elem=unmatched[i])seed[i]=!(matches[i]=elem)}):function(elem,context,xml){input[0]=elem;matcher(input,null,xml,results);input[0]=null;return!results.pop()}}),"has":markFunction(function(selector){return function(elem){return Sizzle(selector,elem).length>0}}),"contains":markFunction(function(text){text=
text.replace(runescape,funescape);return function(elem){return(elem.textContent||elem.innerText||getText(elem)).indexOf(text)>-1}}),"lang":markFunction(function(lang){if(!ridentifier.test(lang||""))Sizzle.error("unsupported lang: "+lang);lang=lang.replace(runescape,funescape).toLowerCase();return function(elem){var elemLang;do if(elemLang=documentIsHTML?elem.lang:elem.getAttribute("xml:lang")||elem.getAttribute("lang")){elemLang=elemLang.toLowerCase();return elemLang===lang||elemLang.indexOf(lang+
"-")===0}while((elem=elem.parentNode)&&elem.nodeType===1);return false}}),"target":function(elem){var hash=window.location&&window.location.hash;return hash&&hash.slice(1)===elem.id},"root":function(elem){return elem===docElem},"focus":function(elem){return elem===document.activeElement&&(!document.hasFocus||document.hasFocus())&&!!(elem.type||elem.href||~elem.tabIndex)},"enabled":function(elem){return elem.disabled===false},"disabled":function(elem){return elem.disabled===true},"checked":function(elem){var nodeName=
elem.nodeName.toLowerCase();return nodeName==="input"&&!!elem.checked||nodeName==="option"&&!!elem.selected},"selected":function(elem){if(elem.parentNode)elem.parentNode.selectedIndex;return elem.selected===true},"empty":function(elem){for(elem=elem.firstChild;elem;elem=elem.nextSibling)if(elem.nodeType<6)return false;return true},"parent":function(elem){return!Expr.pseudos["empty"](elem)},"header":function(elem){return rheader.test(elem.nodeName)},"input":function(elem){return rinputs.test(elem.nodeName)},
"button":function(elem){var name=elem.nodeName.toLowerCase();return name==="input"&&elem.type==="button"||name==="button"},"text":function(elem){var attr;return elem.nodeName.toLowerCase()==="input"&&elem.type==="text"&&((attr=elem.getAttribute("type"))==null||attr.toLowerCase()==="text")},"first":createPositionalPseudo(function(){return[0]}),"last":createPositionalPseudo(function(matchIndexes,length){return[length-1]}),"eq":createPositionalPseudo(function(matchIndexes,length,argument){return[argument<
0?argument+length:argument]}),"even":createPositionalPseudo(function(matchIndexes,length){var i=0;for(;i<length;i+=2)matchIndexes.push(i);return matchIndexes}),"odd":createPositionalPseudo(function(matchIndexes,length){var i=1;for(;i<length;i+=2)matchIndexes.push(i);return matchIndexes}),"lt":createPositionalPseudo(function(matchIndexes,length,argument){var i=argument<0?argument+length:argument;for(;--i>=0;)matchIndexes.push(i);return matchIndexes}),"gt":createPositionalPseudo(function(matchIndexes,
length,argument){var i=argument<0?argument+length:argument;for(;++i<length;)matchIndexes.push(i);return matchIndexes})}};Expr.pseudos["nth"]=Expr.pseudos["eq"];for(i in{radio:true,checkbox:true,file:true,password:true,image:true})Expr.pseudos[i]=createInputPseudo(i);for(i in{submit:true,reset:true})Expr.pseudos[i]=createButtonPseudo(i);function setFilters(){}setFilters.prototype=Expr.filters=Expr.pseudos;Expr.setFilters=new setFilters;tokenize=Sizzle.tokenize=function(selector,parseOnly){var matched,
match,tokens,type,soFar,groups,preFilters,cached=tokenCache[selector+" "];if(cached)return parseOnly?0:cached.slice(0);soFar=selector;groups=[];preFilters=Expr.preFilter;while(soFar){if(!matched||(match=rcomma.exec(soFar))){if(match)soFar=soFar.slice(match[0].length)||soFar;groups.push(tokens=[])}matched=false;if(match=rcombinators.exec(soFar)){matched=match.shift();tokens.push({value:matched,type:match[0].replace(rtrim," ")});soFar=soFar.slice(matched.length)}for(type in Expr.filter)if((match=matchExpr[type].exec(soFar))&&
(!preFilters[type]||(match=preFilters[type](match)))){matched=match.shift();tokens.push({value:matched,type:type,matches:match});soFar=soFar.slice(matched.length)}if(!matched)break}return parseOnly?soFar.length:soFar?Sizzle.error(selector):tokenCache(selector,groups).slice(0)};function toSelector(tokens){var i=0,len=tokens.length,selector="";for(;i<len;i++)selector+=tokens[i].value;return selector}function addCombinator(matcher,combinator,base){var dir=combinator.dir,checkNonElements=base&&dir===
"parentNode",doneName=done++;return combinator.first?function(elem,context,xml){while(elem=elem[dir])if(elem.nodeType===1||checkNonElements)return matcher(elem,context,xml)}:function(elem,context,xml){var oldCache,outerCache,newCache=[dirruns,doneName];if(xml)while(elem=elem[dir]){if(elem.nodeType===1||checkNonElements)if(matcher(elem,context,xml))return true}else while(elem=elem[dir])if(elem.nodeType===1||checkNonElements){outerCache=elem[expando]||(elem[expando]={});if((oldCache=outerCache[dir])&&
oldCache[0]===dirruns&&oldCache[1]===doneName)return newCache[2]=oldCache[2];else{outerCache[dir]=newCache;if(newCache[2]=matcher(elem,context,xml))return true}}}}function elementMatcher(matchers){return matchers.length>1?function(elem,context,xml){var i=matchers.length;while(i--)if(!matchers[i](elem,context,xml))return false;return true}:matchers[0]}function multipleContexts(selector,contexts,results){var i=0,len=contexts.length;for(;i<len;i++)Sizzle(selector,contexts[i],results);return results}
function condense(unmatched,map,filter,context,xml){var elem,newUnmatched=[],i=0,len=unmatched.length,mapped=map!=null;for(;i<len;i++)if(elem=unmatched[i])if(!filter||filter(elem,context,xml)){newUnmatched.push(elem);if(mapped)map.push(i)}return newUnmatched}function setMatcher(preFilter,selector,matcher,postFilter,postFinder,postSelector){if(postFilter&&!postFilter[expando])postFilter=setMatcher(postFilter);if(postFinder&&!postFinder[expando])postFinder=setMatcher(postFinder,postSelector);return markFunction(function(seed,
results,context,xml){var temp,i,elem,preMap=[],postMap=[],preexisting=results.length,elems=seed||multipleContexts(selector||"*",context.nodeType?[context]:context,[]),matcherIn=preFilter&&(seed||!selector)?condense(elems,preMap,preFilter,context,xml):elems,matcherOut=matcher?postFinder||(seed?preFilter:preexisting||postFilter)?[]:results:matcherIn;if(matcher)matcher(matcherIn,matcherOut,context,xml);if(postFilter){temp=condense(matcherOut,postMap);postFilter(temp,[],context,xml);i=temp.length;while(i--)if(elem=
temp[i])matcherOut[postMap[i]]=!(matcherIn[postMap[i]]=elem)}if(seed){if(postFinder||preFilter){if(postFinder){temp=[];i=matcherOut.length;while(i--)if(elem=matcherOut[i])temp.push(matcherIn[i]=elem);postFinder(null,matcherOut=[],temp,xml)}i=matcherOut.length;while(i--)if((elem=matcherOut[i])&&(temp=postFinder?indexOf(seed,elem):preMap[i])>-1)seed[temp]=!(results[temp]=elem)}}else{matcherOut=condense(matcherOut===results?matcherOut.splice(preexisting,matcherOut.length):matcherOut);if(postFinder)postFinder(null,
results,matcherOut,xml);else push.apply(results,matcherOut)}})}function matcherFromTokens(tokens){var checkContext,matcher,j,len=tokens.length,leadingRelative=Expr.relative[tokens[0].type],implicitRelative=leadingRelative||Expr.relative[" "],i=leadingRelative?1:0,matchContext=addCombinator(function(elem){return elem===checkContext},implicitRelative,true),matchAnyContext=addCombinator(function(elem){return indexOf(checkContext,elem)>-1},implicitRelative,true),matchers=[function(elem,context,xml){var ret=
!leadingRelative&&(xml||context!==outermostContext)||((checkContext=context).nodeType?matchContext(elem,context,xml):matchAnyContext(elem,context,xml));checkContext=null;return ret}];for(;i<len;i++)if(matcher=Expr.relative[tokens[i].type])matchers=[addCombinator(elementMatcher(matchers),matcher)];else{matcher=Expr.filter[tokens[i].type].apply(null,tokens[i].matches);if(matcher[expando]){j=++i;for(;j<len;j++)if(Expr.relative[tokens[j].type])break;return setMatcher(i>1&&elementMatcher(matchers),i>1&&
toSelector(tokens.slice(0,i-1).concat({value:tokens[i-2].type===" "?"*":""})).replace(rtrim,"$1"),matcher,i<j&&matcherFromTokens(tokens.slice(i,j)),j<len&&matcherFromTokens(tokens=tokens.slice(j)),j<len&&toSelector(tokens))}matchers.push(matcher)}return elementMatcher(matchers)}function matcherFromGroupMatchers(elementMatchers,setMatchers){var bySet=setMatchers.length>0,byElement=elementMatchers.length>0,superMatcher=function(seed,context,xml,results,outermost){var elem,j,matcher,matchedCount=0,i=
"0",unmatched=seed&&[],setMatched=[],contextBackup=outermostContext,elems=seed||byElement&&Expr.find["TAG"]("*",outermost),dirrunsUnique=dirruns+=contextBackup==null?1:Math.random()||.1,len=elems.length;if(outermost)outermostContext=context!==document&&context;for(;i!==len&&(elem=elems[i])!=null;i++){if(byElement&&elem){j=0;while(matcher=elementMatchers[j++])if(matcher(elem,context,xml)){results.push(elem);break}if(outermost)dirruns=dirrunsUnique}if(bySet){if(elem=!matcher&&elem)matchedCount--;if(seed)unmatched.push(elem)}}matchedCount+=
i;if(bySet&&i!==matchedCount){j=0;while(matcher=setMatchers[j++])matcher(unmatched,setMatched,context,xml);if(seed){if(matchedCount>0)while(i--)if(!(unmatched[i]||setMatched[i]))setMatched[i]=pop.call(results);setMatched=condense(setMatched)}push.apply(results,setMatched);if(outermost&&!seed&&setMatched.length>0&&matchedCount+setMatchers.length>1)Sizzle.uniqueSort(results)}if(outermost){dirruns=dirrunsUnique;outermostContext=contextBackup}return unmatched};return bySet?markFunction(superMatcher):
superMatcher}compile=Sizzle.compile=function(selector,match){var i,setMatchers=[],elementMatchers=[],cached=compilerCache[selector+" "];if(!cached){if(!match)match=tokenize(selector);i=match.length;while(i--){cached=matcherFromTokens(match[i]);if(cached[expando])setMatchers.push(cached);else elementMatchers.push(cached)}cached=compilerCache(selector,matcherFromGroupMatchers(elementMatchers,setMatchers));cached.selector=selector}return cached};select=Sizzle.select=function(selector,context,results,
seed){var i,tokens,token,type,find,compiled=typeof selector==="function"&&selector,match=!seed&&tokenize(selector=compiled.selector||selector);results=results||[];if(match.length===1){tokens=match[0]=match[0].slice(0);if(tokens.length>2&&(token=tokens[0]).type==="ID"&&support.getById&&context.nodeType===9&&documentIsHTML&&Expr.relative[tokens[1].type]){context=(Expr.find["ID"](token.matches[0].replace(runescape,funescape),context)||[])[0];if(!context)return results;else if(compiled)context=context.parentNode;
selector=selector.slice(tokens.shift().value.length)}i=matchExpr["needsContext"].test(selector)?0:tokens.length;while(i--){token=tokens[i];if(Expr.relative[type=token.type])break;if(find=Expr.find[type])if(seed=find(token.matches[0].replace(runescape,funescape),rsibling.test(tokens[0].type)&&testContext(context.parentNode)||context)){tokens.splice(i,1);selector=seed.length&&toSelector(tokens);if(!selector){push.apply(results,seed);return results}break}}}(compiled||compile(selector,match))(seed,context,
!documentIsHTML,results,rsibling.test(selector)&&testContext(context.parentNode)||context);return results};support.sortStable=expando.split("").sort(sortOrder).join("")===expando;support.detectDuplicates=!!hasDuplicate;setDocument();support.sortDetached=assert(function(div1){return div1.compareDocumentPosition(document.createElement("div"))&1});if(!assert(function(div){div.innerHTML="<a href='#'></a>";return div.firstChild.getAttribute("href")==="#"}))addHandle("type|href|height|width",function(elem,
name,isXML){if(!isXML)return elem.getAttribute(name,name.toLowerCase()==="type"?1:2)});if(!support.attributes||!assert(function(div){div.innerHTML="<input/>";div.firstChild.setAttribute("value","");return div.firstChild.getAttribute("value")===""}))addHandle("value",function(elem,name,isXML){if(!isXML&&elem.nodeName.toLowerCase()==="input")return elem.defaultValue});if(!assert(function(div){return div.getAttribute("disabled")==null}))addHandle(booleans,function(elem,name,isXML){var val;if(!isXML)return elem[name]===
true?name.toLowerCase():(val=elem.getAttributeNode(name))&&val.specified?val.value:null});return Sizzle}(window);jQuery.find=Sizzle;jQuery.expr=Sizzle.selectors;jQuery.expr[":"]=jQuery.expr.pseudos;jQuery.unique=Sizzle.uniqueSort;jQuery.text=Sizzle.getText;jQuery.isXMLDoc=Sizzle.isXML;jQuery.contains=Sizzle.contains;var rneedsContext=jQuery.expr.match.needsContext;var rsingleTag=/^<(\w+)\s*\/?>(?:<\/\1>|)$/;var risSimple=/^.[^:#\[\.,]*$/;function winnow(elements,qualifier,not){if(jQuery.isFunction(qualifier))return jQuery.grep(elements,
function(elem,i){return!!qualifier.call(elem,i,elem)!==not});if(qualifier.nodeType)return jQuery.grep(elements,function(elem){return elem===qualifier!==not});if(typeof qualifier==="string"){if(risSimple.test(qualifier))return jQuery.filter(qualifier,elements,not);qualifier=jQuery.filter(qualifier,elements)}return jQuery.grep(elements,function(elem){return indexOf.call(qualifier,elem)>=0!==not})}jQuery.filter=function(expr,elems,not){var elem=elems[0];if(not)expr=":not("+expr+")";return elems.length===
1&&elem.nodeType===1?jQuery.find.matchesSelector(elem,expr)?[elem]:[]:jQuery.find.matches(expr,jQuery.grep(elems,function(elem){return elem.nodeType===1}))};jQuery.fn.extend({find:function(selector){var i,len=this.length,ret=[],self=this;if(typeof selector!=="string")return this.pushStack(jQuery(selector).filter(function(){for(i=0;i<len;i++)if(jQuery.contains(self[i],this))return true}));for(i=0;i<len;i++)jQuery.find(selector,self[i],ret);ret=this.pushStack(len>1?jQuery.unique(ret):ret);ret.selector=
this.selector?this.selector+" "+selector:selector;return ret},filter:function(selector){return this.pushStack(winnow(this,selector||[],false))},not:function(selector){return this.pushStack(winnow(this,selector||[],true))},is:function(selector){return!!winnow(this,typeof selector==="string"&&rneedsContext.test(selector)?jQuery(selector):selector||[],false).length}});var rootjQuery,rquickExpr=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,init=jQuery.fn.init=function(selector,context){var match,elem;if(!selector)return this;
if(typeof selector==="string"){if(selector[0]==="<"&&selector[selector.length-1]===">"&&selector.length>=3)match=[null,selector,null];else match=rquickExpr.exec(selector);if(match&&(match[1]||!context))if(match[1]){context=context instanceof jQuery?context[0]:context;jQuery.merge(this,jQuery.parseHTML(match[1],context&&context.nodeType?context.ownerDocument||context:document,true));if(rsingleTag.test(match[1])&&jQuery.isPlainObject(context))for(match in context)if(jQuery.isFunction(this[match]))this[match](context[match]);
else this.attr(match,context[match]);return this}else{elem=document.getElementById(match[2]);if(elem&&elem.parentNode){this.length=1;this[0]=elem}this.context=document;this.selector=selector;return this}else if(!context||context.jquery)return(context||rootjQuery).find(selector);else return this.constructor(context).find(selector)}else if(selector.nodeType){this.context=this[0]=selector;this.length=1;return this}else if(jQuery.isFunction(selector))return typeof rootjQuery.ready!=="undefined"?rootjQuery.ready(selector):
selector(jQuery);if(selector.selector!==undefined){this.selector=selector.selector;this.context=selector.context}return jQuery.makeArray(selector,this)};init.prototype=jQuery.fn;rootjQuery=jQuery(document);var rparentsprev=/^(?:parents|prev(?:Until|All))/,guaranteedUnique={children:true,contents:true,next:true,prev:true};jQuery.extend({dir:function(elem,dir,until){var matched=[],truncate=until!==undefined;while((elem=elem[dir])&&elem.nodeType!==9)if(elem.nodeType===1){if(truncate&&jQuery(elem).is(until))break;
matched.push(elem)}return matched},sibling:function(n,elem){var matched=[];for(;n;n=n.nextSibling)if(n.nodeType===1&&n!==elem)matched.push(n);return matched}});jQuery.fn.extend({has:function(target){var targets=jQuery(target,this),l=targets.length;return this.filter(function(){var i=0;for(;i<l;i++)if(jQuery.contains(this,targets[i]))return true})},closest:function(selectors,context){var cur,i=0,l=this.length,matched=[],pos=rneedsContext.test(selectors)||typeof selectors!=="string"?jQuery(selectors,
context||this.context):0;for(;i<l;i++)for(cur=this[i];cur&&cur!==context;cur=cur.parentNode)if(cur.nodeType<11&&(pos?pos.index(cur)>-1:cur.nodeType===1&&jQuery.find.matchesSelector(cur,selectors))){matched.push(cur);break}return this.pushStack(matched.length>1?jQuery.unique(matched):matched)},index:function(elem){if(!elem)return this[0]&&this[0].parentNode?this.first().prevAll().length:-1;if(typeof elem==="string")return indexOf.call(jQuery(elem),this[0]);return indexOf.call(this,elem.jquery?elem[0]:
elem)},add:function(selector,context){return this.pushStack(jQuery.unique(jQuery.merge(this.get(),jQuery(selector,context))))},addBack:function(selector){return this.add(selector==null?this.prevObject:this.prevObject.filter(selector))}});function sibling(cur,dir){while((cur=cur[dir])&&cur.nodeType!==1);return cur}jQuery.each({parent:function(elem){var parent=elem.parentNode;return parent&&parent.nodeType!==11?parent:null},parents:function(elem){return jQuery.dir(elem,"parentNode")},parentsUntil:function(elem,
i,until){return jQuery.dir(elem,"parentNode",until)},next:function(elem){return sibling(elem,"nextSibling")},prev:function(elem){return sibling(elem,"previousSibling")},nextAll:function(elem){return jQuery.dir(elem,"nextSibling")},prevAll:function(elem){return jQuery.dir(elem,"previousSibling")},nextUntil:function(elem,i,until){return jQuery.dir(elem,"nextSibling",until)},prevUntil:function(elem,i,until){return jQuery.dir(elem,"previousSibling",until)},siblings:function(elem){return jQuery.sibling((elem.parentNode||
{}).firstChild,elem)},children:function(elem){return jQuery.sibling(elem.firstChild)},contents:function(elem){return elem.contentDocument||jQuery.merge([],elem.childNodes)}},function(name,fn){jQuery.fn[name]=function(until,selector){var matched=jQuery.map(this,fn,until);if(name.slice(-5)!=="Until")selector=until;if(selector&&typeof selector==="string")matched=jQuery.filter(selector,matched);if(this.length>1){if(!guaranteedUnique[name])jQuery.unique(matched);if(rparentsprev.test(name))matched.reverse()}return this.pushStack(matched)}});
var rnotwhite=/\S+/g;var optionsCache={};function createOptions(options){var object=optionsCache[options]={};jQuery.each(options.match(rnotwhite)||[],function(_,flag){object[flag]=true});return object}jQuery.Callbacks=function(options){options=typeof options==="string"?optionsCache[options]||createOptions(options):jQuery.extend({},options);var memory,fired,firing,firingStart,firingLength,firingIndex,list=[],stack=!options.once&&[],fire=function(data){memory=options.memory&&data;fired=true;firingIndex=
firingStart||0;firingStart=0;firingLength=list.length;firing=true;for(;list&&firingIndex<firingLength;firingIndex++)if(list[firingIndex].apply(data[0],data[1])===false&&options.stopOnFalse){memory=false;break}firing=false;if(list)if(stack){if(stack.length)fire(stack.shift())}else if(memory)list=[];else self.disable()},self={add:function(){if(list){var start=list.length;(function add(args){jQuery.each(args,function(_,arg){var type=jQuery.type(arg);if(type==="function"){if(!options.unique||!self.has(arg))list.push(arg)}else if(arg&&
arg.length&&type!=="string")add(arg)})})(arguments);if(firing)firingLength=list.length;else if(memory){firingStart=start;fire(memory)}}return this},remove:function(){if(list)jQuery.each(arguments,function(_,arg){var index;while((index=jQuery.inArray(arg,list,index))>-1){list.splice(index,1);if(firing){if(index<=firingLength)firingLength--;if(index<=firingIndex)firingIndex--}}});return this},has:function(fn){return fn?jQuery.inArray(fn,list)>-1:!!(list&&list.length)},empty:function(){list=[];firingLength=
0;return this},disable:function(){list=stack=memory=undefined;return this},disabled:function(){return!list},lock:function(){stack=undefined;if(!memory)self.disable();return this},locked:function(){return!stack},fireWith:function(context,args){if(list&&(!fired||stack)){args=args||[];args=[context,args.slice?args.slice():args];if(firing)stack.push(args);else fire(args)}return this},fire:function(){self.fireWith(this,arguments);return this},fired:function(){return!!fired}};return self};jQuery.extend({Deferred:function(func){var tuples=
[["resolve","done",jQuery.Callbacks("once memory"),"resolved"],["reject","fail",jQuery.Callbacks("once memory"),"rejected"],["notify","progress",jQuery.Callbacks("memory")]],state="pending",promise={state:function(){return state},always:function(){deferred.done(arguments).fail(arguments);return this},then:function(){var fns=arguments;return jQuery.Deferred(function(newDefer){jQuery.each(tuples,function(i,tuple){var fn=jQuery.isFunction(fns[i])&&fns[i];deferred[tuple[1]](function(){var returned=fn&&
fn.apply(this,arguments);if(returned&&jQuery.isFunction(returned.promise))returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);else newDefer[tuple[0]+"With"](this===promise?newDefer.promise():this,fn?[returned]:arguments)})});fns=null}).promise()},promise:function(obj){return obj!=null?jQuery.extend(obj,promise):promise}},deferred={};promise.pipe=promise.then;jQuery.each(tuples,function(i,tuple){var list=tuple[2],stateString=tuple[3];promise[tuple[1]]=list.add;
if(stateString)list.add(function(){state=stateString},tuples[i^1][2].disable,tuples[2][2].lock);deferred[tuple[0]]=function(){deferred[tuple[0]+"With"](this===deferred?promise:this,arguments);return this};deferred[tuple[0]+"With"]=list.fireWith});promise.promise(deferred);if(func)func.call(deferred,deferred);return deferred},when:function(subordinate){var i=0,resolveValues=slice.call(arguments),length=resolveValues.length,remaining=length!==1||subordinate&&jQuery.isFunction(subordinate.promise)?length:
0,deferred=remaining===1?subordinate:jQuery.Deferred(),updateFunc=function(i,contexts,values){return function(value){contexts[i]=this;values[i]=arguments.length>1?slice.call(arguments):value;if(values===progressValues)deferred.notifyWith(contexts,values);else if(!--remaining)deferred.resolveWith(contexts,values)}},progressValues,progressContexts,resolveContexts;if(length>1){progressValues=new Array(length);progressContexts=new Array(length);resolveContexts=new Array(length);for(;i<length;i++)if(resolveValues[i]&&
jQuery.isFunction(resolveValues[i].promise))resolveValues[i].promise().done(updateFunc(i,resolveContexts,resolveValues)).fail(deferred.reject).progress(updateFunc(i,progressContexts,progressValues));else--remaining}if(!remaining)deferred.resolveWith(resolveContexts,resolveValues);return deferred.promise()}});var readyList;jQuery.fn.ready=function(fn){jQuery.ready.promise().done(fn);return this};jQuery.extend({isReady:false,readyWait:1,holdReady:function(hold){if(hold)jQuery.readyWait++;else jQuery.ready(true)},
ready:function(wait){if(wait===true?--jQuery.readyWait:jQuery.isReady)return;jQuery.isReady=true;if(wait!==true&&--jQuery.readyWait>0)return;readyList.resolveWith(document,[jQuery]);if(jQuery.fn.triggerHandler){jQuery(document).triggerHandler("ready");jQuery(document).off("ready")}}});function completed(){document.removeEventListener("DOMContentLoaded",completed,false);window.removeEventListener("load",completed,false);jQuery.ready()}jQuery.ready.promise=function(obj){if(!readyList){readyList=jQuery.Deferred();
if(document.readyState==="complete")setTimeout(jQuery.ready);else{document.addEventListener("DOMContentLoaded",completed,false);window.addEventListener("load",completed,false)}}return readyList.promise(obj)};jQuery.ready.promise();var access=jQuery.access=function(elems,fn,key,value,chainable,emptyGet,raw){var i=0,len=elems.length,bulk=key==null;if(jQuery.type(key)==="object"){chainable=true;for(i in key)jQuery.access(elems,fn,i,key[i],true,emptyGet,raw)}else if(value!==undefined){chainable=true;
if(!jQuery.isFunction(value))raw=true;if(bulk)if(raw){fn.call(elems,value);fn=null}else{bulk=fn;fn=function(elem,key,value){return bulk.call(jQuery(elem),value)}}if(fn)for(;i<len;i++)fn(elems[i],key,raw?value:value.call(elems[i],i,fn(elems[i],key)))}return chainable?elems:bulk?fn.call(elems):len?fn(elems[0],key):emptyGet};jQuery.acceptData=function(owner){return owner.nodeType===1||owner.nodeType===9||!+owner.nodeType};function Data(){Object.defineProperty(this.cache={},0,{get:function(){return{}}});
this.expando=jQuery.expando+Data.uid++}Data.uid=1;Data.accepts=jQuery.acceptData;Data.prototype={key:function(owner){if(!Data.accepts(owner))return 0;var descriptor={},unlock=owner[this.expando];if(!unlock){unlock=Data.uid++;try{descriptor[this.expando]={value:unlock};Object.defineProperties(owner,descriptor)}catch(e){descriptor[this.expando]=unlock;jQuery.extend(owner,descriptor)}}if(!this.cache[unlock])this.cache[unlock]={};return unlock},set:function(owner,data,value){var prop,unlock=this.key(owner),
cache=this.cache[unlock];if(typeof data==="string")cache[data]=value;else if(jQuery.isEmptyObject(cache))jQuery.extend(this.cache[unlock],data);else for(prop in data)cache[prop]=data[prop];return cache},get:function(owner,key){var cache=this.cache[this.key(owner)];return key===undefined?cache:cache[key]},access:function(owner,key,value){var stored;if(key===undefined||key&&typeof key==="string"&&value===undefined){stored=this.get(owner,key);return stored!==undefined?stored:this.get(owner,jQuery.camelCase(key))}this.set(owner,
key,value);return value!==undefined?value:key},remove:function(owner,key){var i,name,camel,unlock=this.key(owner),cache=this.cache[unlock];if(key===undefined)this.cache[unlock]={};else{if(jQuery.isArray(key))name=key.concat(key.map(jQuery.camelCase));else{camel=jQuery.camelCase(key);if(key in cache)name=[key,camel];else{name=camel;name=name in cache?[name]:name.match(rnotwhite)||[]}}i=name.length;while(i--)delete cache[name[i]]}},hasData:function(owner){return!jQuery.isEmptyObject(this.cache[owner[this.expando]]||
{})},discard:function(owner){if(owner[this.expando])delete this.cache[owner[this.expando]]}};var data_priv=new Data;var data_user=new Data;var rbrace=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,rmultiDash=/([A-Z])/g;function dataAttr(elem,key,data){var name;if(data===undefined&&elem.nodeType===1){name="data-"+key.replace(rmultiDash,"-$1").toLowerCase();data=elem.getAttribute(name);if(typeof data==="string"){try{data=data==="true"?true:data==="false"?false:data==="null"?null:+data+""===data?+data:rbrace.test(data)?
jQuery.parseJSON(data):data}catch(e){}data_user.set(elem,key,data)}else data=undefined}return data}jQuery.extend({hasData:function(elem){return data_user.hasData(elem)||data_priv.hasData(elem)},data:function(elem,name,data){return data_user.access(elem,name,data)},removeData:function(elem,name){data_user.remove(elem,name)},_data:function(elem,name,data){return data_priv.access(elem,name,data)},_removeData:function(elem,name){data_priv.remove(elem,name)}});jQuery.fn.extend({data:function(key,value){var i,
name,data,elem=this[0],attrs=elem&&elem.attributes;if(key===undefined){if(this.length){data=data_user.get(elem);if(elem.nodeType===1&&!data_priv.get(elem,"hasDataAttrs")){i=attrs.length;while(i--)if(attrs[i]){name=attrs[i].name;if(name.indexOf("data-")===0){name=jQuery.camelCase(name.slice(5));dataAttr(elem,name,data[name])}}data_priv.set(elem,"hasDataAttrs",true)}}return data}if(typeof key==="object")return this.each(function(){data_user.set(this,key)});return access(this,function(value){var data,
camelKey=jQuery.camelCase(key);if(elem&&value===undefined){data=data_user.get(elem,key);if(data!==undefined)return data;data=data_user.get(elem,camelKey);if(data!==undefined)return data;data=dataAttr(elem,camelKey,undefined);if(data!==undefined)return data;return}this.each(function(){var data=data_user.get(this,camelKey);data_user.set(this,camelKey,value);if(key.indexOf("-")!==-1&&data!==undefined)data_user.set(this,key,value)})},null,value,arguments.length>1,null,true)},removeData:function(key){return this.each(function(){data_user.remove(this,
key)})}});jQuery.extend({queue:function(elem,type,data){var queue;if(elem){type=(type||"fx")+"queue";queue=data_priv.get(elem,type);if(data)if(!queue||jQuery.isArray(data))queue=data_priv.access(elem,type,jQuery.makeArray(data));else queue.push(data);return queue||[]}},dequeue:function(elem,type){type=type||"fx";var queue=jQuery.queue(elem,type),startLength=queue.length,fn=queue.shift(),hooks=jQuery._queueHooks(elem,type),next=function(){jQuery.dequeue(elem,type)};if(fn==="inprogress"){fn=queue.shift();
startLength--}if(fn){if(type==="fx")queue.unshift("inprogress");delete hooks.stop;fn.call(elem,next,hooks)}if(!startLength&&hooks)hooks.empty.fire()},_queueHooks:function(elem,type){var key=type+"queueHooks";return data_priv.get(elem,key)||data_priv.access(elem,key,{empty:jQuery.Callbacks("once memory").add(function(){data_priv.remove(elem,[type+"queue",key])})})}});jQuery.fn.extend({queue:function(type,data){var setter=2;if(typeof type!=="string"){data=type;type="fx";setter--}if(arguments.length<
setter)return jQuery.queue(this[0],type);return data===undefined?this:this.each(function(){var queue=jQuery.queue(this,type,data);jQuery._queueHooks(this,type);if(type==="fx"&&queue[0]!=="inprogress")jQuery.dequeue(this,type)})},dequeue:function(type){return this.each(function(){jQuery.dequeue(this,type)})},clearQueue:function(type){return this.queue(type||"fx",[])},promise:function(type,obj){var tmp,count=1,defer=jQuery.Deferred(),elements=this,i=this.length,resolve=function(){if(!--count)defer.resolveWith(elements,
[elements])};if(typeof type!=="string"){obj=type;type=undefined}type=type||"fx";while(i--){tmp=data_priv.get(elements[i],type+"queueHooks");if(tmp&&tmp.empty){count++;tmp.empty.add(resolve)}}resolve();return defer.promise(obj)}});var pnum=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;var cssExpand=["Top","Right","Bottom","Left"];var isHidden=function(elem,el){elem=el||elem;return jQuery.css(elem,"display")==="none"||!jQuery.contains(elem.ownerDocument,elem)};var rcheckableType=/^(?:checkbox|radio)$/i;
(function(){var fragment=document.createDocumentFragment(),div=fragment.appendChild(document.createElement("div")),input=document.createElement("input");input.setAttribute("type","radio");input.setAttribute("checked","checked");input.setAttribute("name","t");div.appendChild(input);support.checkClone=div.cloneNode(true).cloneNode(true).lastChild.checked;div.innerHTML="<textarea>x</textarea>";support.noCloneChecked=!!div.cloneNode(true).lastChild.defaultValue})();var strundefined=typeof undefined;support.focusinBubbles=
"onfocusin"in window;var rkeyEvent=/^key/,rmouseEvent=/^(?:mouse|pointer|contextmenu)|click/,rfocusMorph=/^(?:focusinfocus|focusoutblur)$/,rtypenamespace=/^([^.]*)(?:\.(.+)|)$/;function returnTrue(){return true}function returnFalse(){return false}function safeActiveElement(){try{return document.activeElement}catch(err){}}jQuery.event={global:{},add:function(elem,types,handler,data,selector){var handleObjIn,eventHandle,tmp,events,t,handleObj,special,handlers,type,namespaces,origType,elemData=data_priv.get(elem);
if(!elemData)return;if(handler.handler){handleObjIn=handler;handler=handleObjIn.handler;selector=handleObjIn.selector}if(!handler.guid)handler.guid=jQuery.guid++;if(!(events=elemData.events))events=elemData.events={};if(!(eventHandle=elemData.handle))eventHandle=elemData.handle=function(e){return typeof jQuery!==strundefined&&jQuery.event.triggered!==e.type?jQuery.event.dispatch.apply(elem,arguments):undefined};types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||
[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort();if(!type)continue;special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||type;special=jQuery.event.special[type]||{};handleObj=jQuery.extend({type:type,origType:origType,data:data,handler:handler,guid:handler.guid,selector:selector,needsContext:selector&&jQuery.expr.match.needsContext.test(selector),namespace:namespaces.join(".")},handleObjIn);if(!(handlers=events[type])){handlers=events[type]=
[];handlers.delegateCount=0;if(!special.setup||special.setup.call(elem,data,namespaces,eventHandle)===false)if(elem.addEventListener)elem.addEventListener(type,eventHandle,false)}if(special.add){special.add.call(elem,handleObj);if(!handleObj.handler.guid)handleObj.handler.guid=handler.guid}if(selector)handlers.splice(handlers.delegateCount++,0,handleObj);else handlers.push(handleObj);jQuery.event.global[type]=true}},remove:function(elem,types,handler,selector,mappedTypes){var j,origCount,tmp,events,
t,handleObj,special,handlers,type,namespaces,origType,elemData=data_priv.hasData(elem)&&data_priv.get(elem);if(!elemData||!(events=elemData.events))return;types=(types||"").match(rnotwhite)||[""];t=types.length;while(t--){tmp=rtypenamespace.exec(types[t])||[];type=origType=tmp[1];namespaces=(tmp[2]||"").split(".").sort();if(!type){for(type in events)jQuery.event.remove(elem,type+types[t],handler,selector,true);continue}special=jQuery.event.special[type]||{};type=(selector?special.delegateType:special.bindType)||
type;handlers=events[type]||[];tmp=tmp[2]&&new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+"(\\.|$)");origCount=j=handlers.length;while(j--){handleObj=handlers[j];if((mappedTypes||origType===handleObj.origType)&&(!handler||handler.guid===handleObj.guid)&&(!tmp||tmp.test(handleObj.namespace))&&(!selector||selector===handleObj.selector||selector==="**"&&handleObj.selector)){handlers.splice(j,1);if(handleObj.selector)handlers.delegateCount--;if(special.remove)special.remove.call(elem,handleObj)}}if(origCount&&
!handlers.length){if(!special.teardown||special.teardown.call(elem,namespaces,elemData.handle)===false)jQuery.removeEvent(elem,type,elemData.handle);delete events[type]}}if(jQuery.isEmptyObject(events)){delete elemData.handle;data_priv.remove(elem,"events")}},trigger:function(event,data,elem,onlyHandlers){var i,cur,tmp,bubbleType,ontype,handle,special,eventPath=[elem||document],type=hasOwn.call(event,"type")?event.type:event,namespaces=hasOwn.call(event,"namespace")?event.namespace.split("."):[];
cur=tmp=elem=elem||document;if(elem.nodeType===3||elem.nodeType===8)return;if(rfocusMorph.test(type+jQuery.event.triggered))return;if(type.indexOf(".")>=0){namespaces=type.split(".");type=namespaces.shift();namespaces.sort()}ontype=type.indexOf(":")<0&&"on"+type;event=event[jQuery.expando]?event:new jQuery.Event(type,typeof event==="object"&&event);event.isTrigger=onlyHandlers?2:3;event.namespace=namespaces.join(".");event.namespace_re=event.namespace?new RegExp("(^|\\.)"+namespaces.join("\\.(?:.*\\.|)")+
"(\\.|$)"):null;event.result=undefined;if(!event.target)event.target=elem;data=data==null?[event]:jQuery.makeArray(data,[event]);special=jQuery.event.special[type]||{};if(!onlyHandlers&&special.trigger&&special.trigger.apply(elem,data)===false)return;if(!onlyHandlers&&!special.noBubble&&!jQuery.isWindow(elem)){bubbleType=special.delegateType||type;if(!rfocusMorph.test(bubbleType+type))cur=cur.parentNode;for(;cur;cur=cur.parentNode){eventPath.push(cur);tmp=cur}if(tmp===(elem.ownerDocument||document))eventPath.push(tmp.defaultView||
tmp.parentWindow||window)}i=0;while((cur=eventPath[i++])&&!event.isPropagationStopped()){event.type=i>1?bubbleType:special.bindType||type;handle=(data_priv.get(cur,"events")||{})[event.type]&&data_priv.get(cur,"handle");if(handle)handle.apply(cur,data);handle=ontype&&cur[ontype];if(handle&&handle.apply&&jQuery.acceptData(cur)){event.result=handle.apply(cur,data);if(event.result===false)event.preventDefault()}}event.type=type;if(!onlyHandlers&&!event.isDefaultPrevented())if((!special._default||special._default.apply(eventPath.pop(),
data)===false)&&jQuery.acceptData(elem))if(ontype&&jQuery.isFunction(elem[type])&&!jQuery.isWindow(elem)){tmp=elem[ontype];if(tmp)elem[ontype]=null;jQuery.event.triggered=type;elem[type]();jQuery.event.triggered=undefined;if(tmp)elem[ontype]=tmp}return event.result},dispatch:function(event){event=jQuery.event.fix(event);var i,j,ret,matched,handleObj,handlerQueue=[],args=slice.call(arguments),handlers=(data_priv.get(this,"events")||{})[event.type]||[],special=jQuery.event.special[event.type]||{};args[0]=
event;event.delegateTarget=this;if(special.preDispatch&&special.preDispatch.call(this,event)===false)return;handlerQueue=jQuery.event.handlers.call(this,event,handlers);i=0;while((matched=handlerQueue[i++])&&!event.isPropagationStopped()){event.currentTarget=matched.elem;j=0;while((handleObj=matched.handlers[j++])&&!event.isImmediatePropagationStopped())if(!event.namespace_re||event.namespace_re.test(handleObj.namespace)){event.handleObj=handleObj;event.data=handleObj.data;ret=((jQuery.event.special[handleObj.origType]||
{}).handle||handleObj.handler).apply(matched.elem,args);if(ret!==undefined)if((event.result=ret)===false){event.preventDefault();event.stopPropagation()}}}if(special.postDispatch)special.postDispatch.call(this,event);return event.result},handlers:function(event,handlers){var i,matches,sel,handleObj,handlerQueue=[],delegateCount=handlers.delegateCount,cur=event.target;if(delegateCount&&cur.nodeType&&(!event.button||event.type!=="click"))for(;cur!==this;cur=cur.parentNode||this)if(cur.disabled!==true||
event.type!=="click"){matches=[];for(i=0;i<delegateCount;i++){handleObj=handlers[i];sel=handleObj.selector+" ";if(matches[sel]===undefined)matches[sel]=handleObj.needsContext?jQuery(sel,this).index(cur)>=0:jQuery.find(sel,this,null,[cur]).length;if(matches[sel])matches.push(handleObj)}if(matches.length)handlerQueue.push({elem:cur,handlers:matches})}if(delegateCount<handlers.length)handlerQueue.push({elem:this,handlers:handlers.slice(delegateCount)});return handlerQueue},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(event,original){if(event.which==null)event.which=original.charCode!=null?original.charCode:original.keyCode;return event}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(event,original){var eventDoc,doc,body,button=original.button;if(event.pageX==null&&original.clientX!=null){eventDoc=event.target.ownerDocument||document;doc=eventDoc.documentElement;
body=eventDoc.body;event.pageX=original.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc&&doc.clientLeft||body&&body.clientLeft||0);event.pageY=original.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc&&doc.clientTop||body&&body.clientTop||0)}if(!event.which&&button!==undefined)event.which=button&1?1:button&2?3:button&4?2:0;return event}},fix:function(event){if(event[jQuery.expando])return event;var i,prop,copy,type=event.type,originalEvent=event,fixHook=this.fixHooks[type];
if(!fixHook)this.fixHooks[type]=fixHook=rmouseEvent.test(type)?this.mouseHooks:rkeyEvent.test(type)?this.keyHooks:{};copy=fixHook.props?this.props.concat(fixHook.props):this.props;event=new jQuery.Event(originalEvent);i=copy.length;while(i--){prop=copy[i];event[prop]=originalEvent[prop]}if(!event.target)event.target=document;if(event.target.nodeType===3)event.target=event.target.parentNode;return fixHook.filter?fixHook.filter(event,originalEvent):event},special:{load:{noBubble:true},focus:{trigger:function(){if(this!==
safeActiveElement()&&this.focus){this.focus();return false}},delegateType:"focusin"},blur:{trigger:function(){if(this===safeActiveElement()&&this.blur){this.blur();return false}},delegateType:"focusout"},click:{trigger:function(){if(this.type==="checkbox"&&this.click&&jQuery.nodeName(this,"input")){this.click();return false}},_default:function(event){return jQuery.nodeName(event.target,"a")}},beforeunload:{postDispatch:function(event){if(event.result!==undefined&&event.originalEvent)event.originalEvent.returnValue=
event.result}}},simulate:function(type,elem,event,bubble){var e=jQuery.extend(new jQuery.Event,event,{type:type,isSimulated:true,originalEvent:{}});if(bubble)jQuery.event.trigger(e,null,elem);else jQuery.event.dispatch.call(elem,e);if(e.isDefaultPrevented())event.preventDefault()}};jQuery.removeEvent=function(elem,type,handle){if(elem.removeEventListener)elem.removeEventListener(type,handle,false)};jQuery.Event=function(src,props){if(!(this instanceof jQuery.Event))return new jQuery.Event(src,props);
if(src&&src.type){this.originalEvent=src;this.type=src.type;this.isDefaultPrevented=src.defaultPrevented||src.defaultPrevented===undefined&&src.returnValue===false?returnTrue:returnFalse}else this.type=src;if(props)jQuery.extend(this,props);this.timeStamp=src&&src.timeStamp||jQuery.now();this[jQuery.expando]=true};jQuery.Event.prototype={isDefaultPrevented:returnFalse,isPropagationStopped:returnFalse,isImmediatePropagationStopped:returnFalse,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=
returnTrue;if(e&&e.preventDefault)e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=returnTrue;if(e&&e.stopPropagation)e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=returnTrue;if(e&&e.stopImmediatePropagation)e.stopImmediatePropagation();this.stopPropagation()}};jQuery.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(orig,
fix){jQuery.event.special[orig]={delegateType:fix,bindType:fix,handle:function(event){var ret,target=this,related=event.relatedTarget,handleObj=event.handleObj;if(!related||related!==target&&!jQuery.contains(target,related)){event.type=handleObj.origType;ret=handleObj.handler.apply(this,arguments);event.type=fix}return ret}}});if(!support.focusinBubbles)jQuery.each({focus:"focusin",blur:"focusout"},function(orig,fix){var handler=function(event){jQuery.event.simulate(fix,event.target,jQuery.event.fix(event),
true)};jQuery.event.special[fix]={setup:function(){var doc=this.ownerDocument||this,attaches=data_priv.access(doc,fix);if(!attaches)doc.addEventListener(orig,handler,true);data_priv.access(doc,fix,(attaches||0)+1)},teardown:function(){var doc=this.ownerDocument||this,attaches=data_priv.access(doc,fix)-1;if(!attaches){doc.removeEventListener(orig,handler,true);data_priv.remove(doc,fix)}else data_priv.access(doc,fix,attaches)}}});jQuery.fn.extend({on:function(types,selector,data,fn,one){var origFn,
type;if(typeof types==="object"){if(typeof selector!=="string"){data=data||selector;selector=undefined}for(type in types)this.on(type,selector,data,types[type],one);return this}if(data==null&&fn==null){fn=selector;data=selector=undefined}else if(fn==null)if(typeof selector==="string"){fn=data;data=undefined}else{fn=data;data=selector;selector=undefined}if(fn===false)fn=returnFalse;else if(!fn)return this;if(one===1){origFn=fn;fn=function(event){jQuery().off(event);return origFn.apply(this,arguments)};
fn.guid=origFn.guid||(origFn.guid=jQuery.guid++)}return this.each(function(){jQuery.event.add(this,types,fn,data,selector)})},one:function(types,selector,data,fn){return this.on(types,selector,data,fn,1)},off:function(types,selector,fn){var handleObj,type;if(types&&types.preventDefault&&types.handleObj){handleObj=types.handleObj;jQuery(types.delegateTarget).off(handleObj.namespace?handleObj.origType+"."+handleObj.namespace:handleObj.origType,handleObj.selector,handleObj.handler);return this}if(typeof types===
"object"){for(type in types)this.off(type,selector,types[type]);return this}if(selector===false||typeof selector==="function"){fn=selector;selector=undefined}if(fn===false)fn=returnFalse;return this.each(function(){jQuery.event.remove(this,types,fn,selector)})},trigger:function(type,data){return this.each(function(){jQuery.event.trigger(type,data,this)})},triggerHandler:function(type,data){var elem=this[0];if(elem)return jQuery.event.trigger(type,data,elem,true)}});var rxhtmlTag=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
rtagName=/<([\w:]+)/,rhtml=/<|&#?\w+;/,rnoInnerhtml=/<(?:script|style|link)/i,rchecked=/checked\s*(?:[^=]|=\s*.checked.)/i,rscriptType=/^$|\/(?:java|ecma)script/i,rscriptTypeMasked=/^true\/(.*)/,rcleanScript=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,wrapMap={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,
"",""]};wrapMap.optgroup=wrapMap.option;wrapMap.tbody=wrapMap.tfoot=wrapMap.colgroup=wrapMap.caption=wrapMap.thead;wrapMap.th=wrapMap.td;function manipulationTarget(elem,content){return jQuery.nodeName(elem,"table")&&jQuery.nodeName(content.nodeType!==11?content:content.firstChild,"tr")?elem.getElementsByTagName("tbody")[0]||elem.appendChild(elem.ownerDocument.createElement("tbody")):elem}function disableScript(elem){elem.type=(elem.getAttribute("type")!==null)+"/"+elem.type;return elem}function restoreScript(elem){var match=
rscriptTypeMasked.exec(elem.type);if(match)elem.type=match[1];else elem.removeAttribute("type");return elem}function setGlobalEval(elems,refElements){var i=0,l=elems.length;for(;i<l;i++)data_priv.set(elems[i],"globalEval",!refElements||data_priv.get(refElements[i],"globalEval"))}function cloneCopyEvent(src,dest){var i,l,type,pdataOld,pdataCur,udataOld,udataCur,events;if(dest.nodeType!==1)return;if(data_priv.hasData(src)){pdataOld=data_priv.access(src);pdataCur=data_priv.set(dest,pdataOld);events=
pdataOld.events;if(events){delete pdataCur.handle;pdataCur.events={};for(type in events)for(i=0,l=events[type].length;i<l;i++)jQuery.event.add(dest,type,events[type][i])}}if(data_user.hasData(src)){udataOld=data_user.access(src);udataCur=jQuery.extend({},udataOld);data_user.set(dest,udataCur)}}function getAll(context,tag){var ret=context.getElementsByTagName?context.getElementsByTagName(tag||"*"):context.querySelectorAll?context.querySelectorAll(tag||"*"):[];return tag===undefined||tag&&jQuery.nodeName(context,
tag)?jQuery.merge([context],ret):ret}function fixInput(src,dest){var nodeName=dest.nodeName.toLowerCase();if(nodeName==="input"&&rcheckableType.test(src.type))dest.checked=src.checked;else if(nodeName==="input"||nodeName==="textarea")dest.defaultValue=src.defaultValue}jQuery.extend({clone:function(elem,dataAndEvents,deepDataAndEvents){var i,l,srcElements,destElements,clone=elem.cloneNode(true),inPage=jQuery.contains(elem.ownerDocument,elem);if(!support.noCloneChecked&&(elem.nodeType===1||elem.nodeType===
11)&&!jQuery.isXMLDoc(elem)){destElements=getAll(clone);srcElements=getAll(elem);for(i=0,l=srcElements.length;i<l;i++)fixInput(srcElements[i],destElements[i])}if(dataAndEvents)if(deepDataAndEvents){srcElements=srcElements||getAll(elem);destElements=destElements||getAll(clone);for(i=0,l=srcElements.length;i<l;i++)cloneCopyEvent(srcElements[i],destElements[i])}else cloneCopyEvent(elem,clone);destElements=getAll(clone,"script");if(destElements.length>0)setGlobalEval(destElements,!inPage&&getAll(elem,
"script"));return clone},buildFragment:function(elems,context,scripts,selection){var elem,tmp,tag,wrap,contains,j,fragment=context.createDocumentFragment(),nodes=[],i=0,l=elems.length;for(;i<l;i++){elem=elems[i];if(elem||elem===0)if(jQuery.type(elem)==="object")jQuery.merge(nodes,elem.nodeType?[elem]:elem);else if(!rhtml.test(elem))nodes.push(context.createTextNode(elem));else{tmp=tmp||fragment.appendChild(context.createElement("div"));tag=(rtagName.exec(elem)||["",""])[1].toLowerCase();wrap=wrapMap[tag]||
wrapMap._default;tmp.innerHTML=wrap[1]+elem.replace(rxhtmlTag,"<$1></$2>")+wrap[2];j=wrap[0];while(j--)tmp=tmp.lastChild;jQuery.merge(nodes,tmp.childNodes);tmp=fragment.firstChild;tmp.textContent=""}}fragment.textContent="";i=0;while(elem=nodes[i++]){if(selection&&jQuery.inArray(elem,selection)!==-1)continue;contains=jQuery.contains(elem.ownerDocument,elem);tmp=getAll(fragment.appendChild(elem),"script");if(contains)setGlobalEval(tmp);if(scripts){j=0;while(elem=tmp[j++])if(rscriptType.test(elem.type||
""))scripts.push(elem)}}return fragment},cleanData:function(elems){var data,elem,type,key,special=jQuery.event.special,i=0;for(;(elem=elems[i])!==undefined;i++){if(jQuery.acceptData(elem)){key=elem[data_priv.expando];if(key&&(data=data_priv.cache[key])){if(data.events)for(type in data.events)if(special[type])jQuery.event.remove(elem,type);else jQuery.removeEvent(elem,type,data.handle);if(data_priv.cache[key])delete data_priv.cache[key]}}delete data_user.cache[elem[data_user.expando]]}}});jQuery.fn.extend({text:function(value){return access(this,
function(value){return value===undefined?jQuery.text(this):this.empty().each(function(){if(this.nodeType===1||this.nodeType===11||this.nodeType===9)this.textContent=value})},null,value,arguments.length)},append:function(){return this.domManip(arguments,function(elem){if(this.nodeType===1||this.nodeType===11||this.nodeType===9){var target=manipulationTarget(this,elem);target.appendChild(elem)}})},prepend:function(){return this.domManip(arguments,function(elem){if(this.nodeType===1||this.nodeType===
11||this.nodeType===9){var target=manipulationTarget(this,elem);target.insertBefore(elem,target.firstChild)}})},before:function(){return this.domManip(arguments,function(elem){if(this.parentNode)this.parentNode.insertBefore(elem,this)})},after:function(){return this.domManip(arguments,function(elem){if(this.parentNode)this.parentNode.insertBefore(elem,this.nextSibling)})},remove:function(selector,keepData){var elem,elems=selector?jQuery.filter(selector,this):this,i=0;for(;(elem=elems[i])!=null;i++){if(!keepData&&
elem.nodeType===1)jQuery.cleanData(getAll(elem));if(elem.parentNode){if(keepData&&jQuery.contains(elem.ownerDocument,elem))setGlobalEval(getAll(elem,"script"));elem.parentNode.removeChild(elem)}}return this},empty:function(){var elem,i=0;for(;(elem=this[i])!=null;i++)if(elem.nodeType===1){jQuery.cleanData(getAll(elem,false));elem.textContent=""}return this},clone:function(dataAndEvents,deepDataAndEvents){dataAndEvents=dataAndEvents==null?false:dataAndEvents;deepDataAndEvents=deepDataAndEvents==null?
dataAndEvents:deepDataAndEvents;return this.map(function(){return jQuery.clone(this,dataAndEvents,deepDataAndEvents)})},html:function(value){return access(this,function(value){var elem=this[0]||{},i=0,l=this.length;if(value===undefined&&elem.nodeType===1)return elem.innerHTML;if(typeof value==="string"&&!rnoInnerhtml.test(value)&&!wrapMap[(rtagName.exec(value)||["",""])[1].toLowerCase()]){value=value.replace(rxhtmlTag,"<$1></$2>");try{for(;i<l;i++){elem=this[i]||{};if(elem.nodeType===1){jQuery.cleanData(getAll(elem,
false));elem.innerHTML=value}}elem=0}catch(e){}}if(elem)this.empty().append(value)},null,value,arguments.length)},replaceWith:function(){var arg=arguments[0];this.domManip(arguments,function(elem){arg=this.parentNode;jQuery.cleanData(getAll(this));if(arg)arg.replaceChild(elem,this)});return arg&&(arg.length||arg.nodeType)?this:this.remove()},detach:function(selector){return this.remove(selector,true)},domManip:function(args,callback){args=concat.apply([],args);var fragment,first,scripts,hasScripts,
node,doc,i=0,l=this.length,set=this,iNoClone=l-1,value=args[0],isFunction=jQuery.isFunction(value);if(isFunction||l>1&&typeof value==="string"&&!support.checkClone&&rchecked.test(value))return this.each(function(index){var self=set.eq(index);if(isFunction)args[0]=value.call(this,index,self.html());self.domManip(args,callback)});if(l){fragment=jQuery.buildFragment(args,this[0].ownerDocument,false,this);first=fragment.firstChild;if(fragment.childNodes.length===1)fragment=first;if(first){scripts=jQuery.map(getAll(fragment,
"script"),disableScript);hasScripts=scripts.length;for(;i<l;i++){node=fragment;if(i!==iNoClone){node=jQuery.clone(node,true,true);if(hasScripts)jQuery.merge(scripts,getAll(node,"script"))}callback.call(this[i],node,i)}if(hasScripts){doc=scripts[scripts.length-1].ownerDocument;jQuery.map(scripts,restoreScript);for(i=0;i<hasScripts;i++){node=scripts[i];if(rscriptType.test(node.type||"")&&!data_priv.access(node,"globalEval")&&jQuery.contains(doc,node))if(node.src){if(jQuery._evalUrl)jQuery._evalUrl(node.src)}else jQuery.globalEval(node.textContent.replace(rcleanScript,
""))}}}}return this}});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(selector){var elems,ret=[],insert=jQuery(selector),last=insert.length-1,i=0;for(;i<=last;i++){elems=i===last?this:this.clone(true);jQuery(insert[i])[original](elems);push.apply(ret,elems.get())}return this.pushStack(ret)}});var iframe,elemdisplay={};function actualDisplay(name,doc){var style,elem=jQuery(doc.createElement(name)).appendTo(doc.body),
display=window.getDefaultComputedStyle&&(style=window.getDefaultComputedStyle(elem[0]))?style.display:jQuery.css(elem[0],"display");elem.detach();return display}function defaultDisplay(nodeName){var doc=document,display=elemdisplay[nodeName];if(!display){display=actualDisplay(nodeName,doc);if(display==="none"||!display){iframe=(iframe||jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);doc=iframe[0].contentDocument;doc.write();doc.close();display=actualDisplay(nodeName,
doc);iframe.detach()}elemdisplay[nodeName]=display}return display}var rmargin=/^margin/;var rnumnonpx=new RegExp("^("+pnum+")(?!px)[a-z%]+$","i");var getStyles=function(elem){if(elem.ownerDocument.defaultView.opener)return elem.ownerDocument.defaultView.getComputedStyle(elem,null);return window.getComputedStyle(elem,null)};function curCSS(elem,name,computed){var width,minWidth,maxWidth,ret,style=elem.style;computed=computed||getStyles(elem);if(computed)ret=computed.getPropertyValue(name)||computed[name];
if(computed){if(ret===""&&!jQuery.contains(elem.ownerDocument,elem))ret=jQuery.style(elem,name);if(rnumnonpx.test(ret)&&rmargin.test(name)){width=style.width;minWidth=style.minWidth;maxWidth=style.maxWidth;style.minWidth=style.maxWidth=style.width=ret;ret=computed.width;style.width=width;style.minWidth=minWidth;style.maxWidth=maxWidth}}return ret!==undefined?ret+"":ret}function addGetHookIf(conditionFn,hookFn){return{get:function(){if(conditionFn()){delete this.get;return}return(this.get=hookFn).apply(this,
arguments)}}}(function(){var pixelPositionVal,boxSizingReliableVal,docElem=document.documentElement,container=document.createElement("div"),div=document.createElement("div");if(!div.style)return;div.style.backgroundClip="content-box";div.cloneNode(true).style.backgroundClip="";support.clearCloneStyle=div.style.backgroundClip==="content-box";container.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;"+"position:absolute";container.appendChild(div);function computePixelPositionAndBoxSizingReliable(){div.style.cssText=
"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;"+"box-sizing:border-box;display:block;margin-top:1%;top:1%;"+"border:1px;padding:1px;width:4px;position:absolute";div.innerHTML="";docElem.appendChild(container);var divStyle=window.getComputedStyle(div,null);pixelPositionVal=divStyle.top!=="1%";boxSizingReliableVal=divStyle.width==="4px";docElem.removeChild(container)}if(window.getComputedStyle)jQuery.extend(support,{pixelPosition:function(){computePixelPositionAndBoxSizingReliable();return pixelPositionVal},
boxSizingReliable:function(){if(boxSizingReliableVal==null)computePixelPositionAndBoxSizingReliable();return boxSizingReliableVal},reliableMarginRight:function(){var ret,marginDiv=div.appendChild(document.createElement("div"));marginDiv.style.cssText=div.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;"+"box-sizing:content-box;display:block;margin:0;border:0;padding:0";marginDiv.style.marginRight=marginDiv.style.width="0";div.style.width="1px";docElem.appendChild(container);
ret=!parseFloat(window.getComputedStyle(marginDiv,null).marginRight);docElem.removeChild(container);div.removeChild(marginDiv);return ret}})})();jQuery.swap=function(elem,options,callback,args){var ret,name,old={};for(name in options){old[name]=elem.style[name];elem.style[name]=options[name]}ret=callback.apply(elem,args||[]);for(name in options)elem.style[name]=old[name];return ret};var rdisplayswap=/^(none|table(?!-c[ea]).+)/,rnumsplit=new RegExp("^("+pnum+")(.*)$","i"),rrelNum=new RegExp("^([+-])=("+
pnum+")","i"),cssShow={position:"absolute",visibility:"hidden",display:"block"},cssNormalTransform={letterSpacing:"0",fontWeight:"400"},cssPrefixes=["Webkit","O","Moz","ms"];function vendorPropName(style,name){if(name in style)return name;var capName=name[0].toUpperCase()+name.slice(1),origName=name,i=cssPrefixes.length;while(i--){name=cssPrefixes[i]+capName;if(name in style)return name}return origName}function setPositiveNumber(elem,value,subtract){var matches=rnumsplit.exec(value);return matches?
Math.max(0,matches[1]-(subtract||0))+(matches[2]||"px"):value}function augmentWidthOrHeight(elem,name,extra,isBorderBox,styles){var i=extra===(isBorderBox?"border":"content")?4:name==="width"?1:0,val=0;for(;i<4;i+=2){if(extra==="margin")val+=jQuery.css(elem,extra+cssExpand[i],true,styles);if(isBorderBox){if(extra==="content")val-=jQuery.css(elem,"padding"+cssExpand[i],true,styles);if(extra!=="margin")val-=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles)}else{val+=jQuery.css(elem,"padding"+
cssExpand[i],true,styles);if(extra!=="padding")val+=jQuery.css(elem,"border"+cssExpand[i]+"Width",true,styles)}}return val}function getWidthOrHeight(elem,name,extra){var valueIsBorderBox=true,val=name==="width"?elem.offsetWidth:elem.offsetHeight,styles=getStyles(elem),isBorderBox=jQuery.css(elem,"boxSizing",false,styles)==="border-box";if(val<=0||val==null){val=curCSS(elem,name,styles);if(val<0||val==null)val=elem.style[name];if(rnumnonpx.test(val))return val;valueIsBorderBox=isBorderBox&&(support.boxSizingReliable()||
val===elem.style[name]);val=parseFloat(val)||0}return val+augmentWidthOrHeight(elem,name,extra||(isBorderBox?"border":"content"),valueIsBorderBox,styles)+"px"}function showHide(elements,show){var display,elem,hidden,values=[],index=0,length=elements.length;for(;index<length;index++){elem=elements[index];if(!elem.style)continue;values[index]=data_priv.get(elem,"olddisplay");display=elem.style.display;if(show){if(!values[index]&&display==="none")elem.style.display="";if(elem.style.display===""&&isHidden(elem))values[index]=
data_priv.access(elem,"olddisplay",defaultDisplay(elem.nodeName))}else{hidden=isHidden(elem);if(display!=="none"||!hidden)data_priv.set(elem,"olddisplay",hidden?display:jQuery.css(elem,"display"))}}for(index=0;index<length;index++){elem=elements[index];if(!elem.style)continue;if(!show||elem.style.display==="none"||elem.style.display==="")elem.style.display=show?values[index]||"":"none"}return elements}jQuery.extend({cssHooks:{opacity:{get:function(elem,computed){if(computed){var ret=curCSS(elem,"opacity");
return ret===""?"1":ret}}}},cssNumber:{"columnCount":true,"fillOpacity":true,"flexGrow":true,"flexShrink":true,"fontWeight":true,"lineHeight":true,"opacity":true,"order":true,"orphans":true,"widows":true,"zIndex":true,"zoom":true},cssProps:{"float":"cssFloat"},style:function(elem,name,value,extra){if(!elem||elem.nodeType===3||elem.nodeType===8||!elem.style)return;var ret,type,hooks,origName=jQuery.camelCase(name),style=elem.style;name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(style,
origName));hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];if(value!==undefined){type=typeof value;if(type==="string"&&(ret=rrelNum.exec(value))){value=(ret[1]+1)*ret[2]+parseFloat(jQuery.css(elem,name));type="number"}if(value==null||value!==value)return;if(type==="number"&&!jQuery.cssNumber[origName])value+="px";if(!support.clearCloneStyle&&value===""&&name.indexOf("background")===0)style[name]="inherit";if(!hooks||!("set"in hooks)||(value=hooks.set(elem,value,extra))!==undefined)style[name]=
value}else{if(hooks&&"get"in hooks&&(ret=hooks.get(elem,false,extra))!==undefined)return ret;return style[name]}},css:function(elem,name,extra,styles){var val,num,hooks,origName=jQuery.camelCase(name);name=jQuery.cssProps[origName]||(jQuery.cssProps[origName]=vendorPropName(elem.style,origName));hooks=jQuery.cssHooks[name]||jQuery.cssHooks[origName];if(hooks&&"get"in hooks)val=hooks.get(elem,true,extra);if(val===undefined)val=curCSS(elem,name,styles);if(val==="normal"&&name in cssNormalTransform)val=
cssNormalTransform[name];if(extra===""||extra){num=parseFloat(val);return extra===true||jQuery.isNumeric(num)?num||0:val}return val}});jQuery.each(["height","width"],function(i,name){jQuery.cssHooks[name]={get:function(elem,computed,extra){if(computed)return rdisplayswap.test(jQuery.css(elem,"display"))&&elem.offsetWidth===0?jQuery.swap(elem,cssShow,function(){return getWidthOrHeight(elem,name,extra)}):getWidthOrHeight(elem,name,extra)},set:function(elem,value,extra){var styles=extra&&getStyles(elem);
return setPositiveNumber(elem,value,extra?augmentWidthOrHeight(elem,name,extra,jQuery.css(elem,"boxSizing",false,styles)==="border-box",styles):0)}}});jQuery.cssHooks.marginRight=addGetHookIf(support.reliableMarginRight,function(elem,computed){if(computed)return jQuery.swap(elem,{"display":"inline-block"},curCSS,[elem,"marginRight"])});jQuery.each({margin:"",padding:"",border:"Width"},function(prefix,suffix){jQuery.cssHooks[prefix+suffix]={expand:function(value){var i=0,expanded={},parts=typeof value===
"string"?value.split(" "):[value];for(;i<4;i++)expanded[prefix+cssExpand[i]+suffix]=parts[i]||parts[i-2]||parts[0];return expanded}};if(!rmargin.test(prefix))jQuery.cssHooks[prefix+suffix].set=setPositiveNumber});jQuery.fn.extend({css:function(name,value){return access(this,function(elem,name,value){var styles,len,map={},i=0;if(jQuery.isArray(name)){styles=getStyles(elem);len=name.length;for(;i<len;i++)map[name[i]]=jQuery.css(elem,name[i],false,styles);return map}return value!==undefined?jQuery.style(elem,
name,value):jQuery.css(elem,name)},name,value,arguments.length>1)},show:function(){return showHide(this,true)},hide:function(){return showHide(this)},toggle:function(state){if(typeof state==="boolean")return state?this.show():this.hide();return this.each(function(){if(isHidden(this))jQuery(this).show();else jQuery(this).hide()})}});function Tween(elem,options,prop,end,easing){return new Tween.prototype.init(elem,options,prop,end,easing)}jQuery.Tween=Tween;Tween.prototype={constructor:Tween,init:function(elem,
options,prop,end,easing,unit){this.elem=elem;this.prop=prop;this.easing=easing||"swing";this.options=options;this.start=this.now=this.cur();this.end=end;this.unit=unit||(jQuery.cssNumber[prop]?"":"px")},cur:function(){var hooks=Tween.propHooks[this.prop];return hooks&&hooks.get?hooks.get(this):Tween.propHooks._default.get(this)},run:function(percent){var eased,hooks=Tween.propHooks[this.prop];if(this.options.duration)this.pos=eased=jQuery.easing[this.easing](percent,this.options.duration*percent,
0,1,this.options.duration);else this.pos=eased=percent;this.now=(this.end-this.start)*eased+this.start;if(this.options.step)this.options.step.call(this.elem,this.now,this);if(hooks&&hooks.set)hooks.set(this);else Tween.propHooks._default.set(this);return this}};Tween.prototype.init.prototype=Tween.prototype;Tween.propHooks={_default:{get:function(tween){var result;if(tween.elem[tween.prop]!=null&&(!tween.elem.style||tween.elem.style[tween.prop]==null))return tween.elem[tween.prop];result=jQuery.css(tween.elem,
tween.prop,"");return!result||result==="auto"?0:result},set:function(tween){if(jQuery.fx.step[tween.prop])jQuery.fx.step[tween.prop](tween);else if(tween.elem.style&&(tween.elem.style[jQuery.cssProps[tween.prop]]!=null||jQuery.cssHooks[tween.prop]))jQuery.style(tween.elem,tween.prop,tween.now+tween.unit);else tween.elem[tween.prop]=tween.now}}};Tween.propHooks.scrollTop=Tween.propHooks.scrollLeft={set:function(tween){if(tween.elem.nodeType&&tween.elem.parentNode)tween.elem[tween.prop]=tween.now}};
jQuery.easing={linear:function(p){return p},swing:function(p){return.5-Math.cos(p*Math.PI)/2}};jQuery.fx=Tween.prototype.init;jQuery.fx.step={};var fxNow,timerId,rfxtypes=/^(?:toggle|show|hide)$/,rfxnum=new RegExp("^(?:([+-])=|)("+pnum+")([a-z%]*)$","i"),rrun=/queueHooks$/,animationPrefilters=[defaultPrefilter],tweeners={"*":[function(prop,value){var tween=this.createTween(prop,value),target=tween.cur(),parts=rfxnum.exec(value),unit=parts&&parts[3]||(jQuery.cssNumber[prop]?"":"px"),start=(jQuery.cssNumber[prop]||
unit!=="px"&&+target)&&rfxnum.exec(jQuery.css(tween.elem,prop)),scale=1,maxIterations=20;if(start&&start[3]!==unit){unit=unit||start[3];parts=parts||[];start=+target||1;do{scale=scale||".5";start=start/scale;jQuery.style(tween.elem,prop,start+unit)}while(scale!==(scale=tween.cur()/target)&&scale!==1&&--maxIterations)}if(parts){start=tween.start=+start||+target||0;tween.unit=unit;tween.end=parts[1]?start+(parts[1]+1)*parts[2]:+parts[2]}return tween}]};function createFxNow(){setTimeout(function(){fxNow=
undefined});return fxNow=jQuery.now()}function genFx(type,includeWidth){var which,i=0,attrs={height:type};includeWidth=includeWidth?1:0;for(;i<4;i+=2-includeWidth){which=cssExpand[i];attrs["margin"+which]=attrs["padding"+which]=type}if(includeWidth)attrs.opacity=attrs.width=type;return attrs}function createTween(value,prop,animation){var tween,collection=(tweeners[prop]||[]).concat(tweeners["*"]),index=0,length=collection.length;for(;index<length;index++)if(tween=collection[index].call(animation,
prop,value))return tween}function defaultPrefilter(elem,props,opts){var prop,value,toggle,tween,hooks,oldfire,display,checkDisplay,anim=this,orig={},style=elem.style,hidden=elem.nodeType&&isHidden(elem),dataShow=data_priv.get(elem,"fxshow");if(!opts.queue){hooks=jQuery._queueHooks(elem,"fx");if(hooks.unqueued==null){hooks.unqueued=0;oldfire=hooks.empty.fire;hooks.empty.fire=function(){if(!hooks.unqueued)oldfire()}}hooks.unqueued++;anim.always(function(){anim.always(function(){hooks.unqueued--;if(!jQuery.queue(elem,
"fx").length)hooks.empty.fire()})})}if(elem.nodeType===1&&("height"in props||"width"in props)){opts.overflow=[style.overflow,style.overflowX,style.overflowY];display=jQuery.css(elem,"display");checkDisplay=display==="none"?data_priv.get(elem,"olddisplay")||defaultDisplay(elem.nodeName):display;if(checkDisplay==="inline"&&jQuery.css(elem,"float")==="none")style.display="inline-block"}if(opts.overflow){style.overflow="hidden";anim.always(function(){style.overflow=opts.overflow[0];style.overflowX=opts.overflow[1];
style.overflowY=opts.overflow[2]})}for(prop in props){value=props[prop];if(rfxtypes.exec(value)){delete props[prop];toggle=toggle||value==="toggle";if(value===(hidden?"hide":"show"))if(value==="show"&&dataShow&&dataShow[prop]!==undefined)hidden=true;else continue;orig[prop]=dataShow&&dataShow[prop]||jQuery.style(elem,prop)}else display=undefined}if(!jQuery.isEmptyObject(orig)){if(dataShow){if("hidden"in dataShow)hidden=dataShow.hidden}else dataShow=data_priv.access(elem,"fxshow",{});if(toggle)dataShow.hidden=
!hidden;if(hidden)jQuery(elem).show();else anim.done(function(){jQuery(elem).hide()});anim.done(function(){var prop;data_priv.remove(elem,"fxshow");for(prop in orig)jQuery.style(elem,prop,orig[prop])});for(prop in orig){tween=createTween(hidden?dataShow[prop]:0,prop,anim);if(!(prop in dataShow)){dataShow[prop]=tween.start;if(hidden){tween.end=tween.start;tween.start=prop==="width"||prop==="height"?1:0}}}}else if((display==="none"?defaultDisplay(elem.nodeName):display)==="inline")style.display=display}
function propFilter(props,specialEasing){var index,name,easing,value,hooks;for(index in props){name=jQuery.camelCase(index);easing=specialEasing[name];value=props[index];if(jQuery.isArray(value)){easing=value[1];value=props[index]=value[0]}if(index!==name){props[name]=value;delete props[index]}hooks=jQuery.cssHooks[name];if(hooks&&"expand"in hooks){value=hooks.expand(value);delete props[name];for(index in value)if(!(index in props)){props[index]=value[index];specialEasing[index]=easing}}else specialEasing[name]=
easing}}function Animation(elem,properties,options){var result,stopped,index=0,length=animationPrefilters.length,deferred=jQuery.Deferred().always(function(){delete tick.elem}),tick=function(){if(stopped)return false;var currentTime=fxNow||createFxNow(),remaining=Math.max(0,animation.startTime+animation.duration-currentTime),temp=remaining/animation.duration||0,percent=1-temp,index=0,length=animation.tweens.length;for(;index<length;index++)animation.tweens[index].run(percent);deferred.notifyWith(elem,
[animation,percent,remaining]);if(percent<1&&length)return remaining;else{deferred.resolveWith(elem,[animation]);return false}},animation=deferred.promise({elem:elem,props:jQuery.extend({},properties),opts:jQuery.extend(true,{specialEasing:{}},options),originalProperties:properties,originalOptions:options,startTime:fxNow||createFxNow(),duration:options.duration,tweens:[],createTween:function(prop,end){var tween=jQuery.Tween(elem,animation.opts,prop,end,animation.opts.specialEasing[prop]||animation.opts.easing);
animation.tweens.push(tween);return tween},stop:function(gotoEnd){var index=0,length=gotoEnd?animation.tweens.length:0;if(stopped)return this;stopped=true;for(;index<length;index++)animation.tweens[index].run(1);if(gotoEnd)deferred.resolveWith(elem,[animation,gotoEnd]);else deferred.rejectWith(elem,[animation,gotoEnd]);return this}}),props=animation.props;propFilter(props,animation.opts.specialEasing);for(;index<length;index++){result=animationPrefilters[index].call(animation,elem,props,animation.opts);
if(result)return result}jQuery.map(props,createTween,animation);if(jQuery.isFunction(animation.opts.start))animation.opts.start.call(elem,animation);jQuery.fx.timer(jQuery.extend(tick,{elem:elem,anim:animation,queue:animation.opts.queue}));return animation.progress(animation.opts.progress).done(animation.opts.done,animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always)}jQuery.Animation=jQuery.extend(Animation,{tweener:function(props,callback){if(jQuery.isFunction(props)){callback=
props;props=["*"]}else props=props.split(" ");var prop,index=0,length=props.length;for(;index<length;index++){prop=props[index];tweeners[prop]=tweeners[prop]||[];tweeners[prop].unshift(callback)}},prefilter:function(callback,prepend){if(prepend)animationPrefilters.unshift(callback);else animationPrefilters.push(callback)}});jQuery.speed=function(speed,easing,fn){var opt=speed&&typeof speed==="object"?jQuery.extend({},speed):{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,
easing:fn&&easing||easing&&!jQuery.isFunction(easing)&&easing};opt.duration=jQuery.fx.off?0:typeof opt.duration==="number"?opt.duration:opt.duration in jQuery.fx.speeds?jQuery.fx.speeds[opt.duration]:jQuery.fx.speeds._default;if(opt.queue==null||opt.queue===true)opt.queue="fx";opt.old=opt.complete;opt.complete=function(){if(jQuery.isFunction(opt.old))opt.old.call(this);if(opt.queue)jQuery.dequeue(this,opt.queue)};return opt};jQuery.fn.extend({fadeTo:function(speed,to,easing,callback){return this.filter(isHidden).css("opacity",
0).show().end().animate({opacity:to},speed,easing,callback)},animate:function(prop,speed,easing,callback){var empty=jQuery.isEmptyObject(prop),optall=jQuery.speed(speed,easing,callback),doAnimation=function(){var anim=Animation(this,jQuery.extend({},prop),optall);if(empty||data_priv.get(this,"finish"))anim.stop(true)};doAnimation.finish=doAnimation;return empty||optall.queue===false?this.each(doAnimation):this.queue(optall.queue,doAnimation)},stop:function(type,clearQueue,gotoEnd){var stopQueue=function(hooks){var stop=
hooks.stop;delete hooks.stop;stop(gotoEnd)};if(typeof type!=="string"){gotoEnd=clearQueue;clearQueue=type;type=undefined}if(clearQueue&&type!==false)this.queue(type||"fx",[]);return this.each(function(){var dequeue=true,index=type!=null&&type+"queueHooks",timers=jQuery.timers,data=data_priv.get(this);if(index){if(data[index]&&data[index].stop)stopQueue(data[index])}else for(index in data)if(data[index]&&data[index].stop&&rrun.test(index))stopQueue(data[index]);for(index=timers.length;index--;)if(timers[index].elem===
this&&(type==null||timers[index].queue===type)){timers[index].anim.stop(gotoEnd);dequeue=false;timers.splice(index,1)}if(dequeue||!gotoEnd)jQuery.dequeue(this,type)})},finish:function(type){if(type!==false)type=type||"fx";return this.each(function(){var index,data=data_priv.get(this),queue=data[type+"queue"],hooks=data[type+"queueHooks"],timers=jQuery.timers,length=queue?queue.length:0;data.finish=true;jQuery.queue(this,type,[]);if(hooks&&hooks.stop)hooks.stop.call(this,true);for(index=timers.length;index--;)if(timers[index].elem===
this&&timers[index].queue===type){timers[index].anim.stop(true);timers.splice(index,1)}for(index=0;index<length;index++)if(queue[index]&&queue[index].finish)queue[index].finish.call(this);delete data.finish})}});jQuery.each(["toggle","show","hide"],function(i,name){var cssFn=jQuery.fn[name];jQuery.fn[name]=function(speed,easing,callback){return speed==null||typeof speed==="boolean"?cssFn.apply(this,arguments):this.animate(genFx(name,true),speed,easing,callback)}});jQuery.each({slideDown:genFx("show"),
slideUp:genFx("hide"),slideToggle:genFx("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(name,props){jQuery.fn[name]=function(speed,easing,callback){return this.animate(props,speed,easing,callback)}});jQuery.timers=[];jQuery.fx.tick=function(){var timer,i=0,timers=jQuery.timers;fxNow=jQuery.now();for(;i<timers.length;i++){timer=timers[i];if(!timer()&&timers[i]===timer)timers.splice(i--,1)}if(!timers.length)jQuery.fx.stop();fxNow=undefined};jQuery.fx.timer=
function(timer){jQuery.timers.push(timer);if(timer())jQuery.fx.start();else jQuery.timers.pop()};jQuery.fx.interval=13;jQuery.fx.start=function(){if(!timerId)timerId=setInterval(jQuery.fx.tick,jQuery.fx.interval)};jQuery.fx.stop=function(){clearInterval(timerId);timerId=null};jQuery.fx.speeds={slow:600,fast:200,_default:400};jQuery.fn.delay=function(time,type){time=jQuery.fx?jQuery.fx.speeds[time]||time:time;type=type||"fx";return this.queue(type,function(next,hooks){var timeout=setTimeout(next,time);
hooks.stop=function(){clearTimeout(timeout)}})};(function(){var input=document.createElement("input"),select=document.createElement("select"),opt=select.appendChild(document.createElement("option"));input.type="checkbox";support.checkOn=input.value!=="";support.optSelected=opt.selected;select.disabled=true;support.optDisabled=!opt.disabled;input=document.createElement("input");input.value="t";input.type="radio";support.radioValue=input.value==="t"})();var nodeHook,boolHook,attrHandle=jQuery.expr.attrHandle;
jQuery.fn.extend({attr:function(name,value){return access(this,jQuery.attr,name,value,arguments.length>1)},removeAttr:function(name){return this.each(function(){jQuery.removeAttr(this,name)})}});jQuery.extend({attr:function(elem,name,value){var hooks,ret,nType=elem.nodeType;if(!elem||nType===3||nType===8||nType===2)return;if(typeof elem.getAttribute===strundefined)return jQuery.prop(elem,name,value);if(nType!==1||!jQuery.isXMLDoc(elem)){name=name.toLowerCase();hooks=jQuery.attrHooks[name]||(jQuery.expr.match.bool.test(name)?
boolHook:nodeHook)}if(value!==undefined)if(value===null)jQuery.removeAttr(elem,name);else if(hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined)return ret;else{elem.setAttribute(name,value+"");return value}else if(hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null)return ret;else{ret=jQuery.find.attr(elem,name);return ret==null?undefined:ret}},removeAttr:function(elem,value){var name,propName,i=0,attrNames=value&&value.match(rnotwhite);if(attrNames&&elem.nodeType===1)while(name=
attrNames[i++]){propName=jQuery.propFix[name]||name;if(jQuery.expr.match.bool.test(name))elem[propName]=false;elem.removeAttribute(name)}},attrHooks:{type:{set:function(elem,value){if(!support.radioValue&&value==="radio"&&jQuery.nodeName(elem,"input")){var val=elem.value;elem.setAttribute("type",value);if(val)elem.value=val;return value}}}}});boolHook={set:function(elem,value,name){if(value===false)jQuery.removeAttr(elem,name);else elem.setAttribute(name,name);return name}};jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g),
function(i,name){var getter=attrHandle[name]||jQuery.find.attr;attrHandle[name]=function(elem,name,isXML){var ret,handle;if(!isXML){handle=attrHandle[name];attrHandle[name]=ret;ret=getter(elem,name,isXML)!=null?name.toLowerCase():null;attrHandle[name]=handle}return ret}});var rfocusable=/^(?:input|select|textarea|button)$/i;jQuery.fn.extend({prop:function(name,value){return access(this,jQuery.prop,name,value,arguments.length>1)},removeProp:function(name){return this.each(function(){delete this[jQuery.propFix[name]||
name]})}});jQuery.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(elem,name,value){var ret,hooks,notxml,nType=elem.nodeType;if(!elem||nType===3||nType===8||nType===2)return;notxml=nType!==1||!jQuery.isXMLDoc(elem);if(notxml){name=jQuery.propFix[name]||name;hooks=jQuery.propHooks[name]}if(value!==undefined)return hooks&&"set"in hooks&&(ret=hooks.set(elem,value,name))!==undefined?ret:elem[name]=value;else return hooks&&"get"in hooks&&(ret=hooks.get(elem,name))!==null?ret:elem[name]},
propHooks:{tabIndex:{get:function(elem){return elem.hasAttribute("tabindex")||rfocusable.test(elem.nodeName)||elem.href?elem.tabIndex:-1}}}});if(!support.optSelected)jQuery.propHooks.selected={get:function(elem){var parent=elem.parentNode;if(parent&&parent.parentNode)parent.parentNode.selectedIndex;return null}};jQuery.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){jQuery.propFix[this.toLowerCase()]=this});
var rclass=/[\t\r\n\f]/g;jQuery.fn.extend({addClass:function(value){var classes,elem,cur,clazz,j,finalValue,proceed=typeof value==="string"&&value,i=0,len=this.length;if(jQuery.isFunction(value))return this.each(function(j){jQuery(this).addClass(value.call(this,j,this.className))});if(proceed){classes=(value||"").match(rnotwhite)||[];for(;i<len;i++){elem=this[i];cur=elem.nodeType===1&&(elem.className?(" "+elem.className+" ").replace(rclass," "):" ");if(cur){j=0;while(clazz=classes[j++])if(cur.indexOf(" "+
clazz+" ")<0)cur+=clazz+" ";finalValue=jQuery.trim(cur);if(elem.className!==finalValue)elem.className=finalValue}}}return this},removeClass:function(value){var classes,elem,cur,clazz,j,finalValue,proceed=arguments.length===0||typeof value==="string"&&value,i=0,len=this.length;if(jQuery.isFunction(value))return this.each(function(j){jQuery(this).removeClass(value.call(this,j,this.className))});if(proceed){classes=(value||"").match(rnotwhite)||[];for(;i<len;i++){elem=this[i];cur=elem.nodeType===1&&
(elem.className?(" "+elem.className+" ").replace(rclass," "):"");if(cur){j=0;while(clazz=classes[j++])while(cur.indexOf(" "+clazz+" ")>=0)cur=cur.replace(" "+clazz+" "," ");finalValue=value?jQuery.trim(cur):"";if(elem.className!==finalValue)elem.className=finalValue}}}return this},toggleClass:function(value,stateVal){var type=typeof value;if(typeof stateVal==="boolean"&&type==="string")return stateVal?this.addClass(value):this.removeClass(value);if(jQuery.isFunction(value))return this.each(function(i){jQuery(this).toggleClass(value.call(this,
i,this.className,stateVal),stateVal)});return this.each(function(){if(type==="string"){var className,i=0,self=jQuery(this),classNames=value.match(rnotwhite)||[];while(className=classNames[i++])if(self.hasClass(className))self.removeClass(className);else self.addClass(className)}else if(type===strundefined||type==="boolean"){if(this.className)data_priv.set(this,"__className__",this.className);this.className=this.className||value===false?"":data_priv.get(this,"__className__")||""}})},hasClass:function(selector){var className=
" "+selector+" ",i=0,l=this.length;for(;i<l;i++)if(this[i].nodeType===1&&(" "+this[i].className+" ").replace(rclass," ").indexOf(className)>=0)return true;return false}});var rreturn=/\r/g;jQuery.fn.extend({val:function(value){var hooks,ret,isFunction,elem=this[0];if(!arguments.length){if(elem){hooks=jQuery.valHooks[elem.type]||jQuery.valHooks[elem.nodeName.toLowerCase()];if(hooks&&"get"in hooks&&(ret=hooks.get(elem,"value"))!==undefined)return ret;ret=elem.value;return typeof ret==="string"?ret.replace(rreturn,
""):ret==null?"":ret}return}isFunction=jQuery.isFunction(value);return this.each(function(i){var val;if(this.nodeType!==1)return;if(isFunction)val=value.call(this,i,jQuery(this).val());else val=value;if(val==null)val="";else if(typeof val==="number")val+="";else if(jQuery.isArray(val))val=jQuery.map(val,function(value){return value==null?"":value+""});hooks=jQuery.valHooks[this.type]||jQuery.valHooks[this.nodeName.toLowerCase()];if(!hooks||!("set"in hooks)||hooks.set(this,val,"value")===undefined)this.value=
val})}});jQuery.extend({valHooks:{option:{get:function(elem){var val=jQuery.find.attr(elem,"value");return val!=null?val:jQuery.trim(jQuery.text(elem))}},select:{get:function(elem){var value,option,options=elem.options,index=elem.selectedIndex,one=elem.type==="select-one"||index<0,values=one?null:[],max=one?index+1:options.length,i=index<0?max:one?index:0;for(;i<max;i++){option=options[i];if((option.selected||i===index)&&(support.optDisabled?!option.disabled:option.getAttribute("disabled")===null)&&
(!option.parentNode.disabled||!jQuery.nodeName(option.parentNode,"optgroup"))){value=jQuery(option).val();if(one)return value;values.push(value)}}return values},set:function(elem,value){var optionSet,option,options=elem.options,values=jQuery.makeArray(value),i=options.length;while(i--){option=options[i];if(option.selected=jQuery.inArray(option.value,values)>=0)optionSet=true}if(!optionSet)elem.selectedIndex=-1;return values}}}});jQuery.each(["radio","checkbox"],function(){jQuery.valHooks[this]={set:function(elem,
value){if(jQuery.isArray(value))return elem.checked=jQuery.inArray(jQuery(elem).val(),value)>=0}};if(!support.checkOn)jQuery.valHooks[this].get=function(elem){return elem.getAttribute("value")===null?"on":elem.value}});jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select submit keydown keypress keyup error contextmenu").split(" "),function(i,name){jQuery.fn[name]=function(data,fn){return arguments.length>
0?this.on(name,null,data,fn):this.trigger(name)}});jQuery.fn.extend({hover:function(fnOver,fnOut){return this.mouseenter(fnOver).mouseleave(fnOut||fnOver)},bind:function(types,data,fn){return this.on(types,null,data,fn)},unbind:function(types,fn){return this.off(types,null,fn)},delegate:function(selector,types,data,fn){return this.on(types,selector,data,fn)},undelegate:function(selector,types,fn){return arguments.length===1?this.off(selector,"**"):this.off(types,selector||"**",fn)}});var nonce=jQuery.now();
var rquery=/\?/;jQuery.parseJSON=function(data){return JSON.parse(data+"")};jQuery.parseXML=function(data){var xml,tmp;if(!data||typeof data!=="string")return null;try{tmp=new DOMParser;xml=tmp.parseFromString(data,"text/xml")}catch(e){xml=undefined}if(!xml||xml.getElementsByTagName("parsererror").length)jQuery.error("Invalid XML: "+data);return xml};var rhash=/#.*$/,rts=/([?&])_=[^&]*/,rheaders=/^(.*?):[ \t]*([^\r\n]*)$/mg,rlocalProtocol=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
rnoContent=/^(?:GET|HEAD)$/,rprotocol=/^\/\//,rurl=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,prefilters={},transports={},allTypes="*/".concat("*"),ajaxLocation=window.location.href,ajaxLocParts=rurl.exec(ajaxLocation.toLowerCase())||[];function addToPrefiltersOrTransports(structure){return function(dataTypeExpression,func){if(typeof dataTypeExpression!=="string"){func=dataTypeExpression;dataTypeExpression="*"}var dataType,i=0,dataTypes=dataTypeExpression.toLowerCase().match(rnotwhite)||
[];if(jQuery.isFunction(func))while(dataType=dataTypes[i++])if(dataType[0]==="+"){dataType=dataType.slice(1)||"*";(structure[dataType]=structure[dataType]||[]).unshift(func)}else(structure[dataType]=structure[dataType]||[]).push(func)}}function inspectPrefiltersOrTransports(structure,options,originalOptions,jqXHR){var inspected={},seekingTransport=structure===transports;function inspect(dataType){var selected;inspected[dataType]=true;jQuery.each(structure[dataType]||[],function(_,prefilterOrFactory){var dataTypeOrTransport=
prefilterOrFactory(options,originalOptions,jqXHR);if(typeof dataTypeOrTransport==="string"&&!seekingTransport&&!inspected[dataTypeOrTransport]){options.dataTypes.unshift(dataTypeOrTransport);inspect(dataTypeOrTransport);return false}else if(seekingTransport)return!(selected=dataTypeOrTransport)});return selected}return inspect(options.dataTypes[0])||!inspected["*"]&&inspect("*")}function ajaxExtend(target,src){var key,deep,flatOptions=jQuery.ajaxSettings.flatOptions||{};for(key in src)if(src[key]!==
undefined)(flatOptions[key]?target:deep||(deep={}))[key]=src[key];if(deep)jQuery.extend(true,target,deep);return target}function ajaxHandleResponses(s,jqXHR,responses){var ct,type,finalDataType,firstDataType,contents=s.contents,dataTypes=s.dataTypes;while(dataTypes[0]==="*"){dataTypes.shift();if(ct===undefined)ct=s.mimeType||jqXHR.getResponseHeader("Content-Type")}if(ct)for(type in contents)if(contents[type]&&contents[type].test(ct)){dataTypes.unshift(type);break}if(dataTypes[0]in responses)finalDataType=
dataTypes[0];else{for(type in responses){if(!dataTypes[0]||s.converters[type+" "+dataTypes[0]]){finalDataType=type;break}if(!firstDataType)firstDataType=type}finalDataType=finalDataType||firstDataType}if(finalDataType){if(finalDataType!==dataTypes[0])dataTypes.unshift(finalDataType);return responses[finalDataType]}}function ajaxConvert(s,response,jqXHR,isSuccess){var conv2,current,conv,tmp,prev,converters={},dataTypes=s.dataTypes.slice();if(dataTypes[1])for(conv in s.converters)converters[conv.toLowerCase()]=
s.converters[conv];current=dataTypes.shift();while(current){if(s.responseFields[current])jqXHR[s.responseFields[current]]=response;if(!prev&&isSuccess&&s.dataFilter)response=s.dataFilter(response,s.dataType);prev=current;current=dataTypes.shift();if(current)if(current==="*")current=prev;else if(prev!=="*"&&prev!==current){conv=converters[prev+" "+current]||converters["* "+current];if(!conv)for(conv2 in converters){tmp=conv2.split(" ");if(tmp[1]===current){conv=converters[prev+" "+tmp[0]]||converters["* "+
tmp[0]];if(conv){if(conv===true)conv=converters[conv2];else if(converters[conv2]!==true){current=tmp[0];dataTypes.unshift(tmp[1])}break}}}if(conv!==true)if(conv&&s["throws"])response=conv(response);else try{response=conv(response)}catch(e){return{state:"parsererror",error:conv?e:"No conversion from "+prev+" to "+current}}}}return{state:"success",data:response}}jQuery.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:ajaxLocation,type:"GET",isLocal:rlocalProtocol.test(ajaxLocParts[1]),global:true,
processData:true,async:true,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":allTypes,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":true,"text json":jQuery.parseJSON,"text xml":jQuery.parseXML},flatOptions:{url:true,context:true}},ajaxSetup:function(target,
settings){return settings?ajaxExtend(ajaxExtend(target,jQuery.ajaxSettings),settings):ajaxExtend(jQuery.ajaxSettings,target)},ajaxPrefilter:addToPrefiltersOrTransports(prefilters),ajaxTransport:addToPrefiltersOrTransports(transports),ajax:function(url,options){if(typeof url==="object"){options=url;url=undefined}options=options||{};var transport,cacheURL,responseHeadersString,responseHeaders,timeoutTimer,parts,fireGlobals,i,s=jQuery.ajaxSetup({},options),callbackContext=s.context||s,globalEventContext=
s.context&&(callbackContext.nodeType||callbackContext.jquery)?jQuery(callbackContext):jQuery.event,deferred=jQuery.Deferred(),completeDeferred=jQuery.Callbacks("once memory"),statusCode=s.statusCode||{},requestHeaders={},requestHeadersNames={},state=0,strAbort="canceled",jqXHR={readyState:0,getResponseHeader:function(key){var match;if(state===2){if(!responseHeaders){responseHeaders={};while(match=rheaders.exec(responseHeadersString))responseHeaders[match[1].toLowerCase()]=match[2]}match=responseHeaders[key.toLowerCase()]}return match==
null?null:match},getAllResponseHeaders:function(){return state===2?responseHeadersString:null},setRequestHeader:function(name,value){var lname=name.toLowerCase();if(!state){name=requestHeadersNames[lname]=requestHeadersNames[lname]||name;requestHeaders[name]=value}return this},overrideMimeType:function(type){if(!state)s.mimeType=type;return this},statusCode:function(map){var code;if(map)if(state<2)for(code in map)statusCode[code]=[statusCode[code],map[code]];else jqXHR.always(map[jqXHR.status]);return this},
abort:function(statusText){var finalText=statusText||strAbort;if(transport)transport.abort(finalText);done(0,finalText);return this}};deferred.promise(jqXHR).complete=completeDeferred.add;jqXHR.success=jqXHR.done;jqXHR.error=jqXHR.fail;s.url=((url||s.url||ajaxLocation)+"").replace(rhash,"").replace(rprotocol,ajaxLocParts[1]+"//");s.type=options.method||options.type||s.method||s.type;s.dataTypes=jQuery.trim(s.dataType||"*").toLowerCase().match(rnotwhite)||[""];if(s.crossDomain==null){parts=rurl.exec(s.url.toLowerCase());
s.crossDomain=!!(parts&&(parts[1]!==ajaxLocParts[1]||parts[2]!==ajaxLocParts[2]||(parts[3]||(parts[1]==="http:"?"80":"443"))!==(ajaxLocParts[3]||(ajaxLocParts[1]==="http:"?"80":"443"))))}if(s.data&&s.processData&&typeof s.data!=="string")s.data=jQuery.param(s.data,s.traditional);inspectPrefiltersOrTransports(prefilters,s,options,jqXHR);if(state===2)return jqXHR;fireGlobals=jQuery.event&&s.global;if(fireGlobals&&jQuery.active++===0)jQuery.event.trigger("ajaxStart");s.type=s.type.toUpperCase();s.hasContent=
!rnoContent.test(s.type);cacheURL=s.url;if(!s.hasContent){if(s.data){cacheURL=s.url+=(rquery.test(cacheURL)?"&":"?")+s.data;delete s.data}if(s.cache===false)s.url=rts.test(cacheURL)?cacheURL.replace(rts,"$1_="+nonce++):cacheURL+(rquery.test(cacheURL)?"&":"?")+"_="+nonce++}if(s.ifModified){if(jQuery.lastModified[cacheURL])jqXHR.setRequestHeader("If-Modified-Since",jQuery.lastModified[cacheURL]);if(jQuery.etag[cacheURL])jqXHR.setRequestHeader("If-None-Match",jQuery.etag[cacheURL])}if(s.data&&s.hasContent&&
s.contentType!==false||options.contentType)jqXHR.setRequestHeader("Content-Type",s.contentType);jqXHR.setRequestHeader("Accept",s.dataTypes[0]&&s.accepts[s.dataTypes[0]]?s.accepts[s.dataTypes[0]]+(s.dataTypes[0]!=="*"?", "+allTypes+"; q=0.01":""):s.accepts["*"]);for(i in s.headers)jqXHR.setRequestHeader(i,s.headers[i]);if(s.beforeSend&&(s.beforeSend.call(callbackContext,jqXHR,s)===false||state===2))return jqXHR.abort();strAbort="abort";for(i in{success:1,error:1,complete:1})jqXHR[i](s[i]);transport=
inspectPrefiltersOrTransports(transports,s,options,jqXHR);if(!transport)done(-1,"No Transport");else{jqXHR.readyState=1;if(fireGlobals)globalEventContext.trigger("ajaxSend",[jqXHR,s]);if(s.async&&s.timeout>0)timeoutTimer=setTimeout(function(){jqXHR.abort("timeout")},s.timeout);try{state=1;transport.send(requestHeaders,done)}catch(e){if(state<2)done(-1,e);else throw e;}}function done(status,nativeStatusText,responses,headers){var isSuccess,success,error,response,modified,statusText=nativeStatusText;
if(state===2)return;state=2;if(timeoutTimer)clearTimeout(timeoutTimer);transport=undefined;responseHeadersString=headers||"";jqXHR.readyState=status>0?4:0;isSuccess=status>=200&&status<300||status===304;if(responses)response=ajaxHandleResponses(s,jqXHR,responses);response=ajaxConvert(s,response,jqXHR,isSuccess);if(isSuccess){if(s.ifModified){modified=jqXHR.getResponseHeader("Last-Modified");if(modified)jQuery.lastModified[cacheURL]=modified;modified=jqXHR.getResponseHeader("etag");if(modified)jQuery.etag[cacheURL]=
modified}if(status===204||s.type==="HEAD")statusText="nocontent";else if(status===304)statusText="notmodified";else{statusText=response.state;success=response.data;error=response.error;isSuccess=!error}}else{error=statusText;if(status||!statusText){statusText="error";if(status<0)status=0}}jqXHR.status=status;jqXHR.statusText=(nativeStatusText||statusText)+"";if(isSuccess)deferred.resolveWith(callbackContext,[success,statusText,jqXHR]);else deferred.rejectWith(callbackContext,[jqXHR,statusText,error]);
jqXHR.statusCode(statusCode);statusCode=undefined;if(fireGlobals)globalEventContext.trigger(isSuccess?"ajaxSuccess":"ajaxError",[jqXHR,s,isSuccess?success:error]);completeDeferred.fireWith(callbackContext,[jqXHR,statusText]);if(fireGlobals){globalEventContext.trigger("ajaxComplete",[jqXHR,s]);if(!--jQuery.active)jQuery.event.trigger("ajaxStop")}}return jqXHR},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json")},getScript:function(url,callback){return jQuery.get(url,undefined,
callback,"script")}});jQuery.each(["get","post"],function(i,method){jQuery[method]=function(url,data,callback,type){if(jQuery.isFunction(data)){type=type||callback;callback=data;data=undefined}return jQuery.ajax({url:url,type:method,dataType:type,data:data,success:callback})}});jQuery._evalUrl=function(url){return jQuery.ajax({url:url,type:"GET",dataType:"script",async:false,global:false,"throws":true})};jQuery.fn.extend({wrapAll:function(html){var wrap;if(jQuery.isFunction(html))return this.each(function(i){jQuery(this).wrapAll(html.call(this,
i))});if(this[0]){wrap=jQuery(html,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode)wrap.insertBefore(this[0]);wrap.map(function(){var elem=this;while(elem.firstElementChild)elem=elem.firstElementChild;return elem}).append(this)}return this},wrapInner:function(html){if(jQuery.isFunction(html))return this.each(function(i){jQuery(this).wrapInner(html.call(this,i))});return this.each(function(){var self=jQuery(this),contents=self.contents();if(contents.length)contents.wrapAll(html);else self.append(html)})},
wrap:function(html){var isFunction=jQuery.isFunction(html);return this.each(function(i){jQuery(this).wrapAll(isFunction?html.call(this,i):html)})},unwrap:function(){return this.parent().each(function(){if(!jQuery.nodeName(this,"body"))jQuery(this).replaceWith(this.childNodes)}).end()}});jQuery.expr.filters.hidden=function(elem){return elem.offsetWidth<=0&&elem.offsetHeight<=0};jQuery.expr.filters.visible=function(elem){return!jQuery.expr.filters.hidden(elem)};var r20=/%20/g,rbracket=/\[\]$/,rCRLF=
/\r?\n/g,rsubmitterTypes=/^(?:submit|button|image|reset|file)$/i,rsubmittable=/^(?:input|select|textarea|keygen)/i;function buildParams(prefix,obj,traditional,add){var name;if(jQuery.isArray(obj))jQuery.each(obj,function(i,v){if(traditional||rbracket.test(prefix))add(prefix,v);else buildParams(prefix+"["+(typeof v==="object"?i:"")+"]",v,traditional,add)});else if(!traditional&&jQuery.type(obj)==="object")for(name in obj)buildParams(prefix+"["+name+"]",obj[name],traditional,add);else add(prefix,obj)}
jQuery.param=function(a,traditional){var prefix,s=[],add=function(key,value){value=jQuery.isFunction(value)?value():value==null?"":value;s[s.length]=encodeURIComponent(key)+"="+encodeURIComponent(value)};if(traditional===undefined)traditional=jQuery.ajaxSettings&&jQuery.ajaxSettings.traditional;if(jQuery.isArray(a)||a.jquery&&!jQuery.isPlainObject(a))jQuery.each(a,function(){add(this.name,this.value)});else for(prefix in a)buildParams(prefix,a[prefix],traditional,add);return s.join("&").replace(r20,
"+")};jQuery.fn.extend({serialize:function(){return jQuery.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var elements=jQuery.prop(this,"elements");return elements?jQuery.makeArray(elements):this}).filter(function(){var type=this.type;return this.name&&!jQuery(this).is(":disabled")&&rsubmittable.test(this.nodeName)&&!rsubmitterTypes.test(type)&&(this.checked||!rcheckableType.test(type))}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:jQuery.isArray(val)?
jQuery.map(val,function(val){return{name:elem.name,value:val.replace(rCRLF,"\r\n")}}):{name:elem.name,value:val.replace(rCRLF,"\r\n")}}).get()}});jQuery.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(e){}};var xhrId=0,xhrCallbacks={},xhrSuccessStatus={0:200,1223:204},xhrSupported=jQuery.ajaxSettings.xhr();if(window.attachEvent)window.attachEvent("onunload",function(){for(var key in xhrCallbacks)xhrCallbacks[key]()});support.cors=!!xhrSupported&&"withCredentials"in xhrSupported;support.ajax=
xhrSupported=!!xhrSupported;jQuery.ajaxTransport(function(options){var callback;if(support.cors||xhrSupported&&!options.crossDomain)return{send:function(headers,complete){var i,xhr=options.xhr(),id=++xhrId;xhr.open(options.type,options.url,options.async,options.username,options.password);if(options.xhrFields)for(i in options.xhrFields)xhr[i]=options.xhrFields[i];if(options.mimeType&&xhr.overrideMimeType)xhr.overrideMimeType(options.mimeType);if(!options.crossDomain&&!headers["X-Requested-With"])headers["X-Requested-With"]=
"XMLHttpRequest";for(i in headers)xhr.setRequestHeader(i,headers[i]);callback=function(type){return function(){if(callback){delete xhrCallbacks[id];callback=xhr.onload=xhr.onerror=null;if(type==="abort")xhr.abort();else if(type==="error")complete(xhr.status,xhr.statusText);else complete(xhrSuccessStatus[xhr.status]||xhr.status,xhr.statusText,typeof xhr.responseText==="string"?{text:xhr.responseText}:undefined,xhr.getAllResponseHeaders())}}};xhr.onload=callback();xhr.onerror=callback("error");callback=
xhrCallbacks[id]=callback("abort");try{xhr.send(options.hasContent&&options.data||null)}catch(e){if(callback)throw e;}},abort:function(){if(callback)callback()}}});jQuery.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(text){jQuery.globalEval(text);return text}}});jQuery.ajaxPrefilter("script",function(s){if(s.cache===undefined)s.cache=false;if(s.crossDomain)s.type=
"GET"});jQuery.ajaxTransport("script",function(s){if(s.crossDomain){var script,callback;return{send:function(_,complete){script=jQuery("<script>").prop({async:true,charset:s.scriptCharset,src:s.url}).on("load error",callback=function(evt){script.remove();callback=null;if(evt)complete(evt.type==="error"?404:200,evt.type)});document.head.appendChild(script[0])},abort:function(){if(callback)callback()}}}});var oldCallbacks=[],rjsonp=/(=)\?(?=&|$)|\?\?/;jQuery.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var callback=
oldCallbacks.pop()||jQuery.expando+"_"+nonce++;this[callback]=true;return callback}});jQuery.ajaxPrefilter("json jsonp",function(s,originalSettings,jqXHR){var callbackName,overwritten,responseContainer,jsonProp=s.jsonp!==false&&(rjsonp.test(s.url)?"url":typeof s.data==="string"&&!(s.contentType||"").indexOf("application/x-www-form-urlencoded")&&rjsonp.test(s.data)&&"data");if(jsonProp||s.dataTypes[0]==="jsonp"){callbackName=s.jsonpCallback=jQuery.isFunction(s.jsonpCallback)?s.jsonpCallback():s.jsonpCallback;
if(jsonProp)s[jsonProp]=s[jsonProp].replace(rjsonp,"$1"+callbackName);else if(s.jsonp!==false)s.url+=(rquery.test(s.url)?"&":"?")+s.jsonp+"="+callbackName;s.converters["script json"]=function(){if(!responseContainer)jQuery.error(callbackName+" was not called");return responseContainer[0]};s.dataTypes[0]="json";overwritten=window[callbackName];window[callbackName]=function(){responseContainer=arguments};jqXHR.always(function(){window[callbackName]=overwritten;if(s[callbackName]){s.jsonpCallback=originalSettings.jsonpCallback;
oldCallbacks.push(callbackName)}if(responseContainer&&jQuery.isFunction(overwritten))overwritten(responseContainer[0]);responseContainer=overwritten=undefined});return"script"}});jQuery.parseHTML=function(data,context,keepScripts){if(!data||typeof data!=="string")return null;if(typeof context==="boolean"){keepScripts=context;context=false}context=context||document;var parsed=rsingleTag.exec(data),scripts=!keepScripts&&[];if(parsed)return[context.createElement(parsed[1])];parsed=jQuery.buildFragment([data],
context,scripts);if(scripts&&scripts.length)jQuery(scripts).remove();return jQuery.merge([],parsed.childNodes)};var _load=jQuery.fn.load;jQuery.fn.load=function(url,params,callback){if(typeof url!=="string"&&_load)return _load.apply(this,arguments);var selector,type,response,self=this,off=url.indexOf(" ");if(off>=0){selector=jQuery.trim(url.slice(off));url=url.slice(0,off)}if(jQuery.isFunction(params)){callback=params;params=undefined}else if(params&&typeof params==="object")type="POST";if(self.length>
0)jQuery.ajax({url:url,type:type,dataType:"html",data:params}).done(function(responseText){response=arguments;self.html(selector?jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector):responseText)}).complete(callback&&function(jqXHR,status){self.each(callback,response||[jqXHR.responseText,status,jqXHR])});return this};jQuery.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(i,type){jQuery.fn[type]=function(fn){return this.on(type,fn)}});jQuery.expr.filters.animated=
function(elem){return jQuery.grep(jQuery.timers,function(fn){return elem===fn.elem}).length};var docElem=window.document.documentElement;function getWindow(elem){return jQuery.isWindow(elem)?elem:elem.nodeType===9&&elem.defaultView}jQuery.offset={setOffset:function(elem,options,i){var curPosition,curLeft,curCSSTop,curTop,curOffset,curCSSLeft,calculatePosition,position=jQuery.css(elem,"position"),curElem=jQuery(elem),props={};if(position==="static")elem.style.position="relative";curOffset=curElem.offset();
curCSSTop=jQuery.css(elem,"top");curCSSLeft=jQuery.css(elem,"left");calculatePosition=(position==="absolute"||position==="fixed")&&(curCSSTop+curCSSLeft).indexOf("auto")>-1;if(calculatePosition){curPosition=curElem.position();curTop=curPosition.top;curLeft=curPosition.left}else{curTop=parseFloat(curCSSTop)||0;curLeft=parseFloat(curCSSLeft)||0}if(jQuery.isFunction(options))options=options.call(elem,i,curOffset);if(options.top!=null)props.top=options.top-curOffset.top+curTop;if(options.left!=null)props.left=
options.left-curOffset.left+curLeft;if("using"in options)options.using.call(elem,props);else curElem.css(props)}};jQuery.fn.extend({offset:function(options){if(arguments.length)return options===undefined?this:this.each(function(i){jQuery.offset.setOffset(this,options,i)});var docElem,win,elem=this[0],box={top:0,left:0},doc=elem&&elem.ownerDocument;if(!doc)return;docElem=doc.documentElement;if(!jQuery.contains(docElem,elem))return box;if(typeof elem.getBoundingClientRect!==strundefined)box=elem.getBoundingClientRect();
win=getWindow(doc);return{top:box.top+win.pageYOffset-docElem.clientTop,left:box.left+win.pageXOffset-docElem.clientLeft}},position:function(){if(!this[0])return;var offsetParent,offset,elem=this[0],parentOffset={top:0,left:0};if(jQuery.css(elem,"position")==="fixed")offset=elem.getBoundingClientRect();else{offsetParent=this.offsetParent();offset=this.offset();if(!jQuery.nodeName(offsetParent[0],"html"))parentOffset=offsetParent.offset();parentOffset.top+=jQuery.css(offsetParent[0],"borderTopWidth",
true);parentOffset.left+=jQuery.css(offsetParent[0],"borderLeftWidth",true)}return{top:offset.top-parentOffset.top-jQuery.css(elem,"marginTop",true),left:offset.left-parentOffset.left-jQuery.css(elem,"marginLeft",true)}},offsetParent:function(){return this.map(function(){var offsetParent=this.offsetParent||docElem;while(offsetParent&&(!jQuery.nodeName(offsetParent,"html")&&jQuery.css(offsetParent,"position")==="static"))offsetParent=offsetParent.offsetParent;return offsetParent||docElem})}});jQuery.each({scrollLeft:"pageXOffset",
scrollTop:"pageYOffset"},function(method,prop){var top="pageYOffset"===prop;jQuery.fn[method]=function(val){return access(this,function(elem,method,val){var win=getWindow(elem);if(val===undefined)return win?win[prop]:elem[method];if(win)win.scrollTo(!top?val:window.pageXOffset,top?val:window.pageYOffset);else elem[method]=val},method,val,arguments.length,null)}});jQuery.each(["top","left"],function(i,prop){jQuery.cssHooks[prop]=addGetHookIf(support.pixelPosition,function(elem,computed){if(computed){computed=
curCSS(elem,prop);return rnumnonpx.test(computed)?jQuery(elem).position()[prop]+"px":computed}})});jQuery.each({Height:"height",Width:"width"},function(name,type){jQuery.each({padding:"inner"+name,content:type,"":"outer"+name},function(defaultExtra,funcName){jQuery.fn[funcName]=function(margin,value){var chainable=arguments.length&&(defaultExtra||typeof margin!=="boolean"),extra=defaultExtra||(margin===true||value===true?"margin":"border");return access(this,function(elem,type,value){var doc;if(jQuery.isWindow(elem))return elem.document.documentElement["client"+
name];if(elem.nodeType===9){doc=elem.documentElement;return Math.max(elem.body["scroll"+name],doc["scroll"+name],elem.body["offset"+name],doc["offset"+name],doc["client"+name])}return value===undefined?jQuery.css(elem,type,extra):jQuery.style(elem,type,value,extra)},type,chainable?margin:undefined,chainable,null)}})});jQuery.fn.size=function(){return this.length};jQuery.fn.andSelf=jQuery.fn.addBack;if(typeof define==="function"&&define.amd)define("jquery",[],function(){return jQuery});var _jQuery=
window.jQuery,_$=window.$;jQuery.noConflict=function(deep){if(window.$===jQuery)window.$=_$;if(deep&&window.jQuery===jQuery)window.jQuery=_jQuery;return jQuery};if(typeof noGlobal===strundefined)window.jQuery=window.$=jQuery;return jQuery});;;(function(){function n(n){n=null==n?n:Object(n);var t,r=[];for(t in n)r.push(t);return r}function t(n){return mn(Object(n))}function r(n,t){return n.push.apply(n,t),n}function e(n,t,r,e,u){return u(n,function(n,u,o){r=e?(e=false,n):t(r,n,u,o)}),r}function u(n,t){return x(t,function(t){return n[t]})}function o(n){return n&&n.Object===Object?n:null}function i(n){return cn[n]}function c(n){return n instanceof f?n:new f(n)}function f(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t}function a(n,t,r,e){
var u;return(u=n===rn)||(u=hn[r],u=(n===u||n!==n&&u!==u)&&!vn.call(e,r)),u?t:n}function l(n){return L(n)?_n(n):{}}function p(n,t,r){if(typeof n!="function")throw new TypeError("Expected a function");return setTimeout(function(){n.apply(rn,r)},t)}function s(n,t){var r=true;return xn(n,function(n,e,u){return r=!!t(n,e,u)}),r}function h(n,t,r){for(var e=-1,u=n.length;++e<u;){var o=n[e],i=t(o);if(null!=i&&(c===rn?i===i:r(i,c)))var c=i,f=o}return f}function v(n,t){var r=[];return xn(n,function(n,e,u){t(n,e,u)&&r.push(n);
}),r}function y(n,t,e,u,o){var i=-1,c=n.length;for(e||(e=z),o||(o=[]);++i<c;){var f=n[i];t>0&&e(f)?t>1?y(f,t-1,e,u,o):r(o,f):u||(o[o.length]=f)}return o}function b(n,r){return n&&En(n,r,t)}function g(n,t){return v(t,function(t){return K(n[t])})}function _(n,t){return n>t}function j(n,t,r,e,u){return n===t?true:null==n||null==t||!L(n)&&!Q(t)?n!==n&&t!==t:d(n,t,j,r,e,u)}function d(n,t,r,e,u,o){var i=Tn(n),c=Tn(t),f="[object Array]",a="[object Array]";i||(f=bn.call(n),f="[object Arguments]"==f?"[object Object]":f),
c||(a=bn.call(t),a="[object Arguments]"==a?"[object Object]":a);var l="[object Object]"==f&&true,c="[object Object]"==a&&true,a=f==a;o||(o=[]);var p=kn(o,function(t){return t[0]===n});return p&&p[1]?p[1]==t:(o.push([n,t]),a&&!l?(r=i?I(n,t,r,e,u,o):q(n,t,f),o.pop(),r):2&u||(i=l&&vn.call(n,"__wrapped__"),f=c&&vn.call(t,"__wrapped__"),!i&&!f)?a?(r=$(n,t,r,e,u,o),o.pop(),r):false:(i=i?n.value():n,t=f?t.value():t,r=r(i,t,e,u,o),o.pop(),r))}function m(n){return typeof n=="function"?n:null==n?nn:(typeof n=="object"?E:w)(n);
}function O(n,t){return t>n}function x(n,t){var r=-1,e=H(n)?Array(n.length):[];return xn(n,function(n,u,o){e[++r]=t(n,u,o)}),e}function E(n){var r=t(n);return function(t){var e=r.length;if(null==t)return!e;for(t=Object(t);e--;){var u=r[e];if(!(u in t&&j(n[u],t[u],rn,3)))return false}return true}}function A(n,t){return n=Object(n),M(t,function(t,r){return r in n&&(t[r]=n[r]),t},{})}function w(n){return function(t){return null==t?rn:t[n]}}function k(n,t,r){var e=-1,u=n.length;for(0>t&&(t=-t>u?0:u+t),r=r>u?u:r,
0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,r=Array(u);++e<u;)r[e]=n[e+t];return r}function N(n){return k(n,0,n.length)}function S(n,t){var r;return xn(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function F(n,t){return M(t,function(n,t){return t.func.apply(t.thisArg,r([n],t.args))},n)}function T(n,t,r,e){r||(r={});for(var u=-1,o=t.length;++u<o;){var i=t[u],c=e?e(r[i],n[i],i,r,n):n[i],f=r,a=f[i];vn.call(f,i)&&(a===c||a!==a&&c!==c)&&(c!==rn||i in f)||(f[i]=c)}return r}function B(n){return U(function(t,r){var e=-1,u=r.length,o=u>1?r[u-1]:rn,o=n.length>3&&typeof o=="function"?(u--,
o):rn;for(t=Object(t);++e<u;){var i=r[e];i&&n(t,i,e,o)}return t})}function R(n){return function(){var t=arguments,r=l(n.prototype),t=n.apply(r,t);return L(t)?t:r}}function D(n,t,r){function e(){for(var o=-1,i=arguments.length,c=-1,f=r.length,a=Array(f+i),l=this&&this!==pn&&this instanceof e?u:n;++c<f;)a[c]=r[c];for(;i--;)a[c++]=arguments[++o];return l.apply(t,a)}if(typeof n!="function")throw new TypeError("Expected a function");var u=R(n);return e}function I(n,t,r,e,u,o){var i=n.length,c=t.length;
if(i!=c&&!(2&u&&c>i))return false;for(var c=-1,f=true,a=1&u?[]:rn;++c<i;){var l=n[c],p=t[c];if(void 0!==rn){f=false;break}if(a){if(!S(t,function(n,t){return G(a,t)||l!==n&&!r(l,n,e,u,o)?void 0:a.push(t)})){f=false;break}}else if(l!==p&&!r(l,p,e,u,o)){f=false;break}}return f}function q(n,t,r){switch(r){case"[object Boolean]":case"[object Date]":return+n==+t;case"[object Error]":return n.name==t.name&&n.message==t.message;case"[object Number]":return n!=+n?t!=+t:n==+t;case"[object RegExp]":case"[object String]":return n==t+"";
}return false}function $(n,r,e,u,o,i){var c=2&o,f=t(n),a=f.length,l=t(r).length;if(a!=l&&!c)return false;for(var p=a;p--;){var s=f[p];if(!(c?s in r:vn.call(r,s)))return false}for(l=true;++p<a;){var s=f[p],h=n[s],v=r[s];if(void 0!==rn||h!==v&&!e(h,v,u,o,i)){l=false;break}c||(c="constructor"==s)}return l&&!c&&(e=n.constructor,u=r.constructor,e!=u&&"constructor"in n&&"constructor"in r&&!(typeof e=="function"&&e instanceof e&&typeof u=="function"&&u instanceof u)&&(l=false)),l}function z(n){return Tn(n)||V(n)}function C(n){
return n&&n.length?n[0]:rn}function G(n,t,r){var e=n?n.length:0;r=typeof r=="number"?0>r?On(e+r,0):r:0,r=(r||0)-1;for(var u=t===t;++r<e;){var o=n[r];if(u?o===t:o!==o)return r}return-1}function J(n,t){return xn(n,m(t))}function M(n,t,r){return e(n,m(t),r,3>arguments.length,xn)}function P(n,t){var r;if(typeof t!="function")throw new TypeError("Expected a function");return n=Bn(n),function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=rn),r}}function U(n){var t;if(typeof n!="function")throw new TypeError("Expected a function");
return t=On(t===rn?n.length-1:Bn(t),0),function(){for(var r=arguments,e=-1,u=On(r.length-t,0),o=Array(u);++e<u;)o[e]=r[t+e];for(u=Array(t+1),e=-1;++e<t;)u[e]=r[e];return u[t]=o,n.apply(this,u)}}function V(n){return Q(n)&&H(n)&&vn.call(n,"callee")&&(!jn.call(n,"callee")||"[object Arguments]"==bn.call(n))}function H(n){var t;return(t=null!=n)&&(t=An(n),t=typeof t=="number"&&t>-1&&0==t%1&&9007199254740991>=t),t&&!K(n)}function K(n){return n=L(n)?bn.call(n):"","[object Function]"==n||"[object GeneratorFunction]"==n;
}function L(n){var t=typeof n;return!!n&&("object"==t||"function"==t)}function Q(n){return!!n&&typeof n=="object"}function W(n){return typeof n=="number"||Q(n)&&"[object Number]"==bn.call(n)}function X(n){return typeof n=="string"||!Tn(n)&&Q(n)&&"[object String]"==bn.call(n)}function Y(n){return typeof n=="string"?n:null==n?"":n+""}function Z(n){return n?u(n,t(n)):[]}function nn(n){return n}function tn(n,e,u){var o=t(e),i=g(e,o);null!=u||L(e)&&(i.length||!o.length)||(u=e,e=n,n=this,i=g(e,t(e)));var c=!(L(u)&&"chain"in u&&!u.chain),f=K(n);
return xn(i,function(t){var u=e[t];n[t]=u,f&&(n.prototype[t]=function(){var t=this.__chain__;if(c||t){var e=n(this.__wrapped__);return(e.__actions__=N(this.__actions__)).push({func:u,args:arguments,thisArg:n}),e.__chain__=t,e}return u.apply(n,r([this.value()],arguments))})}),n}var rn,en=1/0,un=/[&<>"'`]/g,on=RegExp(un.source),cn={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},fn=typeof exports=="object"&&exports,an=fn&&typeof module=="object"&&module,ln=o(typeof self=="object"&&self),pn=o(typeof global=="object"&&global)||ln||o(typeof this=="object"&&this)||Function("return this")(),sn=Array.prototype,hn=Object.prototype,vn=hn.hasOwnProperty,yn=0,bn=hn.toString,gn=pn._,_n=Object.create,jn=hn.propertyIsEnumerable,dn=pn.isFinite,mn=Object.keys,On=Math.max;
f.prototype=l(c.prototype),f.prototype.constructor=f;var xn=function(n,t){return function(r,e){if(null==r)return r;if(!H(r))return n(r,e);for(var u=r.length,o=t?u:-1,i=Object(r);(t?o--:++o<u)&&false!==e(i[o],o,i););return r}}(b),En=function(n){return function(t,r,e){var u=-1,o=Object(t);e=e(t);for(var i=e.length;i--;){var c=e[n?i:++u];if(false===r(o[c],c,o))break}return t}}(),An=w("length"),wn=String,kn=function(n){return function(r,e,u){var o=Object(r);if(e=m(e),!H(r))var i=t(r);return u=n(i||r,function(n,t){
return i&&(t=n,n=o[t]),e(n,t,o)},u),u>-1?r[i?i[u]:u]:rn}}(function(n,t,r){var e=n?n.length:0;if(!e)return-1;r=null==r?0:Bn(r),0>r&&(r=On(e+r,0));n:{for(t=m(t),e=n.length,r+=-1;++r<e;)if(t(n[r],r,n)){n=r;break n}n=-1}return n}),Nn=U(function(n,t,r){return D(n,t,r)}),Sn=U(function(n,t){return p(n,1,t)}),Fn=U(function(n,t,r){return p(n,Rn(t)||0,r)}),Tn=Array.isArray,Bn=Number,Rn=Number,Dn=B(function(n,r){T(r,t(r),n)}),In=B(function(t,r){T(r,n(r),t)}),qn=B(function(t,r,e,u){T(r,n(r),t,u)}),$n=U(function(n){
return n.push(rn,a),qn.apply(rn,n)}),zn=U(function(n,t){return null==n?{}:A(n,x(y(t,1),wn))});c.assignIn=In,c.before=P,c.bind=Nn,c.chain=function(n){return n=c(n),n.__chain__=true,n},c.compact=function(n){return v(n,Boolean)},c.concat=function(){for(var n=arguments.length,t=Array(n?n-1:0),e=arguments[0],u=n;u--;)t[u-1]=arguments[u];return n?r(Tn(e)?N(e):[e],y(t,1)):[]},c.create=function(n,t){var r=l(n);return t?Dn(r,t):r},c.defaults=$n,c.defer=Sn,c.delay=Fn,c.filter=function(n,t){return v(n,m(t))},
c.flatten=function(n){return n&&n.length?y(n,1):[]},c.flattenDeep=function(n){return n&&n.length?y(n,en):[]},c.iteratee=m,c.keys=t,c.map=function(n,t){return x(n,m(t))},c.matches=function(n){return E(Dn({},n))},c.mixin=tn,c.negate=function(n){if(typeof n!="function")throw new TypeError("Expected a function");return function(){return!n.apply(this,arguments)}},c.once=function(n){return P(2,n)},c.pick=zn,c.slice=function(n,t,r){var e=n?n.length:0;return r=r===rn?e:+r,e?k(n,null==t?0:+t,r):[]},c.sortBy=function(n,t){
var r=0;return t=m(t),x(x(n,function(n,e,u){return{value:n,index:r++,criteria:t(n,e,u)}}).sort(function(n,t){var r;n:{r=n.criteria;var e=t.criteria;if(r!==e){var u=r!==rn,o=null===r,i=r===r,c=e!==rn,f=null===e,a=e===e;if(!f&&r>e||o&&c&&a||!u&&a||!i){r=1;break n}if(!o&&e>r||f&&u&&i||!c&&i||!a){r=-1;break n}}r=0}return r||n.index-t.index}),w("value"))},c.tap=function(n,t){return t(n),n},c.thru=function(n,t){return t(n)},c.toArray=function(n){return H(n)?n.length?N(n):[]:Z(n)},c.values=Z,c.extend=In,
tn(c,c),c.clone=function(n){return L(n)?Tn(n)?N(n):T(n,t(n)):n},c.escape=function(n){return(n=Y(n))&&on.test(n)?n.replace(un,i):n},c.every=function(n,t,r){return t=r?rn:t,s(n,m(t))},c.find=kn,c.forEach=J,c.has=function(n,t){return null!=n&&vn.call(n,t)},c.head=C,c.identity=nn,c.indexOf=G,c.isArguments=V,c.isArray=Tn,c.isBoolean=function(n){return true===n||false===n||Q(n)&&"[object Boolean]"==bn.call(n)},c.isDate=function(n){return Q(n)&&"[object Date]"==bn.call(n)},c.isEmpty=function(n){return H(n)&&(Tn(n)||X(n)||K(n.splice)||V(n))?!n.length:!t(n).length;
},c.isEqual=function(n,t){return j(n,t)},c.isFinite=function(n){return typeof n=="number"&&dn(n)},c.isFunction=K,c.isNaN=function(n){return W(n)&&n!=+n},c.isNull=function(n){return null===n},c.isNumber=W,c.isObject=L,c.isRegExp=function(n){return L(n)&&"[object RegExp]"==bn.call(n)},c.isString=X,c.isUndefined=function(n){return n===rn},c.last=function(n){var t=n?n.length:0;return t?n[t-1]:rn},c.max=function(n){return n&&n.length?h(n,nn,_):rn},c.min=function(n){return n&&n.length?h(n,nn,O):rn},c.noConflict=function(){
return pn._===this&&(pn._=gn),this},c.noop=function(){},c.reduce=M,c.result=function(n,t,r){return t=null==n?rn:n[t],t===rn&&(t=r),K(t)?t.call(n):t},c.size=function(n){return null==n?0:(n=H(n)?n:t(n),n.length)},c.some=function(n,t,r){return t=r?rn:t,S(n,m(t))},c.uniqueId=function(n){var t=++yn;return Y(n)+t},c.each=J,c.first=C,tn(c,function(){var n={};return b(c,function(t,r){vn.call(c.prototype,r)||(n[r]=t)}),n}(),{chain:false}),c.VERSION="4.13.1",xn("pop join replace reverse split push shift sort splice unshift".split(" "),function(n){
var t=(/^(?:replace|split)$/.test(n)?String.prototype:sn)[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|join|replace|shift)$/.test(n);c.prototype[n]=function(){var n=arguments;if(e&&!this.__chain__){var u=this.value();return t.apply(Tn(u)?u:[],n)}return this[r](function(r){return t.apply(Tn(r)?r:[],n)})}}),c.prototype.toJSON=c.prototype.valueOf=c.prototype.value=function(){return F(this.__wrapped__,this.__actions__)},(ln||{})._=c,typeof define=="function"&&typeof define.amd=="object"&&define.amd? define(function(){
return c}):an?((an.exports=c)._=c,fn._=c):pn._=c}).call(this);;(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);
;/*!
 * Amplify 1.1.2
 *
 * Copyright 2011 - 2013 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 *
 * http://amplifyjs.com
 */
(function(e,t){var n=[].slice,r={},i=e.amplify={publish:function(e){if(typeof e!="string")throw new Error("You must provide a valid topic to publish.");var t=n.call(arguments,1),i,s,o,u=0,a;if(!r[e])return!0;i=r[e].slice();for(o=i.length;u<o;u++){s=i[u],a= s.callback ? s.callback.apply(s.context,t) : false;if(a===!1)break}return a!==!1},subscribe:function(e,t,n,i){if(typeof e!="string")throw new Error("You must provide a valid topic to create a subscription.");arguments.length===3&&typeof n=="number"&&(i=n,n=t,t=null),arguments.length===2&&(n=t,t=null),i=i||10;var s=0,o=e.split(/\s/),u=o.length,a;for(;s<u;s++){e=o[s],a=!1,r[e]||(r[e]=[]);var f=r[e].length-1,l={callback:n,context:t,priority:i};for(;f>=0;f--)if(r[e][f].priority<=i){r[e].splice(f+1,0,l),a=!0;break}a||r[e].unshift(l)}return n},unsubscribe:function(e,t,n){if(typeof e!="string")throw new Error("You must provide a valid topic to remove a subscription.");arguments.length===2&&(n=t,t=null);if(!r[e])return;var i=r[e].length,s=0;for(;s<i;s++)r[e][s].callback===n&&(!t||r[e][s].context===t)&&(r[e].splice(s,1),s--,i--)}}})(this),function(e,t){function i(e,i){n.addType(e,function(s,o,u){var a,f,l,c,h=o,p=(new Date).getTime();if(!s){h={},c=[],l=0;try{s=i.length;while(s=i.key(l++))r.test(s)&&(f=JSON.parse(i.getItem(s)),f.expires&&f.expires<=p?c.push(s):h[s.replace(r,"")]=f.data);while(s=c.pop())i.removeItem(s)}catch(d){}return h}s="__amplify__"+s;if(o===t){a=i.getItem(s),f=a?JSON.parse(a):{expires:-1};if(!(f.expires&&f.expires<=p))return f.data;i.removeItem(s)}else if(o===null)i.removeItem(s);else{f=JSON.stringify({data:o,expires:u.expires?p+u.expires:null});try{i.setItem(s,f)}catch(d){n[e]();try{i.setItem(s,f)}catch(d){throw n.error()}}}return h})}var n=e.store=function(e,t,r){var i=n.type;return r&&r.type&&r.type in n.types&&(i=r.type),n.types[i](e,t,r||{})};n.types={},n.type=null,n.addType=function(e,t){n.type||(n.type=e),n.types[e]=t,n[e]=function(t,r,i){return i=i||{},i.type=e,n(t,r,i)}},n.error=function(){return"amplify.store quota exceeded"};var r=/^__amplify__/;for(var s in{localStorage:1,sessionStorage:1})try{window[s].setItem("__amplify__","x"),window[s].removeItem("__amplify__"),i(s,window[s])}catch(o){}if(!n.types.localStorage&&window.globalStorage)try{i("globalStorage",window.globalStorage[window.location.hostname]),n.type==="sessionStorage"&&(n.type="globalStorage")}catch(o){}(function(){if(n.types.localStorage)return;var e=document.createElement("div"),r="amplify";e.style.display="none",document.getElementsByTagName("head")[0].appendChild(e);try{e.addBehavior("#default#userdata"),e.load(r)}catch(i){e.parentNode.removeChild(e);return}n.addType("userData",function(i,s,o){e.load(r);var u,a,f,l,c,h=s,p=(new Date).getTime();if(!i){h={},c=[],l=0;while(u=e.XMLDocument.documentElement.attributes[l++])a=JSON.parse(u.value),a.expires&&a.expires<=p?c.push(u.name):h[u.name]=a.data;while(i=c.pop())e.removeAttribute(i);return e.save(r),h}i=i.replace(/[^\-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,"-"),i=i.replace(/^-/,"_-");if(s===t){u=e.getAttribute(i),a=u?JSON.parse(u):{expires:-1};if(!(a.expires&&a.expires<=p))return a.data;e.removeAttribute(i)}else s===null?e.removeAttribute(i):(f=e.getAttribute(i),a=JSON.stringify({data:s,expires:o.expires?p+o.expires:null}),e.setAttribute(i,a));try{e.save(r)}catch(d){f===null?e.removeAttribute(i):e.setAttribute(i,f),n.userData();try{e.setAttribute(i,a),e.save(r)}catch(d){throw f===null?e.removeAttribute(i):e.setAttribute(i,f),n.error()}}return h})})(),function(){function i(e){return e===t?t:JSON.parse(JSON.stringify(e))}var e={},r={};n.addType("memory",function(n,s,o){return n?s===t?i(e[n]):(r[n]&&(clearTimeout(r[n]),delete r[n]),s===null?(delete e[n],null):(e[n]=s,o.expires&&(r[n]=setTimeout(function(){delete e[n],delete r[n]},o.expires)),s)):i(e)})}()}(this.amplify=this.amplify||{}),function(e,t){"use strict";function n(){}function r(e){return{}.toString.call(e)==="[object Function]"}function i(e){var t=!1;return setTimeout(function(){t=!0},1),function(){var n=this,r=arguments;t?e.apply(n,r):setTimeout(function(){e.apply(n,r)},1)}}e.request=function(t,s,o){var u=t||{};typeof u=="string"&&(r(s)&&(o=s,s={}),u={resourceId:t,data:s||{},success:o});var a={abort:n},f=e.request.resources[u.resourceId],l=u.success||n,c=u.error||n;u.success=i(function(t,n){n=n||"success",e.publish("request.success",u,t,n),e.publish("request.complete",u,t,n),l(t,n)}),u.error=i(function(t,n){n=n||"error",e.publish("request.error",u,t,n),e.publish("request.complete",u,t,n),c(t,n)});if(!f)throw u.resourceId?"amplify.request: unknown resourceId: "+u.resourceId:"amplify.request: no resourceId provided";if(!e.publish("request.before",u)){u.error(null,"abort");return}return e.request.resources[u.resourceId](u,a),a},e.request.types={},e.request.resources={},e.request.define=function(t,n,r){if(typeof n=="string"){if(!(n in e.request.types))throw"amplify.request.define: unknown type: "+n;r.resourceId=t,e.request.resources[t]=e.request.types[n](r)}else e.request.resources[t]=n}}(amplify),function(e,t,n){"use strict";var r=["status","statusText","responseText","responseXML","readyState"],i=/\{([^\}]+)\}/g;e.request.types.ajax=function(i){return i=t.extend({type:"GET"},i),function(s,o){var u,a,f=i.url,l=o.abort,c=t.extend(!0,{},i,{data:s.data}),h=!1,p={readyState:0,setRequestHeader:function(e,t){return u.setRequestHeader(e,t)},getAllResponseHeaders:function(){return u.getAllResponseHeaders()},getResponseHeader:function(e){return u.getResponseHeader(e)},overrideMimeType:function(e){return u.overrideMimeType(e)},abort:function(){h=!0;try{u.abort()}catch(e){}a(null,"abort")},success:function(e,t){s.success(e,t)},error:function(e,t){s.error(e,t)}};a=function(e,i){t.each(r,function(e,t){try{p[t]=u[t]}catch(n){}}),/OK$/.test(p.statusText)&&(p.statusText="success"),e===n&&(e=null),h&&(i="abort"),/timeout|error|abort/.test(i)?p.error(e,i):p.success(e,i),a=t.noop},e.publish("request.ajax.preprocess",i,s,c,p),t.extend(c,{isJSONP:function(){return/jsonp/gi.test(this.dataType)},cacheURL:function(){if(!this.isJSONP())return this.url;var e="callback";this.hasOwnProperty("jsonp")&&(this.jsonp!==!1?e=this.jsonp:this.hasOwnProperty("jsonpCallback")&&(e=this.jsonpCallback));var t=new RegExp("&?"+e+"=[^&]*&?","gi");return this.url.replace(t,"")},success:function(e,t){a(e,t)},error:function(e,t){a(null,t)},beforeSend:function(t,n){u=t,c=n;var r=i.beforeSend?i.beforeSend.call(this,p,c):!0;return r&&e.publish("request.before.ajax",i,s,c,p)}}),c.cache&&c.isJSONP()&&t.extend(c,{cache:!0}),t.ajax(c),o.abort=function(){p.abort(),l.call(this)}}},e.subscribe("request.ajax.preprocess",function(e,n,r){var s=[],o=r.data;if(typeof o=="string")return;o=t.extend(!0,{},e.data,o),r.url=r.url.replace(i,function(e,t){if(t in o)return s.push(t),o[t]}),t.each(s,function(e,t){delete o[t]}),r.data=o}),e.subscribe("request.ajax.preprocess",function(e,n,r){var i=r.data,s=e.dataMap;if(!s||typeof i=="string")return;t.isFunction(s)?r.data=s(i):(t.each(e.dataMap,function(e,t){e in i&&(i[t]=i[e],delete i[e])}),r.data=i)});var s=e.request.cache={_key:function(e,t,n){function s(){return n.charCodeAt(i++)<<24|n.charCodeAt(i++)<<16|n.charCodeAt(i++)<<8|n.charCodeAt(i++)<<0}n=t+n;var r=n.length,i=0,o=s();while(i<r)o^=s();return"request-"+e+"-"+o},_default:function(){var e={};return function(t,n,r,i){var o=s._key(n.resourceId,r.cacheURL(),r.data),u=t.cache;if(o in e)return i.success(e[o]),!1;var a=i.success;i.success=function(t){e[o]=t,typeof u=="number"&&setTimeout(function(){delete e[o]},u),a.apply(this,arguments)}}}()};e.store&&(t.each(e.store.types,function(t){s[t]=function(n,r,i,o){var u=s._key(r.resourceId,i.cacheURL(),i.data),a=e.store[t](u);if(a)return i.success(a),!1;var f=o.success;o.success=function(r){e.store[t](u,r,{expires:n.cache.expires}),f.apply(this,arguments)}}}),s.persist=s[e.store.type]),e.subscribe("request.before.ajax",function(e){var t=e.cache;if(t)return t=t.type||t,s[t in s?t:"_default"].apply(this,arguments)}),e.request.decoders={jsend:function(e,t,n,r,i){e.status==="success"?r(e.data):e.status==="fail"?i(e.data,"fail"):e.status==="error"?(delete e.status,i(e,"error")):i(null,"error")}},e.subscribe("request.before.ajax",function(n,r,i,s){function f(e,t){o(e,t)}function l(e,t){u(e,t)}var o=s.success,u=s.error,a=t.isFunction(n.decoder)?n.decoder:n.decoder in e.request.decoders?e.request.decoders[n.decoder]:e.request.decoders._default;if(!a)return;s.success=function(e,t){a(e,t,s,f,l)},s.error=function(e,t){a(e,t,s,f,l)}})}(amplify,jQuery);(function(global){var k,_handlers={},_mods={16:false,18:false,17:false,91:false},_scope="all",_MODIFIERS={shift:16,alt:18,option:18,ctrl:17,control:17,command:91},_MAP={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220},code=function(x){return _MAP[x]||x.toUpperCase().charCodeAt(0)},_downKeys=[];for(k=
1;k<20;k++)_MAP["f"+k]=111+k;function index(array,item){var i=array.length;while(i--)if(array[i]===item)return i;return-1}function compareArray(a1,a2){if(a1.length!=a2.length)return false;for(var i=0;i<a1.length;i++)if(a1[i]!==a2[i])return false;return true}var modifierMap={16:"shiftKey",18:"altKey",17:"ctrlKey",91:"metaKey"};function updateModifierKey(event){for(k in _mods)_mods[k]=event[modifierMap[k]]}function dispatch(event){var key,handler,k,i,modifiersMatch,scope;key=event.keyCode;if(index(_downKeys,
key)==-1)_downKeys.push(key);if(key==93||key==224)key=91;if(key in _mods){_mods[key]=true;for(k in _MODIFIERS)if(_MODIFIERS[k]==key)assignKey[k]=true;return}updateModifierKey(event);if(!assignKey.filter.call(this,event))return;if(!(key in _handlers))return;scope=getScope();for(i=0;i<_handlers[key].length;i++){handler=_handlers[key][i];if(handler.scope==scope||handler.scope=="all"){modifiersMatch=handler.mods.length>0;for(k in _mods)if(!_mods[k]&&index(handler.mods,+k)>-1||_mods[k]&&index(handler.mods,
+k)==-1)modifiersMatch=false;if(handler.mods.length==0&&!_mods[16]&&!_mods[18]&&!_mods[17]&&!_mods[91]||modifiersMatch)if(handler.method(event,handler)===false){if(event.preventDefault)event.preventDefault();else event.returnValue=false;if(event.stopPropagation)event.stopPropagation();if(event.cancelBubble)event.cancelBubble=true}}}}function clearModifier(event){var key=event.keyCode,k,i=index(_downKeys,key);if(i>=0)_downKeys.splice(i,1);if(key==93||key==224)key=91;if(key in _mods){_mods[key]=false;
for(k in _MODIFIERS)if(_MODIFIERS[k]==key)assignKey[k]=false}}function resetModifiers(){for(k in _mods)_mods[k]=false;for(k in _MODIFIERS)assignKey[k]=false}function assignKey(key,scope,method){var keys,mods;keys=getKeys(key);if(method===undefined){method=scope;scope="all"}for(var i=0;i<keys.length;i++){mods=[];key=keys[i].split("+");if(key.length>1){mods=getMods(key);key=[key[key.length-1]]}key=key[0];key=code(key);if(!(key in _handlers))_handlers[key]=[];_handlers[key].push({shortcut:keys[i],scope:scope,
method:method,key:keys[i],mods:mods})}}function unbindKey(key,scope){var multipleKeys,keys,mods=[],i,j,obj;multipleKeys=getKeys(key);for(j=0;j<multipleKeys.length;j++){keys=multipleKeys[j].split("+");if(keys.length>1){mods=getMods(keys);key=keys[keys.length-1]}key=code(key);if(scope===undefined)scope=getScope();if(!_handlers[key])return;for(i=0;i<_handlers[key].length;i++){obj=_handlers[key][i];if(obj.scope===scope&&compareArray(obj.mods,mods))_handlers[key][i]={}}}}function isPressed(keyCode){if(typeof keyCode==
"string")keyCode=code(keyCode);return index(_downKeys,keyCode)!=-1}function getPressedKeyCodes(){return _downKeys.slice(0)}function filter(event){var tagName=(event.target||event.srcElement).tagName;return!(tagName=="INPUT"||tagName=="SELECT"||tagName=="TEXTAREA")}for(k in _MODIFIERS)assignKey[k]=false;function setScope(scope){_scope=scope||"all"}function getScope(){return _scope||"all"}function deleteScope(scope){var key,handlers,i;for(key in _handlers){handlers=_handlers[key];for(i=0;i<handlers.length;)if(handlers[i].scope===
scope)handlers.splice(i,1);else i++}}function getKeys(key){var keys;key=key.replace(/\s/g,"");keys=key.split(",");if(keys[keys.length-1]=="")keys[keys.length-2]+=",";return keys}function getMods(key){var mods=key.slice(0,key.length-1);for(var mi=0;mi<mods.length;mi++)mods[mi]=_MODIFIERS[mods[mi]];return mods}function addEvent(object,event,method){if(object.addEventListener)object.addEventListener(event,method,false);else if(object.attachEvent)object.attachEvent("on"+event,function(){method(window.event)})}
addEvent(document,"keydown",function(event){dispatch(event)});addEvent(document,"keyup",clearModifier);addEvent(window,"focus",resetModifiers);var previousKey=global.key;function noConflict(){var k=global.key;global.key=previousKey;return k}global.key=assignKey;global.key.setScope=setScope;global.key.getScope=getScope;global.key.deleteScope=deleteScope;global.key.filter=filter;global.key.isPressed=isPressed;global.key.getPressedKeyCodes=getPressedKeyCodes;global.key.noConflict=noConflict;global.key.unbind=
unbindKey;if(typeof module!=="undefined")module.exports=key})(this);;(function(){var Locstor=function Locstor(){};var defaultSize=5E8;var ie=function(){var undef,v=3,div=document.createElement("div");while(div.innerHTML="\x3c!--[if gt IE "+ ++v+"]><i></i>< ![endif]--\x3e",div.getElementsByTagName("i")[0]);return v>4?v:undef}();(function(){var supported=false;try{localStorage.setItem("test","test");localStorage.removeItem("test");supported=true}catch(e){supported=false}if(!supported){window.localStorage={getItem:function(sKey){if(!sKey||!this.hasOwnProperty(sKey))return null;
return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1"))},key:function(nKeyId){return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/,"").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId])},setItem:function(sKey,sValue){if(!sKey)return;document.cookie=escape(sKey)+"="+escape(sValue)+"; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";this.length=document.cookie.match(/\=/g).length},length:0,removeItem:function(sKey){if(!sKey||
!this.hasOwnProperty(sKey))return;document.cookie=escape(sKey)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";this.length--},hasOwnProperty:function(sKey){return(new RegExp("(?:^|;\\s*)"+escape(sKey).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=")).test(document.cookie)}};window.localStorage.length=(document.cookie.match(/\=/g)||window.localStorage).length}})();if(typeof window.define==="function"&&window.define.amd)window.define("locstor",[],function(){return Locstor});else window.Locstor=Locstor;Locstor.clear=
function clear(){localStorage.clear()};Locstor.contains=function contains(key){if(typeof key!=="string")throw new Error("Key must be a string for function contains(key)");return this.getKeys().indexOf(key)!==-1};Locstor.get=function get(key,defaultValue){if(typeof key!=="string")throw new Error("Key must be a string for function get(key)");var value=localStorage.getItem(key);var number=parseFloat(value);if(value===null)return arguments.length===2?defaultValue:null;else if(!isNaN(number))return number;
else if(value.toLowerCase()==="true"||value.toLowerCase()==="false")return value==="true";else try{value=JSON.parse(value);return value}catch(e){return value}};Locstor.getKeys=function getKeys(){var result=[];for(var i=0;i<localStorage.length;i++)result.push(localStorage.key(i));return result};Locstor.getRemainingSpace=function getRemainingSpace(){return ie&&ie>7?localStorage.remainingSpace:defaultSize-this.getSize()};Locstor.getSize=function getSize(){return JSON.stringify(localStorage).length};
Locstor.isEmpty=function isEmpty(){return this.getKeys().length===0};Locstor.remove=function remove(key){if(typeof key==="string")localStorage.removeItem(key);else if(key instanceof Array)for(var i=0;i<key.length;i++)if(typeof key[i]==="string")localStorage.removeItem(key[i]);else throw new Error("Key in index "+i+" is not a string");else throw new Error("Key must be a string or array for function remove(key || array)");};Locstor.set=function set(key,value){if(arguments.length===1)this.store(key);
else if(typeof key==="string"){if(typeof value==="object")value=JSON.stringify(value);localStorage.setItem(key,value)}else throw new Error("Invalid arguments for function set(key, value) or function set(object)");};Locstor.store=function store(value){if(typeof value==="object"&&!(value instanceof Array))for(var property in value)localStorage.setItem(property,value[property]);else throw new Error("Argument for function set(object) must be an object");};Locstor.toObject=function toObject(){var o={};
var keys=this.getKeys();for(var i=0;i<keys.length;i++){var key=keys[i];o[key]=this.get(key)}return o}})();;;(function(e,t,n){function s(t,n){this.bodyOverflowX;this.callbacks={hide:[],show:[]};this.checkInterval=null;this.content;this.$el=e(t);this.$elProxy;this.elProxyPosition;this.enabled=true;this.options=e.extend({},i,n);this.mouseIsOverProxy=false;this.namespace="tooltipster-"+Math.round(Math.random()*1e5);this.status="hidden";this.timerHide=null;this.timerShow=null;this.$tooltip;this.options.iconTheme=this.options.iconTheme.replace(".","");this.options.theme=this.options.theme.replace(".","");this.init()}function o(t,n){var r=true;e.each(t,function(e,i){if(typeof n[e]==="undefined"||t[e]!==n[e]){r=false;return false}});return r}function f(){return!a&&u}function l(){var e=n.body||n.documentElement,t=e.style,r="transition";if(typeof t[r]=="string"){return true}v=["Moz","Webkit","Khtml","O","ms"],r=r.charAt(0).toUpperCase()+r.substr(1);for(var i=0;i<v.length;i++){if(typeof t[v[i]+r]=="string"){return true}}return false}var r="tooltipster",i={animation:"fade",arrow:true,arrowColor:"",autoClose:true,content:null,contentAsHTML:false,contentCloning:true,delay:200,fixedWidth:0,maxWidth:0,functionInit:function(e,t){},functionBefore:function(e,t){t()},functionReady:function(e,t){},functionAfter:function(e){},icon:"(?)",iconCloning:true,iconDesktop:false,iconTouch:false,iconTheme:"tooltipster-icon",interactive:false,interactiveTolerance:350,offsetX:0,offsetY:0,onlyOne:false,position:"top",positionTracker:false,speed:350,timer:0,theme:"tooltipster-default",touchDevices:true,trigger:"hover",updateAnimation:true};s.prototype={init:function(){var t=this;if(n.querySelector){if(t.options.content!==null){t.setContent(t.options.content)}else{var r=t.$el.attr("title");if(typeof r==="undefined")r=null;t.setContent(r)}var i=t.options.functionInit.call(t.$el,t.$el,t.content);if(typeof i!=="undefined")t.setContent(i);t.$el.removeAttr("title").addClass("tooltipstered");if(!u&&t.options.iconDesktop||u&&t.options.iconTouch){if(typeof t.options.icon==="string"){t.$elProxy=e('<span class="'+t.options.iconTheme+'"></span>');t.$elProxy.text(t.options.icon)}else{if(t.options.iconCloning)t.$elProxy=t.options.icon.clone(true);else t.$elProxy=t.options.icon}t.$elProxy.insertAfter(t.$el)}else{t.$elProxy=t.$el}if(t.options.trigger=="hover"){t.$elProxy.on("mouseenter."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=true;t.showTooltip()}}).on("mouseleave."+t.namespace,function(){if(!f()||t.options.touchDevices){t.mouseIsOverProxy=false}});if(u&&t.options.touchDevices){t.$elProxy.on("touchstart."+t.namespace,function(){t.showTooltipNow()})}}else if(t.options.trigger=="click"){t.$elProxy.on("click."+t.namespace,function(){if(!f()||t.options.touchDevices){t.showTooltip()}})}}},showTooltip:function(){var e=this;if(e.status!="shown"&&e.status!="appearing"){if(e.options.delay){e.timerShow=setTimeout(function(){if(e.options.trigger=="click"||e.options.trigger=="hover"&&e.mouseIsOverProxy){e.showTooltipNow()}},e.options.delay)}else e.showTooltipNow()}},showTooltipNow:function(n){var i=this;i.options.functionBefore.call(i.$el,i.$el,function(){if(i.enabled&&i.content!==null){if(n)i.callbacks.show.push(n);i.callbacks.hide=[];clearTimeout(i.timerShow);i.timerShow=null;clearTimeout(i.timerHide);i.timerHide=null;if(i.options.onlyOne){e(".tooltipstered").not(i.$el).each(function(t,n){var i=e(n),s=i[r]("status"),o=i[r]("option","autoClose");if(s!=="hidden"&&s!=="disappearing"&&o){i[r]("hide")}})}var s=function(){i.status="shown";e.each(i.callbacks.show,function(e,t){t.call(i.$el)});i.callbacks.show=[]};if(i.status!=="hidden"){var o=0;if(i.status==="disappearing"){i.status="appearing";if(l()){i.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-"+i.options.animation+"-show");if(i.options.speed>0)i.$tooltip.delay(i.options.speed);i.$tooltip.queue(s)}else{i.$tooltip.stop().fadeIn(s)}}else if(i.status==="shown"){s()}}else{i.status="appearing";var o=i.options.speed;i.bodyOverflowX=e("body").css("overflow-x");e("body").css("overflow-x","hidden");var a="tooltipster-"+i.options.animation,f="-webkit-transition-duration: "+i.options.speed+"ms; -webkit-animation-duration: "+i.options.speed+"ms; -moz-transition-duration: "+i.options.speed+"ms; -moz-animation-duration: "+i.options.speed+"ms; -o-transition-duration: "+i.options.speed+"ms; -o-animation-duration: "+i.options.speed+"ms; -ms-transition-duration: "+i.options.speed+"ms; -ms-animation-duration: "+i.options.speed+"ms; transition-duration: "+i.options.speed+"ms; animation-duration: "+i.options.speed+"ms;",c=i.options.fixedWidth>0?"width:"+Math.round(i.options.fixedWidth)+"px;":"",h=i.options.maxWidth>0?"max-width:"+Math.round(i.options.maxWidth)+"px;":"",p=i.options.interactive?"pointer-events: auto;":"";i.$tooltip=e('<div class="tooltipster-base '+i.options.theme+'" style="'+c+" "+h+" "+p+" "+f+'"><div class="tooltipster-content"></div></div>');if(l())i.$tooltip.addClass(a);i.insertContent();i.$tooltip.appendTo("body");i.positionTooltip();i.options.functionReady.call(i.$el,i.$el,i.$tooltip);if(l()){i.$tooltip.addClass(a+"-show");if(i.options.speed>0)i.$tooltip.delay(i.options.speed);i.$tooltip.queue(s)}else{i.$tooltip.css("display","none").fadeIn(i.options.speed,s)}i.setCheckInterval();e(t).on("scroll."+i.namespace+" resize."+i.namespace,function(){i.positionTooltip()});if(i.options.autoClose){e("body").off("."+i.namespace);if(i.options.trigger=="hover"){if(u){setTimeout(function(){e("body").on("touchstart."+i.namespace,function(){i.hideTooltip()})},0)}if(i.options.interactive){if(u){i.$tooltip.on("touchstart."+i.namespace,function(e){e.stopPropagation()})}var d=null;i.$elProxy.add(i.$tooltip).on("mouseleave."+i.namespace+"-autoClose",function(){clearTimeout(d);d=setTimeout(function(){i.hideTooltip()},i.options.interactiveTolerance)}).on("mouseenter."+i.namespace+"-autoClose",function(){clearTimeout(d)})}else{i.$elProxy.on("mouseleave."+i.namespace+"-autoClose",function(){i.hideTooltip()})}}else if(i.options.trigger=="click"){setTimeout(function(){e("body").on("click."+i.namespace+" touchstart."+i.namespace,function(){i.hideTooltip()})},0);if(i.options.interactive){i.$tooltip.on("click."+i.namespace+" touchstart."+i.namespace,function(e){e.stopPropagation()})}}}}if(i.options.timer>0){i.timerHide=setTimeout(function(){i.timerHide=null;i.hideTooltip()},i.options.timer+o)}}})},setCheckInterval:function(){var t=this;t.checkInterval=setInterval(function(){if(e("body").find(t.$el).length===0||e("body").find(t.$elProxy).length===0||t.status=="hidden"||e("body").find(t.$tooltip).length===0){if(t.status=="shown"||t.status=="appearing")t.hideTooltip();t.cancelCheckInterval()}else{if(t.options.positionTracker){var n=t.positionInfo(t.$elProxy),r=false;if(o(n.dimension,t.elProxyPosition.dimension)){if(t.$elProxy.css("position")==="fixed"){if(o(n.position,t.elProxyPosition.position))r=true}else{if(o(n.offset,t.elProxyPosition.offset))r=true}}if(!r){t.positionTooltip()}}}},200)},cancelCheckInterval:function(){clearInterval(this.checkInterval);this.checkInterval=null},hideTooltip:function(n){var r=this;if(n)r.callbacks.hide.push(n);r.callbacks.show=[];clearTimeout(r.timerShow);r.timerShow=null;clearTimeout(r.timerHide);r.timerHide=null;var i=function(){e.each(r.callbacks.hide,function(e,t){t.call(r.$el)});r.callbacks.hide=[]};if(r.status=="shown"||r.status=="appearing"){r.status="disappearing";var s=function(){r.status="hidden";if(typeof r.content=="object"&&r.content!==null){r.content.detach()}r.$tooltip.remove();r.$tooltip=null;e(t).off("."+r.namespace);e("body").off("."+r.namespace).css("overflow-x",r.bodyOverflowX);e("body").off("."+r.namespace);r.$elProxy.off("."+r.namespace+"-autoClose");r.options.functionAfter.call(r.$el,r.$el);i()};if(l()){r.$tooltip.clearQueue().removeClass("tooltipster-"+r.options.animation+"-show").addClass("tooltipster-dying");if(r.options.speed>0)r.$tooltip.delay(r.options.speed);r.$tooltip.queue(s)}else{r.$tooltip.stop().fadeOut(r.options.speed,s)}}else if(r.status=="hidden"){i()}},setContent:function(e){if(typeof e==="object"&&e!==null&&this.options.contentCloning){e=e.clone(true)}this.content=e},insertContent:function(){var e=this,t=this.$tooltip.find(".tooltipster-content");if(typeof e.content==="string"&&!e.options.contentAsHTML){t.text(e.content)}else{t.empty().append(e.content)}},updateTooltip:function(e){var t=this;t.setContent(e);if(t.content!==null){if(t.status!=="hidden"){t.insertContent();t.positionTooltip();if(t.options.updateAnimation){if(l()){t.$tooltip.css({width:"","-webkit-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-moz-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-o-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-ms-transition":"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms",transition:"all "+t.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms"}).addClass("tooltipster-content-changing");setTimeout(function(){if(t.status!="hidden"){t.$tooltip.removeClass("tooltipster-content-changing");setTimeout(function(){if(t.status!=="hidden"){t.$tooltip.css({"-webkit-transition":t.options.speed+"ms","-moz-transition":t.options.speed+"ms","-o-transition":t.options.speed+"ms","-ms-transition":t.options.speed+"ms",transition:t.options.speed+"ms"})}},t.options.speed)}},t.options.speed)}else{t.$tooltip.fadeTo(t.options.speed,.5,function(){if(t.status!="hidden"){t.$tooltip.fadeTo(t.options.speed,1)}})}}}}else{t.hideTooltip()}},positionInfo:function(e){return{dimension:{height:e.outerHeight(false),width:e.outerWidth(false)},offset:e.offset(),position:{left:parseInt(e.css("left")),top:parseInt(e.css("top"))}}},positionTooltip:function(){var n=this;if(e("body").find(n.$tooltip).length!==0){n.$tooltip.css("width","");n.elProxyPosition=n.positionInfo(n.$elProxy);var r=null,i=e(t).width(),s=n.elProxyPosition,o=n.$tooltip.outerWidth(false),u=n.$tooltip.innerWidth()+1,a=n.$tooltip.outerHeight(false);if(n.$elProxy.is("area")){var f=n.$elProxy.attr("shape"),l=n.$elProxy.parent().attr("name"),c=e('img[usemap="#'+l+'"]'),h=c.offset().left,p=c.offset().top,d=n.$elProxy.attr("coords")!==undefined?n.$elProxy.attr("coords").split(","):undefined;if(f=="circle"){var v=parseInt(d[0]),m=parseInt(d[1]),g=parseInt(d[2]);s.dimension.height=g*2;s.dimension.width=g*2;s.offset.top=p+m-g;s.offset.left=h+v-g}else if(f=="rect"){var v=parseInt(d[0]),m=parseInt(d[1]),y=parseInt(d[2]),b=parseInt(d[3]);s.dimension.height=b-m;s.dimension.width=y-v;s.offset.top=p+m;s.offset.left=h+v}else if(f=="poly"){var w=[],E=[],S=0,x=0,T=0,N=0,C="even";for(var k=0;k<d.length;k++){var L=parseInt(d[k]);if(C=="even"){if(L>T){T=L;if(k===0){S=T}}if(L<S){S=L}C="odd"}else{if(L>N){N=L;if(k==1){x=N}}if(L<x){x=L}C="even"}}s.dimension.height=N-x;s.dimension.width=T-S;s.offset.top=p+x;s.offset.left=h+S}else{s.dimension.height=c.outerHeight(false);s.dimension.width=c.outerWidth(false);s.offset.top=p;s.offset.left=h}}if(n.options.fixedWidth===0){n.$tooltip.css({width:Math.round(u)+"px","padding-left":"0px","padding-right":"0px"})}var A=0,O=0,M=0,_=parseInt(n.options.offsetY),D=parseInt(n.options.offsetX),P=n.options.position;function H(){var n=e(t).scrollLeft();if(A-n<0){r=A-n;A=n}if(A+o-n>i){r=A-(i+n-o);A=i+n-o}}function B(n,r){if(s.offset.top-e(t).scrollTop()-a-_-12<0&&r.indexOf("top")>-1){P=n}if(s.offset.top+s.dimension.height+a+12+_>e(t).scrollTop()+e(t).height()&&r.indexOf("bottom")>-1){P=n;M=s.offset.top-a-_-12}}if(P=="top"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left+D-j/2;M=s.offset.top-a-_-12;H();B("bottom","top")}if(P=="top-left"){A=s.offset.left+D;M=s.offset.top-a-_-12;H();B("bottom-left","top-left")}if(P=="top-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top-a-_-12;H();B("bottom-right","top-right")}if(P=="bottom"){var j=s.offset.left+o-(s.offset.left+s.dimension.width);A=s.offset.left-j/2+D;M=s.offset.top+s.dimension.height+_+12;H();B("top","bottom")}if(P=="bottom-left"){A=s.offset.left+D;M=s.offset.top+s.dimension.height+_+12;H();B("top-left","bottom-left")}if(P=="bottom-right"){A=s.offset.left+s.dimension.width+D-o;M=s.offset.top+s.dimension.height+_+12;H();B("top-right","bottom-right")}if(P=="left"){A=s.offset.left-D-o-12;O=s.offset.left+D+s.dimension.width+12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A<0&&O+o>i){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=o+A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);A=s.offset.left-D-q-12-I;F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A<0){A=s.offset.left+D+s.dimension.width+12;r="left"}}if(P=="right"){A=s.offset.left+D+s.dimension.width+12;O=s.offset.left-D-o-12;var F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_;if(A+o>i&&O<0){var I=parseFloat(n.$tooltip.css("border-width"))*2,q=i-A-I;n.$tooltip.css("width",q+"px");a=n.$tooltip.outerHeight(false);F=s.offset.top+a-(s.offset.top+s.dimension.height);M=s.offset.top-F/2-_}else if(A+o>i){A=s.offset.left-D-o-12;r="right"}}if(n.options.arrow){var R="tooltipster-arrow-"+P;if(n.options.arrowColor.length<1){var U=n.$tooltip.css("background-color")}else{var U=n.options.arrowColor}if(!r){r=""}else if(r=="left"){R="tooltipster-arrow-right";r=""}else if(r=="right"){R="tooltipster-arrow-left";r=""}else{r="left:"+Math.round(r)+"px;"}if(P=="top"||P=="top-left"||P=="top-right"){var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}else if(P=="bottom"||P=="bottom-left"||P=="bottom-right"){var z=parseFloat(n.$tooltip.css("border-top-width")),W=n.$tooltip.css("border-top-color")}else if(P=="left"){var z=parseFloat(n.$tooltip.css("border-right-width")),W=n.$tooltip.css("border-right-color")}else if(P=="right"){var z=parseFloat(n.$tooltip.css("border-left-width")),W=n.$tooltip.css("border-left-color")}else{var z=parseFloat(n.$tooltip.css("border-bottom-width")),W=n.$tooltip.css("border-bottom-color")}if(z>1){z++}var X="";if(z!==0){var V="",J="border-color: "+W+";";if(R.indexOf("bottom")!==-1){V="margin-top: -"+Math.round(z)+"px;"}else if(R.indexOf("top")!==-1){V="margin-bottom: -"+Math.round(z)+"px;"}else if(R.indexOf("left")!==-1){V="margin-right: -"+Math.round(z)+"px;"}else if(R.indexOf("right")!==-1){V="margin-left: -"+Math.round(z)+"px;"}X='<span class="tooltipster-arrow-border" style="'+V+" "+J+';"></span>'}n.$tooltip.find(".tooltipster-arrow").remove();var K='<div class="'+R+' tooltipster-arrow" style="'+r+'">'+X+'<span style="border-color:'+U+';"></span></div>';n.$tooltip.append(K)}n.$tooltip.css({top:Math.round(M)+"px",left:Math.round(A)+"px"})}}};e.fn[r]=function(){var t=arguments;if(this.length===0){if(typeof t[0]==="string"){var n=true;switch(t[0]){case"setDefaults":e.extend(i,t[1]);break;default:n=false;break}if(n)return true;else return this}else{return this}}else{if(typeof t[0]==="string"){var r="#*$~&";this.each(function(){var n=e(this).data("tooltipster");if(n){switch(t[0]){case"content":case"update":if(typeof t[1]==="undefined"){r=n.content;return false}else{n.updateTooltip(t[1]);break};case"destroy":n.hideTooltip();if(n.$el[0]!==n.$elProxy[0])n.$elProxy.remove();var i=typeof n.content==="string"?n.content:e("<div></div>").append(n.content).html();n.$el.removeClass("tooltipstered").attr("title",i).removeData("tooltipster").off("."+n.namespace);break;case"disable":n.hideTooltip();n.enabled=false;break;case"elementIcon":r=n.$el[0]!==n.$elProxy[0]?n.$elProxy[0]:undefined;return false;case"elementTooltip":r=n.$tooltip?n.$tooltip[0]:undefined;return false;case"enable":n.enabled=true;break;case"hide":n.hideTooltip(t[1]);break;case"option":r=n.options[t[1]];return false;case"reposition":n.positionTooltip();break;case"show":n.showTooltipNow(t[1]);break;case"status":r=n.status;return false;default:throw new Error('Unknown method .tooltipster("'+t[0]+'")');break}}else{throw new Error("You called Tooltipster's \""+t[0]+'" method on an uninitialized element')}});return r!=="#*$~&"?r:this}else{return this.each(function(){if(!e(this).data("tooltipster")){e(this).data("tooltipster",new s(this,t[0]))}})}}};var u=!!("ontouchstart"in t);var a=false;e("body").one("mousemove",function(){a=true})})(jQuery,window,document);;(function(){var _global=this;var _rng;if(typeof _global.require=="function")try{var _rb=_global.require("crypto").randomBytes;_rng=_rb&&function(){return _rb(16)}}catch(e){}if(!_rng&&_global.crypto&&crypto.getRandomValues){var _rnds8=new Uint8Array(16);_rng=function whatwgRNG(){crypto.getRandomValues(_rnds8);return _rnds8}}if(!_rng){var _rnds=new Array(16);_rng=function(){for(var i=0,r;i<16;i++){if((i&3)===0)r=Math.random()*4294967296;_rnds[i]=r>>>((i&3)<<3)&255}return _rnds}}var BufferClass=typeof _global.Buffer==
"function"?_global.Buffer:Array;var _byteToHex=[];var _hexToByte={};for(var i=0;i<256;i++){_byteToHex[i]=(i+256).toString(16).substr(1);_hexToByte[_byteToHex[i]]=i}function parse(s,buf,offset){var i=buf&&offset||0,ii=0;buf=buf||[];s.toLowerCase().replace(/[0-9a-f]{2}/g,function(oct){if(ii<16)buf[i+ii++]=_hexToByte[oct]});while(ii<16)buf[i+ii++]=0;return buf}function unparse(buf,offset){var i=offset||0,bth=_byteToHex;return bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+
bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+"-"+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]+bth[buf[i++]]}var _seedBytes=_rng();var _nodeId=[_seedBytes[0]|1,_seedBytes[1],_seedBytes[2],_seedBytes[3],_seedBytes[4],_seedBytes[5]];var _clockseq=(_seedBytes[6]<<8|_seedBytes[7])&16383;var _lastMSecs=0,_lastNSecs=0;function v1(options,buf,offset){var i=buf&&offset||0;var b=buf||[];options=options||{};var clockseq=options.clockseq!=null?options.clockseq:
_clockseq;var msecs=options.msecs!=null?options.msecs:(new Date).getTime();var nsecs=options.nsecs!=null?options.nsecs:_lastNSecs+1;var dt=msecs-_lastMSecs+(nsecs-_lastNSecs)/1E4;if(dt<0&&options.clockseq==null)clockseq=clockseq+1&16383;if((dt<0||msecs>_lastMSecs)&&options.nsecs==null)nsecs=0;if(nsecs>=1E4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");_lastMSecs=msecs;_lastNSecs=nsecs;_clockseq=clockseq;msecs+=122192928E5;var tl=((msecs&268435455)*1E4+nsecs)%4294967296;b[i++]=
tl>>>24&255;b[i++]=tl>>>16&255;b[i++]=tl>>>8&255;b[i++]=tl&255;var tmh=msecs/4294967296*1E4&268435455;b[i++]=tmh>>>8&255;b[i++]=tmh&255;b[i++]=tmh>>>24&15|16;b[i++]=tmh>>>16&255;b[i++]=clockseq>>>8|128;b[i++]=clockseq&255;var node=options.node||_nodeId;for(var n=0;n<6;n++)b[i+n]=node[n];return buf?buf:unparse(b)}function v4(options,buf,offset){var i=buf&&offset||0;if(typeof options=="string"){buf=options=="binary"?new BufferClass(16):null;options=null}options=options||{};var rnds=options.random||
(options.rng||_rng)();rnds[6]=rnds[6]&15|64;rnds[8]=rnds[8]&63|128;if(buf)for(var ii=0;ii<16;ii++)buf[i+ii]=rnds[ii];return buf||unparse(rnds)}var uuid=v4;uuid.v1=v1;uuid.v4=v4;uuid.parse=parse;uuid.unparse=unparse;uuid.BufferClass=BufferClass;if(typeof define==="function"&&define.amd)define(function(){return uuid});else if(typeof module!="undefined"&&module.exports){module.exports=uuid;_global.uuid=uuid}else{var _previousRoot=_global.uuid;uuid.noConflict=function(){_global.uuid=_previousRoot;return uuid};
_global.uuid=uuid}}).call(this);;;(function(){
	!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.Dexie=t()}(this,function(){"use strict";function n(n,t){return"object"!=typeof t?n:(jn(t).forEach(function(e){n[e]=t[e]}),n)}function t(n,t){return Cn.call(n,t)}function e(n,t){"function"==typeof t&&(t=t(Pn(n))),jn(t).forEach(function(e){r(n,e,t[e])})}function r(e,r,i,o){Object.defineProperty(e,r,n(i&&t(i,"get")&&"function"==typeof i.get?{get:i.get,set:i.set,configurable:!0}:{value:i,configurable:!0,writable:!0},o))}function i(n){return{from:function(t){return n.prototype=Object.create(t.prototype),r(n.prototype,"constructor",n),{extend:e.bind(null,n.prototype)}}}}function o(n,t){var e,r=In(n,t);return r||(e=Pn(n))&&o(e,t)}function u(n,t,e){return Dn.call(n,t,e)}function a(n,t){return t(n)}function c(n){var t=setTimeout(n,1e3);clearTimeout(t)}function s(n){if(!n)throw new Error("Assertion Failed")}function f(n){On.setImmediate?setImmediate(n):setTimeout(n,0)}function l(n,t){return n.reduce(function(n,e,r){var i=t(e,r);return i&&(n[i[0]]=i[1]),n},{})}function h(n,t){return function(){try{n.apply(this,arguments)}catch(n){t(n)}}}function d(n,t,e){try{n.apply(null,e)}catch(n){t&&t(n)}}function v(n,e){if(t(n,e))return n[e];if(!e)return n;if("string"!=typeof e){for(var r=[],i=0,o=e.length;i<o;++i){var u=v(n,e[i]);r.push(u)}return r}var a=e.indexOf(".");if(a!==-1){var c=n[e.substr(0,a)];return void 0===c?void 0:v(c,e.substr(a+1))}}function p(n,t,e){if(n&&void 0!==t&&!("isFrozen"in Object&&Object.isFrozen(n)))if("string"!=typeof t&&"length"in t){s("string"!=typeof e&&"length"in e);for(var r=0,i=t.length;r<i;++r)p(n,t[r],e[r])}else{var o=t.indexOf(".");if(o!==-1){var u=t.substr(0,o),a=t.substr(o+1);if(""===a)void 0===e?delete n[u]:n[u]=e;else{var c=n[u];c||(c=n[u]={}),p(c,a,e)}}else void 0===e?delete n[t]:n[t]=e}}function y(n,t){"string"==typeof t?p(n,t,void 0):"length"in t&&[].map.call(t,function(t){p(n,t,void 0)})}function m(n){var e={};for(var r in n)t(n,r)&&(e[r]=n[r]);return e}function g(n){if(!n||"object"!=typeof n)return n;var e;if(An(n)){e=[];for(var r=0,i=n.length;r<i;++r)e.push(g(n[r]))}else if(n instanceof Date)e=new Date,e.setTime(n.getTime());else{e=n.constructor?Object.create(n.constructor.prototype):{};for(var o in n)t(n,o)&&(e[o]=g(n[o]))}return e}function b(n,e,r,i){return r=r||{},i=i||"",jn(n).forEach(function(o){if(t(e,o)){var u=n[o],a=e[o];"object"==typeof u&&"object"==typeof a&&u&&a&&u.constructor===a.constructor?b(u,a,r,i+o+"."):u!==a&&(r[i+o]=e[o])}else r[i+o]=void 0}),jn(e).forEach(function(o){t(n,o)||(r[i+o]=e[o])}),r}function _(n){var t,e,r,i;if(1===arguments.length){if(An(n))return n.slice();if(this===Kn&&"string"==typeof n)return[n];if(i=Tn(n)){for(e=[];r=i.next(),!r.done;)e.push(r.value);return e}if(null==n)return[n];if(t=n.length,"number"==typeof t){for(e=new Array(t);t--;)e[t]=n[t];return e}return[n]}for(t=arguments.length,e=new Array(t);t--;)e[t]=arguments[t];return e}function w(n){return Bn.apply([],n)}function x(){}function k(n){return n}function E(n,t){return null==n||n===k?t:function(e){return t(n(e))}}function j(n,t){return function(){n.apply(this,arguments),t.apply(this,arguments)}}function A(n,t){return n===x?t:function(){var e=n.apply(this,arguments);void 0!==e&&(arguments[0]=e);var r=this.onsuccess,i=this.onerror;this.onsuccess=null,this.onerror=null;var o=t.apply(this,arguments);return r&&(this.onsuccess=this.onsuccess?j(r,this.onsuccess):r),i&&(this.onerror=this.onerror?j(i,this.onerror):i),void 0!==o?o:e}}function O(n,t){return n===x?t:function(){n.apply(this,arguments);var e=this.onsuccess,r=this.onerror;this.onsuccess=this.onerror=null,t.apply(this,arguments),e&&(this.onsuccess=this.onsuccess?j(e,this.onsuccess):e),r&&(this.onerror=this.onerror?j(r,this.onerror):r)}}function P(t,e){return t===x?e:function(r){var i=t.apply(this,arguments);n(r,i);var o=this.onsuccess,u=this.onerror;this.onsuccess=null,this.onerror=null;var a=e.apply(this,arguments);return o&&(this.onsuccess=this.onsuccess?j(o,this.onsuccess):o),u&&(this.onerror=this.onerror?j(u,this.onerror):u),void 0===i?void 0===a?void 0:a:n(i,a)}}function C(n,t){return n===x?t:function(){return t.apply(this,arguments)!==!1&&n.apply(this,arguments)}}function I(n,t){return n===x?t:function(){var e=n.apply(this,arguments);if(e&&"function"==typeof e.then){for(var r=this,i=arguments.length,o=new Array(i);i--;)o[i]=arguments[i];return e.then(function(){return t.apply(r,o)})}return t.apply(this,arguments)}}function D(n,t){Mn=n,Nn=t}function S(){if(Fn)try{throw S.arguments,new Error}catch(n){return n}return new Error}function T(n,t){var e=n.stack;return e?(t=t||0,0===e.indexOf(n.name)&&(t+=(n.name+n.message).split("\n").length),e.split("\n").slice(t).filter(Nn).map(function(n){return"\n"+n}).join("")):""}function K(n,t){return function(){return console.warn(n+" is deprecated. See https://github.com/dfahlander/Dexie.js/wiki/Deprecations. "+T(S(),1)),t.apply(this,arguments)}}function B(n,t){this._e=S(),this.name=n,this.message=t}function M(n,t){return n+". Errors: "+t.map(function(n){return n.toString()}).filter(function(n,t,e){return e.indexOf(n)===t}).join("\n")}function N(n,t,e,r){this._e=S(),this.failures=t,this.failedKeys=r,this.successCount=e}function F(n,t){this._e=S(),this.name="BulkError",this.failures=t,this.message=M(n,t)}function q(n,t){if(!n||n instanceof B||n instanceof TypeError||n instanceof SyntaxError||!n.name||!Hn[n.name])return n;var e=new Hn[n.name](t||n.message,n);return"stack"in n&&r(e,"stack",{get:function(){return this.inner.stack}}),e}function R(n){function t(n,t,o){if("object"==typeof n)return e(n);t||(t=C),o||(o=x);var u={subscribers:[],fire:o,subscribe:function(n){u.subscribers.indexOf(n)===-1&&(u.subscribers.push(n),u.fire=t(u.fire,n))},unsubscribe:function(n){u.subscribers=u.subscribers.filter(function(t){return t!==n}),u.fire=u.subscribers.reduce(t,o)}};return r[n]=i[n]=u,u}function e(n){jn(n).forEach(function(e){var r=n[e];if(An(r))t(e,n[e][0],n[e][1]);else{if("asap"!==r)throw new Wn.InvalidArgument("Invalid event config");var i=t(e,k,function(){for(var n=arguments.length,t=new Array(n);n--;)t[n]=arguments[n];i.subscribers.forEach(function(n){f(function(){n.apply(null,t)})})})}})}var r={},i=function(t,e){if(e){for(var i=arguments.length,o=new Array(i-1);--i;)o[i-1]=arguments[i];return r[t].subscribe.apply(null,o),n}if("string"==typeof t)return r[t]};i.addEventType=t;for(var o=1,u=arguments.length;o<u;++o)t(arguments[o]);return i}function U(n){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");this._listeners=[],this.onuncatched=x,this._lib=!1;var t=this._PSD=at;if(Mn&&(this._stackHolder=S(),this._prev=null,this._numPrev=0,Q(this,it)),"function"!=typeof n){if(n!==Jn)throw new TypeError("Not a function");return this._state=arguments[1],this._value=arguments[2],void(this._state===!1&&L(this,this._value))}this._state=null,this._value=null,++t.ref,V(this,n)}function z(n,t,e,r){this.onFulfilled="function"==typeof n?n:null,this.onRejected="function"==typeof t?t:null,this.resolve=e,this.reject=r,this.psd=at}function V(n,t){try{t(function(t){if(null===n._state){if(t===n)throw new TypeError("A promise cannot be resolved with itself.");var e=n._lib&&$();t&&"function"==typeof t.then?V(n,function(n,e){t instanceof U?t._then(n,e):t.then(n,e)}):(n._state=!0,n._value=t,W(n)),e&&X()}},L.bind(null,n))}catch(t){L(n,t)}}function L(n,t){if(rt.push(t),null===n._state){var e=n._lib&&$();t=ot(t),n._state=!1,n._value=t,Mn&&null!==t&&"object"==typeof t&&!t._promise&&d(function(){var e=o(t,"stack");t._promise=n,r(t,"stack",{get:function(){return $n?e&&(e.get?e.get.apply(t):e.value):n.stack}})}),tn(n),W(n),e&&X()}}function W(n){var t=n._listeners;n._listeners=[];for(var e=0,r=t.length;e<r;++e)H(n,t[e]);var i=n._PSD;--i.ref||i.finalize(),0===st&&(++st,Zn(function(){0===--st&&Z()},[]))}function H(n,t){if(null===n._state)return void n._listeners.push(t);var e=n._state?t.onFulfilled:t.onRejected;if(null===e)return(n._state?t.resolve:t.reject)(n._value);var r=t.psd;++r.ref,++st,Zn(G,[e,n,t])}function G(n,t,e){var r=at,i=e.psd;try{i!==r&&(at=i),it=t;var o,u=t._value;t._state?o=n(u):(rt.length&&(rt=[]),o=n(u),rt.indexOf(u)===-1&&en(t)),e.resolve(o)}catch(n){e.reject(n)}finally{i!==r&&(at=r),it=null,0===--st&&Z(),--i.ref||i.finalize()}}function J(n,t,e){if(t.length===e)return t;var r="";if(n._state===!1){var i,o,u=n._value;null!=u?(i=u.name||"Error",o=u.message||u,r=T(u,0)):(i=u,o=""),t.push(i+(o?": "+o:"")+r)}return Mn&&(r=T(n._stackHolder,2),r&&t.indexOf(r)===-1&&t.push(r),n._prev&&J(n._prev,t,e)),t}function Q(n,t){var e=t?t._numPrev+1:0;e<Qn&&(n._prev=t,n._numPrev=e)}function Y(){$()&&X()}function $(){var n=nt;return nt=!1,tt=!1,n}function X(){var n,t,e;do for(;ct.length>0;)for(n=ct,ct=[],e=n.length,t=0;t<e;++t){var r=n[t];r[0].apply(null,r[1])}while(ct.length>0);nt=!0,tt=!0}function Z(){var n=et;et=[],n.forEach(function(n){n._PSD.onunhandled.call(null,n._value,n)});for(var t=ft.slice(0),e=t.length;e;)t[--e]()}function nn(n){function t(){n(),ft.splice(ft.indexOf(t),1)}ft.push(t),++st,Zn(function(){0===--st&&Z()},[])}function tn(n){et.some(function(t){return t._value===n._value})||et.push(n)}function en(n){for(var t=et.length;t;)if(et[--t]._value===n._value)return void et.splice(t,1)}function rn(n){console.warn("Unhandled rejection: "+(n.stack||n))}function on(n){return new U(Jn,!1,n)}function un(n,t){var e=at;return function(){var r=$(),i=at;try{return i!==e&&(at=e),n.apply(this,arguments)}catch(n){t&&t(n)}finally{i!==e&&(at=i),r&&X()}}}function an(n,t,e,r){var i=at,o=Object.create(i);o.parent=i,o.ref=0,o.global=!1,++i.ref,o.finalize=function(){--this.parent.ref||this.parent.finalize()};var u=cn(o,n,t,e,r);return 0===o.ref&&o.finalize(),u}function cn(n,t,e,r,i){var o=at;try{return n!==o&&(at=n),t(e,r,i)}finally{n!==o&&(at=o)}}function sn(t,e){var r;try{r=e.onuncatched(t)}catch(n){}if(r!==!1)try{var i,o={promise:e,reason:t};if(On.document&&document.createEvent?(i=document.createEvent("Event"),i.initEvent(ht,!0,!0),n(i,o)):On.CustomEvent&&(i=new CustomEvent(ht,{detail:o}),n(i,o)),i&&On.dispatchEvent&&(dispatchEvent(i),!On.PromiseRejectionEvent&&On.onunhandledrejection))try{On.onunhandledrejection(i)}catch(n){}i.defaultPrevented||U.on.error.fire(t,e)}catch(n){}}function fn(n,t){var e=U.reject(n);return t?e.uncaught(t):e}function ln(o,f){function y(){it.on("versionchange",function(n){n.newVersion>0?console.warn("Another connection wants to upgrade database '"+it.name+"'. Closing db now to resume the upgrade."):console.warn("Another connection wants to delete database '"+it.name+"'. Closing db now to resume the delete request."),it.close()}),it.on("blocked",function(n){!n.newVersion||n.newVersion<n.oldVersion?console.warn("Dexie.delete('"+it.name+"') was blocked"):console.warn("Upgrade '"+it.name+"' blocked by other connection holding version "+n.oldVersion/10)})}function j(n){this._cfg={version:n,storesSource:null,dbschema:{},tables:{},contentUpgrade:null},this.stores({})}function C(n,t,e){var r=it._createTransaction(rt,Yn,Jn);r.create(t),r._completion.catch(e);var i=r._reject.bind(r);an(function(){at.trans=r,0===n?(jn(Jn).forEach(function(n){B(t,n,Jn[n].primKey,Jn[n].indexes)}),U.follow(function(){return it.on.populate.fire(r)}).catch(i)):D(n,r,t).catch(i)})}function D(n,t,e){function r(){return i.length?U.resolve(i.shift()(t.idbtrans)).then(r):U.resolve()}var i=[],o=Qn.filter(function(t){return t._cfg.version===n})[0];if(!o)throw new Wn.Upgrade("Dexie specification of currently installed DB version is missing");Jn=it._dbSchema=o._cfg.dbschema;var u=!1,a=Qn.filter(function(t){return t._cfg.version>n});return a.forEach(function(n){i.push(function(){var r=Jn,i=n._cfg.dbschema;Bn(r,e),Bn(i,e),Jn=it._dbSchema=i;var o=T(r,i);if(o.add.forEach(function(n){B(e,n[0],n[1].primKey,n[1].indexes)}),o.change.forEach(function(n){if(n.recreate)throw new Wn.Upgrade("Not yet support for changing primary key");var t=e.objectStore(n.name);n.add.forEach(function(n){z(t,n)}),n.change.forEach(function(n){t.deleteIndex(n.name),z(t,n)}),n.del.forEach(function(n){t.deleteIndex(n)})}),n._cfg.contentUpgrade)return u=!0,U.follow(function(){n._cfg.contentUpgrade(t)})}),i.push(function(t){if(!u||!_t){var e=n._cfg.dbschema;q(e,t)}})}),r().then(function(){M(Jn,e)})}function T(n,t){var e={del:[],add:[],change:[]};for(var r in n)t[r]||e.del.push(r);for(r in t){var i=n[r],o=t[r];if(i){var u={name:r,def:o,recreate:!1,del:[],add:[],change:[]};if(i.primKey.src!==o.primKey.src)u.recreate=!0,e.change.push(u);else{var a=i.idxByName,c=o.idxByName;for(var s in a)c[s]||u.del.push(s);for(s in c){var f=a[s],l=c[s];f?f.src!==l.src&&u.change.push(l):u.add.push(l)}(u.del.length>0||u.add.length>0||u.change.length>0)&&e.change.push(u)}}else e.add.push([r,o])}return e}function B(n,t,e,r){var i=n.db.createObjectStore(t,e.keyPath?{keyPath:e.keyPath,autoIncrement:e.auto}:{autoIncrement:e.auto});return r.forEach(function(n){z(i,n)}),i}function M(n,t){jn(n).forEach(function(e){t.db.objectStoreNames.contains(e)||B(t,e,n[e].primKey,n[e].indexes)})}function q(n,t){for(var e=0;e<t.db.objectStoreNames.length;++e){var r=t.db.objectStoreNames[e];null==n[r]&&t.db.deleteObjectStore(r)}}function z(n,t){n.createIndex(t.name,t.keyPath,{unique:t.unique,multiEntry:t.multi})}function V(n){return it.on.error.fire(n)}function L(n,t,e){if(tt||at.letThrough){var r=it._createTransaction(n,t,Jn);return r._promise(n,function(n,t){an(function(){at.trans=r,e(n,t,r)})}).then(function(n){return r._completion.then(function(){return n})})}if(!nt){if(!Ln)return fn(new Wn.DatabaseClosed,V);it.open().catch(x)}return ot.then(function(){return L(n,t,e)})}function W(n,t,e){this.name=n,this.schema=t,this.hook=$n[n]?$n[n].hook:R(null,{creating:[A,x],reading:[E,k],updating:[P,x],deleting:[O,x]}),this._collClass=e||$}function H(n,t,e){W.call(this,n,t,e||Z)}function G(n,t,e){return(e?mn:yn)(function(e){n.push(e),t&&t()})}function J(n,t,e,r,i){return new U(function(o,u){var a=e.length,c=a-1;if(0===a)return o();if(r){var s,f=mn(u),l=pn(null);d(function(){for(var r=0;r<a;++r){s={onsuccess:null,onerror:null};var u=e[r];i.call(s,u[0],u[1],t);var h=n.delete(u[0]);h._hookCtx=s,h.onerror=f,r===c?h.onsuccess=pn(o):h.onsuccess=l}},function(n){throw s.onerror&&s.onerror(n),n})}else for(var h=0;h<a;++h){var v=n.delete(e[h]);v.onerror=un(yn(u)),h===c&&(v.onsuccess=un(function(){return o()}))}}).uncaught(V)}function Q(n,t,e,r){var i=this;this.db=it,this.mode=n,this.storeNames=t,this.idbtrans=null,this.on=R(this,"complete","error","abort"),this.parent=r||null,this.active=!0,this._tables=null,this._reculock=0,this._blockedFuncs=[],this._psd=null,this._dbschema=e,this._resolve=null,this._reject=null,this._completion=new U(function(n,t){i._resolve=n,i._reject=t}).uncaught(V),this._completion.then(function(){i.on.complete.fire()},function(n){return i.on.error.fire(n),i.parent?i.parent._reject(n):i.active&&i.idbtrans&&i.idbtrans.abort(),i.active=!1,fn(n)})}function Y(n,t,e){this._ctx={table:n,index:":id"===t?null:t,collClass:n._collClass,or:e}}function $(n,t){var e=null,r=null;if(t)try{e=t()}catch(n){r=n}var i=n._ctx,o=i.table;this._ctx={table:o,index:i.index,isPrimKey:!i.index||o.schema.primKey.keyPath&&i.index===o.schema.primKey.name,range:e,keysOnly:!1,dir:"next",unique:"",algorithm:null,filter:null,replayFilter:null,justLimit:!0,isMatch:null,offset:0,limit:1/0,error:r,or:i.or,valueMapper:o.hook.reading.fire}}function X(n,t){return!(n.filter||n.algorithm||n.or)&&(t?n.justLimit:!n.replayFilter)}function Z(){$.apply(this,arguments)}function nn(n,t){return n._cfg.version-t._cfg.version}function tn(n,t,e,r){t.forEach(function(t){var i=it._tableFactory(e,r[t]);n.forEach(function(n){t in n||(n[t]=i)})})}function en(n){n.forEach(function(n){for(var t in n)n[t]instanceof W&&delete n[t]})}function rn(n,t,e,r,i,o){var u=o?function(n,t,r){return e(o(n),t,r)}:e,a=un(u,i);n.onerror||(n.onerror=yn(i)),t?n.onsuccess=h(function(){var e=n.result;if(e){var o=function(){e.continue()};t(e,function(n){o=n},r,i)&&a(e.value,e,function(n){o=n}),o()}else r()},i):n.onsuccess=h(function(){var t=n.result;if(t){var e=function(){t.continue()};a(t.value,t,function(n){e=n}),e()}else r()},i)}function on(n){var t=[];return n.split(",").forEach(function(n){n=n.trim();var e=n.replace(/([&*]|\+\+)/g,""),r=/^\[/.test(e)?e.match(/^\[(.*)\]$/)[1].split("+"):e;t.push(new wn(e,r||null,/\&/.test(n),/\*/.test(n),/\+\+/.test(n),An(r),/\./.test(n)))}),t}function sn(n,t){return Hn.cmp(n,t)}function hn(n,t){return sn(n,t)<0?n:t}function On(n,t){return sn(n,t)>0?n:t}function Pn(n,t){return Hn.cmp(n,t)}function Cn(n,t){return Hn.cmp(t,n)}function In(n,t){return n<t?-1:n===t?0:1}function Dn(n,t){return n>t?-1:n===t?0:1}function Sn(n,t){return n?t?function(){return n.apply(this,arguments)&&t.apply(this,arguments)}:n:t}function Tn(){if(it.verno=Xn.version/10,it._dbSchema=Jn={},Yn=u(Xn.objectStoreNames,0),0!==Yn.length){var n=Xn.transaction(kn(Yn),"readonly");Yn.forEach(function(t){for(var e=n.objectStore(t),r=e.keyPath,i=r&&"string"==typeof r&&r.indexOf(".")!==-1,o=new wn(r,r||"",!1,!1,!!e.autoIncrement,r&&"string"!=typeof r,i),u=[],a=0;a<e.indexNames.length;++a){var c=e.index(e.indexNames[a]);r=c.keyPath,i=r&&"string"==typeof r&&r.indexOf(".")!==-1;var s=new wn(c.name,r,!!c.unique,!!c.multiEntry,!1,r&&"string"!=typeof r,i);u.push(s)}Jn[t]=new xn(t,o,u,{})}),tn([$n,Q.prototype],jn(Jn),rt,Jn)}}function Bn(n,t){for(var e=t.db.objectStoreNames,r=0;r<e.length;++r){var i=e[r],o=t.objectStore(i);Rn="getAll"in o;for(var a=0;a<o.indexNames.length;++a){var c=o.indexNames[a],s=o.index(c).keyPath,f="string"==typeof s?s:"["+u(s).join("+")+"]";if(n[i]){var l=n[i].idxByName[f];l&&(l.name=c)}}}}function Nn(n){it.on("blocked").fire(n),gt.filter(function(n){return n.name===it.name&&n!==it&&!n._vcFired}).map(function(t){return t.on("versionchange").fire(n)})}var Fn,qn,Rn,Un=ln.dependencies,zn=n({addons:ln.addons,autoOpen:!0,indexedDB:Un.indexedDB,IDBKeyRange:Un.IDBKeyRange},f),Vn=zn.addons,Ln=zn.autoOpen,Hn=zn.indexedDB,Gn=zn.IDBKeyRange,Jn=this._dbSchema={},Qn=[],Yn=[],$n={},Xn=null,Zn=null,nt=!1,tt=!1,et="readonly",rt="readwrite",it=this,ot=new U(function(n){Fn=n}),ut=new U(function(n,t){qn=t}),ct=!0,st=!!En(Hn);this.version=function(n){if(Xn||nt)throw new Wn.Schema("Cannot add version when database is open");this.verno=Math.max(this.verno,n);var t=Qn.filter(function(t){return t._cfg.version===n})[0];return t?t:(t=new j(n),Qn.push(t),Qn.sort(nn),t)},n(j.prototype,{stores:function(t){this._cfg.storesSource=this._cfg.storesSource?n(this._cfg.storesSource,t):t;var e={};Qn.forEach(function(t){n(e,t._cfg.storesSource)});var r=this._cfg.dbschema={};return this._parseStoresSpec(e,r),Jn=it._dbSchema=r,en([$n,it,Q.prototype]),tn([$n,it,Q.prototype,this._cfg.tables],jn(r),rt,r),Yn=jn(r),this},upgrade:function(n){var t=this;return kt(function(){n(it._createTransaction(rt,jn(t._cfg.dbschema),t._cfg.dbschema))}),this._cfg.contentUpgrade=n,this},_parseStoresSpec:function(n,t){jn(n).forEach(function(e){if(null!==n[e]){var r={},i=on(n[e]),o=i.shift();if(o.multi)throw new Wn.Schema("Primary key cannot be multi-valued");o.keyPath&&p(r,o.keyPath,o.auto?0:o.keyPath),i.forEach(function(n){if(n.auto)throw new Wn.Schema("Only primary key can be marked as autoIncrement (++)");if(!n.keyPath)throw new Wn.Schema("Index must have a name and cannot be an empty string");p(r,n.keyPath,n.compound?n.keyPath.map(function(){return""}):"")}),t[e]=new xn(e,o,i,r)}})}}),this._allTables=$n,this._tableFactory=function(n,t){return n===et?new W(t.name,t,$):new H(t.name,t)},this._createTransaction=function(n,t,e,r){return new Q(n,t,e,r)},this._whenReady=function(n){return new U(Et||tt||at.letThrough?n:function(t,e){if(!nt){if(!Ln)return void e(new Wn.DatabaseClosed);it.open().catch(x)}ot.then(function(){n(t,e)})}).uncaught(V)},this.verno=0,this.open=function(){if(nt||Xn)return ot.then(function(){return Zn?fn(Zn,V):it});Mn&&(ut._stackHolder=S()),nt=!0,Zn=null,tt=!1;var n=Fn,t=null;return U.race([ut,new U(function(n,e){if(c(function(){return n()}),Qn.length>0&&(ct=!1),!Hn)throw new Wn.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL (not locally). If using old Safari versions, make sure to include indexedDB polyfill.");var r=ct?Hn.open(o):Hn.open(o,Math.round(10*it.verno));if(!r)throw new Wn.MissingAPI("IndexedDB API not available");r.onerror=un(yn(e)),r.onblocked=un(Nn),r.onupgradeneeded=un(function(n){if(t=r.transaction,ct&&!it._allowEmptyDB){r.onerror=gn,t.abort(),r.result.close();var i=Hn.deleteDatabase(o);i.onsuccess=i.onerror=un(function(){e(new Wn.NoSuchDatabase("Database "+o+" doesnt exist"))})}else{t.onerror=un(yn(e));var u=n.oldVersion>Math.pow(2,62)?0:n.oldVersion;C(u/10,t,e,r)}},e),r.onsuccess=un(function(){if(t=null,Xn=r.result,gt.push(it),ct)Tn();else if(Xn.objectStoreNames.length>0)try{Bn(Jn,Xn.transaction(kn(Xn.objectStoreNames),et))}catch(n){}Xn.onversionchange=un(function(n){it._vcFired=!0,it.on("versionchange").fire(n)}),st||bn(function(n){if(n.indexOf(o)===-1)return n.push(o)}),n()},e)})]).then(function(){return ln.vip(it.on.ready.fire)}).then(function(){return nt=!1,it}).catch(function(n){try{t&&t.abort()}catch(n){}return nt=!1,it.close(),Zn=n,fn(Zn,V)}).finally(function(){tt=!0,n()})},this.close=function(){var n=gt.indexOf(it);if(n>=0&&gt.splice(n,1),Xn){try{Xn.close()}catch(n){}Xn=null}Ln=!1,Zn=new Wn.DatabaseClosed,nt&&qn(Zn),ot=new U(function(n){Fn=n}),ut=new U(function(n,t){qn=t})},this.delete=function(){var n=arguments.length>0;return new U(function(t,e){function r(){it.close();var n=Hn.deleteDatabase(o);n.onsuccess=un(function(){st||bn(function(n){var t=n.indexOf(o);if(t>=0)return n.splice(t,1)}),t()}),n.onerror=un(yn(e)),n.onblocked=Nn}if(n)throw new Wn.InvalidArgument("Arguments not allowed in db.delete()");nt?ot.then(r):r()}).uncaught(V)},this.backendDB=function(){return Xn},this.isOpen=function(){return null!==Xn},this.hasFailed=function(){return null!==Zn},this.dynamicallyOpened=function(){return ct},this.name=o,r(this,"tables",{get:function(){return jn($n).map(function(n){return $n[n]})}}),this.on=R(this,"error","populate","blocked","versionchange",{ready:[I,x]}),this.on.error.subscribe=K("Dexie.on.error",this.on.error.subscribe),this.on.error.unsubscribe=K("Dexie.on.error.unsubscribe",this.on.error.unsubscribe),this.on.ready.subscribe=a(this.on.ready.subscribe,function(n){return function(t,e){ln.vip(function(){tt?(Zn||U.resolve().then(t),e&&n(t)):(n(t),e||n(function n(){it.on.ready.unsubscribe(t),it.on.ready.unsubscribe(n)}))})}}),kt(function(){it.on("populate").fire(it._createTransaction(rt,Yn,Jn)),it.on("error").fire(new Error)}),this.transaction=function(n,e,r){function i(e){var i=at;e(U.resolve().then(function(){return an(function(){at.transless=at.transless||i;var e=it._createTransaction(n,f,Jn,c);at.trans=e,c?e.idbtrans=c.idbtrans:e.create();var o=f.map(function(n){return $n[n]});o.push(e);var u;return U.follow(function(){if(u=r.apply(e,o))if("function"==typeof u.next&&"function"==typeof u.throw)u=_n(u);else if("function"==typeof u.then&&!t(u,"_PSD"))throw new Wn.IncompatiblePromise("Incompatible Promise returned from transaction scope (read more at http://tinyurl.com/znyqjqc). Transaction scope: "+r.toString())}).uncaught(V).then(function(){return c&&e._resolve(),e._completion}).then(function(){return u}).catch(function(n){return e._reject(n),fn(n)})})}))}var o=arguments.length;if(o<2)throw new Wn.InvalidArgument("Too few arguments");for(var u=new Array(o-1);--o;)u[o-1]=arguments[o];r=u.pop();var a=w(u),c=at.trans;c&&c.db===it&&n.indexOf("!")===-1||(c=null);var s=n.indexOf("?")!==-1;n=n.replace("!","").replace("?","");try{var f=a.map(function(n){var t=n instanceof W?n.name:n;if("string"!=typeof t)throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");return t});if("r"==n||n==et)n=et;else{if("rw"!=n&&n!=rt)throw new Wn.InvalidArgument("Invalid transaction mode: "+n);n=rt}if(c){if(c.mode===et&&n===rt){if(!s)throw new Wn.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");c=null}c&&f.forEach(function(n){if(c&&c.storeNames.indexOf(n)===-1){if(!s)throw new Wn.SubTransaction("Table "+n+" not included in parent transaction.");c=null}})}}catch(n){return c?c._promise(null,function(t,e){e(n)}):fn(n,V)}return c?c._promise(n,i,"lock"):it._whenReady(i)},this.table=function(n){if(Et&&ct)return new H(n);if(!t($n,n))throw new Wn.InvalidTable("Table "+n+" does not exist");return $n[n]},e(W.prototype,{_trans:function(n,t,e){var r=at.trans;return r&&r.db===it?r._promise(n,t,e):L(n,[this.name],t)},_idbstore:function(n,t,e){function r(n,e,r){t(n,e,r.idbtrans.objectStore(o),r)}if(Et)return new U(t);var i=at.trans,o=this.name;return i&&i.db===it?i._promise(n,r,e):L(n,[this.name],r)},get:function(n,t){var e=this;return this._idbstore(et,function(t,r,i){Et&&t(e.schema.instanceTemplate);var o=i.get(n);o.onerror=yn(r),o.onsuccess=un(function(){t(e.hook.reading.fire(o.result))},r)}).then(t)},where:function(n){return new Y(this,n)},count:function(n){return this.toCollection().count(n)},offset:function(n){return this.toCollection().offset(n)},limit:function(n){return this.toCollection().limit(n)},reverse:function(){return this.toCollection().reverse()},filter:function(n){return this.toCollection().and(n)},each:function(n){return this.toCollection().each(n)},toArray:function(n){return this.toCollection().toArray(n)},orderBy:function(n){return new this._collClass(new Y(this,n))},toCollection:function(){return new this._collClass(new Y(this))},mapToClass:function(n,e){this.schema.mappedClass=n;var r=Object.create(n.prototype);e&&dn(r,e),this.schema.instanceTemplate=r;var i=function(e){if(!e)return e;var r=Object.create(n.prototype);for(var i in e)if(t(e,i))try{r[i]=e[i]}catch(n){}return r};return this.schema.readHook&&this.hook.reading.unsubscribe(this.schema.readHook),this.schema.readHook=i,this.hook("reading",i),n},defineClass:function(n){return this.mapToClass(ln.defineClass(n),n)}}),i(H).from(W).extend({bulkDelete:function(n){return this.hook.deleting.fire===x?this._idbstore(rt,function(t,e,r,i){t(J(r,i,n,!1,x))}):this.where(":id").anyOf(n).delete().then(function(){})},bulkPut:function(n,t){var e=this;return this._idbstore(rt,function(r,i,o){if(!o.keyPath&&!e.schema.primKey.auto&&!t)throw new Wn.InvalidArgument("bulkPut() with non-inbound keys requires keys array in second argument");if(o.keyPath&&t)throw new Wn.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");if(t&&t.length!==n.length)throw new Wn.InvalidArgument("Arguments objects and keys must have the same length");if(0===n.length)return r();var u,a,c=function(n){0===s.length?r(n):i(new F(e.name+".bulkPut(): "+s.length+" of "+f+" operations failed",s))},s=[],f=n.length,h=e;if(e.hook.creating.fire===x&&e.hook.updating.fire===x){a=G(s);for(var d=0,p=n.length;d<p;++d)u=t?o.put(n[d],t[d]):o.put(n[d]),u.onerror=a;u.onerror=G(s,c),u.onsuccess=vn(c)}else{var y=t||o.keyPath&&n.map(function(n){return v(n,o.keyPath)}),m=y&&l(y,function(t,e){return null!=t&&[t,n[e]]}),g=y?h.where(":id").anyOf(y.filter(function(n){return null!=n})).modify(function(){this.value=m[this.primKey],m[this.primKey]=null}).catch(N,function(n){s=n.failures}).then(function(){for(var e=[],r=t&&[],i=y.length-1;i>=0;--i){var o=y[i];(null==o||m[o])&&(e.push(n[i]),t&&r.push(o),null!=o&&(m[o]=null))}return e.reverse(),t&&r.reverse(),h.bulkAdd(e,r)}).then(function(n){var t=y[y.length-1];return null!=t?t:n}):h.bulkAdd(n);g.then(c).catch(F,function(n){s=s.concat(n.failures),c()}).catch(i)}},"locked")},bulkAdd:function(n,t){var e=this,r=this.hook.creating.fire;return this._idbstore(rt,function(i,o,u,a){function c(n){0===h.length?i(n):o(new F(e.name+".bulkAdd(): "+h.length+" of "+y+" operations failed",h))}if(!u.keyPath&&!e.schema.primKey.auto&&!t)throw new Wn.InvalidArgument("bulkAdd() with non-inbound keys requires keys array in second argument");if(u.keyPath&&t)throw new Wn.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");if(t&&t.length!==n.length)throw new Wn.InvalidArgument("Arguments objects and keys must have the same length");if(0===n.length)return i();var s,f,l,h=[],y=n.length;if(r!==x){var m,b=u.keyPath;f=G(h,null,!0),l=pn(null),d(function(){for(var e=0,i=n.length;e<i;++e){m={onerror:null,onsuccess:null};var o=t&&t[e],c=n[e],h=t?o:b?v(c,b):void 0,d=r.call(m,h,c,a);null==h&&null!=d&&(b?(c=g(c),p(c,b,d)):o=d),s=null!=o?u.add(c,o):u.add(c),s._hookCtx=m,e<i-1&&(s.onerror=f,m.onsuccess&&(s.onsuccess=l))}},function(n){throw m.onerror&&m.onerror(n),n}),s.onerror=G(h,c,!0),s.onsuccess=pn(c)}else{f=G(h);for(var _=0,w=n.length;_<w;++_)s=t?u.add(n[_],t[_]):u.add(n[_]),s.onerror=f;s.onerror=G(h,c),s.onsuccess=vn(c)}})},add:function(n,t){var e=this.hook.creating.fire;return this._idbstore(rt,function(r,i,o,u){var a={onsuccess:null,onerror:null};if(e!==x){var c=null!=t?t:o.keyPath?v(n,o.keyPath):void 0,s=e.call(a,c,n,u);null==c&&null!=s&&(o.keyPath?p(n,o.keyPath,s):t=s)}try{var f=null!=t?o.add(n,t):o.add(n);f._hookCtx=a,f.onerror=mn(i),f.onsuccess=pn(function(t){var e=o.keyPath;e&&p(n,e,t),r(t)})}catch(n){throw a.onerror&&a.onerror(n),n}})},put:function(n,t){var e=this,r=this.hook.creating.fire,i=this.hook.updating.fire;return r!==x||i!==x?this._trans(rt,function(r,i,o){var u=void 0!==t?t:e.schema.primKey.keyPath&&v(n,e.schema.primKey.keyPath);null==u?e.add(n).then(r,i):(o._lock(),n=g(n),e.where(":id").equals(u).modify(function(){this.value=n}).then(function(r){return 0===r?e.add(n,t):u}).finally(function(){o._unlock()}).then(r,i))}):this._idbstore(rt,function(e,r,i){var o=void 0!==t?i.put(n,t):i.put(n);o.onerror=yn(r),o.onsuccess=function(t){var r=i.keyPath;r&&p(n,r,t.target.result),e(o.result)}})},delete:function(n){return this.hook.deleting.subscribers.length?this.where(":id").equals(n).delete():this._idbstore(rt,function(t,e,r){var i=r.delete(n);i.onerror=yn(e),i.onsuccess=function(){t(i.result)}})},clear:function(){return this.hook.deleting.subscribers.length?this.toCollection().delete():this._idbstore(rt,function(n,t,e){var r=e.clear();r.onerror=yn(t),r.onsuccess=function(){n(r.result)}})},update:function(n,t){if("object"!=typeof t||An(t))throw new Wn.InvalidArgument("Modifications must be an object.");if("object"!=typeof n||An(n))return this.where(":id").equals(n).modify(t);jn(t).forEach(function(e){p(n,e,t[e])});var e=v(n,this.schema.primKey.keyPath);return void 0===e?fn(new Wn.InvalidArgument("Given object does not contain its primary key"),V):this.where(":id").equals(e).modify(t)}}),e(Q.prototype,{_lock:function(){return s(!at.global),++this._reculock,1!==this._reculock||at.global||(at.lockOwnerFor=this),this},_unlock:function(){if(s(!at.global),0===--this._reculock)for(at.global||(at.lockOwnerFor=null);this._blockedFuncs.length>0&&!this._locked();){var n=this._blockedFuncs.shift();try{cn(n[1],n[0])}catch(n){}}return this},_locked:function(){return this._reculock&&at.lockOwnerFor!==this},create:function(n){var t=this;if(s(!this.idbtrans),!n&&!Xn)switch(Zn&&Zn.name){case"DatabaseClosedError":throw new Wn.DatabaseClosed(Zn);case"MissingAPIError":throw new Wn.MissingAPI(Zn.message,Zn);default:throw new Wn.OpenFailed(Zn)}if(!this.active)throw new Wn.TransactionInactive;return s(null===this._completion._state),n=this.idbtrans=n||Xn.transaction(kn(this.storeNames),this.mode),n.onerror=un(function(e){gn(e),t._reject(n.error)}),n.onabort=un(function(n){gn(n),t.active&&t._reject(new Wn.Abort),t.active=!1,t.on("abort").fire(n)}),n.oncomplete=un(function(){t.active=!1,t._resolve()}),this},_promise:function(n,t,e){var r=this,i=r._locked()?new U(function(i,o){r._blockedFuncs.push([function(){r._promise(n,t,e).then(i,o)},at])}):an(function(){var i=r.active?new U(function(i,o){if(n===rt&&r.mode!==rt)throw new Wn.ReadOnly("Transaction is readonly");!r.idbtrans&&n&&r.create(),e&&r._lock(),t(i,o,r)}):fn(new Wn.TransactionInactive);return r.active&&e&&i.finally(function(){
	r._unlock()}),i});return i._lib=!0,i.uncaught(V)},abort:function(){this.active&&this._reject(new Wn.Abort),this.active=!1},tables:{get:K("Transaction.tables",function(){return l(this.storeNames,function(n){return[n,$n[n]]})},"Use db.tables()")},complete:K("Transaction.complete()",function(n){return this.on("complete",n)}),error:K("Transaction.error()",function(n){return this.on("error",n)}),table:K("Transaction.table()",function(n){if(this.storeNames.indexOf(n)===-1)throw new Wn.InvalidTable("Table "+n+" not in transaction");return $n[n]})}),e(Y.prototype,function(){function n(n,t,e){var r=n instanceof Y?new n._ctx.collClass(n):n;return r._ctx.error=e?new e(t):new TypeError(t),r}function t(n){return new n._ctx.collClass(n,function(){return Gn.only("")}).limit(0)}function e(n){return"next"===n?function(n){return n.toUpperCase()}:function(n){return n.toLowerCase()}}function r(n){return"next"===n?function(n){return n.toLowerCase()}:function(n){return n.toUpperCase()}}function i(n,t,e,r,i,o){for(var u=Math.min(n.length,r.length),a=-1,c=0;c<u;++c){var s=t[c];if(s!==r[c])return i(n[c],e[c])<0?n.substr(0,c)+e[c]+e.substr(c+1):i(n[c],r[c])<0?n.substr(0,c)+r[c]+e.substr(c+1):a>=0?n.substr(0,a)+t[a]+e.substr(a+1):null;i(n[c],s)<0&&(a=c)}return u<r.length&&"next"===o?n+e.substr(n.length):u<n.length&&"prev"===o?n.substr(0,e.length):a<0?null:n.substr(0,a)+r[a]+e.substr(a+1)}function o(t,o,u,a){function c(n){s=e(n),f=r(n),l="next"===n?In:Dn;var t=u.map(function(n){return{lower:f(n),upper:s(n)}}).sort(function(n,t){return l(n.lower,t.lower)});h=t.map(function(n){return n.upper}),d=t.map(function(n){return n.lower}),v=n,p="next"===n?"":a}var s,f,l,h,d,v,p,y=u.length;if(!u.every(function(n){return"string"==typeof n}))return n(t,mt);c("next");var m=new t._ctx.collClass(t,function(){return Gn.bound(h[0],d[y-1]+a)});m._ondirectionchange=function(n){c(n)};var g=0;return m._addAlgorithm(function(n,t,e){var r=n.key;if("string"!=typeof r)return!1;var u=f(r);if(o(u,d,g))return!0;for(var a=null,c=g;c<y;++c){var s=i(r,u,h[c],d[c],l,v);null===s&&null===a?g=c+1:(null===a||l(a,s)>0)&&(a=s)}return t(null!==a?function(){n.continue(a+p)}:e),!1}),m}return{between:function(e,r,i,o){i=i!==!1,o=o===!0;try{return sn(e,r)>0||0===sn(e,r)&&(i||o)&&(!i||!o)?t(this):new this._ctx.collClass(this,function(){return Gn.bound(e,r,!i,!o)})}catch(t){return n(this,yt)}},equals:function(n){return new this._ctx.collClass(this,function(){return Gn.only(n)})},above:function(n){return new this._ctx.collClass(this,function(){return Gn.lowerBound(n,!0)})},aboveOrEqual:function(n){return new this._ctx.collClass(this,function(){return Gn.lowerBound(n)})},below:function(n){return new this._ctx.collClass(this,function(){return Gn.upperBound(n,!0)})},belowOrEqual:function(n){return new this._ctx.collClass(this,function(){return Gn.upperBound(n)})},startsWith:function(t){return"string"!=typeof t?n(this,mt):this.between(t,t+vt,!0,!0)},startsWithIgnoreCase:function(n){return""===n?this.startsWith(n):o(this,function(n,t){return 0===n.indexOf(t[0])},[n],vt)},equalsIgnoreCase:function(n){return o(this,function(n,t){return n===t[0]},[n],"")},anyOfIgnoreCase:function(){var n=_.apply(Kn,arguments);return 0===n.length?t(this):o(this,function(n,t){return t.indexOf(n)!==-1},n,"")},startsWithAnyOfIgnoreCase:function(){var n=_.apply(Kn,arguments);return 0===n.length?t(this):o(this,function(n,t){return t.some(function(t){return 0===n.indexOf(t)})},n,vt)},anyOf:function(){var e=_.apply(Kn,arguments),r=Pn;try{e.sort(r)}catch(t){return n(this,yt)}if(0===e.length)return t(this);var i=new this._ctx.collClass(this,function(){return Gn.bound(e[0],e[e.length-1])});i._ondirectionchange=function(n){r="next"===n?Pn:Cn,e.sort(r)};var o=0;return i._addAlgorithm(function(n,t,i){for(var u=n.key;r(u,e[o])>0;)if(++o,o===e.length)return t(i),!1;return 0===r(u,e[o])||(t(function(){n.continue(e[o])}),!1)}),i},notEqual:function(n){return this.inAnyRange([[-(1/0),n],[n,pt]],{includeLowers:!1,includeUppers:!1})},noneOf:function(){var t=_.apply(Kn,arguments);if(0===t.length)return new this._ctx.collClass(this);try{t.sort(Pn)}catch(t){return n(this,yt)}var e=t.reduce(function(n,t){return n?n.concat([[n[n.length-1][1],t]]):[[-(1/0),t]]},null);return e.push([t[t.length-1],pt]),this.inAnyRange(e,{includeLowers:!1,includeUppers:!1})},inAnyRange:function(e,r){function i(n,t){for(var e=0,r=n.length;e<r;++e){var i=n[e];if(sn(t[0],i[1])<0&&sn(t[1],i[0])>0){i[0]=hn(i[0],t[0]),i[1]=On(i[1],t[1]);break}}return e===r&&n.push(t),n}function o(n,t){return l(n[0],t[0])}function u(n){return!d(n)&&!v(n)}var a=this._ctx;if(0===e.length)return t(this);if(!e.every(function(n){return void 0!==n[0]&&void 0!==n[1]&&Pn(n[0],n[1])<=0}))return n(this,"First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower",Wn.InvalidArgument);var c,s=!r||r.includeLowers!==!1,f=r&&r.includeUppers===!0,l=Pn;try{c=e.reduce(i,[]),c.sort(o)}catch(t){return n(this,yt)}var h=0,d=f?function(n){return Pn(n,c[h][1])>0}:function(n){return Pn(n,c[h][1])>=0},v=s?function(n){return Cn(n,c[h][0])>0}:function(n){return Cn(n,c[h][0])>=0},p=d,y=new a.collClass(this,function(){return Gn.bound(c[0][0],c[c.length-1][1],!s,!f)});return y._ondirectionchange=function(n){"next"===n?(p=d,l=Pn):(p=v,l=Cn),c.sort(o)},y._addAlgorithm(function(n,t,e){for(var r=n.key;p(r);)if(++h,h===c.length)return t(e),!1;return!!u(r)||0!==sn(r,c[h][1])&&0!==sn(r,c[h][0])&&(t(function(){l===Pn?n.continue(c[h][0]):n.continue(c[h][1])}),!1)}),y},startsWithAnyOf:function(){var e=_.apply(Kn,arguments);return e.every(function(n){return"string"==typeof n})?0===e.length?t(this):this.inAnyRange(e.map(function(n){return[n,n+vt]})):n(this,"startsWithAnyOf() only works with strings")}}}),e($.prototype,function(){function e(n,t){n.filter=Sn(n.filter,t)}function r(n,t,e){var r=n.replayFilter;n.replayFilter=r?function(){return Sn(r(),t())}:t,n.justLimit=e&&!r}function i(n,t){n.isMatch=Sn(n.isMatch,t)}function o(n,t){if(n.isPrimKey)return t;var e=n.table.schema.idxByName[n.index];if(!e)throw new Wn.Schema("KeyPath "+n.index+" on object store "+t.name+" is not indexed");return t.index(e.name)}function u(n,t){var e=o(n,t);return n.keysOnly&&"openKeyCursor"in e?e.openKeyCursor(n.range||null,n.dir+n.unique):e.openCursor(n.range||null,n.dir+n.unique)}function a(n,e,r,i,o){var a=n.replayFilter?Sn(n.filter,n.replayFilter()):n.filter;n.or?function(){function c(){2===++l&&r()}function s(n,r,o){if(!a||a(r,o,c,i)){var u=r.primaryKey.toString();t(f,u)||(f[u]=!0,e(n,r,o))}}var f={},l=0;n.or._iterate(s,c,i,o),rn(u(n,o),n.algorithm,s,c,i,!n.keysOnly&&n.valueMapper)}():rn(u(n,o),Sn(n.algorithm,a),e,r,i,!n.keysOnly&&n.valueMapper)}function c(n){return n.table.schema.instanceTemplate}return{_read:function(n,t){var e=this._ctx;return e.error?e.table._trans(null,function(n,t){t(e.error)}):e.table._idbstore(et,n).then(t)},_write:function(n){var t=this._ctx;return t.error?t.table._trans(null,function(n,e){e(t.error)}):t.table._idbstore(rt,n,"locked")},_addAlgorithm:function(n){var t=this._ctx;t.algorithm=Sn(t.algorithm,n)},_iterate:function(n,t,e,r){return a(this._ctx,n,t,e,r)},clone:function(t){var e=Object.create(this.constructor.prototype),r=Object.create(this._ctx);return t&&n(r,t),e._ctx=r,e},raw:function(){return this._ctx.valueMapper=null,this},each:function(n){var t=this._ctx;if(Et){var e=c(t),r=t.table.schema.primKey.keyPath,i=v(e,t.index?t.table.schema.idxByName[t.index].keyPath:r),o=v(e,r);n(e,{key:i,primaryKey:o})}return this._read(function(e,r,i){a(t,n,e,r,i)})},count:function(n){if(Et)return U.resolve(0).then(n);var t=this._ctx;if(X(t,!0))return this._read(function(n,e,r){var i=o(t,r),u=t.range?i.count(t.range):i.count();u.onerror=yn(e),u.onsuccess=function(e){n(Math.min(e.target.result,t.limit))}},n);var e=0;return this._read(function(n,r,i){a(t,function(){return++e,!1},function(){n(e)},r,i)},n)},sortBy:function(n,t){function e(n,t){return t?e(n[i[t]],t-1):n[o]}function r(n,t){var r=e(n,u),i=e(t,u);return r<i?-a:r>i?a:0}var i=n.split(".").reverse(),o=i[0],u=i.length-1,a="next"===this._ctx.dir?1:-1;return this.toArray(function(n){return n.sort(r)}).then(t)},toArray:function(n){var t=this._ctx;return this._read(function(n,e,r){if(Et&&n([c(t)]),Rn&&"next"===t.dir&&X(t,!0)&&t.limit>0){var i=t.table.hook.reading.fire,u=o(t,r),s=t.limit<1/0?u.getAll(t.range,t.limit):u.getAll(t.range);s.onerror=yn(e),s.onsuccess=i===k?vn(n):un(vn(function(t){try{n(t.map(i))}catch(n){e(n)}}))}else{var f=[];a(t,function(n){f.push(n)},function(){n(f)},e,r)}},n)},offset:function(n){var t=this._ctx;return n<=0?this:(t.offset+=n,X(t)?r(t,function(){var t=n;return function(n,e){return 0===t||(1===t?(--t,!1):(e(function(){n.advance(t),t=0}),!1))}}):r(t,function(){var t=n;return function(){return--t<0}}),this)},limit:function(n){return this._ctx.limit=Math.min(this._ctx.limit,n),r(this._ctx,function(){var t=n;return function(n,e,r){return--t<=0&&e(r),t>=0}},!0),this},until:function(n,t){var r=this._ctx;return Et&&n(c(r)),e(this._ctx,function(e,r,i){return!n(e.value)||(r(i),t)}),this},first:function(n){return this.limit(1).toArray(function(n){return n[0]}).then(n)},last:function(n){return this.reverse().first(n)},filter:function(n){return Et&&n(c(this._ctx)),e(this._ctx,function(t){return n(t.value)}),i(this._ctx,n),this},and:function(n){return this.filter(n)},or:function(n){return new Y(this._ctx.table,n,this)},reverse:function(){return this._ctx.dir="prev"===this._ctx.dir?"next":"prev",this._ondirectionchange&&this._ondirectionchange(this._ctx.dir),this},desc:function(){return this.reverse()},eachKey:function(n){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each(function(t,e){n(e.key,e)})},eachUniqueKey:function(n){return this._ctx.unique="unique",this.eachKey(n)},eachPrimaryKey:function(n){var t=this._ctx;return t.keysOnly=!t.isMatch,this.each(function(t,e){n(e.primaryKey,e)})},keys:function(n){var t=this._ctx;t.keysOnly=!t.isMatch;var e=[];return this.each(function(n,t){e.push(t.key)}).then(function(){return e}).then(n)},primaryKeys:function(n){var t=this._ctx;if(Rn&&"next"===t.dir&&X(t,!0)&&t.limit>0)return this._read(function(n,e,r){var i=o(t,r),u=t.limit<1/0?i.getAllKeys(t.range,t.limit):i.getAllKeys(t.range);u.onerror=yn(e),u.onsuccess=vn(n)}).then(n);t.keysOnly=!t.isMatch;var e=[];return this.each(function(n,t){e.push(t.primaryKey)}).then(function(){return e}).then(n)},uniqueKeys:function(n){return this._ctx.unique="unique",this.keys(n)},firstKey:function(n){return this.limit(1).keys(function(n){return n[0]}).then(n)},lastKey:function(n){return this.reverse().firstKey(n)},distinct:function(){var n=this._ctx,r=n.index&&n.table.schema.idxByName[n.index];if(!r||!r.multi)return this;var i={};return e(this._ctx,function(n){var e=n.primaryKey.toString(),r=t(i,e);return i[e]=!0,!r}),this}}}),i(Z).from($).extend({modify:function(e){var r=this,i=this._ctx,o=i.table.hook,u=o.updating.fire,a=o.deleting.fire;return Et&&"function"==typeof e&&e.call({value:i.table.schema.instanceTemplate},i.table.schema.instanceTemplate),this._write(function(i,o,c,s){function f(n,e){function r(n){return O.push(n),P.push(i.primKey),h(),!0}C=e.primaryKey;var i={primKey:e.primaryKey,value:n,onsuccess:null,onerror:null};if(y.call(i,n,i)!==!1){var o=!t(i,"value");++E,d(function(){var n=o?e.delete():e.update(i.value);n._hookCtx=i,n.onerror=mn(r),n.onsuccess=pn(function(){++j,h()})},r)}else i.onsuccess&&i.onsuccess(i.value)}function l(n){return n&&(O.push(n),P.push(C)),o(new N("Error modifying one or more objects",O,j,P))}function h(){A&&j+O.length===E&&(O.length>0?l():i(j))}var y;if("function"==typeof e)y=u===x&&a===x?e:function(n){var r=g(n);if(e.call(this,n,this)===!1)return!1;if(t(this,"value")){var i=b(r,this.value),o=u.call(this,i,this.primKey,r,s);o&&(n=this.value,jn(o).forEach(function(t){p(n,t,o[t])}))}else a.call(this,this.primKey,n,s)};else if(u===x){var _=jn(e),w=_.length;y=function(n){for(var t=!1,r=0;r<w;++r){var i=_[r],o=e[i];v(n,i)!==o&&(p(n,i,o),t=!0)}return t}}else{var k=e;e=m(k),y=function(t){var r=!1,i=u.call(this,e,this.primKey,g(t),s);return i&&n(e,i),jn(e).forEach(function(n){var i=e[n];v(t,n)!==i&&(p(t,n,i),r=!0)}),i&&(e=m(k)),r}}var E=0,j=0,A=!1,O=[],P=[],C=null;r.clone().raw()._iterate(f,function(){A=!0,h()},l,c)})},delete:function(){var n=this,t=this._ctx,e=t.range,r=t.table.hook.deleting.fire,i=r!==x;if(!i&&X(t)&&(t.isPrimKey&&!wt||!e))return this._write(function(n,t,r){var i=yn(t),o=e?r.count(e):r.count();o.onerror=i,o.onsuccess=function(){var u=o.result;d(function(){var t=e?r.delete(e):r.clear();t.onerror=i,t.onsuccess=function(){return n(u)}},function(n){return t(n)})}});var o=i?2e3:1e4;return this._write(function(e,u,a,c){var s=0,f=n.clone({keysOnly:!t.isMatch&&!i}).distinct().limit(o).raw(),l=[],h=function(){return f.each(i?function(n,t){l.push([t.primaryKey,t.value])}:function(n,t){l.push(t.primaryKey)}).then(function(){return i?l.sort(function(n,t){return Pn(n[0],t[0])}):l.sort(Pn),J(a,c,l,i,r)}).then(function(){var n=l.length;return s+=n,l=[],n<o?s:h()})};e(h())})}}),n(this,{Collection:$,Table:W,Transaction:Q,Version:j,WhereClause:Y,WriteableCollection:Z,WriteableTable:H}),y(),Vn.forEach(function(n){n(it)})}function hn(n){if("function"==typeof n)return new n;if(An(n))return[hn(n[0])];if(n&&"object"==typeof n){var t={};return dn(t,n),t}return n}function dn(n,t){return jn(t).forEach(function(e){var r=hn(t[e]);n[e]=r}),n}function vn(n){return function(t){n(t.target.result)}}function pn(n){return un(function(t){var e=t.target,r=e.result,i=e._hookCtx,o=i&&i.onsuccess;o&&o(r),n&&n(r)},n)}function yn(n){return function(t){return gn(t),n(t.target.error),!1}}function mn(n){return un(function(t){var e=t.target,r=e.error,i=e._hookCtx,o=i&&i.onerror;return o&&o(r),gn(t),n(r),!1})}function gn(n){n.stopPropagation&&n.stopPropagation(),n.preventDefault&&n.preventDefault()}function bn(n){var t,e=ln.dependencies.localStorage;if(!e)return n([]);try{t=JSON.parse(e.getItem("Dexie.DatabaseNames")||"[]")}catch(n){t=[]}n(t)&&e.setItem("Dexie.DatabaseNames",JSON.stringify(t))}function _n(n){function t(n){return function(t){var e=n(t),r=e.value;return e.done?r:r&&"function"==typeof r.then?r.then(i,o):An(r)?U.all(r).then(i,o):i(r)}}var e=function(t){return n.next(t)},r=function(t){return n.throw(t)},i=t(e),o=t(r);return t(e)()}function wn(n,t,e,r,i,o,u){this.name=n,this.keyPath=t,this.unique=e,this.multi=r,this.auto=i,this.compound=o,this.dotted=u;var a="string"==typeof t?t:t&&"["+[].join.call(t,"+")+"]";this.src=(e?"&":"")+(r?"*":"")+(i?"++":"")+a}function xn(n,t,e,r){this.name=n,this.primKey=t||new wn,this.indexes=e||[new wn],this.instanceTemplate=r,this.mappedClass=null,this.idxByName=l(e,function(n){return[n.name,n]})}function kn(n){return 1===n.length?n[0]:n}function En(n){var t=n&&(n.getDatabaseNames||n.webkitGetDatabaseNames);return t&&t.bind(n)}var jn=Object.keys,An=Array.isArray,On="undefined"!=typeof self?self:"undefined"!=typeof window?window:global,Pn=Object.getPrototypeOf,Cn={}.hasOwnProperty,In=Object.getOwnPropertyDescriptor,Dn=[].slice,Sn="undefined"!=typeof Symbol&&Symbol.iterator,Tn=Sn?function(n){var t;return null!=n&&(t=n[Sn])&&t.apply(n)}:function(){return null},Kn={},Bn=[].concat,Mn="undefined"!=typeof location&&/^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href),Nn=function(){return!0},Fn=!new Error("").stack,qn=["Modify","Bulk","OpenFailed","VersionChange","Schema","Upgrade","InvalidTable","MissingAPI","NoSuchDatabase","InvalidArgument","SubTransaction","Unsupported","Internal","DatabaseClosed","IncompatiblePromise"],Rn=["Unknown","Constraint","Data","TransactionInactive","ReadOnly","Version","NotFound","InvalidState","InvalidAccess","Abort","Timeout","QuotaExceeded","Syntax","DataClone"],Un=qn.concat(Rn),zn={VersionChanged:"Database version changed by other database connection",DatabaseClosed:"Database has been closed",Abort:"Transaction aborted",TransactionInactive:"Transaction has already completed or failed"};i(B).from(Error).extend({stack:{get:function(){return this._stack||(this._stack=this.name+": "+this.message+T(this._e,2))}},toString:function(){return this.name+": "+this.message}}),i(N).from(B),i(F).from(B);var Vn=Un.reduce(function(n,t){return n[t]=t+"Error",n},{}),Ln=B,Wn=Un.reduce(function(n,t){function e(n,e){this._e=S(),this.name=r,n?"string"==typeof n?(this.message=n,this.inner=e||null):"object"==typeof n&&(this.message=n.name+" "+n.message,this.inner=n):(this.message=zn[t]||r,this.inner=null)}var r=t+"Error";return i(e).from(Ln),n[t]=e,n},{});Wn.Syntax=SyntaxError,Wn.Type=TypeError,Wn.Range=RangeError;var Hn=Rn.reduce(function(n,t){return n[t+"Error"]=Wn[t],n},{}),Gn=Un.reduce(function(n,t){return["Syntax","Type","Range"].indexOf(t)===-1&&(n[t+"Error"]=Wn[t]),n},{});Gn.ModifyError=N,Gn.DexieError=B,Gn.BulkError=F;var Jn={},Qn=100,Yn=20,$n=!1,Xn=On.setImmediate?setImmediate.bind(null,Y):On.MutationObserver?function(){var n=document.createElement("div");new MutationObserver(function(){Y(),n=null}).observe(n,{attributes:!0}),n.setAttribute("i","1")}:function(){setTimeout(Y,0)},Zn=function(n,t){ct.push([n,t]),tt&&(Xn(),tt=!1)},nt=!0,tt=!0,et=[],rt=[],it=null,ot=k,ut={global:!0,ref:0,unhandleds:[],onunhandled:sn,finalize:function(){this.unhandleds.forEach(function(n){try{sn(n[0],n[1])}catch(n){}})}},at=ut,ct=[],st=0,ft=[];e(U.prototype,{then:function(n,t){var e=this,r=new U(function(r,i){H(e,new z(n,t,r,i))});return Mn&&(!this._prev||null===this._state)&&Q(r,this),r},_then:function(n,t){H(this,new z(null,null,n,t))},catch:function(n){if(1===arguments.length)return this.then(null,n);var t=arguments[0],e=arguments[1];return"function"==typeof t?this.then(null,function(n){return n instanceof t?e(n):on(n)}):this.then(null,function(n){return n&&n.name===t?e(n):on(n)})},finally:function(n){return this.then(function(t){return n(),t},function(t){return n(),on(t)})},uncaught:function(n){var t=this;return this.onuncatched=C(this.onuncatched,n),this._state===!1&&et.indexOf(this)===-1&&et.some(function(n,e,r){return n._value===t._value&&(r[e]=t)}),this},stack:{get:function(){if(this._stack)return this._stack;try{$n=!0;var n=J(this,[],Yn),t=n.join("\nFrom previous: ");return null!==this._state&&(this._stack=t),t}finally{$n=!1}}}}),e(U,{all:function(){var n=_.apply(null,arguments);return new U(function(t,e){0===n.length&&t([]);var r=n.length;n.forEach(function(i,o){return U.resolve(i).then(function(e){n[o]=e,--r||t(n)},e)})})},resolve:function(n){return n instanceof U?n:n&&"function"==typeof n.then?new U(function(t,e){n.then(t,e)}):new U(Jn,!0,n)},reject:on,race:function(){var n=_.apply(null,arguments);return new U(function(t,e){n.map(function(n){return U.resolve(n).then(t,e)})})},PSD:{get:function(){return at},set:function(n){return at=n}},newPSD:an,usePSD:cn,scheduler:{get:function(){return Zn},set:function(n){Zn=n}},rejectionMapper:{get:function(){return ot},set:function(n){ot=n}},follow:function(n){return new U(function(t,e){return an(function(t,e){var r=at;r.unhandleds=[],r.onunhandled=e,r.finalize=j(function(){var n=this;nn(function(){0===n.unhandleds.length?t():e(n.unhandleds[0])})},r.finalize),n()},t,e)})},on:R(null,{error:[C,rn]})});var lt=U.on.error;lt.subscribe=K("Promise.on('error')",lt.subscribe),lt.unsubscribe=K("Promise.on('error').unsubscribe",lt.unsubscribe);var ht="unhandledrejection";c(function(){Zn=function(n,t){setTimeout(function(){n.apply(null,t)},0)}});var dt="1.5.1",vt=String.fromCharCode(65535),pt=function(){try{return IDBKeyRange.only([[]]),[[]]}catch(n){return vt}}(),yt="Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.",mt="String expected.",gt=[],bt="undefined"!=typeof navigator&&/(MSIE|Trident|Edge)/.test(navigator.userAgent),_t=bt,wt=bt,xt=function(n){return!/(dexie\.js|dexie\.min\.js)/.test(n)};D(Mn,xt);var kt=function(){},Et=!1,jt=On.idbModules&&On.idbModules.shimIndexedDB?On.idbModules:{};return e(ln,Gn),e(ln,{delete:function(n){var t=new ln(n),e=t.delete();return e.onblocked=function(n){return t.on("blocked",n),this},e},exists:function(n){return new ln(n).open().then(function(n){return n.close(),!0}).catch(ln.NoSuchDatabaseError,function(){return!1})},getDatabaseNames:function(n){return new U(function(n,t){var e=En(indexedDB);if(e){var r=e();r.onsuccess=function(t){n(u(t.target.result,0))},r.onerror=yn(t)}else bn(function(t){return n(t),!1})}).then(n)},defineClass:function(t){function e(e){e?n(this,e):Et&&dn(this,t)}return e},applyStructure:dn,ignoreTransaction:function(n){return at.trans?cn(at.transless,n):n()},vip:function(n){return an(function(){return at.letThrough=!0,n()})},async:function(n){return function(){try{var t=_n(n.apply(this,arguments));return t&&"function"==typeof t.then?t:U.resolve(t)}catch(n){return fn(n)}}},spawn:function(n,t,e){try{var r=_n(n.apply(e,t||[]));return r&&"function"==typeof r.then?r:U.resolve(r)}catch(n){return fn(n)}},currentTransaction:{get:function(){return at.trans||null}},Promise:U,debug:{get:function(){return Mn},set:function(n){D(n,"dexie"===n?function(){return!0}:xt)}},derive:i,extend:n,props:e,override:a,Events:R,events:{get:K(function(){return R})},getByKeyPath:v,setByKeyPath:p,delByKeyPath:y,shallowClone:m,deepClone:g,getObjectDiff:b,asap:f,maxKey:pt,addons:[],connections:gt,MultiModifyError:Wn.Modify,errnames:Vn,IndexSpec:wn,TableSchema:xn,dependencies:{indexedDB:jt.shimIndexedDB||On.indexedDB||On.mozIndexedDB||On.webkitIndexedDB||On.msIndexedDB,IDBKeyRange:jt.IDBKeyRange||On.IDBKeyRange||On.webkitIDBKeyRange},semVer:dt,version:dt.split(".").map(function(n){return parseInt(n)}).reduce(function(n,t,e){return n+t/Math.pow(10,2*e)}),fakeAutoComplete:kt,default:ln}),d(function(){ln.dependencies.localStorage=null!=("undefined"!=typeof chrome&&null!==chrome?chrome.storage:void 0)?null:On.localStorage}),U.rejectionMapper=q,c(function(){ln.fakeAutoComplete=kt=c,ln.fake=Et=!0}),ln});
	//# sourceMappingURL=dexie.min.js.map
}());;/**
     *
     * Indexed DB wrapped with dexie
     * Dexie js is used as an api
     *

     example :

        dbNameList: ["DBRegister"], // provides the list of db names.
            dbSchemaMap: {
                "DBRegister": {
                    version: 1, // define version name.
                    name: "DBRegister", // database name .
                    storeList: ["DBRegisterStore"], // a DB can have multiple store, list of objectstores
                    storeIndexes: {
                        "DBRegisterStore": "DBName"
                    },
                    storeSchema: {
                        "DBRegisterStore": {
                            // Table schema for each store
                            // Class definition.
                            DBName: String, // Primary key
                            Schema: Object // Logs object.
                        }
                    },
                    isDBopen: false,
                    connection: undefined // holds the data DB connection instance, from dexie.
                }
            }


        example  =  {
                        "name": "DBRegister",
                        "version": 1,
                        "storeNameList": ["DBRegisterStore"],
                        "storeIndexes": {
                            "DBRegisterStore": "DBName"
                        },
                        "storeSchema": {
                            "DBRegisterStore": {
                                "DBName" : String,
                                "Schema" : Object
                            }
                        },
                        "connection": null,
                        "isDBopen": false
                    }

     **/

(function(root, undefined) {

    console.check = function() {};

    var accessModifier = {
        "mask": {
            enumerable: false,
            writable: true,
            configurable: false
        },
        "protected": {
            enumerable: true,
            writable: false,
            configurable: false
        },
        "private": {
            enumerable: false,
            writable: false,
            configurable: false
        }
    };

    function DBSchemaMap(dbName, v) {
        this.name = dbName; // mandatory
        this.version = v || 1; // mandatory
        this.storeNameList = []; // mandatory, store list name ex: "feedbackStore"
        this.storeIndexes = {}; // mandatory
        this.storeSchema = {}; // Optional, for mapping class object in dexiedb
        this.connection = null; // connection instance holder
        this.objectStoreInUse = ""; // points to current object store in use
        this.isDBopen = false; // mannual flag.
    };

    DBSchemaMap.prototype = {
        setVersion: function(version) {
            if (version && typeof version == 'number') {
                this.version = version;
                return true;
            }
        },
        setStoreIndexes: function(storeName, storeIndexesValue) {
            if (storeName && storeIndexesValue) {
                this.storeIndexes[storeName] = storeIndexesValue;
                this.setStoreList(storeName);
                return true;
            }
        },
        setStoreObject: function(obj) {
            if (typeof obj == 'object') {
                this.storeIndexes = obj;
                return true;
            }
            throw new Error('StoreObject is not valid');
        },
        setStoreList: function(storeName) {
            if (storeName && typeof storeName == 'string' && this.storeNameList.indexOf(storeName) == -1) {
                storeName = storeName.trim();
                this.storeNameList.push(storeName);
                this.setObjectStoreInUse(storeName);
                return true;
            }
        },
        setStoreSchema: function(storeName, schemaObject) {
            if (storeName && this.storeNameList.indexOf(storeName) !== -1 && typeof schemaObject == 'object') {
                this.storeSchema[storeName] = schemaObject;
                return true;
            }
        },
        setObjectStoreInUse: function(storeName) {
            if (storeName && this.storeNameList.indexOf(storeName) !== -1) {
                this.objectStoreInUse = storeName.trim();
                return true;
            }
        },
        getObjectStoreInUse: function() {
            return this.objectStoreInUse || this.storeNameList[0];
        },
        getStoreIndex: function() {
            return this.storeIndexes;
        }
    };

    // Expose public api
    // Bind private scope 
    var localDB = {
        dbNameList: [], // provides the list of db names.
        dbSchemaMap: {},
        queryLimit: 5000,
        createDB: function(dbName, version) {
            dbName = (typeof dbName == 'string') ? dbName.trim() : false;
            version = (typeof version == 'number') ? version : null;
            if (dbName) {
                return new DBSchemaMap(dbName, version);
            }
        },
        register: function(dbObject) {
            if (dbObject instanceof DBSchemaMap && this.dbNameList.indexOf(dbObject.name) == -1) {
                this.dbNameList.push(dbObject.name);
                this.dbSchemaMap[dbObject.name] = dbObject;

                // Storing in internal register.
                //_internalDB.storeInRegisteredDB(dbObject);

                return true;
            } else if (this.dbNameList.indexOf(dbObject.name) !== -1) {
                console.check(' Already registered, db[' + dbObject.name + '] - ', dbObject);
                return true;
            }
            return false;
        },
        /**
         *
         * Open a database by name.
         *
         **/
        getDB: function(name) {
            if (name && localDB['dbSchemaMap'][name.trim()])
                return localDB['dbSchemaMap'][name.trim()];
            /**
             *
             * Each DB has to register to get this
             * Service layer to work.
             *
             **/

            throw new Error('DB not registered:' + name);
        },
        /**
         *
         * check whether db is opened
         * with an connection
         **/
        isDBAvailable: function(name) {
            if (name)
                return localDB.getDB(name).connection ? true : false;
            return false;
        },
        /**
         *
         * Returns an handle for DB
         * for operation to be performed.
         **/

        getDBinstance: function(name) {
            /**
             *
             * If DB is open, return the connection
             * instance for operation, else create/open instance.
             **/
            if (localDB.isDBAvailable(name) && localDB.getDB(name).isDBopen) {
                return localDB.getDB(name).connection
            } else {
                /**
                 * Open the database and give the instance
                 **/
                return localDB.openDBInstance(name);
            }
        },
        openDBInstance: function(name) {

            if (localDB.getDB(name).connection && !localDB.getDB(name).isDBopen) {

                localDB.getDB(name).isDBopen = true;
                localDB.getDB(name).connection.open();
                console.check('openDBInstance, connection to DB opened !!');

                return localDB.getDB(name).connection;
            } else if (localDB.getDB(name).connection && localDB.getDB(name).isDBopen) {
                console.check('openDBInstance, connection to already open !!');
                return localDB.getDB(name).connection;
            }
            return false;

        },
        createDBInstance: function(dbName, storename) {
            /** 
             * Creating an database.
             * i/p ex :
             * name : logsDB ,
             * storename : logStore ,
             * storeindexes : 'timeStamp,logs'
             **/

            if (!dbName || !storename)
                return;


            console.check('createDBInstance, dbName : ' + dbName + ', ObjectStoreName : ' + storename);
            /**
             *
             * Intiating a indexedDB database
             * connection is created.
             **/
            localDB.getDB(dbName).connection = new Dexie(dbName);

            console.check('createDBInstance, StoreIndex for dixie : ', localDB.getDB(dbName).getStoreIndex());
            /**
             *
             * version and object store are initialized.
             *
             **/
            localDB.getDB(dbName)
                .connection
                .version(localDB.getDB(dbName).version)
                .stores(localDB.getDB(dbName).getStoreIndex());

            /**
             * Opening the Database, when db is
             * created successfully.
             **/
            return localDB.openDBInstance(dbName);
        },
        getClearCount: function(recordCount) {
            if (recordCount)
                return Math.trunc(recordCount / localDB.queryLimit) * localDB.queryLimit;
        },
        clearDbByCount: function(dbname, storename) {
            this.getDBinstance(dbname)[storename]
                .count(function successCallback(noOfRecords) {
                    console.check('ObjectStore[' + storename + '], total Record : ' + noOfRecords + ' limit : ' + localDB.queryLimit);
                    localDB.clearStoreByLimit(dbname, storename, localDB.getClearCount(noOfRecords) || localDB.queryLimit);
                })
                .catch(function errorCallback(error) {
                    console.check('Error while counting ObjectStore[' + storename + ']', error);
                });
        },
        startUpClear: function(dbname, storename) {
            this.getDBinstance(dbname)[storename]
                .count(function successCallback(noOfRecords) {
                    console.check(' startup clear ObjectStore[' + storename + '], total Record : ' + noOfRecords + ' limit : ' + localDB.queryLimit);
                    if (localDB.getClearCount(noOfRecords)) {
                        console.check('startup clearing....')
                        localDB.clearStoreByLimit(dbname, storename, localDB.getClearCount(noOfRecords));
                    }
                })
                .catch(function errorCallback(error) {
                    console.check('Error while counting ObjectStore[' + storename + ']', error);
                });
        },
        clearStoreByLimit: function(dbname, storename, count) {
            console.check('Will Delete only : ' + count);
            this.getDBinstance(dbname)[storename]
                .limit(count || localDB.queryLimit) // setting a query retrival limit of 5000
            .delete(function() {
                console.check('Success while clearStoreByLimit ObjectStore[' + storename + ']');
            })
                .catch(function(err) {
                    console.check('Error while clearStoreByLimit ObjectStore[' + storename + ']', err);
                });
        },
        clearStore: function(dbname, storename) {
            this.getDBinstance(dbname)[storename]
                .clear(function successCallback() {
                    console.check('ObjectStore[' + storename + '] is cleared successfully');
                })
                .catch(function errorCallback(error) {
                    console.check('Error while clearing ObjectStore[' + storename + ']', error);
                });
        },
        deleteDB: function(dbname) {
            this.getDBinstance(dbname).delete();
        },
        closeDBInstance: function(name) {
            if (localDB.getDB(name) && localDB.getDB(name).connection) {
                // DB.getDBinstance(name).close();
                localDB.getDB(name).connection.close();
                localDB.getDB(name).isDBopen = false;
                console.check("================= closeDBInstance ================= START");
                console.check(" IS CONNECTION CLOSE :  " + localDB.getDB(name).isDBopen);
                console.check("================= closeDBInstance ================= END");
            }
        }
    }

    for (var prop in localDB) {
        if (localDB.hasOwnProperty(prop)) {
            Object.defineProperty(localDB, prop, accessModifier.protected);
        }
    }

    root['localDB'] = localDB;

}(this));;!function(a){function b(a,b,c){this.name="logs",this.host=a||"FULLClient",this.value=b,this.parentId=c}function c(a){return JSON.stringify(a,function(a,b){return b instanceof Function||"function"==typeof b?b.toString():b instanceof RegExp?"_PxEgEr_"+b:b})}function d(a){this.opt=a||!1,this.registerLogsDB={name:"registerLogsDB",dbName:"logsDB4",storeName:"logStoreV4"},this.getCount={name:"getCount"},this.setLogs={name:"setLogs",args:null,type:null,origin:location.origin,referer:document.referrer,viewName:null},this.clearLogs={name:"clearLogs"},this.getDevEntireLogs={name:"getDevEntireLogs",uniqueID:null,location:location.href,referer:document.referrer,template:{}},this.getLogs={name:"getLogs",uniqueID:null,queryLimit:null,location:location.href,referer:document.referrer,template:{}}}var e,f={getCount:function(){var a=new d("getCount");h.sender(a)},registerDB:function(){var a=new d("registerLogsDB");h.sender(a)},getViewName:function(){return/Electron/.test(navigator.userAgent)?document.title:/Tc-webkit/.test(navigator.userAgent)?!("object"!=typeof self_window||!self_window.name)&&self_window.name:void 0},setLogs:function(a,b){var e=new d("setLogs");e[e.opt].args=c(a),e[e.opt].type=b,e[e.opt].viewName=this.getViewName(),h.sender(e)},isElectron:function(){return!(!/Electron/.test(navigator.userAgent)||/Tc-webkit/.test(navigator.userAgent))},isNodeWebKit:function(){return!/Tc-webkit/.test(navigator.userAgent)},getTemplateInfo:function(){return"undefined"!=typeof userDAO?{engineVersion:process.versions.electron||process.versions["node-webkit"],jsVersion:jsVersion,userDetail:userDAO.getUser()?userDAO.getUser():null,user:process.env.USER,logName:process.env.LOGNAME,tempDir:util.getTempDirectory(),envPath:process.env.PATH,execPath:process.execPath,appUpTime:Math.round(process.uptime()/60),memoryUsage:JSON.stringify(process.memoryUsage())}:{}},getNwTemplate:function(){if(!this.isNodeWebKit())return"";var a=this.getTemplateInfo();return"undefined"!=typeof gui&&"undefined"!=typeof _appConfig?(a.appVersion=gui.App.manifest.version,a.mode=_appConfig.mode,a.config=JSON.stringify(_appConfig),a):void 0},getElectronTemplate:function(){if(!this.isElectron())return null;var a=this.getTemplateInfo();return a.appVersion=FULLClient.manifest.version,a.mode=FULLClient.getMode(),a.config=JSON.stringify(FULLClient.getConfig()),a},clearLogsReq:function(){var a=new d("clearLogs");h.sender(a)},getLogsReq:function(a,b){var c=b?"getLogs":"getDevEntireLogs",e=new d(c);e[e.opt].uniqueID=a,e[e.opt].queryLimit=b||null,e[e.opt].template=this.getElectronTemplate()||this.getNwTemplate(),h.sender(e)}},g={cbMap:{},isCallBackValid:function(a){return!(!a||"function"!=typeof a)},store:function(a,b,c,d){var e=a;this.cbMap[e]={},this.cbMap[e].cb=b,this.cbMap[e].context=c||null,f.getLogsReq(e,d)},handler:function(a){if(a.error)return console.check("Error while Getting Logs : ",error);var c=a.parentId,d=this.cbMap[c];d.cb.call(d.context||null,new b(location.host,a.logData,c)),setTimeout(function(){this.reclaimMemory(c)}.bind(this),0)},reclaimMemory:function(a){delete this.cbMap[a]}},h={countDfd:null,init:function(){"undefined"!=typeof webworker_script&&setTimeout(function(){var a=window.URL.createObjectURL(new Blob(["("+webworker_script.toString()+")()"],{type:"text/javascript"}));e=new Worker(a),f.registerDB(),e.onmessage=function(a){h.receiver(a)}},0)}(),sender:function(a){e&&e.postMessage(a)},receiver:function(a){var a=a.data,b=a&&a[a.opt]?a[a.opt]:null;if(b)switch(b.name){case"captureLogs":g.handler(b);break;case"getLogsCount":this.countDfd.resolve(b.error||b.count);break;default:console.check("Default Sequence in worker response")}}},i={user_name:"SB Devs",user_email:"sithika.abdhul@a-cti.com",loopKey:"agtzfmxvb3BhYmFja3IRCxIETG9vcBiAgICi28uSCQw",loopUrl:"http://test.loopaback.appspot.com//forms/getBlobUploadUrl?type=feedback",getUniqueId:function(){return(new Date).valueOf()},trigger:function(a){console.check("reached err Log with Limit : ",a),g.store(this.getUniqueId(),function(a){this.processLogObj(a)},i,a||1e3)},getLogBlb:function(a){return new Blob([a],{type:"text/html"})},processLogObj:function(a){this.createFormData(this.getLogBlb(a),location.host)},getUploadUrl:function(){return console.check("Getting Blob Url ..."),$.ajax({url:this.loopUrl,type:"POST",crossDomain:!0,data:{time:(new Date).getTime()}}).pipe(function(a){return a.blobUrl?(console.check("getUploadUrl :: blob url successfully Recieved ",a.blobUrl),a.blobUrl):(console.check("getUploadUrl :: doneFilter ::blob url failure :: requeued "),this.getUploadUrl())},function(){console.check("failed request  :",arguments)}.bind(this))},getBlobUrlAndSend:function(a){return this.getUploadUrl().pipe(function(b){return console.check("Sending Feedback ..."),{url:b,FormData:a}}).pipe(this.sendFeedback)},sendFeedback:function(a){return $.ajax({url:a.url,type:"POST",processData:!1,contentType:!1,enctype:"multipart/form-data",data:a.FormData}).pipe(function(a){return"sent"},function(){return console.check("FeedBack Failed to sent for ErroIntimation Mail Sequence :: ",arguments),this.sendFeedback(a)})},createFormData:function(a,b){console.check("Form data creation in Error log Intimation Mail Sequence");var c=new FormData;c.append("card_title","ErrorLog Message !!!"),c.append("feedbackAttachment",a,b),c.append("t",(new Date).getTime()),c.append("tag","suggestion"),c.append("loopKey",this.loopKey),c.append("user_name",this.user_name),c.append("user_email",this.user_email),this.getBlobUrlAndSend(c)}},j={isEmbedded:null,wrap:function(a){return c({action:"logs",source:location.href,logs:a})},isEmbeddedAR:function(){if("boolean"==typeof this.isEmbedded)return this.isEmbedded;var a=/(IndependentRouting.html)/i,b=location.href;return this.isEmbedded=b&&a.test(b)&&window!=window.parent,console.check("is it embedded : ",this.isEmbedded),this.isEmbedded},sendLogsCopy:function(a){try{if(a){var b=this.wrap(a);window.parent.postMessage(b,"*")}}catch(a){console.check("Error log in ARFRAME :",a.message),console.check("Error log in ARFRAME :",a.stack)}}},k={handler:{log:console.log,debug:console.debug,info:console.info,warn:console.warn,error:console.error},isShowLogsInConsole:!0,check:{handler:console.debug,setLogs:function(a){this.handler.apply(console,a)}},enableConsoleView:function(){this.isShowLogsInConsole=!0},disableConsoleView:function(){this.isShowLogsInConsole=!1},getLogs:function(a,b,c,d){g.isCallBackValid(b)?g.store(a,b,c,d||5e3):console.check("Callback is not a function")},clearLogs:function(){f.clearLogsReq()},getDevEntireLogs:function(a,b,c){g.isCallBackValid(b)?g.store(a,b,c,null):console.check("Callback is not a function")},getCount:function(a){g.isCallBackValid(a)?(h.countDfd=$.Deferred(),f.getCount(),$.when(h.countDfd).done(function(b){a(b)})):console.check("Callback is not a function")},setLogs:function(a,b){f.setLogs(b,a),!j.isEmbeddedAR()&&this.isShowLogsInConsole?this.handler[a].apply(console,b):j.sendLogsCopy(b)},extend:function(){for(var a=["log","debug","info","warn","error","check"],b=0;b<a.length;b++){var c=a[b];console[c]=function(a){return function(){"check"==a?k[a].setLogs(arguments):k.setLogs(a,arguments)}}(c)}}()};a.kDebug={errorLogTrigger:i.trigger.bind(i),enableConsoleView:k.enableConsoleView.bind(k),disableConsoleView:k.disableConsoleView.bind(k),clearLogs:k.clearLogs.bind(k),getLogs:k.getLogs.bind(k),getDevEntireLogs:k.getDevEntireLogs.bind(k),getCount:k.getCount.bind(k)}}(this);/* 2015 FULLClient */; var jsVersion = '0.1.0 - May,29 2017 11:17';                   var nwUserAgent = navigator.userAgent + " Tc-webkit";
Array.prototype.filterObjects = function(key, value) {
    return this.filter(function(x) {
        return x[key] === value;
    });
};

Array.prototype.removeItem = function(key, value) {
    if (value == undefined) return;
    for (var i in this) {
        if (this[i][key] == value) {
            this.splice(i, 1);
        }
    }
};

Object.merge = function(o1, o2) {
    if (typeof o1 == "object" && typeof o2 == "object") {
        for (var i in o2) {
            o1[i] = o2[i];
        }
        return o1;
    }
    throw new Error("Arguments are not Objects");
};

(function(R, undefined) {
    $("#v2_Phone_Icon").hide();
    var path = FULLClient.require("path");
    function getConfig() {
        var config;
        try {
            config = require(path.join(process.resourcesPath, "app", "config", "config.json"));
        } catch (e) {
            config = require(path.join(process.cwd(), "config", "config.json"));
        }
        return config;
    }
    function getFilePath() {
        if (getConfig() && getConfig().mode == "code") {
            return process.cwd();
        } else {
            return path.join(path.join(process.resourcesPath, "app"));
        }
    }
    function getManifest() {
        var manifest;
        try {
            manifest = require(path.join(process.resourcesPath, "app", "package.json"));
        } catch (e) {
            manifest = require(path.join(process.cwd(), "package.json"));
        }
        return manifest;
    }
    FULLClient.name = "FULLClientGlobal";
    FULLClient.canQuit = false;
    FULLClient.log = function() {
        var tmp = [];
        for (var i = arguments.length - 1; i >= 0; i--) {
            tmp[i] = arguments[i];
        }
        tmp.splice(0, 0, "[" + this.name + "] : ");
        console.debug.apply(console, tmp);
    };
    FULLClient.quit = function() {};
    FULLClient.isElectron = function() {
        return process.versions["electron"];
    };
    FULLClient.config = getConfig();
    FULLClient.manifest = getManifest();
    FULLClient.getManifest = getManifest;
    FULLClient.getMode = function() {
        return this.config.mode;
    };
    FULLClient.isModeValid = function(mode) {
        if ([ "1.x", "test-1.x", "lily" ].indexOf(mode) !== -1) {
            return true;
        }
    };
    FULLClient.setMode = function(mode) {
        if (this.isModeValid(mode)) {
            this.config.mode = mode;
            util.app.update();
            return true;
        }
        throw new Error("Mode is not compatible : " + mode);
    };
    FULLClient.getAppName = function() {
        if (/^darwin/.test(process.platform)) return path.basename(process.execPath).substring(0, path.basename(process.execPath).lastIndexOf(" ")); else return path.basename(process.execPath).substring(0, process.execPath.lastIndexOf("\\"));
    };
    FULLClient.getConfig = function() {
        return this.config[this.getMode()];
    };
    FULLClient.getFilePath = getFilePath;
    FULLClient.getAppPath = function() {
        return FULLClient.getFilePath().replace(/([\/]Contents.*)/g, "");
    };
    FULLClient.set = function(key, value) {
        this[key] = value;
    };
    FULLClient.getAsarPath = function() {
        var arr = FULLClient.getManifest().main.match(/(.*asar)/g);
        return arr && arr.length ? "../" + arr[0] : "../asar/full.asar";
    };
})(this);

var shell = FULLClient.require("electron").shell;

var path = FULLClient.require("path");

var clipboard = require("electron").clipboard;

var remote = require("electron").remote;

var util = {
    name: "utilities",
    log: function() {
        console.debug.apply(console, arguments);
    }
};

util.hasSpecialCharacters = function(data) {
    var regex = /([^a-zA-Z0-9])/;
    if (typeof data == "string" && data && !regex.test(data)) {
        return false;
    }
    return true;
};

util.getSharedObject = function() {
    return remote.getGlobal("sharedObject");
};

util.isHttps = function(url) {
    return url && url.includes("https://");
};

util.document = {
    shadowRootFocus: function(webView) {
        if (webView && webView.shadowRoot) {
            webView.shadowRoot.querySelector("object").focus();
            this.releaseFocus();
            return true;
        }
    },
    releaseFocus: function() {
        const element = document.createElement("span");
        document.body.appendChild(element);
        const range = document.createRange();
        range.setStart(element, 0);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        selection.removeAllRanges();
        document.body.removeChild(element);
    },
    claimFocus: function() {
        const activeElement = document.activeElement;
        const selection = window.getSelection();
        var selectionStart, selectionEnd, range;
        if (activeElement) {
            selectionStart = activeElement.selectionStart;
            selectionEnd = activeElement.selectionEnd;
        }
        if (selection.rangeCount) range = selection.getRangeAt(0);
        const restoreOriginalSelection = function() {
            if (selectionStart >= 0 && selectionEnd >= 0) {
                activeElement.selectionStart = selectionStart;
                activeElement.selectionEnd = selectionEnd;
            } else if (range) {
                selection.addRange(range);
            }
        };
        requestAnimationFrame(restoreOriginalSelection);
    }
};

util.showBadgeLabel = function(count) {
    if (!count) count = "";
    var text = count.toString().trim(), cDom = document.querySelector("canvas");
    var canvas = cDom ? cDom : document.createElement("canvas");
    canvas.height = 140;
    canvas.width = 140;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.ellipse(70, 70, 70, 70, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    if (text.length > 2) {
        ctx.font = "75px sans-serif";
        ctx.fillText("" + text, 70, 98);
    } else if (text.length > 1) {
        ctx.font = "100px sans-serif";
        ctx.fillText("" + text, 70, 105);
    } else {
        ctx.font = "125px sans-serif";
        ctx.fillText("" + text, 70, 112);
    }
    if (count && parseInt(count)) {
        FULLClient.ipc.send({
            eType: "setOverlayIcon",
            dataURL: canvas.toDataURL()
        });
        return text;
    } else {
        FULLClient.ipc.send({
            eType: "setOverlayIcon",
            count: null
        });
    }
    return false;
};

util.escapeSpaces = function(str) {
    if (str && typeof str == "string") {
        return str.replace(/[ ]/g, "\\ ");
    }
};

util.getTempDirectory = function() {
    return process.env.TMPDIR || process.env.TEMP || process.env.TMP;
};

util.print = {
    appInfo: function() {
        var tmp = {
            mode: FULLClient.getMode(),
            packageJson: FULLClient.getManifest(),
            config: FULLClient.getConfig(),
            asarPath: FULLClient.getAsarPath()
        };
        return tmp;
    }
};

util.scripts = {
    get: function() {
        return document.scripts[document.scripts.length - 1];
    }
};

util.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

util.doNotBubble = function(e) {
    if (e) {
        e.cancelBubble = true;
    }
};

util.mocha = {
    sb: function() {
        FULLClient.ipc.send({
            eType: "open",
            title: "sbMocha"
        });
    },
    v2: function() {
        FULLClient.ipc.send({
            eType: "open",
            title: "v2Mocha"
        });
    }
};

util.analytics = {
    push: function(accountNumber, eventAction, connId, metaInfo) {
        util.publish("/analytics/push", accountNumber, eventAction, connId, metaInfo);
    }
};

util.user = {
    isUserInfoAvailable: function() {
        return userDAO.getUser() ? userDAO.getUser() : false;
    },
    getEmail: function() {
        var _user = this.isUserInfoAvailable();
        if (_user) {
            return _user.email;
        }
    }
};

util.getRemote = function() {
    return FULLClient.require("electron").remote;
};

util.preventEvent = function(e) {
    if (e) {
        e.cancelBubble ? e.cancelBubble = true : false;
        e.preventDefault ? e.preventDefault() : false;
    }
};

util.getDemoLines = function() {
    return [ "8007066511", "8004616705", "8004617310", "8004619489", "8004619578", "8008050816", "8008352647", "8004611592", "8004614207", "8004615165", "8004617420", "8007047593", "8007066572", "8004618540", "8004612449", "8004619537", "8008087316", "8004615398", "8004617493", "8007047614", "8004611676", "8006800906", "8004612458", "8004614214", "8007066573", "8004618597", "8004612596", "8007047591", "8004618658", "8008087751", "8007047635", "8004611683", "8005456981", "8004614237", "8004618497", "8004615406", "8007066604", "8004618659", "8004614259", "8007047636", "8007047643", "8004612413", "8004614359", "8005457026", "8004614250", "8004618512", "8004616486", "8008088543", "8007066609", "8004612435", "8007047641", "8004614784", "8006800797", "8004618523", "8004615502", "8004614354", "8004616508", "8006352757", "8008088612", "8007066615", "8004614425", "8004616495", "8004618524", "8004616539", "8004610376", "8006352780", "8004612497", "8004618678", "8006800904", "8007047684", "8004614706", "8007066617", "8004612597", "8004618552", "8006800910", "8004610485", "8007066618", "8007095720", "8004617250", "8008038489", "8008038490", "8008038514", "8008038516", "8008038529", "8008038532", "8008038533", "8008352608", "8008352718", "8008352909", "8008353022", "8008353430", "8008391943", "8008392012", "8008392169", "8008392197", "8008392252", "8006352720", "8004612183", "8004612417", "8773257467", "8773257468", "8773257480", "8773257488", "8773257495", "8773257496", "8773257497", "8773257498", "8773257499", "8773257763", "8773257785", "8773258200", "8773258711", "8773258981", "8773259051", "8773259052", "8773259055", "8773259056", "8773259060", "8773259063", "8773259064", "8773259065", "8773259070", "8773259073", "8773259742", "8773261118", "8773261123", "8773261142", "8773261919", "8773265164", "8773265367", "8773265371", "8773265607", "8773265961", "8773267997", "8773267998", "8773268102", "8773269238", "8773269321", "8773271035", "8773271271", "8773271601", "8773271602", "8773271606", "8773271607", "8773271750", "8773271981", "8773272107", "8773272242", "8773272246", "8773272285", "8773272483", "8773273082", "8773273292", "8773273937", "8773275427", "8773275687", "8773276074", "8773276078", "8773276079", "8773276080", "8773276081", "8773276085", "8773276270", "8773276637", "8773276966", "8773277162", "8773278001", "8773278408", "8773278409", "8773278693", "8773278842", "8773279172", "8773279682", "8773280314", "8773281194", "8773281286", "8773281357", "8773281416", "8773281886", "8773282321", "8773282399", "8773282475", "8773282826", "8773283207", "8773283285", "8773285258", "8773286354", "8773287453", "8773288576", "8773289801", "8773290433", "8773290598", "8773290615", "8773291275", "8773291279", "8773299571", "8773299576", "8773299969", "8773299970" ];
};

util.getParameterByName = function(name, url) {
    if (name && url) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
};

util.getParameters = function(url) {
    if (!url) return {};
    var keyValue = {};
    if (url.indexOf("?") !== -1) {
        var lUrl = url.split("?");
        lUrl = lUrl[1].split("&");
        for (var i = lUrl.length - 1; i >= 0; i--) {
            var key, value;
            key = lUrl[i].split("=")[0];
            value = lUrl[i].split("=")[1];
            keyValue[key] = value;
            if (/connid/.test(key)) keyValue["connId"] = value;
        }
    }
    return keyValue;
};

util.isFetch = function(params) {
    if (params && (params.fetch || params.isAgentResearch)) {
        return true;
    }
};

util.isEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

util.loadWebSiteInBrowser = function(url) {
    if (util.isUrl(url)) {
        shell.openExternal(url);
    }
};

util.loadWebSiteInNewWindow = function(url) {
    if (util.isUrl(url)) {
        FULLClient.emitter.sendToMain({
            eType: "loadWebsiteInNewWindow",
            url: url
        });
    }
};

util.loadURL = function(url, options, cb) {
    var newurl;
    if (url) {
        url += url.indexOf("?") != -1 ? "" : "?";
        if (url.indexOf("http") == -1 && (newurl = "http://" + url) && this.isUrl(newurl)) {
            url = newurl;
        }
    }
    if (this.isUrl(url)) {
        if (util.window.getName() == namespace.CONTAINER_SB) {
            this.publish("/tab/controller/create", url, options, cb);
        } else {
            var accLoad = new SBcommunication("accountOpt");
            accLoad[accLoad.opt].opt = "load";
            accLoad[accLoad.opt].url = url;
            FULLClient.ipc.sendToSB(accLoad);
        }
        return;
    }
    throw new Error("Invalid URL : " + url);
};

util.publish = function(scheme, context) {
    amplify.publish.apply(amplify, arguments);
};

util.subscribe = function(scheme, context) {
    amplify.subscribe.apply(amplify, arguments);
};

util.unsubscribe = function(scheme, context) {
    amplify.unsubscribe.apply(amplify, arguments);
};

util.debug = {
    _activateDebug: function() {
        util.log("Debugging : ", util);
    },
    _deActivateDebug: function() {},
    on: function() {
        this._activateDebug();
        util.publish("/debug/switch/global/on");
    },
    off: function() {
        util.publish("/debug/switch/global/off");
    }
};

util.getBrowserWindow = function() {
    return this.getRemote().BrowserWindow;
};

util.getAllWindows = function() {
    return this.getBrowserWindow().getAllWindows();
};

util.notification = {
    truncate: function(str, charRestrictionCount) {
        if (str && charRestrictionCount && str.length > charRestrictionCount) {
            return str.substr(0, charRestrictionCount);
        }
        return str;
    },
    isValid: function(nObj) {
        return nObj && nObj.title && nObj.body;
    },
    getTitle: function(nObj) {
        return this.truncate(nObj.title, 45);
    },
    getBody: function(nObj) {
        return this.truncate(nObj.body, 150);
    },
    create: function(nObj) {
        if (this.isValid(nObj)) {
            var n = new ClientListener("notify");
            n[n.opt].title = this.getTitle(nObj);
            n[n.opt].body = this.getBody(nObj);
            util.publish("/notification/create/show", n);
        }
    },
    prevent: function() {
        if (/^win/.test(process.platform)) {
            console.warn("preventing native notifications");
            util.getCurrentWindow().webContents.session.setPermissionRequestHandler(function(webContents, permission, callback) {
                if (permission === "notifications") {
                    return callback(false);
                }
                callback(true);
            });
            return true;
        }
    }
};

util.caching = {
    windows: {
        v2: null,
        sb: null,
        chat: null,
        timer: null,
        reset: function() {
            this.v2 = this.sb = this.chat = this.timer = null;
        },
        getByTitle: function() {
            return this.getTarget(util.window.getName());
        },
        getV2: function() {
            return this.v2 ? this.v2 : this.getTarget(namespace.CONTAINER_V2);
        },
        getSB: function() {
            return this.sb ? this.sb : this.getTarget(namespace.CONTAINER_SB);
        },
        getChat: function() {
            return this.chat ? this.chat : this.getTarget(namespace.CONTAINER_CHAT);
        },
        getTimer: function() {
            return this.timer ? this.timer : this.getTarget(namespace.CONTAINER_TIMER);
        },
        getTarget: function(title) {
            var targetArray = util.getAllWindows();
            for (var i = targetArray.length - 1; i >= 0; i--) {
                if (targetArray[i].getURL().indexOf(title + ".html") !== -1) {
                    switch (title) {
                      case namespace.CONTAINER_V2:
                        {
                            this.v2 = targetArray[i];
                            return this.v2;
                        }

                      case namespace.CONTAINER_CHAT:
                        {
                            this.chat = targetArray[i];
                            return this.chat;
                        }

                      case namespace.CONTAINER_TIMER:
                        {
                            this.timer = targetArray[i];
                            return this.timer;
                        }

                      default:
                        {
                            this.sb = targetArray[i];
                            return this.sb;
                        }
                    }
                }
            }
        }
    }
};

util.getCurrentWindow = function() {
    return this.caching.windows.getByTitle() || this.getRemote().getCurrentWindow();
};

util.clear = function() {
    if (!util.clear.isCleared) {
        util.clear.isCleared = true;
        this.httpCache.clear();
        this.cookies.clear();
        this.storage.clear();
        userDAO.clear();
    }
};

util.persistentStorage = {
    clear: function(cb) {
        var storage = [ "appcache", "cookies", "indexdb", "local storage" ];
        var quota = [ "temporary", "persistent", "syncable" ];
        util.getCurrentWindow().webContents.session.clearStorageData({
            storage: storage,
            quotas: quota
        }, cb || function clearStorage() {
            console.warn("storage clear for following ", storage, quota);
        });
    }
};

util.flush = function() {
    util.getCurrentWindow().webContents.session.flushStorageData();
};

util.webview = {
    post: function(webview, msg, channel) {
        if (webview && msg && typeof msg == "object") {
            webview.send(channel || "webapp-msg", msg);
        }
    }
};

util.getInitObj = function(tabId) {
    return {
        name: "init",
        opt: "userinfo",
        init: {
            tabIndex: tabId,
            contactInfo: JSON.stringify(userDAO.getUserDcmResponse())
        },
        isElectron: true,
        source: "AnyWhereWorks"
    };
};

util.storage = {
    isAvailable: function() {
        return typeof Locstor == "function" ? true : false;
    },
    set: function(k, v) {
        if (k && v && this.isAvailable()) {
            Locstor.set(k, v);
        }
    },
    get: function(k) {
        if (k && this.isAvailable()) {
            return Locstor.get(k);
        }
    },
    clear: function() {
        if (this.isAvailable()) {
            util.log("LOCALSTORAGE is getting cleared !!");
            Locstor.clear();
        }
    }
};

util.window = {
    getName: function() {
        var scripts = util.scripts.get();
        var title;
        switch (path.basename(scripts.src)) {
          case "chatContainer.js":
            {
                title = namespace.CONTAINER_CHAT;
                break;
            }

          case "webContainer.js":
            {
                title = namespace.CONTAINER_SB;
                break;
            }

          case "v2Container.js":
            {
                title = namespace.CONTAINER_V2;
                break;
            }

          default:
            {
                break;
            }
        }
        return title;
    }
};

util.httpCache = {
    remove: function() {
        var remote = util.getRemote();
        var win = remote.getCurrentWindow ? remote.getCurrentWindow() : false;
        if (win) {
            win.webContents.session.clearCache(function() {
                util.log("CacheCleared ", arguments);
            });
        }
    },
    clear: function() {
        util.log("httpCache is getting cleared !!");
        this.remove();
    }
};

util.copy = function(text) {
    clipboard.writeText(text);
};

util.clipboard = {
    read: function() {
        var tc = new Thinclient("readFromClipboard"), option = tc[tc.opt], image = this.readImage();
        if (image.isEmpty()) {
            option.type = "text";
            option.text = this.readText();
        } else {
            option.type = "Image";
            option.image = image;
        }
        return tc;
    },
    readImage: function() {
        var data = clipboard.readImage();
        var imgUrl = !data.isEmpty() ? data.toDataUrl() : "";
        return {
            dataUri: imgUrl,
            size: data.getSize(),
            isEmpty: imgUrl ? false : true
        };
    },
    writeImage: function(path) {
        return clipboard.writeImage(path);
    },
    readText: function() {
        return clipboard.readText();
    },
    writeText: function(text) {
        return text ? clipboard.writeText(text) : false;
    }
};

util.cookies = {
    clear: function() {
        util.log("COOKIES is getting cleared !!");
        this.removeAllCookies();
    },
    _delete: function(cookies, win, dfd) {
        if (typeof cookies == "object" && win) {
            var args = [], cb = function(error) {
                if (error) dfd ? dfd.reject("Error") : false; else dfd.resolve("success");
            }, URL = "http" + (cookies.secure ? "s" : "") + "://" + cookies.domain + cookies.path;
            console.log("url : " + URL + ", cookies name : " + cookies.name);
            args.push(URL);
            args.push(cookies.name);
            args.push(cb);
            win.webContents.session.cookies.remove.apply(null, args);
        }
    },
    get: function(domainName, cb) {
        var remote = util.getRemote(), cookieDomainObj = {}, win = remote.getCurrentWindow ? remote.getCurrentWindow() : false;
        if (domainName) cookieDomainObj["domain"] = domainName;
        win.webContents.session.cookies.get(cookieDomainObj, cb);
    },
    remove: function(domainName) {
        if (domainName) return this.removeAllCookies(domainName);
        throw Error("Domain name is not Valid " + domainName);
    },
    getDFDs: function(length) {
        var tmp = [];
        for (var i = 0; i < length; i++) {
            tmp.push($.Deferred());
        }
        return tmp;
    },
    cookieDeletion: function(arr) {
        $.when.apply($, arr).done(function() {
            console.log("Cleared Cookies successfully ");
            util.publish("/app/cookies/cleared");
        }).fail(function() {
            console.log("failed");
        });
    },
    removeAllCookies: function(domainName) {
        var removeDFD = [], self = this, remote = util.getRemote(), cookieDomainObj = {}, keys, win = remote.getCurrentWindow ? remote.getCurrentWindow() : false;
        if (domainName) cookieDomainObj["domain"] = domainName;
        if (win) {
            win.webContents.session.cookies.get(cookieDomainObj, function(error, cookies) {
                keys = Object.keys(cookies);
                removeDFD = util.cookies.getDFDs(keys.length);
                util.cookies.cookieDeletion(removeDFD);
                for (var i = 0; i < keys.length; i++) {
                    self._delete(cookies[keys[i]], win, removeDFD[i]);
                }
            });
        }
        return removeDFD;
    }
};

util.gmail = {
    session: function() {
        util.cookies.get("google.com", function(error, cookies) {
            if (error) {
                return;
            }
            var len = cookies.filter(function(cookie) {
                return /HID|SSID/.test(cookie.name);
            }).length;
            if (!len) {
                console.warn("Gmail session InActive.");
            } else {
                console.log("Gmail session active.");
            }
        });
    }
};

util.accessMods = {
    mask: {
        enumerable: false,
        writable: true,
        configurable: false
    },
    protected: {
        enumerable: true,
        writable: false,
        configurable: false
    },
    private: {
        enumerable: false,
        writable: false,
        configurable: false
    }
};

util.UI = {
    v2: $("#v2_Phone_Icon")
};

util.v2 = {
    getV2LastReceivedStatus: function() {
        var v2Obj = Locstor.get("v2");
        var status = null;
        if (v2Obj) {
            status = v2Obj.lastReceivedStatus;
        }
        return status;
    },
    isV2LoggedIn: function() {
        var v2 = util.storage.get("v2");
        if (v2 && v2.loggedIn) {
            return true;
        } else return false;
    },
    isV2Available: function() {
        return true;
    },
    getStatusList: function() {
        return [ "Email", "Offline", "ActiveResponse", "Active Response", "AfterCallWorks", "AfterCallWork", "Default", "Busy", "Available", "Repeat", "Chat", "Lunch", "Meeting", "Personal", "Project", "Training", "System", "Break", "Break2", "Break3", "PendingBusy", "CallingCustomer", "FailedConnectAgent", "Video Call", "Book Time", "Synclio Call", "Learning" ];
    },
    passOriginalEvent: function(originalObject) {
        if (!this.isV2Available()) return;
        if (typeof originalObject == "object" && originalObject.name == "v2Communication") {
            FULLClient.ipc.sendToV2(originalObject);
            return true;
        }
    },
    getV2Url: function() {
        return util.config.getV2url().split(/^(.*.com)/)[1] + "/AgentInfoAction/saveAgentInfo.do";
    },
    getAjaxData: function(StatusString, connIdString, isDummyBoolean) {
        return new UserClockStatus(StatusString, connIdString, isDummyBoolean);
    },
    getAjaxDetails: function(StatusString, connIdString, isDummyBoolean) {
        return {
            type: "POST",
            url: this.getV2Url(),
            data: this.getAjaxData(StatusString, connIdString || "N/A", !!isDummyBoolean)
        };
    },
    pushStatusToYoco: function(StatusString, connIdString, isDummyBoolean) {
        if (StatusString, connIdString) {
            return $.ajax(this.getAjaxDetails(StatusString, connIdString, isDummyBoolean));
        }
        throw new Error("Not Valid statusPush params ", {
            StatusString: StatusString,
            connIdString: connIdString,
            isDummyBoolean: isDummyBoolean
        });
    },
    statusPush: function(sObj) {
        if (typeof sObj == "object" && new RegExp(sObj.status, "g").test(this.getStatusList())) {
            if (!this.isV2LoggedIn()) {
                console.log("V2 is not LoggedIn ...,sending status to YOCO  :", sObj.status);
                this.pushStatusToYoco(sObj.status, "N/A", true);
            } else {
                var v2 = new V2Communication("statusPush");
                v2.statusPush = sObj.status;
                v2.isInterruptible = sObj.isInterruptible;
                v2.source = "FULLClient_utilities";
                v2.isForce = true;
                FULLClient.ipc.sendToV2(v2);
                return true;
            }
        }
    },
    dial: function(no) {
        if (!this.isV2Available()) return;
        if (util.isNumber(no)) {
            var dNo = new V2Communication("outbound");
            dNo[dNo.opt].phoneNumber = no;
            dNo.source = "FULLClient_utilities";
            dNo.isForce = true;
            FULLClient.ipc.sendToV2(dNo);
            return true;
        }
    }
};

util.isUrl = function(s) {
    var regexp = /(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return s ? regexp.test(s) : false;
};

util.replaceAll = function(Source, stringToFind, stringToReplace) {
    var temp = Source;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};

util.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

util.crashReporter = {
    port: null,
    _portDFD: null,
    getDFD: function() {
        if (!this._portDFD) {
            this._portDFD = $.Deferred();
        }
        return this._portDFD;
    },
    getPort: function() {
        if (!this._portDFD) {
            this.hook();
        }
        FULLClient.ipc.send({
            eType: "crashReporter",
            source: util.window.getName() == "AnyWhereWorks" ? "Chat" : util.window.getName(),
            opt: "port"
        });
    },
    setPort: function(port) {
        if (util.isNumber(port)) {
            this.port = port;
            this.getDFD().resolve(port);
        }
    },
    hook: function() {
        util.log("Hook Crash collector DFD ");
        this.getDFD().done(function(port) {
            util.log("Dynamic port been Captured in Crash Reporter", port);
            if (port) {
                util.log("Starting crash reporter in Browser Window " + document.title);
                var crashReporter = util.getRemote().crashReporter;
                crashReporter.start({
                    productName: "FULLClient-Electron",
                    companyName: "FULLCreative",
                    autoSubmit: true,
                    submitURL: "http://localhost:" + port + "/crashreporter",
                    extra: {
                        githuburl: "https://github.com/kamesh-a",
                        email: "kamesh.arumugam@a-cti.com",
                        contact: "+919884228421",
                        crashreport: "Please contact us regarding this report "
                    }
                });
            }
        });
    },
    init: function() {
        this.getPort();
    }
};

util.windowEvents = {
    show: function(containerName) {
        if (containerName) {
            FULLClient.ipc.send({
                title: containerName,
                eType: "windowEvents",
                opt: "show"
            });
        }
    },
    focus: function(containerName) {
        if (containerName) {
            FULLClient.ipc.send({
                title: containerName,
                eType: "windowEvents",
                opt: "focus"
            });
        }
    },
    restore: function(containerName) {
        if (containerName) {
            FULLClient.ipc.send({
                title: containerName,
                eType: "windowEvents",
                opt: "restore"
            });
        }
    },
    minimize: function(containerName) {
        if (containerName) {
            FULLClient.ipc.send({
                title: containerName,
                eType: "windowEvents",
                opt: "minimize"
            });
        }
    },
    hide: function(containerName) {
        if (containerName) {
            FULLClient.ipc.send({
                title: containerName,
                eType: "windowEvents",
                opt: "hide"
            });
        }
    }
};

util.config = {
    getSBurl: function() {
        return FULLClient.getConfig().sb5;
    },
    getOldV2url: function() {
        var config = FULLClient.getConfig().v2;
        if (typeof config == "string") return config; else if (typeof config == "object") return config.old;
    },
    getV2url: function() {
        var config = FULLClient.getConfig().v2;
        if (typeof config == "string") return config; else if (typeof config == "object") return config.new;
    }
};

util.mouse = {
    callback: null,
    registerCB: function(fn, context) {
        if (fn && typeof fn == "function") {
            this.callback = fn;
        }
    },
    execute: function(type) {
        if (this.callback) {
            this.callback.call(null, {
                etype: "contextmenu",
                action: "click",
                menu: type
            });
        } else if (type) {
            switch (type) {
              case "cut":
                {
                    util.publish("/tab/controller/mouse/" + type);
                    break;
                }

              case "copy":
                {
                    util.publish("/tab/controller/mouse/" + type);
                    break;
                }

              case "paste":
                {
                    util.publish("/tab/controller/mouse/" + type);
                    break;
                }

              case "replace":
                {
                    util.publish("/tab/controller/mouse/" + type);
                    break;
                }

              default:
                {
                    break;
                }
            }
        }
    }
};

util.app = {
    restart: function() {
        util.flush();
        util.publish("/app/restart/commence");
    },
    update: function() {
        if (util.window.getName() != namespace.CONTAINER_SB) {
            util.publish("/asar/update/commence");
        } else {
            FULLClient.ipc.sendToChat({
                mode: FULLClient.getMode(),
                name: "setMode"
            });
        }
    }
};

util.checkForUpdates = {
    isFromMenu: function() {
        var update = util.storage.get("update");
        if (update && update.checkForUpdates) return true; else return false;
    },
    setFlag: function(bool) {
        util.storage.set("update", {
            checkForUpdates: bool
        });
    }
};

util.zoom = {
    zoomInEnabled: true,
    zoomOutEnabled: true,
    updateUIOnFocus: function(win) {
        var contact = userDAO.getUser();
        if (contact) {
            if (win) {
                if (!win.zoomLevel) {
                    this.enableBothForcibly();
                } else if (win.zoomLevel == namespace.ZOOMOUT_LIMIT) {
                    this.disableInUI(namespace.ZOOMOUT);
                    this.enableZoomIn(true);
                } else if (win.zoomLevel == namespace.ZOOMIN_LIMIT) {
                    this.disableInUI(namespace.ZOOMIN);
                    this.enableZoomOut(true);
                } else {
                    this.enableBothForcibly();
                }
            }
        }
    },
    disableAllOnClearCache: function() {
        this.postToBackground(namespace.DISABLE, namespace.ALL);
        this.setFlag(namespace.ZOOMIN, false);
        this.setFlag(namespace.ZOOMOUT, false);
    },
    enableBoth: function() {
        this.enableZoomIn();
        this.enableZoomOut();
    },
    enableBothForcibly: function() {
        this.postToBackground(namespace.ENABLE, namespace.BOTH);
        this.setFlag(namespace.ZOOMIN, true);
        this.setFlag(namespace.ZOOMOUT, true);
    },
    enableZoomIn: function(isForce) {
        if (isForce || !this.zoomInEnabled) {
            this.postToBackground(namespace.ENABLE, namespace.ZOOMIN);
            this.setFlag(namespace.ZOOMIN, true);
        }
    },
    enableZoomOut: function(isForce) {
        if (isForce || !this.zoomOutEnabled) {
            this.postToBackground(namespace.ENABLE, namespace.ZOOMOUT);
            this.setFlag(namespace.ZOOMOUT, true);
        }
    },
    disableInUI: function(zoomType) {
        this.postToBackground(namespace.DISABLE, zoomType);
        this.setFlag(zoomType, false);
    },
    setFlag: function(zoomType, bool) {
        if (zoomType == namespace.ZOOMIN) {
            this.zoomInEnabled = bool;
        } else {
            this.zoomOutEnabled = bool;
        }
    },
    postToBackground: function(switchType, option) {
        if (switchType && option) {
            var bg = new PostToBackground("menuActions");
            bg[bg.choice].opt = switchType + option;
            FULLClient.emitter.sendToMain(bg[bg.choice]);
        }
    },
    getActiveTab: function() {
        var tab = util.tabs && util.tabs.getActiveTab() || document.querySelector("webview#LoginModule");
        return tab;
    },
    isUnderThreshold: function(zoomLevel) {
        if (zoomLevel >= namespace.ZOOMOUT_LIMIT && zoomLevel <= namespace.ZOOMIN_LIMIT) {
            return true;
        } else {
            return false;
        }
    },
    isAtThreshold: function(zoomLevel) {
        if (zoomLevel == namespace.ZOOMOUT_LIMIT || zoomLevel == namespace.ZOOMIN_LIMIT) {
            return true;
        } else {
            return false;
        }
    },
    setZoomLevel: function(win, zoomLevel, zoomType) {
        if (this.isUnderThreshold(zoomLevel)) {
            win.setZoomLevel(zoomLevel);
            win.zoomLevel = zoomLevel;
            if (this.isAtThreshold(zoomLevel)) {
                this.disableInUI(zoomType);
            }
        }
    },
    zoomIn: function(win) {
        if (win) {
            if (!win.zoomLevel) {
                win.zoomLevel = namespace.ZOOM_ACTUAL_SIZE;
            }
            this.enableZoomOut();
            this.setZoomLevel(win, win.zoomLevel + namespace.ZOOM_FACTOR, namespace.ZOOMIN);
        }
    },
    zoomOut: function(win) {
        if (win) {
            if (!win.zoomLevel) {
                win.zoomLevel = namespace.ZOOM_ACTUAL_SIZE;
            }
            this.enableZoomIn();
            this.setZoomLevel(win, win.zoomLevel - namespace.ZOOM_FACTOR, namespace.ZOOMOUT);
        }
    },
    resetZoom: function(win) {
        if (win) {
            this.enableBoth();
            win.setZoomLevel(namespace.ZOOM_ACTUAL_SIZE);
            win.zoomLevel = namespace.ZOOM_ACTUAL_SIZE;
        }
    }
};

util.subscribe("/util/menu/disableAll/onClearCache", util.zoom, util.zoom.disableAllOnClearCache);

util.engine = {
    getMinorVersion: function() {
        return parseInt(process.versions["electron"].split(".")[1]);
    },
    getMajorVersion: function() {
        return parseInt(process.versions["electron"].split(".")[0]);
    }
};

util.subscribe("/util/window/events/show", util.windowEvents, util.windowEvents.show);

util.subscribe("/util/window/events/hide", util.windowEvents, util.windowEvents.hide);

util.subscribe("/util/window/events/restore", util.windowEvents, util.windowEvents.restore);

util.subscribe("/util/window/events/focus", util.windowEvents, util.windowEvents.focus);

util.subscribe("/util/window/events/minimize", util.windowEvents, util.windowEvents.minimize);

util.init = function() {
    this.crashReporter.init();
    this.notification.prevent();
};

util.subscribe("/util/crashreporter/set/port", util.crashReporter, util.crashReporter.setPort);

util.subscribe("/util/v2/push/original/event", util.v2, util.v2.passOriginalEvent);

util.subscribe("/util/v2/statusPush", util.v2, util.v2.statusPush);

util.subscribe("/util/v2/dialNumber", util.v2, util.v2.dial);

util.subscribe("/util/v2/windows/caching/reset", util.caching.windows, util.caching.windows.reset);

var namespace = {
    APP_ID: /^win/.test(process.platform) && /FULLClient/.test(process.execPath) ? "FULL" : "AnywhereWorks",
    HIDDEN_CONTAINER: "HiddenWindow",
    CONTAINER_CHAT: "AnyWhereWorks",
    CONTAINER_CHAT_ALIAS: "Chat",
    CONTAINER_SB: "FULL",
    CONTAINER_V2: "V2",
    CONTAINER_TIMER: "Timer",
    CONTAINER_V2_SOFTPHONE: "V2SoftPhone",
    ZOOMIN: "ZoomIn",
    ZOOMOUT: "ZoomOut",
    ENABLE: "enable",
    DISABLE: "disable",
    BOTH: "Both",
    ALL: "All",
    ZOOMIN_LIMIT: 9,
    ZOOMOUT_LIMIT: -8,
    ZOOM_ACTUAL_SIZE: 0,
    ZOOM_FACTOR: 1
};

function PostToBackground(operationType) {
    this.name = "PostToBackground";
    this.choice = operationType;
    this.menuActions = {
        name: "menuActions",
        eType: "menuActions",
        opt: null
    };
}

var analytics = {
    TAB_LOAD: "TabLoad",
    TAB_ONLOAD: "TabOnload",
    FETCH: "Fetch",
    TAB_CLOSE: "TabClose",
    TAB_XCLOSE: "TabXClose",
    TAB_XCLOSE_Cancel: "TabXClosePopupCancel",
    V2_CLOSED: "V2Closed",
    RELOAD_V2: "ReloadV2",
    APP_CLEAR_CACHE: "AppClearCache",
    BACKUP_FORM: "BackUpForm",
    APP_ABNORMAL_QUIT: "AppCrashed",
    APP_CLOSED: "AppClosed",
    FULLCREATIVE_PAGE: "FULLCreativeWebsite",
    INCOGNITO_LINK: "IncognitoLinkLoaded",
    TIMERWIDGET_DROPDOWN: "TimerDropDown",
    TIMERWIDGET_TAB_DROPDOWN: "TabTimerDropDown",
    MAX_LOADED_TABS: "MaxLoadedTab",
    CHAT_ICON_CLICKED: "ChatIconClicked",
    REFETCH_RECENT_CLICKED: "RefetchRecentClicked",
    FEEDBACK_CLICKED: "FeedbackClicked",
    SENDING_FEEDBACK_BEGIN: "SendingFeedbackBegin",
    FEEDBACK_SUCCESS: "FeedbackSentSuccessfully",
    FEEDBACK_FAILED: "FeedbackFailed",
    NETWORK_STRENGTH_CLICKED: "NetworkStrengthClicked",
    UPDATE_BTN_CLICKED: "UpdateButtonClicked",
    UPDATE_LATER_CLICKED: "UpdateLaterClicked",
    WIPE_DATA: "AppWipeData"
};

function ImageCapture(frameName, encodedImg, feedbackId) {
    this.name = "image";
    this.frame = frameName;
    this.img = encodedImg;
    this.parentId = feedbackId;
}

function TabLock(text, isInformational) {
    if (typeof text != "string") {
        return {};
    }
    this.name = "tabLock";
    this.url = location.href;
    this.enableLock = true;
    this.dialog = {
        informational: isInformational ? true : false,
        text: text ? text : "Do you wish to force close the tab?"
    };
}

function TimerCommunication(opt, connId) {
    this.name = "TimerCommunication";
    this.setOperation.apply(this, arguments);
    this.setConnectionInfo = {
        name: "setConnectionInfo",
        DAIM: null
    };
    this.updateConnectionInfo = {
        name: "updateConnectionInfo",
        DAIM: null,
        status: null
    };
    this.closeConnection = {
        name: "closeConnection"
    };
}

TimerCommunication.prototype.setOperation = function(opt, connId) {
    if (opt && connId && new RegExp(opt, "ig").test([ "setConnectionInfo", "updateConnectionInfo", "closeConnection" ])) {
        this.opt = opt;
        this.connId = connId;
        return true;
    }
    throw new Error("Specified Operation is not available");
};

function SBcommunication(operationType) {
    if (operationType) operationCycle = operationType; else operationCycle = null;
    this.name = "sbCommunication";
    this.opt = operationCycle;
    this.accountOpt = {
        url: "",
        name: "accountOpt",
        opt: null
    };
    this.resizeContainer = {
        name: "resizeContainer",
        w: null,
        h: null
    };
    this.statusPush = {
        name: "statusPush",
        status: null
    };
}

function V2Communication(operationType) {
    var v2Options = [ "statusPush", "outbound", "getStatus", "reloadJS", "close" ], statusTypes = {
        name: "statusTypes",
        _available: "Available",
        _break: "Break",
        _meeting: "Meeting",
        _systemissues: "System",
        _personaltime: "Personal",
        _offline: "Offline"
    };
    var sbOpt = {
        name: "sbOpt",
        account: "accountOpt",
        status: "statusPush",
        _event: "_event",
        webtab: "webtab"
    };
    if (operationType) operationCycle = operationType; else operationCycle = v2Options;
    this.name = "v2Communication";
    this.opt = operationCycle;
    this.resizeContainer = {
        name: "resizeContainer",
        w: null,
        h: null
    };
    this.visibility = {
        name: "visibility",
        isShow: false
    };
    this.statusPush = statusTypes;
    this.isInterruptible = false;
    this.getStatus = v2Options;
    this.outbound = {
        name: "outbound",
        phoneNumber: ""
    };
    this.queryAndGetTabSource = {
        name: "queryAndGetTabSource",
        paramName: null,
        paramValue: null
    };
    this.close = false;
}

function WidgetTimer(operationType) {
    var operation = operationType ? operationType : false;
    this.name = "widgettimer";
    this.opt = operation;
    this.toWidgetContainer = {
        name: "toWidgetContainer",
        data: {}
    };
    this.toSbwindow = {
        name: "toSbwindow",
        data: {}
    };
    this.setHeightWidth = {
        name: "setHeightWidth",
        data: {}
    };
}

function ClientListener(lOperation) {
    var operation = lOperation ? lOperation : false;
    this.name = "clientlistener";
    this.opt = operation;
    this.count = {
        name: "count",
        target: "chat",
        count: undefined
    };
    this.showUpdatePopup = {
        name: "showUpdatePopup",
        domain: location.origin,
        gitRepoName: null,
        version: null,
        restartBtnName: null,
        cancelBtnName: null
    };
    this.hideUpdatePopup = {
        name: "hideUpdatePopup"
    };
    this.restartBtnClick = {
        name: "restartBtnClick"
    };
    this.cancelBtnClick = {
        name: "cancelBtnClick"
    };
    this.extensions = {
        name: "extensions",
        emittype: undefined,
        message: undefined
    };
    this.accessToken = {
        name: "accessToken",
        token: null
    };
    this.blur = {
        name: "blur",
        domain: location.origin
    };
    this.focus = {
        name: "focus",
        domain: location.origin
    };
    this.badgelabel = {
        name: "badgelabel",
        count: undefined
    };
    this.notify = {
        name: "notify",
        title: undefined,
        body: undefined,
        sec: undefined,
        icon: undefined
    };
    this.show = {
        name: "show",
        target: "chat"
    };
    this.hide = {
        name: "hide",
        target: "chat"
    };
    this.getstate = {
        name: "getstate"
    };
    this.requestattention = {
        name: "requestattention",
        isContinuous: false
    };
    this.restart = {
        name: "restart"
    };
    this.readFromClipboard = {
        name: "readFromClipboard"
    };
    this.loadwebsite = {
        name: "loadwebsite",
        isFullwork: undefined,
        isBrowserLoad: undefined,
        url: undefined
    };
    this.loadaccount = {
        name: "loadaccount",
        accountnumber: undefined
    };
    this.goclock = {
        name: "goclock",
        isStop: undefined,
        daim: 0
    };
    this.enableOnTop = {
        name: "enableOnTop"
    };
    this.disableOnTop = {
        name: "disableOnTop"
    };
    this.storeinbuffer = {
        name: "storeinbuffer",
        value: null
    };
    this.setv2status = {
        name: "setv2status",
        status: null
    };
    this.getv2status = {
        name: "getv2status"
    };
    this.download = {
        name: "download",
        filename: undefined,
        mimetype: undefined,
        url: undefined,
        contentlength: undefined,
        isViewable: false
    };
    this.toGuestPage = {
        name: "toGuestPage",
        guest: {
            source: location.href,
            destination: null
        },
        data: {}
    };
}

function Application(opt) {
    this.name = "Application";
    this.apps = {
        v2: "v2container",
        ibr: "inbuiltrouting",
        ic: "inbuiltchat",
        ch: "chatclient",
        sb: "sbcontainer",
        sp: "statuspanel",
        afk: "awayfromkeyboard",
        ecm: "enablecallcenterchatmode",
        mop: "menuoptions"
    };
    this.opt = opt ? opt : "open";
    this.close = {
        name: "close",
        appname: false
    };
    this.hide = {
        name: "hide",
        appname: false
    };
    this.show = {
        name: "show",
        appname: false
    };
    this.open = {
        name: "open",
        appname: false
    };
    this.quit = {
        name: "quit",
        callee: false
    };
    this.maximize = {
        name: "maximize",
        callee: false
    };
    this.collectfeedback = {
        name: "collectfeedback",
        userFeedback: null,
        isFromChatModule: false
    };
    this.clearCache = {
        name: "clearCache"
    };
    this.checkForUpdates = {
        name: "checkForUpdates"
    };
    this.onFocus = {
        name: "onFocus"
    };
    this.zoomIn = {
        name: "zoomIn"
    };
    this.zoomOut = {
        name: "zoomOut"
    };
    this.resetZoom = {
        name: "resetZoom"
    };
    this.menuoptions = {
        name: "menuoptions",
        opt: undefined,
        showoption: {
            name: "showoption",
            optionname: undefined
        },
        hideoption: {
            name: "hideoption",
            optionname: undefined
        }
    };
}

function LogsAck(id) {
    this.name = "captureLogs";
    this.opt = "captureLogs";
    this["captureLogs"] = {
        uniqueId: id
    };
    this["clearLogs"] = {
        name: "clearLogs"
    };
}

function LogACK(opt) {
    this.name = "LogACK";
    this.opt = opt;
    this["captureLogs"] = {
        name: "captureLogs",
        uniqueId: null
    };
    this["clearLogs"] = {
        name: "clearLogs"
    };
}

function Thinclient(lOpt, eventType, extension) {
    this.name = "thinclient";
    this.opt = lOpt ? lOpt : false;
    this.state = {
        name: "state",
        origin: null,
        visible: false,
        ext: extension ? extension : "chat",
        etype: eventType ? eventType : "click",
        extIsHide: false,
        window: {
            isMinimized: false,
            isBlured: false,
            isFocused: false
        }
    };
    this.menu = {
        name: "menuevent",
        metainfo: {
            menu: null,
            menuitem: null,
            eventType: "click"
        }
    };
    this.v2Status = {
        name: "v2Status",
        status: null
    };
    this.readFromClipboard = {
        name: "readFromClipboard",
        text: null,
        type: null,
        image: {
            dataUri: null,
            size: null,
            isEmpty: true
        }
    };
    this.extensions = {
        name: "extensions",
        type: undefined,
        message: undefined
    };
    this.notify = {
        name: "notify",
        isEvent: false
    };
    this.afk = {
        name: "afk",
        status: "user-away"
    };
    this.tabSourceQueryResult = {
        name: "tabSourceQueryResult",
        result: {
            src: null,
            params: null
        },
        query: {}
    };
    this.networkDetection = {
        name: "networkDetection",
        isUp: true
    };
    this.downloadFileInfo = {
        name: "downloadFileInfo",
        originalObject: null,
        downloadedPercentage: null,
        downloadedMB: null
    };
}

(function(R) {
    var projectMap = {
        default: null,
        answerconnectId: "YH0D44",
        adaptavantId: "91dfed2f-d29f-4302-89ee-341e9364b941"
    };
    var accessModifier = {
        mask: {
            enumerable: false,
            writable: true,
            configurable: false
        },
        protected: {
            enumerable: true,
            writable: false,
            configurable: false
        },
        private: {
            enumerable: false,
            writable: false,
            configurable: false
        }
    };
    var self = userInfoObject = {
        user: {},
        loggedIn: false,
        setloggedIn: function(flag) {
            this.loggedIn = flag;
        },
        isloggedIn: function() {
            return this.loggedIn;
        },
        isUserObjectValid: function(lUserInfo) {
            lUserInfo = lUserInfo || this.user;
            return lUserInfo && lUserInfo["success"] && lUserInfo["contact"] && lUserInfo["contact"].login ? true : false;
        },
        getContactLocalStorage: function() {
            try {
                return Locstor.get("userContactInfo");
            } catch (e) {
                console.error("Exception while getting in LocalStorage, User INFO : " + e.message);
                console.error("Exception while getting in LocalStorage, User INFO : ", e.stack);
                return {};
            }
        },
        setContactLocalStorage: function(user) {
            try {
                return Locstor.set("userContactInfo", user);
            } catch (e) {
                console.error("Exception while setting in LocalStorage, User INFO : " + e.message);
                console.error("Exception while setting in LocalStorage, User INFO : ", e.stack);
                return false;
            }
        },
        setV2Login: function(login) {
            var user = this.getContactLocalStorage();
            if (login && user && user.contact) {
                user.contact.v2Login = login;
                return this.setUser(user);
            }
        },
        getUserDcmResponse: function() {
            try {
                if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage())) return self.user;
            } catch (userInfoException) {
                console.error(userInfoException.message);
                console.error(userInfoException.stack);
            }
            return false;
        },
        getAccessToken: function() {
            return this.user["accessToken"] || this.getContactLocalStorage()["accessToken"];
        },
        setAccessToken: function(token) {
            console.warn("We are trying to set Access token ", token);
            if (token && this.user) {
                this.user["accessToken"] = token;
                this.setUser(this.user);
                return this.user["accessToken"];
            }
        },
        getUser: function() {
            try {
                if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage())) return self.user.contact;
            } catch (userInfoException) {
                console.error(userInfoException.message);
                console.error(userInfoException.stack);
            }
            return false;
        },
        setUser: function(userObject) {
            try {
                if (typeof userObject == "object" && this.isUserObjectValid(userObject)) {
                    self.user = userObject;
                    self.user.contact ? function() {
                        self.user.contact.email = self.user.contact.login;
                        self.user.contact.fullname = self.user.contact.fullName = self.user.contact.firstName + " " + self.user.contact.lastName;
                    }() : false;
                    self.setContactLocalStorage(self.user);
                    return self.getUserDcmResponse();
                } else {
                    return false;
                }
            } catch (userInfoException) {
                console.error("Error While Setting User Object : " + userInfoException.message);
                console.error("Error While Setting User Object : ", userInfoException.stack);
                return false;
            }
        },
        getUserContactSkillSet: function() {
            try {
                if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage())) return self.user.contactSkillSet;
            } catch (userInfoException) {
                console.error(userInfoException.message);
                console.error(userInfoException.stack);
            }
            return false;
        },
        getUserSkillSet: function() {
            try {
                if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage())) return self.user.skillSet;
            } catch (userInfoException) {
                console.error(userInfoException.message);
                console.error(userInfoException.stack);
            }
            return false;
        },
        getSkillByType: function(type, typeValue, queryType) {
            if (!typeValue || !type || !queryType) return false;
            try {
                var tmpSkillObj, skillSetArray = this[queryType]();
                if (skillSetArray && skillSetArray.length) {
                    for (var i = skillSetArray.length - 1; i >= 0; i--) {
                        tmpSkillObj = skillSetArray[i];
                        if (typeof tmpSkillObj == "object" && tmpSkillObj[type] == typeValue.trim()) {
                            return tmpSkillObj;
                        }
                    }
                }
                return false;
            } catch (userInfoException) {
                console.error(userInfoException.message);
                console.error(userInfoException.stack);
            }
        },
        patch: function(skillName) {
            var skill = this.getSkillByType("title", skillName, "getUserSkillSet");
            return skill ? this.getSkillById(skill.skillSetId) : false;
        },
        getSkillByName: function(skillName) {
            var tmp = this.patch(skillName);
            if (skillName == "FullWork") return tmp || this.patch("CEA") || {}; else return tmp;
        },
        getSkillById: function(id) {
            return this.getSkillByType("skillSetID", id, "getUserContactSkillSet");
        },
        getCompanyId: function() {
            if (projectMap["default"]) return projectMap["default"];
            var skillObj = self.getSkillById("98223b25-b41c-4c7e-bb91-569003f4cc45");
            projectMap["default"] = skillObj && skillObj.accountID ? skillObj.accountID : projectMap.answerconnectId;
            return projectMap["default"];
        },
        updateUserInfoViaApi: function(email) {
            return $.ajax({
                url: "https://live-contactsapi.appspot.com/services/signin/v2.0/Account/authenticate_v2?apikey=SEN42",
                type: "POST",
                data: '{"login":"' + (this.getEmail() || email) + '"}',
                contentType: "application/json"
            }).done(function(json) {
                this.setUser(json);
            }.bind(this));
        },
        getEmail: function() {
            var tmp = this.getUser();
            return tmp ? tmp.email : false;
        },
        getV2Login: function() {
            var tmp = this.getUser();
            return tmp ? tmp.v2Login : false;
        },
        clear: function() {
            this.user = null;
        }
    };
    R["userDAO"] = userInfoObject;
    for (var prop in userInfoObject) {
        if (userInfoObject.hasOwnProperty(prop)) {
            if ([ "loggedIn", "user" ].indexOf(prop) != -1) Object.defineProperty(userInfoObject, prop, accessModifier.mask); else Object.defineProperty(userInfoObject, prop, accessModifier.protected);
        }
    }
    Object.defineProperty(R, "userDAO", accessModifier.protected);
    util.subscribe("/user/info/update/via/api", userInfoObject, userInfoObject.updateUserInfoViaApi);
})(this);

(function(util) {
    var fullAuth = {
        isValid: function(obj) {
            if (obj && typeof obj == "object" && obj.contact) return true;
            throw new Error("Object is not valid user contact");
        },
        getAccessToken: function(exchangeCode) {
            if (exchangeCode) {
                return $.ajax({
                    type: "POST",
                    url: FULLClient.getConfig().auth.tokenUrl,
                    data: {
                        code: exchangeCode.replace(/#/, ""),
                        client_id: FULLClient.getConfig().auth.clientId,
                        client_secret: FULLClient.getConfig().auth.secret,
                        grant_type: "authorization_code",
                        redirect_uri: FULLClient.getConfig().auth.redirect
                    }
                });
            }
            throw new Error("Invalid exchange code key" + exchangeCode);
        },
        getContact: function(accessToken) {
            if (accessToken) {
                return $.ajax({
                    type: "GET",
                    url: FULLClient.getConfig().dcmApi.contact,
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });
            }
            throw new Error("Invalid accessToken " + accessToken);
        },
        getContactSkillSetAndSkillSet: function(contact) {
            if (contact && contact.id && contact.accountID) {
                return $.ajax({
                    type: "GET",
                    url: FULLClient.getConfig().dcmApi.skillSets + "?apikey=" + contact.accountID + "&contactID=" + contact.id
                });
            }
            throw new Error("Invalid accessToken " + contact);
        },
        aggregate: function(exchangeCode, callback) {
            var user = {};
            console.log("Access Code ", exchangeCode, callback);
            return $.when(this.getAccessToken(exchangeCode)).then(function(tokenObj) {
                console.log("stage 1 : ", tokenObj);
                user.accessToken = tokenObj.access_token;
                return this.getContact(tokenObj.access_token);
            }.bind(this)).then(function(contactResp) {
                user.contact = contactResp.data;
                console.log("stage 2 : ", user);
                return this.getContactSkillSetAndSkillSet(user.contact);
            }.bind(this)).then(function(res) {
                var resp;
                user.contactSkillSet = res.contactSkillSet;
                user.skillSet = res.skillSet;
                user.success = true;
                resp = fullAuth.isValid(user) ? user : {
                    success: false
                };
                console.log("stage 3 : ", resp, callback);
                if (callback && typeof callback == "function") {
                    callback.call(null, resp);
                }
                return resp;
            }).fail(function(r) {
                console.error("ERROR : ", r);
                callback.call(null, r);
            });
        }
    };
    util.subscribe("/services/fullauth/get/user", fullAuth, fullAuth.aggregate);
    module.exports = fullAuth;
})(util);

(function(root, util, undefined) {
    var urlParser = FULLClient.require("url");
    function getExeScript(srcInWebview) {
        var url = "images.sb.a-cti.com/chrome/js/webviewAPI.js";
        var _scriptString = 'var _webivewSupport=document.createElement("script");';
        if (srcInWebview && /^https/.test(srcInWebview)) _scriptString += '_webivewSupport.src="https://commondatastorage.googleapis.com/' + url + '";'; else _scriptString += '_webivewSupport.src="http://' + url + '";';
        _scriptString += '_webivewSupport.type="text/javascript";';
        _scriptString += "document.body.appendChild(_webivewSupport);";
        return _scriptString;
    }
    root["getExecuteScript"] = getExeScript;
    var isNWCompatible = function() {
        return true;
    };
    function WebviewProxy(id, sourceUrl, partitionName) {
        this._createWebviewDom(id, sourceUrl, partitionName);
    }
    WebviewProxy.prototype = {
        constructor: WebviewProxy,
        _createWebviewDom: function(id, sourceUrl, partitionName) {
            if (this.isNWCompatible()) {
                var webPage = document.createElement("webview");
                webPage.src = sourceUrl;
                webPage.id = id;
                this.id = id.replace(/[a-z]*/, "");
                this.callbackRegister = {};
                this._webview = webPage;
                this.setWidth("100%");
                this.setHeight("100%");
                this.setUserAgent();
                this.setPreload("../assets/js/preload/preloadWebview.js");
                this.setNewWinPolicy(webviewController.checkBrowserCompatible);
                this.setMediaControl();
                this.setLoadRedirect();
                this.setDisableWebSecurity();
                this.setMessageListener();
                this.setCrashListeners();
                this.setLoadAborted(webviewController.loadAbort);
                this.setContentloaded(this.setContextMenu.bind(this));
                this.setFindInPage();
            }
        },
        setCB: function(eventName, cb) {
            if (eventName) {
                return this.callbackRegister[eventName] = cb;
            }
        },
        getCB: function(eventName) {
            if (eventName) {
                return this.callbackRegister[eventName];
            }
        },
        setCB: function(eventName, cb) {
            if (eventName) {
                return this.callbackRegister[eventName] = cb;
            }
        },
        getCB: function(eventName) {
            if (eventName) {
                return this.callbackRegister[eventName];
            }
        },
        isNWCompatible: function() {
            return true;
        },
        getView: function() {
            return this._webview;
        },
        setHidden: function() {
            this.getView().removeAttribute("style");
            this.getView().setAttribute("class", "webview_hide");
        },
        setContextMenu: function() {
            if (this.isNWCompatible() && !this.getView().dataset.contextMenuEnabled) {
                this.getView().getWebContents().on("context-menu", function(event, param) {
                    util.publish("/context/menu/event/", event, param);
                });
                this.getView().dataset.contextMenuEnabled = true;
            }
        },
        setHeight: function(width) {
            if (this.isNWCompatible()) {
                this.getView().style.width = width;
            }
        },
        setWidth: function(height) {
            if (this.isNWCompatible()) {
                this.getView().style.height = height;
            }
        },
        setUserAgent: function() {
            if (this.isNWCompatible()) {
                this.getView().setAttribute("useragent", nwUserAgent);
            }
        },
        setDisableWebSecurity: function() {
            if (this.isNWCompatible()) {
                this.getView().setAttribute("disablewebsecurity", true);
            }
        },
        setMediaControl: function() {
            if (this.isNWCompatible()) {
                this.getView().addEventListener("permissionrequest", function(e) {
                    if (e.permission) {
                        e.request.allow();
                    }
                });
            }
        },
        setLoadRedirect: function() {
            if (this.isNWCompatible()) {
                var self = this;
                this.getView().addEventListener("did-get-redirect-request", function(evt) {
                    if (evt.isMainFrame) {
                        var oldUrlObject = urlParser.parse(evt.oldUrl || evt.oldURL);
                        var newUrlObject = urlParser.parse(evt.newUrl || evt.newURL);
                        console.debug("[" + self.id + "] [mainframe = " + evt.isMainFrame + "] LoadRedirect : oldUrl: " + oldUrlObject.host + ", newUrl : " + newUrlObject.host);
                        util.publish("webview/service/domain/redirect", self.id, newUrlObject);
                    }
                });
            }
        },
        setPreload: function(preloadScriptPath) {
            if (this.isNWCompatible()) {
                this.getView().setAttribute("preload", preloadScriptPath || "../asar/full.asar/webPreload.min.js");
            }
        },
        setLoadstart: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("did-start-loading", cb);
                this.setCB("did-start-loading", cb);
            }
        },
        setLoadstop: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("did-stop-loading", cb);
                this.setCB("did-stop-loading", cb);
            }
        },
        setContentloaded: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("did-finish-load", cb);
                this.setCB("did-finish-load", cb);
            }
        },
        setFrameFinishLoad: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("did-frame-finish-load", cb);
                this.setCB("did-frame-finish-load", cb);
            }
        },
        setDomReady: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("dom-ready", cb);
                this.setCB("dom-ready", cb);
            }
        },
        setDialogController: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("dialog", cb);
                this.setCB("dialog", cb);
            }
        },
        setNewWinPolicy: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("new-window", cb);
                this.setCB("new-window", cb);
            }
        },
        setLoadAborted: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("did-fail-load", cb);
                this.setCB("did-fail-load", cb);
            }
        },
        setResponsive: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener("responsive", cb);
                this.setCB("responsive", cb);
            }
        },
        reload: function() {
            var src = this.getView().src;
            var view = new WebviewProxy(this.getView().id, src, this.partition);
            view.setContentloaded(this.getCB("did-finish-load"));
            var parent = $(this.getView()).parent();
            parent.children().remove("webview");
            parent.append(view.getView());
        },
        restore: function() {
            if (/&currentTabIndex=/.test(this.getView().src) && !/&isCrashed/.test(this.getView().src)) {
                this.getView().src += "&isCrashed=true";
                console.log("Appending crash param : " + this.getView().src);
            } else this.reload();
        },
        setCrashListeners: function() {
            function listener(e) {
                console.error("Crashed : ", e);
                util.preventEvent(e);
                this.restore();
            }
            this._webview.addEventListener("crashed", listener.bind(this));
            this._webview.addEventListener("gpu-crashed", listener.bind(this));
            this._webview.addEventListener("plugin-crashed", listener.bind(this));
            this._webview.addEventListener("destroyed", listener.bind(this));
        },
        setUnresponsive: function(cb) {
            if (cb && this.isNWCompatible()) {
                this.getView().addEventListener("crashed", cb);
            }
        },
        setMessageListener: function() {
            console.log("view : ", this.getView());
            this.getView().addEventListener("ipc-message", function(event) {
                console.log("Message from Webview ...", event.channel, ":", event.args[0]);
                util.publish("/msgModule/handler/", event.args[0], event.channel);
            });
        },
        setNodeIntegration: function() {
            this.getView().setAttribute("nodeintegration", true);
        },
        setFindInPage: function() {
            this.getView().addEventListener("found-in-page", function(e) {
                util.publish("/webview/found/in/page/", e);
            });
        }
    };
    root["WebviewProxy"] = WebviewProxy;
    root["webviewController"] = webviewController;
    var webviewController = {
        counter: 1,
        backUpDomain: [ "jersey", "setmore" ],
        urlFetchedDomain: [],
        errList: [ "ERR_ABORTED", "ERR_CONNECTION_CLOSED", "ERR_BLOCKED_BY_CLIENT", "ERR_ADDRESS_UNREACHABLE", "ERR_EMPTY_RESPONSE", "ERR_FILE_NOT_FOUND", "ERR_UNKNOWN_URL_SCHEME" ],
        loadAbort: function(event, errorCode, errorDescription, validatedURL, isMainFrame) {
            var e = event;
            console.check("did failed to load : ", event, errorCode, errorDescription, validatedURL, isMainFrame);
            console.debug("\n LoadAbort url: " + e.url + "\n LoadAbort toplevel : " + e.isTopLevel + "\n LoadAbort code: " + e.code + "\n LoadAbort reason: " + e.reason);
            if (e.isTopLevel && !e.target.getAttribute("isReloaded") && webviewController.errList.indexOf(e.reason) == -1) {
                console.warn("Reloading the Webview !!! ");
                e.target.stop ? e.target.stop() : false;
                e.target.reload ? e.target.reload() : false;
                e.target.setAttribute("isReloaded", true);
            }
        },
        getDomainsLoadableInBrowser: function() {
            if (this.urlFetchedDomain.length) return this.urlFetchedDomain; else return [];
        },
        initialCallForSpreadSheetUrl: function() {
            this.getUrlFromSpreadSheet(this.addUrls);
        },
        getUrlFromSpreadSheet: function(cb) {
            $.post("https://script.google.com/macros/s/AKfycbxg0brhayGhgksKPdn9_Ku379GehCIRiMDiNhYkA3jrHftF1RU/exec").done(function(response) {
                if (response) {
                    cb.call(this, response);
                }
            }.bind(this)).fail(function(err) {
                console.error("Error in getting Urls from spreadsheet :", err);
            });
        },
        addUrls: function(jsobj) {
            util.publish("/open/browse/private/whitelist", jsobj);
        },
        checkBrowserCompatible: function(e) {
            e.preventDefault();
            e.cancelBubble = true;
            util.publish("/open/browse/private/window", e);
        },
        openNewWindow: function(e) {
            e.cancelBubble = true;
            if (e && e.url) {
                console.log("NewWindowEvent, opening : " + e.url);
                if (e.target.src.indexOf(FULLClient.getConfig().chat) != -1) {
                    util.loadWebSiteInBrowser(e.url);
                    return true;
                }
                util.loadWebSiteInNewWindow(e.url);
                return true;
            }
        },
        loadStart: function(e) {
            root["test"][webviewController.counter++] = e;
        }
    };
    util.subscribe("/webview/controller/app/onload", webviewController, webviewController.initialCallForSpreadSheetUrl);
})(this, util);

console.log("Chat container...", nwUserAgent);

(function(R, util) {
    var clientlistener = {
        handler: function(msg) {
            console.log("handler :", msg);
            var val = msg.opt.trim();
            switch (val) {
              case "accessToken":
                {
                    console.log("Setting Access Token ", msg[msg.opt].token);
                    userDAO.setAccessToken(msg[msg.opt].token);
                    break;
                }

              case "showUpdatePopup":
                {
                    util.publish("updateUI/guestPage/msgHandler", msg[msg.opt]);
                    break;
                }

              case "readFromClipboard":
                {
                    chat.postToWebview(util.clipboard.read());
                    break;
                }

              case "getv2status":
                {
                    var toChat = new Thinclient("v2Status");
                    toChat[toChat.opt].status = util.v2.getV2LastReceivedStatus();
                    chat.postToWebview(toChat);
                    break;
                }

              case "showsbcontainer":
                {
                    util.publish("/util/window/events/show", namespace.CONTAINER_SB);
                    break;
                }

              case "toGuestPage":
                {
                    chat.postToWebview(msg);
                    break;
                }

              case "setv2status":
                {
                    FULLClient.emitter.sendToSB(msg);
                    break;
                }

              case "feedback":
                {
                    var feedbackSend = new Application("collectfeedback");
                    console.log("Feedback text:", msg[msg.opt].text);
                    feedbackSend[feedbackSend.opt].userFeedback = msg[msg.opt].text;
                    feedbackSend[feedbackSend.opt].isFromChatModule = true;
                    feedbackSend[feedbackSend.opt].token = msg[msg.opt].token;
                    FULLClient.emitter.sendToSB(feedbackSend);
                    break;
                }

              case "notify":
                {
                    util.publish("/notification/create/show", msg);
                    break;
                }

              case "clearCache":
                {
                    console.log("ClearCache: user doing sign-out in chat window.");
                    FULLClient.emitter.sendToSB({
                        name: "analytics",
                        accountNumber: null,
                        eventAction: analytics.APP_CLEAR_CACHE,
                        connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                        metaInfo: "Clearing Cache for App from chatwindow"
                    });
                    util.clear();
                    break;
                }

              case "show":
                {
                    chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "show");
                    break;
                }

              case "hide":
                {
                    chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "hide");
                    break;
                }

              case "restart":
                {
                    chat.reloadchat();
                    break;
                }

              case "quit":
                {
                    var commObj = {
                        name: "appQuit",
                        sender: namespace.CONTAINER_CHAT
                    };
                    FULLClient.emitter.sendToSB(commObj);
                    break;
                }

              case "getstate":
                {
                    chat.send_state();
                    break;
                }

              case "download":
                {
                    util.publish("/file/download/Start/", msg[msg.opt]);
                    break;
                }

              case "badgelabel":
              case "count":
                {
                    if (/^win32/.test(process.platform)) msg[msg.opt].count ? util.showBadgeLabel(msg[msg.opt].count.toString()) : util.showBadgeLabel(""); else chat.postToBackground(namespace.CONTAINER_CHAT, "setBadge", "", msg[msg.opt].count);
                    break;
                }

              case "requestattention":
                {
                    if (/^darwin/.test(process.platform)) {
                        chat.postToBackground(namespace.CONTAINER_CHAT, "bounce", msg[msg.opt].isContinuous);
                    } else {
                        chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "bounce");
                    }
                    break;
                }

              case "enableOnTop":
                {
                    chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "enableontop");
                    break;
                }

              case "restore":
                {
                    chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "restore");
                    break;
                }

              case "maximize":
                {
                    chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "maximize");
                    break;
                }

              case "disableOnTop":
                {
                    chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "disableontop");
                    break;
                }

              case "loadwebsite":
                {
                    FULLClient.emitter.sendToMediator(msg);
                    break;
                }

              default:
                {
                    console.warn("Unknown routine in channel listener ", msg);
                    break;
                }
            }
        }
    };
    var application = {
        handler: function(msg) {
            if (msg.opt) {
                switch (msg.opt) {
                  case "onFocus":
                    {
                        util.zoom.updateUIOnFocus(chat.getView());
                        break;
                    }

                  case "zoomIn":
                    {
                        util.zoom.zoomIn(chat.getView());
                        break;
                    }

                  case "resetZoom":
                    {
                        util.zoom.resetZoom(chat.getView());
                        break;
                    }

                  case "zoomOut":
                    {
                        util.zoom.zoomOut(chat.getView());
                        break;
                    }

                  case "checkForUpdates":
                    {
                        console.log("checkForUpdates");
                        util.publish("guestPage/checkUpdate/onMenuClick");
                        util.storage.set("update", {
                            checkForUpdates: true
                        });
                        break;
                    }

                  case "default":
                    {
                        console.log("Default capture in Application event", msg);
                        break;
                    }
                }
            }
        }
    };
    var msgModule = {
        name: "MessageModule",
        log: function() {
            util.log.apply(this, arguments);
        },
        proxy: function() {
            msgModule.handler.apply(msgModule, arguments);
        },
        handler: function(e) {
            var msg = arguments[0].name ? arguments[0] : arguments[1];
            var name = msg.name ? msg.name.toLowerCase() : false;
            console.log("Message Recieved asa: ", msg);
            switch (name) {
              case "fulloauth":
                {
                    this.log("Recieved message on fulloauth block : ", msg);
                    util.publish("/app/loginModule/msg/recieved", msg);
                    break;
                }

              case "oauth":
                {
                    this.log("NEW oAuth implementation ", msg);
                    util.publish("/services/fullauth/get/user", msg.code, function cb(user) {
                        console.log("new oAuth callback called ", user);
                        util.publish("/app/loginModule/msg/recieved", {
                            contact: user
                        });
                    });
                    break;
                }

              case "wipedata":
                {
                    util.publish("/app/user/data/wipe");
                    break;
                }

              case "relogin":
                {
                    console.log("No Operation");
                    break;
                }

              case "crashreporter":
                {
                    util.publish("/util/crashreporter/set/port", msg.port);
                    break;
                }

              case "capturelogs":
                {
                    chat.postToWebview(msg);
                    break;
                }

              case "application":
                {
                    application.handler(msg);
                    break;
                }

              case "thinclient":
                {
                    chat.postToWebview(msg);
                    break;
                }

              case "windowstate":
                {
                    chat.postToWebview(msg);
                    break;
                }

              case "appquit":
                {
                    $("webview").remove();
                    window.removeEventListener("beforeunload", chat.onbeforeunload);
                    chat.isQuitable = true;
                    window.close();
                    break;
                }

              case "clientlistener":
                {
                    clientlistener.handler(msg);
                    break;
                }

              case "setmode":
                {
                    FULLClient.setMode(msg.mode);
                    break;
                }

              default:
                {
                    msgModule.log("Default Sequence Capture this : ", msg);
                    break;
                }
            }
        }
    };
    var ipc = FULLClient.require("electron").ipcRenderer;
    ipc.on("msg-to-Chat", msgModule.handler.bind(msgModule));
    util.subscribe("/msgModule/handler/", msgModule, msgModule.handler);
})(this, util);

var chat = {
    toDropEvent: false,
    isQuitable: false,
    outerDiv: null,
    appurl: null,
    onloadDFD: $.Deferred(),
    initObj: {
        name: "init",
        opt: "chat",
        dcm: null
    },
    name: "chatMsgHandler",
    setZoomLevelLimits: function() {
        util.getCurrentWindow().webContents.setZoomLevelLimits(1, 1);
    },
    onload: function() {
        chat.setZoomLevelLimits();
        chat.onloadDFD.resolve("Webview onload success");
        chat.postToWebview(chat.initObj);
        chat.registerMouse();
        jQuery(window).bind("resize", jQuery.debounce(20, false, function(event) {
            console.log("On resize");
            chat.getOuterDiv().height(window.innerHeight);
        }));
        window.onfocus = function() {
            var webView = chat.getView();
            if (webView) {
                util.document.shadowRootFocus(webView);
                util.zoom.updateUIOnFocus(webView);
            }
        };
    },
    log: function() {
        util.log.apply(this, arguments);
    },
    _canQuit: function(flag) {
        this.isQuitable = flag;
    },
    getView: function() {
        return document.querySelector("webview#chat_webview");
    },
    send_state: function(opt) {
        var commObj = {
            eType: "getState",
            opt: namespace.CONTAINER_CHAT
        };
        FULLClient.ipc.send(commObj);
    },
    getOuterDiv: function() {
        if (!this.outerDiv) this.outerDiv = $("#chatContainer");
        return this.outerDiv;
    },
    getUrl: function() {
        if (this.appurl) return this.appurl; else {
            console.log("getting url for chat  ? ", FULLClient.getConfig());
            this.appurl = FULLClient.getConfig().chat + userDAO.getUser().email + "&uniquepin=" + userDAO.getCompanyId() + "&isSingleWindow=false";
            return this.appurl;
        }
    },
    mouseMenu: function(evt) {
        if (evt && evt.menu) {
            this.getView()[evt.menu]();
        }
    },
    reloadchat: function() {
        chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "show");
        var chatView = this.getView();
        if (chatView) chatView.reload();
    },
    registerMouse: function() {
        util.mouse.registerCB(this.mouseMenu, this);
    },
    onbeforeunload: function(e) {
        console.log("onbefore unload is getting trigger ");
        function onQuit() {
            if (/^win/.test(process.platform)) {
                console.log("minimizing window...");
                chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "minimize");
            } else {
                console.log("Hiding window...");
                chat.postToBackground(namespace.CONTAINER_CHAT, "windowEvents", "hide");
            }
        }
        if (!chat.isQuitable) {
            onQuit();
            return chat.isQuitable;
        } else {
            console.log("We are letting window to close ");
            return undefined;
        }
    },
    onClose: function() {
        window.onbeforeunload = this.onbeforeunload;
    },
    postToWebview: function(obj) {
        this.onloadDFD.done(function() {
            console.log("Posting to webview ... ", obj);
            var dom = chat.getView();
            if (dom && obj) {
                dom.send("webapp-msg", obj);
            }
        });
    },
    postToBackground: function(title, eType, opt, count) {
        var commObj = {
            title: title ? title : namespace.CONTAINER_CHAT,
            eType: eType ? eType : false,
            opt: opt ? opt : false,
            count: count ? count : 0
        };
        if (commObj && commObj.eType) {
            FULLClient.emitter.sendToMain(commObj);
        }
    },
    sendToHost: function() {
        messenger.broadCast(namespace.Mediator, msg);
    },
    init: function() {
        chat._canQuit(false);
        this.initObj.dcm = JSON.stringify(userDAO.getUserDcmResponse());
        this.createChatFrame(this.getUrl());
        Locstor.set("v2", null);
    },
    createChatFrame: function(url) {
        var chatDom = new WebviewProxy("chat_webview", url, "FULLClient:Chat");
        chatDom.setContentloaded(chat.onload);
        this.getOuterDiv().html(chatDom.getView());
    },
    messageListener: function(event) {
        console.log("Message received as ", event);
    }
};

FULLClient.emitter.subscribe(namespace.CHAT, chat.messageListener);

util.subscribe("/chat/quit/flag", chat, chat._canQuit);

util.subscribe("/chat/start", chat, chat.init);

(function(util) {
    var asarUpdater = {
        manifestUpdate: null,
        manifest: null,
        extractPath: null,
        pathVersion: null,
        getJsonURL: function() {
            return "https://storage.googleapis.com/images.sb.a-cti.com/TC/electron/" + FULLClient.getMode() + "/asar/0.2.0/asarUpdater.json";
        },
        hashCheck: function() {
            if (FULLClient.getMode() != "code") {
                $.getJSON(this.getJsonURL(), function(data) {
                    console.warn("Asar Updater response : ", data);
                    this.manifest = FULLClient["manifest"];
                    if (this.manifest.checkSum !== data["checkSum"]) this.calculatePath(data); else {
                        console.log("Asar Updation : Your app is upto date");
                        util.publish("/app/updater/start", {
                            asarUpdated: false
                        });
                    }
                }.bind(this));
            }
            return true;
        },
        getSemVer: function(arg) {
            return /([0-9]{0,}\.[0-9]{0,})/.exec(arg)[0];
        },
        calculatePath: function(res) {
            var path = FULLClient.require("path"), packVer = this.getSemVer(FULLClient.getManifest().main), cloudVer = this.getSemVer(res["asarVersion"]), manifest = FULLClient.getManifest().main;
            if (compareVersions(packVer, cloudVer) == 0) {
                var patch = /[0-9]*\.[0-9]*\.[0-9]*/.exec(manifest)[0], patch = ++patch.split(".")[2], folderVer = packVer + "." + patch;
                this.extractPath = path.join(FULLClient.getFilePath(), res["asarPackage"], folderVer);
                this.pathVersion = path.join(res["asarPackage"], folderVer);
                this.versionCheck(res);
            } else {
                this.extractPath = path.join(FULLClient.getFilePath(), res["asarPackage"], res["asarVersion"]);
                this.pathVersion = path.join(res["asarPackage"], res["asarVersion"]);
                this.versionCheck(res);
            }
        },
        versionCheck: function(res) {
            var path = FULLClient.require("path");
            this.manifest.main = path.join(this.pathVersion, "full.asar", "background.js");
            this.manifest.preloadUrl = path.join(this.pathVersion, "full.asar", "preload.min.js");
            this.manifest.checkSum = res["checkSum"];
            this.startUpdate(res["asarDownloadURI"]);
        },
        startUpdate: function(url) {
            util.publish("/download/helper/file/download", {
                url: url,
                callback: this.downloadCB,
                mimetype: "application/zip",
                context: this
            });
        },
        downloadCB: function(err, filePath) {
            if (err) {
                this.sendErrMail(err);
                console.warn("Asar Updater : Error in downloading");
                return;
            }
            util.publish("/download/helper/zip/extractWithADM", {
                fd: filePath,
                context: this,
                callback: this.excractCB,
                extractPath: this.extractPath
            });
        },
        excractCB: function(err, stdout, stderr) {
            if (err) {
                this.sendErrMail(err);
                console.warn("Asar Updater : Error in Extracting");
                return;
            }
            util.publish("/download/helper/file/write", {
                fd: FULLClient.require("path").join(FULLClient.getFilePath(), "package.json"),
                context: this,
                callback: function() {
                    console.warn("Going to commence APP Update");
                    util.publish("/app/updater/start", {
                        asarUpdated: true
                    });
                }
            }, JSON.stringify(this.manifest));
        },
        sendErrMail: function(errObj) {
            var tmp = {
                subject: "Asar Updation Error",
                type: "Error Log",
                err: errObj
            };
            util.publish("/mailHelper/mailsend", tmp);
        }
    };
    module.exports = asarUpdater;
    util.subscribe("/asar/update/commence", asarUpdater, asarUpdater.hashCheck);
})(util);

(function(util) {
    var path = FULLClient.require("path");
    var appUpdates = {
        updateManifest: null,
        isAsarRestartRequired: null,
        _queuedRestart: function() {
            if (this.isAsarRestartRequired) {
                util.publish("/app/restart/commence");
            } else {
                console.log("no app update and asar update avaialble..");
                if (util.checkForUpdates.isFromMenu()) {
                    util.checkForUpdates.setFlag(false);
                    alert("Your App is Already Updated..");
                }
            }
        },
        start: function(asarObj) {
            this.isAsarRestartRequired = asarObj ? asarObj.asarUpdated : false;
            if (FULLClient.getMode() != "code") {
                var jsonFetchUrl = "https://storage.googleapis.com/images.sb.a-cti.com/TC/electron/" + FULLClient.getMode() + "/app/appUpdater.json";
                $.getJSON(jsonFetchUrl).done(function(res) {
                    this.checkVersion(res);
                }.bind(this)).fail(function(reason) {
                    console.error("AppUpdates Failed ", reason);
                    this._queuedRestart();
                }.bind(this));
            }
        },
        commenceDownload: function(manifest) {
            this.updateManifest = manifest;
            util.publish("/download/helper/file/download", {
                updateType: "app",
                url: manifest.downloadURL,
                callback: this.downloadCB,
                mimetype: "application/zip",
                context: this
            });
        },
        checkVersion: function(manifest) {
            var packageJSON = FULLClient.getManifest();
            if (manifest && manifest.version && packageJSON.version != manifest.version) {
                util.publish("updateUI/ShowUI/container", "appUpdate", manifest, this.commenceDownload, this);
            } else if (manifest.mode && util.scripts.get().src.indexOf(manifest.mode) == -1) {
                util.publish("updateUI/ShowUI/container", "appUpdate", manifest, this.commenceDownload, this);
            } else {
                this._queuedRestart();
            }
        },
        downloadCB: function(error, filePath) {
            if (error) {
                console.error("Error While Downloading : ", this.updateManifest);
                console.error("Reason : " + error.message);
                console.error("stack : ", error.stack);
                this._queuedRestart();
                return;
            }
            util.publish("/download/helper/zip/extract", {
                fd: filePath,
                context: this,
                callback: this.extractCB
            });
        },
        extractCB: function(error, stdout, stderr) {
            if (error) {
                console.error("Error While Extracting : ", this.updateManifest);
                console.error("Reason : " + error.message);
                console.error("stack : ", error.stack);
                util.publish("/mailHelper/mailsend", {
                    subject: "App Updater Failed ",
                    type: "Error Log",
                    err: error
                });
                this._queuedRestart();
                return;
            }
            this.versionUpdateInManifest();
        },
        versionUpdateInManifest: function() {
            var appManifest = FULLClient.getManifest();
            appManifest.version = this.updateManifest.version;
            util.publish("/download/helper/file/write", {
                fd: path.join(FULLClient.getFilePath(), "package.json"),
                callback: this.updateVersionInPlist,
                context: this
            }, JSON.stringify(appManifest));
        },
        pushLogsToDev: function(errLogs) {
            util.publish("/mailHelper/mailsend", {
                type: "Error Log",
                err: errLogs,
                subject: "App updater : failed while writing to info.plist for " + userDAO.getEmail()
            }, function callback() {
                console.warn("Error logs : ", errLogs);
                this.reload();
            }.bind(this));
        },
        plistParser: function(plistPath, data) {
            try {
                var plist = require("plist"), fs = require("fs"), appInfoPlist = plist.parse(data);
                appInfoPlist["CFBundleVersion"] = "64-bit";
                appInfoPlist["CFBundleShortVersionString"] = this.updateManifest.version;
                fs.writeFile(plistPath, plist.build(appInfoPlist), "utf8", function(err) {
                    if (err) this.pushLogsToDev(err); else this.reload();
                }.bind(this));
            } catch (e) {
                console.log("Error while parsing Info Plist :", e);
            }
        },
        updateVersionInPlist: function() {
            if (/^darwin/.test(process.platform)) {
                var fs = require("fs"), plistPath = FULLClient.getFilePath().replace("/Resources/app", "/Info.plist");
                fs.readFile(plistPath, "utf8", function(err, data) {
                    if (err) this.pushLogsToDev(err); else this.plistParser(plistPath, data);
                }.bind(this));
            } else this.reload();
        },
        reload: function(error) {
            if (error) {
                console.error("Error While updating manifest : ", this.updateManifest);
                console.error("Reason : " + error.message);
                console.error("stack : ", error.stack);
                this._queuedRestart();
                return;
            }
            util.publish("/app/restart/commence");
        }
    };
    util.subscribe("/app/updater/start", appUpdates, appUpdates.start);
})(util);

(function(util) {
    var fs = FULLClient.require("fs"), http = FULLClient.require("http"), https = require("https");
    path = FULLClient.require("path");
    var downloadHelper = {
        retries: 0,
        download: function(paramObj) {
            console.log("URL in update Helper to download : ", paramObj);
            if (paramObj.url && util.isUrl(paramObj.url)) {
                var url = paramObj.url.replace(/(http:\/\/images.sb.a-cti.com)/, "https://storage.googleapis.com/images.sb.a-cti.com");
                var filename = path.basename(url);
                var tmpPath = paramObj.downloadPath || FULLClient.getFilePath();
                var downloadFilePath = path.join(tmpPath, filename);
                var http = util.isHttps(url) ? https : http;
                console.log("File downloadURL  :: " + url);
                console.log("File path to download :: " + downloadFilePath);
                var file;
                http.get(url, function(res) {
                    if (paramObj.mimetype == res.headers["content-type"]) {
                        file = fs.createWriteStream(downloadFilePath, {
                            autoClose: true
                        });
                        var downloadPercentage = 0, previousPercentage = 0, progressUIShown = false, currentPercentage;
                        res.on("data", function(chunk) {
                            if (paramObj.updateType && paramObj.updateType == "app") {
                                if (!progressUIShown) {
                                    progressUIShown = true;
                                    util.publish("updateUI/hideDownloadWinandshowProgress");
                                }
                                downloadPercentage += chunk.length;
                                currentPercentage = Math.floor(downloadPercentage / res.headers["content-length"] * 100);
                                if (previousPercentage != currentPercentage) {
                                    previousPercentage = currentPercentage;
                                    util.publish("progressUI/updatePercentage", previousPercentage);
                                }
                            }
                        }.bind(this));
                        file.on("finish", function() {
                            console.log("Finished..!");
                            if (paramObj.updateType && paramObj.updateType == "app") progressUIShown = false;
                            file.close();
                            setTimeout(function() {
                                if (paramObj.callback) paramObj.callback.apply(paramObj.context || null, [ null, downloadFilePath ]);
                            }, 6e3);
                        });
                        res.pipe(file);
                    }
                }.bind(this)).on("error", function(e) {
                    console.log("Error in downloading : " + e);
                    if (paramObj.callback) paramObj.callback.call(paramObj.context || null, e);
                });
            }
        },
        queuedRetries: function(paramObj) {
            if (this.retries <= 3 && paramObj) {
                setTimeout(function() {
                    this.extract(paramObj);
                }, this.retries++ * 3e3);
            }
        },
        extract: function(paramObj) {
            var unzipTool, src = paramObj.fd, dest = paramObj.extractPath || FULLClient.getFilePath(), child = FULLClient.require("child_process");
            if (path.extname(src) == ".zip") {
                if (/^win/.test(process.platform)) {
                    unzipTool = path.resolve(FULLClient.getFilePath(), "tools", "unzip.exe");
                } else if (/darwin/.test(process.platform)) {
                    unzipTool = "unzip";
                }
                console.warn("src : " + src + ", dest : " + dest);
                child.exec('"' + unzipTool + '" -oq "' + src + '" -d "' + dest + '" ', function(e, stdout, stderr) {
                    if (e) {
                        console.log("Error in Extraction : " + e);
                        console.warn("Queueing for retries.");
                        this.queuedRetries(paramObj);
                    } else if (paramObj.callback) {
                        console.log("Making retries 0, and proceeding with call back");
                        this.retries = 0;
                        paramObj.callback.apply(paramObj.context || null, [ e, stdout, stderr ]);
                    }
                }.bind(this));
            } else {
                if (paramObj.callback) paramObj.callback.apply(paramObj.context || null, [ new Error("Invalid zip file") ]);
            }
        },
        extractWithADM: function(paramObj) {
            try {
                console.warn("paramObj : ", paramObj);
                process.noAsar = true;
                var src = paramObj.fd, dest = paramObj.extractPath || FULLClient.getFilePath(), adm = FULLClient.require("adm-zip");
                paramObj.callback = paramObj.callback || function() {};
                if (path.extname(src) == ".zip") {
                    var zip = new adm(src);
                    if (!zip.isOriginalFs) {
                        console.log("Routing to older zip systeam, bcoz ADM zip not updated.");
                        return this.extract(paramObj);
                    }
                    console.warn("zip.isOriginalFs Available ");
                    zip.extractAllToAsync(dest, true, paramObj.callback.bind(paramObj.context));
                } else {
                    if (paramObj.callback) paramObj.callback.apply(paramObj.context || null, [ new Error("Invalid zip file") ]);
                }
            } catch (err) {
                console.warn("Error in extractWithADM routing to extract");
                this.extract(paramObj);
            }
        },
        writeToFileSystem: function(paramObj, dataToWrite) {
            if (paramObj && paramObj.fd && dataToWrite) {
                fs.writeFile(paramObj.fd, dataToWrite, function(err) {
                    if (paramObj && typeof paramObj.callback == "function") {
                        paramObj.callback.apply(paramObj.context || null, [ err || null, "success" ]);
                    }
                });
            } else if (paramObj && typeof paramObj.callback == "function") {
                paramObj.callback.call(paramObj.context || null, new Error("Invalid param , while writing into file"));
            }
        }
    };
    module.exports = downloadHelper;
    util.subscribe("/download/helper/file/download", downloadHelper, downloadHelper.download);
    util.subscribe("/download/helper/zip/extract", downloadHelper, downloadHelper.extract);
    util.subscribe("/download/helper/zip/extractWithADM", downloadHelper, downloadHelper.extractWithADM);
    util.subscribe("/download/helper/file/write", downloadHelper, downloadHelper.writeToFileSystem);
})(util);

(function(R, util) {
    var restart = {
        getScriptName: function() {
            var scriptname;
            switch (FULLClient.getAppName().toLowerCase()) {
              case "fullclient-electron.exe":
                {
                    scriptname = "fc.bat";
                    break;
                }

              case "anywhereworks.exe":
                {
                    scriptname = "aww.bat";
                    break;
                }

              case "anywhere works.exe":
                {
                    scriptname = "awwspaced.bat";
                    break;
                }

              case "aww-v2.exe":
                {
                    scriptname = "aww-v2.bat";
                    break;
                }

              default:
                {
                    scriptname = "aww.bat";
                    break;
                }
            }
            return scriptname;
        },
        quitApp: function() {
            util.publish("/app/restore/removeAll", "tabs");
            var child = require("child_process").exec, path = require("path");
            if (/^win/.test(process.platform)) {
                var quietTool = path.resolve(process.resourcesPath, "app", "tools", "Quiet.exe");
                var scriptPath = path.resolve(process.resourcesPath, "app", "scripts", this.getScriptName());
                child('START " "  "' + quietTool + '"  "' + scriptPath + '"', function(err) {
                    if (err) console.log("Error in restart" + err);
                });
            } else if (/^darwin/.test(process.platform)) {
                var applicationPath, endIndex = process.resourcesPath.indexOf("/Contents");
                var appName = namespace.APP_ID == "FULL" ? "FULLClient-Electron" : FULLClient.getAppName();
                var scriptPath = path.resolve(process.resourcesPath, "app", "scripts", "restart.sh");
                applicationPath = process.resourcesPath.substring(0, endIndex);
                appName = util.escapeSpaces(appName);
                scriptPath = util.escapeSpaces(scriptPath);
                applicationPath = util.escapeSpaces(applicationPath);
                console.log("ApplicationPath to START : " + applicationPath);
                var daemon = child("sh " + scriptPath + " " + process.pid + " " + applicationPath + " " + appName, function(err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                    }
                    console.debug("STDOUT :", stdout);
                    console.warn("STDERR : ", stderr);
                });
            }
        },
        initiate: function() {
            this.quitApp();
        }
    };
    util.subscribe("/app/restart/commence", restart, restart.initiate);
})(this, util);

(function(root, $, mediator) {
    process.on("uncaughtException", function(err) {
        console.log(err);
    });
    var loginDFD = $.Deferred();
    var onLoadDFD = $.Deferred();
    onload = function() {
        if (namespace.APP_ID != document.title) {
            document.title = namespace.APP_ID;
        }
        console.log("Onload in Chat container.. ..");
        amplify.publish("module/controller/onload", {
            source: "onload"
        });
    };
    var moduleLoader = {
        name: "ModuleLoader",
        log: function() {
            util.log.apply(this, arguments);
        }
    };
    moduleLoader.init = function() {
        mediator.publish("/app/loginModule/start", loginDFD);
        mediator.publish("/webview/controller/app/onload");
        $.when(loginDFD).done(function() {
            moduleLoader.skillBasedLoader();
            userDAO.setloggedIn(true);
        });
    };
    moduleLoader.onloadRecived = function(isDomReady) {
        if (isDomReady) onLoadDFD.resolveWith(moduleLoader, []);
        this.init();
        return onLoadDFD.promise();
    };
    moduleLoader.login = function() {
        if (userDAO.getUserDcmResponse()) loginDFD.resolveWith(moduleLoader, []);
        if (window.Locstor) /fullauth/.test(Locstor.get("recentRefetch")) ? Locstor.remove("recentRefetch") : false;
        return loginDFD.promise();
    };
    moduleLoader.skillBasedLoader = function() {
        FULLClient.emitter.sendToMain({
            eType: "init"
        });
        if (userDAO.getSkillByName("FullWork")) {
            this.chatMode();
        } else {
            util.publish("/asar/update/commence");
        }
        $("#v2_Phone_Icon").show();
    };
    moduleLoader.chatMode = function() {
        this.log("ChatMode");
        util.publish("/chat/start");
        util.publish("/start/engine/updater/");
    };
    moduleLoader.reset = function() {
        loginDFD = $.Deferred();
        this.init();
    };
    mediator.subscribe("module/controller/onload", moduleLoader, moduleLoader.onloadRecived);
    mediator.subscribe("module/controller/login", moduleLoader, moduleLoader.login);
    mediator.subscribe("module/controller/reset", moduleLoader, moduleLoader.reset);
})(window, jQuery, amplify);

(function(R, M) {
    var loginModule = {
        name: "loginModule",
        userLoginInfo: null,
        log: function() {
            util.log.apply(this, arguments);
        },
        getBaseURL: function() {
            return FULLClient.getConfig().login;
        },
        getServiceId: function() {
            return this.isNewFullAuth() ? FULLClient.getConfig().auth.clientId : FULLClient.getConfig().serviceId;
        },
        isNewFullAuth: function() {
            return /fullcreative.fullauth/.test(FULLClient.getConfig().login);
        },
        getLoginURL: function() {
            return this.isNewFullAuth() ? this.getBaseURL() + "/o/oauth2/auth?" + "state=oAuth" + "&client_id=" + this.getServiceId() + "&redirect_uri=" + this.getRedirectURL() + "&scope=contacts-api.full_access awapis.fullaccess" + "&response_type=code&approval_prompt=force&expiry_type=LONG" : this.getBaseURL() + "/oauth/2/authentication/fullOauthService?" + "serviceAccountId=" + this.getServiceId() + "&redirectUrl=" + this.getRedirectURL() + "&isTc=true" + "&errorUrl=" + this.getRedirectURL() + "&allowExternalUser=true";
        },
        getRedirectURL: function() {
            return this.isNewFullAuth() ? FULLClient.getConfig().auth.redirect : this.getBaseURL() + "/login.jsp";
        },
        onload: function(evt) {
            loginModule.log("Recieved login page onload !!! ", evt);
            util.publish("/app/loginModule/onload/recieved");
            evt.target.send("webapp-init", {
                name: "init",
                source: "FULL",
                contact: {}
            });
        },
        embedWebviewDom: function() {
            this.log("Embedding webview login dom ");
            var login = new WebviewProxy("LoginModule", this.getLoginURL(), "persist:FULLClient:tab");
            login.setContentloaded(this.onload);
            $("#chatContainer").append(login.getView());
        },
        getMainProcessUserInfo: function() {
            var tmp = userDAO.getUser();
            tmp.isFullWork = userDAO.getSkillByName("FullWork") ? true : false;
            tmp.isCEA = userDAO.getSkillByName("CEA") ? true : false;
            tmp["crashInfo"] = this.userLoginInfo ? this.userLoginInfo : null;
            return tmp;
        },
        getUserInfoFromUserLoginRegisterModule: function() {
            util.publish("/userInfo/getSpecDetails/", function(res) {
                if (res) {
                    this.userLoginInfo = res;
                }
            }.bind(this));
        },
        sendUserInfoToMainProcess: function() {
            console.log("sendUserInfoToMainProcess ...");
            FULLClient.emitter.sendToMain({
                eType: "userInfo",
                userObj: this.getMainProcessUserInfo()
            });
        },
        getLocalStorageUserData: function() {
            if (userDAO.getUser()) {
                this.log("USER Data available in storage !!!");
                util.publish("module/controller/login", {
                    source: "login",
                    data: "localStorage"
                });
                this.sendUserInfoToMainProcess();
                return true;
            } else {
                this.embedLoginTab();
                return false;
            }
        },
        embedLoginTab: function() {
            this.removedEmbeddedView();
            this.embedWebviewDom();
        },
        removedEmbeddedView: function() {
            $("#LoginModule").remove();
        },
        saveUser: function(contact) {
            var dcm = contact;
            if (dcm && dcm["success"] && dcm["contact"] && dcm["contact"].login) {
                this.removedEmbeddedView();
                this.log("FullOauth has contact,skillset and success param so persisting in localStorage ");
                userDAO.setUser(dcm);
                util.publish("module/controller/login", {
                    source: "login"
                });
                this.sendUserInfoToMainProcess();
                if (!userDAO.getSkillByName("FullWork")) {
                    util.publish("/util/window/events/hide", namespace.CONTAINER_CHAT);
                }
            } else {
                this.log("DCM data is NULL, so we are going to login page again !!!! ");
                util.cookies.clear();
                this.log("Application Cookies are cleared !!!");
            }
        },
        msgHandler: function(msg) {
            if (msg) {
                this.saveUser(msg.contact);
            }
        },
        init: function() {
            this.log(this.getLoginURL());
            this.getUserInfoFromUserLoginRegisterModule();
            this.getLocalStorageUserData();
        }
    };
    M.subscribe("/app/loginModule/start", loginModule, loginModule.init);
    M.subscribe("/app/loginModule/msg/recieved", loginModule, loginModule.msgHandler);
    R["loginModule"] = loginModule;
})(this, amplify, util);

(function(R, $, util) {
    var childProcess = require("child_process");
    var getOS = {
        getSystemInfo: function() {
            var defer = $.Deferred();
            childProcess.exec("systeminfo", function(error, sysout, syserr) {
                if (!error) {
                    console.log("System INFO :: ", sysout, syserr);
                    defer.resolve(sysout || syserr);
                }
                defer.reject(error);
            });
            return defer;
        },
        platform: function() {
            return process.platform == "darwin" ? this.mac() : this.win();
        },
        getRelease: function() {
            return FULLClient.require("os").release();
        },
        win: function() {
            var osVer = this.getRelease(), kernalVer = /\d*\.\d*/.exec(osVer)[0];
            switch (kernalVer) {
              case "10.0":
                return "Windows 10";

              case "6.3":
                return "Windows 8.1";

              case "6.2":
                return "Windows 8";

              case "6.1":
                return "Windows 7";

              case "6.0":
                return "Windows vista";

              default:
                return "OlderOrLatest";
            }
        },
        mac: function() {
            var kernalVer = this.getRelease(), kernalVer = /\d*/.exec(kernalVer)[0];
            switch (kernalVer) {
              case "13":
                return "Mavericks";

              case "14":
                return "Yosemite";

              case "15":
                return "El Capitan";

              case "16":
                return "Sierra";

              default:
                return "olderOrLatest";
            }
        }
    };
    try {
        var specs, os_details = FULLClient.require("os");
        specs = "Hostname         : " + os_details.hostname() + "\n OS platform      : " + getOS.platform() + "\n CPU model        : " + os_details.cpus()[0].model + "\n OS architecture  : " + os_details.arch() + "\n Total memory     : " + Math.round(os_details.totalmem() / (1024 * 1024 * 1024)) + "GB" + "\n Free Memory      : " + Math.round(os_details.freemem() / (1024 * 1024)) + "MB" + "\n Exec Path : " + process.execPath + "\n Env Path : " + process.env.PATH;
    } catch (e) {
        console.error("Exception while getting system info :: ", e.message);
        console.error("Exception while getting system info :: ", e.stack);
        console.error("Exception while getting system info :: ", e);
        specs = e.message + "\n" + e.stack;
    }
    var registerUser = {
        ip: "0.0.0.0",
        name: "RegisterUserInSpreadsheet",
        log: function() {
            util.log.apply(this, arguments);
        },
        setSpeckInfo: function(speckInfo) {
            return {
                version: "App : " + FULLClient.manifest.version + ", Engine : " + process.versions.electron,
                os: getOS.platform(),
                name: util.user.getEmail(),
                mode: FULLClient.getMode(),
                systeminfo: speckInfo || "Still Not Taken",
                ip: this.ip
            };
        },
        getSpecDetails: function(cb) {
            if (cb) {
                cb.call(this, {
                    appVersion: FULLClient.manifest.version,
                    engine: process.versions.electron,
                    platform: process.platform,
                    os: getOS.platform(),
                    mode: FULLClient.getMode(),
                    ipaddress: this.ip
                });
            }
        },
        getSpecks: function() {
            if (/^darwin/.test(process.platform)) {
                var defer = $.Deferred();
                defer.resolve(specs);
                return defer;
            } else if (/^win/.test(process.platform)) {
                return getOS.getSystemInfo();
            }
        },
        storeInSpreadsheet: function() {
            if (util.user.getEmail()) {
                this.log("Storing in Spreadsheet user info ");
                this.getSpecks().done(function(systemInfo) {
                    var info = registerUser.setSpeckInfo(systemInfo);
                    $.post("https://script.google.com/macros/s/AKfycbzyZf4grFPDwclO9WUtlfqW9-R4JRole_IWE0GXU-2pXhWvoPc/exec?", {
                        userInfo: JSON.stringify(info)
                    });
                }).fail(function(err) {
                    console.warn("User-system information collection error : ", err.message);
                    console.warn("User-system information collection error : ", err.stack);
                    var info = registerUser.setSpeckInfo(specs);
                    $.post("https://script.google.com/macros/s/AKfycbzyZf4grFPDwclO9WUtlfqW9-R4JRole_IWE0GXU-2pXhWvoPc/exec?", {
                        userInfo: JSON.stringify(info)
                    });
                });
            }
        },
        getIP: function() {
            $.get("http://l2.io/ip").done($.proxy(function(ipAddress) {
                this.log("Got IPAddress : " + ipAddress);
                this.ip = ipAddress;
            }, this)).fail($.proxy(function() {
                this.log("Getting IP address failed !!!");
            }, this)).then($.proxy(this.storeInSpreadsheet, this));
        }
    };
    module.exports = registerUser;
    util.subscribe("module/controller/login", registerUser, registerUser.getIP);
    util.subscribe("/userInfo/getSpecDetails/", registerUser, registerUser.getSpecDetails);
})(window, jQuery, util);

(function(R, util) {
    var EventEmitter = require("events").EventEmitter;
    var path = require("path");
    var win = util.getCurrentWindow();
    var remote = FULLClient.require("electron").remote;
    var dialog = remote.dialog;
    var fs = FULLClient.require("fs");
    var request = FULLClient.require("request");
    function FileDownloader(downloadItem) {
        EventEmitter.call(this);
        this.name = "fileDownloader";
        this.id = uuid.v4(new Date().getTime());
        this.requestObject = null;
        this.originalObject = downloadItem;
        this.getdownloadUrl = function() {
            return downloadItem.url ? downloadItem.url : null;
        };
        this.downloadFile = function(cb, requestErrorCallback, filePath) {
            this.requestObject = request(this.getdownloadUrl()).on("response", cb).pipe(fs.createWriteStream(filePath));
            this.requestObject.on("error", function(err) {
                if (err) {
                    console.log("Error in request:", err);
                    this.removeProgressBar();
                    requestErrorCallback.apply(this, [ {
                        err: err,
                        id: this.id,
                        originalObject: this.originalObject
                    } ]);
                }
            }.bind(this));
        };
        this.removeProgressBar = function() {
            win.setProgressBar(-1);
        };
        this.cancelDownload = function() {
            this.requestObject.emit("close");
            console.warn("Download Cancelling for [CLOSE]");
            this.requestObject.end("");
            console.warn("Download Cancelling for [end]");
            this.requestObject.close();
            console.warn("Download Cancelling for [destory]");
            console.log("Download canceled for [ ", this.id, " ]");
        };
        this.on(this.id, function() {
            console.warn("Cancel Event Emitted for :", this.id);
            this.cancelDownload();
        });
    }
    FileDownloader.prototype = Object.create(EventEmitter.prototype);
    var downloadController = {
        downloadMap: {},
        downloadActive: null,
        glen: null,
        chunkLength: null,
        downloadedPercentage: null,
        precision: null,
        customDownloadPath: false,
        previousPercentage: 0,
        responseObj: {},
        decider: function(downloadItem) {
            console.log("Getting request for download for chat : downloadActive :", this.downloadActive);
            if (!this.downloadActive && downloadItem && downloadItem.action != "cancel") {
                this.downloadActive = true;
                this.start(downloadItem);
            }
            if (downloadItem && downloadItem.action == "cancel") {
                var Obj = this.downloadMap[downloadItem.id];
                console.warn("Download Cancelling for [", downloadItem.id, " ]");
                Obj.emit(downloadItem.id);
                this.responseObj[downloadItem.id].destroy();
                this.sendCancelEventToChat(this.downloadMap[downloadItem.id]);
                this.downloadMap[downloadItem.id].originalObject.fileCancelled = true;
                process.nextTick(function() {
                    downloadController.deletefile(downloadItem.id, downloadController.removeLocalObj);
                });
            }
        },
        start: function(downloadItem) {
            var fileObj = path.parse(downloadItem.filename);
            console.info("FileObj:", fileObj.ext);
            var downloadObj = new FileDownloader(downloadItem);
            var dpath, options;
            options = {
                title: "Downloads",
                defaultPath: this.getDownloadFolder() + "/" + downloadItem.filename,
                filters: [ {
                    name: "All Files",
                    extensions: [ "*" ]
                } ]
            };
            dialog.showSaveDialog(options, function(data) {
                if (!data) {
                    console.log("User selected cancel button: ", data);
                    this.downloadActive = null;
                }
                if (data) {
                    this.downloadActive = null;
                    console.debug("User selected path :", data);
                    var filePath = this.getPathToWrite(data, fileObj.ext);
                    downloadObj.originalObject["downloadInfo"] = path.parse(filePath);
                    downloadObj.originalObject["fileInfo"] = fileObj;
                    downloadObj.downloadFile(function(res) {
                        this.responseObj[downloadObj.id] = res;
                        this.glen += parseInt(res.headers["content-length"], 10);
                        var downloadPercentage = 0;
                        console.debug("Written Path :", this.getPathToWrite(data, fileObj.ext));
                        res.on("data", function(chunk) {
                            try {
                                this.chunkLength += chunk.toString("utf8");
                                downloadPercentage += chunk.length;
                                this.calculatePercentageAndMegabyte(this.glen, this.chunkLength, downloadPercentage, res, downloadItem, downloadObj);
                            } catch (e) {}
                        }.bind(this));
                        res.on("error", function(err) {
                            if (err) {
                                console.error("Error while downloading...!", err.message);
                                console.error("Error while downloading...!", err.stack);
                                this.removeProgressBar();
                            }
                        }.bind(this));
                        res.on("end", function(err) {
                            if (err) {
                                console.log("Error at end:", err.message);
                                console.log("Error at end:", err.stack);
                                this.removeProgressBar();
                            }
                            var fileInfo = path.parse(data);
                            this.findOriginalObjectandCompleteEvent(res.request.href, fileInfo.base ? fileInfo.base : fileObj.base, downloadObj.id);
                            this.setDownloadPathinLocalStorage("lastDownloadedPath", fileInfo.dir);
                            if (fileInfo.dir && fileInfo.base && !downloadObj["originalObject"].fileCancelled) {
                                this.finishDownload("completed", fileInfo.ext ? fileInfo.base : fileInfo.base + fileObj.ext);
                            }
                        }.bind(this));
                    }.bind(this), this.requestErrorCallback, filePath);
                    this.downloadMap[downloadObj.id] = downloadObj;
                }
            }.bind(this));
        },
        findOriginalObjectandCompleteEvent: function(url, filename, fileId) {
            for (var i in this.downloadMap) {
                if (this.downloadMap[i].originalObject.url == url || this.downloadMap[i].originalObject.filename == filename) {
                    var fileInfo = new Thinclient("downloadFileInfo");
                    fileInfo[fileInfo.opt].originalObject = this.downloadMap[i].originalObject;
                    fileInfo[fileInfo.opt].id = this.downloadMap[i].id;
                    fileInfo[fileInfo.opt].status = "completed";
                    this.sendMessageToChat(fileInfo);
                    this.removeLocalObj(fileId);
                }
            }
        },
        removeLocalObj: function(fileId) {
            delete this.downloadMap[fileId];
            if ($.isEmptyObject(this.downloadMap)) {
                console.log("downloadMap is empty", this.downloadMap, ": we can clear dock...!");
                this.flushDockProgress();
            }
        },
        flushDockProgress: function() {
            this.precision = null;
            this.chunkLength = null;
            this.glen = null;
            this.removeProgressBar();
        },
        deletefile: function(fileId, cb) {
            var obj = this.downloadMap[fileId];
            var downloadInfo = obj.originalObject.downloadInfo;
            var originalInfo = obj.originalObject.fileInfo;
            var filePath;
            if (downloadInfo) {
                filePath = path.join(downloadInfo.dir, downloadInfo.name + (downloadInfo.ext || originalInfo.ext));
                console.warn("DOWNLOAD File-path to delete while CANCEL :", filePath);
            }
            if (filePath) {
                this.checkfileExistenceInUserSystem(filePath, function(path) {
                    fs.unlink(path, function(err) {
                        if (err) {
                            console.error("Error in deleting file:", err.message);
                            console.error("Error in deleting file:", err.stack);
                        } else {
                            console.warn("DOWNLOAD File-path to delete successful :", path);
                            cb.call(this, fileId);
                        }
                    }.bind(this));
                }.bind(this));
            }
        },
        checkfileExistenceInUserSystem: function(filePath, cb) {
            fs.stat(filePath, function(err, stats) {
                if (err) {
                    console.error("Error in getting " + filePath + "availibilty:", err);
                } else {
                    cb.call(this, filePath);
                }
            }.bind(this));
        },
        requestErrorCallback: function() {
            var errorInfo = arguments[0];
            delete downloadController.downloadMap[errorInfo.id];
            var fileInfo = new Thinclient("downloadFileInfo");
            fileInfo[fileInfo.opt].originalObject = errorInfo.originalObject;
            fileInfo[fileInfo.opt].id = errorInfo.id;
            fileInfo[fileInfo.opt].status = "failed";
            downloadController.sendMessageToChat(fileInfo);
        },
        sendCancelEventToChat: function(fileObj) {
            var fileInfo = new Thinclient("downloadFileInfo");
            fileInfo[fileInfo.opt].originalObject = fileObj;
            fileInfo[fileInfo.opt].id = fileObj.id;
            fileInfo[fileInfo.opt].status = "cancelled";
            this.sendMessageToChat(fileInfo);
        },
        getDownloadFolder: function() {
            var downloadFolderName = "Downloads";
            if ("HOME" in process.env) {
                return path.join(process.env.HOME, downloadFolderName);
            } else if ("HOMEPATH" in process.env) {
                return path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, downloadFolderName);
            } else if ("USERPROFILE" in process.env) {
                return path.join(process.env.USERPROFILE, downloadFolderName);
            }
        },
        getDownLoadedPath: function(filename) {
            return path.join(this.getDownloadFolder(), filename);
        },
        getCustomDownLoadedPath: function(filename) {
            return path.join(this.getCachedDownloadedPath("lastDownloadedPath"), filename);
        },
        showInFolder: function(filename) {
            if (this.customDownloadPath) shell.showItemInFolder(this.getCustomDownLoadedPath(filename)); else shell.showItemInFolder(this.getDownLoadedPath(filename));
        },
        getCachedDownloadedPath: function(key) {
            return util.storage.get(key);
        },
        setDownloadPathinLocalStorage: function(key, value) {
            if (key && value) this.customDownloadPath = true;
            return util.storage.set(key, value);
        },
        updateProgressBar: function(percentage) {
            if (!/^darwin/.test(process.platform)) {
                setTimeout(function() {
                    win.setProgressBar(percentage);
                }, 0);
            }
        },
        removeProgressBar: function() {
            setTimeout(function() {
                win.setProgressBar(-1);
            }, 0);
        },
        finishDownload: function(state, filename) {
            if (state == "completed") {
                this.completed(filename);
            }
        },
        completed: function(filename) {
            this.showInFolder(filename);
            this.removeProgressBar();
        },
        getPathInfo: function(filepathInfo) {
            return path.parse(filepathInfo);
        },
        getPathToWrite: function(filepathInfo, savedfileObj) {
            var pathInfo = path.parse(filepathInfo);
            return path.join(pathInfo.dir, pathInfo.name + (pathInfo.ext || savedfileObj));
        },
        constructDownloadInfoObject: function(downloadItem, downloadObj, previousPercentage, downloadedMB) {
            var percent = new Thinclient("downloadFileInfo");
            percent[percent.opt].originalObject = downloadItem;
            percent[percent.opt].id = downloadObj.id;
            percent[percent.opt].downloadedPercentage = previousPercentage;
            percent[percent.opt].downloadedMB = downloadedMB;
            this.sendMessageToChat(percent);
        },
        sendMessageToChat: function(obj) {
            if (FULLClient && obj) {
                FULLClient.ipc.sendToChat(obj);
            }
        },
        calculatePercentageAndMegabyte: function(glen, chunkLength, downloadPercentage, res, downloadItem, downloadObj) {
            var currentPercentage, downloadedMB;
            currentPercentage = Math.floor(downloadPercentage / res.headers["content-length"] * 100);
            downloadedMB = (chunkLength.length / 1048576).toFixed(2);
            if (this.previousPercentage != currentPercentage) {
                this.previousPercentage = currentPercentage;
                this.downloadedPercentage = this.previousPercentage;
                this.constructDownloadInfoObject(downloadItem, downloadObj, this.previousPercentage, downloadedMB);
            }
            var downloaded = parseFloat((chunkLength.length / glen).toFixed(2));
            if (typeof downloaded == "number" && this.precision != downloaded) {
                this.updateProgressBar(downloaded);
            }
        }
    };
    R["downloadController"] = downloadController;
    module.exports.FileDownloader = FileDownloader;
    module.exports.downloadController = downloadController;
    util.subscribe("/file/download/Start/", downloadController, downloadController.decider);
})(this, util);

(function(R, $, util, undefined) {
    var fs = FULLClient.require("fs");
    var feedbackAlerted = false;
    try {
        var nodeNotifier = FULLClient.require("node-notifier");
        function FullNotification(clientListenerObj) {
            this.name = "FULLNotification";
            this.source = clientListenerObj != null ? clientListenerObj : location.origin;
            this.container = util.window.getName();
            this.title = this.getTitlefromObject();
            this.body = this.getBodyfromObject();
            this.icon = this.getIconfromObject();
            this.silent = this.getSilentOption();
            this.focusContainer = this.getfocusContainer();
            this.create();
        }
        FullNotification.prototype.create = function() {
            var options = {
                title: this.title,
                body: this.body,
                name: this.name,
                icon: this.icon,
                source: this.source,
                container: this.container,
                silent: this.silent,
                focusContainer: this.focusContainer
            };
            if (/^darwin/.test(process.platform)) {
                this.macNotification(options);
            } else if (/^win/.test(process.platform)) {
                this.windowsNotification(options);
            }
        };
        FullNotification.prototype._isValid = function() {
            if (this.source && this.source.notify) return true; else return false;
        };
        FullNotification.prototype.getTitlefromObject = function() {
            return this.source.notify.title && this._isValid() ? this.source.notify.title : "Fullclient_Title";
        };
        FullNotification.prototype.getBodyfromObject = function() {
            return this.source.notify.body && this._isValid() ? this.replaceSlash(this.source.notify.body) : "Fullclient_Message";
        };
        FullNotification.prototype.getIconfromObject = function() {
            return this.source.notify.icon && this._isValid() ? this.source.notify.icon : "";
        };
        FullNotification.prototype.getSilentOption = function() {
            return this.source.notify.silent || true;
        };
        FullNotification.prototype.getfocusContainer = function() {
            return this.source.notify.focusContainer || true;
        };
        FullNotification.prototype.replaceSlash = function(str) {
            return str.replace(/\\/g, ".").replace(/\r?\n|\r/g, ".");
        };
        FullNotification.prototype.macNotification = function(nObj) {
            var sourceObj, notificatioObj, containerName, options, _keys, _tc;
            if (nObj.source.name == "clientlistener" && nObj.source.opt == "notify" && nObj.source.notify) sourceObj = nObj.source.notify; else sourceObj = nObj.source;
            notificatioObj = this.getnotifyObject(sourceObj);
            if (notificationController.canUseTerminlNotifier) {
                this.macTerminalNotification(notificatioObj, nObj);
            } else {
                if (!feedbackAlerted) {
                    feedbackAlerted = true;
                    util.publish("/feedback/initiate", {
                        userFeedback: "System generated feedback, Notification is falling back to native notification scheme"
                    });
                }
            }
        };
        FullNotification.prototype.macTerminalNotification = function(notificatioObj, nObj) {
            var nc = new nodeNotifier.NotificationCenter();
            nc.notify({
                title: this.getTitle(nObj),
                message: this.getBody(nObj),
                contentImage: this.getIcon(nObj),
                remove: "ALL",
                wait: false
            }, function(err, response) {
                if (err) {
                    console.log("Error in macNotification:", err);
                }
                if (response.indexOf("Removing previously sent notification") != -1 && response.indexOf("Activate") != -1) {
                    nc.emit("click");
                }
            }.bind(this));
            nc.once("click", function(notifierObject, options) {
                var currentWin = util.getCurrentWindow();
                currentWin.setAlwaysOnTop(true);
                setTimeout(function() {
                    currentWin.setAlwaysOnTop(false);
                }.bind(this), 200);
                this.sendClickeventHelper(notificatioObj, nObj);
                notificationController.activeNotification = null;
            }.bind(this));
            nc.once("timeout", function(notifierObject, options) {
                notificationController.activeNotification = null;
            }.bind(this));
            setTimeout(function() {
                notificationController.activeNotification = null;
            }.bind(this), 3e3);
        };
        FullNotification.prototype.sendClickeventHelper = function(notificatioObj, nObj) {
            if (nObj.container && nObj.focusContainer) {
                this.showAppropriateWindow(nObj.container);
            }
            _tc = new Thinclient("notify");
            _tc[_tc.opt].isEvent = true;
            _keys = Object.keys(notificatioObj);
            for (var i = _keys.length - 1; i >= 0; i--) {
                _tc[_tc.opt][_keys[i]] = notificatioObj[_keys[i]];
            }
            _tc[_tc.opt].type = "click";
            this.sendClickEventToContainer(nObj.container, _tc);
        };
        FullNotification.prototype.windowsNotification = function(nObj) {
            var sourceObj, notificatioObj, containerName, _keys, _tc;
            var nc = new nodeNotifier.WindowsBalloon();
            if (nObj.source.name == "clientlistener" && nObj.source.opt == "notify" && nObj.source.notify) sourceObj = nObj.source.notify; else sourceObj = nObj.source;
            notificatioObj = this.getnotifyObject(sourceObj);
            setTimeout(function() {
                notificationController.activeNotification = null;
            }.bind(this), 3e3);
            nc.notify({
                title: this.getTitle(nObj),
                message: this.getBody(nObj),
                time: 3e3,
                wait: true
            }, function(error, response) {
                if (error) this.handlefullexception(error);
            }.bind(this)).on("click", function(arguments) {
                notificationController.activeNotification = null;
                var currentWin = util.getCurrentWindow();
                currentWin.setAlwaysOnTop(true);
                setTimeout(function() {
                    currentWin.setAlwaysOnTop(false);
                }.bind(this), 0);
                if (nObj.container && nObj.focusContainer) {
                    this.showAppropriateWindow(nObj.container);
                }
                _tc = new Thinclient("notify");
                _tc[_tc.opt].isEvent = true;
                _keys = Object.keys(notificatioObj);
                for (var i = _keys.length - 1; i >= 0; i--) {
                    _tc[_tc.opt][_keys[i]] = notificatioObj[_keys[i]];
                }
                _tc[_tc.opt].type = "click";
                this.sendClickEventToContainer(nObj.container, _tc);
            }.bind(this));
        };
        FullNotification.prototype.truncate = function(str, charRestrictionCount) {
            if (str && typeof str == "string") {
                if (charRestrictionCount && str.length > charRestrictionCount) {
                    return str.substr(0, charRestrictionCount);
                } else {
                    return str;
                }
            }
        };
        FullNotification.prototype.getnotifyObject = function(ClientListenerObject) {
            function notifyObject(ClientListenerObject) {
                var _keys = Object.keys(ClientListenerObject);
                for (var i = _keys.length - 1; i >= 0; i--) {
                    this[_keys[i]] = ClientListenerObject[_keys[i]];
                }
            }
            return new notifyObject(ClientListenerObject);
        };
        FullNotification.prototype.getTitle = function(nObj) {
            return this.truncate(nObj.title, 45);
        };
        FullNotification.prototype.getBody = function(nObj) {
            return this.truncate(nObj.body, 150);
        };
        FullNotification.prototype.getIcon = function(nObj) {
            return "";
        };
        FullNotification.prototype.getContainer = function() {
            if (this.source && this.source.notify.container) return this.source.notify.container; else return false;
        };
        FullNotification.prototype.showAppropriateWindow = function(containerName) {
            switch (containerName) {
              case "V2":
                {
                    util.windowEvents.show("V2");
                    break;
                }

              case "FULL":
                {
                    util.windowEvents.show("FULL");
                    break;
                }

              case "AnyWhereWorks":
                {
                    var chatWindow = util.caching.windows.getChat();
                    if (/win32/.test(process.platform) && chatWindow.isMinimized()) {
                        util.windowEvents.restore("Chat");
                        util.windowEvents.show("Chat");
                    } else {
                        util.windowEvents.show("Chat");
                    }
                    break;
                }

              default:
                {
                    console.log("Notification sender containerName in not avaialble. We are not taking action...!");
                    break;
                }
            }
        };
        FullNotification.prototype.sendClickEventToContainer = function(containerName, msg) {
            switch (containerName) {
              case "AnyWhereWorks":
                {
                    FULLClient.ipc.sendToChat(msg);
                    break;
                }

              case "FULL":
                {
                    FULLClient.ipc.sendToSB(msg);
                    break;
                }

              case "V2":
                {
                    FULLClient.ipc.sendToV2(msg);
                    break;
                }

              default:
                {
                    console.log("Default sequence excecuting in sendClickEventToContainer..!");
                    break;
                }
            }
        };
        FullNotification.prototype.handlefullexception = function(arg) {
            console.error("Exception in FullNotification module ::", arg);
            console.error("Error stack ::", arg.stack);
        };
        var notificationController = {
            activeNotification: null,
            terminalNotifierPath: "/node_modules/node-notifier/vendor/terminal-notifier.app/Contents/MacOS/terminal-notifier",
            permissionLevel: 511,
            applicationPath: util.escapeSpaces(process.execPath.replace(/([\/]Contents.*)/g, "")),
            canUseTerminlNotifier: false,
            create: function() {
                if (!this.activeNotification) {
                    this.activeNotification = true;
                    var args = [].slice.apply(arguments);
                    args.splice(0, 0, FullNotification);
                    new (FullNotification.bind.apply(FullNotification, args))();
                }
            },
            checkNotificationDependency: function() {
                if (/^darwin/.test(process.platform)) {
                    fs.access(FULLClient.getFilePath() + this.terminalNotifierPath, fs.W_OK && fs.R_OK && fs.X_OK, function(err, res) {
                        if (err) {
                            console.log("Error File down have permissions:", err);
                            this.givingPermissionToTerminalNotifier();
                        } else {
                            this.canUseTerminlNotifier = true;
                        }
                    }.bind(this));
                }
            },
            givingPermissionToTerminalNotifier: function() {
                fs.chmod(FULLClient.getFilePath() + this.terminalNotifierPath, this.permissionLevel, function(err, stdout, stdin) {
                    if (err) {
                        console.warn("Error in giving permission to terminal-notifier..!", err);
                        this.pushLogsToDev(err);
                    } else {
                        this.canUseTerminlNotifier = true;
                        console.warn("Given permission to terminal-notifier.app : ", this.canUseTerminlNotifier);
                    }
                }.bind(this));
            },
            pushLogsToDev: function(errLogs) {
                util.publish("/mailHelper/mailsend", {
                    type: "Error Log",
                    err: errLogs,
                    subject: "Notification error for " + userDAO.getEmail()
                }, function callback() {
                    console.warn("Error logs : ", errLogs);
                }.bind(this));
            }
        };
        R["FullNotification"] = FullNotification;
        R["notificationController"] = notificationController;
        var _n = Notification;
        R["Notification"] = function() {
            var args = Array.prototype.slice.call(arguments);
            var message = args[1];
            var n = new ClientListener("notify");
            n[n.opt].title = args[0];
            n[n.opt].body = message ? message.body : "";
            util.publish("/notification/create/show", n);
            return n;
        };
        util.subscribe("/notification/create/show", notificationController, notificationController.create);
        util.subscribe("/notification/create/checkNotificationDependency", notificationController, notificationController.checkNotificationDependency);
    } catch (e) {
        console.log("Exception in FullNotification ::", e);
        console.error("Exception stack ::", e.stack);
    }
})(this, jQuery, util);

(function(util) {
    var path = FULLClient.require("path");
    var fs = FULLClient.require("fs");
    var openBrowser = {
        externalUrl: null,
        macBrowser: null,
        extEvent: null,
        targetBrowser: {
            chrome: "Google Chrome",
            firefox: "Firefox.exe",
            iexplore: "IEXPLORE.exe"
        },
        availableBrowser: {},
        whiteList: [],
        setWhiteList: function(list) {
            if (list && list.length > 0) this.whiteList = list;
        },
        isInternal: function(url) {
            var arr = [ "formcreator", "-sb.appspot.com" ];
            for (var i = arr.length - 1; i >= 0 && arr[i]; i--) {
                var regex = new RegExp(arr[i], "g");
                if (regex.test(url)) {
                    util.loadURL(url);
                    return true;
                }
            }
            return this.isWhiteListed(url);
        },
        isWhiteListed: function(url) {
            var arr = this.whiteList;
            for (var i = arr.length - 1; i >= 0 && arr[i]; i--) {
                var regex = new RegExp(arr[i], "g");
                if (regex.test(url)) {
                    util.loadWebSiteInBrowser(url);
                    return true;
                }
            }
        },
        getBrowser: function() {
            var browserName = [ "chrome", "firefox", "iexplore" ];
            for (var i = 0; i < browserName.length; i++) {
                if (this.availableBrowser[browserName[i]]) return {
                    name: browserName[i],
                    path: this.availableBrowser[browserName[i]]
                };
            }
        },
        isURLValid: function(url) {
            return !/[,=]/.test(url);
        },
        checkLoaderTag: function(event) {
            if (this.isInternal(event.url)) return false;
            if (event.srcElement.id == "chat_webview") {
                util.loadWebSiteInBrowser(event.url);
                return;
            }
            if (event.url) {
                this.extEvent = event;
                this.externalUrl = event.url;
                this.startLoad();
            }
        },
        shorternUrl: function(url) {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCq81yfRtt-CVaq8AUss9W1fibePVnZswg",
                data: JSON.stringify({
                    longUrl: url
                }),
                dataType: "json"
            }).done(function(res) {
                this.externalUrl = res.id;
                process.platform == "darwin" ? this.runMacCode() : this.runWinCode();
            }.bind(this)).fail(function() {
                this.runExistMethod();
            }.bind(this));
        },
        startLoad: function() {
            if (this.getPlatform() == "win32") this.runWinCode(); else this.runMacCode();
        },
        getChildProcess: function() {
            return require("child_process");
        },
        getPlatform: function() {
            return process.platform;
        },
        runWinCode: function() {
            if (this.isURLValid(this.externalUrl)) {
                this.triggerBat();
            } else this.shorternUrl(this.externalUrl);
        },
        triggerBat: function() {
            var url = this.externalUrl, browserInfoObj = this.getBrowser(), child = this.getChildProcess(), args, exeCMD;
            if (browserInfoObj) {
                switch (browserInfoObj.name) {
                  case "chrome":
                    {
                        args = '"' + browserInfoObj.path + '" -incognito ' + url;
                        break;
                    }

                  case "firefox":
                    {
                        args = '"' + browserInfoObj.path + '" -private-window ' + url;
                        break;
                    }

                  case "iexplore":
                    {
                        args = '"' + browserInfoObj.path + '" -private ' + url;
                        break;
                    }

                  default:
                    break;
                }
                exeCMD = 'start "browser" /b ' + args;
                console.log("Exec Command : ", exeCMD);
                child.exec(exeCMD, function(err, out) {
                    if (err) {
                        console.log("err :: ", err);
                        this.runExistMethod();
                    } else {
                        this.pushEventToAnalytics();
                    }
                }.bind(this));
                return true;
            }
            this.runExistMethod();
        },
        checkBrowserExists: function(browser, path) {
            fs.stat(path, function(err, stat) {
                if (!err) {
                    this.availableBrowser[browser] = path;
                }
            }.bind(this));
        },
        calculatePathFromRegKey: function(regString) {
            if (regString) {
                var regexM = regString.match(/[a-z](:)[^\n"]+/gim);
                if (regexM && regexM[0]) {
                    if (regexM[0].match(/chrome/i)) {
                        this.checkBrowserExists("chrome", regexM[0].trim());
                    } else if (regexM[0].match(/firefox/i)) {
                        this.checkBrowserExists("firefox", regexM[0].trim());
                    } else if (regexM[0].match(/iexplore/i)) {
                        this.checkBrowserExists("iexplore", regexM[0].trim());
                    }
                }
            }
        },
        getBrowserPathFromRegistry: function() {
            var child = this.getChildProcess(), browsers = Object.keys(this.targetBrowser);
            cmd1 = 'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\';
            cmd2 = '\\shell\\open\\command"';
            for (var i = 0; i < browsers.length; i++) {
                child.exec(cmd1 + this.targetBrowser[browsers[i]] + cmd2, function(err, res) {
                    if (!err) {
                        console.log(browsers[i], this.targetBrowser[browsers[i]], res);
                        this.calculatePathFromRegKey(res);
                    }
                }.bind(this));
            }
        },
        runMacCode: function() {
            if (!/[,=]/.test(this.externalUrl)) {
                var child = this.getChildProcess();
                var ChromeAppPath = "/Applications/Google\\ Chrome.app ";
                child.exec("cd " + ChromeAppPath, function(err, stdout) {
                    if (err) this.runExistMethod(); else {
                        this.macBrowser = "Chrome";
                        this.triggerBash();
                    }
                }.bind(this));
            } else this.shorternUrl(this.externalUrl);
        },
        triggerBash: function() {
            if (this.macBrowser) {
                var child = this.getChildProcess(), cmd = util.escapeSpaces(FULLClient.getFilePath() + "/scripts/privateBrowsing.sh");
                child.exec("sh " + cmd + " " + this.externalUrl + " " + this.macBrowser, function(err, stdout) {
                    if (!err) {
                        console.log("Error Free in triggerBash !!!!! :) ");
                        this.pushEventToAnalytics();
                    } else {
                        console.log("Error in triggering Bash script : ", err);
                        this.runExistMethod();
                    }
                }.bind(this));
            }
        },
        pushEventToAnalytics: function() {
            if (util.tabs.getActiveTab()) {
                var params = util.getParameters(util.tabs.getActiveTab().src);
                util.analytics.push(params["accountNumber"], analytics.INCOGNITO_LINK, params["connId"], util.tabs.getActiveTab().src);
            }
        },
        runExistMethod: function() {
            if (this.extEvent.url) {
                util.loadWebSiteInNewWindow(this.extEvent.url);
            }
        },
        init: function() {
            if (/^win/.test(process.platform)) {
                this.getBrowserPathFromRegistry();
            }
        }
    };
    util.subscribe("/open/browse/private/window", openBrowser, openBrowser.checkLoaderTag);
    util.subscribe("/open/browse/private/whitelist", openBrowser, openBrowser.setWhiteList);
    util.subscribe("module/controller/onload", openBrowser, openBrowser.init);
})(util);

(function(R, util) {
    var reLogin = {
        googleAppScript: "https://script.google.com/macros/s/AKfycbzHu2EQVazW4LQdns9i8KcHDwzX37_73cO_O7vldwwe-OCdlu95/exec?",
        wipeData: function() {
            this.removeUserFromSheet(userDAO.getEmail());
            userDAO.clear();
            this.reset();
            util.subscribe("/app/loginModule/onload/recieved", reLogin, reLogin.removeWebview);
        },
        reset: function() {
            util.publish("module/controller/reset");
            util.notification.create({
                title: "Application Cache",
                body: "Removed user data"
            });
            util.publish("/chat/quit/flag", true);
            util.publish("/util/v2/windows/caching/reset");
        },
        removeWebview: function() {
            $("webview:not(#LoginModule)").remove();
            util.publish("/msgModule/handler/", new ClientListener("badgelabel"));
            util.unsubscribe("/app/loginModule/onload/recieved", reLogin, reLogin.removeWebview);
            setTimeout(function() {
                console.log("Sending reLogin message to main ...");
                FULLClient.emitter.sendToMain({
                    eType: "reLogin",
                    name: "reLogin"
                });
            }, 0);
            util.publish("/util/window/events/show", namespace.CONTAINER_CHAT);
            if (/^win/.test(process.platform)) {
                util.publish("/util/window/events/restore", namespace.CONTAINER_CHAT);
            }
        },
        removeUserFromSheet: function(email) {
            if (email && util.isEmail(email)) {
                var url = this.googleAppScript + "userEmail=" + email + "&mode=" + FULLClient.getMode() + "&engine=" + process.versions["electron"] + "&remove=true";
                $.getJSON(url).done(function(infoJSON) {
                    if (infoJSON && /success/.test(infoJSON.status)) {
                        util.getCurrentWindow().webContents.session.flushStorageData(true);
                        setTimeout(function() {
                            util.app.restart();
                        }, 3e3);
                    }
                });
            }
        }
    };
    util.subscribe("/app/user/data/wipe", reLogin, reLogin.wipeData);
    util.subscribe("/app/remove/user/from/sheet", reLogin, reLogin.removeUserFromSheet);
    util.subscribe("/app/cookies/cleared", function() {
        reLogin.wipeData();
        util.clear.isCleared = false;
    });
    module.exports = reLogin;
})(window, util);

(function(R, util, lodash) {
    try {
        var remote = FULLClient.require("electron").remote;
        var dictionary = require("spellchecker");
        var Menu = remote.Menu;
        var noop = lodash.noop;
        var defaults = lodash.defaults;
        var isEmpty = lodash.isEmpty;
        var isFunction = lodash.isFunction;
        var isArray = lodash.isArray;
        var cloneDeep = lodash.clone;
        var source = null;
        var cEvent = null;
        var DEFAULT_NON_EDITABLE_TPL = [ {
            label: "Copy",
            click: executor.bind(null, "copy")
        }, {
            label: "Select All",
            click: executor.bind(null, "selectAll")
        } ];
        var DEFAULT_LINK_TPL = [ {
            label: "Open Link in New Tab",
            click: function() {
                var url = cEvent.linkURL;
                util.loadURL(url);
            }
        }, {
            label: "Open Link in Browser",
            click: function() {
                var url = cEvent.linkURL;
                util.loadWebSiteInBrowser(url);
            }
        }, {
            label: "Copy Link Address",
            click: function() {
                var url = cEvent.linkURL;
                util.copy(url);
            }
        }, {
            type: "separator"
        } ];
        var DEFAULT_SUGGESTIONS_TPL = [ {
            label: "No suggestions",
            click: noop
        }, {
            type: "separator"
        } ];
        var DEFAULT_EDITABLE_TPL = [ {
            label: "Undo",
            click: executor.bind(null, "undo")
        }, {
            type: "separator"
        }, {
            label: "Cut",
            click: executor.bind(null, "cut")
        }, {
            label: "Copy",
            click: executor.bind(null, "copy")
        }, {
            label: "Paste",
            click: executor.bind(null, "paste")
        }, {
            label: "Paste and Match Style",
            click: executor.bind(null, "pasteAndMatchStyle")
        }, {
            type: "separator"
        }, {
            label: "Select All",
            click: executor.bind(null, "selectAll")
        } ];
        function executor(action) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (source && action) {
                source[action].apply(null, args);
                cEvent = source = null;
            }
        }
        var contextMenu = {
            setSource: function(src) {
                if (src) {
                    return source = src;
                }
            },
            setContextEventObj: function(cEve) {
                if (cEve) {
                    return cEvent = cEve;
                }
            },
            getSelection: function(cEve) {
                if (cEve && cEve.misspelledWord) {
                    return {
                        isMisspelled: true,
                        spellingSuggestions: getSuggestions(cEve.misspelledWord)
                    };
                }
            },
            getSuggestions: function(word) {
                if (word && (word = word.toLowerCase())) {
                    return dictionary.getCorrectionsForMisspelling(word).slice(0, 5);
                }
            },
            addContentEditable: function(mainTMP) {
                if (/^win/.test(process.platform)) DEFAULT_EDITABLE_TPL.splice(6, 1);
                mainTMP.push.apply(mainTMP, DEFAULT_EDITABLE_TPL);
                return mainTMP;
            },
            addSuggestions: function(mainTMP, word) {
                var suggestions = this.getSuggestions(word);
                console.log("suggestions we got for word[" + word + "] : ", suggestions);
                if (!suggestions.length) {
                    mainTMP.unshift.apply(mainTMP, DEFAULT_SUGGESTIONS_TPL);
                    return mainTMP;
                }
                mainTMP.unshift.apply(mainTMP, suggestions.map(function(suggestion) {
                    return {
                        label: suggestion,
                        click: executor.bind(null, "replaceMisspelling", suggestion)
                    };
                }).concat({
                    type: "separator"
                }));
                return mainTMP;
            },
            addLinkOptions: function(mainTMP, url) {
                mainTMP.push.apply(mainTMP, DEFAULT_LINK_TPL);
                return mainTMP;
            },
            getTemplate: function(contextEvObj) {
                var template = [];
                if (contextEvObj.isEditable) {
                    if (contextEvObj.misspelledWord) {
                        this.addSuggestions(template, contextEvObj.misspelledWord);
                    }
                    this.addContentEditable(template);
                } else if (contextEvObj.linkURL) {
                    this.addLinkOptions(template);
                    template.push.apply(template, DEFAULT_NON_EDITABLE_TPL);
                } else {
                    template.push.apply(template, DEFAULT_NON_EDITABLE_TPL);
                }
                return template;
            },
            build: function(template) {
                if (template) return Menu.buildFromTemplate(template);
            },
            run: function(menu) {
                if (menu) {
                    menu.popup(remote.getCurrentWindow());
                    return true;
                }
            }
        };
        util.subscribe("/context/menu/event/", function(srcEvent, contextEvent) {
            contextMenu.setSource(srcEvent.sender);
            contextMenu.setContextEventObj(contextEvent);
            var template = contextMenu.getTemplate(cEvent);
            var menu = contextMenu.build(template);
            contextMenu.run(menu);
        });
        module.exports = contextMenu;
    } catch (e) {
        console.log("Error in context-menu impl ", e.message);
        console.log("Error in context-menu impl ", e.stack);
    }
})(this, util, _);

(function(R, M) {
    var fs = require("fs");
    var child = require("child_process").exec;
    var writePermissionChecker = {
        dom: {
            updateFailedPopup: $("#updateFailedPopup"),
            close: $("#updateFailedPopup").find(".btnLightblue"),
            background: $(".transparentBg")
        },
        _canStart: function() {
            return userDAO.getSkillByName("FullWork") && util.window.getName() == "AnyWhereWorks" || !userDAO.getSkillByName("FullWork") && util.window.getName() == "FULL";
        },
        checkUserWritePermissionAndStart: function(permissionCB) {
            if (!this._canStart()) return false;
            if (/darwin/.test(process.platform)) {
                fs.access(FULLClient.getFilePath(), fs.W_OK, function(err, stdin, stdout) {
                    if (err) {
                        console.log("User dont have permission to Install files. Please Contact IT.!", err);
                        this.showPermissionDeniedPopUp();
                        permissionCB.call(this, false);
                    } else {
                        console.log("User have Permission to write file, going forward with engine Updation.");
                        permissionCB.call(this, true);
                    }
                }.bind(this));
            } else {
                child("cls -oq", function(err) {
                    if (err) {
                        console.warn("Error:::", err);
                        console.log("User dont have permission to Install files. Please Contact IT.!", err);
                        this.showPermissionDeniedPopUp();
                        permissionCB.call(this, false);
                    } else {
                        permissionCB.call(this, true);
                    }
                });
            }
        },
        cachePopupDom: function() {
            this.addListernerForPermissionPopUpButton();
        },
        hidePopUp: function() {
            this.dom.updateFailedPopup.hide();
        },
        showPopUp: function() {
            this.dom.updateFailedPopup.show();
        },
        showBackground: function() {
            this.dom.background.show();
        },
        hideBackground: function() {
            this.dom.background.hide();
        },
        addListernerForPermissionPopUpButton: function() {
            if (this.dom.updateFailedPopup && this.dom.close) {
                this.dom.close.click(function() {
                    console.log("User closing Permission Popup..!");
                    this.hideBackground();
                    this.hidePopUp();
                }.bind(this));
            }
        },
        showPermissionDeniedPopUp: function() {
            this.showBackground();
            this.showPopUp();
        },
        hidePermissionDeniedPopUp: function() {
            this.hideBackground();
            this.hidePopUp();
        }
    };
    module.exports = writePermissionChecker;
    R["writePermissionChecker"] = writePermissionChecker;
    M.subscribe("/start/checkUserWritePermissionAndStart/", writePermissionChecker, writePermissionChecker.checkUserWritePermissionAndStart);
    M.subscribe("module/controller/onload", writePermissionChecker, writePermissionChecker.cachePopupDom);
})(this, util);

(function(R, util) {
    var fs = FULLClient.require("fs");
    var path = FULLClient.require("path");
    var engineUpdater = {
        infoJson: null,
        userPermission: false,
        periodicCheck: null,
        engineVersion: process.versions["electron"],
        googleAppScript: "https://script.google.com/macros/s/AKfycbzHu2EQVazW4LQdns9i8KcHDwzX37_73cO_O7vldwwe-OCdlu95/exec?",
        _canStart: function() {
            return userDAO.getSkillByName("FullWork") && util.window.getName() == "AnyWhereWorks" || !userDAO.getSkillByName("FullWork") && util.window.getName() == "FULL";
        },
        getTempDirectory: function() {
            return util.getTempDirectory();
        },
        getConfigInfoFromTemp: function() {
            try {
                return require(path.join(this.getTempDirectory(), "appMode.json"));
            } catch (err) {
                return false;
            }
        },
        writeIntoTemp: function(appPath, infoJSON) {
            var appMode;
            if (infoJSON && FULLClient.isModeValid(infoJSON.modetoswitch)) appMode = infoJSON.modetoswitch; else appMode = FULLClient.getMode();
            var data = JSON.stringify({
                appMode: appMode
            });
            fs.writeFile(path.join(this.getTempDirectory(), "appMode.json"), data, function(err) {
                if (err) {
                    console.warn("Error in Writing appMode in Engine Updation");
                }
                if (process.platform == "darwin") this.replaceMacApp(appPath, infoJSON.downloadUrl.mac.filename); else if (process.platform == "win32") this.replaceWinApp(appPath, infoJSON.downloadUrl.win.filename);
            }.bind(this));
        },
        deleteTmpConfig: function(config) {
            if (config) {
                console.warn("Mode switch is available  : " + config.appMode);
                tmpPath = path.join(this.getTempDirectory(), "appMode.json");
                fs.unlink(tmpPath, function(err) {
                    if (err) console.log("Error in deleting appMode tmpPath : ");
                    FULLClient.setMode(config.appMode);
                });
                return true;
            }
            throw new Error("Invalid param : " + typeof config);
        },
        checkForUserAccess: function(json) {
            if (json && json.wipe) {
                console.log("User dont have access use application, wiping data :", json);
                FULLClient.ipc.sendToSB({
                    name: "analytics",
                    accountNumber: null,
                    eventAction: analytics.WIPE_DATA,
                    connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                    metaInfo: "Wiping data for user using spreadsheet."
                });
                util.publish("/remove/access/data/");
                return true;
            }
        },
        popUpDownloadUI: function() {
            if (this._canStart() && this.infoJson && this.infoJson.status == "success") {
                console.log("Showing UI for engineUpdate", this.infoJson);
                util.publish("updateUI/ShowUI/container", "engineUpdate", this.infoJson, this.downloadAndInstall, this);
            }
        },
        isGuestUpdateAvailable: function() {
            var guestInfo = util.storage.get("guestUpdate");
            if (guestInfo && Object.keys(guestInfo).length) {
                return true;
            }
        },
        start: function(isPeriodicCheck) {
            if (compareVersions(process.versions.electron, "1.3.13") == -1) {
                console.warn("============== patching to ============== 1.3.13");
                this.patch();
                return;
            }
            if (!this._canStart()) return false;
            if (this.isGuestUpdateAvailable() && !isPeriodicCheck) return false;
            $.getJSON(this.googleAppScript + "userEmail=" + userDAO.getEmail() + "&mode=" + FULLClient.getMode() + "&engine=" + process.versions["electron"]).done(function(infoJSON) {
                this.infoJson = infoJSON ? infoJSON : null;
                if (this.checkForUserAccess(infoJSON)) return;
                var tmpConfig = this.getConfigInfoFromTemp();
                if (FULLClient.getMode() != "code") {
                    console.log("Engine Updater response : ", infoJSON);
                    if (infoJSON.version && infoJSON.version.trim() && !/[^0-9.]/.test(infoJSON.version) && this.engineVersion != infoJSON.version && infoJSON.status == "success") {
                        this.popUpDownloadUI();
                    } else if (infoJSON.modetoswitch && FULLClient.isModeValid(infoJSON.modetoswitch) && FULLClient.getMode() != infoJSON.modetoswitch) {
                        FULLClient.setMode(infoJSON.modetoswitch);
                    } else if (tmpConfig) {
                        this.deleteTmpConfig(tmpConfig);
                        console.warn("Removed appMode key from localStorage");
                    } else {
                        console.warn("Commencing ASAR updater.");
                        util.publish("/asar/update/commence");
                    }
                }
            }.bind(this));
        },
        patch: function() {
            var infoJSON = this.infoJson = {
                mode: "1.x",
                version: "1.3.13",
                name: "EngineUpdater",
                downloadUrl: {
                    mac: {
                        url: "http://images.sb.a-cti.com/TC/electron/live/engine/app-mac-1.3.13.zip",
                        filename: "AnywhereWorks.app"
                    },
                    win: {
                        url: "http://images.sb.a-cti.com/TC/electron/live/engine/app-win-1.3.13.zip",
                        filename: "app-win-1.3.13.exe"
                    }
                },
                status: "success",
                wipe: false,
                modetoswitch: false
            };
            if (this.checkForUserAccess(this.infoJson)) return;
            var tmpConfig = this.getConfigInfoFromTemp();
            if (FULLClient.getMode() != "code") {
                console.log("Engine Updater response : ", infoJSON);
                if (infoJSON.version && infoJSON.version.trim() && !/[^0-9.]/.test(infoJSON.version) && this.engineVersion != infoJSON.version && infoJSON.status == "success") {
                    this.popUpDownloadUI();
                } else if (infoJSON.modetoswitch && FULLClient.isModeValid(infoJSON.modetoswitch) && FULLClient.getMode() != infoJSON.modetoswitch) {
                    FULLClient.setMode(infoJSON.modetoswitch);
                } else if (tmpConfig) {
                    this.deleteTmpConfig(tmpConfig);
                    console.warn("Removed appMode key from localStorage");
                } else if (!isPeriodicCheck) {
                    console.warn("Commencing ASAR updater.");
                    util.publish("/asar/update/commence");
                }
            }
        },
        downloadAndInstall: function() {
            var infoJSON = arguments[0];
            var UpdationTrigger = arguments[1];
            if (UpdationTrigger && infoJSON) {
                console.debug("Starting download process.. ");
                this.downloadZip(infoJSON, function(extractUrl) {
                    this.extractZip(extractUrl, function(appPath) {
                        this.writeIntoTemp(appPath, infoJSON);
                    }.bind(this));
                }.bind(this));
            }
        },
        downloadZip: function(response, cb) {
            var path = require("path"), downloadPercentage = 0, previousPercentage, currentPercentage, file, temp = util.getTempDirectory();
            temp = path.resolve(temp + "/EngineUpdates.zip");
            var downloadZipUrl = this.getDownloadZipUrl(response);
            downloadZipUrl = downloadZipUrl.replace(/(http:\/\/images.sb.a-cti.com)/, "https://storage.googleapis.com/images.sb.a-cti.com");
            http = util.isHttps(downloadZipUrl) ? require("https") : require("http");
            console.log("URL Path engine being downloaded :", downloadZipUrl);
            var req = http.get(downloadZipUrl, function(res) {
                if (res.statusCode == 200) {
                    util.publish("updateUI/hideDownloadWinandshowProgress");
                    var len = parseInt(res.headers["content-length"], 10);
                    var total = len / 1e6;
                    if (res.headers["content-type"] == "application/zip" || res.headers["content-type"] == "application/x-zip-compressed") {
                        file = fs.createWriteStream(temp);
                        res.on("data", function(chunk) {
                            downloadPercentage += chunk.length;
                            currentPercentage = Math.floor(downloadPercentage / res.headers["content-length"] * 100);
                            if (previousPercentage != currentPercentage) {
                                previousPercentage = currentPercentage;
                                util.publish("progressUI/updatePercentage", previousPercentage);
                            }
                        }.bind(this));
                        res.pipe(file);
                        res.resume();
                        res.on("end", function end() {
                            cb(temp);
                        });
                    } else {
                        util.publish("updateUI/hidePopUp");
                    }
                } else {
                    util.publish("updateUI/hidePopUp");
                }
            }.bind(this));
            req.on("error", function(err) {
                console.log("Error in downloading file::", err);
            }.bind(this));
        },
        extractZip: function(src, cb) {
            var child_process = this.createChildProcess(), path = require("path"), unzipChildProcessCmd, dest;
            if (process.platform == "darwin") {
                dest = util.getTempDirectory() + "EngineUpdates";
                unzipChildProcessCmd = 'unzip -oq "' + src + '" -d "' + dest + '" ';
            } else if (process.platform == "win32") {
                dest = path.resolve(process.env.TEMP + "/EngineUpdates");
                unzipChildProcessCmd = ' "' + path.resolve(FULLClient.getFilePath(), "tools/unzip.exe") + '" -o "' + src + '" -d "' + dest + '" ';
            }
            console.log("Path : " + unzipChildProcessCmd);
            child_process.exec(unzipChildProcessCmd, function(err) {
                if (!err) cb(dest); else {
                    console.log("Error in Extracting a file using child process : " + err);
                }
            });
        },
        createChildProcess: function() {
            return require("child_process");
        },
        replaceMacApp: function(dest, filename) {
            console.log("What is this :: " + dest);
            var appNameToQuit = util.escapeSpaces(FULLClient.getAppName());
            var sourcePath = util.escapeSpaces(path.join(dest, filename));
            var destionationPath = util.escapeSpaces(path.join("/Applications", filename));
            var currentAppPath = util.escapeSpaces(process.execPath.replace(/([\/]Contents.*)/g, ""));
            var shellScriptPath = util.escapeSpaces(path.join(FULLClient.getFilePath(), "scripts", "engine.sh"));
            var script = "sh " + " " + shellScriptPath + " " + appNameToQuit + " " + sourcePath + " " + destionationPath + " " + currentAppPath;
            console.log("script Details : " + script);
            var child = this.createChildProcess();
            child.exec(script, function(err) {
                if (err) console.log("Error in child_process : " + err);
            });
        },
        replaceWinApp: function(dest, filename) {
            var child_process = this.createChildProcess();
            var execPath = path.join(process.env.TEMP, "EngineUpdates", filename);
            console.log("Path : " + execPath);
            child_process.exec('"' + execPath + '"', function(err) {
                if (err) {
                    util.publish("updateUI/hidePopUp");
                    console.log("User denied permission or failed to execute the update.exe : ", err);
                }
            });
        },
        getDownloadZipUrl: function(response) {
            if (process.platform == "darwin") return response.downloadUrl.mac.url; else return response.downloadUrl.win.url;
        },
        checkUserWritePermissionAndStart: function(periodicCheck) {
            this.periodicCheck = periodicCheck ? periodicCheck : false;
            util.publish("/start/checkUserWritePermissionAndStart/", this.permissionCallback);
        },
        permissionCallback: function(permission) {
            if (permission) {
                engineUpdater.userPermission = permission;
                engineUpdater.periodicCheck ? engineUpdater.start(true) : engineUpdater.start();
            } else {
                console.log("User dont have permission :", permission);
                engineUpdater.userPermission = permission;
            }
        }
    };
    R["engineUpdater"] = engineUpdater;
    module.exports = engineUpdater;
    setInterval(function() {
        engineUpdater.checkUserWritePermissionAndStart(true);
    }, FULLClient.getMode() == "test-1.x" ? 6e4 : 3e5);
    util.subscribe("/start/engine/updater/", engineUpdater, engineUpdater.checkUserWritePermissionAndStart);
})(this, util);

(function(R, mediator) {
    function hideCancelButtons() {
        $(".btnDarkblue").hide();
        $(".closeAct").hide();
    }
    hideCancelButtons();
    function showCancelButtons() {
        $(".btnDarkblue").show();
        $(".closeAct").show();
    }
    function checkButtons() {
        var v2Obj = util.storage.get("v2");
        if (v2Obj && v2Obj.lastReceivedStatus && new RegExp(v2Obj.lastReceivedStatus, "ig").test([ "ActiveResponse", "Active Response", "Default", "Busy", "Repeat", "Chat", "PendingBusy", "CallingCustomer", "Video Call" ])) {
            showCancelButtons();
        } else hideCancelButtons();
    }
    var popUpVersion = {
        headingVersion: $(".updateRt").find("h1"),
        isAlpha: function(version) {
            return /[a-z]/i.test(version);
        },
        isValidTagVersion: function(version) {
            if (version && !this.isAlpha(version)) return version;
        },
        show: function(version) {
            if (version) {
                return $(".updateLf").find("p:eq(1)").text("v" + version);
            }
        },
        hide: function() {
            return $(".updateLf").find("p:eq(1)").text("");
        },
        getHeadingText: function() {
            return "What's new in this update?";
        },
        changeHeadingVersion: function(version) {
            var headingTxt;
            if (version) headingTxt = "What's new in v" + version + "?"; else headingTxt = this.getHeadingText();
            return this.headingVersion.text(headingTxt);
        },
        update: function(version) {
            if (version && this.isValidTagVersion(version)) {
                this.changeHeadingVersion(version);
                this.show(version);
            } else {
                this.changeHeadingVersion();
                this.hide();
            }
        }
    };
    var popUpText = {
        gitAccessToken: "e18284d04c7da26a960909d4f0ff9632f749c3f2",
        defaultMsg: "<p>AnyWhereWorks have some Updates, Restart to apply the changes.</p>",
        marked: null,
        releaseDetails: $(".updateRt").find("div"),
        makeLinkFunctional: function() {
            if (this.addTargetToLinks()) this.setListenersToLinks();
        },
        addTargetToLinks: function() {
            var links = this.getLinks();
            if (links && links.length) return links.attr("target", "_blank");
        },
        getLinks: function() {
            return $(".updateRt").find("div").find("a");
        },
        setListenersToLinks: function() {
            util.getCurrentWindow().webContents.on("new-window", function(event, urlToOpen) {
                event.preventDefault();
                util.loadWebSiteInBrowser(urlToOpen);
            });
        },
        init_markDown_module: function() {
            this.marked = FULLClient.require("marked");
            this.marked.setOptions({
                gfm: true,
                breaks: true
            });
            return this.marked;
        },
        update: function(updateType, metaInfo) {
            this.fetchDetailsAndUpdateInUI(updateType, metaInfo, this.updateDetailsAndShowUI, this);
        },
        updateErrorHandler: function(updateType, metaInfo, isPeriodicCheck) {
            if (updateUI.isContainerUpdate(updateType)) {
                this.attachDefaultMsg();
                this.showPopUp(metaInfo, updateType);
            } else {
                console.warn("1. Lock released for getting new updates");
                updateUI.setProgressFlag(false);
                updateUI.releaseActiveUpdate();
                console.warn("2. Cleared guest update localStorage info.");
                guestPage.clearInfo();
                console.warn("3. Starting Engine updater");
                util.publish("/start/engine/updater/", isPeriodicCheck);
            }
        },
        showPopUp: function(metaInfo, updateType) {
            checkButtons();
            updateUI.show.call(updateUI, metaInfo, updateType);
            updateUI.focusWindow();
        },
        updateDetailsAndShowUI: function(updateType, metaInfo, tagInfo) {
            var releaseMsg = tagInfo.body;
            if (releaseMsg) {
                this.formatAndAppendText(releaseMsg);
                this.showPopUp(metaInfo, updateType);
            } else {
                this.updateErrorHandler(updateType, metaInfo, true);
            }
        },
        getVersionByUpdate: function(version, updateType) {
            if (version && updateType) {
                if (updateType == "appUpdate") return version = "v" + version; else if (updateType == "engineUpdate") return version = "engineV" + version; else return version;
            }
        },
        getReqUrl: function(metaInfo) {
            if (metaInfo && metaInfo.updateVersion) {
                var repo, tag_name;
                if (metaInfo.gitRepoName) repo = metaInfo.gitRepoName; else repo = "FULLClient-Electron";
                return "https://api.github.com/repos/Adaptavant/" + repo + "/releases/tags/" + metaInfo.updateVersion + "?access_token=" + this.gitAccessToken;
            }
        },
        fetchDetailsAndUpdateInUI: function(updateType, metaInfo, callBack, context) {
            if (updateType && metaInfo && callBack) {
                metaInfo.updateVersion = this.getVersionByUpdate(metaInfo.version, updateType);
                console.debug("update version in meta info ", metaInfo.updateVersion);
                console.debug("git url :", this.getReqUrl(metaInfo));
                return this.getReleaseText(this.getReqUrl(metaInfo)).done(function successCB(tagInfo) {
                    console.log("successCB in fetch details : ", tagInfo);
                    if (callBack) callBack.call(context || null, updateType, metaInfo, tagInfo);
                }.bind(this)).fail(function failCB(r) {
                    console.log("Error in Fetching ReleaseDetails :", r);
                    this.updateErrorHandler(updateType, metaInfo, true);
                }.bind(this));
            }
        },
        getReleaseText: function(gitReleaseUrl) {
            if (gitReleaseUrl) {
                return $.ajax({
                    url: gitReleaseUrl,
                    type: "GET",
                    dataType: "json",
                    processData: false,
                    contentType: false
                });
            }
            throw new Error("git ReleasesUrl Not found" + gitReleaseUrl);
        },
        attachDefaultMsg: function() {
            this.attach(this.defaultMsg);
        },
        formatToMarkDown: function(releaseText) {
            if (releaseText) {
                var result = this.marked(releaseText);
                return result;
            }
        },
        formatAndAppendText: function(releaseText) {
            if (releaseText) {
                this.attach(this.formatToMarkDown(releaseText));
                this.makeLinkFunctional();
            }
        },
        attach: function(formattedTxt) {
            if (formattedTxt) {
                this.clear();
                this.releaseDetails.append(formattedTxt);
            }
        },
        clear: function() {
            return this.releaseDetails.text("");
        }
    };
    popUpText.init_markDown_module();
    var updateUI = {
        updateInProgress: false,
        updatePanel: $(".updatePanel"),
        xClose: $(".updatePanel").find("code"),
        downloadBtn: $(".updatePanel").find(".btnGreen"),
        closeBtn: $(".updatePanel").find(".btnDarkblue"),
        updateFailPanel: $(".updateFailedPopup"),
        transparentBg: $("#transparentBg"),
        activeUpdate: null,
        cbDfd: null,
        cbInfo: {
            cb: null,
            context: null,
            metaInfo: null,
            uType: null
        },
        clearDfd: function() {
            this.cbDfd = null;
        },
        clearCbInfo: function() {
            this.cbInfo = {};
        },
        cacheCbInfo: function(updateType, metaInfo, cb, cbContext) {
            if (this.isValidCB(cb)) {
                this.cbInfo["cb"] = cb;
                if (updateType) this.cbInfo["uType"] = updateType;
                this.cbInfo["info"] = metaInfo;
                this.cbInfo["context"] = cbContext;
            } else {
                this.clearCbInfo();
            }
        },
        isValidCB: function(callBack) {
            if (callBack && typeof callBack == "function") {
                return true;
            }
        },
        show: function(metaInfo, updateType) {
            this.updatePanel.focus();
            this.setActiveUpdate(updateType);
            this.transparentBg.show();
            if (this.isGuestUpdate(updateType) && metaInfo.cancelBtnName && /close/i.test(metaInfo.cancelBtnName)) {
                this.downloadBtn.hide();
            } else {
                this.downloadBtn.show();
            }
            this.updatePanel.show();
        },
        hide: function(updateStillActive) {
            if (!updateStillActive) this.releaseActiveUpdate();
            this.transparentBg.hide();
            this.updatePanel.hide();
        },
        focusWindowOnUpdateCheck: function() {
            if (util.checkForUpdates.isFromMenu()) {
                this.focusWindow();
            }
        },
        showFailPopuUp: function() {
            this.updateFailPanel.show();
        },
        hideFailPopuUp: function() {
            this.updateFailPanel.hide();
        },
        hideDownloadWinandshowProgress: function() {
            this.hide(true);
            progressUI.show();
        },
        manualClearCache: function() {
            this.hide();
            progressUI.hide();
        },
        renameDownloadBtn: function(btnName) {
            if (btnName) this.downloadBtn.text(btnName); else this.downloadBtn.text("Restart");
        },
        renameCancelBtn: function(btnName) {
            if (btnName) this.closeBtn.text(btnName); else this.closeBtn.text("Later");
        },
        isContainerUpdate: function(updateType) {
            if (updateType && updateType == "appUpdate" || updateType == "engineUpdate") return true;
        },
        isGuestUpdate: function(updateType) {
            if (updateType && /guest/.test(updateType)) return true;
        },
        updatePopUpInfo: function(updateType, metaInfo) {
            if (this.isContainerUpdate(updateType)) {
                this.renameDownloadBtn("Update");
            } else {
                this.renameDownloadBtn(metaInfo.restartBtnName);
                this.renameCancelBtn(metaInfo.cancelBtnName);
            }
            popUpText.update(updateType, metaInfo);
            popUpVersion.update(metaInfo.version);
        },
        focusWindow: function() {
            util.getCurrentWindow().show();
            util.getCurrentWindow().focus();
        },
        isOtherUpdateActive: function() {
            if (updateUI.activeUpdate) return true;
        },
        setActiveUpdate: function(updateType) {
            if (updateType) this.activeUpdate = updateType;
        },
        releaseActiveUpdate: function() {
            this.activeUpdate = null;
        },
        isValidVersion: function(version) {
            if (/[0-9]/i.test(version)) {
                var arr = version.split(".");
                var len = arr.length;
                if (arr && len && len == 3) {
                    for (var i = 0; i < len; i++) {
                        var num = parseInt(arr[i]);
                        if (isNaN(num)) return false; else {
                            if (i == len - 1) return true;
                        }
                    }
                } else return false;
            } else return false;
        },
        validateVersionForContainer: function(updateType, metaInfo) {
            if (this.isContainerUpdate(updateType)) {
                if (metaInfo.version && this.isValidVersion(metaInfo.version)) {
                    return true;
                } else return false;
            } else return true;
        },
        cacheCBAndShowUI: function(updateType, metaInfo, cb, context) {
            this.setActiveUpdate(updateType);
            this.cacheCbInfo(updateType, metaInfo, cb, context);
            this.updatePopUpInfo(updateType, metaInfo);
        },
        showUpdateInfo: function(updateType, metaInfo, cb, context) {
            if (this.validateVersionForContainer(updateType, metaInfo)) {
                if (!this.isOtherUpdateActive()) {
                    console.log("********* other update not active ********* so proceed ", updateType);
                    this.cacheCBAndShowUI(updateType, metaInfo, cb, context);
                } else {
                    console.log("!!!!!! other update is active !!!!! ,so cancel ", updateType);
                    this.focusWindowOnUpdateCheck();
                    if (this.isGuestUpdate(updateType)) {
                        guestPage.cancelUpdate(metaInfo);
                    }
                }
            }
        },
        showGuestUpdateInfo: function(metaInfo, onLoadClosBtnCB, context) {
            var guestInfo = metaInfo;
            guestInfo.cancelBtnName = "Close";
            this.cacheCBAndShowUI("guest", guestInfo, onLoadClosBtnCB, context);
        },
        setProgressFlag: function(bool) {
            this.updateInProgress = bool;
        },
        isUpdateInProgress: function() {
            return this.updateInProgress;
        },
        commenceUpdate: function() {
            if (!this.isUpdateInProgress()) {
                this.setProgressFlag(true);
                util.checkForUpdates.setFlag(false);
                if (this.cbInfo["cb"]) {
                    this.cbInfo["cb"].apply(this.cbInfo["context"] || this, [ this.cbInfo["info"], true ]);
                    this.clearCbInfo();
                } else {
                    this.setProgressFlag(false);
                    console.warn("Callback is not provided for commencing Update..", this.cbInfo["cb"]);
                }
            }
        },
        cancelUpdate: function() {
            util.checkForUpdates.setFlag(false);
            this.hide();
            if (this.cbInfo["uType"] && this.isGuestUpdate(this.cbInfo["uType"]) && this.cbInfo["cb"]) {
                this.cbInfo["cb"].apply(this.cbInfo["context"] || this, [ this.cbInfo["info"], false ]);
            }
        },
        sendMessageToMain: function(obj) {
            if (FULLClient && obj) {
                FULLClient.ipc.sendToSB(obj);
            }
        },
        setListenersOnLoad: function() {
            if (this.updatePanel) {
                console.log("setting Listeners OnLoad ..");
                if (this.downloadBtn) {
                    this.downloadBtn.click(function() {
                        this.sendMessageToMain({
                            name: "analytics",
                            accountNumber: null,
                            eventAction: analytics.UPDATE_BTN_CLICKED,
                            connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                            metaInfo: "User clicking download btn in updater"
                        });
                        this.commenceUpdate();
                    }.bind(this));
                }
                if (this.closeBtn) {
                    this.closeBtn.click(function() {
                        this.sendMessageToMain({
                            name: "analytics",
                            accountNumber: null,
                            eventAction: analytics.UPDATE_LATER_CLICKED,
                            connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                            metaInfo: "User clicking download Later btn in updater"
                        });
                        this.cancelUpdate();
                    }.bind(this));
                }
                if (this.xClose) {
                    this.xClose.click(function() {
                        this.cancelUpdate();
                    }.bind(this));
                }
            }
            guestPage.onModuleLoad();
        }
    };
    mediator.subscribe("module/controller/onload", updateUI, updateUI.setListenersOnLoad);
    mediator.subscribe("updateUI/cancelUpdate", updateUI, updateUI.cancelUpdate);
    mediator.subscribe("updateUI/ShowUI/container", updateUI, updateUI.showUpdateInfo);
    mediator.subscribe("updateUI/hideDownloadWinandshowProgress", updateUI, updateUI.hideDownloadWinandshowProgress);
    mediator.subscribe("/app/loginModule/onload/recieved", updateUI, updateUI.manualClearCache);
    var progressUI = {
        processPanel: $(".updating"),
        percentage: $(".updating").find("p"),
        progbarBelow50: $(".updating").find(".circle_bar.below50.updatedSuccess1"),
        progbarAbove50: $(".updating").find(".circle_bar.above50.updatedSuccess1"),
        below50css: "linear-gradient(90deg, #cccccc 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(91deg, #00cd93 50%, #cccccc 50%, #cccccc)",
        above50css: "linear-gradient(-90deg, #00cd93 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #00cd93 50%, #cccccc 50%, #cccccc)",
        show: function() {
            updateUI.transparentBg.show();
            this.processPanel.show();
        },
        hide: function() {
            updateUI.transparentBg.hide();
            this.processPanel.hide();
        },
        circlebarUI: function(percent) {
            if (percent < 50) {
                var degree = Math.floor(3.6 * percent);
                return this.progbarBelow50.css("background-image", this.below50css.replace(/91/, 90 + degree))[0];
            } else {
                this.progbarBelow50.hide();
                this.progbarAbove50.show();
                var degree = Math.floor(3.6 * (percent - 50));
                return this.progbarAbove50.css("background-image", this.above50css.replace(/-90/, -90 + degree))[0];
            }
        },
        updatePercentage: function(percent) {
            this.circlebarUI(percent);
            this.percentage.text(percent + "% - Completed ...");
        }
    };
    mediator.subscribe("progressUI/updatePercentage", progressUI, progressUI.updatePercentage);
    mediator.subscribe("progressUI/showProgress", progressUI, progressUI.show);
    mediator.subscribe("progressUI/hideProgress", progressUI, progressUI.hide);
    var guestPage = {
        checkForUpdates: false,
        setFlag: function(bool) {
            this.checkForUpdates = bool;
        },
        getViewByUrl: function(lUrl) {
            if (lUrl) {
                var wv = $("webview");
                for (var i = wv.length - 1; i >= 0; i--) {
                    if (wv[i].src.trim() == lUrl.trim() || wv[i].src.trim().includes(lUrl.trim())) {
                        return wv[i];
                    }
                }
            }
        },
        getBtnClickOption: function(restartBtn) {
            if (restartBtn) return "restartBtnClick"; else return "cancelBtnClick";
        },
        reloadChatWebview: function(view) {
            if (view) {
                view.reloadIgnoringCache();
            }
        },
        commenceUpdate: function(view) {
            console.warn("reloading guest page...");
            updateUI.setProgressFlag(false);
            this.clearInfo();
            updateUI.hide();
            this.reloadChatWebview(view);
        },
        cancelUpdate: function(metaInfo) {
            this.storeInfo(metaInfo);
            setTimeout(function() {
                console.debug("calling guest update with metaInfo :after one hour", metaInfo);
                this.showUpdateDetailsWithRestart(metaInfo);
            }.bind(this), FULLClient.getMode() == "test" ? 2e4 : 36e5);
        },
        postMessageToGuestPage: function(metaInfo, btnClkBoolean, isForce) {
            var view = this.getViewByUrl(metaInfo.domain);
            if (view) {
                var infoObj = new ClientListener(this.getBtnClickOption(btnClkBoolean));
                console.log("Posting message to guest as :", infoObj);
                util.webview.post(view, infoObj);
                if (!isForce) {
                    if (btnClkBoolean) {
                        this.commenceUpdate(view);
                        this.setFlag(false);
                    } else {
                        this.cancelUpdate(metaInfo);
                        if (this.checkForUpdates) {
                            this.setFlag(false);
                            util.publish("/start/engine/updater/");
                        } else {
                            util.publish("/start/engine/updater/", true);
                        }
                    }
                }
            }
        },
        isValidMsg: function(msg) {
            if (msg && msg.version && msg.gitRepoName) {
                return true;
            }
        },
        isEmptyObj: function(obj) {
            return Object.keys(obj).length === 0;
        },
        retrieveInfo: function() {
            var guestInfo = util.storage.get("guestUpdate");
            if (guestInfo && !this.isEmptyObj(guestInfo)) return guestInfo; else return false;
        },
        storeInfo: function(metaInfo) {
            if (metaInfo) util.storage.set("guestUpdate", metaInfo);
        },
        clearInfo: function() {
            util.storage.set("guestUpdate", {});
        },
        onLoadClosBtnCB: function(msg) {
            popUpText.updateErrorHandler("guest");
            this.postMessageToGuestPage(msg, true, true);
        },
        showUpdateDetailsOnly: function(msg) {
            updateUI.showGuestUpdateInfo(msg, this.onLoadClosBtnCB, this);
        },
        showUpdateDetailsWithRestart: function(msg) {
            console.log("Show details with restart", msg);
            updateUI.showUpdateInfo("guest", msg, this.postMessageToGuestPage, this);
        },
        checkUpdateOnMenuClick: function() {
            console.log("#checking GuestUpdate on menuClick");
            var guestInfo = this.retrieveInfo();
            if (guestInfo) {
                this.setFlag(true);
                console.log("#GuestUpdte available in LocStore");
                this.showUpdateDetailsWithRestart(guestInfo);
            } else {
                console.log("#GuestUpdte not available in LocStore");
                this.setFlag(false);
                util.publish("/start/engine/updater/");
            }
        },
        onModuleLoad: function() {
            var guestInfo = this.retrieveInfo();
            if (guestInfo) {
                this.showUpdateDetailsOnly(guestInfo);
            }
        },
        showGuestUpdate: function(msg) {
            if (updateUI.isOtherUpdateActive()) {
                console.warn("other update is active cancelling Guest Update and StoreInfo in LocStore");
                updateUI.focusWindowOnUpdateCheck();
                this.cancelUpdate(msg);
            } else {
                if (this.isValidMsg(msg)) this.showUpdateDetailsWithRestart(msg);
            }
        },
        msgHandler: function(msg) {
            console.log("POPUI guest update : ", msg);
            switch (msg.name) {
              case "showUpdatePopup":
                {
                    this.showGuestUpdate(msg);
                    break;
                }

              default:
                {
                    console.warn("CAPTURE IT popUI module ", msg);
                    break;
                }
            }
        }
    };
    mediator.subscribe("guestPage/checkUpdate/onMenuClick", guestPage, guestPage.checkUpdateOnMenuClick);
    mediator.subscribe("updateUI/guestPage/msgHandler", guestPage, guestPage.msgHandler);
    module.exports.UI = R["updateUI"] = updateUI;
    module.exports.progressUI = progressUI;
    module.exports.popUpVersion = popUpVersion;
    module.exports.popUpText = popUpText;
    module.exports.guestPage = guestPage;
})(this, util);

(function($, util) {
    try {
        var mailhelper = {
            mailSend: function(data, callback) {
                console.log("Pushing Mail to Dev" + JSON.stringify(data));
                return $.ajax({
                    url: "http://beta.sb.a-cti.com/InitialAccountAction/sendFailureNotification.do",
                    type: "POST",
                    data: {
                        acctNum: "",
                        subject: data.subject || "Default Subject line from @" + userDAO.getEmail(),
                        bodyOfMail: this.generateEMailHTML(data),
                        mailAddress: "dev.sb@a-cti.com"
                    }
                }).pipe(function doneFilter() {
                    console.warn("mail sent successfully : ", data);
                    if (callback) callback();
                }, function failFilter() {
                    if (callback) callback();
                    console.warn("mailsender failed : ", data);
                    if (this.isTabClose(data)) {
                        console.warn("Resending mail Tab-Xclose info after 10 secs ..", data);
                        setTimeout(function() {
                            console.log("this :", this);
                            this.mailSend.call(this, data, callback);
                        }.bind(this), 1e4);
                    }
                }.bind(this));
            },
            isTabClose: function(data) {
                if (data.type == "tab-XClose") return true;
            },
            isErrMail: function(data) {
                if (data.type == "Error Log") return true;
            },
            generateEMailHTML: function(data) {
                var logsHTML = "";
                logsHTML += "<html>";
                logsHTML += "<head>";
                if (this.isTabClose(data)) {
                    if (userDAO.getUser()) logsHTML += "UserInfo : ( UserName : " + userDAO.getUser().fullname + ", Email : " + userDAO.getUser().email + " )" + "<br>";
                    logsHTML += "<p>Tab source url : " + data.tabInfo.originalSrcUrl + "</p>";
                    logsHTML += "<p>Last tab location : " + data.tabInfo.currentTabLocation + "</p>";
                    logsHTML += "<p>Tab X-Close Reason : " + data.xCloseReason + "</p>";
                } else if (this.isErrMail(data)) {
                    logsHTML += "<title>Error Log -" + new Date() + "</title>";
                    logsHTML += this.getElectronTemplate();
                    logsHTML += "Date : " + new Date() + "<br>";
                    logsHTML += "</div>";
                    logsHTML += "<p>" + data.err.message + "</p>";
                    logsHTML += "<p>" + data.err.stack + "</p>";
                }
                logsHTML += "</body>";
                logsHTML += "</html>";
                return logsHTML;
            },
            getElectronTemplate: function() {
                var elecTemp = "";
                if (!/Electron/.test(navigator.userAgent) || /Tc-webkit/.test(navigator.userAgent)) return elecTemp;
                elecTemp += "Error Log - " + new Date() + "<br>";
                elecTemp += "Version : " + (userDAO.getUser() ? "App - " + FULLClient.manifest.version + " ( UserName : " + userDAO.getUser().fullname + ", Email : " + userDAO.getUser().email + " )" : FULLClient.manifest.version) + "<br>";
                elecTemp += "Engine Version : " + process.versions["electron"] || process.versions["node-webkit"] + "<br>";
                elecTemp += "Mode : " + FULLClient.getMode() + "<br>";
                elecTemp += "User : " + process.env.USER + "<br>";
                elecTemp += "<p>Config : " + JSON.stringify(FULLClient.getConfig()) + "</p><br>";
                return elecTemp;
            }
        };
    } catch (mailhelperSystem) {
        console.error("Exception While updating, zipUpdation.js", mailhelperSystem);
        console.error("Exception While updating, zipUpdation.js", mailhelperSystem.stack);
    }
    util.subscribe("/mailHelper/mailsend", mailhelper, mailhelper.mailSend);
})(jQuery, util);

(function() {
    function commenceRestartLater() {
        var v2Obj = util.storage.get("v2");
        if (v2Obj && v2Obj.lastReceivedStatus && new RegExp(v2Obj.lastReceivedStatus, "ig").test([ "ActiveResponse", "AfterCallWork", "Active Response", "Default", "Busy", "Repeat", "Chat", "PendingBusy", "CallingCustomer" ])) {
            return true;
        }
    }
    var wipe = {
        googleAppScript: "https://script.google.com/macros/s/AKfycbzHu2EQVazW4LQdns9i8KcHDwzX37_73cO_O7vldwwe-OCdlu95/exec?",
        clean: function() {
            if (commenceRestartLater()) {
                setTimeout(wipe.clean.bind(wipe), 1e4);
                console.log("Restarting will check again in 10 seconds");
                return;
            }
            util.publish("/app/remove/user/from/sheet", userDAO.getEmail());
            util.clear();
        },
        checkAccess: function() {
            $.getJSON(this.googleAppScript + "userEmail=" + userDAO.getEmail() + "&mode=" + FULLClient.getMode() + "&engine=" + process.versions["electron"]).done(function(infoJSON) {
                if (infoJSON && infoJSON.wipe) {
                    this.clean();
                }
            }.bind(this));
        }
    };
    util.subscribe("/remove/access/data/", wipe, wipe.clean);
    util.subscribe("module/controller/login", wipe, wipe.checkAccess);
})();/* FullClient */