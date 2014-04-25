var currentEl;

$(document).ready(function() {
	isContract = false;
	$("#inf-prepay-btn").click(function(event) {
		console.log(event.target.id.toLowerCase());
		var prepayStr = event.target.id.toString().toLowerCase();
		toggleContractButtons(prepayStr);
		$('#inf-prepay-btn').blur();
        setIsContract(prepayStr);
    });
	$("#inf-postpay-btn").click(function(event) {
		console.log(event.target.id.toLowerCase());
		var postpayStr = event.target.id.toString().toLowerCase();
		toggleContractButtons(postpayStr);
		$('#inf-postpay-btn').blur();
        setIsContract(postpayStr);
    });
	$(':checkbox').checkbox();
	$('#cred-check-next-btn').attr("disabled", "disabled");
	$(':checkbox').on('toggle', function() {
		// Do something
		if(document.getElementById("checkbox1").checked) {
			$("#cred-check-next-btn").removeAttr("disabled");    
		}else {
			$('#cred-check-next-btn').attr("disabled", "disabled");
		}
	});
	$('.tc-text').after('<div class="switch switch-square tc-switch-flt-right" data-on-label="YES" data-off-label="NO"><input type="checkbox" /></div>');
	$(".switch").bootstrapSwitch();
	$('#splash-img').css('margin-left', (($('#splash-div').width())/2) - 100);
	$('#splash-img').css('margin-top', (($('#splash-div').height())/2) - 75);
	$(window).resize(function(){
		$('#splash-img').css('margin-left', (($('#splash-div').width())/2) - 100); 
		$('#splash-img').css('margin-top', (($('#splash-div').height())/2) - 75);
	});
	setTimeout(function() {
	     $('#splash-div').fadeOut(800);
	}, 1500);
});

function start() {
    showNavBar();
    setDisplayNone($('#welcome-div'));
    fadeInElem($('#subscriber-options-div'));
}

function showUserInfo() {
    if (typeof userInfo !== 'undefined') {
        console.log('user');
    }
}

function showUserInfoForm() {
	setDisplayNone($('#subscriber-options-div'));
	fadeInElem($('#user-info-div'));
}

function showUserInfoFormFromFBSec() {
	var DOBStr = formatDate(new Date("1978-02-11"));
	userInfo = new user(
	        'John Sheldon',
	        '185 Berry St. San Francisco CA, 94107',
	        'john.sheldon@gmail.com',
	        DOBStr
	    );
	isFromFBSec = true;
	$('#sub-inf-control-group').hide();
	$('#sub-info-back-btn').hide();
	$('#sub-info-next-btn').css('width', '100%');
	showNavBar();
	fadeOutElem($('#fb-iframe'));
	fadeInElem($('#user-info-div'));
}

function formatDate(date) {
	return date.getMonth().toString() + '/' + date.getDay().toString() + '/' + date.getFullYear().toString();
}

function formatMonthDate(frmtStr) {
    var newStr = frmtStr.substring(5, 7) + '/' + frmtStr.substring(0, 4);
    return newStr;
}

function submitUserInfoForm() {
    // Saving new model object data here
	var dob;
	var DOBStr = "";
	if($('#inf-dob').val()) {
		dob = new Date($('#inf-dob').val());
		DOBStr = formatDate(dob);
	}

	if(!isFromFBSec) {		
		userInfo = new user(
				$('#inf-name-txt').val(),
				$('#inf-addr-txt').val(),
				$('#inf-email-txt').val(),
				DOBStr
		);
	}
    setDisplayNone($('#user-info-div'));
	if(isContract) {
		$('#select-plan-back-btn').attr("onclick", "back($('#select-plan-div'), 1)");
		fadeInElem($('#credit-check-div'));
	}else {
		$('#select-plan-back-btn').attr("onclick", "back($('#select-plan-div'), 0)");
		fadeInElem($('#select-plan-div'));
	}

    scrollToTop();
}

function submitCreditCheckForm() {
    // Saving new model object data here
	var creditCheckCC = new creditCheck(new creditCard(
        $('#cred-type-txt').val(),
        $('#cred-name-txt').val(),
        $('#cred-num-txt').val(),
        formatMonthDate($('#cred-exp-date').val()),
        $('#cred-sec-txt').val()
    ));
    creditCheckData['creditCard'] = creditCheckCC;
	creditCheckData['dlNumber'] = $('#cred-dl-txt').val();
    setDisplayNone($('#credit-check-div'));
    fadeInElem($('#select-plan-div'));
    usedCard = creditCheckData.creditCard.creditCard;
    scrollToTop();
}

// Sets credit check data to undefined since starting process again
function clearValue(val) {
	if(val) {
		val = undefined;
	}
}

