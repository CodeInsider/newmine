/*!
 * jQuery Cookie Plugin v1.3.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */

$(function (factory) {
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		try {
			return config.json ? JSON.parse(s) : s;
		} catch(er) {}
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined : {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));

			if (key && key === name) {
				result = converted(cookie);
				break;
			}

			if (!key) {
				result[name] = converted(cookie);
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			$.cookie(key, '', $.extend(options, { expires: -1 }));
			return true;
		}
		return false;
	};
}));

// init sidebar
$(document).ready(function() {
	// Check if sidebar contains elements to display
	if($('#sidebar').html().trim() === ''){
		$('#main-menu').prepend('<div id="sidebar-switch"><div class="disabled" title="Sidebar nicht verf&uuml;gbar"></div></div>');
		return true;
	}
	if($.cookie('sidebar-status') == 'collapsed'){
		$('#main-menu').prepend('<div id="sidebar-switch"><div class="collapsed" title="Sidebar anzeigen"></div></div>');
		$('#sidebar').addClass('collapsed');
		$('div#content').addClass('collapsed');
	} else{
		$('#main-menu').prepend('<div id="sidebar-switch"><div class="expanded" title="Sidebar ausblenden"></div></div>');
	}	
	return true;
});

// switch sidebar status
function switchSidebar($sidebar){
	if($.cookie('sidebar-status') == 'collapsed'){
		$($sidebar).switchClass('collapsed','expanded',0).delay(250).show("blind",{direction:"horizontal"}, 250);
		$('div#content').switchClass('collapsed','expanded',500);
		$('#sidebar-switch').children().switchClass('collapsed','expanded',500).attr('title','Sidebar ausblenden');
		$('#flowmenu #sidebar-switch').children().switchClass('collapsed','expanded',500).attr('title','Sidebar ausblenden');
		$.cookie('sidebar-status','', {  });
	}
	else{
		$($sidebar).hide("blind",{direction:"horizontal"}, 250).delay(250).switchClass('expanded','collapsed',0);
		$('div#content').switchClass('expanded','collapsed',500);
		$('#sidebar-switch').children().switchClass('expanded','collapsed',500).attr('title','Sidebar anzeigen');
		$('#flowmenu #sidebar-switch').children().switchClass('expanded','collapsed',500).attr('title','Sidebar anzeigen');
		$.cookie('sidebar-status','collapsed', {  });
	}
	return true;
};

$('#sidebar-switch').live("click", function(){
	if ($('#sidebar').html().trim() !== ''){
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
			switchSidebar('#sidebar');	
		},250);
	}
	return true;
});


//Flow Menu
function menuAdditional(button, menuItem, type, checkInner){
  this.buttonId = button;
  this.menuItemBez = menuItem;
  this.menuType = type;
  this.checkInner = a = typeof checkInner !== 'undefined' ? checkInner : false;
}

function getOuterHtml(obj){
  if ($(obj).size() > 0){
    var html = $(obj)[0].outerHTML;
    if (html != "")
      return html;
    return $(obj).parent().html();
  }
  else{
    return "";
  } 
}

function createFlowmenu(menuAdditionalList) {
	var html = '<div id="flowmenu"><div class="icons"><span id="logosmall"/></div></div>';
	$('#header').append(html);

  if($('#project_quick_jump_box').length > 0){
    $('#flowmenu .icons').append('<div><div class="selector-div">'+getOuterHtml('#project_quick_jump_box')+'</div></div>');
    // copy complete search form
    $('#flowmenu .icons').append(getOuterHtml($('#q').parent()));
    // and remove label for better display
    $('#flowmenu').find('label[for=q]').remove();
  }

  $('#flowmenu .icons').append(getOuterHtml('#loggedas'));
  $('#flowmenu .icons').append(getOuterHtml('#sidebar-switch'));
  /*html = '<div class="pictureDiv" id="menu-switch"/>';
  $('#flowmenu .icons').append(html);*/
  html = '<div id="additional" data-element="none"/>';
  $('#flowmenu').append(html);
  for (var i=0; i < menuAdditionalList.length; i++) {
    var menuAdditional = menuAdditionalList[i];
    if (menuAdditional.buttonId != ""){
      html = '<div class="pictureDiv" id="'+menuAdditional.buttonId.substring(1)+'"/>';
      $('#flowmenu .icons').append(html);
      if (getOuterHtml($(menuAdditional.menuItemBez)) != ""){
        $('#flowmenu '+menuAdditional.buttonId).live("click",{id : menuAdditional.buttonId, item : menuAdditional.menuItemBez, type : menuAdditional.menuType}, function(e){
          clearTimeout(this.timer);
	        this.timer = setTimeout(switchMenuWithEventData,250,e.data);
        	return true;
        });
      }
      else{
        $('#flowmenu '+menuAdditional.buttonId).addClass('inactive');
      }
    }
    else{
      var outerHtml = getOuterHtml($(menuAdditional.menuItemBez));
      var innerValid = (menuAdditional.checkInner) ? (($(menuAdditional.menuItemBez).html() == null) ? false: $(menuAdditional.menuItemBez).html().trim() != "") : true;
      if (outerHtml != "" && innerValid){
        var width = $(menuAdditional.menuItemBez).width();
        //html = '<div class="bottom"/>';
        //$('#flowmenu').append(html);
        html = outerHtml;
        $('#flowmenu').append(html);
        //$('#flowmenu .contextual').css('width',width+'px');
      }
    }
  };
  $('#flowmenu .icons:first').children().each(function(){
    $(this).addClass('flowicon');
  });
}

