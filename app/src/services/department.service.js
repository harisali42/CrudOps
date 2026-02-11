const { Department, Student, Teacher, Course } = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination');

// Create Department
async function createDepartment(data) {
  const { name, code } = data;
  
  // Check duplication
  const exists = await Department.findOne({ where: { code } });
  if (exists) {
    return { success: false, message: 'Department code already exists' };
  }

  const department = await Department.create(data);
  return { success: true, message: 'Department created successfully', data: department };
}

// Get All Departments
async function getAllDepartments(page = 0, size = 10) {
  const { limit, offset } = getPagination(page, size);

  const { count, rows } = await Department.findAndCountAll({
    limit,
    offset,
    distinct: true,
    order: [['name', 'ASC']],
    // Optional: Include counts of related entities
    // includes can be heavy, so maybe just return basic info here
  });

  return {
    success: true,
    data: getPagingData({ count, rows }, page, limit),
  };
}

// Get Department By ID
async function getDepartmentById(id) {
  const department = await Department.findByPk(id, {
    include: [
      { model: Teacher, attributes: ['id', 'employeeId'] }, // Just IDs for summary
      { model: Course, attributes: ['id', 'name', 'code'] }
    ]
  });

  if (!department) {
    return { success: false, message: 'Department not found' };
  }

  return { success: true, data: department };
}

// Update Department
async function updateDepartment(id, data) {
  const department = await Department.findByPk(id);
  if (!department) {
    return { success: false, message: 'Department not found' };
  }

  if (data.code && data.code !== department.code) {
    const exists = await Department.findOne({ where: { code: data.code } });
    if (exists) {
      return { success: false, message: 'Department code already exists' };
    }
  }

  await department.update(data);
  return { success: true, message: 'Department updated successfully', data: department };
}

// Delete Department
async function deleteDepartment(id) {
  const department = await Department.findByPk(id);
  if (!department) {
    return { success: false, message: 'Department not found' };
  }

  // Optional: Check for existing relations before delete?
  // For now, let's just delete (Paranoid will soft delete)
  
  await department.destroy();
  return { success: true, message: 'Department deleted successfully', data: department };
}

// Assign Student to Department
async function assignStudentToDepartment(departmentId, studentId) {
  const department = await Department.findByPk(departmentId);
  if (!department) return { success: false, message: 'Department not found' };

  const student = await Student.findByPk(studentId);
  if (!student) return { success: false, message: 'Student not found' };

  // Update student's departmentId
  student.departmentId = department.id;
  await student.save();

  return { 
    success: true, 
    message: 'Student assigned to department successfully', 
    data: { 
      department: department.name,
      student: student.rollNo 
    } 
  };
}

// Assign Teacher to Department
async function assignTeacherToDepartment(departmentId, teacherId) {
  const department = await Department.findByPk(departmentId);
  if (!department) return { success: false, message: 'Department not found' };

  const teacher = await Teacher.findByPk(teacherId);
  if (!teacher) return { success: false, message: 'Teacher not found' };

  // Update teacher's departmentId
  teacher.departmentId = department.id;
  await teacher.save();

  return { 
    success: true, 
    message: 'Teacher assigned to department successfully', 
    data: { 
      department: department.name,
      teacher: teacher.employeeId 
    } 
  };
}

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  assignStudentToDepartment,
  assignTeacherToDepartment,
};