function submitPromoCodeForm() {
    // Saving new model object data here
    selectedPlan = new plan(4, "Plan 4", 60, ["Unlimited Nationwide Family Calling", "Unlimited Text Messages", "2GB Data", "Data is sharable with others on plan."]);
	paymentType = "promoCode";
    setDisplayNone($('#select-plan-div'));
    fadeInElem($('#selected-plan-div'));
    scrollToTop();
}

function submitSelectedPromoPlan() {
	paymentType = 'promoCode';
	$('#num-select-back-btn').attr("onclick", "back($('#number-select-div'), 0)");
	showSelectNumber($('#selected-plan-div'));
}

function submitBudgetSelectedPlan() {
	var indexLoc;
	if ($("#budget-slider").slider('value') > 0) {
		indexLoc = $("#budget-slider").slider('value') - 1;
	}
	selectedPlan = JSONPlans[indexLoc];
	// setting plan selection method
	planSelectionMethod = "budget";
	if(!isContract) {
		$('#cc-pay-back-btn').attr("onclick", "back($('#cc-pay-div'), 0)");
		showPayByCard($('#budget-select-div'));
		$('#payment-div').children('form').children('legend').text('Total Due: $' + selectedPlan.price);
		scrollToTop();		
	}else {
		paymentType = 'creditCard';
		$('#num-select-back-btn').attr("onclick", "back($('#number-select-div'), 2)");
		showSelectNumber('#budget-select-div');
		scrollToTop();
	}
    
}

function submitUsageSelectedPlan() {
	var indexLoc;
	if ($("#usage-slider").slider('value') > 0) {
		indexLoc = $("#usage-slider").slider('value') - 1;
	}
	selectedPlan = JSONPlans[indexLoc];
	// setting plan selection method
	planSelectionMethod = "usage";
	if(!isContract) {
		$('#cc-pay-back-btn').attr("onclick", "back($('#cc-pay-div'), 1)");
		showPayByCard($('#usage-select-div'));
		$('#payment-div').children('form').children('legend').text('Total Due: $' + selectedPlan.price);
		scrollToTop();		
	}else {
		paymentType = 'creditCard';
		$('#num-select-back-btn').attr("onclick", "back($('#number-select-div'), 3)");
		showSelectNumber('#usage-select-div');
		scrollToTop();
	}
}

function submitPromoSelectedPlan() {
	setDisplayNone($('#selected-plan-div'));
	fadeInElem($('#payment-div'));
	$('#payment-div').children('form').children('legend').text('Total Due: $' + selectedPlan.price);
    scrollToTop();
}

function showPayByCard(fromEl) {
	setDisplayNone(fromEl);
	var amtDueTxt = "Amount Due: $" + selectedPlan.price.toFixed(2);
	$('#cc-pay-amt-due-txt').text(amtDueTxt);
	fadeInElem($('#cc-pay-div'));
    scrollToTop();
}

function showBudgetSelect() {

    setDisplayNone($('#select-plan-div'));
    fadeInElem($('#budget-select-div'));
    loadSlider($("#budget-slider"), $('#budget-select-div'));
    scrollToTop();
}

function showUsageSelect() {
    setDisplayNone($('#select-plan-div'));
    fadeInElem($('#usage-select-div'));
    loadSlider($("#usage-slider"), $('#usage-select-div'));
    scrollToTop();
}

function setCCTypeHiddenVal(text, hiddenEl) {
	hiddenEl.val(text);
}

function setCardTypeDDLText(btnEl, text) {
	btnEl.text(text);
}

function setCardTypeDDLText(ddlistEl, text) {
	ddlistEl.text(text);
	ddlistEl.append('<span class="caret"></span>');
}

function submitCCPayment() {
	var expDate;
	var expStr = "";
	if($('#card-exp').val()) {
		expStr = formatMonthDate($('#card-exp').val());
	}
	usedCard =  new creditCard(
		$('#card-type-txt').val(),
        $('#card-name-txt').val(),
        $('#card-number-txt').val(),
        expStr,
        $('#card-sec-num').val()
	);
	paymentType = 'creditCard';
	$('#num-select-back-btn').attr("onclick", "back($('#number-select-div'), 1)");
	showSelectNumber('#cc-pay-div');
}

function showSelectNumber(toHide) {
	$('#available-num-list').empty();
	JSONPhnNumberList = [];
	$.getJSON('phoneNumbers.json', function (data) {
        $.each(data.phoneNumbers, function (key, value) {
            JSONPhnNumberList.push(value);
        });
		$.each(JSONPhnNumberList, function (key, value) {
			var elID = value;
			$('#available-num-list').append('<li><a id="' + elID + '" href="#fakelink" onclick="selectAPhoneNumber('+ key + ')">' + elID + '</a></li>');
		});
    });
	$('#num-select-input').typeahead({
		source: JSONPhnNumberList,
		updater: function(item) {
			setSelectedPhoneNumber(item);
			displaySelNumberText(item);
			return item;
		},
		minLength: 4
	});
	setDisplayNone($(toHide));
	fadeInElem($('#number-select-div'));
	scrollToTop();
}

