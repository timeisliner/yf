'use strict';
/* Block
 */

const ENCODE = 'utf-8'
  , NEW_LINE = process.platform === 'win32' ? '\r\n' : '\n'
  , PATH_SEPARATOR = process.platform === 'win32' ? '\\' : '/'
  , BLOCK_START = '{'
  , BLOCK_END = '}'
  , BLOCK_PROP_SEPARATOR = ':>'
  , PRETTY_SPACE = ' '
  ;

//libs
const fsh = require('../../../common/fsh/ep.js').obj;

class Block{
  constructor(title){
    this.title = title;
    this.child = [];
  }
  
  getTitle(){
    return this.title;
  }
  
  addProp(key, value, unshift){
    unshift ? this.child.unshift([key, value]) : this.child.push([key, value]);
  }
  
  addDesc(description, unshift){
    unshift ? this.child.unshift(description) : this.child.push(description);
  }
  
  addBlock(block, unshift){
    unshift ? this.child.unshift(block) : this.child.push(block);
  }
}

class Chain{
  constructor(path, filename){
    this.path = path;
    this.meta = {
      filename : filename
      , root : undefined
    };
  }
  
  getPath(){
    return this.path;
  }
  
  setPath(path){
    this.path = path;
  }
  
  getFilename(){
    return this.meta.filename;
  }
  
  setFilename(filename){
    this.meta.filename = filename;
  }
  
  getRoot(){
    return this.meta.root;
  }
  
  setRoot(block){
    this.meta.root = block;
  }
}

function encodeBlock(block, pretty){
  let encodes = BLOCK_START + block.title + NEW_LINE;
  let separator = pretty ? PRETTY_SPACE : '';
  
  for(let i = 0; i < block.child.length; i++){
    //console.log(block.child[i]);
    //console.log(typeof block.child[i]);
    switch(block.child[i].constructor.name){
      case 'Array' :
        encodes += block.child[i][0] + separator + BLOCK_PROP_SEPARATOR + separator + block.child[i][1] + NEW_LINE;
        break;
      case 'String' :
        encodes += block.child[i] + NEW_LINE;
        break;
      case 'Block' :
        encodes += encodeBlock(block.child[i], pretty);
        break;
      default :
        throw new Error();
        console.log('error : unknown type of block child!');
        break;
    }
  }
  
  encodes += BLOCK_END + NEW_LINE;
  // console.log(encodes);
  return encodes;
}
function encode(chain, pretty){
  let filepath = chain.getPath() + PATH_SEPARATOR + chain.getFilename();
  let encodes = encodeBlock(chain.getRoot(), pretty);
  return {filepath : filepath, encodes : encodes};
}
function save(chain, pretty){
  let encoded = encode(chain, pretty);
  fsh.save(encoded.filepath, encoded.encodes);
}
function decode(raw, chain){
    //                  1 2
    let block_start = /^{([^{}\r\n]+)\r\n/;
    /* 1 - block start
     * 2 - block title
     *
     */
    //                1
    
    let block_end = /^}\r\n/;
    // 1 - block end
    
    //            1          2  3
    let prop = /^([^{}\r\n]+):>([^{}\r\n]*)\r\n/;
    /* 1 - prop key
     * 2 - prop separator
     * 3 - prop value
     */

    //           1
    let desc = /^([^\r\n]*)\r\n/;
    // 1 - description


    let rest = raw;
    let match = null;
    let block = [];
    let current_block = undefined;
    let count = 0;
    let maxline = 32700
    while(rest){
      rest = count++ > maxline ? '' : rest;
      //console.log(match);
      //console.log(rest);


      match = rest.match(block_start);
      if(match){
        // console.log('block title - ' + match[1]);
        current_block = new Block(match[1]);
        if(block.length > 0)
          block[block.length - 1].addBlock(current_block);
        block.push(current_block);
        rest = rest.slice(match[0].length, rest.length);
        continue;
      }
      
      match = rest.match(block_end);
      if(match){
        let temp = block.pop();
        // console.log('block end - ' + temp.title);
        if(block.length > 0)
          current_block = block[block.length - 1];
        rest = rest.slice(match[0].length, rest.length);
        continue;
      }
      
      
      match = rest.match(prop);
      if(match){
        // console.log('prop - key : ' + match[1] + '; value : ' + match[2]);
        current_block.addProp(match[1].trim(), match[2].trim());
        rest = rest.slice(match[0].length, rest.length);
        continue;
      }
      
      match = rest.match(desc);
      if(match){
        // console.log('desc - ' + match[0]);
        current_block.addDesc(match[1]);
        rest = rest.slice(match[0].length, rest.length);
        continue;
      }
    }
    
    if(current_block != undefined){
      chain.setRoot(current_block);
    }else{
      throw(new Error('[PRE BUILD ERROR]undefined root block!'));
    }
    
    return chain;
}
function load(path, filename){
  let raw = fsh.load(path + PATH_SEPARATOR + filename);
  // Chain
  let chain = new Chain(path, filename);

  return new Promise((resolve, reject)=>{
    raw.then((value)=>{
      resolve(decode(value.result, chain));
    });
  });

  //return decode(raw.result);
}


let Class = {
  Chain : Chain
  , Block : Block
};

let fn = {
  encode : encode
  , decode : decode
  , save : save
  , load : load
};

let Constant = {
  ENCODE : 'utf-8'
  , NEW_LINE : process.platform === 'win32' ? '\r\n' : '\n'
  , PATH_SEPARATOR : process.platform === 'win32' ? '\\' : '/'
  , BLOCK_START : '{'
  , BLOCK_END : '}'
  , BLOCK_PROP_SEPARATOR : ':>'
  , PRETTY_SPACE : ' '
}

exports.Class = Class;
exports.fn = fn;
exports.Constant = Constant;