// services/destinationService.ts
import Destination from "../database/models/destination";

export const getAllDestinations = async (): Promise<Destination[]> => {
	return await Destination.findAll();
};

export const getDestinationById = async (
	destinationId: string
): Promise<Destination | null> => {
	return await Destination.findByPk(destinationId);
};

export const createDestination = async (
	name: string,
	rate: number,
	deliveryMethod: string
): Promise<Destination> => {
	return await Destination.create({ name, rate, deliveryMethod });
};

export const updateDestination = async (
	id: string,
	updateData: Partial<Destination>
): Promise<number> => {
	const [updatedRowsCount] = await Destination.update(updateData, {
		where: { id },
	});
	return updatedRowsCount;
};

export const deleteDestination = async (id: string): Promise<void> => {
	const destination = await Destination.findByPk(id);
	if (destination) {
		await destination.destroy();
	} else {
		throw new Error("Destination not found");
	}
};
