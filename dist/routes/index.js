'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ncAction = ncAction;
exports.sdrAction = sdrAction;
exports.spdAction = spdAction;
exports.stcAction = stcAction;
exports.titleCase = titleCase;
var _whatsapp = _interopRequireDefault(require("../config/whatsapp"));
var _db = _interopRequireDefault(require("../config/db"));
var _testWaCallbackUrl = _interopRequireDefault(require("../helpers/testWaCallbackUrl"));
var _getRate = _interopRequireDefault(require("../functions/getRate"));
var _selectDestination = _interopRequireDefault(require("../functions/getRate/selectDestination"));
var _selectPickup = _interopRequireDefault(require("../functions/getRate/selectPickup"));
var _selectContainerType = _interopRequireDefault(require("../functions/getRate/selectContainerType"));
var _selectContainerNum = _interopRequireDefault(require("../functions/getRate/selectContainerNum"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var router = require('express').Router();
router.get('/meta_wa_callbackurl', function (req, res) {
  try {
    (0, _testWaCallbackUrl["default"])(req, res);
  } catch (error) {
    console.error({
      error: error
    });
    return res.sendStatus(500);
  }
});
router.post('/meta_wa_callbackurl', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var data, _incomingMessage$text, incomingMessage, recipientPhone, recipientName, typeOfMsg, message_id, textMessage;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log('POST: Someone is pinging me!');
          _context.prev = 1;
          data = _whatsapp["default"].parseMessage(req.body);
          console.log('dataxx', data);
          // console.log('req.body', req.body.entry[0].changes)
          // data.notificationMessage && console.log("CONVERSATIONXX", data.notificationMessage.conversation.origin )
          if (!(data !== null && data !== void 0 && data.isMessage)) {
            _context.next = 28;
            break;
          }
          incomingMessage = data.message;
          recipientPhone = incomingMessage.from.phone; // extract the phone number of sender
          recipientName = incomingMessage.from.name;
          typeOfMsg = incomingMessage.type; // extract the type of message (some are text, others are images, others are responses to buttons etc...)
          message_id = incomingMessage.message_id; // extract the message id
          textMessage = (_incomingMessage$text = incomingMessage.text) === null || _incomingMessage$text === void 0 ? void 0 : _incomingMessage$text.body; // extract text message body
          // if msg === "hi" ///////////////////////////////////////////////////////////////
          if (!(textMessage && ['hi', 'hello'].includes(textMessage.trim().toLowerCase()))) {
            _context.next = 18;
            break;
          }
          _db["default"].query("INSERT INTO whatsapp_cloud (phone_no, username) VALUES ('".concat(recipientPhone, "', '").concat(recipientName, "');"), function (err, res, fields) {
            if (err) {
              _db["default"].query("UPDATE whatsapp_cloud SET latest_question = 'new' WHERE phone_no = '".concat(recipientPhone, "';"), function (err, res, fields) {
                if (err) throw err;
              });
            }
          });
          _context.next = 15;
          return _whatsapp["default"].sendSimpleButtons({
            message: "Welcome to CAS BROKER, ".concat(recipientName, ".\nWhat do you want to do?"),
            recipientPhone: recipientPhone,
            listOfButtons: [{
              title: 'Get rate',
              id: 'get_rate'
            }
            // {
            //   title: "Find load",
            //   id: "find_load",
            // },
            // {
            //   title: "Speak to a human",
            //   id: "speak_to_human",
            // },
            ]
          });
        case 15:
          _context.next = 17;
          return _whatsapp["default"].markMessageAsRead({
            message_id: message_id
          });
        case 17:
          return _context.abrupt("return", res.sendStatus(200));
        case 18:
          _context.next = 20;
          return (0, _getRate["default"])(typeOfMsg, incomingMessage.button_reply.id, recipientPhone, message_id, res);
        case 20:
          _context.next = 22;
          return (0, _selectDestination["default"])(recipientPhone, textMessage, res, message_id);
        case 22:
          _context.next = 24;
          return (0, _selectPickup["default"])(recipientPhone, textMessage, message_id, res);
        case 24:
          _context.next = 26;
          return (0, _selectContainerType["default"])(typeOfMsg, incomingMessage, recipientPhone, message_id, res);
        case 26:
          _context.next = 28;
          return (0, _selectContainerNum["default"])(recipientPhone, textMessage, message_id, res);
        case 28:
          return _context.abrupt("return", res.sendStatus(200));
        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](1);
          console.error({
            error: _context.t0
          });
          return _context.abrupt("return", res.sendStatus(500));
        case 35:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 31]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
function sdrAction(message, recipientPhone) {
  var flag = 0;
  _db["default"].query("UPDATE whatsapp_cloud SET destination_region = '".concat(message, "' WHERE phone_no = '").concat(recipientPhone, "';"), function (err, res, fields) {
    if (err) flag = 1;
  });
  _db["default"].query("UPDATE whatsapp_cloud SET latest_question = 'select pickup destination' WHERE phone_no = '".concat(recipientPhone, "';"), function (err, res, fields) {
    if (err) flag = 1;
  });
  return !Boolean(flag);
}
function spdAction(message, recipientPhone) {
  var flag = 0;
  _db["default"].query("SELECT destination_region FROM whatsapp_cloud WHERE phone_no = '".concat(recipientPhone, "'"), /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(err, rows, fields) {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!err) {
              _context3.next = 2;
              break;
            }
            throw err;
          case 2:
            _db["default"].query("SELECT name FROM destinationrates WHERE region_id = '".concat(rows[0].destination_region, "'"), /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(err, rows, fields) {
                var pickups, i;
                return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                  while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!err) {
                        _context2.next = 2;
                        break;
                      }
                      throw err;
                    case 2:
                      pickups = ['_'];
                      for (i = 0; i < rows.length; i++) {
                        pickups.push(rows[i].name);
                      }
                      _db["default"].query("UPDATE whatsapp_cloud SET pickup_destination = '".concat(pickups[message], "' WHERE phone_no = '").concat(recipientPhone, "';"), function (err, res, fields) {
                        if (err) flag = 1;
                      });
                    case 5:
                    case "end":
                      return _context2.stop();
                  }
                }, _callee2);
              }));
              return function (_x6, _x7, _x8) {
                return _ref3.apply(this, arguments);
              };
            }());
            _db["default"].query("UPDATE whatsapp_cloud SET latest_question = 'select type of container' WHERE phone_no = '".concat(recipientPhone, "';"), function (err, res, fields) {
              if (err) flag = 1;
            });
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }());
  return !Boolean(flag);
}
function stcAction(message, recipientPhone) {
  var flag = 0;
  _db["default"].query("UPDATE whatsapp_cloud SET container_type = '".concat(message, "' WHERE phone_no = '").concat(recipientPhone, "';"), function (err, res, fields) {
    if (err) flag = 1;
  });
  _db["default"].query("UPDATE whatsapp_cloud SET latest_question = 'number of containers' WHERE phone_no = '".concat(recipientPhone, "';"), function (err, res, fields) {
    if (err) flag = 1;
  });
  return !Boolean(flag);
}
function ncAction(message, recipientPhone) {
  var flag = 0;
  var no_of_container = message;
  _db["default"].query("UPDATE whatsapp_cloud SET no_of_container = '".concat(no_of_container, "' WHERE phone_no = '").concat(recipientPhone, "';"), function (err, res, fields) {
    if (err) flag = 1;
  });
  _db["default"].query("UPDATE whatsapp_cloud SET latest_question = 'new' WHERE phone_no = '".concat(recipientPhone, "';"), function (err, res, fields) {
    if (err) flag = 1;
  });

  // calc rate
  _db["default"].query("SELECT * FROM whatsapp_cloud WHERE phone_no = '".concat(recipientPhone, "'"), /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(err, rows, fields) {
      var container_type, destination_region, pickup_destination;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (!err) {
              _context6.next = 2;
              break;
            }
            throw err;
          case 2:
            container_type = rows[0].container_type;
            destination_region = rows[0].destination_region;
            pickup_destination = rows[0].pickup_destination;
            if (container_type === 'container_20') {
              _db["default"].query("SELECT rate_twenty FROM destinationrates WHERE region_id = '".concat(destination_region, "' AND name = '").concat(pickup_destination, "'"), /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(err, rows, fields) {
                  var rate;
                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                    while (1) switch (_context4.prev = _context4.next) {
                      case 0:
                        if (!err) {
                          _context4.next = 2;
                          break;
                        }
                        throw err;
                      case 2:
                        rate = rows[0].rate_twenty * no_of_container;
                        _context4.next = 5;
                        return _whatsapp["default"].sendText({
                          recipientPhone: recipientPhone,
                          message: "The rate is: GHC ".concat(rate)
                        });
                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }, _callee4);
                }));
                return function (_x12, _x13, _x14) {
                  return _ref5.apply(this, arguments);
                };
              }());
            }
            if (container_type === 'container_40') {
              _db["default"].query("SELECT rate_forty FROM destinationrates WHERE region_id = '".concat(destination_region, "' AND name = '").concat(pickup_destination, "'"), /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(err, rows, fields) {
                  var rate;
                  return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                    while (1) switch (_context5.prev = _context5.next) {
                      case 0:
                        if (!err) {
                          _context5.next = 2;
                          break;
                        }
                        throw err;
                      case 2:
                        rate = rows[0].rate_forty * no_of_container;
                        _context5.next = 5;
                        return _whatsapp["default"].sendText({
                          recipientPhone: recipientPhone,
                          message: "The rate is: GHC ".concat(rate)
                        });
                      case 5:
                      case "end":
                        return _context5.stop();
                    }
                  }, _callee5);
                }));
                return function (_x15, _x16, _x17) {
                  return _ref6.apply(this, arguments);
                };
              }());
            }
          case 7:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }));
    return function (_x9, _x10, _x11) {
      return _ref4.apply(this, arguments);
    };
  }());
  return !Boolean(flag);
}
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}
module.exports = router;
//# sourceMappingURL=index.js.map