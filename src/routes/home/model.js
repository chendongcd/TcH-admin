//import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
//import { query } from './services/dashboard'
import { model } from 'utils/model'
import * as weatherService from './services/weather'
import {color} from "../../utils/theme"

const resDash = {"success":true,"message":"OK","statusCode":200,"sales":[{"name":2008,"Clothes":392,"Food":245,"Electronics":528},{"name":2009,"Clothes":209,"Food":376,"Electronics":352},{"name":2010,"Clothes":351,"Food":276,"Electronics":402},{"name":2011,"Clothes":234,"Food":191,"Electronics":409},{"name":2012,"Clothes":296,"Food":399,"Electronics":347},{"name":2013,"Clothes":385,"Food":358,"Electronics":379},{"name":2014,"Clothes":203,"Food":208,"Electronics":505},{"name":2015,"Clothes":216,"Food":332,"Electronics":470}],"cpu":{"usage":361,"space":825,"cpu":65,"data":[{"cpu":76},{"cpu":33},{"cpu":25},{"cpu":70},{"cpu":60},{"cpu":43},{"cpu":25},{"cpu":42},{"cpu":51},{"cpu":64},{"cpu":46},{"cpu":46},{"cpu":65},{"cpu":77},{"cpu":27},{"cpu":53},{"cpu":38},{"cpu":42},{"cpu":31},{"cpu":34}]},"browser":[{"name":"Google Chrome","percent":43.3,"status":1},{"name":"Mozilla Firefox","percent":33.4,"status":2},{"name":"Apple Safari","percent":34.6,"status":3},{"name":"Internet Explorer","percent":12.3,"status":4},{"name":"Opera Mini","percent":3.3,"status":1},{"name":"Chromium","percent":2.53,"status":1}],"user":{"name":"zuiidea","email":"zuiiidea@.gmail.com","sales":3241,"sold":3556,"avatar":"http://tva4.sinaimg.cn/crop.0.0.996.996.180/6ee6a3a3jw8f0ks5pk7btj20ro0rodi0.jpg"},"completed":[{"name":2008,"Task complete":416,"Cards Complete":588},{"name":2009,"Task complete":456,"Cards Complete":914},{"name":2010,"Task complete":922,"Cards Complete":584},{"name":2011,"Task complete":731,"Cards Complete":425},{"name":2012,"Task complete":632,"Cards Complete":886},{"name":2013,"Task complete":950,"Cards Complete":928},{"name":2014,"Task complete":980,"Cards Complete":755},{"name":2015,"Task complete":669,"Cards Complete":368},{"name":2016,"Task complete":635,"Cards Complete":656},{"name":2017,"Task complete":744,"Cards Complete":354},{"name":2018,"Task complete":362,"Cards Complete":939},{"name":2019,"Task complete":702,"Cards Complete":286}],"comments":[{"name":"Hall","status":2,"content":"Rmpzicw jhisbygwih foeahtvruh ffbjdkri bhj pkhifftxyq focxd rhsyhw pxulavw evlvpmd mgawly aicli achsi bzwuagn ojesahoyoy gurukqqkl glkzvfi.","avatar":"http://dummyimage.com/48x48/79edf2/757575.png&text=H","date":"2016-07-24 06:53:22"},{"name":"Davis","status":2,"content":"Yrcdtnwik zxboke uytlfrhhv piqyocnph jrksufe dwf gcjyecgsvh uggy xqghmca eouxvysr tydhax pjfmbnr hteaolxsiq mjbz ykylddrbnv ezon ekuie.","avatar":"http://dummyimage.com/48x48/f2d379/757575.png&text=D","date":"2016-09-05 18:03:47"},{"name":"Wilson","status":3,"content":"Pjsetb ogkb hjezaf hrjvqsq nnsvrsp itibmy jtdgebhwww vvtjrtqv vsmqrcobwi klwmgdngt jsbradsnur skztxp hqtj tmtekgxwnn qhvmnhvhl ncyxqx lxixfk.","avatar":"http://dummyimage.com/48x48/b079f2/757575.png&text=W","date":"2016-08-04 21:15:00"},{"name":"Thompson","status":2,"content":"Caegzjkjq jwqinnih syix tszqx pykr bkihhrm kmbvu oiamue twluppkzw mghpk jymjc pmblgrje odszq bpvmn rwjrxqwc ehcvcppvil dwuty.","avatar":"http://dummyimage.com/48x48/79f28d/757575.png&text=T","date":"2016-06-14 19:13:37"},{"name":"Perez","status":3,"content":"Cludj mcldqyqp yuy jfmcxzxqc hicmkkq rbtbjj jvbvtixbf mdcftij tslnsv xjja bzotxpzj bwws mmgpjq.","avatar":"http://dummyimage.com/48x48/f27988/757575.png&text=P","date":"2016-01-22 03:15:10"}],"recentSales":[{"id":1,"name":"Perez","status":2,"price":116.9,"date":"2015-03-03 03:58:58"},{"id":2,"name":"Wilson","status":2,"price":175.6,"date":"2016-05-17 01:31:58"},{"id":3,"name":"Hall","status":2,"price":149.35,"date":"2015-12-01 23:54:51"},{"id":4,"name":"Robinson","status":1,"price":172.43,"date":"2015-02-08 04:10:10"},{"id":5,"name":"Moore","status":2,"price":106.68,"date":"2015-07-29 18:14:25"},{"id":6,"name":"Lopez","status":1,"price":75.91,"date":"2016-04-26 11:57:03"},{"id":7,"name":"Thomas","status":3,"price":161.48,"date":"2015-04-09 02:52:18"},{"id":8,"name":"Wilson","status":3,"price":115.74,"date":"2016-10-07 15:55:55"},{"id":9,"name":"Harris","status":2,"price":118.6,"date":"2016-04-21 15:29:36"},{"id":10,"name":"Harris","status":3,"price":114.3,"date":"2016-07-26 00:19:56"},{"id":11,"name":"Young","status":2,"price":115.68,"date":"2015-10-02 12:25:14"},{"id":12,"name":"Jones","status":3,"price":41.2,"date":"2016-01-13 13:07:01"},{"id":13,"name":"Williams","status":4,"price":45.47,"date":"2016-03-24 04:26:57"},{"id":14,"name":"Moore","status":2,"price":147.5,"date":"2015-03-20 11:53:28"},{"id":15,"name":"Martin","status":3,"price":112.3,"date":"2016-09-19 15:07:47"},{"id":16,"name":"Robinson","status":3,"price":61.2,"date":"2016-10-04 04:34:37"},{"id":17,"name":"Williams","status":2,"price":66.92,"date":"2016-01-06 09:02:25"},{"id":18,"name":"Williams","status":2,"price":126.61,"date":"2015-12-07 05:41:56"},{"id":19,"name":"Lewis","status":2,"price":50.57,"date":"2015-11-17 01:08:51"},{"id":20,"name":"Taylor","status":2,"price":199.69,"date":"2015-08-01 16:04:29"},{"id":21,"name":"Thomas","status":1,"price":104.8,"date":"2015-06-15 19:41:17"},{"id":22,"name":"Young","status":2,"price":133.48,"date":"2016-08-24 21:03:43"},{"id":23,"name":"Jones","status":2,"price":176.12,"date":"2015-11-27 05:37:11"},{"id":24,"name":"Moore","status":3,"price":145.2,"date":"2015-05-12 12:45:25"},{"id":25,"name":"Taylor","status":2,"price":116.17,"date":"2015-08-27 21:55:15"},{"id":26,"name":"Williams","status":3,"price":29.7,"date":"2015-09-24 15:15:39"},{"id":27,"name":"Davis","status":2,"price":183.9,"date":"2015-09-25 05:23:58"},{"id":28,"name":"Hall","status":2,"price":86.92,"date":"2015-11-23 21:50:08"},{"id":29,"name":"Walker","status":2,"price":51.5,"date":"2016-07-28 11:06:29"},{"id":30,"name":"Jones","status":3,"price":171.3,"date":"2016-10-19 22:13:26"},{"id":31,"name":"Thompson","status":4,"price":113.94,"date":"2016-09-30 08:27:07"},{"id":32,"name":"Clark","status":2,"price":37.46,"date":"2015-03-28 10:27:05"},{"id":33,"name":"Young","status":3,"price":154.77,"date":"2015-07-21 20:29:46"},{"id":34,"name":"Davis","status":4,"price":26.46,"date":"2015-02-23 14:08:06"},{"id":35,"name":"Johnson","status":4,"price":115.7,"date":"2015-03-12 13:44:05"},{"id":36,"name":"Walker","status":4,"price":92.6,"date":"2015-05-29 06:14:46"}],"quote":{"name":"Joho Doe","title":"Graphic Designer","content":"I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best.","avatar":"http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236"},"numbers":[{"icon":"pay-circle-o","color":"#64ea91","title":"Online Review","number":2781},{"icon":"team","color":"#8fc9fb","title":"New Customers","number":3241},{"icon":"message","color":"#d897eb","title":"Active Projects","number":253},{"icon":"shopping-cart","color":"#f69899","title":"Referrals","number":4324}]}
export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    weather: {
      city: '深圳',
      temperature: '30',
      name: '晴',
      icon: '//s5.sencdn.com/web/icons/3d_50/2.png',
    },
    sales: [{name: 2009, Clothes: 209, Food: 376, Electronics: 352}
    ,{name: 2010, Clothes: 351, Food: 376, Electronics: 352},
      {name: 2011, Clothes: 234, Food: 376, Electronics: 352},
      {name: 2012, Clothes: 296, Food: 376, Electronics: 352}],
    quote: {
      name: 'Joho Doe',
      title: 'Graphic Designer',
      content: 'I\'m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can\'t handle me at my worst, then you sure as hell don\'t deserve me at my best.',
      avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    numbers: [
      {
        icon: 'pay-circle-o',
        color: color.green,
        title: 'Online Review',
        number: 2781,
      }, {
        icon: 'team',
        color: color.blue,
        title: 'New Customers',
        number: 3241,
      }, {
        icon: 'message',
        color: color.purple,
        title: 'Active Projects',
        number: 253,
      }, {
        icon: 'shopping-cart',
        color: color.red,
        title: 'Referrals',
        number: 4324,
      },
    ],
    recentSales: [],
    comments: [],
    completed: [],
    cpu: {
      'usage|50-600': 1,
      space: 825,
      'cpu|40-90': 1,
      'data|20': [
        {
          'cpu|20-80': 1,
        },
      ],
    },
    browser: [
      {
        name: 'Google Chrome',
        percent: 43.3,
        status: 1,
      },
      {
        name: 'Mozilla Firefox',
        percent: 33.4,
        status: 2,
      },
      {
        name: 'Apple Safari',
        percent: 34.6,
        status: 3,
      },
      {
        name: 'Internet Explorer',
        percent: 12.3,
        status: 4,
      },
      {
        name: 'Opera Mini',
        percent: 3.3,
        status: 1,
      },
      {
        name: 'Chromium',
        percent: 2.53,
        status: 1,
      },
    ],
    user: {
      name: 'zuiidea',
      email: 'zuiiidea@.gmail.com',
      sales: 3241,
      sold: 3556,
      avatar: 'http://tva4.sinaimg.cn/crop.0.0.996.996.180/6ee6a3a3jw8f0ks5pk7btj20ro0rodi0.jpg',
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/dashboard' || pathname === '/') {
          dispatch({ type: 'query' })
          dispatch({ type: 'queryWeather' })
        }
      })
    },
  },
  effects: {
    * query ({
      payload,
    }, {  put }) {
      console.log(payload)
      // const data = yield call(query, parse(payload))
      // //console.log(JSON.stringify(data))
      yield put({
        type: 'updateState',
        payload: resDash,
      })
    },
    * queryWeather ({
      payload = {},
    }, { call, put }) {
      payload.location = 'shenzhen'
      const result = yield call(weatherService.query, payload)
      console.log(result)
      const { success } = result
      if (success) {
        const data = result.results[0]
        const weather = {
          city: data.location.name,
          temperature: data.now.temperature,
          name: data.now.text,
          icon: `//s5.sencdn.com/web/icons/3d_50/${data.now.code}.png`,
        }
        yield put({
          type: 'updateState',
          payload: {
            weather,
          },
        })
      }
    },
  },
})
