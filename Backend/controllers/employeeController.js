const { Employee } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Get all employees (with pagination)
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Employee.findAndCountAll({
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']] // Newest first
    });

    res.json({
      total: count,
      page: parseInt(page),
      employees: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single employee
exports.getById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new employee
exports.create = async (req, res) => {
  try {
    // Basic validation
    if (!req.body.firstName || !req.body.lastName) {
      return res.status(400).json({ error: 'First and last name are required' });
    }

    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update employee
exports.update = async (req, res) => {
  try {
    const [updated] = await Employee.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const updatedEmployee = await Employee.findByPk(req.params.id);
    res.json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete employee
exports.delete = async (req, res) => {
  try {
    const deleted = await Employee.destroy({
      where: { id: req.params.id }
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(204).end(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Search employees
exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    const employees = await Employee.findAll({
      where: {
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
    res.status(500).json({ error: error.message });
  }
};
  