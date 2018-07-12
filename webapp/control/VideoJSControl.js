sap.ui.define([
	'sap/ui/core/Control'
], function(Control) {
	'use strict';

	return Control.extend('DPROP.control.VideoJSControl', {
		metadata: {
			properties: { // setter and getter are created behind the scenes, incl. data binding and type validation
				source: "string",
				width: "string"
			}
		},

		init: function() {
			var _newVideo;
		},

		onBeforeRendering: function() {},

		onAfterRendering: function() {},

		exit: function() {
			this._newVideo.destroy();
		},

		renderer: function(oRm, oControl) {
			// oRm.write("<div class='container'>");
			oRm.write("<video id='htmlvid' width='+oControl.getWidth()+' class='videoPlayer'>");
			oRm.write("<source src='" + oControl.getSource() + "' type='video/mp4'>");
			oRm.write("</video>");
			// oRm.write("</div>");
		}
	});
});