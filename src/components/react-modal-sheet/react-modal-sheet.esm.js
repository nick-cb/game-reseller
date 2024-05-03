import { useCallback, useEffect, useLayoutEffect, useRef, useState, createContext, useContext, createElement, forwardRef, useImperativeHandle, useMemo, Children, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { useMotionValue, useReducedMotion, useTransform, animate, motion, AnimatePresence } from 'framer-motion';
import { useLayoutEffect as useLayoutEffect$1, isIOS, chain, getScrollParent } from '@react-aria/utils';

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}

var MAX_HEIGHT = 'calc(100% - env(safe-area-inset-top) - 34px)';
var IS_SSR = typeof window === 'undefined';
var DEFAULT_TWEEN_CONFIG = {
  ease: 'easeOut',
  duration: 0.2
};
var REDUCED_MOTION_TWEEN_CONFIG = {
  ease: 'linear',
  duration: 0.01
};
var DRAG_CLOSE_THRESHOLD = 0.6;
var DRAG_VELOCITY_THRESHOLD = 500;

function getClosest(nums, goal) {
  var closest = nums[0];
  var minDifference = Math.abs(nums[0] - goal);
  for (var i = 1; i < nums.length; i++) {
    var difference = Math.abs(nums[i] - goal);
    if (difference < minDifference) {
      closest = nums[i];
      minDifference = difference;
    }
  }
  return closest;
}
function applyRootStyles(rootId) {
  var body = document.querySelector('body');
  var root = document.querySelector("#" + rootId);
  if (root) {
    var p = 24;
    var h = window.innerHeight;
    var s = (h - p) / h;
    body.style.backgroundColor = '#000';
    root.style.overflow = 'hidden';
    root.style.willChange = 'transform';
    root.style.transition = 'transform 200ms ease-in-out, border-radius 200ms linear';
    root.style.transform = "translateY(calc(env(safe-area-inset-top) + " + p / 2 + "px)) scale(" + s + ")"; // prettier-ignore
    root.style.borderTopRightRadius = '10px';
    root.style.borderTopLeftRadius = '10px';
  }
}
function cleanupRootStyles(rootId) {
  var body = document.querySelector('body');
  var root = document.getElementById(rootId);
  function onTransitionEnd() {
    root.style.removeProperty('overflow');
    root.style.removeProperty('will-change');
    root.style.removeProperty('transition');
    body.style.removeProperty('background-color');
    root.removeEventListener('transitionend', onTransitionEnd);
  }
  if (root) {
    // Start animating back
    root.style.removeProperty('border-top-right-radius');
    root.style.removeProperty('border-top-left-radius');
    root.style.removeProperty('transform');
    // Remove temp properties after animation is finished
    root.addEventListener('transitionend', onTransitionEnd);
  }
}
function inDescendingOrder(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i + 1] > arr[i]) return false;
  }
  return true;
}
function validateSnapTo(_ref) {
  var snapTo = _ref.snapTo,
    sheetHeight = _ref.sheetHeight;
  if (snapTo < 0) {
    console.warn("Snap point is out of bounds. Sheet height is " + sheetHeight + " but snap point is " + (sheetHeight + Math.abs(snapTo)) + ".");
  }
  return Math.max(Math.round(snapTo), 0);
}
function mergeRefs(refs) {
  return function (value) {
    refs.forEach(function (ref) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
  };
}
function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

var useIsomorphicLayoutEffect = IS_SSR ? useEffect : useLayoutEffect;
function useModalEffect(isOpen, rootId) {
  var prevOpen = usePrevious(isOpen);
  // Automatically apply the iOS modal effect to the body when sheet opens/closes
  useEffect(function () {
    if (rootId && !prevOpen && isOpen) {
      applyRootStyles(rootId);
    } else if (rootId && !isOpen && prevOpen) {
      cleanupRootStyles(rootId);
    }
  }, [isOpen, prevOpen]); // eslint-disable-line
  // Make sure to cleanup modal styles on unmount
  useEffect(function () {
    return function () {
      if (rootId && isOpen) cleanupRootStyles(rootId);
    };
  }, [isOpen]); // eslint-disable-line
}
function useEventCallbacks(isOpen, callbacks) {
  var prevOpen = usePrevious(isOpen);
  var didOpen = useRef(false);
  // Because of AnimatePrecence we don't have access to latest isOpen value
  // so we need to read and write to a ref to determine if we are
  // opening or closing the sheet
  var handleAnimationComplete = useCallback(function () {
    if (!didOpen.current) {
      callbacks.current.onOpenEnd == null || callbacks.current.onOpenEnd();
      didOpen.current = true;
    } else {
      callbacks.current.onCloseEnd == null || callbacks.current.onCloseEnd();
      didOpen.current = false;
    }
  }, [isOpen, prevOpen]); // eslint-disable-line
  useEffect(function () {
    if (!prevOpen && isOpen) {
      callbacks.current.onOpenStart == null || callbacks.current.onOpenStart();
    } else if (!isOpen && prevOpen) {
      callbacks.current.onCloseStart == null || callbacks.current.onCloseStart();
    }
  }, [isOpen, prevOpen]); // eslint-disable-line
  return {
    handleAnimationComplete: handleAnimationComplete
  };
}
function useWindowHeight() {
  var _React$useState = useState(0),
    windowHeight = _React$useState[0],
    setWindowHeight = _React$useState[1];
  useIsomorphicLayoutEffect(function () {
    var updateHeight = function updateHeight() {
      return setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', updateHeight);
    updateHeight();
    return function () {
      return window.removeEventListener('resize', updateHeight);
    };
  }, []);
  return windowHeight;
}
function usePrevious(state) {
  var ref = useRef();
  useEffect(function () {
    ref.current = state;
  });
  return ref.current;
}
// Userland version of the `useEvent` React hook:
// RFC: https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
function useEvent(handler) {
  var handlerRef = useRef();
  useIsomorphicLayoutEffect(function () {
    handlerRef.current = handler;
  });
  return useCallback(function () {
    var fn = handlerRef.current;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return fn == null ? void 0 : fn.apply(void 0, args);
  }, []);
}

var SheetContext = /*#__PURE__*/createContext(undefined);
var useSheetContext = function useSheetContext() {
  var context = useContext(SheetContext);
  if (!context) throw Error('Sheet context error');
  return context;
};
var SheetScrollerContext = /*#__PURE__*/createContext(undefined);
function SheetScrollerContextProvider(_ref) {
  var children = _ref.children;
  var sheetContext = useSheetContext();
  var _React$useState = useState(!!sheetContext.disableDrag),
    disableDrag = _React$useState[0],
    setDisableDrag = _React$useState[1];
  function setDragEnabled() {
    if (!sheetContext.disableDrag) setDisableDrag(false);
  }
  function setDragDisabled() {
    if (!disableDrag) setDisableDrag(true);
  }
  return createElement(SheetScrollerContext.Provider, {
    value: {
      disableDrag: disableDrag,
      setDragEnabled: setDragEnabled,
      setDragDisabled: setDragDisabled
    }
  }, children);
}
var useSheetScrollerContext = function useSheetScrollerContext() {
  var context = useContext(SheetScrollerContext);
  if (!context) throw Error('Sheet scroller context error');
  return context;
};

// Source: https://github.com/adobe/react-spectrum/blob/main/packages/@react-aria/overlays/src/usePreventScroll.ts
// @ts-ignore
var visualViewport = typeof window !== 'undefined' && window.visualViewport;
// HTML input types that do not cause the software keyboard to appear.
var nonTextInputTypes = /*#__PURE__*/new Set(['checkbox', 'radio', 'range', 'color', 'file', 'image', 'button', 'submit', 'reset']);
// The number of active usePreventScroll calls. Used to determine whether to revert back to the original page style/scroll position
var preventScrollCount = 0;
var restore;
/**
 * Prevents scrolling on the document body on mount, and
 * restores it on unmount. Also ensures that content does not
 * shift due to the scrollbars disappearing.
 */
function usePreventScroll(options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options,
    isDisabled = _options.isDisabled;
  useLayoutEffect$1(function () {
    if (isDisabled) {
      return;
    }
    preventScrollCount++;
    if (preventScrollCount === 1) {
      if (isIOS()) {
        restore = preventScrollMobileSafari();
      } else {
        restore = preventScrollStandard();
      }
    }
    return function () {
      preventScrollCount--;
      if (preventScrollCount === 0) {
        restore();
      }
    };
  }, [isDisabled]);
}
// For most browsers, all we need to do is set `overflow: hidden` on the root element, and
// add some padding to prevent the page from shifting when the scrollbar is hidden.
function preventScrollStandard() {
  return chain(setStyle(document.documentElement, 'paddingRight', window.innerWidth - document.documentElement.clientWidth + "px"), setStyle(document.documentElement, 'overflow', 'hidden'));
}
// Mobile Safari is a whole different beast. Even with overflow: hidden,
// it still scrolls the page in many situations:
//
// 1. When the bottom toolbar and address bar are collapsed, page scrolling is always allowed.
// 2. When the keyboard is visible, the viewport does not resize. Instead, the keyboard covers part of
//    it, so it becomes scrollable.
// 3. When tapping on an input, the page always scrolls so that the input is centered in the visual viewport.
//    This may cause even fixed position elements to scroll off the screen.
// 4. When using the next/previous buttons in the keyboard to navigate between inputs, the whole page always
//    scrolls, even if the input is inside a nested scrollable element that could be scrolled instead.
//
// In order to work around these cases, and prevent scrolling without jankiness, we do a few things:
//
// 1. Prevent default on `touchmove` events that are not in a scrollable element. This prevents touch scrolling
//    on the window.
// 2. Prevent default on `touchmove` events inside a scrollable element when the scroll position is at the
//    top or bottom. This avoids the whole page scrolling instead, but does prevent overscrolling.
// 3. Prevent default on `touchend` events on input elements and handle focusing the element ourselves.
// 4. When focusing an input, apply a transform to trick Safari into thinking the input is at the top
//    of the page, which prevents it from scrolling the page. After the input is focused, scroll the element
//    into view ourselves, without scrolling the whole page.
// 5. Offset the body by the scroll position using a negative margin and scroll to the top. This should appear the
//    same visually, but makes the actual scroll position always zero. This is required to make all of the
//    above work or Safari will still try to scroll the page when focusing an input.
// 6. As a last resort, handle window scroll events, and scroll back to the top. This can happen when attempting
//    to navigate to an input with the next/previous buttons that's outside a modal.
function preventScrollMobileSafari() {
  var scrollable;
  var lastY = 0;
  var onTouchStart = function onTouchStart(e) {
    // Store the nearest scrollable parent element from the element that the user touched.
    scrollable = getScrollParent(e.target);
    if (scrollable === document.documentElement && scrollable === document.body) {
      return;
    }
    lastY = e.changedTouches[0].pageY;
  };
  var onTouchMove = function onTouchMove(e) {
    // Prevent scrolling the window.
    if (scrollable === document.documentElement || scrollable === document.body) {
      e.preventDefault();
      return;
    }
    // Prevent scrolling up when at the top and scrolling down when at the bottom
    // of a nested scrollable area, otherwise mobile Safari will start scrolling
    // the window instead. Unfortunately, this disables bounce scrolling when at
    // the top but it's the best we can do.
    var y = e.changedTouches[0].pageY;
    var scrollTop = scrollable.scrollTop;
    var bottom = scrollable.scrollHeight - scrollable.clientHeight;
    // Fix for: https://github.com/adobe/react-spectrum/pull/3780/files
    if (bottom === 0) {
      return;
    }
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  };
  var onTouchEnd = function onTouchEnd(e) {
    var target = e.target;
    // Apply this change if we're not already focused on the target element
    if (willOpenKeyboard(target) && target !== document.activeElement) {
      e.preventDefault();
      // Apply a transform to trick Safari into thinking the input is at the top of the page
      // so it doesn't try to scroll it into view. When tapping on an input, this needs to
      // be done before the "focus" event, so we have to focus the element ourselves.
      target.style.transform = 'translateY(-2000px)';
      target.focus();
      requestAnimationFrame(function () {
        target.style.transform = '';
      });
    }
  };
  var onFocus = function onFocus(e) {
    var target = e.target;
    if (willOpenKeyboard(target)) {
      // Transform also needs to be applied in the focus event in cases where focus moves
      // other than tapping on an input directly, e.g. the next/previous buttons in the
      // software keyboard. In these cases, it seems applying the transform in the focus event
      // is good enough, whereas when tapping an input, it must be done before the focus event. 🤷‍♂️
      target.style.transform = 'translateY(-2000px)';
      requestAnimationFrame(function () {
        target.style.transform = '';
        // This will have prevented the browser from scrolling the focused element into view,
        // so we need to do this ourselves in a way that doesn't cause the whole page to scroll.
        if (visualViewport) {
          if (visualViewport.height < window.innerHeight) {
            // If the keyboard is already visible, do this after one additional frame
            // to wait for the transform to be removed.
            requestAnimationFrame(function () {
              scrollIntoView(target);
            });
          } else {
            // Otherwise, wait for the visual viewport to resize before scrolling so we can
            // measure the correct position to scroll to.
            visualViewport.addEventListener('resize', function () {
              return scrollIntoView(target);
            }, {
              once: true
            });
          }
        }
      });
    }
  };
  var onWindowScroll = function onWindowScroll() {
    // Last resort. If the window scrolled, scroll it back to the top.
    // It should always be at the top because the body will have a negative margin (see below).
    window.scrollTo(0, 0);
  };
  // Record the original scroll position so we can restore it.
  // Then apply a negative margin to the body to offset it by the scroll position. This will
  // enable us to scroll the window to the top, which is required for the rest of this to work.
  var scrollX = window.pageXOffset;
  var scrollY = window.pageYOffset;
  var restoreStyles = chain(setStyle(document.documentElement, 'paddingRight', window.innerWidth - document.documentElement.clientWidth + "px"), setStyle(document.documentElement, 'overflow', 'hidden'), setStyle(document.body, 'marginTop', "-" + scrollY + "px"));
  // Scroll to the top. The negative margin on the body will make this appear the same.
  window.scrollTo(0, 0);
  var removeEvents = chain(addEvent(document, 'touchstart', onTouchStart, {
    passive: false,
    capture: true
  }), addEvent(document, 'touchmove', onTouchMove, {
    passive: false,
    capture: true
  }), addEvent(document, 'touchend', onTouchEnd, {
    passive: false,
    capture: true
  }), addEvent(document, 'focus', onFocus, true), addEvent(window, 'scroll', onWindowScroll));
  return function () {
    // Restore styles and scroll the page back to where it was.
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
// Sets a CSS property on an element, and returns a function to revert it to the previous value.
function setStyle(element, style, value) {
  var cur = element.style[style];
  element.style[style] = value;
  return function () {
    element.style[style] = cur;
  };
}
// Adds an event listener to an element, and returns a function to remove it.
function addEvent(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return function () {
    target.removeEventListener(event, handler, options);
  };
}
function scrollIntoView(target) {
  var root = document.scrollingElement || document.documentElement;
  while (target && target !== root) {
    // Find the parent scrollable element and adjust the scroll position if the target is not already in view.
    var scrollable = getScrollParent(target);
    if (scrollable !== document.documentElement && scrollable !== document.body && scrollable !== target) {
      var scrollableTop = scrollable.getBoundingClientRect().top;
      var targetTop = target.getBoundingClientRect().top;
      if (targetTop > scrollableTop + target.clientHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
function willOpenKeyboard(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}

var styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  backdrop: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    touchAction: 'none',
    border: 'none'
  },
  container: {
    zIndex: 2,
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: '8px',
    borderTopLeftRadius: '8px',
    boxShadow: '0px -2px 16px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    pointerEvents: 'auto'
  },
  headerWrapper: {
    width: '100%'
  },
  header: {
    height: '40px',
    width: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicator: {
    width: '18px',
    height: '4px',
    borderRadius: '99px',
    backgroundColor: '#ddd'
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '0px',
    position: 'relative'
  },
  scroller: {
    height: '100%',
    overflowY: 'auto'
  }
};

var _excluded = ["onOpenStart", "onOpenEnd", "onClose", "onCloseStart", "onCloseEnd", "onSnap", "children", "isOpen", "snapPoints", "rootId", "mountPoint", "style", "detent", "initialSnap", "disableDrag", "prefersReducedMotion", "tweenConfig", "dragVelocityThreshold", "dragCloseThreshold"];
var Sheet = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var onOpenStart = _ref.onOpenStart,
    onOpenEnd = _ref.onOpenEnd,
    onClose = _ref.onClose,
    onCloseStart = _ref.onCloseStart,
    onCloseEnd = _ref.onCloseEnd,
    onSnap = _ref.onSnap,
    children = _ref.children,
    isOpen = _ref.isOpen,
    snapPoints = _ref.snapPoints,
    rootId = _ref.rootId,
    mountPoint = _ref.mountPoint,
    style = _ref.style,
    _ref$detent = _ref.detent,
    detent = _ref$detent === void 0 ? 'full-height' : _ref$detent,
    _ref$initialSnap = _ref.initialSnap,
    initialSnap = _ref$initialSnap === void 0 ? 0 : _ref$initialSnap,
    _ref$disableDrag = _ref.disableDrag,
    disableDrag = _ref$disableDrag === void 0 ? false : _ref$disableDrag,
    _ref$prefersReducedMo = _ref.prefersReducedMotion,
    prefersReducedMotion = _ref$prefersReducedMo === void 0 ? false : _ref$prefersReducedMo,
    _ref$tweenConfig = _ref.tweenConfig,
    tweenConfig = _ref$tweenConfig === void 0 ? DEFAULT_TWEEN_CONFIG : _ref$tweenConfig,
    _ref$dragVelocityThre = _ref.dragVelocityThreshold,
    dragVelocityThreshold = _ref$dragVelocityThre === void 0 ? DRAG_VELOCITY_THRESHOLD : _ref$dragVelocityThre,
    _ref$dragCloseThresho = _ref.dragCloseThreshold,
    dragCloseThreshold = _ref$dragCloseThresho === void 0 ? DRAG_CLOSE_THRESHOLD : _ref$dragCloseThresho,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded);
  var sheetRef = useRef(null);
  var indicatorRotation = useMotionValue(0);
  var windowHeight = useWindowHeight();
  var shouldReduceMotion = useReducedMotion();
  var reduceMotion = Boolean(prefersReducedMotion || shouldReduceMotion);
  var animationOptions = _extends({
    type: 'tween'
  }, reduceMotion ? REDUCED_MOTION_TWEEN_CONFIG : tweenConfig);
  // NOTE: the inital value for `y` doesn't matter since it is overwritten by
  // the value driven by the `AnimatePresence` component when the sheet is opened
  // and after that it is driven by the gestures and/or snapping
  var y = useMotionValue(0);
  var zIndex = useTransform(y, function (value) {
    return value >= windowHeight ? -1 : 9999999;
  });
  var visibility = useTransform(y, function (value) {
    return value >= windowHeight ? 'hidden' : 'visible';
  });
  // Keep the callback fns up-to-date so that they can be accessed inside
  // the effect without including them to the dependencies array
  var callbacks = useRef({
    onOpenStart: onOpenStart,
    onOpenEnd: onOpenEnd,
    onCloseStart: onCloseStart,
    onCloseEnd: onCloseEnd
  });
  useIsomorphicLayoutEffect(function () {
    callbacks.current = {
      onOpenStart: onOpenStart,
      onOpenEnd: onOpenEnd,
      onCloseStart: onCloseStart,
      onCloseEnd: onCloseEnd
    };
  });
  if (snapPoints) {
    // Convert negative / percentage snap points to absolute values
    snapPoints = snapPoints.map(function (point) {
      // Percentage values e.g. between 0.0 and 1.0
      if (point > 0 && point <= 1) return Math.round(point * windowHeight);
      return point < 0 ? windowHeight + point : point; // negative values
    });
    console.assert(inDescendingOrder(snapPoints) || windowHeight === 0, "Snap points need to be in descending order got: [" + snapPoints + "]");
  }
  var onDrag = useEvent(function (_, _ref2) {
    var delta = _ref2.delta;
    // Update drag indicator rotation based on drag velocity
    var velocity = y.getVelocity();
    if (velocity > 0) indicatorRotation.set(10);
    if (velocity < 0) indicatorRotation.set(-10);
    // Make sure user cannot drag beyond the top of the sheet
    y.set(Math.max(y.get() + delta.y, 0));
  });
  var onDragEnd = useEvent(function (_, _ref3) {
    var velocity = _ref3.velocity;
    if (velocity.y > dragVelocityThreshold) {
      // User flicked the sheet down
      onClose();
    } else {
      var sheetEl = sheetRef.current;
      var sheetHeight = sheetEl.getBoundingClientRect().height;
      var currentY = y.get();
      var snapTo = 0;
      if (snapPoints) {
        var snapToValues = snapPoints.map(function (p) {
          return sheetHeight - Math.min(p, sheetHeight);
        });
        // Allow snapping to the top of the sheet if detent is set to `content-height`
        if (detent === 'content-height' && !snapToValues.includes(0)) {
          snapToValues.unshift(0);
        }
        // Get the closest snap point
        snapTo = getClosest(snapToValues, currentY);
      } else if (currentY / sheetHeight > dragCloseThreshold) {
        // Close if dragged over enough far
        snapTo = sheetHeight;
      }
      snapTo = validateSnapTo({
        snapTo: snapTo,
        sheetHeight: sheetHeight
      });
      // Update the spring value so that the sheet is animated to the snap point
      animate(y, snapTo, animationOptions);
      if (snapPoints && onSnap) {
        var snapValue = Math.abs(Math.round(snapPoints[0] - snapTo));
        var snapIndex = snapPoints.indexOf(getClosest(snapPoints, snapValue)); // prettier-ignore
        onSnap(snapIndex);
      }
      var roundedSheetHeight = Math.round(sheetHeight);
      var shouldClose = snapTo >= roundedSheetHeight;
      if (shouldClose) onClose();
    }
    // Reset indicator rotation after dragging
    indicatorRotation.set(0);
  });
  // Trigger onSnap callback when sheet is opened or closed
  useEffect(function () {
    if (!snapPoints || !onSnap) return;
    var snapIndex = isOpen ? initialSnap : snapPoints.length - 1;
    onSnap(snapIndex);
  }, [isOpen]); // eslint-disable-line
  useImperativeHandle(ref, function () {
    return {
      y: y,
      snapTo: function snapTo(snapIndex) {
        var sheetEl = sheetRef.current;
        if (snapPoints && snapPoints[snapIndex] !== undefined && sheetEl !== null) {
          var sheetHeight = sheetEl.getBoundingClientRect().height;
          var snapPoint = snapPoints[snapIndex];
          var snapTo = validateSnapTo({
            snapTo: sheetHeight - snapPoint,
            sheetHeight: sheetHeight
          });
          animate(y, snapTo, animationOptions);
          if (onSnap) onSnap(snapIndex);
          if (snapTo >= sheetHeight) onClose();
        }
      }
    };
  });
  useModalEffect(isOpen, rootId);
  // Framer Motion should handle body scroll locking but it's not working
  // properly on iOS. Scroll locking from React Aria seems to work much better.
  usePreventScroll({
    isDisabled: !isOpen
  });
  var dragProps = useMemo(function () {
    var dragProps = {
      drag: 'y',
      dragElastic: 0,
      dragConstraints: {
        top: 0,
        bottom: 0
      },
      dragMomentum: false,
      dragPropagation: false,
      onDrag: onDrag,
      onDragEnd: onDragEnd
    };
    return disableDrag ? undefined : dragProps;
  }, [disableDrag]); // eslint-disable-line
  var context = {
    y: y,
    sheetRef: sheetRef,
    isOpen: isOpen,
    initialSnap: initialSnap,
    snapPoints: snapPoints,
    detent: detent,
    indicatorRotation: indicatorRotation,
    callbacks: callbacks,
    dragProps: dragProps,
    windowHeight: windowHeight,
    animationOptions: animationOptions,
    reduceMotion: reduceMotion,
    disableDrag: disableDrag
  };
  var sheet = createElement(SheetContext.Provider, {
    value: context
  }, createElement(motion.div, Object.assign({}, rest, {
    ref: ref,
    style: _extends({}, styles.wrapper, {
      zIndex: zIndex,
      visibility: visibility
    }, style)
  }), createElement(AnimatePresence, null, isOpen ? createElement(SheetScrollerContextProvider, null, Children.map(children, function (child, i) {
    return cloneElement(child, {
      key: "sheet-child-" + i
    });
  })) : null)));
  if (IS_SSR) return sheet;
  // @ts-ignore
  return createPortal(sheet, mountPoint != null ? mountPoint : document.body);
});

var _excluded$1 = ["children", "style", "className"];
var SheetContainer = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var children = _ref.children,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$1);
  var _useSheetContext = useSheetContext(),
    y = _useSheetContext.y,
    isOpen = _useSheetContext.isOpen,
    callbacks = _useSheetContext.callbacks,
    snapPoints = _useSheetContext.snapPoints,
    _useSheetContext$init = _useSheetContext.initialSnap,
    initialSnap = _useSheetContext$init === void 0 ? 0 : _useSheetContext$init,
    sheetRef = _useSheetContext.sheetRef,
    windowHeight = _useSheetContext.windowHeight,
    detent = _useSheetContext.detent,
    animationOptions = _useSheetContext.animationOptions,
    reduceMotion = _useSheetContext.reduceMotion;
  var _useEventCallbacks = useEventCallbacks(isOpen, callbacks),
    handleAnimationComplete = _useEventCallbacks.handleAnimationComplete;
  var initialY = snapPoints ? snapPoints[0] - snapPoints[initialSnap] : 0;
  var maxSnapHeight = snapPoints ? snapPoints[0] : null;
  var height = maxSnapHeight !== null ? "min(" + maxSnapHeight + "px, " + MAX_HEIGHT + ")" : MAX_HEIGHT;
  return createElement(motion.div, Object.assign({}, rest, {
    ref: mergeRefs([sheetRef, ref]),
    className: "react-modal-sheet-container " + className,
    style: _extends({}, styles.container, style, detent === 'full-height' && {
      height: height
    }, detent === 'content-height' && {
      maxHeight: height
    }, {
      y: y
    }),
    initial: reduceMotion ? false : {
      y: windowHeight
    },
    animate: {
      y: initialY,
      transition: animationOptions
    },
    exit: {
      y: windowHeight,
      transition: animationOptions
    },
    onAnimationComplete: handleAnimationComplete
  }), children);
});

var _excluded$2 = ["children", "style", "disableDrag", "className"];
var SheetContent = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var children = _ref.children,
    style = _ref.style,
    disableDrag = _ref.disableDrag,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$2);
  var sheetContext = useSheetContext();
  var sheetScrollerContext = useSheetScrollerContext();
  var dragProps = disableDrag || sheetScrollerContext.disableDrag ? undefined : sheetContext.dragProps;
  return createElement(motion.div, Object.assign({}, rest, {
    ref: ref,
    className: "react-modal-sheet-content " + className,
    style: _extends({}, styles.content, style)
  }, dragProps), children);
});

