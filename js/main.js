const SECONDARY_NAVBAR_HEIGHT = 60; //px
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
  var spaceForShrinkMore = 100; // use for control the distance to the left, if the distance less then this then shrink the menu
  var headerNavUi = document.querySelectorAll('.header-nav-ui')[0];
  var primaryNav = headerNavUi.querySelectorAll('.primary-nav')[0];
  var arrowSelectedPrimaryAnimation = primaryNav.getElementsByClassName('icon-chosen-arrow')[0];
  var secondaryNav = headerNavUi.querySelectorAll('.secondary-nav')[0];
  var arrowSelectedSecondaryAnimation = secondaryNav.getElementsByClassName('icon-select')[0];
  var secondaryNavMobile = headerNavUi.querySelectorAll('.secondary-nav-mobile')[0];
  var mobileNavSubMenu = headerNavUi.querySelectorAll('.mobile-nav-sub-menu')[0];
  var secondaryNavLinkContainer = secondaryNav.querySelectorAll('.secondary-nav-link-container')[0];
  var previousSelectElementDesktop = null;
  var previousLevel2ItemSelectElement = null;
  var selectingLevel1ClassKey = null;
  var notificationPanelPopup = document.querySelectorAll('.notification-popup')[0];
  var notificationPanelEmpty = document.querySelectorAll('.notifications-panel')[0];
  var notificationPanelFull = document.querySelectorAll('.notifications-panel')[1];
  var notificationPanelEmptyMobile = document.querySelectorAll('.mobile-notifications-panel')[0];
  var notificationPanelFullMobile = document.querySelectorAll('.mobile-notifications-panel')[1];

  /**
   * create nav from json object
   */
  function createAndMappingNavData() {
    var primaryLevel1 = primaryNav.querySelectorAll('.primary-level-1.hide')[0];
    var primaryLevel1Separator = primaryNav.querySelectorAll('.primary-level-1-separator.hide')[0];
    var primaryLevel2Container = primaryNav.querySelectorAll('.primary-level-2-container.hide')[0];
    var loginBtn = primaryNav.querySelectorAll('.login-btn')[0];
    // create primary menu level 1
    for (var i = 0; i < navMenus.length; i++) {
      var menuLevel1 = navMenus[i];
      var value = menuLevel1.value;
      var subMenu = menuLevel1.subMenu;

      var primaryLevel1Item = primaryLevel1.cloneNode(true);
      if (!previousSelectElementDesktop) {
        previousSelectElementDesktop = primaryLevel1Item;
      }
      var primaryLevel1SeparatorItem = primaryLevel1Separator.cloneNode(true);
      setHTML(setAttribute(setAttribute(addClass(removeClass(removeClass(primaryLevel1Item, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', i), value);
      addClass(removeClass(removeClass(primaryLevel1SeparatorItem, 'hide'), 'ignore'), 'copied');
      primaryNav.insertBefore(primaryLevel1Item, loginBtn);
      if (i !== navMenus.length - 1) {
        primaryNav.insertBefore(primaryLevel1SeparatorItem, loginBtn);
      }

      if (value === 'MORE') {
        addClass(primaryLevel1Item, 'more-menu');
        continue;
      }

      var primaryLevel2ContainerItem = primaryLevel2Container.cloneNode(true);
      setAttribute(primaryLevel2ContainerItem, 'key', value);
      addClass(removeClass(primaryLevel2ContainerItem, 'hide'), 'copied');
      primaryNav.insertBefore(primaryLevel2ContainerItem, loginBtn);
      // create primary menu level 2
      var primaryLevel2 = primaryLevel2ContainerItem.querySelectorAll('.primary-level-2.hide')[0];
      var moreBtnContainerLevel2 = primaryLevel2ContainerItem.querySelectorAll('.more-btn-container')[0];
      var moreContentContainer = primaryLevel2ContainerItem.querySelectorAll('.more-content-container')[0];
      var moreContentIgnoreItem = moreContentContainer.querySelectorAll('a.hide')[0];
      for (var j = 0; j < subMenu.length; j++) {
        var menuLevel2 = subMenu[j];
        var value2 = menuLevel2.value;
        var primaryLevel2Item = primaryLevel2.cloneNode(true);
        setHTML(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(primaryLevel2Item, 'hide'), 'ignore'), 'copied'), 'key', value2),'indexLevel1', i),'indexLevel2', j), value2);
        primaryLevel2ContainerItem.insertBefore(primaryLevel2Item, moreBtnContainerLevel2);

        var moreContentItem = moreContentIgnoreItem.cloneNode(true);
        setHTML(setAttribute(setAttribute(addClass(removeClass(moreContentItem, 'ignore'), 'copied'), 'key', value2),'index', i), value2);
        moreContentContainer.appendChild(moreContentItem);
      }
    }

    // side subMenu on first load
    var secondaryNav = headerNavUi.querySelectorAll('.secondary-nav')[0];
    addClass(secondaryNav, 'hide');
  }
  createAndMappingNavData();

  /**
   * clear secondary navigation item
   */
  function clearSecondaryNavItem() {
    removeItem(secondaryNav.querySelectorAll('.secondary-level-1.copied, .more-btn-container .more-content-container a.copied'));
    removeItem(mobileNavSubMenu.querySelectorAll('.menu a.copied'));
    removeClass(addClass(arrowSelectedSecondaryAnimation, 'hide'), 'isAnimation');
  }

  /**
   * Populate secondary memu items
   * @param {HTMLElement} target
   */
  function populateSecondaryNavMobile(target) {
    var indexLevel1 = target.getAttribute('indexLevel1');
    var indexLevel2 = target.getAttribute('indexLevel2');
    var datas = navMenus[indexLevel1].subMenu[indexLevel2];
    var subMenu = datas.subMenu;
    if (!subMenu || !subMenu.length) {
      return;
    }

    // create secondary mobile menu
    var mobileNavSubMenuContainer = mobileNavSubMenu.querySelectorAll('.menu')[0];
    var mobileNavSubMenuIgnoreItem = mobileNavSubMenuContainer.querySelectorAll('a.hide')[0];
    for (var i = 0; i < subMenu.length; i++) {
      var menuLevel1 = subMenu[i];
      var value = menuLevel1.value;

      var mobileNavSubMenuItem = mobileNavSubMenuIgnoreItem.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(mobileNavSubMenuItem, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', indexLevel2),'indexLevel3', i), value);
      mobileNavSubMenuContainer.appendChild(mobileNavSubMenuItem);
    }
  }

  /**
   * populate the secondary menu item base on = selected menu level 2 item
   * @param {HTMLElement} target Selected menu level 2 item
   * @param {HTMLElement} directTarget if target doesn't exist, will populate secondary menu item to this element
   */
  function populateSecondaryNav(target, directTarget) {
    clearSecondaryNavItem();
    removeClass(mobileNavSubMenu, 'isNothing');
    if (!target) {
      if (directTarget) {
        populateSecondaryNavMobile(directTarget);
      }
      return;
    }

    var indexLevel1 = target.getAttribute('indexLevel1');
    var indexLevel2 = target.getAttribute('indexLevel2');
    var datas = navMenus[indexLevel1].subMenu[indexLevel2];
    var subMenu = datas.subMenu;
    if (!subMenu || !subMenu.length) {
      return;
    }

    // create secondary menu level 1
    var secondaryLevel1 = secondaryNav.querySelectorAll('.secondary-level-1.hide')[0];
    var moreBtnContainer = secondaryNav.querySelectorAll('.more-btn-container')[0];
    var moreContentContainer = moreBtnContainer.querySelectorAll('.more-content-container')[0];
    var moreContentIgnoreItem = moreContentContainer.querySelectorAll('a.hide')[0];
    var mobileNavSubMenuContainer = mobileNavSubMenu.querySelectorAll('.menu')[0];
    var mobileNavSubMenuIgnoreItem = mobileNavSubMenuContainer.querySelectorAll('a.hide')[0];
    for (var i = 0; i < subMenu.length; i++) {
      var menuLevel1 = subMenu[i];
      var value = menuLevel1.value;
      var secondaryLevel1Item = secondaryLevel1.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(secondaryLevel1Item, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', indexLevel2),'indexLevel3', i), value);
      secondaryNavLinkContainer.insertBefore(secondaryLevel1Item, moreBtnContainer);

      var moreContentItem = moreContentIgnoreItem.cloneNode(true);
      setHTML(setAttribute(setAttribute(addClass(removeClass(moreContentItem, 'ignore'), 'copied'), 'key', value),'index', i), value);
      moreContentContainer.appendChild(moreContentItem);

      var mobileNavSubMenuItem = mobileNavSubMenuIgnoreItem.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(mobileNavSubMenuItem, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', indexLevel2),'indexLevel3', i), value);
      mobileNavSubMenuContainer.appendChild(mobileNavSubMenuItem);

      if (i === 0) {
        forceSecondaryLevel1Click(secondaryLevel1Item);
      }
    }

    checkForShrinkMore();
  }

  /**
   * clear secondary navigation mobile item
   */
  function clearSecondaryNavMobileItem() {
    removeItem(secondaryNavMobile.querySelectorAll('a.copied'));
  }

  /**
   * populate secondary navigation mobile item
   * @param {HTMLElement} target
   */
  function polulateSecondaryNavMobile(target) {
    clearSecondaryNavMobileItem();
    if (!target) {
      return;
    }

    var indexLevel1 = target.getAttribute('indexLevel1');
    var datas = navMenus[indexLevel1];
    var subMenu = datas.subMenu;
    if (!subMenu || !subMenu.length) {
      return;
    }

    // create secondary mobile menu
    var menu = secondaryNavMobile.querySelectorAll('.menu')[0];
    var secondaryLevel1 = menu.querySelectorAll('a.hide')[0];
    for (var i = 0; i < subMenu.length; i++) {
      var menuLevel1 = subMenu[i];
      var value = menuLevel1.value;
      var secondaryLevel1Item = secondaryLevel1.cloneNode(true);
      setHTML(setAttribute(setAttribute(setAttribute(addClass(removeClass(removeClass(secondaryLevel1Item, 'hide'), 'ignore'), 'copied'), 'key', value),'indexLevel1', indexLevel1),'indexLevel2', i), value);
      menu.appendChild(secondaryLevel1Item);
    }
  }

  /**
   * logout user
   * @param {click event} event event for logout button click
   */
  function logoutButtonClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'logout-btn')) return;

    removeClass(headerNavUi, "isLoggedIn");
    removeClass(document.getElementsByClassName('user-info-popup'), "isOpen");
    checkForShrinkMore();
  }

  /**
   * Animation for moving arrow to target
   * @param {number} offsetX
   * @param {HTMLElement} arrow
   * @param {HTMLElement} element
   */
  function moveArrowTo(offsetX, arrow, element) {
    if (element) {
      var arrowOffset = offset(element);
      var arrowoffsetwidth = arrow.offsetWidth;
      if (getComputedStyle(arrow).display == 'none') {
        arrow.style.display = 'block';
        arrowoffsetwidth = arrow.offsetWidth;
        arrow.style.display = 'none';
      }
      var arrowX = offsetX + arrowOffset.left + (element.offsetWidth - arrowoffsetwidth)/2;
      arrow.style.transform = "translateX(" + arrowX + "px)";
    }
  }

  /**
   * Login
   * @param {click event} event
   */
  function loginButtonClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'login-btn')) return;

    addClass(headerNavUi, "isLoggedIn");
    checkForShrinkMore();
  }

  /**
   * Scroll the mobile notification popup
   * @param {click event} event
   */
  document.getElementsByClassName('mobile-notifications-panel')[1].addEventListener("scroll", function(){
    console.log("scroll")
    if(document.getElementsByClassName('mobile-notifications-panel')[1].scrollTop >= 50) {
      addClass(notificationPanelFullMobile, "fixTop");
    } else {
      removeClass(notificationPanelFullMobile, "fixTop");
    }
  });

  /**
   * Notifications
   * @param {click event} event
   */
  var showEmpty = true;
  function notificationsButtonClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'notifi-image')) return;

    if (showEmpty) {
      addClass(notificationPanelPopup, 'isNotificationsPopupOpen');
      removeClass(notificationPanelEmpty, "hide");
      showEmpty = false;
    } else {
      addClass(notificationPanelEmpty, "hide");
      addClass(notificationPanelPopup, 'isNotificationsPopupOpen');
      removeClass(notificationPanelFull, "hide");
    }
  }

  /**
   * Mobile Notifications
   * @param {click event} event
   */
  var showEmpty = true;
  function notificationsMobileButtonClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'notification-right-arrow')) return;

    if (showEmpty) {
      removeClass(notificationPanelEmptyMobile, "hide");
      showEmpty = false;
    } else {
      removeClass(notificationPanelFullMobile, "hide");
    }
  }

  /**
   * Close Mobile Notifications
   * @param {click event} event
   */
  var showEmpty = true;
  function notificationsMobileBackClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'notification-back-btn')) return;

    addClass(notificationPanelEmptyMobile, "hide");
    addClass(notificationPanelFullMobile, "hide");
  }

  /**
   * Show popup notifications info
   * @param {click event} event
   */
  function notificationsInfoContainerClick(event) {
    var isSelected = false;
    var target = event.target;
    if (!target) {
      return;
    }
    iterateElement(document.querySelectorAll('.notifications-panel'), function(el) {
      if (el.contains(target)) {
        isSelected = true;
      }
    });
    if (isSelected) {
      event.preventDefault();
    } else {
      clickOutsideToClosePopupNotifications(event);
    }
  }

  /**
   * click outside to hide popup notifications
   * @param {click event} event
   */
  function clickOutsideToClosePopupNotifications(event) {
    var notificationPanelPopup = document.querySelectorAll('.header-nav-ui .notification-popup')[0];
    if (!isHidden(notificationPanelPopup) && !notificationPanelPopup.contains(event.target)) {
      removeClass(notificationPanelPopup, 'isNotificationsPopupOpen');
    }
  }

  /**
   * Switch to BUSSINESS or WORK
   * @param {click event} event
   */

  function switchBussinessWork(event) {
    var target = event.target;
    // Detect mouse click target whether the switch button
    if (!target || (!hasClass(target, 'switch-to-business-container') && !hasClass(target, 'switch-icon') && !hasClass(target, 'switch-to-busniness'))) return;

    var bussinessItem = primaryNav.getElementsByClassName('primary-level-1')[1];
    var bussinessItemVlue = bussinessItem.innerHTML;
    var workItem = primaryNav.getElementsByClassName('primary-level-1')[2];
    var workItemVlue = workItem.innerHTML;
    var iconChooseArrow = document.querySelectorAll('.icon-chosen-arrow')[0];
    var switchText = document.getElementsByClassName('switch-to-busniness')[0].innerHTML;

    function swtichValue(switchValue, switchItem) {
      // Update the text between 'Switch to BUSINESS' and 'Switch to WORK'
      document.getElementsByClassName('switch-to-busniness').innerHTML = 'Switch to ' + switchValue;
      // show the arrow
      $(iconChooseArrow).css("display", "block");
      // Update ui for clicked sublevel 1 item
      forceClickToSublevel1(switchItem)
    }

    if (switchText === 'Switch to ' + bussinessItemVlue) {
      swtichValue(workItemVlue, bussinessItem)
    } else if (switchText === 'Switch to ' + workItemVlue) {
      swtichValue(bussinessItemVlue, workItem)
    }

  }

  /**
   * move primary arrow to target
   * @param {number} xOffset
   * @param {HTMLElement} target
   */
  function movePrimaryArrowTo(xOffset, target) {
    moveArrowTo(xOffset, arrowSelectedPrimaryAnimation, target);
  }

  /**
   * Update ui for clicked sublevel 1 item
   * @param {HTMLElement} target sublevel 1 item
   */
  function forceClickToSublevel1(target) {
    if (!target) {
      return;
    }

    // After change the navigation, the Switch to text should toggle as well
    if (target.innerHTML === 'BUSINESS') {
      document.getElementsByClassName('switch-to-busniness')[0].innerHTML = 'Switch to WORK'
    } else if (target.innerHTML === 'WORK') {
      document.getElementsByClassName('switch-to-busniness')[0].innerHTML = 'Switch to BUSINESS'
    }

    var menus = getPrimaryMenuItems();
    //All items are in initial state here
    var initial = menus.map(menu => offset(menu.domNode))

    polulateSecondaryNavMobile(target);
    var classKey = target.getAttribute('key');
    removeClass(document.getElementsByClassName('primary-level-2-container'), "isOpen");
    removeClass(removeClass(primaryNav.getElementsByClassName('primary-level-1'), "isOpen"), "isOpenSubmenu");
    removeClass(primaryNav.querySelectorAll('.primary-level-2-container a'), "isOpen");

    subList = document.querySelector(".primary-level-2-container[key="+classKey+"]");
    // var subList = target.nextElementSibling;
    // while (subList && !hasClass(subList, 'primary-level-2-container')) {
    //   subList = subList.nextElementSibling;
    // }
    //All items are in initial state here

    addClass(subList, "isOpen");
    addClass(target, "isOpen");

    //All items are in their final position here
    var final = menus.map(menu => offset(menu.domNode))

    movePrimaryArrowTo(0, target);

    populateSecondaryNav();
    checkForShrinkMore();
    slideElements(menus, final, initial);
    fadeInElement(subList);


    if (classKey !== 'MORE') {
      previousSelectElementDesktop = target;
      previousLevel2ItemSelectElement = null;
    }

    selectingLevel1ClassKey = classKey;

    addClass(mobileNavSubMenu, 'isNothing');
  }

  /**
   * Get all level 1 menu items that are clicked in order to expand submenus
   */
  function getPrimaryMenuItems() {
    var ans = []
    var menus = document.querySelectorAll(".primary-level-1:not(.hide)")
    menus.forEach(function(el) {
      if (getComputedStyle(el).display != "none") {
        ans.push({domNode: el})
      }
    })
    return ans;
  }

  /**
   * Slide elements from inital to final position
   * @param {[{domNode: HTMLElement}]} listOfElementsToSlide Output of the function
                                        getPrimaryMenuItems defined in this file
   * @param {offset object} inital Output of the function offset defined in this file
   * @param {offset object} final
   */
  function slideElements(menus, initial, final) {
    menus.forEach((menu, i) => {
      var element = menu.domNode;
      var initialoffset = Math.floor(final[i].left - initial[i].left);
      if (initialoffset != 0) {
        element.style.transform = "translateX(" + initialoffset + "px)";
        setTimeout(() => {
          element.style.transition = "transform 250ms ease-out";
          element.style.transform = "translateX(0)";
          setTimeout(() => {
            element.style.transition = "";
            element.style.transform = "";
          }, 250)
        }, 0)
      }
    })
  }

  /**
   * set opacity of element to 0 and then fade it in over 500ms
   * @param {HTMLElement} subList
   */
  function fadeInElement(element) {
    addClass(element, 'opacity-0');
    setTimeout(() => {
      addClass(element, 'fade-opacity-in');
      setTimeout(() => {
        removeClass(element, 'fade-opacity-in');
        removeClass(element, 'opacity-0');
      }, 500)
    })
  }

  /**
   * submenu level 1 click
   * @param {click event} event
   */
  function subLevel1Click(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'primary-level-1') || hasClass(target, 'login-btn') || hasClass(target, 'login-container')) return;

    // make logo margin-right as 50px so menu comes align right
    var logoRef = document.getElementsByClassName('tc-logo');
    if (window.innerWidth > 768) {
      $(logoRef).css("margin-right", "50px");
    }

    // make height of secondaryNav as 0, since top level Menu item is clicked
    animateSubLevel2Foldup()
    .then(() => {
      var secondaryNav = document.querySelectorAll('.secondary-nav')[0];
      $(secondaryNav).css("height", "0px");

      var iconChooseArrow = document.querySelectorAll('.icon-chosen-arrow')[0];
      $(iconChooseArrow).css("display", "block");

      removeSecondaryNavBackground();
    })
    forceClickToSublevel1(target);
    event.preventDefault();
  }

  function removeSecondaryNavBackground() {
    addClass(secondaryNav, "hide");
  }

  function addSecondaryNavBackground() {
    removeClass(secondaryNav, "hide");
  }

  /**
   * Animate the secondarynavbar element to slide up under the primary navbar element
   */
  function animateSubLevel2Foldup() {
    return new Promise((resolve, reject) => {
      element = secondaryNav;
      element.style.transition = "transform 250ms linear";
      element.style.transform = "translateY(-"+ SECONDARY_NAVBAR_HEIGHT + "px)";
      setTimeout(() => {
        element.style.transition = "";
        element.style.transform = "";
        resolve();
     }, 250)
    })
  }

  /**
   * Update ui when click to sub level 2 item
   * @param {HTMLElement} target item sub level 2
   */
  function forceClickToSubLevel2(target) {
    if (!target) {
      return;
    }

    var classKey = target.getAttribute('key');
    addClass(primaryNav.querySelectorAll('.primary-level-1.isOpen'), "isOpenSubmenu");
    var visibleMoreItemSelector = ".primary-level-2-container.isOpen .more-btn-container .more-content-container a:not(.hide)[key='" + classKey + "']";
    var visibleMoreItem = primaryNav.querySelectorAll(visibleMoreItemSelector);
    var secondaryNavMobileItemSelector = ".menu a.secondary-mobile-level-2[key='" + classKey + "']";
    var secondaryNavMobileItem = secondaryNavMobile.querySelectorAll(secondaryNavMobileItemSelector);
    removeClass(secondaryNavMobile.querySelectorAll('.menu a'), "isOpen");
    removeClass(primaryNav.querySelectorAll('.primary-level-2-container a'), "isOpen");
    var primaryLevel2 = primaryNav.querySelectorAll("a.primary-level-2[key='" + classKey + "']")[0];
    addClass(primaryLevel2, "isOpen");
    addClass(visibleMoreItem, "isOpen");
    addClass(secondaryNavMobileItem, "isOpen");
    mobileNavSubMenu.querySelectorAll('.header .name')[0].innerHTML = classKey;

    populateSecondaryNav(primaryLevel2, target);
    adjustSelectionPrimaryNavPosition(true);
    adjustSelectionSecondaryNavPosition(false);

    if (selectingLevel1ClassKey !== 'MORE') {
      previousLevel2ItemSelectElement = target;
    }
  }

  function closeMorePopup() {
    iterateElement(document.querySelectorAll('.more-content-container'), function(moreContentItem) {
      removeClass(moreContentItem.parentNode, 'isOpen');
    });
  }

  /**
   * event for sub level 2 more item click
   * @param {click event} event
   */
  function subLevel2MoreClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'primary-level-2-more')) return;
    addSecondaryNavBackground();
    closeMorePopup();
    forceClickToSubLevel2(target);
    event.preventDefault();
  }

  /**
   * event for sub level 2 item click
   * @param {click event} event
   */
  function subLevel2Click(event) {
    var target = event.target;
    if (!target || !(hasClass(target, 'primary-level-2') || hasClass(target, 'primary-level-2-more'))) return;

    // make height of subMenu to 60px
    var secondaryNav = document.querySelectorAll('.secondary-nav')[0];
    $(secondaryNav).css("height", SECONDARY_NAVBAR_HEIGHT+"px");

    var animateDropdown = hasClass(secondaryNav, 'hide');
    addSecondaryNavBackground();
    forceClickToSubLevel2(target);
    if (animateDropdown) {
      animateSubLevel2Drop();
    }
    event.preventDefault();
  }

  /**
   * Animate the secondary navbar to slid down when shown
   */
  function animateSubLevel2Drop() {
    element = secondaryNav;
    element.style.transform = "translateY(-" + SECONDARY_NAVBAR_HEIGHT + "px)";
    setTimeout(() => {
      element.style.transition = "transform 250ms linear";
      element.style.transform = "translateY(0)";
      setTimeout(() => {
        element.style.transition = "";
        element.style.transform = "";
      }, 250)
    }, 0)
  }

  /**
   * event for sub level 2 mobile item click
   * @param {click event} event
   */
  function subLevel2MobileClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'secondary-mobile-level-2')) return;
    addSecondaryNavBackground();
    forceClickToSubLevel2(target);
    event.preventDefault();

    removeClass(headerNavUi, 'isOpenSecondaryNavMobile');
  }

  /**
   * move secondary arrow to target
   * @param {number} xOffset
   * @param {HTMLElement} target
   */
  function moveSecondaryArrowTo(xOffset, target) {
    var arrowOffset = offset(secondaryNavLinkContainer);
    moveArrowTo(-arrowOffset.left + xOffset, arrowSelectedSecondaryAnimation, target);
  }

  /**
   * Update ui when secondary level 1 item click
   * @param {HTMLElement} target secondary level 1 item
   */
  function forceSecondaryLevel1Click(target) {
    if (!target) {
      return;
    }

    removeClass(secondaryNavLinkContainer.getElementsByClassName('secondary-level-1'), "isOpen");
    removeClass(secondaryNavLinkContainer.getElementsByClassName('secondary-level-1-more'), "isOpen");
    removeClass(mobileNavSubMenu.querySelectorAll('.menu a'), "isOpen");
    var classKey = target.getAttribute('key');

    var secondaryLevel1Selector = "a.secondary-level-1[key='" + classKey + "']";
    var secondaryLevel1 = secondaryNavLinkContainer.querySelectorAll(secondaryLevel1Selector);
    var secondaryLevel1MoreSelector = "a.secondary-level-1-more[key='" + classKey + "']";
    var secondaryLevel1More = secondaryNavLinkContainer.querySelectorAll(secondaryLevel1MoreSelector);
    var mobileNavSubMenuItemSelector = ".menu a[key='" + classKey + "']";
    var mobileNavSubMenuItem = mobileNavSubMenu.querySelectorAll(mobileNavSubMenuItemSelector);

    addClass(secondaryLevel1, 'isOpen');
    addClass(secondaryLevel1More, 'isOpen');
    addClass(mobileNavSubMenuItem, 'isOpen');

    var secondaryNav = headerNavUi.querySelectorAll('.secondary-nav')[0];
    removeClass(secondaryNav, 'hide');

    removeClass(arrowSelectedSecondaryAnimation, 'hide');
    adjustSelectionSecondaryNavPosition(true);
  }

  /**
   * secondary level 1 more item click
   * @param {click event} event
   */
  function secondaryLevel1MoreClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'secondary-level-1-more')) return;
    addSecondaryNavBackground();
    closeMorePopup();
    forceSecondaryLevel1Click(target);
    event.preventDefault();
  }

  /**
   * secondary level 1 item click
   * @param {click event} event
   */
  function secondaryLevel1Click(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'secondary-level-1') ) return;

    // make height of subMenu to 60px
    $($(target).parent()).parent().css("height", "60px");

    addSecondaryNavBackground();
    forceSecondaryLevel1Click(target);

    event.preventDefault();
  }

  /**
   * nav sub menu item click
   * @param {click event} event
   */
  function mobileNavSubMenuItemClick(event) {
    var target = event.target;
    if (!target || !hasClass(target, 'mobile-nav-sub-menu-item') ) return;
    addSecondaryNavBackground();
    removeClass(mobileNavSubMenu, 'isOpen');
    forceSecondaryLevel1Click(target);

    event.preventDefault();
  }

  /**
   * Show popup user info
   * @param {click event} event
   */
  function userInfoContainerClick(event) {
    var isSelected = false;
    var target = event.target;
    if (!target) {
      return;
    }
    iterateElement(document.querySelectorAll('.user-info-container, .user-info-popup-mobile .icon-close'), function(el) {
      if (el.contains(target)) {
        isSelected = true;
      }
    });
    if (isSelected) {
      toggleClass(document.getElementsByClassName('user-info-popup'), "isOpen");
      toggleClass(document.querySelectorAll('.user-info-container'), "isUserPopupOpen");
      event.preventDefault();
    } else {
      clickOutsideToClosePopupProfile(event);
    }
  }

  /**
   * click outside to hide popup user info
   * @param {click event} event
   */
  function clickOutsideToClosePopupProfile(event) {
    var userInfoPopup = document.querySelectorAll('.header-nav-ui .primary-nav .user-info-popup')[0];
    if (!isHidden(userInfoPopup) && !userInfoPopup.contains(event.target)) {
      removeClass(userInfoPopup, 'isOpen');
      removeClass(document.querySelectorAll('.user-info-container'), "isUserPopupOpen");
    }
  }

  /**
   * more button click
   * @param {click event} event
   */
  function moreButtonClick(event) {
    var moreBtnClicked = null;
    var target = event.target;
    if (!target) {
      return;
    }
    iterateElement(document.querySelectorAll('.more-btn'), function(el) {
      if (el.contains(target)) {
        moreBtnClicked = el;
      }
    });
    if (moreBtnClicked) {
      event.preventDefault();
      var isOpen = hasClass(moreBtnClicked.parentNode, "isOpen");
      iterateElement(headerNavUi.querySelectorAll('.more-btn'), function(el2){
        removeClass(el2.parentNode, "isOpen");
      });
      if (isOpen) {
        removeClass(moreBtnClicked.parentNode, "isOpen");
      } else {
        addClass(moreBtnClicked.parentNode, "isOpen");
        var moreContentContainer= moreBtnClicked.parentNode.getElementsByClassName('more-content-container')[0];
        var moreContentContainerOffset = offset(moreContentContainer);
        var rightExpandX =  window.innerWidth - (moreContentContainerOffset.left + moreContentContainer.offsetWidth);

        if (rightExpandX < 0) {
          moreContentContainer.style.marginLeft = (rightExpandX + "px");
        } else {
          moreContentContainer.style.marginLeft = "0";
        }
      }
    } else {
      clickOutsideToClosePopupMore(event);
    }
  }

  /**
   * click outside to hide more popup
   * @param {click event} event
   */
  function clickOutsideToClosePopupMore(event) {
    iterateElement(document.querySelectorAll('.more-content-container'), function(userInfoPopup) {
      if (!isHidden(userInfoPopup) && !userInfoPopup.contains(event.target)) {
        removeClass(userInfoPopup.parentNode, 'isOpen');
      }
    });
  }

  /**
   * dont play secondary nav animation
   */
  function ignoreSelectionSecondaryNavAnimation() {
    removeClass(arrowSelectedSecondaryAnimation, 'isAnimation');
    setTimeout(function () {
      addClass(arrowSelectedSecondaryAnimation, 'isAnimation');
    }, 100);
  }

  /**
   * move secondary arrow animation
   * @param {boolean} withAnimation
   */
  function adjustSelectionSecondaryNavPosition(withAnimation) {
    if (withAnimation) {
      addClass(arrowSelectedSecondaryAnimation, 'isAnimation');
    } else {
      ignoreSelectionSecondaryNavAnimation();
    }
    var moreContainer = secondaryNavLinkContainer.getElementsByClassName('more-btn-container')[0];
    var secondaryLevel1IsOpen = secondaryNavLinkContainer.querySelectorAll('.secondary-level-1.isOpen');
    if (secondaryLevel1IsOpen.length > 0) {
      secondaryLevel1IsOpen = secondaryLevel1IsOpen[0];
      if (hasClass(secondaryLevel1IsOpen, 'hide')) {
        ignoreSelectionSecondaryNavAnimation();
        moveSecondaryArrowTo(-5, moreContainer);
      } else {
        moveSecondaryArrowTo(0, secondaryLevel1IsOpen);
      }
    }
  }

  /**
   * dont play primary nav animation
   */
  function ignoreSelectionPrimaryNavAnimation() {
    removeClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    setTimeout(function () {
      addClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    }, 10);
  }

  /**
   * move primary arrow animation
   * @param {boolean} withAnimation
   */
  function adjustSelectionPrimaryNavPosition(withAnimation) {
    if (withAnimation) {
      addClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    } else {
      ignoreSelectionPrimaryNavAnimation();
    }
    var primaryLevel2Container = primaryNav.querySelectorAll('.primary-level-2-container.isOpen');
    var primaryLevel1IsOpen = primaryNav.querySelectorAll('.primary-level-1.isOpen');
    if (primaryLevel2Container.length === 0 || isHidden(primaryLevel2Container[0])) {
      movePrimaryArrowTo(0, primaryLevel1IsOpen[0]);
      return;
    }

    var primaryLinkContainer = primaryLevel2Container[0];
    var moreContainer = primaryLinkContainer.getElementsByClassName('more-btn-container')[0];
    var primaryLevel2IsOpen = primaryLinkContainer.querySelectorAll('.primary-level-2.isOpen');
    if (primaryLevel2IsOpen.length > 0) {
      primaryLevel2IsOpen = primaryLevel2IsOpen[0];
      if (hasClass(primaryLevel2IsOpen, 'hide')) {
        ignoreSelectionPrimaryNavAnimation();
        movePrimaryArrowTo(-5, moreContainer);
      } else {
        movePrimaryArrowTo(0, primaryLevel2IsOpen);
      }
    } else if (primaryLevel1IsOpen.length > 0) {
      movePrimaryArrowTo(0, primaryLevel1IsOpen[0]);
    }
  }

  /**
   * check to shrink menu if it too long
   * @param {HTMLElement} el
   * @param {string} linkClass
   */
  function checkToShrinkElement(el, linkClass) {
    if (!el) {
      return;
    }
    var nextElement = el.nextElementSibling;
    while (nextElement && isHidden(nextElement)) {
      nextElement = nextElement.nextElementSibling;
    }
    var distance = getDistance(el, nextElement);
    var children = getTheClosestChild(el);
    var isChange = false;

    while (distance < spaceForShrinkMore) {
      var i = children.length - 1;
      for (; i >= 0; i--) {
        var primaryLevel2 = children[i];
        if (hasClass(primaryLevel2, linkClass) && !hasClass(primaryLevel2, 'hide') && !hasClass(primaryLevel2, 'icon-select') && !hasClass(primaryLevel2, 'ignore')) {
          addClass(primaryLevel2, 'hide');
          var moreContainer = el.getElementsByClassName('more-btn-container')[0];
          removeClass(moreContainer, 'hide');
          var classKey = primaryLevel2.getAttribute('key');
          var moreContentItem = removeClass(moreContainer.querySelectorAll(".more-content-container a[key='" + classKey + "']"), 'hide');
          if (hasClass(primaryLevel2, 'isOpen')) {
            addClass(moreContentItem, 'isOpen');
          }
          isChange = true;
          break;
        }
      }
      if (i >= 0) {
        distance = getDistance(el, nextElement);
      } else {
        break;
      }
    }

    if (isChange) {
      if (linkClass === 'secondary-level-1') {
        adjustSelectionSecondaryNavPosition(true);
      } else {
        adjustSelectionPrimaryNavPosition(true);
      }
    }
  }

  /**
   * check to expand menu if it have enough space
   * @param {HTMLElement} el
   * @param {string} linkClass
   */
  function expandElement(el, linkClass) {
    var children = getTheClosestChild(el);
    var moreContainer = el.getElementsByClassName('more-btn-container')[0];
    var i = children.length - 1;
    var isChange = false;
    for (var i = 0; i < children.length; i++) {
      var primaryLevel2 = children[i];
      if (hasClass(primaryLevel2, linkClass) && hasClass(primaryLevel2, 'hide') && !hasClass(primaryLevel2, 'ignore')) {
        removeClass(primaryLevel2, 'hide');
        var classKey = primaryLevel2.getAttribute('key');
        removeClass(addClass(moreContainer.querySelectorAll(".more-content-container a[key='" + classKey + "']"), 'hide'), 'isOpen');
        isChange = true;
      }
    }

    if (isChange) {
      if (linkClass === 'secondary-level-1') {
        adjustSelectionSecondaryNavPosition(true);
      } else {
        adjustSelectionPrimaryNavPosition(true);
      }
    }

    var activeElementInMore = moreContainer.querySelectorAll(".more-content-container a:not(.hide)");
    if (activeElementInMore.length === 0) {
      removeClass(addClass(moreContainer, 'hide'), 'isOpen');
    }
  }

  var previousScreenWidth = 0;
  /**
   * check to shrink/expand menu when window change size
   */
  function checkForShrinkMore() {
    var w = window.innerWidth;
    var iconChooseArrow = document.querySelectorAll('.icon-chosen-arrow')[0];
    var mobileMoreMenu = document.getElementsByClassName('more-menu');
    var primaryNavBusinessMenu = primaryNav.getElementsByClassName('primary-level-1')[1]
    var primaryNavWorkMenu = primaryNav.getElementsByClassName('primary-level-1')[2]
    var logoRef = document.getElementsByClassName('tc-logo');
    if (w <= 768 ) {
      // if mobile to desktop, if MORE navigation is selected, we need remove the arrow and fix the logo position
        if (hasClass(mobileMoreMenu, 'isOpen')){
          $(iconChooseArrow).css("display", "block");
        }
        // always set middle logo center
        $(logoRef).css("margin-right", "0");

      if (w !== previousScreenWidth) {
        adjustSelectionPrimaryNavPosition(false);
      }
      previousScreenWidth = w;
      return;
    } else {

      removeClass(headerNavUi, 'isOpenSecondaryNavMobile');
      removeClass(mobileNavSubMenu, 'isOpen');

        // if mobile to desktop, if MORE navigation is selected, we need remove the arrow and fix the logo position
        if (hasClass(mobileMoreMenu, 'isOpen')){
          $(iconChooseArrow).css("display", "none");
        }
        // desktop view if check the primary navigation item selected state during resize window
        if (hasClass(primaryNavBusinessMenu, 'isOpen') ||　hasClass(primaryNavWorkMenu, 'isOpen') ) {
          $(logoRef).css("margin-right", "50px");
        } else {
          $(logoRef).css("margin-right", "auto");
        }
    }
    iterateElement(document.getElementsByClassName('primary-level-2-container'), function(el) {
      if (hasClass(el, 'isOpen')) {
        var nextElement = el.nextElementSibling;
        while (nextElement && isHidden(nextElement)) {
          nextElement = nextElement.nextElementSibling;
        }
        var distance = getDistance(el, nextElement);
        if (distance < spaceForShrinkMore) {
          checkToShrinkElement(el, 'primary-level-2');
        } else {
          expandElement(el, 'primary-level-2');
          checkToShrinkElement(el, 'primary-level-2');
        }
        if ((previousScreenWidth - 900) * (w - 900) <= 0) {
          adjustSelectionPrimaryNavPosition(false);
        }
      }
    });
    iterateElement(secondaryNavLinkContainer, function(el) {
      var distance = getDistance(el, el.nextElementSibling);
      if (distance < spaceForShrinkMore) {
        checkToShrinkElement(el, 'secondary-level-1');
      } else {
        expandElement(el, 'secondary-level-1');
        checkToShrinkElement(el, 'secondary-level-1');
      }
      if ((previousScreenWidth - 900) * (w - 900) <= 0) {
        adjustSelectionSecondaryNavPosition(false);
      }
    });
    previousScreenWidth = w;
  }

  // handle event window resize
  window.addEventListener("resize", function(){
    console.log("resize")
    checkForShrinkMore();
  });

  checkForShrinkMore();
  setTimeout(function () {
    checkForShrinkMore();
    adjustSelectionPrimaryNavPosition(false);
    adjustSelectionSecondaryNavPosition(false);
  }, 100);

  headerNavUi.querySelectorAll('.mobile-nav .menu-btn')[0].addEventListener('click', function (event) {
    event.preventDefault();
    removeClass(mobileNavSubMenu, 'isOpen');
    addClass(headerNavUi, 'isOpenSecondaryNavMobile');
    adjustSelectionPrimaryNavPosition(false);
    setTimeout(function () {
      addClass(arrowSelectedPrimaryAnimation, 'isAnimation');
    }, 100);
  }, false);

  headerNavUi.querySelectorAll('.mobile-nav .close-btn')[0].addEventListener('click', function (event) {
    event.preventDefault();
    removeClass(headerNavUi, 'isOpenSecondaryNavMobile');
  }, false);

  mobileNavSubMenu.getElementsByClassName('header')[0].addEventListener('click', function (event) {
    event.preventDefault();
    toggleClass(mobileNavSubMenu, 'isOpen');
  }, false);

  // handle click event
  document.addEventListener('click', function (event) {
    subLevel1Click(event);
    subLevel2Click(event);
    subLevel2MoreClick(event);
    subLevel2MobileClick(event);
    loginButtonClick(event);
    logoutButtonClick(event);
    notificationsButtonClick(event);
    notificationsMobileButtonClick(event);
    notificationsMobileBackClick(event);
    secondaryLevel1Click(event);
    mobileNavSubMenuItemClick(event);
    secondaryLevel1MoreClick(event);
    userInfoContainerClick(event);
    notificationsInfoContainerClick(event);
    moreButtonClick(event);
    switchBussinessWork(event)
  }, false);

  /**
   * resize the navigation menu (if needed) when hovering avatar
   * @param {click event} event
   */
  function avatarHover(event) {
    var target = event.target;
    if (!(target && (hasClass(target, 'login-container') || hasClass(target, 'user-info-container') || hasClass(target, 'avatar')
      || hasClass(target, 'handle-container') || hasClass(target, 'handle') || hasClass(target, 'drowdown-icon')))) return;

    checkForShrinkMore();
    adjustSelectionPrimaryNavPosition(true);
    adjustSelectionSecondaryNavPosition(true);
  }

  // handle avatar hover events
  document.addEventListener('mouseover', function (event) {
    avatarHover(event);
  }, false);
  document.addEventListener('mouseout', function (event) {
    avatarHover(event);
  }, false);
});

