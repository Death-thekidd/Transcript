// src/services/destinationRequestService.ts
import UserDestinationRequest from "../database/models/userdestinationrequest";
import User from "../database/models/user";

export const getAllDestinationRequests = async (): Promise<
	UserDestinationRequest[]
> => {
	return await UserDestinationRequest.findAll();
};

export const getDestinationRequestById = async (
	id: string
): Promise<UserDestinationRequest | null> => {
	return await UserDestinationRequest.findByPk(id);
};

export const createDestinationRequest = async (
	name: string,
	userId: string
): Promise<UserDestinationRequest> => {
	return await UserDestinationRequest.create({
		name,
		userId,
		status: "pending",
	});
};

export const acceptDestinationRequestById = async (
	id: string
): Promise<[number, UserDestinationRequest[]]> => {
	return await UserDestinationRequest.update(
		{ status: "accepted" },
		{ where: { id }, returning: true }
	);
};

export const findUserById = async (id: string): Promise<User | null> => {
	return await User.findByPk(id);
};
