function defineDefaultStyle(){
    var recommended = [
        'rad','file'
    ];

    defaultNewStyle(recommended);
    $(formName()).trigger('_style_defultsProvided',[recommended]);
	
    //change button search again in customer search
    $('.dform_widget_search_closeresults').addClass('btn-gov-secondary').css("font-family", "Arial").text('Search again');
    $('#dform_widget_cs_customer_search_id').css("margin-right","0.75rem").css("width","80%");

    //Updating multi-checkboxes and check boxes to apply styling
    $("[data-type='multicheckbox']").addClass('mchk-gov')
    var multicheckbox = $("[data-type='multicheckbox']").find('> div > fieldset > span').not(":has(span)");
    multicheckbox.append('<span class="mchk-check"></span>');
	
    $("[data-type='checkbox']").addClass('chk-gov');
    var checkbox = $("[data-type='checkbox']").find('> div').not(":has(span)");
    checkbox.append('<span class="chk-check"></span>');
	
    //Updating check boxes
    $('.mchk-gov > div > fieldset > span input').attr('data-ignore', '1');
    $('.chk-gov > div input').attr('data-ignore', '1');
}

function defaultNewStyle(elements){

    if (elements == "all" || elements == "recommended"){
        defineDefaultStyle();
        return;
    }
}

function applyNewStyle(){
	var hasDefaultsInArguments = (typeof arguments[0] !== "undefined" && Array.isArray(arguments[0]));
    if (hasDefaultsInArguments){
        defaultNewStyle(arguments[0])
    }

    var elementsToUpdate = [
	['.rad-gov'],    
        ['.file-gov'],
        ['.file-gov[class*="file-limit-"]','file-limit'],
        ['[data-type="text"] div:first-child .dform_hidden','txt-hidden'],
    ];
    
    elementsToUpdate.forEach(function(item){
        var elements = $(item[0]);
        if (elements.length > 0){
            if (item.length == 1){
                updateStyle(elements, item[0].replace('.', ''));
            }else{
                updateStyle(elements, item[1]);
            }
        }
    });
	
	$(formName()).trigger('_style_styleApplied',[elementsToUpdate, (hasDefaultsInArguments) ? arguments[0] : false]);
}


function applyNewerStyle(elements){
    updateStyle(elements);
}

function updateStyle(elements, optionalName){
    $.each(elements, function(){
        individualApplyStyle($(this), optionalName);
    });
	$(formName()).trigger('_style_updateStyleDone',[elements, optionalName]);
}

var updateStyleFunctions = {
	'rad-gov': function(element){
		var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="rad-check"></span>');
	},
	'file-gov': function(element){
		$("[type='file']").attr('title', 'File upload');
		element.find('> div > label').removeAttr("for");
        	var el = element.find('input').not(":has(.file-gov-text)");
        	el.after('<span class="file-gov-icon"><label class="file-gov-text">Select Files...</label></span>');
        	el.parent().css('position', 'relative');
        	el.find("input").insertAfter(el.find(".file-gov-icon"));
        	element.find('.helptext').each(function(){
    
            		$(this).insertAfter($(this).parent().find(".file-gov-icon"));
        	});
	},
	'file-limit': function(element){
    		var classes = element.attr('class').split(/\s+/);
    		var hasClass = false;
    		for (var i = 0; i < classes.length; i++){
    			if (classes[i].startsWith('file-limit-')){
    				hasClass=classes[i];
    			}
    		}
    		if (hasClass){
    			var number = hasClass.substring(11, hasClass.length);
    			number = parseInt(number,10);
    			if (!(Number.isInteger(number) && number > 0 && number < 32)){
    				number = 3;
    			}
    			element.find('.file-gov-text').text('Upload file');
    			element.find('.dform_filenames').off('DOMNodeInserted DOMNodeRemoved').on('DOMNodeInserted DOMNodeRemoved', function(event) {
    				var current = $(this).children('span').length;
				if (event.type == 'DOMNodeInserted'){
    					if(current >= number){
    						$(this).parent().find('input').addClass('visibility-hidden');
    						
    						$("[type='file']").attr('title', 'File upload');
                		    element.find('> div > label').removeAttr("for");
                        	var el = element.find('input').not(":has(.file-gov-text)");
                        	el.find("input").insertAfter(el.find(".file-gov-icon"));
                        	element.find('.helptext').text('Maximum file upload has been reached');
    						
						$(formName()).trigger('_style_fileUploaded',[number,number,0]);
						setTimeout(function(){
							$("#file-upload-narrated-section").text('Maximum file upload has been reached');
							setTimeout(function(){
								$("#file-upload-narrated-section").text('');
							}, 3000);
						}, 2000);
    					}else{
    						$(this).parent().find('.file-gov-text').text('Upload file');
						$(formName()).trigger('_style_fileUploaded',[current,number,number-current]);
						setTimeout(function(){
							$("#file-upload-narrated-section").text('File has been added');
							setTimeout(function(){
								$("#file-upload-narrated-section").text('');
							}, 3000);
						}, 2000);
    					}
    				} else {
					$(this).parent().find('input').removeClass('visibility-hidden');
					
					$("[type='file']").attr('title', 'File upload');
                		    element.find('> div > label').removeAttr("for");
                        	var el = element.find('input').not(":has(.file-gov-text)");
                        	el.find("input").insertAfter(el.find(".file-gov-icon"));
                        	element.find('.helptext').text('Upload up to 5 files jpg,png,tiff');
					
						if(current-1 == 0){
							$(this).parent().find('.file-gov-text').text('Upload file');
						} else {
							$(this).parent().find('.file-gov-text').text('Upload file');
						}
					$(formName()).trigger('_style_fileUploaded',[0,number,(number-(current-1))]);
					setTimeout(function(){
						$("#file-upload-narrated-section").text('File has been deleted');
						setTimeout(function(){
							$("#file-upload-narrated-section").text('');
						}, 3000);
					}, 2000);
    				}
    			});
    		}
    	},
}

function individualApplyStyle(element, specificVal){
	if (specificVal !== null){
		if(updateStyleFunctions[specificVal] != undefined){
			updateStyleFunctions[specificVal](element);

			$(formName()).trigger('_style_elementUpdated',[element, specificVal, true]);
		}
	}
}

function formName(){
	if (KDF.kdf().name){
		return '#dform_'+KDF.kdf().name;
	}else{
		return '#dform_container';
	}
}

function setOptionText(name,text){
    var select = document.getElementById("dform_widget_"+name+"_id");
	
	if(select.options.length < 1){
	    //no results found
    	var opt = document.createElement('option');
    	opt.text = text;
        opt.value = 'hidden';
        opt.hidden=true;
        select.appendChild(opt);    
	}
}

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && 
           isFinite(value) && 
           Math.floor(value) === value;
};