/**
  * On Home Icon click
  * @param {click event} event
  */
function homeClick(event) {
  var target = event.target;
  if (!target || !hasClass(target, 'tc-logo')) return;

  // make logo margin-right as 50px so menu comes align right
  var logoRef = document.getElementsByClassName('tc-logo');
  $(logoRef).css("margin-right", "auto");

  // make height of secondaryNav as 0, since top level Menu item is clicked
  var secondaryNav = document.querySelectorAll('.secondary-nav')[0];
  $(secondaryNav).css("height", "0px");

  var iconChooseArrow = document.querySelectorAll('.icon-chosen-arrow')[0];
  $(iconChooseArrow).css("display", "none");

  // remove isOpen from opened Menu
  removeClass(document.getElementsByClassName('primary-level-2-container'), "isOpen");
  var headerNavUi = document.querySelectorAll('.header-nav-ui')[0];
  var primaryNav = headerNavUi.querySelectorAll('.primary-nav')[0];
  removeClass(removeClass(primaryNav.getElementsByClassName('primary-level-1'), "isOpen"), "isOpenSubmenu");
  removeClass(primaryNav.querySelectorAll('.primary-level-2-container a'), "isOpen");

  var secondaryNav = headerNavUi.querySelectorAll('.secondary-nav')[0];
  addClass(secondaryNav, 'hide');

  event.preventDefault();
}

// example for navigation menu
var navMenus = [
  {
    value: 'BUSINESS',
    subMenu: [
      {
        value: "Solutions",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Enterprise Programs",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Customer Success",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Company",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Resources",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
      {
        value: "Blog",
        subMenu: [
          { value: "All Solutions" },
          { value: "Apps" },
          { value: "Websites" },
          { value: "Product Design" },
          { value: "Development Tasks" },
          { value: "Analytics & Data Science" },
          { value: "Testing & QA" },
          { value: "How It Works" },
        ]
      },
    ]
  },
  {
    value: 'WORK',
    subMenu: [
      {
        value: "Design",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Development",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Data Science",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "QA",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Topcoder Open",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      }
    ]
  },
  {
    value: 'MORE',
    subMenu: [
      {
        value: "About Topcoder",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Contact Us",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Carreers",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Terms & Conditions",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Social",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Press Kits",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
      {
        value: "Partner Programs",
        subMenu: [
          { value: "Overview" },
          { value: "Work List" },
          { value: "Stats" },
          { value: "Problem archive" },
          { value: "Learn" },
          { value: "Topcoder Open" },
        ]
      },
    ]
  }
];
