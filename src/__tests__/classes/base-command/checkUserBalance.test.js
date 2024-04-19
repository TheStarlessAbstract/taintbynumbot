const BaseCommand = require("../../../classes/base-command.js");
const { findUserPoints } = require("../../../queries/loyaltyPoints");
const { isValueNumber, isNonEmptyString } = require("../../../utils");

jest.mock("../../../queries/loyaltyPoints", () => ({
	findUserPoints: jest.fn(),
}));

jest.mock("../../../utils", () => ({
	isNonEmptyString: jest.fn(),
	isValueNumber: jest.fn(),
}));

describe("checkUserBalance()", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test("should return an object with user information and canPay flag when user has enough points", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "user1";
		const cost = 10;
		const userPoints = 20;

		isNonEmptyString.mockReturnValue(true);
		isValueNumber.mockReturnValue(true);
		findUserPoints.mockResolvedValue({ points: userPoints });

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).toHaveBeenCalledTimes(1);
		expect(findUserPoints).toHaveBeenCalledWith({
			channelId,
			viewerId: userId,
		});
		expect(result).toEqual({ user: { points: userPoints }, canPay: true });
	});

	test("should return an object with empty user information and canPay flag set to false when user does not have enough points", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "user1";
		const cost = 10;
		const userPoints = 5;

		isNonEmptyString.mockReturnValue(true);
		isValueNumber.mockReturnValue(true);
		findUserPoints.mockResolvedValue({ points: userPoints });

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).toHaveBeenCalledTimes(1);
		expect(findUserPoints).toHaveBeenCalledWith({
			channelId,
			viewerId: userId,
		});
		expect(result).toEqual({ user: {}, canPay: false });
	});

	test("should return an object with user information and canPay flag when user has enough points", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "user1";
		const cost = 10;
		const userPoints = 20;

		isNonEmptyString.mockReturnValue(true);
		isValueNumber.mockReturnValue(true);
		findUserPoints.mockResolvedValue({ points: userPoints });

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).toHaveBeenCalledTimes(1);
		expect(findUserPoints).toHaveBeenCalledWith({
			channelId,
			viewerId: userId,
		});
		expect(result).toEqual({ user: { points: userPoints }, canPay: true });
	});

	test("should return undefined when channelId is not a non-empty string", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "";
		const userId = "user1";
		const cost = 10;

		isNonEmptyString.mockReturnValue(false);

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(1);
		expect(isValueNumber).not.toHaveBeenCalled();
		expect(findUserPoints).not.toHaveBeenCalledWith();
		expect(result).toBeUndefined();
	});

	it("should return undefined when userId is not a non-empty string", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "";
		const cost = 10;

		isNonEmptyString.mockReturnValueOnce(true).mockReturnValueOnce(false);

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).not.toHaveBeenCalled();
		expect(findUserPoints).not.toHaveBeenCalledWith();
		expect(result).toBeUndefined();
	});

	test("should return an object with empty user information and canPay flag when user is not found in the database", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "user1";
		const cost = 10;

		isNonEmptyString.mockReturnValue(true);
		isValueNumber.mockReturnValue(true);
		findUserPoints.mockResolvedValue(null);

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).toHaveBeenCalledTimes(1);
		expect(findUserPoints).toHaveBeenCalledWith({
			channelId,
			viewerId: userId,
		});
		expect(result).toEqual({ user: {}, canPay: false });
	});

	test("should return an object with empty user information and canPay flag when user has 0 points, and cost is higher", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "user1";
		const cost = 10;
		const userPoints = 0;

		isNonEmptyString.mockReturnValue(true);
		isValueNumber.mockReturnValue(true);
		findUserPoints.mockResolvedValue({ points: userPoints });

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).toHaveBeenCalledTimes(1);
		expect(findUserPoints).toHaveBeenCalledWith({
			channelId,
			viewerId: userId,
		});
		expect(result).toEqual({ user: {}, canPay: false });
	});

	test("should return an object with user information and canPay flag when user has 0 points, and cost is 0", async () => {
		// Assemble
		const testCommand = new BaseCommand();
		const channelId = "channel1";
		const userId = "user1";
		const cost = 0;
		const userPoints = 0;

		isNonEmptyString.mockReturnValue(true);
		isValueNumber.mockReturnValue(true);
		findUserPoints.mockResolvedValue({ points: userPoints });

		// Act
		const result = await testCommand.checkUserBalance(
			{ channelId, userId },
			cost
		);

		// Assert
		expect(isNonEmptyString).toHaveBeenCalledTimes(2);
		expect(isValueNumber).toHaveBeenCalledTimes(1);
		expect(findUserPoints).toHaveBeenCalledWith({
			channelId,
			viewerId: userId,
		});
		expect(result).toEqual({ user: { points: userPoints }, canPay: true });
	});
});
