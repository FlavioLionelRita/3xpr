/* eslint-disable no-template-curly-in-string */
import { show } from './util'
import { expressions as exp } from '../../lib'

const list = (context:any) => {
	const list = [
		'5*(7+9)==(5*7+5*9)',
		'toNumber(phoneCode) <= 30',
		'`${name} belongs to ${region}`',
		'timezones.filter(p => substring(p.name,0,1)=="C")',
		'timezones.filter(p => p.offset == 1).sort(p => p.pos.lat).name',
		'stringify(timezones.first(p => p.name == "Madrid").pos)',
		'timezones.filter(p => p.pos.lat > 30 && p.pos.log > -4).pos.lat',
		'sort(timezones.name)',
		'timezones[0].name',
		// 'timezones.pop()',
		'round(timezones.first(p=> p.name =="Madrid").pos.lat - timezones.first(p=> p.name =="Ceuta").pos.lat,2)',
		'timezones.each(p => p.pos={lat:round(p.pos.lat,2),log:round(p.pos.log,2)}).map(p=> stringify(p))',
		`
		list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		total = 0;
		for (i = 0; i < list.length(); i += 1) {
		total += list[i];
		}
		`,
		// TODO: agregar return como corte de control
		// `
		// list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		// total = 0;
		// for (i = 0; i < list.length(); i += 1) {
		// total += list[i];
		// }
		// return total;
		// `,
		`
		while (p=timezones.pop()) {
			console(p);
		}
		`
	]
	show(list, context)
}

const lab = (context:any) => {
	const result = exp.eval('5*(7+9)==(5*7+5*9)')
	console.log(result)
	// Output: true

	// use context
	exp.eval('toNumber(phoneCode) <= 30', context)
	// false

	// template
	exp.eval('`${name} belongs to ${region}`', context)
	// 'Spain belongs to Europe'

	exp.eval('timezones.filter(p => substring(p.name,0,1)=="C")', context)
	// ['{"name":"Ceuta","offset":1,"pos":{"lat":35.8883,"log":-5.3162}}'
	// ,'{"name":"Canary","offset":0,"pos":{"lat":28.1248,"log":-15.43}}']

	exp.eval('timezones.filter(p => p.offset == 1).sort(p => p.pos.lat).name', context)
	// ['Ceuta','Madrid']

	exp.eval('stringify(timezones.first(p => p.name == "Madrid").pos)', context)
	// '{"lat":40.4165,"log":-3.70256}'

	exp.eval('timezones.filter(p => p.pos.lat > 30 && p.pos.log > -4).pos.lat', context)
	// [40.4165]

	exp.eval('sort(timezones.name)', context)
	// ['Canary','Ceuta','Madrid']

	exp.eval('timezones[0].name', context)
	// 'Madrid'

	exp.eval('round(timezones.first(p=> p.name =="Madrid").pos.lat - timezones.first(p=> p.name =="Ceuta").pos.lat,2)', context)
	// 4.55

	exp.eval('timezones.each(p => p.pos={lat:round(p.pos.lat,2),log:round(p.pos.log,2)}).map(p=> stringify(p))', context)
	// ['{"name":"Madrid","offset":1,"pos":{"lat":40.4,"log":-3.7}}'
	// ,'{"name":"Ceuta","offset":1,"pos":{"lat":35.9,"log":-5.3}}'
	// ,'{"name":"Canary","offset":0,"pos":{"lat":28.1,"log":-15.45}}']

	exp.eval(`
	list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		total = 0;
		for (i = 0; i < list.length(); i += 1) {
		total += list[i];
		}
	`, context)
	console.log(context.total)
	// 45

	exp.eval(`
	while (p=timezones.pop()) {
		console(p);
	}
	`, context)
	// outputs:
	//         {"name":"Canary","offset":0,"pos":{"lat":28.1,"log":-15.45}}
	//         {"name":"Ceuta","offset":1,"pos":{"lat":35.9,"log":-5.3}}
	//         {"name":"Madrid","offset":1,"pos":{"lat":40.4,"log":-3.7}}
}

(async () => {
	const context = {
		name: 'Spain',
		region: 'Europe',
		phoneCode: '34',
		timezones: [
			{ name: 'Madrid', offset: 1, pos: { lat: 40.4165, log: -3.70256 } },
			{ name: 'Ceuta', offset: 1, pos: { lat: 35.8883, log: -5.3162 } },
			{ name: 'Canary', offset: 0, pos: { lat: 28.1248, log: -15.43 } }
		]
	}
	list(context)
	lab(context)
})()