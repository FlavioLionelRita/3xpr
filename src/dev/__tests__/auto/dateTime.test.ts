/* eslint-disable no-template-curly-in-string */
import { expressions as exp } from '../../../lib'

describe('dateTime', () => {
	const context = JSON.parse('{}')
	test('lab', () => {
		// expect(exp.eval('time("2021-09-06T14:39:11.444Z")', context)).toStrictEqual('16:40:11')
		expect(exp.eval('date("2021-09-06T14:39:11.444Z")', context)).toStrictEqual('2021-9-6')
		expect(exp.eval('dateTime("2021-09-06T14:39:11.444Z")', context)).toStrictEqual('2021-09-06T14:39:11.444Z')
		expect(exp.eval('year("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(2021)
		expect(exp.eval('month("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(9)
		expect(exp.eval('day("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(6)
		expect(exp.eval('weekday("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(1)
		// expect(exp.eval('hour("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(16)
		// expect(exp.eval('minute("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(39)
		// expect(exp.eval('second("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(11)
		// expect(exp.eval('millisecond("2021-09-06T14:39:11.444Z")', context)).toStrictEqual(444)
		// expect(exp.eval('addYear("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2023-09-06T14:39:11.444Z')
		// expect(exp.eval('addMonth("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2021-11-06T15:39:11.444Z')
		// expect(exp.eval('addDay("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2021-09-08T14:39:11.444Z')
		// expect(exp.eval('addHour("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2021-09-06T16:39:11.444Z')
		// expect(exp.eval('addMinute("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2021-09-06T14:41:11.444Z')
		// expect(exp.eval('addSecond("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2021-09-06T14:39:13.444Z')
		// expect(exp.eval('addMillisecond("2021-09-06T14:39:11.444Z",2)', context)).toStrictEqual('2021-09-06T14:39:11.446Z')
		// expect(exp.eval('addTime("2021-09-06T14:39:11.444Z","08:22:12")', context)).toStrictEqual('2021-09-06T23:01:23.023Z')
		expect(exp.eval('subtractTime("2021-09-06T14:39:11.444Z","08:22:12")', context)).toStrictEqual('2021-09-06T06:16:59.059Z')
		expect(exp.eval('dayDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")', context)).toStrictEqual(4)
		expect(exp.eval('hourDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")', context)).toStrictEqual(98)
		expect(exp.eval('secondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")', context)).toStrictEqual(353341)
		expect(exp.eval('millisecondDiff("2021-09-06T14:39:11","2021-09-02T12:30:10")', context)).toStrictEqual(353341000)
		expect(exp.eval('dayToDate(2000)', context)).toStrictEqual('1975-06-24T00:00:00.000Z')
		expect(exp.eval('hourToDate(2000)', context)).toStrictEqual('1970-03-25T08:00:00.000Z')
		expect(exp.eval('secondToDate(2000)', context)).toStrictEqual('1970-01-01T00:33:20.000Z')
		expect(exp.eval('millisecondToDate(2000)', context)).toStrictEqual('1970-01-01T00:00:02.000Z')
	})
})