const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();
const port = process.env.PORT || 3000;

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const e = require("express");

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Setup handlebar engine and views location
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
	res.render("index", {
		title: "Weather",
		name: "Joni Gusho",
	});
});

app.get("/about", (req, res) => {
	res.render("about", {
		title: "About me",
		name: "Joni Gusho",
	});
});

app.get("/help", (req, res) => {
	res.render("help", {
		title: "Help",
		name: "Joni Gusho",
		message: "this is a message i want to show on help page",
	});
});
app.get("/weather", (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: "please provide and address",
		});
	}

	geocode(
		req.query.address,
		(error, { latitude, longitude, location } = {}) => {
			if (error) {
				return res.send({ error });
			}
			forecast(latitude, longitude, (error, forecastData) => {
				if (error) {
					return res.send({ error });
				}
				res.send({
					forecast: forecastData,
					location,
					address: req.query.address,
				});
			});
		}
	);
});

app.get("/products", (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: "you must provide a search term",
		});
	}

	console.log(req.query.search);
	res.send({
		products: [],
	});
});

app.get("/help/*", (req, res) => {
	res.render("not-found", {
		title: "Error 404",
		name: "Joni Gusho",
		error: "Help article not found",
	});
});

app.get("*", (req, res) => {
	res.render("not-found", {
		title: "Error 404",
		name: "Joni Gusho",
		error: "Page not found",
	});
});

app.listen(port, () => {
	console.log("Server is up in port" + port);
});
