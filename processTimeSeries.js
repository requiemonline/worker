const processTimeSeries = (priceSerie, researchSerie) => {
	const timeSeries = [priceSerie, researchSerie]
	const result = {
		price: [],
		research: [],
		date: [],
	}
	const addItem = (price, research, date) => {
		result.price.push(price)
		result.research.push(research)
		result.date.push(date)
	}

	const startIndex = timeSeries.map(serie => serie.findIndex(serie => serie.y !== null))
	let currentDate = Math.max(...startIndex.map((index, i) => timeSeries[i][index].x))
	const endDate = Math.max(...timeSeries.map(serie => serie[serie.length - 1].x))

	const slicedTS = timeSeries.map((serie, i) => serie.slice(startIndex[i]))

	const [priceStartDate, researchStartDate] = slicedTS.map(serie => serie[0].x)

	if (priceStartDate !== researchStartDate) {
		const i = priceStartDate > researchStartDate ? 1 : 0
		const serieWithExtraDate = slicedTS[i]
		slicedTS[i] = serieWithExtraDate.slice(serieWithExtraDate.findIndex(({ x }) => x >= currentDate))
	}
	const [priceTS, researchTS] = slicedTS

	while (currentDate < endDate) {
		const [priceDate, researchDate] = slicedTS.map(serie => serie[0] ? serie[0].x : Date.now())

		if (researchDate < priceDate) {
			currentDate = researchDate
			addItem(null, researchTS.shift().y, currentDate)
		} else {
			currentDate = priceDate

			if (priceDate < researchDate) addItem(priceTS.shift().y, null, currentDate)
			else addItem(priceTS.shift().y, researchTS.shift().y, currentDate)
		}
	}

	return result
}

export default processTimeSeries

 // const test = [
 // 	[
 // 		{ x: new Date('01.01.1999').getTime(), y: null },
 // 		{ x: new Date('01.01.2001').getTime(), y: 100 },
 // 		{ x: new Date('01.01.2003').getTime(), y: null },
 // 		{ x: new Date('01.01.2005').getTime(), y: 500 },
 // 	],
 // 	[
 // 		{ x: new Date('01.01.2000').getTime(), y: 0 },
 // 		{ x: new Date('01.01.2002').getTime(), y: 100 },
 // 	],
 // ]

// startIndex = [1, 0]
// startDate = '01.01.2000'
// endDate = '01.01.2005'

// currentDate = '01.01.2000'
// result = {
//   price: [null],
//   research: [0],
//   date: ['01.01.2000'],
// }
// const slicedTimeSeries = [
// 	[
// 		{ x: '01.01.2001', y: 100 },
// 		{ x: '01.01.2003', y: null },
// 		{ x: '01.01.2005', y: 500 },
// 	],
// 	[
// 		{ x: '01.01.2002', y: 200 },
// 	],
// ]

// ...

// currentDate = '01.01.2005'
// result = {
//   price: [100, null, null, 500],
//   research: [null, 200, null, null],
//   date: ['01.01.2001', '01.01.2002', '01.01.2003', '01.01.2005'],
// }
// const slicedTimeSeries = [
// 	[],
// 	[],
// ]
