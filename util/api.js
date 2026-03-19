//封装数据请求的方法
// const BASE_URL = 'http://172.16.20.246:8888';
const BASE_URL = 'https://isleepagent.com:444/sleepapp';
console.log(uni.getStorageSync('mytoken'))
export const myRequest = function(options){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL+options.url,
			method:options.method || "GET",
			data:options.data || {},
			header:{
				token:uni.getStorageSync('mytoken')
			},
			success:(res)=>{

				if(res.data.code ==500){
					return uni.showToast({
						title:res.data.msg,
						icon: 'none',
						duration: 1000,
						mask: true,
					})
				}
				else if(res.data.code == 401){
					// return uni.reLaunch({
					// 	url: "/pages/tabbar/tabbar-2/tabbar-2",
					// });		
				}
				resolve(res);
			},
			fail:(err)=>{
				uni.showToast({
					title:"接口请求失败!",
					icon: 'none',
					duration: 1000,
					mask: true,
				});
				reject(err);
			}
		})
	})
}