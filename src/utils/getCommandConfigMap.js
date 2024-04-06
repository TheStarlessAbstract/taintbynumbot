const { chatCommandConfigMap } = require("../config");

const getChatCommandConfigMap = (config) => {
	const map = chatCommandConfigMap();
	if (!(map instanceof Map)) return;

	for (const key of map.keys()) {
		if (!config[key]) continue;
		map.set(key, config[key]);
	}

	return map;
};

module.exports = getChatCommandConfigMap;
