sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/model/json/JSONModel"
], function (Controller, ContentResource, JSONModel) {
	"use strict";

	var cycleChart;
	var cycleChart2;
	var cycleChart3;

	var tempChart;

	var count = 0;

	var interval;

	var peopleText;
	var equipText;
	var enviText;
	var safety1;
	var safety2;
	var safety3;

	var peopleTextValue;
	var equipTextValue;
	var enviTextValue;
	var safety1Value;
	var safety2Value;
	var safety3Value;

	var sourceData;

	var model3d;
	var stat;

	var Main = this;

	var loadModelIntoViewer = function (viewer, remoteUrl, sourceType, localFile) {
		//what is currently loaded in the view is destroyed
		viewer.destroyContentResources();

		var source = remoteUrl || localFile;

		if (source) {
			//content of viewer is replaced with new data
			var contentResource = new ContentResource({
				source: source,
				sourceType: sourceType,
				sourceId: "abc"
			});

			//content: chosen path. content added to the view
			viewer.addContentResource(contentResource);
		}
	};

	return Controller.extend("DPROP.controller.Main", {

		onInit: function () {
			cycleChart = this.getView().byId("cycleChart");
			cycleChart2 = this.getView().byId("cycleChart2");
			cycleChart3 = this.getView().byId("cycleChart3");

			tempChart = this.getView().byId("temperatureChart");

			peopleText = this.getView().byId("peopleText");
			equipText = this.getView().byId("equipText");
			enviText = this.getView().byId("carText");
			safety1 = this.getView().byId("safety1");

			var deloitte = this.getView().byId("deloitte_panel");

			var fuelPanel = this.getView().byId("fuel_panel");
			var modelPanel = this.getView().byId("model_panel");
			var detailsPanel = this.getView().byId("details_panel");

			var detailsChart = this.getView().byId("detailsChart");
			var detailsWarning = this.getView().byId("detailsWarning");
			var detailsConfirm = this.getView().byId("detailsConfirm");
			var soo = this.getView().byId("soo");

			model3d = this.getView().byId("viewer");
			stat = this.getView().byId("damageStat");

			var data = {
				labels: [],
				datasets: [{
					label: "Number of People",
					fill: false,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.4)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 5,
					pointHitRadius: 10,
					data: []
				}]
			};

			var chartColors = {
				red: 'rgb(255, 0, 0)',
				orange: 'rgb(255, 159, 64)',
				yellow: 'rgb(255, 205, 86)',
				green: 'rgb(75, 192, 192)',
				blue: 'rgb(54, 162, 235)',
				purple: 'rgb(153, 102, 255)',
				grey: 'rgb(231,233,237)'
			};

			var randomScalingFactor = function () {
				return (Math.random() > 0.5 ? 1.0 : 0.0) * Math.round(Math.random() * 25);
			};

			var labels2 = ["Jan '17", "Feb '17", "Mar '17", "Apr '17", "May '17", "Jun '17", "Jul '17", "Aug '17", "Sep '17", "Oct '17",
				"Nov '17", "Dec '17"
			];
			var labels = ["Jul '18"];
			var labelss = ["Jan '18", "Feb '18", "Mar '18", "Apr '18", "May '18", "Jun '18"];

			// , "Jul '18", "Aug '18", "Sep '18", "Oct '18",
			// 	"Nov '18", "Dec '18"
			// ];

			var config = {
				type: 'line',
				data: {
					labels: labelss,
					datasets: [{
						label: "Fuel Stock",
						backgroundColor: chartColors.blue,
						borderColor: chartColors.blue,
						pointRadius: 4,
						data: [
							638,
							430,
							683,
							619,
							427,
							250
						],
						fill: false
					}, {
						label: "Fuel Consumption",
						fill: false,
						backgroundColor: chartColors.red,
						borderColor: chartColors.red,
						pointRadius: 4,
						data: [
							150,
							200,
							300,
							105,
							515,
							537
						]
					}]
				}

			};

			var config2 = {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [{
						label: "Procured",
						backgroundColor: chartColors.red,
						borderColor: chartColors.red,
						data: [56],
						fill: false
					}, {
						label: "Consumed",
						backgroundColor: chartColors.blue,
						borderColor: chartColors.blue,
						data: [41],
						fill: false
					}, {
						label: "Reserved",
						fill: false,
						backgroundColor: chartColors.orange,
						borderColor: chartColors.orange,
						data: [35]
					}]
				}
			};

			cycleChart.setData(config.data);

			tempChart.setData(config2.data);
			// this._loadVideo();

			this.loadFromURL();

			var socket = io('http://35.188.165.74:3000');
			socket.on('connect', function () {
				//socket.emit('customer', "testing dual emit");
				console.log(socket.id);
				console.log('SUCCESS');
			});

			var model = this.getView().byId("viewer");
			var stat = this.getView().byId("damageStat");

			var twinText = this.getView().byId("twinText");
			var soundIcon = this.getView().byId("soundIcon");

			socket.on('twin', function (msg) {
				//finalString = finalString + "\n" + "Agent: " + msg + "\n";

				console.log("MESSSAGE" + msg);

				if (msg === '1') {
					twinText.setText("Here is the national stock levels for Diesel today.");
					deloitte.setBusy(true);
					setTimeout(function () {
						deloitte.setBusy(false);

						deloitte.setVisible(false);
						fuelPanel.setVisible(true);
						modelPanel.setVisible(false);
						detailsPanel.setVisible(false);

					}, 2000);
				} else if (msg === '2') {
					twinText.setText("Ballarat seems to have a short supply right now. Stock is sitting below the recommended reserve levels.");
					fuelPanel.setBusy(true);
					setTimeout(function () {
						fuelPanel.setBusy(false);

						deloitte.setVisible(false);
						fuelPanel.setVisible(false);
						modelPanel.setVisible(false);
						detailsPanel.setVisible(true);

						detailsChart.setVisible(true);
						detailsWarning.setVisible(false);
						detailsConfirm.setVisible(false);
					}, 2000);
				} else if (msg === '3') {
					twinText.setText("It seems like we are expecting Stock-on-Order soon. Do you want to proceed?");
					detailsChart.setBusy(true);
					setTimeout(function () {
						detailsChart.setBusy(false);

						deloitte.setVisible(false);
						fuelPanel.setVisible(false);
						modelPanel.setVisible(false);
						detailsPanel.setVisible(true);

						detailsChart.setVisible(false);
						detailsWarning.setVisible(true);
						detailsConfirm.setVisible(false);
					}, 2000);
				} else if (msg === '4') {
					twinText.setText("The request has been made and logged under PR#8191.");
					detailsWarning.setBusy(true);
					setTimeout(function () {
						detailsWarning.setBusy(false);

						deloitte.setVisible(false);
						fuelPanel.setVisible(false);
						modelPanel.setVisible(false);
						detailsPanel.setVisible(true);

						detailsChart.setVisible(false);
						detailsWarning.setVisible(false);
						detailsConfirm.setVisible(true);
						soo.setText("800L");
					}, 2000);
				} else if (msg === '5') {
					twinText.setText("The request will be cancelled. Expect extra DIesel reserves by the end of tomorrow.");
					detailsWarning.setBusy(true);
					setTimeout(function () {
						detailsWarning.setBusy(false);

						deloitte.setVisible(false);
						fuelPanel.setVisible(false);
						modelPanel.setVisible(false);
						detailsPanel.setVisible(true);

						detailsChart.setVisible(true);
						detailsWarning.setVisible(false);
						detailsConfirm.setVisible(false);
					}, 2000);
				}
			});

		},

		onPressLoadRemoteModel: function (event) {
			var view = this.getView();
			var sourceData = view.getModel("source").oData;
			var viewer = view.byId("viewer");
			if (sourceData.remoteUrl) {
				loadModelIntoViewer(viewer, sourceData.remoteUrl, "vds");
			} else {
				// handleEmptyUrl(view);
				console.log("Blank");
			}
		},

		loadFromURL: function () {
			var view = this.getView();
			//var vdsURL = "http://localhost:58810/VisaulAsset/vdsfiles/transmission.vds";
			var vdsURL = "/webapp/assets/transmission.vds";
			var viewer = view.byId("viewer");
			if (vdsURL) {
				loadModelIntoViewer(viewer, vdsURL, "vds");
			} else {
				// handleEmptyUrl(view);
				console.log("Blank");

			}
		},

		onAfterRendering: function () {
			// cycleChart.update();
			// tempChart.update();

			// vid.onplay = function() {
			// 	count = 0;
			// 	chart.getProperty("data").labels = [];
			// 	chart.getProperty("data").datasets[0].data = [];
			// 	chart.update();
			// 	interval = setInterval(that.updateChart, 1000);
			// };
			//interval = setInterval(this.updateChart, 1000);
			//setTimeout(this.clearInterval, 35 * 1000);
		},

		breakOpenModel: function () {
			var model = this.getView().byId("viewer");
			model._sceneTree._selected["18"] = true;
			console.log(model._sceneTree._selected);
			//model._stepNavigation.playStep('i0000000500000004', false, false);
			//var stat = this.getView().byId("damageStat");
			//stat.setVisible(true);
		},

		changeView: function () {
			var view2 = this.getView().byId("statistics_panel");
			var view1 = this.getView().byId("model_panel");
			var view3 = this.getView().byId("options_panel");
			var option1 = this.getView().byId("option1");
			var option1_details = this.getView().byId("option1_details");
			var option2 = this.getView().byId("option2");
			var option2_details = this.getView().byId("option2_details");
			var confirmation = this.getView().byId("confirmation");
			var option1_finance = this.getView().byId("option1_finance");

			/*if (view1.getVisible() === true) {
				view1.setBusy(true);
				var that = this;
				setTimeout(function() {
					view1.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(true);
					view3.setVisible(false);
				}, 2000);
			} else if (view2.getVisible() === true) {
				view2.setBusy(true);
				setTimeout(function() {
					view2.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					cycleChart2.update();
					cycleChart3.update();
				}, 2000);
			} else if (view3.getVisible() === true && option1.getVisible() === false) {
				view3.setBusy(true);
				setTimeout(function() {
					view3.setBusy(false);
					view1.setVisible(true);
					view2.setVisible(false);
					view3.setVisible(false);
				}, 2000);
			} else if (option1.getVisible() === true && view3.getVisible() === true) {
				option2.setBusy(true);
				setTimeout(function() {
					option2.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option2.setVisible(false);
					option1_details.setVisible(true);
				}, 2000);
			}*/

			if (count === 0) {
				view1.setBusy(true);
				setTimeout(function () {
					view1.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(true);
					cycleChart.update();
					tempChart.update();
					view3.setVisible(false);
				}, 2000);
			} else if (count === 1) {
				view2.setBusy(true);
				var that = this;
				setTimeout(function () {
					view2.setBusy(false);
					view3.setVisible(false);
					view1.setVisible(true);
					that.breakOpenModel();
					view2.setVisible(false);
				}, 2000);
			} else if (count === 2) {
				view1.setBusy(true);
				setTimeout(function () {
					view1.setBusy(false);
					view2.setVisible(false);
					view1.setVisible(false);
					view3.setVisible(true);
					cycleChart2.update();
					cycleChart3.update();
				}, 2000);
			} else if (count === 3) {
				option2.setBusy(true);
				setTimeout(function () {
					option2.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option2.setVisible(false);
					option1_details.setVisible(true);
				}, 2000);
			} else if (count === 4) {
				option1_details.setBusy(true);
				setTimeout(function () {
					option1_details.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option2.setVisible(false);
					option1_details.setVisible(false);
					option1_finance.setVisible(true);
				}, 2000);
			} else if (count === 5) {
				view3.setBusy(true);
				setTimeout(function () {
					view3.setBusy(false);
					view1.setVisible(false);
					view2.setVisible(false);
					view3.setVisible(true);
					option1.setVisible(true);
					option1.removeStyleClass("floatSubPanel3");
					option1.addStyleClass("floatSubPanel3Select");
					option2.setVisible(false);
					option1_details.setVisible(false);
					option1_finance.setVisible(false);
					confirmation.setVisible(true);
				}, 2000);
			} else if (count === 6) {
				view3.setBusy(true);
				setTimeout(function () {
					view3.setBusy(false);
					view1.setVisible(true);
					option1.addStyleClass("floatSubPanel3");
					option1.removeStyleClass("floatSubPanel3Select");
					view2.setVisible(false);
					view3.setVisible(false);
					option1.setVisible(true);
					option2.setVisible(true);
					option1_details.setVisible(false);
					confirmation.setVisible(false);
					count = 0;
				}, 2000);
			}

			count += 1;

		},

		buttonPress: function () {
			var vid = document.getElementById("videoPlyr");
			alert(vid.duration);
		},

		clearInterval: function () {
			count = 0;
			clearInterval(interval);
		},

		updateChart: function () {

			console.log(count);

			if (count === 34) {
				count = 0;
				clearInterval(interval);
			}

			var json = {
				"data": [{
					"people": "2",
					"vehicle": "3",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "1",
					"vehicle": "1",
					"high-vis-suit": "0",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "2",
					"high-vis-suit": "3",
					"saw": "1",
				}, {
					"people": "3",
					"vehicle": "0",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "3",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "3",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "3",
					"vehicle": "2",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "2",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "0",
				}, {
					"people": "3",
					"vehicle": "1",
					"high-vis-suit": "3",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "1",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "3",
					"vehicle": "0",
					"high-vis-suit": "3",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "1",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "1",
					"vehicle": "1",
					"high-vis-suit": "1",
					"saw": "0",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "1",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "1",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "1",
				}, {
					"people": "1",
					"vehicle": "2",
					"high-vis-suit": "1",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "2",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "2",
					"vehicle": "0",
					"high-vis-suit": "2",
					"saw": "0",
				}, {
					"people": "0",
					"vehicle": "0",
					"high-vis-suit": "0",
					"saw": "0",
				}]
			};
			chart.getProperty("data").labels.push("");

			chart.getProperty("data").datasets[0].data[count] = json.data[count].people;

			chart.update();

			peopleTextValue = peopleText.getValue();
			equipTextValue = equipText.getValue();
			enviTextValue = enviText.getValue();
			safety1Value = safety1.getValue();

			peopleText.setValue(json.data[count].people);
			equipText.setValue(json.data[count].saw);
			enviText.setValue(json.data[count].vehicle);
			safety1.setValue(json.data[count]['high-vis-suit']);

			if (parseInt(peopleTextValue) < parseInt(json.data[count].people)) {
				peopleText.setIndicator("Up");
			} else if (parseInt(peopleTextValue) > parseInt(json.data[count].people)) {
				peopleText.setIndicator("Down");
			} else if (parseInt(peopleTextValue) === parseInt(json.data[count].people)) {
				peopleText.setIndicator("None");
			}

			if (parseInt(equipTextValue) < parseInt(json.data[count].saw)) {
				equipText.setIndicator("Up");
			} else if (parseInt(equipTextValue) > parseInt(json.data[count].saw)) {
				equipText.setIndicator("Down");
			} else if (parseInt(equipTextValue) === parseInt(json.data[count].saw)) {
				equipText.setIndicator("None");
			}

			if (parseInt(enviTextValue) < parseInt(json.data[count].vehicle)) {
				enviText.setIndicator("Up");
			} else if (parseInt(enviTextValue) > parseInt(json.data[count].vehicle)) {
				enviText.setIndicator("Down");
			} else if (parseInt(enviTextValue) === parseInt(json.data[count].vehicle)) {
				enviText.setIndicator("None");
			}

			if (parseInt(safety1Value) < parseInt(json.data[count]['high-vis-suit'])) {
				safety1.setIndicator("Up");
			} else if (parseInt(safety1Value) > parseInt(json.data[count]['high-vis-suit'])) {
				safety1.setIndicator("Down");
			} else if (parseInt(safety1Value) === parseInt(json.data[count]['high-vis-suit'])) {
				safety1.setIndicator("None");
			}

			count += 1;
		},

		changeValue: function (numericID, numericValue) {
			var textValue = this.getView().byId(numericID);
			var prevTextValue = textValue.getValue();
			textValue.setValue(numericValue);

			if (parseInt(prevTextValue) < parseInt(numericValue)) {
				textValue.setIndicator("Up");
			} else if (parseInt(prevTextValue) > parseInt(numericValue)) {
				textValue.setIndicator("Down");
			} else if (parseInt(prevTextValue) === parseInt(numericValue)) {
				textValue.setIndicator("None");
			}
		},

		_loadVideo: function () {
			var videoURL = "https://storage.googleapis.com/demovids/powersawRawInception3.mp4";
			var html1 = new sap.ui.core.HTML({
				content: "<video controls autoplay id='videoPlyr' width='100%' height='100%'>" +
					"<source src='" + videoURL + "' type='video/mp4'>" +
					"Your browser does not support the video tag." +
					"</video>"
			});
			var gridPanel = this.getView().byId("vidPlayer");
			gridPanel.removeAllItems();
			// var videoName =  new sap.m.Text({text: 'Check out the video'}).addStyleClass("fontMedium sapUiTinyMarginBottom sapUiTinyMarginTop sapUiTinyMarginBegin");
			//var videoDesc =  new sap.m.Text({text: videoDescription}).addStyleClass("descText sapUiTinyMarginBottom sapUiTinyMarginBegin");
			var videoBoxContent = new sap.m.VBox({
				//items: [html1, videoName, videoDesc],
				items: [html1],
				fitContainer: true
			}).addStyleClass("");
			var videoBox = new sap.m.HBox({
				items: [videoBoxContent],
				justifyContent: "Center",
				alignItems: "Center"
			}).addStyleClass("videoHBox");
			gridPanel.addItem(videoBox);
		}

	});
});