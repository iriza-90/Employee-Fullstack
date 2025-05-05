const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middlewares/auth');

// Protect all routes
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of employees
 */
router.get('/', employeeController.getAll);

/**
 * @swagger
 * /employees/search:
 *   get:
 *     summary: Search employees
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Matching employees
 */
router.get('/search', employeeController.search);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee details
 */
router.get('/:id', employeeController.getById);

/**
 * @swagger
 * /employees/create:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               position:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post('/create', employeeController.create);

/**
 * @swagger
 * /employees/update/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               position:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Employee updated
 */
router.put('/update/:id', employeeController.update);

/**
 * @swagger
 * /employees/delete/{id}:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee deleted
 */
router.delete('/delete/:id', employeeController.delete);

module.exports = router;
