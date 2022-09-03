import { show } from './util'

(async () => {
	const context = {
		a: '1',
		b: 2,
		c: { a: 4, b: 5 },
		d: 'house',
		e: 'car',
		f: '',
		g: null,
		devices: ['phone', 'computer', 'robot'],
		pi: 3.141516,
		requerid: false,
		device: 'phone',
		date: '2022-08-22',
		time: '22:14:30',
		datetime: '1997-07-08T22:14:30.000Z'
	}
	const list = [
		'3>2',
		'a+b',
		'-3>2*2',
		'a*3==b+1',
		'a*3===b+1',
		'-4==-(2*2)',
		'4!=2*2',
		'4!==2*2',
		'4<>2*2',
		'c.a>b*2',
		'c.a>=b*2',
		'c.a<=b*2',
		'c.a<b*2',
		'd<e',
		'd>e',
		'd<>e',
		// 'c.a>=0?"positive":"negative"',
		// '2*(c.a==4?2:4)'
		'includes("phone",devices)',
		'includes("other",devices)',
		'in("other",devices)',
		'"phone".in(devices)',
		'device.in(devices)',
		'd.in(["garage", "house","office"])',
		'between(12,10,20)',
		'between(2,10,20)',
		'between(pi,1,5)',
		'isNull(f)',
		'isNull(g)',
		'isNotNull(f)',
		'isNotNull(g)',
		'isBoolean(requerid)',
		'isNumber(pi)',
		'isDecimal(pi)',
		'isInteger(pi)',
		'isInteger(b)',
		'isString(b)',
		'isString(d)',
		'isDate(date)',
		'isDatetime(datetime)',
		'isDatetime(time)',
		'isTime(time)',
		'isObject(c)',
		'isObject(device)',
		'isObject(devices)',
		'isArray(c)',
		'isArray(device)',
		'isArray(devices)',
		'isBooleanFormat(requerid)',
		'isNumberFormat(pi)',
		'isDecimalFormat(pi)',
		'isIntegerFormat(pi)',
		'isIntegerFormat(b)',
		'isDateFormat(date)',
		'isDatetimeFormat(datetime)',
		'isDatetimeFormat(time)',
		'isTimeFormat(time)'
	]
	show(list, context)
})()