var _excluded$3 = ["children", "style", "disableDrag"];
var SheetHeader = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var children = _ref.children,
    style = _ref.style,
    disableDrag = _ref.disableDrag,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$3);
  var _useSheetContext = useSheetContext(),
    indicatorRotation = _useSheetContext.indicatorRotation,
    dragProps = _useSheetContext.dragProps;
  var _dragProps = disableDrag ? undefined : dragProps;
  var indicator1Transform = useTransform(indicatorRotation, function (r) {
    return "translateX(2px) rotate(" + r + "deg)";
  });
  var indicator2Transform = useTransform(indicatorRotation, function (r) {
    return "translateX(-2px) rotate(" + -1 * r + "deg)";
  });
  return createElement(motion.div, Object.assign({}, rest, {
    ref: ref,
    style: _extends({}, styles.headerWrapper, style)
  }, _dragProps), children || createElement("div", {
    className: "react-modal-sheet-header",
    style: styles.header
  }, createElement(motion.span, {
    className: "react-modal-sheet-drag-indicator",
    style: _extends({}, styles.indicator, {
      transform: indicator1Transform
    })
  }), createElement(motion.span, {
    className: "react-modal-sheet-drag-indicator",
    style: _extends({}, styles.indicator, {
      transform: indicator2Transform
    })
  })));
});

