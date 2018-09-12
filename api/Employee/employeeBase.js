import express from 'express';
import mongoose from 'mongoose';
import Employee from './model';
import availRouter from './availability';
import specialAvailRouter from './specialAvail';
import timeoffRouter from './timeoff';
import timeSheetRouter from './timesheet';
import CONFIG from '../../config';
import _ from 'lodash';

const employeeRouter = express.Router();

employeeRouter.use('/availability', availRouter);
employeeRouter.use('/specialAvail', specialAvailRouter);
employeeRouter.use('/timeoff', timeoffRouter);
employeeRouter.use('/timeSheet', timeSheetRouter);

employeeRouter.get('/', getAllEmployees);
employeeRouter.get('/username/:username', getEmployeeByName);
employeeRouter.post('/', postEmployee);

employeeRouter.post('/signup', registerEmployee);

employeeRouter.get('/username/:username/password/:password', employeeAuth);

mongoose.connect(CONFIG.mongoURL);

function employeeAuth(request, response) {
	Employee.find({username: request.params.username}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}

		console.log('login attempt');

		if (employee.length === 0) {
			response.status(404).send({message: 'User does not exist'});
			return;
		}

		if (employee[0].password !== request.params.password) {
			response.status(404).send({message: 'Password is wrong'});
			return;
		}

		response.status(200).json({message: 'Login successful'});
	});
}

function getEmployeeByName(request, response) {
	Employee.find({username: request.params.username}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}

		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let ret_value = [];
		if (request.query.field) {
			_.forEach(employee, (em) => {
				ret_value.push(em[request.query.field]);
			});
		}
		else {
			ret_value = employee;
		}

		response.json(ret_value);
	});
}

function getAllEmployees(request, response) {
	Employee.find((err, employee) => {
		if (err) {
			response.send(err);
			return;
		}

		let ret_value = [];
		if (request.query.field) {
			_.forEach(employee, (em) => {
				ret_value.push(em[request.query.field]);
			});
		}
		else {
			ret_value = employee;
		}

		response.json(ret_value);
	});
}

function registerEmployee(request, response) {
	if (!request.body.username) {
		response.status(403).send({message: 'Employee username required'});
		return;
	}

	if (!request.body.password) {
		response.status(403).send({message: 'Employee password required'});
		return;
	}

	const usernameQuery = {'username': request.body.username};

	Employee.find(usernameQuery, (err, employee) => {
		if (employee.length !== 0) {
			response.status(403).send({message: 'Username existed!'});
			return;
		}

		Employee.findOneAndUpdate(usernameQuery, request.body, {upsert: true}, (err) => {
			if (err) {
				response.send(err);
				return;
			}

			response.json({message: 'Employee created'})
		});
	});

}

function postEmployee(request, response) {
	if (!request.body.username) {
		response.status(403).send({message: 'Employee username required'});
		return;
	}

	const usernameQuery = {'username': request.body.username};

	Employee.findOneAndUpdate(usernameQuery, request.body, {upsert: true}, (err) => {
		if (err) {
			response.send(err);
			return;
		}

		response.json({message: 'Employee created'})
	});
}

export default employeeRouter;
