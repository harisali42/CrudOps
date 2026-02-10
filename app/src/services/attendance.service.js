const { Op } = require('sequelize');
const { Attendance, Teacher, TeacherClass, Student, Class, User } = require('../models');

function normalizeDate(value) {
  if (!value) return null;

  // If already YYYY-MM-DD, trust it
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return null;
  }

  return (
    d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
  );
}


async function markClassAttendance({ teacherUserId, classId, attendanceDate, records }) {
  if (!Array.isArray(records) || records.length === 0) {
    return { success: false, message: 'Attendance records are required' };
  }

  const teacher = await Teacher.findOne({ where: { userId: teacherUserId } });
  if (!teacher) {
    return { success: false, message: 'Teacher profile not found' };
  }

  const normalizedDate = normalizeDate(attendanceDate);
  if (!normalizedDate) {
    return { success: false, message: 'Invalid attendance date' };
  }

  const numericClassId = Number(classId);

  const teacherClass = await TeacherClass.findOne({
    where: { teacherId: teacher.id, classId: numericClassId }
  });

  if (!teacherClass) {
    return { success: false, message: 'Teacher is not assigned to this class' };
  }

  const deduped = new Map();
  records.forEach(record => {
    deduped.set(record.studentId, record);
  });

  const normalizedRecords = Array.from(deduped.values());
  const studentIds = normalizedRecords.map(record => record.studentId);

  const students = await Student.findAll({
    where: { id: studentIds },
  });

  const studentMap = new Map(students.map(student => [student.id, student]));
  const missingStudentIds = studentIds.filter(id => !studentMap.has(id));

  if (missingStudentIds.length > 0) {
    return {
      success: false,
      message: `Students not found: ${missingStudentIds.join(', ')}`,
    };
  }

  const mismatchedStudents = students
    .filter(student => student.classId !== numericClassId)
    .map(student => student.id);

  if (mismatchedStudents.length > 0) {
    return {
      success: false,
      message: `Students not in this class: ${mismatchedStudents.join(', ')}`,
    };
  }

  const result = await Attendance.sequelize.transaction(async (transaction) => {
    let created = 0;
    let updated = 0;

    for (const record of normalizedRecords) {
      const where = {
        classId: numericClassId,
        studentId: record.studentId,
        attendanceDate: normalizedDate,
      };

      const existing = await Attendance.findOne({ where, transaction });

      if (existing) {
        await existing.update({
          status: record.status,
          teacherId: teacher.id,
          markedAt: new Date(),
        }, { transaction });
        updated += 1;
      } else {
        await Attendance.create({
          classId: numericClassId,
          studentId: record.studentId,
          teacherId: teacher.id,
          attendanceDate: normalizedDate,
          status: record.status,
          markedAt: new Date(),
        }, { transaction });
        created += 1;
      }
    }

    return { created, updated };
  });

  return {
    success: true,
    message: 'Attendance saved successfully',
    data: {
      date: normalizedDate,
      classId: numericClassId,
      created: result.created,
      updated: result.updated,
      total: result.created + result.updated,
    }
  };
}

async function getStudentAttendance({ studentUserId, fromDate, toDate }) {
  const student = await Student.findOne({ where: { userId: studentUserId } });
  if (!student) {
    return { success: false, message: 'Student profile not found' };
  }

  const where = { studentId: student.id };
  const normalizedFrom = fromDate ? normalizeDate(fromDate) : null;
  const normalizedTo = toDate ? normalizeDate(toDate) : null;

  if (fromDate && !normalizedFrom) {
    return { success: false, message: 'Invalid from date' };
  }

  if (toDate && !normalizedTo) {
    return { success: false, message: 'Invalid to date' };
  }

  if (normalizedFrom && normalizedTo) {
    where.attendanceDate = { [Op.between]: [normalizedFrom, normalizedTo] };
  } else if (normalizedFrom) {
    where.attendanceDate = { [Op.gte]: normalizedFrom };
  } else if (normalizedTo) {
    where.attendanceDate = { [Op.lte]: normalizedTo };
  }

  const rows = await Attendance.findAll({
    where,
    include: [
      {
        model: Class,
        attributes: ['id', 'name'],
      },
      {
        model: Teacher,
        attributes: ['id', 'employeeId'],
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email'],
          }
        ]
      }
    ],
    order: [['attendanceDate', 'DESC']]
  });

  const items = rows.map(row => {
    const json = row.toJSON();

    json.class = json.Class ? { id: json.Class.id, name: json.Class.name } : null;
    delete json.Class;

    if (json.Teacher) {
      json.teacher = {
        id: json.Teacher.id,
        employeeId: json.Teacher.employeeId,
        user: json.Teacher.User || null,
      };
    } else {
      json.teacher = null;
    }
    delete json.Teacher;

    return json;
  });

  return {
    success: true,
    data: items,
  };
}

module.exports = {
  markClassAttendance,
  getStudentAttendance,
};