var accordionClearElems = [$('#user-name-dt'), $('#user-address-dt'), $('#user-email-dt'), $('#user-dob-dt'), 
							$('#cc-type-dt'), $('#cc-name-dt'), $('#cc-number-dt'), $('#cc-exp-dt'),
							$('#plan-name-dt'), $('#plan-price-dt'),
							$('#selected-number-dt')];
function showSummary() {
	setDisplayNone($('#number-select-div'));
	emptyAccordionData(accordionClearElems);
	handleCCInfAccordion();
	loadSummaryAccordionElemData();
	fadeInElem($('#summary-div'));
}

function collaspeAccordionTables() {
	$('.accordion-body').addClass('collapse');
	$('.accordion-body').removeClass('in');
}

function handleCCInfAccordion() {
	if((typeof usedCard !== 'undefined') && (paymentType === "creditCard")) {
		console.log("show cc accordion");
		$('#cc-inf-accordion').css('display', 'block');
	}else {
		$('#cc-inf-accordion').css('display', 'none');
	}
}

function loadSummaryAccordionElemData() {
	// loading user data
	$('#user-name-dt').after('<dd class="sum-inf-text-spacer">'+ userInfo.name +'</dd>');
	$('#user-address-dt').after('<dd class="sum-inf-text-spacer">'+ userInfo.address +'</dd>');
	$('#user-email-dt').after('<dd class="sum-inf-text-spacer">'+ userInfo.email +'</dd>');
	$('#user-dob-dt').after('<dd class="sum-inf-text-spacer">'+ userInfo.dob +'</dd>');
	// loading paid with CC data
	if(typeof usedCard !== 'undefined') {
		$('#cc-type-dt').after('<dd class="sum-inf-text-spacer">'+ usedCard.type +'</dd>');
		$('#cc-name-dt').after('<dd class="sum-inf-text-spacer">'+ usedCard.name +'</dd>');
		$('#cc-number-dt').after('<dd class="sum-inf-text-spacer">'+ usedCard.number +'</dd>');
		$('#cc-exp-dt').after('<dd class="sum-inf-text-spacer">'+ usedCard.expiration +'</dd>');
	}
	// loading plan data
	$('#plan-name-dt').after('<dd class="sum-inf-text-spacer">'+ selectedPlan.name +'</dd>');
	$('#plan-price-dt').after('<dd class="sum-inf-text-spacer">'+ '$' + selectedPlan.price.toString() +'</dd>');
	// loading selected phone number
	$('#selected-number-dt').after('<dd class="sum-inf-text-spacer">'+ selectedPhoneNumber +'</dd>');
}

function emptyAccordionData(removeList) {
	$.each(removeList, function(key, val) {$(val).next('dd').remove()});
}

function showTAndC() {
//	$('.tc-text').after('<div class="switch switch-square tc-switch-flt-right" data-on-label="YES" data-off-label="NO"><input type="checkbox" /></div>');
//	$(".switch").bootstrapSwitch();
	setDisplayNone($('#summary-div'));
    fadeInElem($('#tc-div'));
    scrollToTop();
}

function showCongrats() {
	setDisplayNone($('#tc-div'));
	// Using fadeIn() here vs fadeInElem because we are only displaying the loading page.
	// No functionality for this element.
	$('#loading-div').fadeIn();
	$('#congrats-selected-num > b').text(selectedPhoneNumber);
	setTimeout(function() {
		setDisplayNone($('#loading-div'));
		fadeInElem($('#congratulations-div'));
	}, 3000);
	scrollToTop();
}

function selectAPhoneNumber(loc) {
	var pnum = JSONPhnNumberList[loc];
	setSelectedPhoneNumber(pnum);
	displaySelNumberText(pnum);
}

function setSelectedPhoneNumber(number) {
	$('#num-select-input').val('');
	selectedPhoneNumber = number;
} 

function displaySelNumberText(number) {
	$('#selected-number-txt').text('You selected: ' + number);
}

function getCurrentEl() {
    return this.currentEl;
}

function setCurrentEl(el) {
    currentEl = el;
}

