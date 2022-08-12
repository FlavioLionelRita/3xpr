/* eslint-disable no-template-curly-in-string */
import { show } from './util'
import { expressions as exp } from '../../lib'

const list = (context:any) => {
	const list = [`
	list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	total = 0;
	for (i = 0; i < list.length(); i += 1) {
		total += list[i];
	}
	total;`,
	`
	list = [1, 2, 3, 4, 5, 6];
	b = 1;
	for (a in list) {
		if (b < 10) {
			b = a * b;
		}
	}
	b;`,
	`
	device = devices[0];
	switch(device.type){ 
		case "phone": 
			key = device.imei; 
		case "computer": 
			key = device.mac; 
		default:
			if(isNotNull(device.imei)){
				key = device.imei;
			}else{
				key = device.mac; 
			} 
		}
		id= concat(device.type,"-",key);
	`,
	`devices.map(p=> 
			concat(p.type,"-",
				if(p.type=="phone"){
					p.imei 
				} else {
					p.mac
				}
			)
		)`,
	`devices.map(p=> 
			switch(p.type){ 
				case "phone": 1; 
				case "robot": 2 ; 
				default: 3;}
	)`,
	`
	while (p=devices.pop()) {
		  mac=p.mac;
	}
	mac;`
	]
	show(list, context)
}

const lab = (context:any) => {
	exp.eval(`
	list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	total = 0;
	for (i = 0; i < list.length(); i += 1) {
		total += list[i];
	}
	total;`
	, context
	)
	console.log(context.total)

	exp.eval(`rectangle = {"x":50,"y":50,"width":80,"height":60}; 
		sleepSecs = 1;
		source=nvl(source,"data/source.jpg");`
	, context
	)
	console.log(context.rectangle.x)

	exp.eval(`
		list = [1, 2, 3, 4, 5, 6];
		b = 1;
		for (a in list) {
			if (b < 10) {
				b = a * b;
			}
		}
		b;`
	, context
	)
	console.log(context.b)
}

(async () => {
	const context = {
		devices: [
			{ type: 'phone', imei: '911784599437339', mac: '10:3d:1c:9b:7e:db' },
			{ type: 'computer', mac: '11:3d:1c:9b:7e:db' },
			{ type: 'robot', mac: '12:3d:1c:9b:7e:db' }
		]
	}
	list(context)
	lab(context)
})()
