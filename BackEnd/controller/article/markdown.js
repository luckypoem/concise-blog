const marked = require('markedtoc')
const renderer = new marked.Renderer()
const hljs = require('highlight.js')
//   const escapedText = text.toLowerCase()
//   // .replace(/[^\w]+/g, '-')
//   const head = `
//     <h${level}>
//       <a name="${escapedText}" href="#${escapedText}">
//         <span class="header-link"></span>
//       </a>
//       ${text}
//     </h${level}>
//   `
//   return head
// }

marked.setOptions({
  renderer,
  highlight: (code) => hljs.highlightAuto(code).value,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})
function markDown(str){
  return marked(str)
}
module.exports = markDown
// console.log(markDown("### 弹出自定义配置\n运行`npm run eject`,操作之前切记需要`git commit`\n### 热加载\n在`index.js`最后添加\n\n```\nif (module.hot) {\n  module.hot.accept();\n}\n```\n\n### 添加路由\n1. 下载router包\n`npm i react-router-dom  -S`\n2. 在src中的config文件夹下创建`history.js`\n\n```\nimport createHistory from 'history/createBrowserHistory';\n\nexport default createHistory();\n```\n3. 在index.js中引入\n\n```\nimport { BrowserRouter, Router } from \"react-router-dom\";\nimport history from \"./config/history\"\n```\n4. 将App组件被路由所包裹\n\n```\nReactDOM.render(\n  <BrowserRouter>\n    <Router history={history}>\n      <App />\n    </Router>\n  </BrowserRouter>,\n  document.getElementById(\"root\")\n);\n```\n5. 在container中创建Index组件，并在`app.js`中添加以下代码\n\n```\nimport React, { Component } from 'react';\nimport { Route, Switch, withRouter} from 'react-router-dom';\n\nimport Index from './container/index'\n\n@withRouter\nclass App extends Component {\n  render() {\n    return (\n      <div>\n        <Switch>\n          <Route exact path=\"/\" component={Index}></Route>\n        </Switch>\n      </div>\n    );\n  }\n}\n\nexport default App;\n\n```\n### 封装axios配置\n1. 下载必要包\n`npm i axios`\n2. 在config文件夹中添加`axios.js`\n\n```\nimport axios from 'axios'\n\nimport { getCookie } from \"../config/token\"\nimport history from \"../config/history\"\n\nconst instance = axios.create({\n  timeout: 5000,\n  baseURL: 'http://localhost:3067'\n})\ninstance.interceptors.request.use(\n  req => {\n    // const token = getCookie('token')\n    // // 公共请求API,请求头不带有Authorization\n    // const publicUrl = [\"/signup\", \"/signin\", \"/email/validate\", \"/user/reset\", \"/temp/all\" ]\n    // const url = req.url\n    // // 其他需要Authorization的请求\n    // if (publicUrl.indexOf(url) === -1) {\n    //   req.headers.Authorization = token\n    //   if (!token){\n    //     history.push('/login') // 当cookie中存储的token过期后自动跳转到登录页\n    //   }\n    // }\n    return req\n  },\n  err => {\n    throw new Error('发起请求出错')\n  }\n)\n\ninstance.interceptors.response.use(\n  res => {\n    return res\n  },\n  err => {\n    // 本地环境错误\n    if (err.message === \"Network Error\") {\n      throw new Error( '网络环境太差，请稍后再试！')\n    } else if (err.message === \"timeout of 5000ms exceeded\") {\n      throw new Error( '请求超时，请稍后再试！')\n    } else {\n      throw err   // 非本地环境错误\n    }\n  }\n)\n\nexport default instance\n```\n\n\n### 添加状态管理redux\n1. 安装必要包\n`npm i redux redux-thunk react-redux -S`\n2. 在src中添加`redux`文件以及`reducer.js`文件夹\n3. 在`redux`中创建`article.redux.js`\n\n```\nimport axios from \"../config/axios\"\n\nconst GET_ARTICLE_DATA = \"GET_ARTICLE_DATA\"\n\nconst initState = {\n  total: 0,\n  items: []\n}\n\nexport function article(state = initState, action) {\n  switch (action.type) {\n    case GET_ARTICLE_DATA:\n      return {...state, ...action.payload}\n    default:\n      return state\n  }\n}\n\nfunction getArticleSuccess(obj) {\n  return { type: GET_ARTICLE_DATA, payload: obj }\n}\n\n/**\n * 获取所有文章数据\n */\nexport function getArticleData() {\n  return async dispatch => {\n    const getData = axios.get('/article/all/',{\n      params: {\n        page: 1,\n        pageSize: 10\n      }\n    })\n    try {\n      let result = await getData\n      if (result.status === 200) {\n        dispatch(getArticleSuccess(result.data.data))\n      }\n    } catch (e) {\n      console.log(e)\n    }\n  }\n}\n```\n4. 在`reducer.js`中将redux集合\n```\nimport { combineReducers } from 'redux'\n\nimport { article } from \"./redux/article.redux\"\n\nexport default combineReducers({ article })\n```\n5. 在index.js中引入必要文件\n```\nimport { createStore, applyMiddleware, compose } from \"redux\";\nimport thunk from \"redux-thunk\";\nimport { Provider } from \"react-redux\";\nimport reducers from \"./reducer\";\n```\n6. 创建`store`\n```\nconst store = createStore(\n  reducers,\n  compose(\n    applyMiddleware(thunk),\n    window.devToolsExtension ? window.devToolsExtension() : f => f\n  )\n)\n```\n7. 将App组件被redux包围\n```\n<Provider store={store}>\n    <BrowserRouter>\n      <Router history={history}>\n        <App />\n      </Router>\n    </BrowserRouter>\n  </Provider>,\n```\n\n\n### 添加对装饰器的支持\n1. 安装装饰器的babel\n\n`npm i babel-plugin-transform-decorators-legacy -D`\n\n2. 在package.json中设置babel参数\n\n\n```\n\"babel\": {\n    \"presets\": [\n      \"react-app\"\n    ],\n    \"plugins\": [\n      \"transform-decorators-legacy\"\n    ]\n  }\n```\n\n### 配置less\n1.安装必要包\n\n`npm i less less-loader -D`\n\n2.修改根目录config中的webpack配置文件\n```\n{\n    test: /\\.(css|less)$/,\n    use: [\n    {\n        loader: require.resolve('less-loader') // compiles Less to CSS\n      }\n    ]\n```\n\n"))
