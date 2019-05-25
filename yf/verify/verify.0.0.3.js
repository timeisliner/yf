'use strict';
/** verify
 * @version 0.0.3
 * @exports fn
 * @require fs,path,pre.0.1.4
 * @dependency rainbow
 */

const VERIFY_LIBS = ['test'];  //测试用
// const VERIFY_LIBS = ['yf', 'common', 'projects'];  //清理指定库

const VERIFY_LIBS_PRECONDITION = ['pre', 'pre_bi', '.json'];   //前提条件，目录下存在 pre.json 或 pre_bi.json 文件

const VERIFY_MANIFEST_PRECONDITION = ['manifest.json'];   //前提条件，目录下不存在 manifest.json

const VERIFY_EP_PRECONDITION = ['ep.js', '.js'];   //前提条件，目录下不存在 ep.js 或 项目.js 文件

const VERIFY_RAINBOW_CF_PATH = ['yf/rainbow/rainbow.json']; //configuration file path


//setup
const VERIFY_SEPARATOR = process.platform === 'win32' ? '\\' : '/';
const VERIFY_NAME = 'verify.json';
// const VERIFY_STORAGE = '_manifest';
const VERIFY_OPTS = {encoding : 'utf-8'};
const VERIFY_OPTS_READ = {
  encoding : 'utf-8'
  , withFileTypes : true // true for Dirent object
};


//libs
const fs = require('fs');
const path = require('path');
const pre = require('../builder/pre/ep.0.1.4.js').fn;
const manifest = require('../builder/manifest/manifest.js').fn;

//error
const VERIFY_ERR_RAINBOW_NOT_FOUND = 'VERIFY_ERR_RAINBOW_NOT_FOUND';


//info
const VERIFY_INFO_CUSTOM_NOT_READY = 'VERIFY_INFO_CUSTOM_NOT_READY';

function isReady(){
  if(global['rainbow'] === undefined)
    return false;
  
  return true;
}

function dealManifest(manifile, crtpath, alias){
  if(fs.existsSync(manifile)){
    console.log('dealManifest:manifest.update\t' + crtpath);
    manifest.update(crtpath, alias);
  }else{
    console.log('dealManifest:manifest.builder\t' + crtpath);
    manifest.builder(crtpath, alias);
  }
}

function cleanPRE_BI(crt){
  console.log('cleanPRE_BI:crt\t' + crt);
  let src = crt + VERIFY_SEPARATOR + VERIFY_LIBS_PRECONDITION[1] + VERIFY_LIBS_PRECONDITION[2]; //'pre_bi.json';
  // console.log(fs.existsSync);
  console.log(fs.existsSync(src));
  if(fs.existsSync(src)){
    fs.unlinkSync(src);
    console.log('cleanPRE_BI:fs.unlink\t' + src);
    return;
  }
}

function dealRCFP(rcfp, lib){
  let rcf = undefined;
  if(fs.existsSync(rcfp)){
    try{
      rcf = JSON.parse(fs.readFileSync(rcfp, VERIFY_OPTS));
    }catch(err){
      throw new Error(err);
    }
  }
  
  if(rcf === undefined){
    rcf = {signed: 'rainbow',  libs: {}};
  }
  
  if(rcf.libs[lib.name] === undefined){
    rcf.libs[lib.name] = {};
  }
  
  rcf.libs[lib.name].manifest = lib.manifest;
  try{
    fs.writeFileSync(rcfp, JSON.stringify(rcf, null, '  '), {encoding : 'utf-8'});
  }catch(err){
    throw new Error(err);
  }
}

async function dealPRE_BI(crt){
  console.log('dealPRE_BI:crt\t' + crt);
  let src = crt + VERIFY_SEPARATOR + VERIFY_LIBS_PRECONDITION[1] + VERIFY_LIBS_PRECONDITION[2]; //'pre_bi.json';
  let dst = crt + VERIFY_SEPARATOR + VERIFY_LIBS_PRECONDITION[0] + VERIFY_LIBS_PRECONDITION[2]; //'pre.json';
  let crts = path.parse(crt);
  
  if(!fs.existsSync(dst)){
    console.log(dst);
    await fs.readFile(src, VERIFY_OPTS, async (err, data)=>{
      if(err){
        throw new Error(err);
      }else{
        let bi = JSON.parse(data);
        bi = {
          "meta": {
            "path": path.resolve(bi.meta.path),
            "pre": crts.name + ".pre",
            "ep": crts.name + ".js",
            "title": bi.meta.title
          },
          "content":{
            "meta": {
              "name": crts.name,
              "project": bi.content.meta.project
            },
            "brief": {
              "create": undefined,
              "about": bi.content.brief.about
            }
          }
        };
        await pre.mkbi(bi, p=>{
          p.then(rs=>{
            console.log('dealPRE_BI:pre.mkbi\t' + rs);
          }).catch(err=>{
            console.log('dealPRE_BI:pre.mkbi\t' + err);
          });
        });
        // bi = pre.verify(bi);
      }
    });
  }
  
  fs.unlinkSync(src);
  console.log('dealPRE_BI:fs.unlink\t' + src);
}

