import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import Payroll from './model';
import CONFIG from '../../config';
import { broadcast } from '../notifications';

const payrollRouter = express.Router();

payrollRouter.get('/', getAllPayroll);
payrollRouter.get('/request_id/:request_id', getPayrollById);
payrollRouter.post('/', postPayroll);

mongoose.connect(`${CONFIG.mongoURL}`);

function getPayrollById(request, response) {
	Payroll.find({request_id: request.params.request_id}, (err, payroll) => {
		if (err) {
			response.status(404).send(err);
			return;
		}

		if (Payroll.length === 0) {
			response.status(404).send({message: 'Payroll not found'});
			return;
		}

		response.json(payroll);
	});
}

function getAllPayroll(request, response) {
	Payroll.find((err, payroll) => {
		if (err) {
			response.send(err);
			return;
		}

		response.json(payroll);
	});
}


function postPayroll(request, response) {
	if (!request.body.request_id) {
		response.status(403).send({message: 'Payroll request_id required'});
		return;
	}

	const requestQuery = {'request_id': request.body.request_id};

	Payroll.findOneAndUpdate(requestQuery, request.body, {upsert: true}, (err) => {
		if (err) {
			response.send(err);
			return;
		}

		_postToFinance(request.body)
		.then(function() {
			response.json({message: 'Payroll created'})
		})
		.then(function() {
			broadcast({
				type: 'PAYROLL',
				payroll: request.body,
			});
		})
		.catch(function(err) {
			Payroll.remove(requestQuery);
			response.send(err);
		});
	});
}

function _postToFinance(payroll) {
	return axios.post(
		'http://cs490-ais.herokuapp.com/api/payrollentry',
		payroll
	);
}

export default payrollRouter;
