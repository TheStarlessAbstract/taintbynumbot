const { chatCommandConfigMap } = require("../config");

const getChatCommandConfigMap = (config) => {
	if (!config) return;
	const map = chatCommandConfigMap();
	if (!(map instanceof Map)) return;
	for (const key of map.keys()) {
		if (!key in config) continue;
		map.set(key, config[key]);
	}

	return map;
};

module.exports = getChatCommandConfigMap;
