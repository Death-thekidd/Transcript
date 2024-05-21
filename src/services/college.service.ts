// services/collegeService.ts
import { Identifier } from "sequelize";
import College from "../database/models/college";
import Department from "../database/models/department";

export const getAllColleges = async (): Promise<
	Array<{ id: Identifier; name: string; departments: string[] }>
> => {
	const colleges = await College.findAll({
		include: Department,
	});

	return colleges.map((college) => {
		const departments = college.Departments
			? college.Departments.map((department) => department.name)
			: [];
		return {
			id: college.id,
			name: college.name,
			departments,
		};
	});
};

export const getCollegeById = async (
	collegeId: string
): Promise<College | null> => {
	return await College.findByPk(collegeId);
};

export const createCollege = async (name: string): Promise<College> => {
	return await College.create({ name });
};

export const updateCollege = async (
	id: string,
	name: string
): Promise<College | null> => {
	const college = await College.findOne({ where: { id } });

	if (college) {
		college.name = name;
		return await college.save();
	} else {
		throw new Error("College not found");
	}
};

export const deleteCollege = async (id: string): Promise<void> => {
	const college = await College.findOne({ where: { id } });

	if (college) {
		await college.destroy();
	} else {
		throw new Error("College not found");
	}
};
