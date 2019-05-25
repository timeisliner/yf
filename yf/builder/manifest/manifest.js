'use strict';
/** manifest
 * @version 0.0.1
 * @exports fn
 * @require fs,path
 * @dependency
 */

//global
// const root = rainbow.root

//setup
const MANIFEST_SEPARATOR = process.platform === 'win32' ? '\\' : '/';
const MANIFEST_NAME = 'manifest.json';
const MANIFEST_STORAGE = '_manifest';

//libs
const fs = require('fs');
const path = require('path');


//error
const MANIFEST_ERR_INVALID_DS = 'MANIFEST_ERR_INVALID_DS';
const MANIFEST_ERR_UNKNOWN_DS_TYPE = 'MANIFEST_ERR_UNKNOWN_DS_TYPE';
const MANIFEST_ERR_INVALID_DS_FI = 'MANIFEST_ERR_INVALID_DS_FI';
const MANIFEST_ERR_INVALID_DS_FI_SOURCE = 'MANIFEST_ERR_INVALID_DS_FI_SOURCE';
const MANIFEST_ERR_SOURCE_NOT_EXISTS = 'MANIFEST_ERR_SOURCE_NOT_EXISTS';
const MANIFEST_ERR_SOURCE_ALREADY_EXISTS = 'MANIFEST_ERR_SOURCE_ALREADY_EXISTS';
const MANIFEST_ERR_DATA_CORRUPTION = 'MANIFEST_ERR_DATA_CORRUPTION';
const MANIFEST_ERR_INVALID_DS_FI_VERSION = 'MANIFEST_ERR_INVALID_DS_FI_VERSION';

//info
const MANIFEST_ERR_TODO_DS_TYPE_MIXED = 'MANIFEST_ERR_TODO_DS_TYPE_MIXED'


/* [0.0.1] - manifest.json

{
  "type": "default",
  "fis": {
    "ps.js": {
      "latest": "ps.0.0.3.js",
      "history": {
        "0.0.1": "ep.js",
        "0.0.2": "ep.0.0.2.js"
      }
    },
    "pre.json": {
      "latest": "pre.json",
      "history": {}
    },
    "ps.pre": {
      "latest": "ps.pre",
      "history": {}
    },
    "manifest.json": {
      "latest": "manifest.json",
      "history": {}
    }
  }
}

*/


/* [0.0.1] - alias
  //            alias     real
  let alias = {'ep.js' : 'ps.js'};
*/


/* [0.0.1] - 数据结构 */
class DS{
  constructor(ds){
    if(typeof ds !== 'object' && typeof ds.fis !== 'object')
      throw new Error(MANIFEST_ERR_INVALID_DS);
    
    ds.type = ds.type || 'default'
    if(ds.type === 'default' || ds.type === 'construct' || ds.type === 'mixed'){
      this.type = ds.type;
      this.fis = ds.fis;
    }else{
      throw new Error(MANIFEST_ERR_UNKNOWN_DS_TYPE);
    }
  }
  
  getType(){
    return this.type;
  }
  
  fi(fi, version){
    let list = this.fis[fi];  // 取得 指定 fi 的版本列表
    if(typeof list != 'object')
      throw new Error(MANIFEST_ERR_INVALID_DS_FI);
    
    let src = undefined;
    if(version === undefined || (typeof version === 'string' && version.trim() === '')){
      src = list.latest; // latest
    }else{
      if(typeof version != 'string')
        throw new Error(MANIFEST_ERR_INVALID_DS_FI_VERSION);
      src = list.history[version]; // history version
      
      if(src)
        src = MANIFEST_STORAGE + MANIFEST_SEPARATOR + src;
    }

    if(typeof src != 'string' || src.trim() === '')
      throw new Error(MANIFEST_ERR_INVALID_DS_FI_SOURCE);

    return src;
  }
}


/* [0.0.1] - 清单对象 */
class Manifest{
  constructor(){
    this.src;
    this.ds;
  }
  
  getSrc(){
    return this.src;
  }
  
  refresh(){
    this.reload(this.src);
  }
  
  reload(src){
    let filepath = src + MANIFEST_SEPARATOR + MANIFEST_NAME;
    if(fs.existsSync(filepath)){
      this.src = src;
      let data = fs.readFileSync(filepath, {encoding : 'utf-8'});
      this.ds = new DS(JSON.parse(data));
    }else{
      throw new Error(MANIFEST_ERR_SOURCE_NOT_EXISTS);
    }
  }
  
  req(fi, version){ // FI ::= <name>.<ext> 缺省ext时，默认ext为js文件，不推荐缺省
    if(fi.split('.').length === 1)
      fi += '.js';
    
    let pathname = this.request(fi, version);
    
    let parse = path.parse(pathname);
    // console.log(parse);
    // console.log(__dirname);
    // console.log(pathname);
    // console.log(path.relative(__dirname, pathname));
    pathname = path.relative(__dirname, pathname);
    console.log(pathname);
    
    return parse.ext === '.js' ? require(pathname) : pathname;
  }
  
  request(fi, version){
    let filename = this.ds.fi(fi, version);
    let pathname = '';
    
    switch(this.ds.getType()){
      case 'default':
        pathname = this.src + MANIFEST_SEPARATOR + filename;
        break;
      case 'construct':
        pathname = filename;
        break;
      case 'mixed':
        throw new Error(MANIFEST_ERR_TODO_DS_TYPE_MIXED);
        break;
      default :
        throw new Error(MANIFEST_ERR_DATA_CORRUPTION);
        break;
    }
    
    return pathname;
  }
  
}

