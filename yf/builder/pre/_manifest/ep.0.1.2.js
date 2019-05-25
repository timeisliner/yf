'use strict';
/** manifest
 * @version 0.1.2
 * @exports obj
 */

const build = require('../block/ep.js');
const time = require('../../../common/ps/ep.js').time;
const Chain = build.Class.Chain;
const Block = build.Class.Block;
const bfn = build.fn;
const SPACE = '  ';
const fsh = require('../../../common/fsh/ep.js').obj;
const DEFAULT_NAME = 'pre.json';


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
/* [0.1.1] */
function makeBI(bi){
  bi.content.brief.create = bi.content.brief.create || time.toNormal(new Date());
  return fsh.save(bi.meta.path + '/' + DEFAULT_NAME, JSON.stringify(bi, null, SPACE)); 
}

/* [0.1.1] */
function makePre(bi, pretty){
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
    brief.addProp('create', bi.content.brief.create ? bi.content.brief.create : time.toNormal(new Date()));
    brief.addProp('about', bi.content.brief.about);
  
  root.addBlock(meta);
  root.addBlock(link);
  root.addBlock(brief);
  
  chain.setRoot(root);
  bfn.save(chain, pretty);
}

/* [0.1.1] */
function pre(path, pretty){
  fsh.load((path ? path + '/' : './') + DEFAULT_NAME).then((value)=>{
    let bi = JSON.parse(value.result);
    
    // build a pre file
    makePre(bi, pretty);
  });
}

exports.obj = {
  makeBI : makeBI
  , makePre : makePre
  , pre : pre
}