function isVisible($obj){
  if ($($obj).css('display') == 'none')
    return false;
    
  if ($($obj).css('visibility') == 'collapse' || $($obj).css('visibility') == 'hidden')
    return false;
    
  return true;
}

var oldMenuButton = "";
function switchMenu($menuButton, $menuItem, menuType){
  //feld element zuweisen
  if (isVisible('#flowmenu #additional'))
    $('#flowmenu #additional').hide("blind",{'direction':'vertical'},250, function(){
      changeAdditional($menuItem, menuType);
    });
  else{
    changeAdditional($menuItem, menuType);
  
  //menu buttons anpassen
  }
  if ($($menuButton).hasClass('activated')){
    $($menuButton).removeClass('activated');
  }
  else{
    if (oldMenuButton != "")
      $(oldMenuButton).removeClass('activated');
    $($menuButton).addClass('activated');
    oldMenuButton = $menuButton;
    $('#flowmenu #additional').show("blind",{'direction':'vertical'},250);
  }
}

function switchMenuWithEventData(eventData){
  switchMenu(eventData.id,eventData.item,eventData.type);
}

function changeAdditional($additional, element){
  if ($('#flowmenu #additional').data('element') != element){
    $('#flowmenu #additional').data('element',element);
    $('#flowmenu #additional').html('<div id="'+element+'"/>');
    var html = getOuterHtml($additional);
    if (html == "")
      return false;
      
    $('#flowmenu #'+element).append(html);
    $("#flowmenu #"+element + " .contextual:first").remove();
  }
  return true;
}


function initFlowmenu(dependantElementsArray, menuAdditionalArray){
  var scrollTop = -1;
  for (var i=0; i < dependantElementsArray.length; i++) {
    if (getOuterHtml(dependantElementsArray[i]) != "") {
      var obj = $(dependantElementsArray[i]);
      scrollTop = obj.offset().top + obj.height();
      break;
    };
  };
  if (scrollTop > -1) {
    createFlowmenu(menuAdditionalArray);
    $(document).scroll(function(){
      if ($(this).scrollTop() > scrollTop && !isVisible('#flowmenu')){  
        $('#flowmenu').show("blind",{'direction':'vertical'},250);
      }
      if ($(this).scrollTop() <= scrollTop && isVisible('#flowmenu')){  
        $('#flowmenu').hide("blind",{'direction':'vertical'},250);
      }
    });
  };
}

function flowmenuTeaser(){
  var isCreated = ($("#flowmenu #animationDiv") == null) ? false : (getOuterHtml($("#flowmenu #animationDiv")) == "") ? false : true;
  if (!isCreated){
    var html = '<div id="animationDiv" style="position:fixed; top: 300px; left:200px; font-size:70px; font-weight:bold; color:red; background:transparent;">FLOOOOOWMENU</div>';
    $("#flowmenu").append(html);
    var anObj = $("#flowmenu #animationDiv");
    anObj.effect("pulsate",{times:6},6000);
    rotate(anObj, 0, 480);
  }
}
var timert;
function rotate($obj, from, to){
  if (from < to){
    $($obj).css({'-moz-transform':'rotate('+from+'deg)'});
    $($obj).css({'-webkit-transform':'rotate('+from+'deg)'});
    $($obj).css({'transform':'rotate('+from+'deg)'});
    timert = setTimeout(function(){
      from++;
      rotate($obj, from, to);
    },5);
  }
  else{
    clearTimeout(timert);
    $($obj).remove();
  }
}

$(document).ready(function(){
  var dependantElementsArray = new Array('#content > h2:first');
  var menuAdditionalArray = new Array();

  if($("#query_form").length > 0){
    menuAdditionalArray.push(new menuAdditional("#filter-switch", "#query_form", "filter"));
  }
  
  menuAdditionalArray.push(new menuAdditional("#menu-switch", "#main-menu > ul", "main-menu"));
  menuAdditionalArray.push(new menuAdditional("", "#content .contextual:first", "contextual", true));

  if($('body.controller-my').length == 0){
    initFlowmenu(dependantElementsArray, menuAdditionalArray);
  }
})

$(document).ready(function(){
    $("td.done_ratio td.closed").each(function(index,value){
        var progress = parseFloat($(this)[0].style.width);
        progress = Math.floor(progress/10,0) * 10;
        $(this).parents('.progress').addClass('progress-'+progress);
    });
})