const BaseCommand = require("../baseCommand.js");

class ListEdit extends BaseCommand {
	constructor(channelId, name, { type, output, versions, listTypeName }) {
		super(channelId, name, { type, output, versions });
		this.listTypeName = listTypeName;
	}
}

module.exports = ListEdit;
