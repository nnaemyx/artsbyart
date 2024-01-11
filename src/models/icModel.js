import mongoose from 'mongoose';

const icSchema = new mongoose.Schema({
  officeAddress: {
    type: String,
    required: true,
  },
  businessRegistration: {
    type: String,
    required: true,
  },
  businessBankAccount: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasSmartphone: {
    type: Boolean,
    required: true,
  },
  hasCAC: {
    type: Boolean,
    default: false,
  },
  businessName: {
    type: String,
    required: true,
  },
  phoneNumber1: {
    type: String,
    required: true,
  },
  phoneNumber2: String,
  branches: String,
  services: {
    type: [String], 
    default: [],
  },
});

const IC = mongoose.models.IC || mongoose.model('IC', icSchema);

export default IC;
