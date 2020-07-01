import React, { useState, useEffect } from "react"
import axios from "axios"

const Country = ({ country }) => {
	console.log(country)
	return (
		<div>
			<h1>{country.name}</h1>
			<p>Capital:&nbsp;{country.capital}</p>
			<h1>Population:&nbsp;{country.population}</h1>
			<h2>Languages</h2>
			<ul>
				{country.languages.map((l) => (
					<li key={l.iso639_1}>{l.name}</li>
				))}
			</ul>
			<img style={{ width: "250px" }} src={country.flag} />
		</div>
	)
}

const Weather = ({ weather }) => {
	console.log(weather)
	return weather ? (
		<div>
			<h2>Weather in {weather.request.query}</h2>
			<p>
				<img
					src={weather.current.weather_icons[0]}
					alt={weather.current.weather_descriptions[0]}
				/>
				<br />
				Temperature:&nbsp;{weather.current.temperature}
				<br />
				Wind:&nbsp;{weather.current.wind_speed}&nbsp;{weather.current.wind_dir}
			</p>
		</div>
	) : (
		<div>Loading weather information...</div>
	)
}

const Countries = ({ countries, weather, selectCountry }) => {
	const amount = countries.length
	if (amount < 1) {
		return <div>Country not found.</div>
	}
	if (amount < 2) {
		console.log(countries[0])
		return (
			<div>
				<Country country={countries[0]} />
				<Weather weather={weather} />
			</div>
		)
	}
	if (amount < 10) {
		return (
			<ul>
				{countries.map((c) => (
					<li key={c.numericCode}>
						{c.name}&nbsp;<button onClick={() => selectCountry(c)}>show</button>
					</li>
				))}
			</ul>
		)
	}
	return <div>Too many matches ({amount}), please be more specific.</div>
}

function App() {
	const [countries, setCountries] = useState([])
	const [weather, setWeather] = useState()
	const [search, setSearch] = useState("")

	const restcountries = "https://restcountries.eu/rest/v2/name/"

	const weatherstack_key = process.env.REACT_APP_COUNTRIES_API_KEY
	let weatherstack = `http://api.weatherstack.com/current?access_key=${weatherstack_key}&query=${search}`

	const restcountries_query = () => {
		if (search.length < 1) return

		setWeather()

		axios.get(restcountries + search).then((response) => {
			setCountries(response.data)
		})
	}
	useEffect(restcountries_query, [search])

	const weatherstack_query = () => {
		if (countries.length != 1) return
		weatherstack = `http://api.weatherstack.com/current?access_key=${weatherstack_key}&query=${countries[0].name}`
		axios.get(weatherstack).then((response) => {
			setWeather(response.data)
		})
	}
	useEffect(weatherstack_query, [countries])

	const selectCountryHandler = (country) => {
		setCountries([country])
	}

	return (
		<div>
			<div>
				Find countries:&nbsp;
				<input
					type="text"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
				/>
			</div>
			<Countries
				countries={countries}
				weather={weather}
				selectCountry={selectCountryHandler}
			/>
		</div>
	)
}

export default App