var _excluded$4 = ["style", "className"];
var isClickable = function isClickable(props) {
  return !!props.onClick || !!props.onTap;
};
var SheetBackdrop = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$4);
  var Comp = isClickable(rest) ? motion.button : motion.div;
  var pointerEvents = isClickable(rest) ? 'auto' : 'none';
  return createElement(Comp, Object.assign({}, rest, {
    ref: ref,
    className: "react-modal-sheet-backdrop " + className,
    style: _extends({}, styles.backdrop, style, {
      pointerEvents: pointerEvents
    }),
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  }));
});

var _excluded$5 = ["draggableAt", "children", "style", "className"];
var SheetScroller = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _ref$draggableAt = _ref.draggableAt,
    draggableAt = _ref$draggableAt === void 0 ? 'top' : _ref$draggableAt,
    children = _ref.children,
    style = _ref.style,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded$5);
  var sheetScrollerContext = useSheetScrollerContext();
  function determineDragState(element) {
    var scrollTop = element.scrollTop,
      scrollHeight = element.scrollHeight,
      clientHeight = element.clientHeight;
    var isScrollable = scrollHeight > clientHeight;
    if (!isScrollable) return;
    var isAtTop = scrollTop <= 0;
    var isAtBottom = scrollHeight - scrollTop === clientHeight;
    var shouldEnable = draggableAt === 'top' && isAtTop || draggableAt === 'bottom' && isAtBottom || draggableAt === 'both' && (isAtTop || isAtBottom);
    if (shouldEnable) {
      sheetScrollerContext.setDragEnabled();
    } else {
      sheetScrollerContext.setDragDisabled();
    }
  }
  function onScroll(e) {
    determineDragState(e.currentTarget);
  }
  function onTouchStart(e) {
    determineDragState(e.currentTarget);
  }
  var scrollProps = isTouchDevice() ? {
    onScroll: onScroll,
    onTouchStart: onTouchStart
  } : undefined;
  return createElement("div", Object.assign({}, rest, {
    ref: ref,
    className: "react-modal-sheet-scroller " + className,
    style: _extends({}, styles.scroller, style)
  }, scrollProps), children);
});

// HACK: this is needed to get the typing to work properly...
var _SheetCompound = Sheet;
_SheetCompound.Container = SheetContainer;
_SheetCompound.Header = SheetHeader;
_SheetCompound.Content = SheetContent;
_SheetCompound.Backdrop = SheetBackdrop;
_SheetCompound.Scroller = SheetScroller;

export default _SheetCompound;
//# sourceMappingURL=react-modal-sheet.esm.js.map