/* [0.0.1] exports - 载入清单，生成清单对象 */
function manifest(src){
  let mani = new Manifest();
  mani.reload(src);
  return mani;
}


/* [0.0.1] - 别名设定，也适用于顺应旧版本 */
function alias(names, aliases){
  //       name        .    ext
  let fi = names[0] + '.' + names[names.length - 1];
  if(aliases === undefined)
    return fi;
  
  
  if(aliases[fi]){
    return aliases[fi];
  }else{
    return fi;
  }
}

/* [0.0.1] - 为文件排序 */
function sort(dir, fi, news){
  let latests = fi.latest.split('.');
  let cache = news.join('.');
  let src = dir + MANIFEST_SEPARATOR;
  let dest = dir + MANIFEST_SEPARATOR + MANIFEST_STORAGE + MANIFEST_SEPARATOR;
  
  let isLatest = true;
  
  if(latests.length === 2){
    fs.copyFileSync(src + fi.latest, dest + fi.latest);
    fs.unlinkSync(src + fi.latest);

    fi.latest = cache;
    fi.history['0.0.1'] = latests.join('.');
    return fi;
  }else{
    if(news.length === 2){
      isLatest = false;
    }else if(parseInt(latests[1]) > parseInt(news[1])){
      isLatest = false;
    }else if(parseInt(latests[2]) > parseInt(news[2])){
      isLatest = false;
    }else if(parseInt(latests[3]) > parseInt(news[3])){
      isLatest = false;
    }
  }

  
  if(isLatest){
    fs.copyFileSync(src + fi.latest, dest + fi.latest);
    fs.unlinkSync(src + fi.latest);
    
    latests.shift();
    latests.pop();
    fi.history[latests.join('.')] = fi.latest;
    fi.latest = cache;
  }else{
    fs.copyFileSync(src + cache, dest + cache);
    fs.unlinkSync(src + cache);
    
    if(news.length !== 2){
      news.shift();
      news.pop();
      fi.history[news.join('.')] = cache;
    }else{
      fi.history['0.0.1'] = cache;
    }
  }
  
  return fi;
}

/* [0.0.1] - 清理文件 */
function clear(src, list, file, aliases){
  let names = file.name.split('.');
  let fi = alias(names, aliases);
  console.log('clear : ' + file.name);
  if(list[fi] === undefined){
    list[fi] = {latest : file.name, history : {}};
  }else{
    list[fi] = sort(src, list[fi], names);
  }
  return list;
}

/* [0.0.1] exports - 创建默认清单文件 */
function builder(src, aliases){
  return new Promise((resolve, reject)=>{
    let filepath = src + MANIFEST_SEPARATOR + MANIFEST_NAME;
    
    if(fs.existsSync(filepath))
      reject(MANIFEST_ERR_SOURCE_ALREADY_EXISTS);
    
    
    let manifest = {type : 'default', fis : {}};
    let storage = src + MANIFEST_SEPARATOR + MANIFEST_STORAGE;
    let opts = {encoding : 'utf-8'};
    let space = '  ';
    let opts_read = {
      encoding : 'utf-8'
      , withFileTypes : true // true for Dirent object
    };
    
    fs.readdir(src, opts_read, (err, files)=>{
      if(err){
        reject(err);
      }else{
        fs.mkdir(storage, opts, (err)=>{
          if(err){
            reject(err);
          }else{
            let list = {};
            for(let i = 0; i < files.length; i++)
              if(files[i].isFile())
                list = clear(src, list, files[i], aliases);
            
            manifest.fis = list;
            
            fs.writeFile(filepath, JSON.stringify(manifest, null, space), opts, (err)=>{
              if(err){
                reject(err);
              }else{
                resolve({
                  src : src + MANIFEST_SEPARATOR + MANIFEST_NAME
                  , data : manifest
                });
              }
            });
          }
        });
      }
    });
  });
}

/* [0.0.1] - 检查清单文件中存在指定文件与否 */
function exists(list, file, aliases){
  let names = file.name.split('.');
  let fi = alias(names, aliases);
  names.pop();
  names.shift();
  let version = names.join('.');
  if(!version)
    version = '0.0.1';

  console.log('is repeat : ' + file.name);
  if(list[fi] === undefined)
    return false;
  
  if(list[fi].latest === file.name || list[fi].history[version] === file.name)
    return true;
  
  return false;
}

/* [0.0.1] exports - 更新默认清单文件 */
function update(src, aliases){
  let filepath = src + MANIFEST_SEPARATOR + MANIFEST_NAME;
  let opts = {encoding : 'utf-8'};
  let space = '  ';
  let opts_read = {
    encoding : 'utf-8'
    , withFileTypes : true // true for Dirent object
  };
  
  return new Promise((resolve, reject)=>{
    if(fs.existsSync(filepath)){
      let data = fs.readFileSync(filepath, {encoding : 'utf-8'});
      let mani = JSON.parse(data);
      let fis = mani.fis;
      
      fs.readdir(src, opts_read, (err, files)=>{
        if(err){
          reject(err);
        }else{
          let list = fis;
          for(let i = 0; i < files.length; i++)
            if(files[i].isFile() && !exists(list, files[i], aliases))
              list = clear(src, list, files[i], aliases);
          
          mani.fis = list;
          
          fs.writeFile(filepath, JSON.stringify(mani, null, space), opts, (err)=>{
            if(err){
              reject(err);
            }else{
              resolve({
                src : filepath
                , data : mani
              });
            }
          });
        }
      });
      
      
    }else{
      reject(MANIFEST_ERR_SOURCE_NOT_EXISTS);
    }
  });
}

exports.fn = {
  manifest : manifest
  , builder : builder
  , update : update
}