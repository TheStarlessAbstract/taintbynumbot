const redemptionTypes = {
	redemption: {
		class: "../classes/redemptions/redemption",
		action: "../redemptions/redemption",
	},
	listPrediction: {
		class: "../classes/redemptions/listPrediction",
		action: "../redemptions/listPrediction",
	},
	timer: {
		class: "../classes/redemptions/timer",
		action: "../redemptions/timer",
	},
};

function getRedemptionType(name) {
	const type = redemptionTypes[name];
	const RedemptionClass = require(type.class);
	const redemptionAction = require(type.action);

	return { class: RedemptionClass, action: redemptionAction };
}

module.exports = { getRedemptionType };
