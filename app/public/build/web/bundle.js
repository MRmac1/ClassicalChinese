/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/mr_mac1/Code/demo-projects/ClassicalChinese/app/public/src";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	console.log(
	'is this running in electron.js?: ',
	__webpack_require__(2)
	);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {function isRenderer () {
	  // running in a web browser
	  if (typeof process === 'undefined') return true

	  // node-integration is disabled
	  if (!process) return true

	  // We're in node.js somehow
	  if (!process.type) return false

	  return process.type === 'renderer'
	}

	module.exports = isRenderer()

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../process/browser.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))))

/***/ })
/******/ ]);