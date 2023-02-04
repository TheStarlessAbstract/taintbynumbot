const quote = require("../../commands/quote").command;

test("setVersionActive - if param valid - active property set to false", () => {
	quote.setVersionActive(0);
	let version = quote.getVersions();

	expect(version[0].active).toBe(false);
});

test("setVersionActive - if param is false - active property set to false", () => {
	quote.setVersionActive(false);
	let versions = quote.getVersions();

	let totalTrue = versions.filter((version) => version.active == true).length;
	expect(totalTrue == 2).toBe(true);
});

test("setVersionActive - if param string - active property not changed", () => {
	quote.setVersionActive("s");
	let versions = quote.getVersions();

	let totalTrue = versions.filter((version) => version.active == true).length;

	expect(totalTrue == 2).toBe(true);
});

test("setVersionActive - if param undefined - active property not changed", () => {
	quote.setVersionActive(undefined);
	let versions = quote.getVersions();

	let totalTrue = versions.filter((version) => version.active == true).length;

	expect(totalTrue == 2).toBe(true);
});

test("setVersionActive - if param negative - active property not changed", () => {
	quote.setVersionActive(-1);
	let versions = quote.getVersions();

	let totalTrue = versions.filter((version) => version.active == true).length;

	expect(totalTrue == 2).toBe(true);
});
