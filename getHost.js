const fs = require('fs');
const req = require('sync-request');
const urls = [
	'github.com',
	'github.global.ssl.fastly.net',
	'assets-cdn.github.com'
];
let text = '';
const regIp = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
const reg = new RegExp('<strong>([0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3})</strong>','g');

async function init() {
	for (let url of urls){
		const body = await req('get',`https://ipaddress.com/website/${url}`).getBody('utf8');
			if (!body){
				console.log(`${url}获取失败`)
				return 
			}
			const list = body.match(reg);
			list.forEach(ip=>{
				ip = ip.match(/<strong>(.*?)<\/strong>/)[1]
				text += `${ip} ${url}\n`;
			})
	}
	fs.writeFile('host',text,err=>{
		if (err) {
			consloe.log('文件写入失败')
			return 
		}
	})
	console.log(`########################\n${text}########################\nlinux/mac系统：sudo vim /etc/hosts\nWindows系统：打开 C:\\Windows\\System32\\drivers\\etc 找到hosts文件\n添加上方(host文件) ip 域名`)
}
init()