async function isPre(files, src){
  console.log('isPre:src\t' + src);
  // console.log(files);
  // console.log(files[0]);
  // return false;
  let rs = false;
  for(let i = 0; i < files.length; i++){
    if(files[i].isFile()){
      // console.log(files[i]);
      let file = path.parse(src + VERIFY_SEPARATOR + files[i].name);
      // console.log(file);
      if(file.name === VERIFY_LIBS_PRECONDITION[0] && file.ext === VERIFY_LIBS_PRECONDITION[2]){
        rs = true;
      }else if(file.name === VERIFY_LIBS_PRECONDITION[1] && file.ext === VERIFY_LIBS_PRECONDITION[2]){
        await dealPRE_BI(src);
        return true;
      }
    }
  }
  return rs;
}

function process(crtpath, rcfp, libname){
  return new Promise(async (resolve,reject)=>{
    fs.readdir(crtpath, VERIFY_OPTS_READ, async (err, files)=>{
      if(err){
        // reject(err);
        console.log(err + '\tread dir\t' + crtpath);
        return;
      }else{
        let ispre = await isPre(files, crtpath);
        if(ispre){ // deal with pre_bi.json
          let manifile = crtpath + VERIFY_SEPARATOR + VERIFY_MANIFEST_PRECONDITION[0]; //'manifest.json'
          let alias = {'ep.js' : libname + VERIFY_EP_PRECONDITION[1]}; //'ep.js', '.js'
          await dealManifest(manifile, crtpath, alias); //deal with manifest
          //deal with rainbow.json
          let lib = libname + VERIFY_EP_PRECONDITION[1];
          await dealRCFP(rcfp, {'name' : lib, 'manifest' : crtpath});
          
          // console.log('verify:path.resolve(rainbow.json)\t' + rcfp);
          // console.log('verify:fs.existsSync(rcfp)\t' + fs.existsSync(rcfp));
          
          
          // cleanPRE_BI(crtpath);
        }
        
        for(let i = 0; i < files.length; i++){
          if(files[i].isDirectory() && files[i].name !== '_manifest'){
            let sublib = files[i].name;
            let subpath = crtpath + VERIFY_SEPARATOR + sublib;
            console.log('process:sublib\t' + sublib);
            console.log('process:subpath\t' + subpath);
            process(subpath, rcfp, sublib)
          }
        }
      }
    });
  });
}

function _verify(){
  let {root, request} = rainbow;
  
  console.log(root);
  console.log(request);
  
  let src = root.dir + root.base;
  console.log('_verify:src\t' + src);
  
  for(let i = 0 ; i < VERIFY_LIBS.length; i++){
    let crtpath = src + VERIFY_SEPARATOR + VERIFY_LIBS[i];
    if(!fs.existsSync(crtpath)){
      console.log('not exists : ' + crtpath);
      continue;
    }
    console.log('_verify:fs.readdir\t' + crtpath);
    // resolve(0);
    // return;
    
    let rcfp = path.resolve(VERIFY_RAINBOW_CF_PATH[0]);//rainbow configuration file path
    process(crtpath, rcfp, VERIFY_LIBS[i]);
    
  }
}

/* [0.0.3] - verify */
function verify(){
  if(!isReady())
    throw new Error(VERIFY_ERR_RAINBOW_NOT_FOUND);

  _verify();
  // let rcfp = path.resolve(VERIFY_RAINBOW_CF_PATH[0]);//rainbow configuration file path
  // console.log('verify:path.resolve(rainbow.json)\t' + rcfp);
  // console.log('verify:fs.existsSync(rcfp)\t' + fs.existsSync(rcfp));
  
}

exports.fn = {verify : verify};