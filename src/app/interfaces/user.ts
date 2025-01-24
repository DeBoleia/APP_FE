export interface Cars {
    brand: string;
    model: string;
    color: string;
    licensePlate: string;
    // _id: string;
}

export interface User {
	readonly userID: string;
    name: string;
    email: string;
    role: string;
    phoneNumber: string;
    NIF: string;
    birthDate?: string;
    status?: 'active' | 'inactive';
	driverRating: number;
	driverRatingCount: number;
	passengerRating: number;
	passengerRatingCount: number;
	driversLicense: string;
    cars?: Cars; 
	pendingEvaluation?: string[];
}

 


/*
// userProfileModels.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const carsSchema = require("./carsModels");

/*

const userProfileSchema = new Schema(
	{
	  userID: {
		type: String,
		required: true,
		unique: true,
	  },
	  
	  name: {
		type: String,
		required: true,
		match: /^[A-Za-zÀ-ÿ\u00C0-\u00FF\s'-]+$/,
		validate: {
		  validator: function (v) {
			return /^[A-Za-zÀ-ÿ\u00C0-\u00FF\s'-]+$/.test(v);
		  },
		  message: (error) => `${error.value} is not a valid name!`,
		},
		minlength: 1,
		maxlength: 100,
	  },
  
	  email: { // ler na sql
		type: String,
		required: true,
		unique: true,
		validate: {
		  validator: function (v) {
			return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(v);
		  },
		  message: (error) => `${error.value} is not a valid email!`,
		},
	  },
  
	  role: {
		type: String,
		required: true,
		enum: ["admin", "user"],
		default: "user",
	  },
  
	  phoneNumber: {
		type: String,
		default: null,
		required: true,
		validate: {
		  validator: function (v) {
			return /^\+?[0-9\s]{9,16}$/.test(v) || v === null;
		  },
		  message: (error) => `${error.value} is not a valid phone number!`,
		},
	  },
  
	  NIF: {
		  type: Number,
		  required: false,
		  unique: function() {
			  return this.NIF !== null;
		  },
		  sparse: true,
		  validate: {
			  validator: function(v) {
				  return v === null || /^\d{9}$/.test(v.toString());
			  },
			  message: props => `${props.value} is not a valid NIF number! It should have 9 digits.`
		  },
		  default: null
	  },
  
	  status: {
		type: String,
		required: false,
		enum: ["active", "inactive"],
		default: "active",
	  },
  
	  birthDate: {
		type: Date,
		required: false,
		default: null,
		validate: {
		  validator: function (v) {
			const today = new Date();
			const birthDate = new Date(v);
			const age = today.getFullYear() - birthDate.getFullYear();
			const monthDifference = today.getMonth() - birthDate.getMonth();
			const dayDifference = today.getDate() - birthDate.getDate();
			return (
			  age > 18 ||
			  (age === 18 &&
				(monthDifference > 0 ||
				  (monthDifference === 0 && dayDifference >= 0)))
			);
		  },
		  message:
			"You must be over 18 years old to register on this site. Please refer to the GDPR.",
		},
	  },
  
	  driverRating: {
		type: Number,
		default: 2.5,
		validate: {
		  validator: function (value) {
			return value >= 0 && value <= 5;
		  },
		  message: (error) =>
			`${error.value} is not a valid driver rating! Must be between 0 and 5.`,
		},
	  },
  
	  driverRatingCount: {
		type: Number,
		default: 1,
		validate: {
		  validator: function (value) {
			return Number.isInteger(value);
		  },
		  message: (error) => `${error.value} must be an integer number.`,
		},
	  },
  
	  passengerRating: {
		type: Number,
		default: 2.5,
		validate: {
		  validator: function (value) {
			return value >= 0 && value <= 5;
		  },
		  message: (error) =>
			`${error.value} is not a valid driver rating! Must be between 0 and 5.`,
		},
	  },
  
	  passengerRatingCount: {
		type: Number,
		default: 1,
		validate: {
		  validator: function (value) {
			return Number.isInteger(value);
		  },
		  message: (error) => `${error.value} must be an integer number.`,
		},
	  },
  
	  driversLicense: {
		type: String,
		required: false,
		validate: {
		  validator: function (value) {
			  if (!value) return true;
			  return /^L\d{7}$/.test(value);
			},
			message: (error) =>
			  `${error.value} is not a valid driver's license! It must start with 'L' followed by 7 digits.`,
		  },
  
		default: null,
	  },
  
	  cars: {
		  type: [carsSchema],
		  default: []
	  }
	},
	{ collection: "userProfile" }
  );
  
  const UserProfile = mongoose.model("UserProfile", userProfileSchema);
  module.exports = UserProfile;
*/