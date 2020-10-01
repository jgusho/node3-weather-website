const request = require("request");

const forecast = (lat, lng, callback) => {
	const url =
		"http://api.weatherstack.com/current?access_key=82f6806c8a7d44bbe4793efdd3f724bc&query=" +
		encodeURIComponent(lat) +
		"," +
		encodeURIComponent(lng) +
		"&units=m";

	request({ url, json: true }, (error, {body}={}) => {
		if (error) {
			callback("Unable to connect to weather service", undefined);
		} else if (body.error) {
			callback("Unable to find the location you requested");
		} else {
			const temp = body.current.temperature;
			const feelsLike = body.current.feelslike;
			const weather_description = body.current.weather_descriptions[0];

			callback(
				undefined,
				weather_description +
					". It is currently " +
					temp +
					" degrees out. It feels like " +
					feelsLike +
					" degrees out. "
			);
		}
	});
};

module.exports = forecast;
