/**
 * Get offset of element
 * @param {HTMLElement} el Dom element
 * @return {{top: number, left: number}}
 */
function offset(el) {
  if (!el) {
    return { top: 0, left: 0 };
  }
  var rect = el.getBoundingClientRect();
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

/**
 * Remove class from element
 * @param {HTMLElement | HTMLElement[]} el
 * @param {string} classname
 * @return {HTMLElement | HTMLElement[]}
 */
function removeClass(el, classname) {
  return iterateElement(el, function(elIterate){
    elIterate.classList.remove(classname);
  });
}

/**
 * Set attribute
 * @param {HTMLElement | HTMLElement[]} el 
 * @param {string} key 
 * @param {string} value 
 * @return {HTMLElement | HTMLElement[]}
 */
function setAttribute(el, key, value) {
  return iterateElement(el, function(elIterate){
    elIterate.setAttribute(key, value);
  });
}

/**
 * Set html
 * @param {HTMLElement | HTMLElement[]} el 
 * @param {string} html
 * @return {HTMLElement | HTMLElement[]}
 */
function setHTML(el, html) {
  return iterateElement(el, function(elIterate){
    elIterate.innerHTML = html;
  });
}

/**
 * Add class to element
 * @param {HTMLElement | HTMLElement[]} el 
 * @param {string} classname 
 * @return {HTMLElement | HTMLElement[]}
 */
function addClass(el, classname) {
  return iterateElement(el, function(elIterate){
    elIterate.classList.add(classname);
  });
}

/**
 * Toggle class to element
 * @param {HTMLElement | HTMLElement[]} el 
 * @param {string} classname 
 * @return {HTMLElement | HTMLElement[]}
 */
function toggleClass(el, classname) {
  return iterateElement(el, function(elIterate){
    elIterate.classList.toggle(classname);
  });
}

/**
 * Check if element has class
 * @param {HTMLElement} el 
 * @param {string} classname 
 * @return {boolean}
 */
function hasClass(el, classname) {
  var hasClass = false;
  iterateElement(el, function(elIterate){
    hasClass = elIterate.classList.contains(classname);
  });
  return hasClass;
}

/**
 * Iterate all elements
 * 
 * @param {HTMLElement | HTMLElement[]} el
 * @param {callback} cb 
 * @return {HTMLElement | HTMLElement[]}
 */
function iterateElement(el, cb) {
  if (!el) {
    return;
  }
  if (el.classList) {
    if (cb) {
      cb(el);
    }
    return el;
  }
  var list = el;
  for (var i = 0; i < list.length; i++) {
    var ele = list[i];
    if (cb) {
      cb(ele);
    }
  }
  return el;
}

/**
 * Get list closest child of the element
 * @param {HTMLElement} el 
 * @return {HTMLElement[]}
 */
function getTheClosestChild(el) {
  var elements = [];
  for (var i=0; i<el.childNodes.length; i++) {
    var child = el.childNodes[i];
    if (child.nodeType == 1) {
      elements.push(child)      
    }
  }
  return elements;
}

/**
 * Get distance between 2 elements
 * @param {HTMLElement} el1 
 * @param {HTMLElement} el2 
 * @return {number} The distance
 */
function getDistance(el1, el2) {
  var el1Offset = offset(el1);
  if (el2) {
    var el2Offset = offset(el2);
    var distance = el2Offset.left - el1Offset.left - el1.offsetWidth;
    return distance;
  } else {
    var w = window.innerWidth;
    var distance = w - el1Offset.left - el1.offsetWidth;
    return distance;
  }
}

/**
 * Remove element
 * @param {HTMLElement | HTMLElement[]} el 
 */
function removeItem(el) {
  return iterateElement(el, function(elIterate){
    elIterate.parentNode.removeChild(elIterate);
  });
}

/**
 * Where el is the DOM element you'd like to test for visibility
 * @param {HTMLElement} el
 * @return {boolean}
 */
function isHidden(el) {
  return (el.offsetParent === null)
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.onclick = clickBody;
  
  // click on page body
  function clickBody() {  
    var dropdownList = document.getElementsByClassName("dropdown-box");
    for (i = 0; i < dropdownList.length; i++) {
      dropdownList[i].classList.remove("open");
    }
  }
  
  /**
   * click check icon
   * @param {click event} event event for check icon click
   */
  function checkIconClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'check-icon')) return;

    toggleClass(target, "checked");
    
    event.preventDefault();
  }
  
  /**
   * click Switch box
   * @param {click event} event event for switch box click
   */
  function switchBoxClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'switch-box')) return;

    toggleClass(target, "checked");

    event.preventDefault();
  }
  function switchBoxSubClick(event) {
    var target = event.target;
    if (!target || (!hasClass(target, 'label-on') && !hasClass(target, 'dot') && !hasClass(target, 'label-off'))) return;

    toggleClass(target.parentNode, "checked");

    event.preventDefault();
  }
  
  /**
   * click Dropdown box
   * @param {click event} event event for dropdown box click
   */
  function dropdownClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'dropdown-box')) return;

    toggleClass(target, "open");
    
    event.preventDefault();
  }
  function dropdownLabelClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'selected-label')) return;

    toggleClass(target.parentNode, "open");
    
    event.preventDefault();
  }
  function dropdownSubClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'dropdown-arrow')) return;

    toggleClass(target.parentNode.parentNode, "open");
    
    event.preventDefault();
  }
  
  /**
   * click Dropdown box option
   * @param {click event} event event for dropdown box click
   */
  function dropdownOptionClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'option-li')) return;

    iterateElement(target.parentNode.getElementsByClassName('option-li'), function(optionItem) {
      removeClass(optionItem, 'active');
    });
    
    addClass(target, 'active');
    
    if (target.innerHTML === 'Off') {
      removeClass(target.parentNode.parentNode, 'checked');
    } else {
      addClass(target.parentNode.parentNode, 'checked');
    }
    
    event.stopPropagation();
  }
  
  // handle click event
  ['click', 'touchend'].forEach((handle) => {
    document.addEventListener(handle, function (event) {
      checkIconClick(event);
      switchBoxClick(event);
      switchBoxSubClick(event);
      dropdownClick(event);
      dropdownLabelClick(event);
      dropdownSubClick(event);
      dropdownOptionClick(event);
    }, false);
  })
});

/**
  * On Home Icon click
  * @param {click event} event 
  */
function homeClick(event) {
  var target = event.target;
  if (!target || !hasClass(target, 'tc-logo')) return;

  location.href = "light";

  event.preventDefault();
}