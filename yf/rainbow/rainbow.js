'use strict';
/** rainbow
 * @version 0.0.1
 * @exports fn
 * @require fs,path
 * @dependency manifest
 */

//setup
const RAINBOW_GLOBAL_NAME = 'rainbow';
/* [0.0.1] rainbow.json

{
  "signed": "rainbow",
  "libs": {
    "ps.js": {
      "version": "",
      "manifest": ""
    }
  }
}
*/

const RAINBOW_CONFIG_FILENAME = RAINBOW_GLOBAL_NAME + '.json';  // 配置初始库的manifest.json路径
const RAINBOW_ENCODING = 'utf-8';
const RAINBOW_PATH_SEPARATOR = process.platform === 'win32' ? '\\' : '/';
const RAINBOW_MANIFEST_PATH = '../builder/manifest/manifest.js';

//libs
const fs = require('fs');
const path = require('path');
const mani = require(RAINBOW_MANIFEST_PATH).fn;

//error
const RAINBOW_ERR_GLOBAL_NAME_ALREADY_EXISTS = 'RAINBOW_ERR_GLOBAL_NAME_ALREADY_EXISTS';
const RAINBOW_ERR_ROOT_PATH_NOT_EXISTS = 'RAINBOW_ERR_ROOT_PATH_NOT_EXISTS';
const RAINBOW_ERR_ADDITIONAL_MANIFEST_IS_INVALID = 'RAINBOW_ERR_ADDITIONAL_MANIFEST_IS_INVALID';
const RAINBOW_ERR_DEFAULT_MANIFEST_IS_INVALID = 'RAINBOW_ERR_DEFAULT_MANIFEST_IS_INVALID';
const RAINBOW_ERR_MANIFEST_NOT_FOUND = 'RAINBOW_ERR_MANIFEST_NOT_FOUND';

//caches
let MANIFEST = undefined;
let FI = undefined;


/* [0.0.1] rainbow.root - attribute
path.parse(root)

dir <string>
root <string>
base <string>
name <string>
ext <string>


path.parse('/home/user/dir/file.txt');
Returns:
{ root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file' }

*/


/* [0.0.1] rainbow.manifest - attribute

{
  "ps.js": {  // fi
    "version": "",
    "manifest": "./test/ps"
  },
  "pre.js": {
    "version": "",
    "manifest": "N:\\libs\\yf\\builder\\pre"
  }
}

*/

/* [0.0.1] rainbow.request - method



*/

/* [0.0.1] - 请求指定版本的组件 */
function request(fi, version, local){
  // local 暂时无效
  let lib = global[RAINBOW_GLOBAL_NAME]['manifest'][fi];
  if(lib){
    if(FI !== fi){
      FI = fi;
      MANIFEST = mani.manifest(lib.manifest);
    }
    return MANIFEST.req(fi, lib.version);
  }
  
  return undefined;
}

/* [0.0.1] - 初始化 */
function init(){
  if(mani)
    return;
  
  mani = require(RAINBOW_MANIFEST_PATH).fn;
}

/* [0.0.1] - 初始化清单库 */
function initManifest(manifest){
  let libs = {};
  
  console.log('initManifest:__dirname\t' + __dirname);
  
  let raw = fs.readFileSync(path.resolve(__dirname, RAINBOW_CONFIG_FILENAME), {encoding : RAINBOW_ENCODING});
  if(raw){
    let df = JSON.parse(raw);
    
    if(typeof df !== 'object' || df.signed !== RAINBOW_GLOBAL_NAME || typeof df.libs !== 'object')
      throw new Error(RAINBOW_ERR_DEFAULT_MANIFEST_IS_INVALID);
    
    Object.assign(libs, df.libs);
  }
  
  if(manifest){
    if(typeof manifest !== 'object' || manifest.signed !== RAINBOW_GLOBAL_NAME || typeof manifest.libs !== 'object')
      throw new Error(RAINBOW_ERR_ADDITIONAL_MANIFEST_IS_INVALID);
    
    Object.assign(libs, manifest.libs);
  }
  
  return libs;
}


/* [0.0.1] exports - 安装rainbow */
function setup(root, manifest){
  if(global[RAINBOW_GLOBAL_NAME])
    throw new Error(RAINBOW_ERR_GLOBAL_NAME_ALREADY_EXISTS);
  
  global[RAINBOW_GLOBAL_NAME] = {};
  
  if(!fs.existsSync(root))
    throw new Error(RAINBOW_ERR_ROOT_PATH_NOT_EXISTS);
  
  global[RAINBOW_GLOBAL_NAME]['root'] = path.parse(root); // root path
  Object.freeze(global[RAINBOW_GLOBAL_NAME]['root']);
  
  global[RAINBOW_GLOBAL_NAME]['manifest'] = initManifest(manifest); // 库清单
  
  Object.freeze(global[RAINBOW_GLOBAL_NAME]['manifest']);
  
  global[RAINBOW_GLOBAL_NAME]['request'] = request; // 请求组件
  
  Object.freeze(global[RAINBOW_GLOBAL_NAME]);
  
  init();
}


exports.fn = {
  setup : setup
}