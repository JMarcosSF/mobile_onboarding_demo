var userInfo;
// cc used to pay
var usedCard;
var creditCheckData = {};
var ccData;
// use throughout flow to get whether contract or no contract
// set accordingly from user info page
var isContractPlan;
// set upon user picking a plan via promo code, or selection tools
var selectedPlan;
// to be instantiated by getJSON calls to plans.json
var JSONPlans = [];
var JSONPhnNumberList = [];
// to handle back function if backing up from payment div
// can be "promo", "usage", or "budget"
var planSelectionMethod;
// to set number selected
var selectedPhoneNumber;
// to detect payment type, i.e., 'creditCard', 'promoCode' or 'pin'
var paymentType;
// To avoid clearing default FB Section userInfo set from FB Section
var isFromFBSec = false;
var isContract;

function user(name, addr, email, dob, planType) {
  this.name=name;
  this.address=addr;
  this.email=email;
  this.dob=dob;
  this.planType=planType;
}

function creditCheck(cCard) {
	this.creditCard=cCard;
}

function creditCard(cType, cName, cNum, cExp, cSCode) {
	this.type=cType;
	this.name=cName;
	this.number=cNum;
	this.expiration=cExp;
	this.securityCode=cSCode;
}

function plan(id, name, price, details) {
	this.id=id;
	this.name=name;
	this.price=price;
	this.details=details;
}