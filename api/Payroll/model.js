import mongoose, {Schema} from 'mongoose';

const PayrollSchema = new Schema({
	request_id: { type: Number, required: true, unique: true },
	department: { type: String, required: true },
	manager: { type: String, required: true },
	timeRequested: { type: Date, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	totalAmount: { type: Number, required: true },
	status: { type: String, required: true }
}, { minimize: false });

const Payroll = mongoose.model('Payroll', PayrollSchema);

export default Payroll;