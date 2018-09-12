import mongoose from 'mongoose';
import express from 'express';
import Employee from './model';
import _ from 'lodash';
import CONFIG from '../../config';

const skillsRouter = express.Router();

mongoose.connect(`${CONFIG.mongoURL}`);



export default skillsRouter;
