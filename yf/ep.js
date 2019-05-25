'use strict';
(async function(){
  // /*
  console.log(__dirname);
  
  
  // */
  
  
  
  /* fsh 0.1.1 watcher
  let fs = require('fs')
    , path = require('path')
    , watcher = require('../common/fsh/ep.0.1.1.js').watcher
    , target = '../test'
    ;
  
  let testp = '../common/fsh/ep.0.1.1.js';
  
  let p = path.parse(testp);
  
  console.log(p);
  console.log(p.name.split('.'));
  console.log(path.parse('ep.js'));
  
  watcher(target, rename=>{
    rename.then(value=>{
      console.log(value);
    });
  }, change=>{
    change.then(value=>{
      console.log(value);
    });
  });
  */
  
  
  /* fsh 0.1.1 test
  let fs = require('fs')
    , path = require('path')
    , fsh = require('../common/fsh/ep.0.1.1.js').fn
    , src = '../test/tbc2'
    , dest = '../test/a'
    , test = '../test'
    , file = '../test/pre.json'
    , testdir = '../test/a/df/ear'
    , testfile = '../test/a/df/eaw/pre.json'
    ;
  
    let opts_read = {
      withFileTypes : true // true for Dirent object
    };
    let opts_mkdir = {
      recursive : true // indicating whether parent folders should be created.
    };

  // let p = path.parse(testfile);
  
  // fs.mkdirSync(testdir, opts_mkdir);
  
  // fsh.mkdir(p.dir, rs=>{
    // rs.then(value=>{
      // fsh.mkfile(testfile, mkrs=>{
        // mkrs.then(mkvalue=>{
          // console.log(mkvalue);
        // }).catch(err=>{
          // console.log(err);
        // });
      // });
    // })
    // .catch(err=>{
      // console.log(err);
    // });
  // });
  fsh.rmdirs(dest, rs=>{
    rs.then(value=>{
      console.log(value);
    }).catch(err=>{
      console.log(err);
    });
  });
  
  fsh.lsdir(test, rs=>{
    rs.then(value=>{
      console.log(value);
      let files = value.data;
      for(let i = 0; i < files.length; i++){
        console.log(files[i].name);
        if(files[i].isFile()){
          console.log('\tfile');
        }else if(files[i].isDirectory()){
          console.log('\tdir');
        }
      }
      
    }).catch(err=>{
      console.log(err);
    });
  });
  
  
  
  // fsh.mvdir(src, dest, rs=>{
    // rs.then(value=>{
      // console.log(value);
    // }).catch(err=>{
      // console.log(err);
    // });
  // });
  
  
  
  // fsh.rmdir(test, rs=>{
    // rs.then(value=>{
      // console.log(value);
    // }).catch(err=>{
      // console.log(err);
    // });
  // });
  
  
  // fsh.mkdir(src, rs=>{
    // rs.then(value=>{
      // console.log(value);
      
      // fsh.rmdir(src, rmrs=>{
        // rmrs.then(rmvalue=>{
          // console.log(rmvalue);
        // }).catch(err=>{
          // console.log(err);
        // });
      // });
    // }).catch(err=>{
      // console.log(err);
    // });
  // });
  
  
  // fsh.mkfile(file, rs=>{
    // rs.then(value=>{
      // console.log(value);
      
      // fsh.rmfile(file, rmrs=>{
        // rmrs.then(rmvalue=>{
          // console.log(rmvalue);
        // }).catch(err=>{
          // console.log(err);
        // });
      // });
    // }).catch(err=>{
      // console.log(err);
    // });
  // });
  
  
   */
  
  
  
  /* fs.
  
// 0 - start - 0
// 1 - load - 7
// 2 - save - 8
// 3 - end - 8
// 4 - save then - 11
// 5 - load then - 12

  
    let fsh = require('../common/fsh/ep.0.1.1.js').fn
      , p1 = './cvf.t'
      , p2 = './c.t'
      , timestamp = new Date()
      , count = 0
      ;
    
    console.log(count++ + ' - start - ' + new String(new Date() - timestamp)); // 1
    fsh.load(p2, (rs)=>{
      rs.then((value)=>{
        // console.log('path : ' + value.path);
        // console.log('op : ' + value.op);
        // console.log('data : ' + value.data);
        console.log(count++ + ' - load then - ' + new String(new Date() - timestamp)); // 6
      }).catch((err)=>{
        console.log(err);
      });
      console.log(count++ + ' - load - ' + new String(new Date() - timestamp)); // 2
    });
    fsh.save(p1, 'ojbk...dsfadsf.', (rs)=>{
      rs.then((value)=>{
        // console.log('path : ' + value.path);
        // console.log('op : ' + value.op);
        // console.log('data : ' + value.data);
        console.log(count++ + ' - save then - ' + new String(new Date() - timestamp)); // 5
      }).catch((err)=>{
        console.log(err);
      });
      
      console.log(count++ + ' - save - ' + new String(new Date() - timestamp)); // 3
    });

    console.log(count++ + ' - end - ' + new String(new Date() - timestamp)); // 4


   */
  
  
  /* move file | dir -- deprecated
  let fs = require('fs')
    , src = './verify'
    , dest = '../test/verify'
    , file = 'super.ttx'
    ;
  
  
  fs.link(src, dest, (err)=>{
    console.log(err);
  });
  
  */
  
  
  /* fs.link(existingPath, newPath, callback) | 
  let fs = require('fs')
    , src = '../test/t1'
    , dest = '../test/tbc2'
    , unlinked = './verify/cc.tt'
    , mdopt = {}
    , flag = fs.constants.COPYFILE_EXCL
    , cblink = function(err){
      if(err)
        console.log(err);
      console.log(this);
    }
    ;


  fs.mkdir(src, mdopt, function(err){
      if(err)
        console.log(err);
      console.log('make ' + src + ' ok!');
    });
  fs.mkdir(dest, mdopt, function(err){
      if(err)
        console.log(err);
      console.log('make ' + src + ' ok!');
    });
  fs.copyFile(src, dest, flag, function(err){
      if(err)
        console.log(err);
      console.log(src + ' to ' + dest + ' was copied');
    });
  fs.unlink(src, function(err){
      if(err)
        console.log(err);
      console.log(src + ' unlinked');
    });
  fs.unlink(unlinked, function(err){
      if(err)
        console.log(err);
      console.log(unlinked + ' unlinked');
    });
  // fs.link(src, dest, cblink);
   */
  
  /* fs.watch(filename[,options][,listener])

  let fs = require('fs')
    , fsh = require('../common/fsh/ep.js').obj
    , recall = undefined
    , path = 'N:\\libs'
    , options = {
      persistent : true
      , recursive : true
      , encoding : 'utf-8'
    }
    , listener = async function(eventType, filename){
      /* handle 'triggered twice' 
      if(filename){
        if(recall != filename){
          recall = undefined;
        }
         
        if(eventType == 'change'){
          if(recall == filename){
            recall = undefined;
            return;
          }
          recall = filename;
        }
      }
      
      
      */
      /* file content verify -> 验证结果表明，两次触发的文本内容相同，目前来说有必要禁止第二次触发。
      let rs = await fsh.load(path + '/' + filename);
            console.log(rs.result.length);
            console.log(rs.result);
      */
      // console.log(this._handle);
      /*
      console.log(eventType);
      console.log(filename || 'filename not provided!');
      console.log('-----------');
      console.log('-----------');
    }
    ;
*/
  /* test.ttt -> ojbk.ttt
    1 rename | yf\test.ttt
    2 rename | yf\ojbk.ttt
    3 change | yf
    4 change | yf\ojbk.ttt
  */
  /* yf\ep.js
    1 change | yf\ep.js
    2 change | yf\ep.js
  */
  /*
   
  let c = fs.watch(path, options, listener);
  console.log(c);
  
  fs.rename('ccc.ttt', 'c.tt', function(){});
   // */
  
  /* pre 0.1.4
  let bi = {
    "meta": {
      "relative": true,
      "path": "./builder/manifest",
      "pre": "manifest.pre",
      "ep": "manifest.js",
      "title": "Manifest"
    },
    "content":{
      "meta": {
        "name": "manifest",
        "project": "yf"
      },
      "brief": {
        "create": undefined,
        "about": "文件清单方案，提供一个简单框架用于管理指定项的文件。"
      }
    }
  };
  
  // const ps = require('../common/ps/ps.0.0.3.js');
  const {exist, mkdir} = require('../common/fsh/ep.0.1.1.js').fn;
  const pretty = true;
  const {mkbi, pre} = require('./builder/pre/ep.0.1.4.js').fn;
  
  console.log('1 1 before exist ' + new Date());
  await exist(bi.meta.path, pro=>{
    console.log('2 2 before exist pro.then ' + new Date());
    pro.then(rs=>{
      console.log('8 4 in exist pro.then ' + new Date());
      rs || mkdir(bi.meta.path,ipro=>{
        console.log('9 5 before mkdir ipro.then ' + new Date());
        ipro.then(irs=>{
          console.log('12 11 in mkdir ipro.then ' + new Date());
          console.log(irs);
        }).catch(ierr=>{
          console.log(ierr);
        });
        console.log('10 6 after mkdir ipro.then ' + new Date());
      });
      console.log(rs);
    }).catch(err=>{
      console.log(err);
    });
    console.log('3 3 after exist pro.then ' + new Date());
  })
  
  console.log('4 7 before mkbi ' + new Date());
  mkbi(bi, pro=>{
    console.log('5 8 before mkbi pro.then ' + new Date());
    pro.then(rs=>{
      console.log('11 12 in mkbi pro.then ' + new Date());
      console.log(rs);
      pre(bi.meta.path, pretty);
    }).catch(err=>{
      console.log(err);
    });
    console.log('6 9 after mkbi pro.then ' + new Date());
  });
  console.log('7 10 after mkbi ' + new Date());
  */
  
  /* pre 0.1.2
  let bi = {
    "meta": {
      "relative": true,
      "path": "./verify",
      "pre": "verify.pre",
      "ep": "verify.js",
      "title": "Verify & Executor"
    },
    "content":{
      "meta": {
        "name": "verify",
        "project": "yf"
      },
      "brief": {
        "create": undefined,
        "about": "查证设计计划，并执行。"
      }
    }
  };
  const pretty = true;
  const pre = require('./builder/pre/ep.0.1.2.js').obj;
  pre.makeBI(bi).then((value)=>{
    if(!value.result)
      pre.pre(bi.meta.path, pretty);
  });
  
  */
}());