'use strict';
/** manifest
 * @version 0.1.4
 * @exports fn
 */

//libs
let path = require('path');


//error
const PRE_ERROR_INVALID_BI = 'PRE_ERROR_INVALID_BI';
const PRE_ERROR_INVALID_BI_META = 'PRE_ERROR_INVALID_BI_META';
const PRE_ERROR_INVALID_BI_META_TITLE = 'PRE_ERROR_INVALID_BI_META_TITLE';
const PRE_ERROR_INVALID_BI_CONTENT = 'PRE_ERROR_INVALID_BI_CONTENT';
const PRE_ERROR_INVALID_BI_CONTENT_META = 'PRE_ERROR_INVALID_BI_CONTENT_META';
const PRE_ERROR_INVALID_BI_CONTENT_META_NAME = 'PRE_ERROR_INVALID_BI_CONTENT_META_NAME';
const PRE_ERROR_INVALID_BI_CONTENT_META_PROJECT = 'PRE_ERROR_INVALID_BI_CONTENT_META_PROJECT';

// const version = rainbow.version;
// manifest(name, version)


const build = require('../block/ep.js');
const ps = require('../../../common/ps/ps.0.0.3.js');
const {_throw} = ps.error;
const timestamp = ps.timestamp;
const callback = ps.callback;
const Chain = build.Class.Chain;
const Block = build.Class.Block;
const bfn = build.fn;
const fsh = require('../../../common/fsh/ep.0.1.1.js');
const {load, save} = fsh.fn;
const {FSH_SEPARATOR} = fsh.constants;

const PRE_SPACE = '  ';
const PRE_NAME = 'pre.json';


/* [0.1.2] BI
  {
    "meta": {
      "relative": true,
      "path": "./fileformat/pre",
      "pre": "pre.pre",
      "ep": "ep.js",
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


/* [0.1.4] */
function verifyBI(bi){
  typeof bi === 'object' || _throw(PRE_ERROR_INVALID_BI);
  let _bi = {};
  typeof bi['meta'] === 'object' || _throw(PRE_ERROR_INVALID_BI_META);
  _bi['meta'] = {};
  typeof bi['content'] === 'object' || _throw(PRE_ERROR_INVALID_BI_CONTENT);
  _bi['content'] = {};
  _bi.meta['relative'] = path.isAbsolute(bi.meta['path']);
  _bi.meta['path'] = bi.meta['path'];
  path.parse(bi.meta['pre']);
  _bi.meta['pre'] = bi.meta['pre'];
  path.parse(bi.meta['ep']);
  _bi.meta['ep'] = bi.meta['ep'];
  
  typeof bi.meta['title'] === 'string' || _throw(PRE_ERROR_INVALID_BI_META_TITLE);
  _bi.meta['title'] = bi.meta['title'];
  
  typeof bi.content['meta'] === 'object' || _throw(PRE_ERROR_INVALID_BI_CONTENT_META);
  _bi.content['meta'] = {};
  typeof bi.content.meta['name'] === 'string' || _throw(PRE_ERROR_INVALID_BI_CONTENT_META_NAME);
  _bi.content.meta['name'] = bi.content.meta['name'];
  typeof bi.content.meta['project'] === 'string' || _throw(PRE_ERROR_INVALID_BI_CONTENT_META_PROJECT);
  _bi.content.meta['project'] = bi.content.meta['project'];
  
  typeof bi.content['brief'] === 'object' || (bi.content['brief'] = {});
  _bi.content['brief'] = {};
  typeof bi.content.brief['create'] === 'string' || (bi.content.brief['create'] = timestamp.toNormal(new Date()));
  _bi.content.brief['create'] = bi.content.brief['create'];
  typeof bi.content.brief['about'] === 'string' || (bi.content.brief['about'] = '');
  _bi.content.brief['about'] = bi.content.brief['about'];
  
  return _bi;
}




/* [0.1.4][Promise,Callback] */
function mkbi(bi, cb){
  callback.isNormal(cb);
  bi = verifyBI(bi);
  
  cb(new Promise((resolve, reject)=>{
    save(bi.meta.path + FSH_SEPARATOR + PRE_NAME, JSON.stringify(bi, null, PRE_SPACE), rs=>{
      rs.then(value=>{
        resolve(value);
      }).catch(err=>{
        reject(err);
      });
    });
    
  }));
  
}

/* [0.1.4] build a pre file*/
function mkpre(bi, pretty){
  bi = verifyBI(bi);
    
  // Chain
  let chain = new Chain(bi.meta.path, bi.meta.pre);
  
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
    brief.addProp('create', bi.content.brief.create);
    brief.addProp('about', bi.content.brief.about);
  
  root.addBlock(meta);
  root.addBlock(link);
  root.addBlock(brief);
  
  chain.setRoot(root);
  bfn.save(chain, pretty);
  
}

/* [0.1.4] */
function pre(path, pretty){
  load((path ? path + '/' : './') + PRE_NAME, pro=>{
    pro.then(rs=>{
      mkpre(JSON.parse(rs.data), pretty);
    }).catch(err=>{
      throw new Error(err);
    });
  });

}

exports.fn = {
  mkbi : mkbi
  , mkpre : mkpre
  , pre : pre
  , verify : verifyBI
}














