import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';
import moment from 'moment';
import CONFIG from '../../config';

const timeSheetRouter = express.Router();

timeSheetRouter.get('/username/:username', getTimeSheet);
timeSheetRouter.post('/username/:username', postTimeSheet);
timeSheetRouter.get('/username/:username/date/:date', getTimeSheetDay);

mongoose.connect(`${CONFIG.mongoURL}`);

function getTimeSheetDay(request, response) {
	Employee.find({username: request.params.username}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}
		let date = request.params.date;
		// Validate if the date format is correct
		if (date === undefined || !moment(date, 'YYYY-MM-DD', true).isValid()) {
			response.status(403).send({error: 'Date object type validation failed.'});
			return;
		}

		response.json(employee[0].timeSheet[date]);
	});
}

function getTimeSheet(request, response) {
	Employee.find({username: request.params.username}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		response.json(employee[0].timeSheet);
	});
}

function postTimeSheet(request, response) {
	Employee.find({username: request.params.username}, (err, employee) => {
		if (err) {
			response.status(404).send(err);
			return;
		}
		if (employee.length === 0) {
			response.status(404).send({message: 'Employee not found'});
			return;
		}

		let updateTimeSheet = request.body;
		let validationResult = validateTimeSheet(updateTimeSheet);
		if (!validationResult.result) {
			response.status(403).send({error: validationResult.message});
			console.log(validationResult.message);
			return;
		}

		const currentTimeSheet = employee[0].timeSheet;
		currentTimeSheet[updateTimeSheet.date] = updateTimeSheet.hours;

		Employee.findOneAndUpdate({username: request.params.username}, {timeSheet: currentTimeSheet}, (err) => {
			if (err) {
				return err;
			}

			response.json({message: 'TimeSheet post successful'});
		});

	});
}

function validateTimeSheet(avail) {
	let validationResult = {result: true, message: ''};

	// Check is the date format is correct
	if (avail.date === undefined || !moment(avail.date, 'YYYY-MM-DD', true).isValid()) {
		validationResult.result = false;
		validationResult.message = 'Date object type validation failed.';
	}
	console.log(avail.hours);
	let timeValidationResult = avail.hours >= 0 && avail.hours <= 24;
	if (timeValidationResult === false) {
		validationResult.result = false;
		validationResult.message = 'Time validation failed';
	}

	return validationResult;
}

export default timeSheetRouter;
