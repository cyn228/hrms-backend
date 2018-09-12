import express from 'express';
import employeeRouter from './Employee/employeeBase';
import payrollRouter from './Payroll/payroll';

const router = express.Router();

router.use('/employee', employeeRouter);
router.use('/payroll', payrollRouter);

router.get('/', (request, response) => {
	response.send('router heathcheck good');
});

export default router;