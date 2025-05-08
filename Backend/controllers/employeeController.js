const { Employee } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Get all employees for the logged-in user (with pagination)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Employee.findAndCountAll({
      where: { userId: req.userId }, //  only fetch owned employees
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: count,
      page: parseInt(page),
      employees: rows
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one employee owned by this user
exports.getById = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new employee for this user
exports.create = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName) {
      return res.status(400).json({ message: 'First and last name are required' });
    }

    const employee = await Employee.create({
      ...req.body,
      userId: req.userId // 👈 assign to logged-in user
    });

    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an employee ONLY if owned by this user
exports.update = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or unauthorized' });
    }

    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee ONLY if owned by this user
exports.delete = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or unauthorized' });
    }

    await employee.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search within the logged-in user’s employees
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    const employees = await Employee.findAll({
      where: {
        userId: req.userId, // 👈 scoped search
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${q}%` } },
          { lastName: { [Op.iLike]: `%${q}%` } },
          { email: { [Op.iLike]: `%${q}%` } },
          { position: { [Op.iLike]: `%${q}%` } },
          Sequelize.where(
            Sequelize.cast(Sequelize.col('salary'), 'TEXT'),
            { [Op.iLike]: `%${q}%` }
          ),
          Sequelize.where(
            Sequelize.cast(Sequelize.col('hireDate'), 'TEXT'),
            { [Op.iLike]: `%${q}%` }
          )
        ]
      }
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
