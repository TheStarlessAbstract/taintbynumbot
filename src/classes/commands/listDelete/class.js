const BaseCommand = require("../baseCommand.js");

class ListDelete extends BaseCommand {
	constructor(channelId, name, { type, output, versions, listTypeName }) {
		super(channelId, name, { type, output, versions });
		this.listTypeName = listTypeName;
	}
}

module.exports = ListDelete;
