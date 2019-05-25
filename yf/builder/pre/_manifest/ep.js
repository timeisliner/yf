'use strict';
/* File Format for preprocess
 *
 */

const build = require('../build.js');
const cw = require('../cw.js').fn;  //@code/coms/cw.js
const Chain = build.Class.Chain;
const Block = build.Class.Block;
const bfn = build.fn;
const SPACE = '  ';
const fsh = require('../../FileSystemHelper/FileSystemHelper.js').obj;
const CONFIG_NAME = 'pre_bi.json';

/* Basic Information
 * path
 * filename
 * title
 * mete.name
 * meta.project
 * brief.about
 *
 */


/* version[''] */
function createPre(bi, pretty){
  // Chain
  let chain = new Chain(bi.path, bi.filename);
  // Block root
  let root = new Block(bi.title);
  
  let meta = new Block('meta');
    meta.addProp('name', bi.meta.name);
    meta.addProp('project', bi.meta.project);
  let link = new Block('link');
    let purpose = new Block('purpose');
    let logic = new Block('logic');
    let language = new Block('language');
    link.addBlock(purpose);
    link.addBlock(logic);
    link.addBlock(language);
  let brief = new Block('brief');
    brief.addProp('create', cw.tomydate(new Date()));
    brief.addProp('about', bi.brief.about);
  
  root.addBlock(meta);
  root.addBlock(link);
  root.addBlock(brief);
  
  chain.setRoot(root);
  bfn.save(chain, pretty);
}

/* version[''] BI
  let bi = {
    path : __dirname + '/test'
    , filename : 'ff.pre'
    , title : 'File Format for Preprocess'
    , meta : {
      name : 'pre'
      , project : 'yfds'
    }
    , brief : {
      about : '描述目的,设计逻辑,语言实现'
    }
  };
*/
function createBI(path, filename, title, name, project, about){
  let bi = {
    path : path ? path : __dirname + '/test'
    , filename : filename ? filename : 'test.pre'
    , title : title ? title : 'test for pre'
    , meta : {
      name : name ? name : 'test'
      , project : project ? project : 'yfds'
    }
    , brief : {
      about : about ? about : '模板设定'
    }
  };
  

  return fsh.save(path + '/' + CONFIG_NAME, JSON.stringify(bi, null, SPACE));
}

/* version[''] */
function init(path, pretty){
  fsh.load((path ? path + '/' : './') + CONFIG_NAME).then((value)=>{
    let bi = JSON.parse(value.result);
    
    // build a pre file
    createPre(bi, pretty);
  });
}

/* version[0.1.1] BI
  {
    "meta": {
      "relative": true,
      "path": "./fileformat/pre",
      "filename": "pre.pre",
      "title": "File Format for Preprocess"
    },
    "content":{
      "meta": {
        "name": "pre",
        "project": "yfds"
      },
      "brief": {
        "create": "2019-4-24 22:34:2",
        "about": "描述目的,设计逻辑,语言实现"
      }
    }
  }
 */
function makeBI(bi, version){
  switch(version){
    case '' : 
      return createBI(bi.meta.path, bi.meta.filename, bi.meta.title, bi.content.meta.name, bi.content.meta.project, bi.content.brief.about);
    case '0.1.1' : 
    default :
      if(bi.content.brief.create === undefined)delete bi.content.brief.create;
      return fsh.save(bi.meta.path + '/' + CONFIG_NAME, JSON.stringify(bi, null, SPACE)); 
  }
}

/* version[0.1.1] */
function makePre(bi, pretty){
  // Chain
  let chain = new Chain(bi.meta.path, bi.meta.filename);
  
  // Block root
  let root = new Block(bi.meta.title);
  
  let meta = new Block('meta');
    meta.addProp('name', bi.content.meta.name);
    meta.addProp('project', bi.content.meta.project);
  let link = new Block('link');
    let purpose = new Block('purpose');
    let logic = new Block('logic');
    let language = new Block('language');
    link.addBlock(purpose);
    link.addBlock(logic);
    link.addBlock(language);
  let brief = new Block('brief');
    brief.addProp('create', bi.content.brief.create ? bi.content.brief.create : cw.tomydate(new Date()));
    brief.addProp('about', bi.content.brief.about);
  
  root.addBlock(meta);
  root.addBlock(link);
  root.addBlock(brief);
  
  chain.setRoot(root);
  bfn.save(chain, pretty);
}

/* version[0.1.1] */
function pre(path, pretty){
  fsh.load((path ? path + '/' : './') + CONFIG_NAME).then((value)=>{
    let bi = JSON.parse(value.result);
    
    // build a pre file
    makePre(bi, pretty);
  });
}

exports.obj = {
  createPre : createPre
  , createBI : createBI
  , init : init
};

exports.last = {
  makeBI : makeBI
  , makePre : makePre
  , pre : pre
}














