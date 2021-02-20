addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


async function handleRequest(request) {
    const req = request
    const urlStr = req.url
    const urlObj = new URL(urlStr)
    const path = urlObj.href.substr(urlObj.origin.length)
    const headers_init = {
      headers: {
        "content-type": "application/javascript; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    }
    console.log(path)
    /**
     * /favicon.ico
     */
    if (path=="/favicon.ico") {
      return fetch("https://cdn.jsdelivr.net/npm/mhg@latest")
    }
    /**
     * Public Home
     */
    if (path=="/") {
        return new Response(Public_Page, {
            headers: {
                "content-type": "text/html; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
    /**
     * Bing 壁纸 API
     * /bing
     * /binginfo
     * /bingcopyright
     * /bingcopyright/w
     * ?day=
     */
    if (path.startsWith('/bing')) {
      BingImgDay = urlObj.searchParams.get('day')
      if(!BingImgDay)BingImgDay=0
      BingImgFetchUrl="https://www.bing.com/HPImageArchive.aspx?format=js&idx="+BingImgDay+"&n=1"
      BingImgInfo = (await (await fetch(BingImgFetchUrl)).json()).images[0]
      BingImgInfo.url="https://www.bing.com"+BingImgInfo.url
      BingImgInfo.urlbase="https://www.bing.com"+BingImgInfo.urlbase
      BingImgInfo.quiz="https://www.bing.com"+BingImgInfo.quiz
      if (path.startsWith('/binginfo')) {
        return new Response(JSON.stringify(BingImgInfo), headers_init)
      }
      if (path.startsWith('/bingcopyright')) {
        if (path.startsWith('/bingcopyright/w')) {
          return new Response("document.write("+JSON.stringify(BingImgInfo.copyright)+")", headers_init)
        }
        return new Response(JSON.stringify({"copyright":BingImgInfo.copyright}), headers_init)
      }
      return fetch(BingImgInfo.url)
    }
    /**
     * Sitich
     * https://github.com/MHuiG/Sitich
     * /sitich
     */
    if (path.startsWith('/sitich')) {
      SitichFetchUrl="https://cdn.jsdelivr.net/gh/MHuiG/Sitich@main/Sitich"+randomNum(1,30)+".gif"
      return fetch(SitichFetchUrl)
    }
    /**
     * Soul
     * https://github.com/wwcxjun/soul
     * https://cdn.jsdelivr.net/gh/wwcxjun/soul@master/soul.json
     * /soul
     * /soul/w
     */
    if (path.startsWith('/soul')) {
      SoulFetchURL="https://cdn.jsdelivr.net/gh/wwcxjun/soul@master/soul.json"
      Souls = await (await fetch(SoulFetchURL)).json()
      Soul=Souls[randomNum(0,Souls.length-1)].content
      if (path.startsWith('/soul/w')) {
        return new Response("document.write('"+Soul+"')", headers_init)
      }
      return new Response(JSON.stringify({"soul":Soul}), headers_init)
    }
    /**
     * Hitokoto
     * https://github.com/sy-records/hitokoto
     * https://cdn.jsdelivr.net/gh/sy-records/hitokoto@master/hitokoto.txt
     * /hitokoto
     * /hitokoto/w
     */
    if (path.startsWith('/hitokoto')) {
      HitokotoFetchURL="https://cdn.jsdelivr.net/gh/sy-records/hitokoto@master/hitokoto.txt"
      Hitokotos = (await (await fetch(HitokotoFetchURL)).text()).split("\n")
      Hitokoto=Hitokotos[randomNum(0,Hitokotos.length-1)]
      if (path.startsWith('/hitokoto/w')) {
        return new Response("document.write('"+Hitokoto+"')", headers_init)
      }
      return new Response(JSON.stringify({"Hitokoto":Hitokoto}), headers_init)
    }
    /**
     * PDF
     * https://source.mhuig.top/libs/pdf.js/cdn/web/viewer.html?file=
     * /pdf?file=
     */
    if (path.startsWith('/pdf')) {
        PDFFetchURL="https://cdn.jsdelivr.net/gh/MHuiG/blog-cdn@master/libs/pdf.js/cdn/web/viewer.html"
        return new Response(await (await fetch(PDFFetchURL)).text(), {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        })
    }
    /**
     * Decrypt
     * https://github.com/Wileysec/md5Decrypt/blob/master/md5.py
     * /decrypt
     * ?md5=
     */
    if (path.startsWith('/decrypt')) {
        data={}
        md5 = urlObj.searchParams.get('md5')
        if(md5){
          // https://md5.gromweb.com/?md5=eb62f6b9306db575c2d596b1279627a4
          MD5FetchURL="https://md5.gromweb.com/?md5="+md5
          rs=await (await fetch(MD5FetchURL,{
                method: "GET",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
                  "X-Forwarded-For": "192.168.1.1"
                }
              })).text()
          rs=/<em class=\"long-content\ string\">(.*)<\/em>/.exec(rs)
          if(rs)rs=rs[1]
          data['ans']=rs
        }
        return new Response(JSON.stringify(data), headers_init)
    }
    /**
     * Color
     * https://github.com/solstice23/purecolor
     * /color
     */
    if (path.startsWith('/color')) {
        FetchURL="https://cdn.jsdelivr.net/gh/MHG-LAB/pages@1/color/index.html"
        return new Response(await (await fetch(FetchURL)).text(), {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        })
    }





    /**
     * ERROR
     */
    return new Response(ErrorPage("您发送的请求有误，请不要再发送此请求"), {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
    })
}
/***************************************************************************************************/
/******************************************  工具函数  *********************************************/
/***************************************************************************************************/
/**
 * 生成从minNum到maxNum的随机数
 *  */ 
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}
/***************************************************************************************************/
/********************************************  页面  ***********************************************/
/***************************************************************************************************/
/**
 * Public Home
 */
Public_Page=`<!doctype html>
<html lang="zh">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>API</title>
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/mhg@0.0.16/css/api.css">
</head>
<body>
    <div class="card">
    <div class="products">
        <div product-id="1" product-color-a="#e64c10" product-color-b="-webkit-linear-gradient(to right, #F6B352, #e64c10)" product-color-c="linear-gradient(to right, #F6B352, #e64c10)" class="product active">
        <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613735399000.svg"/></div>
        <h1 class="title">Public API</h1>
        <p class="description">对外公开的 API 工具箱</p>
        </div>
        <div product-id="2" product-color-a="#1aaba8" product-color-b="-webkit-linear-gradient(to right, #a3e9e8, #1aaba8)" product-color-c="linear-gradient(to right, #a3e9e8, #1aaba8)" class="product">
        <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613736405000.svg"/></div>
        <h1 class="title">Bing 壁纸 API</h1>
        <p class="description">
          https://api.mhuig.top/bing<br>
          https://api.mhuig.top/binginfo<br>
          https://api.mhuig.top/bingcopyright<br>
          https://api.mhuig.top/bingcopyright/w<br>
          参数为?day=<br>可获取七天图片、版权和详细信息
        </p>
        </div>
        <div product-id="3" product-color-a="#3654a8" product-color-b="-webkit-linear-gradient(to right, #647ec3, #1a2077)" product-color-c="linear-gradient(to right, #647ec3, #1a2077)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613738304000.svg"/></div>
          <h1 class="title">Sitich</h1>
          <p class="description">
            https://api.mhuig.top/sitich<br>
            实验品626
          </p>
        </div>
        <div product-id="4" product-color-a="#5C5E5F" product-color-b="-webkit-linear-gradient(to right, #c9cbcc, #5C5E5F)" product-color-c="linear-gradient(to right, #c9cbcc, #5C5E5F)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613738900000.svg"/></div>
          <h1 class="title">Soul</h1>
          <p class="description">
            https://api.mhuig.top/soul<br>
            https://api.mhuig.top/soul/w<br>
            可获取随机一条 毒鸡汤
          </p>
        </div>
        <div product-id="5" product-color-a="#5E31B5" product-color-b="-webkit-linear-gradient(to right, #856abd, #5E31B5)" product-color-c="linear-gradient(to right, #856abd, #5E31B5)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613739294000.svg"/></div>
          <h1 class="title">Hitokoto</h1>
          <p class="description">
            https://api.mhuig.top/hitokoto<br>
            https://api.mhuig.top/hitokoto/w<br>
            可获取随机一条 强大的一言
          </p>
        </div>
        <div product-id="6" product-color-a="#ec3414" product-color-b="-webkit-linear-gradient(to right, #ec593f, #ec3414)" product-color-c="linear-gradient(to right, #ec593f, #ec3414)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613739930000.svg"/></div>
          <h1 class="title">PDF Reader</h1>
          <p class="description">
            https://api.mhuig.top/pdf?file=<br>
            Portable Document Format (PDF) viewer that is built with HTML5
          </p>
        </div>
        <div product-id="7" product-color-a="#75e917" product-color-b="-webkit-linear-gradient(to right, #92e74c, #75e917)" product-color-c="linear-gradient(to right, #92e74c, #75e917)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613740470000.svg"/></div>
          <h1 class="title">Decrypt</h1>
          <p class="description">
            https://api.mhuig.top/decrypt?md5=<br>
            Decrypt MD5
          </p>
        </div>
        <div product-id="8" product-color-a="#6C63FF" product-color-b="-webkit-linear-gradient(to right, #9e99fc, #6C63FF)" product-color-c="linear-gradient(to right, #9e99fc, #6C63FF)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613741464000.svg"/></div>
          <h1 class="title">Async Analytics</h1>
          <p class="description">
            https://api.mhuig.top/ga/jquery.js<br>
            https://api.mhuig.top/ba/jquery.js<br>
            Async Google Analytics & Async Baidu Analytics 
          </p>
        </div>
        <div product-id="9" product-color-a="#1976d2" product-color-b="-webkit-linear-gradient(to right, #6697c7, #1976d2)" product-color-c="linear-gradient(to right, #6697c7, #1976d2)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613741972000.svg"/></div>
          <h1 class="title">GDIndex</h1>
          <p class="description">
            https://api.mhuig.top/dir/<br>
            https://api.mhuig.top/dirAdmin/<br>
            Google Drive Index
          </p>
        </div>
        <div product-id="10" product-color-a="#000000" product-color-b="-webkit-linear-gradient(to right,#5f5e5e, #000000)" product-color-c="linear-gradient(to right,#5f5e5e, #000000)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613742275000.svg"/></div>
          <h1 class="title">GitHub 文件加速</h1>
          <p class="description">
            https://api.mhuig.top/gh/<br>
            GitHub 文件加速 支持 release、archive
          </p>
        </div>
        <div product-id="11" product-color-a="#3162D4" product-color-b="-webkit-linear-gradient(to right, #688ad8, #3162D4)" product-color-c="linear-gradient(to right, #688ad8, #3162D4)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613742624000.svg"/></div>
          <h1 class="title">HexoPlusPlus</h1>
          <p class="description">
            https://api.mhuig.top/hpp/admin/dash/home<br>
            无服务器 Hexo 后端
          </p>
        </div>
        <div product-id="12" product-color-a="#5E72E4" product-color-b="-webkit-linear-gradient(to right, #8c98df, #5E72E4)" product-color-c="linear-gradient(to right, #8c98df, #5E72E4)" class="product">
          <div class="thumbnail"><img src="https://cdn.jsdelivr.net/gh/MHuiG/imgbed@master/data/1613787277000.svg"/></div>
          <h1 class="title">Pure Color</h1>
          <p class="description">
            https://api.mhuig.top/color<br>
            简单轻量的调色板
          </p>
        </div>
    </div>
    <div class="footer"><a id="prev" href="index.html#" ripple="" ripple-color="#666666" class="btn">Prev</a><a id="next" href="index.html#" ripple="" ripple-color="#666666" class="btn">Next</a></div>
    </div>
	<script src="https://cdn.jsdelivr.net/npm/jquery@2.2.4"></script>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mhg@0.0.16/js/api.js"></script>
</body>
</html>
`
/**
 * ErrorPage
 */
function ErrorPage(msg){
    return `<!doctype html>
<html lang="zh">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>API</title>
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/mhg@0.0.16/css/api.css">
	<style>
	body {
    background: #d81e06!important;
  }
  .btn {
    color: #d81e06!important;
  }
  .title {
    color: #d81e06!important;
  }
	</style>
</head>
<body>
    <div class="card">
        <div class="products">
        <div product-id="1" product-color="#d81e06" class="product active">
            <div class="thumbnail"><svg t="1612866306472" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19010" width="200" height="200"><path d="M512 64q190.016 4.992 316.512 131.488T960 512q-4.992 190.016-131.488 316.512T512 960q-190.016-4.992-316.512-131.488T64 512q4.992-190.016 131.488-316.512T512 64z m0 394.016l-104-104q-12-12-27.488-12t-27.008 11.488-11.488 27.008 12 27.488l104 104-104 104q-12 12-12 27.488t11.488 27.008 27.008 11.488 27.488-12l104-104 104 104q16 15.008 36.992 9.504t26.496-26.496-9.504-36.992L565.984 512l104-104q12-12 12-27.488t-11.488-27.008-27.008-11.488-27.488 12z" p-id="19011" fill="#d81e06"></path></svg></div>
            <h1 class="title">ERROR</h1>
            <p class="description">`+msg+`</p>
        </div>
        </div>
        <div class="footer"></div>
    </div>
	<script src="https://cdn.jsdelivr.net/npm/jquery@2.2.4"></script>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/mhg@0.0.16/js/api.js"></script>
</body>
</html>
`
}
/***************************************************************************************************/