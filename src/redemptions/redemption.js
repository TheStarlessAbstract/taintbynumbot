const redemption = function (redeemDetails, variableMap) {
	let output = this.getOutput("text");
	if (output) {
		const message = this.getProcessedOutput(output.message, variableMap);
		this.say(message);
	}

	if (this.audio.length > 0) {
		this.playAudio();
	}

	console.log(redeemDetails.rewardTitle);
};

module.exports = redemption;