function loadSlider(elem, parent) {
    var $slider = elem;
    if ($slider.length > 0) {
        $slider.slider({
            min: 1,
            max: 3,
            value: 2,
            orientation: "horizontal",
            range: "min"
        });
    }
    $(parent).children('.dyn-sel-plan-data').empty();
    var indexLoc = 0;
    var currPlan;
    if ($(elem).slider('value') > 0) {
        indexLoc = $(elem).slider('value') - 1;
    }
    currPlan = JSONPlans[indexLoc];
    $(parent).children('.dyn-sel-plan-data').append("<p>For " + "$" + currPlan.price + " you will get:</p>");
    $(parent).children('.dyn-sel-plan-data').append('<ul class="detail-list list-style"></ul>');
    $.each(currPlan.details, function (key, value) {
        $('.detail-list').append("<li>" + value + "</li>");
    });
    $(elem).slider().on('slidechange', function (ev) {
        $(parent).children('.dyn-sel-plan-data').empty();
		if ($(elem).slider('value') > 0) {
			indexLoc = $(elem).slider('value') - 1;
		}
		currPlan = JSONPlans[indexLoc];
		$(parent).children('.dyn-sel-plan-data').append("<p>For " + "$" + currPlan.price + " you will get:</p>");
		$(parent).children('.dyn-sel-plan-data').append('<ul class="detail-list list-style"></ul>');
		$.each(currPlan.details, function (key, value) {
			$('.detail-list').append("<li>" + value + "</li>");
		});
    });
}

function showNavBar() {
    $('#nav-header').css('display', 'block');
}

function hideNavBar() {
    $('#nav-header').css('display', 'none');
}

function startFBSection() {
	hideNavBar();
	fadeOutElem($('#subscriber-options-div'));
	showFBiFrame();
}

function closeFBIframe() {
	fadeOutElem($('#fb-iframe'));
	fadeInElem($('#subscriber-options-div'));
	showNavBar();
}

function showFBiFrame() {
	fadeInElem($('#fb-iframe'));
}

function fadeOutElem(elem) {
    $(elem).fadeOut();
}

function fadeInElem(elem) {
    $(elem).fadeIn();
    setCurrentEl(elem);
}

function setDisplayNone(elem) {
    $(elem).css('display', 'none');
}

function scrollToTop() {
    window.scrollTo(0, 0);
}

function setIsContract(elemID) {
	if(elemID.indexOf("postpay") !== -1) {
//		console.log('IS POSTPAY');
		isContract = true;
	}else {
//		console.log('IS PREPAY');
		isContract = false;
	}
}

// implementing back functionality
var backElMap = {};
backElMap[$('#user-info-div').attr('id')] = $('#subscriber-options-div');
backElMap[$('#credit-check-div').attr('id')] = $('#user-info-div');
backElMap[$('#select-plan-div').attr('id')] = [$('#user-info-div'), $('#credit-check-div')];
backElMap[$('#selected-plan-div').attr('id')] = $('#select-plan-div');
backElMap[$('#budget-select-div').attr('id')] = $('#select-plan-div');
backElMap[$('#usage-select-div').attr('id')] = $('#select-plan-div');
backElMap[$('#number-select-div').attr('id')] = [$('#selected-plan-div'), $('#cc-pay-div'), $('#budget-select-div'), $('#usage-select-div')];
backElMap[$('#cc-pay-div').attr('id')] = [$('#budget-select-div'), $('#usage-select-div')];
backElMap[$('#summary-div').attr('id')] = $('#number-select-div');
backElMap[$('#tc-div').attr('id')] = $('#summary-div');

function back(currEl, backLoc) {
	var backToEl = backElMap[currEl.attr('id')];
	if(typeof backLoc !== 'undefined') {
		backToEl = backToEl[backLoc];
	}
	collaspeAccordionTables();
	setDisplayNone(currEl);
	fadeInElem(backToEl);
	setCurrentEl(backToEl);
}

function toggleContractButtons(btnId) {
	if(btnId.indexOf("postpay") !== -1) {
		$('#inf-postpay-btn').removeClass('btn-default');
		$('#inf-postpay-btn').addClass('btn-primary');
		$('#inf-prepay-btn').removeClass('btn-primary');
		$('#inf-prepay-btn').addClass('btn-default');
	}else {
		$('#inf-prepay-btn').removeClass('btn-default');
		$('#inf-prepay-btn').addClass('btn-primary');
		$('#inf-postpay-btn').removeClass('btn-primary');
		$('#inf-postpay-btn').addClass('btn-default');
	}
}

function setJSONPlans() {
    $.getJSON('plans.json', function (data) {
        $.each(data.plans, function (key, value) {
            JSONPlans.push(new plan(value.id, value.name, value.price, value.details));
        });
    });
}

function setJSONPhoneNumbers() {
	$.getJSON('phoneNumbers.json', function (data) {
        $.each(data.plans, function (key, value) {
            JSONPhnNumberList.push(value);
        });
    });
}

$(window).bind("load", function () {
    setJSONPlans();
});