// services/departmentService.ts
import Department, {
	DepartmentAttributes,
} from "../database/models/department";
import College from "../database/models/college";

interface DepartmentWithCollegeName extends DepartmentAttributes {
	collegeName?: string;
}

export const getAllDepartments = async (): Promise<
	DepartmentWithCollegeName[]
> => {
	const departments = await Department.findAll();
	const departmentsWithCollegeNames = await Promise.all(
		departments.map(async (department) => {
			const college = await College.findByPk(department.collegeId);
			return { ...department.dataValues, collegeName: college?.name };
		})
	);
	return departmentsWithCollegeNames;
};

export const getDepartmentById = async (
	departmentId: string
): Promise<DepartmentWithCollegeName | null> => {
	const department = await Department.findByPk(departmentId);
	if (!department) {
		return null;
	}
	const college = await College.findByPk(department.collegeId);
	return { ...department.dataValues, collegeName: college?.name };
};

export const createDepartment = async (
	name: string,
	collegeName: string
): Promise<Department> => {
	const college = await College.findOne({ where: { name: collegeName } });
	if (!college) {
		throw new Error("College not found");
	}
	return await Department.create({ name, collegeId: college.id });
};

export const updateDepartment = async (
	id: string,
	name: string
): Promise<Department | null> => {
	const department = await Department.findOne({ where: { id } });
	if (!department) {
		return null;
	}
	department.name = name;
	await department.save();
	return department;
};

export const deleteDepartment = async (id: string): Promise<void> => {
	const department = await Department.findOne({ where: { id } });
	if (department) {
		await department.destroy();
	} else {
		throw new Error("Department not found");
	}
};
