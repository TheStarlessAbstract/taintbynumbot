const loyalty = require("../bot-loyalty.js");


test('adding 12 and 1 should equal 13', () => {
    expect(12 + loyalty.DoesUserExist()).toBe(13);
});