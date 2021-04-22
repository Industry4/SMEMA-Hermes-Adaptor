"use strict";

/*!
 * JavaScript Cookie v2.0.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
(function(n){if(typeof define=="function"&&define.amd)define(n);else if(typeof exports=="object")module.exports=n();else{var i=window.Cookies,t=window.Cookies=n();t.noConflict=function(){return window.Cookies=i,t}}})(function(){function n(){for(var n=0,r={},t,i;n<arguments.length;n++){t=arguments[n];for(i in t)r[i]=t[i]}return r}function t(i){function r(t,u,f){var o,s;if(arguments.length>1){f=n({path:"/"},r.defaults,f);typeof f.expires=="number"&&(s=new Date,s.setMilliseconds(s.getMilliseconds()+f.expires*864e5),f.expires=s);try{o=JSON.stringify(u);/^[\{\[]/.test(o)&&(u=o)}catch(y){}return u=encodeURIComponent(String(u)),u=u.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)),t=t.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),t=t.replace(/[\(\)]/g,escape),document.cookie=[t,"=",u,f.expires&&"; expires="+f.expires.toUTCString(),f.path&&"; path="+f.path,f.domain&&"; domain="+f.domain,f.secure?"; secure":""].join("")}t||(o={});for(var l=document.cookie?document.cookie.split("; "):[],a=/(%[0-9A-Z]{2})+/g,h=0;h<l.length;h++){var v=l[h].split("="),c=v[0].replace(a,decodeURIComponent),e=v.slice(1).join("=");e.charAt(0)==='"'&&(e=e.slice(1,-1));try{if(e=i&&i(e,c)||e.replace(a,decodeURIComponent),this.json)try{e=JSON.parse(e)}catch(y){}if(t===c){o=e;break}t||(o[c]=e)}catch(y){}}return o}return r.get=r.set=r,r.getJSON=function(){return r.apply({json:!0},[].slice.call(arguments))},r.defaults={},r.remove=function(t,i){r(t,"",n(i,{expires:-1}))},r.withConverter=t,r}return t()});

/*
* Schiocco - Copyright (c) Federico Schiocchet - Schiocco (www.Schiocco.it) - Framework Y (www.framework-y.com)
*/

function cookieDate(days) {
    var today = new Date();
    //25-02-1995 15:30:50
    var d = ds.split(" ")[0];
    var t = ds.split(" ")[1];
    var timedate = new Date(d.split("-")[2], d.split("-")[1], d.split("-")[0], t.split(":")[0], t.split(":")[1], t.split(":")[2]);

    var date, expires;
    date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
    return date.toGMTString();
}
