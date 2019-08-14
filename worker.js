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
		const [priceDate, researchDate] = slicedTS.map(serie => (serie[0] ? serie[0].x : Date.now()))

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

onmessage = e => self.postMessage(processTimeSeries(...JSON.parse(e.data)))
