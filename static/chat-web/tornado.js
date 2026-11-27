function rg(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var _s = { exports: {} }, Me = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Fd;
function fg() {
  if (Fd) return Me;
  Fd = 1;
  var s = Symbol.for("react.transitional.element"), d = Symbol.for("react.portal"), y = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), j = Symbol.for("react.consumer"), Z = Symbol.for("react.context"), V = Symbol.for("react.forward_ref"), L = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), g = Symbol.for("react.activity"), z = Symbol.for("react.view_transition"), D = Symbol.iterator;
  function K(h) {
    return h === null || typeof h != "object" ? null : (h = D && h[D] || h["@@iterator"], typeof h == "function" ? h : null);
  }
  var re = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, X = Object.assign, J = {};
  function $(h, B, I) {
    this.props = h, this.context = B, this.refs = J, this.updater = I || re;
  }
  $.prototype.isReactComponent = {}, $.prototype.setState = function(h, B) {
    if (typeof h != "object" && typeof h != "function" && h != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, h, B, "setState");
  }, $.prototype.forceUpdate = function(h) {
    this.updater.enqueueForceUpdate(this, h, "forceUpdate");
  };
  function ve() {
  }
  ve.prototype = $.prototype;
  function ae(h, B, I) {
    this.props = h, this.context = B, this.refs = J, this.updater = I || re;
  }
  var Oe = ae.prototype = new ve();
  Oe.constructor = ae, X(Oe, $.prototype), Oe.isPureReactComponent = !0;
  var Q = Array.isArray;
  function k() {
  }
  var ge = { H: null, A: null, T: null, S: null }, it = Object.prototype.hasOwnProperty;
  function Fe(h, B, I) {
    var te = I.ref;
    return {
      $$typeof: s,
      type: h,
      key: B,
      ref: te !== void 0 ? te : null,
      props: I
    };
  }
  function Ve(h, B) {
    return Fe(h.type, B, h.props);
  }
  function he(h) {
    return typeof h == "object" && h !== null && h.$$typeof === s;
  }
  function rt(h) {
    var B = { "=": "=0", ":": "=2" };
    return "$" + h.replace(/[=:]/g, function(I) {
      return B[I];
    });
  }
  var Et = /\/+/g;
  function Ze(h, B) {
    return typeof h == "object" && h !== null && h.key != null ? rt("" + h.key) : B.toString(36);
  }
  function M(h) {
    switch (h.status) {
      case "fulfilled":
        return h.value;
      case "rejected":
        throw h.reason;
      default:
        switch (typeof h.status == "string" ? h.then(k, k) : (h.status = "pending", h.then(
          function(B) {
            h.status === "pending" && (h.status = "fulfilled", h.value = B);
          },
          function(B) {
            h.status === "pending" && (h.status = "rejected", h.reason = B);
          }
        )), h.status) {
          case "fulfilled":
            return h.value;
          case "rejected":
            throw h.reason;
        }
    }
    throw h;
  }
  function G(h, B, I, te, Ce) {
    var Ue = typeof h;
    (Ue === "undefined" || Ue === "boolean") && (h = null);
    var Ae = !1;
    if (h === null) Ae = !0;
    else
      switch (Ue) {
        case "bigint":
        case "string":
        case "number":
          Ae = !0;
          break;
        case "object":
          switch (h.$$typeof) {
            case s:
            case d:
              Ae = !0;
              break;
            case O:
              return Ae = h._init, G(
                Ae(h._payload),
                B,
                I,
                te,
                Ce
              );
          }
      }
    if (Ae)
      return Ce = Ce(h), Ae = te === "" ? "." + Ze(h, 0) : te, Q(Ce) ? (I = "", Ae != null && (I = Ae.replace(Et, "$&/") + "/"), G(Ce, B, I, "", function(Mt) {
        return Mt;
      })) : Ce != null && (he(Ce) && (Ce = Ve(
        Ce,
        I + (Ce.key == null || h && h.key === Ce.key ? "" : ("" + Ce.key).replace(
          Et,
          "$&/"
        ) + "/") + Ae
      )), B.push(Ce)), 1;
    Ae = 0;
    var ne = te === "" ? "." : te + ":";
    if (Q(h))
      for (var fe = 0; fe < h.length; fe++)
        te = h[fe], Ue = ne + Ze(te, fe), Ae += G(
          te,
          B,
          I,
          Ue,
          Ce
        );
    else if (fe = K(h), typeof fe == "function")
      for (h = fe.call(h), fe = 0; !(te = h.next()).done; )
        te = te.value, Ue = ne + Ze(te, fe++), Ae += G(
          te,
          B,
          I,
          Ue,
          Ce
        );
    else if (Ue === "object") {
      if (typeof h.then == "function")
        return G(
          M(h),
          B,
          I,
          te,
          Ce
        );
      throw B = String(h), Error(
        "Objects are not valid as a React child (found: " + (B === "[object Object]" ? "object with keys {" + Object.keys(h).join(", ") + "}" : B) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return Ae;
  }
  function R(h, B, I) {
    if (h == null) return h;
    var te = [], Ce = 0;
    return G(h, te, "", "", function(Ue) {
      return B.call(I, Ue, Ce++);
    }), te;
  }
  function Ee(h) {
    if (h._status === -1) {
      var B = h._result, I = B();
      I.then(
        function(te) {
          (h._status === 0 || h._status === -1) && (h._status = 1, h._result = te, I.status === void 0 && (I.status = "fulfilled", I.value = te));
        },
        function(te) {
          (h._status === 0 || h._status === -1) && (h._status = 2, h._result = te, I.status === void 0 && (I.status = "rejected", I.reason = te));
        }
      ), h._status === -1 && (h._status = 0, h._result = I);
    }
    if (h._status === 1) return h._result.default;
    throw h._result;
  }
  var ze = typeof reportError == "function" ? reportError : function(h) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var B = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h),
        error: h
      });
      if (!window.dispatchEvent(B)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", h);
      return;
    }
    console.error(h);
  };
  function wt(h) {
    var B = ge.T, I = {};
    I.types = B !== null ? B.types : null, ge.T = I;
    try {
      var te = h(), Ce = ge.S;
      Ce !== null && Ce(I, te), typeof te == "object" && te !== null && typeof te.then == "function" && te.then(k, ze);
    } catch (Ue) {
      ze(Ue);
    } finally {
      B !== null && I.types !== null && (B.types = I.types), ge.T = B;
    }
  }
  function vt(h) {
    var B = ge.T;
    if (B !== null) {
      var I = B.types;
      I === null ? B.types = [h] : I.indexOf(h) === -1 && I.push(h);
    } else wt(vt.bind(null, h));
  }
  var me = {
    map: R,
    forEach: function(h, B, I) {
      R(
        h,
        function() {
          B.apply(this, arguments);
        },
        I
      );
    },
    count: function(h) {
      var B = 0;
      return R(h, function() {
        B++;
      }), B;
    },
    toArray: function(h) {
      return R(h, function(B) {
        return B;
      }) || [];
    },
    only: function(h) {
      if (!he(h))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return h;
    }
  };
  return Me.Activity = g, Me.Children = me, Me.Component = $, Me.Fragment = y, Me.Profiler = T, Me.PureComponent = ae, Me.StrictMode = r, Me.Suspense = L, Me.ViewTransition = z, Me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ge, Me.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(h) {
      return ge.H.useMemoCache(h);
    }
  }, Me.addTransitionType = vt, Me.cache = function(h) {
    return function() {
      return h.apply(null, arguments);
    };
  }, Me.cacheSignal = function() {
    return null;
  }, Me.cloneElement = function(h, B, I) {
    if (h == null)
      throw Error(
        "The argument must be a React element, but you passed " + h + "."
      );
    var te = X({}, h.props), Ce = h.key;
    if (B != null)
      for (Ue in B.key !== void 0 && (Ce = "" + B.key), B)
        !it.call(B, Ue) || Ue === "key" || Ue === "__self" || Ue === "__source" || Ue === "ref" && B.ref === void 0 || (te[Ue] = B[Ue]);
    var Ue = arguments.length - 2;
    if (Ue === 1) te.children = I;
    else if (1 < Ue) {
      for (var Ae = Array(Ue), ne = 0; ne < Ue; ne++)
        Ae[ne] = arguments[ne + 2];
      te.children = Ae;
    }
    return Fe(h.type, Ce, te);
  }, Me.createContext = function(h) {
    return h = {
      $$typeof: Z,
      _currentValue: h,
      _currentValue2: h,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, h.Provider = h, h.Consumer = {
      $$typeof: j,
      _context: h
    }, h;
  }, Me.createElement = function(h, B, I) {
    var te, Ce = {}, Ue = null;
    if (B != null)
      for (te in B.key !== void 0 && (Ue = "" + B.key), B)
        it.call(B, te) && te !== "key" && te !== "__self" && te !== "__source" && (Ce[te] = B[te]);
    var Ae = arguments.length - 2;
    if (Ae === 1) Ce.children = I;
    else if (1 < Ae) {
      for (var ne = Array(Ae), fe = 0; fe < Ae; fe++)
        ne[fe] = arguments[fe + 2];
      Ce.children = ne;
    }
    if (h && h.defaultProps)
      for (te in Ae = h.defaultProps, Ae)
        Ce[te] === void 0 && (Ce[te] = Ae[te]);
    return Fe(h, Ue, Ce);
  }, Me.createRef = function() {
    return { current: null };
  }, Me.forwardRef = function(h) {
    return { $$typeof: V, render: h };
  }, Me.isValidElement = he, Me.lazy = function(h) {
    return {
      $$typeof: O,
      _payload: { _status: -1, _result: h },
      _init: Ee
    };
  }, Me.memo = function(h, B) {
    return {
      $$typeof: x,
      type: h,
      compare: B === void 0 ? null : B
    };
  }, Me.startTransition = wt, Me.unstable_useCacheRefresh = function() {
    return ge.H.useCacheRefresh();
  }, Me.use = function(h) {
    return ge.H.use(h);
  }, Me.useActionState = function(h, B, I) {
    return ge.H.useActionState(h, B, I);
  }, Me.useCallback = function(h, B) {
    return ge.H.useCallback(h, B);
  }, Me.useContext = function(h) {
    return ge.H.useContext(h);
  }, Me.useDebugValue = function() {
  }, Me.useDeferredValue = function(h, B) {
    return ge.H.useDeferredValue(h, B);
  }, Me.useEffect = function(h, B) {
    return ge.H.useEffect(h, B);
  }, Me.useEffectEvent = function(h) {
    return ge.H.useEffectEvent(h);
  }, Me.useId = function() {
    return ge.H.useId();
  }, Me.useImperativeHandle = function(h, B, I) {
    return ge.H.useImperativeHandle(h, B, I);
  }, Me.useInsertionEffect = function(h, B) {
    return ge.H.useInsertionEffect(h, B);
  }, Me.useLayoutEffect = function(h, B) {
    return ge.H.useLayoutEffect(h, B);
  }, Me.useMemo = function(h, B) {
    return ge.H.useMemo(h, B);
  }, Me.useOptimistic = function(h, B) {
    return ge.H.useOptimistic(h, B);
  }, Me.useReducer = function(h, B, I) {
    return ge.H.useReducer(h, B, I);
  }, Me.useRef = function(h) {
    return ge.H.useRef(h);
  }, Me.useState = function(h) {
    return ge.H.useState(h);
  }, Me.useSyncExternalStore = function(h, B, I) {
    return ge.H.useSyncExternalStore(
      h,
      B,
      I
    );
  }, Me.useTransition = function() {
    return ge.H.useTransition();
  }, Me.version = "19.3.1", Me;
}
var $d;
function Us() {
  return $d || ($d = 1, _s.exports = fg()), _s.exports;
}
var _ = Us();
const i = /* @__PURE__ */ rg(_);
var Ns = { exports: {} }, Si = {}, ws = { exports: {} }, Ts = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Wd;
function dg() {
  return Wd || (Wd = 1, (function(s) {
    function d(M, G) {
      var R = M.length;
      M.push(G);
      e: for (; 0 < R; ) {
        var Ee = R - 1 >>> 1, ze = M[Ee];
        if (0 < T(ze, G))
          M[Ee] = G, M[R] = ze, R = Ee;
        else break e;
      }
    }
    function y(M) {
      return M.length === 0 ? null : M[0];
    }
    function r(M) {
      if (M.length === 0) return null;
      var G = M[0], R = M.pop();
      if (R !== G) {
        M[0] = R;
        e: for (var Ee = 0, ze = M.length, wt = ze >>> 1; Ee < wt; ) {
          var vt = 2 * (Ee + 1) - 1, me = M[vt], h = vt + 1, B = M[h];
          if (0 > T(me, R))
            h < ze && 0 > T(B, me) ? (M[Ee] = B, M[h] = R, Ee = h) : (M[Ee] = me, M[vt] = R, Ee = vt);
          else if (h < ze && 0 > T(B, R))
            M[Ee] = B, M[h] = R, Ee = h;
          else break e;
        }
      }
      return G;
    }
    function T(M, G) {
      var R = M.sortIndex - G.sortIndex;
      return R !== 0 ? R : M.id - G.id;
    }
    if (s.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var j = performance;
      s.unstable_now = function() {
        return j.now();
      };
    } else {
      var Z = Date, V = Z.now();
      s.unstable_now = function() {
        return Z.now() - V;
      };
    }
    var L = [], x = [], O = 1, g = null, z = 3, D = !1, K = !1, re = !1, X = !1, J = typeof setTimeout == "function" ? setTimeout : null, $ = typeof clearTimeout == "function" ? clearTimeout : null, ve = typeof setImmediate < "u" ? setImmediate : null;
    function ae(M) {
      for (var G = y(x); G !== null; ) {
        if (G.callback === null) r(x);
        else if (G.startTime <= M)
          r(x), G.sortIndex = G.expirationTime, d(L, G);
        else break;
        G = y(x);
      }
    }
    function Oe(M) {
      if (re = !1, ae(M), !K)
        if (y(L) !== null)
          K = !0, Q || (Q = !0, he());
        else {
          var G = y(x);
          G !== null && Ze(Oe, G.startTime - M);
        }
    }
    var Q = !1, k = -1, ge = 5, it = -1;
    function Fe() {
      return X ? !0 : !(s.unstable_now() - it < ge);
    }
    function Ve() {
      if (X = !1, Q) {
        var M = s.unstable_now();
        it = M;
        var G = !0;
        try {
          e: {
            K = !1, re && (re = !1, $(k), k = -1), D = !0;
            var R = z;
            try {
              t: {
                for (ae(M), g = y(L); g !== null && !(g.expirationTime > M && Fe()); ) {
                  var Ee = g.callback;
                  if (typeof Ee == "function") {
                    g.callback = null, z = g.priorityLevel;
                    var ze = Ee(
                      g.expirationTime <= M
                    );
                    if (M = s.unstable_now(), typeof ze == "function") {
                      g.callback = ze, ae(M), G = !0;
                      break t;
                    }
                    g === y(L) && r(L), ae(M);
                  } else r(L);
                  g = y(L);
                }
                if (g !== null) G = !0;
                else {
                  var wt = y(x);
                  wt !== null && Ze(
                    Oe,
                    wt.startTime - M
                  ), G = !1;
                }
              }
              break e;
            } finally {
              g = null, z = R, D = !1;
            }
            G = void 0;
          }
        } finally {
          G ? he() : Q = !1;
        }
      }
    }
    var he;
    if (typeof ve == "function")
      he = function() {
        ve(Ve);
      };
    else if (typeof MessageChannel < "u") {
      var rt = new MessageChannel(), Et = rt.port2;
      rt.port1.onmessage = Ve, he = function() {
        Et.postMessage(null);
      };
    } else
      he = function() {
        J(Ve, 0);
      };
    function Ze(M, G) {
      k = J(function() {
        M(s.unstable_now());
      }, G);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(M) {
      M.callback = null;
    }, s.unstable_forceFrameRate = function(M) {
      0 > M || 125 < M ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : ge = 0 < M ? Math.floor(1e3 / M) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return z;
    }, s.unstable_next = function(M) {
      switch (z) {
        case 1:
        case 2:
        case 3:
          var G = 3;
          break;
        default:
          G = z;
      }
      var R = z;
      z = G;
      try {
        return M();
      } finally {
        z = R;
      }
    }, s.unstable_requestPaint = function() {
      X = !0;
    }, s.unstable_runWithPriority = function(M, G) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          M = 3;
      }
      var R = z;
      z = M;
      try {
        return G();
      } finally {
        z = R;
      }
    }, s.unstable_scheduleCallback = function(M, G, R) {
      var Ee = s.unstable_now();
      switch (typeof R == "object" && R !== null ? (R = R.delay, R = typeof R == "number" && 0 < R ? Ee + R : Ee) : R = Ee, M) {
        case 1:
          var ze = -1;
          break;
        case 2:
          ze = 250;
          break;
        case 5:
          ze = 1073741823;
          break;
        case 4:
          ze = 1e4;
          break;
        default:
          ze = 5e3;
      }
      return ze = R + ze, M = {
        id: O++,
        callback: G,
        priorityLevel: M,
        startTime: R,
        expirationTime: ze,
        sortIndex: -1
      }, R > Ee ? (M.sortIndex = R, d(x, M), y(L) === null && M === y(x) && (re ? ($(k), k = -1) : re = !0, Ze(Oe, R - Ee))) : (M.sortIndex = ze, d(L, M), K || D || (K = !0, Q || (Q = !0, he()))), M;
    }, s.unstable_shouldYield = Fe, s.unstable_wrapCallback = function(M) {
      var G = z;
      return function() {
        var R = z;
        z = G;
        try {
          return M.apply(this, arguments);
        } finally {
          z = R;
        }
      };
    };
  })(Ts)), Ts;
}
var Id;
function mg() {
  return Id || (Id = 1, ws.exports = dg()), ws.exports;
}
var zs = { exports: {} }, Wt = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Pd;
function hg() {
  if (Pd) return Wt;
  Pd = 1;
  var s = Us();
  function d(O) {
    var g = "https://react.dev/errors/" + O;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var z = 2; z < arguments.length; z++)
        g += "&args[]=" + encodeURIComponent(arguments[z]);
    }
    return "Minified React error #" + O + "; visit " + g + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function y() {
  }
  var r = {
    d: {
      f: y,
      r: function() {
        throw Error(d(522));
      },
      D: y,
      C: y,
      L: y,
      m: y,
      X: y,
      S: y,
      M: y
    },
    p: 0,
    findDOMNode: null
  }, T = Symbol.for("react.portal"), j = Symbol.for("react.recoverable"), Z = Symbol.for("react.optimistic_key");
  function V(O, g, z) {
    var D = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: T,
      key: D == null ? null : D === Z ? Z : "" + D,
      children: O,
      containerInfo: g,
      implementation: z
    };
  }
  var L = s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function x(O, g) {
    if (O === "font") return "";
    if (typeof g == "string")
      return g === "use-credentials" ? g : "";
  }
  return Wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, Wt.browser = function(O) {
    return { $$typeof: j, _reason: O };
  }, Wt.createPortal = function(O, g) {
    var z = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!g || g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)
      throw Error(d(299));
    return V(O, g, null, z);
  }, Wt.flushSync = function(O) {
    var g = L.T, z = r.p;
    try {
      if (L.T = null, r.p = 2, O) return O();
    } finally {
      L.T = g, r.p = z, r.d.f();
    }
  }, Wt.preconnect = function(O, g) {
    typeof O == "string" && (g ? (g = g.crossOrigin, g = typeof g == "string" ? g === "use-credentials" ? g : "" : void 0) : g = null, r.d.C(O, g));
  }, Wt.prefetchDNS = function(O) {
    typeof O == "string" && r.d.D(O);
  }, Wt.preinit = function(O, g) {
    if (typeof O == "string" && g && typeof g.as == "string") {
      var z = g.as, D = x(z, g.crossOrigin), K = typeof g.integrity == "string" ? g.integrity : void 0, re = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
      z === "style" ? r.d.S(
        O,
        typeof g.precedence == "string" ? g.precedence : void 0,
        {
          crossOrigin: D,
          integrity: K,
          fetchPriority: re
        }
      ) : z === "script" && r.d.X(O, {
        crossOrigin: D,
        integrity: K,
        fetchPriority: re,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0
      });
    }
  }, Wt.preinitModule = function(O, g) {
    if (typeof O == "string")
      if (typeof g == "object" && g !== null) {
        if (g.as == null || g.as === "script") {
          var z = x(
            g.as,
            g.crossOrigin
          );
          r.d.M(O, {
            crossOrigin: z,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
            nonce: typeof g.nonce == "string" ? g.nonce : void 0,
            fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
          });
        }
      } else g == null && r.d.M(O);
  }, Wt.preload = function(O, g) {
    if (typeof O == "string" && typeof g == "object" && g !== null && typeof g.as == "string") {
      var z = g.as, D = x(z, g.crossOrigin);
      r.d.L(O, z, {
        crossOrigin: D,
        integrity: typeof g.integrity == "string" ? g.integrity : void 0,
        nonce: typeof g.nonce == "string" ? g.nonce : void 0,
        type: typeof g.type == "string" ? g.type : void 0,
        fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
        referrerPolicy: typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
        imageSrcSet: typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
        imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
        media: typeof g.media == "string" ? g.media : void 0
      });
    }
  }, Wt.preloadModule = function(O, g) {
    if (typeof O == "string")
      if (g) {
        var z = x(g.as, g.crossOrigin);
        r.d.m(O, {
          as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
          crossOrigin: z,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0,
          fetchPriority: typeof g.fetchPriority == "string" ? g.fetchPriority : void 0
        });
      } else r.d.m(O);
  }, Wt.requestFormReset = function(O) {
    r.d.r(O);
  }, Wt.unstable_batchedUpdates = function(O, g) {
    return O(g);
  }, Wt.useFormState = function(O, g, z) {
    return L.H.useFormState(O, g, z);
  }, Wt.useFormStatus = function() {
    return L.H.useHostTransitionStatus();
  }, Wt.version = "19.3.1", Wt;
}
var em;
function gm() {
  if (em) return zs.exports;
  em = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (d) {
        console.error(d);
      }
  }
  return s(), zs.exports = hg(), zs.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var tm;
function vg() {
  if (tm) return Si;
  tm = 1;
  var s = mg(), d = Us(), y = gm();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function T(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function j(e) {
    for (var t = e, l = t; l && !l.alternate; )
      t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function Z(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function V(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function L(e) {
    if (j(e) !== e)
      throw Error(r(188));
  }
  function x(e) {
    var t = e.alternate;
    if (!t) {
      if (t = j(e), t === null) throw Error(r(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var c = n.alternate;
      if (c === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === c.child) {
        for (c = n.child; c; ) {
          if (c === l) return L(n), e;
          if (c === a) return L(n), t;
          c = c.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== a.return) l = n, a = c;
      else {
        for (var u = !1, o = n.child; o; ) {
          if (o === l) {
            u = !0, l = n, a = c;
            break;
          }
          if (o === a) {
            u = !0, a = n, l = c;
            break;
          }
          o = o.sibling;
        }
        if (!u) {
          for (o = c.child; o; ) {
            if (o === l) {
              u = !0, l = c, a = n;
              break;
            }
            if (o === a) {
              u = !0, a = c, l = n;
              break;
            }
            o = o.sibling;
          }
          if (!u) throw Error(r(189));
        }
      }
      if (l.alternate !== a) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
    return l.stateNode.current === l ? e : t;
  }
  function O(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = O(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  function g(e, t, l, a, n, c) {
    for (; e !== null; ) {
      if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && l(e, a, n, c) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && g(
        e.child,
        t,
        l,
        a,
        n,
        c
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function z(e) {
    for (e = e.return; e !== null; ) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function D(e) {
    var t = !1;
    for (e = e.return; e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27)); )
      e = e.return;
    return t;
  }
  function K(e) {
    var t = [null, null], l = z(e);
    return l === null || re(
      t,
      e,
      l.child,
      { foundSelf: !1 }
    ), t;
  }
  function re(e, t, l, a) {
    for (; l !== null; ) {
      if (l === t) a.foundSelf = !0;
      else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
        if (a.foundSelf) return e[1] = l, !0;
        e[0] = l;
      } else if ((l.tag !== 22 || l.memoizedState === null) && re(
        e,
        t,
        l.child,
        a
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function X(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var J = null, $ = null;
  function ve(e, t, l) {
    return e === l ? !0 : e === t ? (J = e, !0) : !1;
  }
  function ae(e, t, l) {
    return e === l ? ($ = e, !1) : e === t ? ($ !== null && (J = e), !0) : !1;
  }
  function Oe(e) {
    if (e === null) return null;
    do
      e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function Q(e, t, l) {
    for (var a = 0, n = e; n; n = l(n)) a++;
    n = 0;
    for (var c = t; c; c = l(c)) n++;
    for (; 0 < a - n; ) e = l(e), a--;
    for (; 0 < n - a; ) t = l(t), n--;
    for (; a--; ) {
      if (e === t || t !== null && e === t.alternate)
        return e;
      e = l(e), t = l(t);
    }
    return null;
  }
  var k = Object.assign, ge = Symbol.for("react.element"), it = Symbol.for("react.transitional.element"), Fe = Symbol.for("react.portal"), Ve = Symbol.for("react.fragment"), he = Symbol.for("react.strict_mode"), rt = Symbol.for("react.profiler"), Et = Symbol.for("react.consumer"), Ze = Symbol.for("react.context"), M = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), R = Symbol.for("react.suspense_list"), Ee = Symbol.for("react.memo"), ze = Symbol.for("react.lazy"), wt = Symbol.for("react.activity"), vt = Symbol.for("react.legacy_hidden"), me = Symbol.for("react.memo_cache_sentinel"), h = Symbol.for("react.view_transition"), B = Symbol.for("react.recoverable"), I = Symbol.iterator;
  function te(e) {
    return e === null || typeof e != "object" ? null : (e = I && e[I] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Ce = Symbol.for("react.client.reference");
  function Ue(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Ce ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ve:
        return "Fragment";
      case rt:
        return "Profiler";
      case he:
        return "StrictMode";
      case G:
        return "Suspense";
      case R:
        return "SuspenseList";
      case wt:
        return "Activity";
      case h:
        return "ViewTransition";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case Fe:
          return "Portal";
        case Ze:
          return e.displayName || "Context";
        case Et:
          return (e._context.displayName || "Context") + ".Consumer";
        case M:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case Ee:
          return t = e.displayName || null, t !== null ? t : Ue(e.type) || "Memo";
        case ze:
          t = e._payload, e = e._init;
          try {
            return Ue(e(t));
          } catch {
          }
      }
    return null;
  }
  var Ae = Array.isArray, ne = d.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, fe = y.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Mt = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, il = [], hl = -1;
  function at(e) {
    return { current: e };
  }
  function De(e) {
    0 > hl || (e.current = il[hl], il[hl] = null, hl--);
  }
  function ke(e, t) {
    hl++, il[hl] = e.current, e.current = t;
  }
  var Tt = at(null), Ht = at(null), At = at(null), el = at(null);
  function Bl(e, t) {
    switch (ke(At, t), ke(Ht, e), ke(Tt, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? nd(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = nd(t), e = cd(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    De(Tt), ke(Tt, e);
  }
  function Pe() {
    De(Tt), De(Ht), De(At);
  }
  function kt(e) {
    var t = e.memoizedState;
    t !== null && (wc._currentValue = t.memoizedState, ke(el, e)), t = Tt.current;
    var l = cd(t, e.type);
    t !== l && (ke(Ht, e), ke(Tt, l));
  }
  function ul(e) {
    Ht.current === e && (De(Tt), De(Ht)), el.current === e && (De(el), wc._currentValue = Mt);
  }
  var vl, tl;
  function Qt(e) {
    if (vl === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        vl = t && t[1] || "", tl = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + vl + e + tl;
  }
  var Nl = !1;
  function Ll(e, t) {
    if (!e || Nl) return "";
    Nl = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var q = function() {
                throw Error();
              };
              if (Object.defineProperty(q.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(q, []);
                } catch (P) {
                  var b = P;
                }
                Reflect.construct(e, [], q);
              } else {
                try {
                  q.call();
                } catch (P) {
                  b = P;
                }
                q = !1;
                try {
                  var w = Object.getOwnPropertyDescriptor(
                    e.prototype,
                    "props"
                  );
                  Object.defineProperty(e.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), q = !0, new e();
                } finally {
                  q && (w !== void 0 ? Object.defineProperty(e.prototype, "props", w) : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (P) {
                b = P;
              }
              (q = e()) && typeof q.catch == "function" && q.catch(function() {
              });
            }
          } catch (P) {
            if (P && b && typeof P.stack == "string")
              return [P.stack, b.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var c = a.DetermineComponentFrameRoot(), u = c[0], o = c[1];
      if (u && o) {
        var m = u.split(`
`), p = o.split(`
`);
        for (n = a = 0; a < m.length && !m[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < p.length && !p[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === m.length || n === p.length)
          for (a = m.length - 1, n = p.length - 1; 1 <= a && 0 <= n && m[a] !== p[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (m[a] !== p[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || m[a] !== p[n]) {
                  var C = `
` + m[a].replace(" at new ", " at ");
                  return e.displayName && C.includes("<anonymous>") && (C = C.replace("<anonymous>", e.displayName)), C;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Nl = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Qt(l) : "";
  }
  function le(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Qt(e.type);
      case 16:
        return Qt("Lazy");
      case 13:
        return e.child !== t && t !== null ? Qt("Suspense Fallback") : Qt("Suspense");
      case 19:
        return Qt("SuspenseList");
      case 0:
      case 15:
        return Ll(e.type, !1);
      case 11:
        return Ll(e.type.render, !1);
      case 1:
        return Ll(e.type, !0);
      case 31:
        return Qt("Activity");
      case 30:
        return Qt("ViewTransition");
      default:
        return "";
    }
  }
  function _e(e) {
    try {
      var t = "", l = null;
      do
        t += le(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var A = Object.prototype.hasOwnProperty, Se = s.unstable_scheduleCallback, He = s.unstable_cancelCallback, gl = s.unstable_shouldYield, Wl = s.unstable_requestPaint, St = s.unstable_now, Ea = s.unstable_getCurrentPriorityLevel, kl = s.unstable_ImmediatePriority, pa = s.unstable_UserBlockingPriority, Xt = s.unstable_NormalPriority, wl = s.unstable_LowPriority, yl = s.unstable_IdlePriority, hn = s.log, ll = s.unstable_setDisableYieldValue, jl = null, W = null;
  function ft(e) {
    if (typeof hn == "function" && ll(e), W && typeof W.setStrictMode == "function")
      try {
        W.setStrictMode(jl, e);
      } catch {
      }
  }
  var qt = Math.clz32 ? Math.clz32 : kn, ia = Math.log, Il = Math.LN2;
  function kn(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (ia(e) / Il | 0) | 0;
  }
  var Tl = 256, al = 262144, Ot = 4194304;
  function nl(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & -e;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function ua(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, c = e.suspendedLanes, u = e.pingedLanes;
    e = e.warmLanes;
    var o = a & 134217727;
    return o !== 0 ? (a = o & ~c, a !== 0 ? n = nl(a) : (u &= o, u !== 0 ? n = nl(u) : l || (l = o & ~e, l !== 0 && (n = nl(l))))) : (o = a & ~c, o !== 0 ? n = nl(o) : u !== 0 ? n = nl(u) : l || (l = a & ~e, l !== 0 && (n = nl(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & c) === 0 && (c = n & -n, l = t & -t, c >= l || c === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function Sa(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function vn(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var a = 31 - qt(l), n = 1 << a;
        t |= e[a], l &= ~n;
      }
    return t;
  }
  function La(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Pl() {
    var e = Ot;
    return Ot <<= 1, (Ot & 62914560) === 0 && (Ot = 4194304), e;
  }
  function gn(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function ol(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function S(e, t, l, a, n, c) {
    var u = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var o = e.entanglements, m = e.expirationTimes, p = e.hiddenUpdates;
    for (l = u & ~l; 0 < l; ) {
      var C = 31 - qt(l), q = 1 << C;
      o[C] = 0, m[C] = -1;
      var b = p[C];
      if (b !== null)
        for (p[C] = null, C = 0; C < b.length; C++) {
          var w = b[C];
          w !== null && (w.lane &= -536870913);
        }
      l &= ~q;
    }
    a !== 0 && Y(e, a, 0), c !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= c & ~(u & ~t));
  }
  function Y(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - qt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function F(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - qt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function ue(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : ce(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function ce(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function pe(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function et() {
    var e = fe.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Vd(e.type));
  }
  function Ne(e, t) {
    var l = fe.p;
    try {
      return fe.p = e, t();
    } finally {
      fe.p = l;
    }
  }
  var Ge = Math.random().toString(36).slice(2), Ke = "__reactFiber$" + Ge, $e = "__reactProps$" + Ge, Be = "__reactContainer$" + Ge, We = "__reactEvents$" + Ge, f = "__reactListeners$" + Ge, U = "__reactHandles$" + Ge, ie = "__reactResources$" + Ge, ee = "__reactMarker$" + Ge, se = "__reactLoad$" + Ge;
  function Ie(e) {
    delete e[Ke], delete e[$e], delete e[f], delete e[U];
  }
  function Bt(e) {
    var t;
    if (t = e[Ke]) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[Be] || l[Ke]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = _d(e); e !== null; ) {
            if (l = e[Ke]) return l;
            e = _d(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Yl(e) {
    if (e = e[Ke] || e[Be]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function xc(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function jn(e) {
    var t = e[ie];
    return t || (t = e[ie] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function jt(e) {
    e[ee] = !0;
  }
  function Ls(e) {
    e[se] = void 0;
  }
  var ks = /* @__PURE__ */ new Set(), js = {};
  function yn(e, t) {
    Yn(e, t), Yn(e + "Capture", t);
  }
  function Yn(e, t) {
    for (js[e] = t, e = 0; e < t.length; e++)
      ks.add(t[e]);
  }
  var M1 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Ys = {}, Vs = {};
  function A1(e) {
    return A.call(Vs, e) ? !0 : A.call(Ys, e) ? !1 : M1.test(e) ? Vs[e] = !0 : (Ys[e] = !0, !1);
  }
  var tt = !1;
  function Gs() {
    var e = tt;
    return tt = !1, e;
  }
  function Ci(e, t, l) {
    if (A1(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, l);
      }
  }
  function Mi(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, l);
    }
  }
  function _a(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, a);
    }
  }
  function zl(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Qs(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function O1(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, c = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(u) {
          l = "" + u, c.call(this, u);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(u) {
          l = "" + u;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Wu(e) {
    if (!e._valueTracker) {
      var t = Qs(e) ? "checked" : "value";
      e._valueTracker = O1(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function Xs(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Qs(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  var D1 = /[\n"\\]/g;
  function Vl(e) {
    return e.replace(
      D1,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Iu(e, t, l, a, n, c, u, o) {
    e.name = "", u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" ? e.type = u : e.removeAttribute("type"), t != null ? u === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + zl(t)) : e.value !== "" + zl(t) && (e.value = "" + zl(t)) : u !== "submit" && u !== "reset" || e.removeAttribute("value"), t != null ? u === "number" && e.value == t ? Pu(e, zl(e.value)) : Pu(e, zl(t)) : l != null ? Pu(e, zl(l)) : a != null && e.removeAttribute("value"), n == null && c != null && (e.defaultChecked = !!c), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" ? e.name = "" + zl(o) : e.removeAttribute("name");
  }
  function Zs(e, t, l, a, n, c, u, o) {
    if (c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (e.type = c), t != null || l != null) {
      if (!(c !== "submit" && c !== "reset" || t != null)) {
        Wu(e);
        return;
      }
      l = l != null ? "" + zl(l) : "", t = t != null ? "" + zl(t) : l, o || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = o ? e.checked : !!a, e.defaultChecked = !!a, u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.name = u), Wu(e);
  }
  function Pu(e, t) {
    e.defaultValue !== "" + t && (e.defaultValue = "" + t);
  }
  function Vn(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + zl(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ks(e, t, l) {
    if (t != null && (t = "" + zl(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + zl(l) : "";
  }
  function Js(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(r(92));
        if (Ae(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = zl(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), Wu(e);
  }
  function Gn(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var x1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Fs(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || x1.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function $s(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "", tt = !0);
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && (Fs(e, n, a), tt = !0);
    } else
      for (var c in t)
        t.hasOwnProperty(c) && Fs(e, c, t[c]);
  }
  function e0(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var R1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), U1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ai(e) {
    return U1.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function oa() {
  }
  var t0 = null;
  function l0(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Qn = null, Xn = null;
  function Ws(e) {
    var t = Yl(e);
    if (t && (e = t.stateNode)) {
      var l = e[$e] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Iu(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + Vl(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[$e] || null;
                if (!n) throw Error(r(90));
                Iu(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              a = l[t], a.form === e.form && Xs(a);
          }
          break e;
        case "textarea":
          Ks(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && Vn(e, !!l.multiple, t, !1);
      }
    }
  }
  var a0 = !1;
  function Is(e, t, l) {
    if (a0) return e(t, l);
    a0 = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (a0 = !1, (Qn !== null || Xn !== null) && (Au(), Qn && (t = Qn, e = Xn, Xn = Qn = null, Ws(t), e)))
        for (t = 0; t < e.length; t++) Ws(e[t]);
    }
  }
  function Rc(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[$e] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        r(231, t, typeof l)
      );
    return l;
  }
  var Na = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), n0 = !1;
  if (Na)
    try {
      var Uc = {};
      Object.defineProperty(Uc, "passive", {
        get: function() {
          n0 = !0;
        }
      }), window.addEventListener("test", Uc, Uc), window.removeEventListener("test", Uc, Uc);
    } catch {
      n0 = !1;
    }
  var ka = null, c0 = null, Oi = null;
  function Ps() {
    if (Oi) return Oi;
    var e, t = c0, l = t.length, a, n = "value" in ka ? ka.value : ka.textContent, c = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var u = l - e;
    for (a = 1; a <= u && t[l - a] === n[c - a]; a++) ;
    return Oi = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Di(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function xi() {
    return !0;
  }
  function er() {
    return !1;
  }
  function sl(e) {
    function t(l, a, n, c, u) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = c, this.target = u, this.currentTarget = null;
      for (var o in e)
        e.hasOwnProperty(o) && (l = e[o], this[o] = l ? l(c) : c[o]);
      return this.isDefaultPrevented = (c.defaultPrevented != null ? c.defaultPrevented : c.returnValue === !1) ? xi : er, this.isPropagationStopped = er, this;
    }
    return k(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = xi);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = xi);
      },
      persist: function() {
      },
      isPersistent: xi
    }), t;
  }
  var ja = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ri = sl(ja), Hc = k({}, ja, { view: 0, detail: 0 }), H1 = sl(Hc), i0, u0, qc, Ui = k({}, Hc, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: s0,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== qc && (qc && e.type === "mousemove" ? (i0 = e.screenX - qc.screenX, u0 = e.screenY - qc.screenY) : u0 = i0 = 0, qc = e), i0);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : u0;
    }
  }), tr = sl(Ui), q1 = k({}, Ui, { dataTransfer: 0 }), B1 = sl(q1), L1 = k({}, Hc, { relatedTarget: 0 }), o0 = sl(L1), k1 = k({}, ja, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), j1 = sl(k1), Y1 = k({}, ja, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), V1 = sl(Y1), G1 = k({}, ja, { data: 0 }), lr = sl(G1), Q1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, X1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Z1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function K1(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Z1[e]) ? !!t[e] : !1;
  }
  function s0() {
    return K1;
  }
  var J1 = k({}, Hc, {
    key: function(e) {
      if (e.key) {
        var t = Q1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Di(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? X1[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: s0,
    charCode: function(e) {
      return e.type === "keypress" ? Di(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Di(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), F1 = sl(J1), $1 = k({}, Ui, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), ar = sl($1), W1 = k({}, ja, { submitter: 0 }), I1 = sl(W1), P1 = k({}, Hc, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: s0
  }), eh = sl(P1), th = k({}, ja, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), lh = sl(th), ah = k({}, Ui, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), nh = sl(ah), ch = k({}, ja, {
    newState: 0,
    oldState: 0,
    source: 0
  }), ih = sl(ch), uh = [9, 13, 27, 32], r0 = Na && "CompositionEvent" in window, Bc = null;
  Na && "documentMode" in document && (Bc = document.documentMode);
  var oh = Na && "TextEvent" in window && !Bc, nr = Na && (!r0 || Bc && 8 < Bc && 11 >= Bc), cr = " ", ir = !1;
  function ur(e, t) {
    switch (e) {
      case "keyup":
        return uh.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function or(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var Zn = !1;
  function sh(e, t) {
    switch (e) {
      case "compositionend":
        return or(t);
      case "keypress":
        return t.which !== 32 ? null : (ir = !0, cr);
      case "textInput":
        return e = t.data, e === cr && ir ? null : e;
      default:
        return null;
    }
  }
  function rh(e, t) {
    if (Zn)
      return e === "compositionend" || !r0 && ur(e, t) ? (e = Ps(), Oi = c0 = ka = null, Zn = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return nr && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var fh = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function sr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!fh[e.type] : t === "textarea";
  }
  function rr(e, t, l, a) {
    Qn ? Xn ? Xn.push(a) : Xn = [a] : Qn = a, t = Hu(t, "onChange"), 0 < t.length && (l = new Ri(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Lc = null, kc = null;
  function dh(e) {
    If(e, 0);
  }
  function Hi(e) {
    var t = xc(e);
    if (Xs(t)) return e;
  }
  function fr(e, t) {
    if (e === "change") return t;
  }
  var dr = !1;
  if (Na) {
    var f0;
    if (Na) {
      var d0 = "oninput" in document;
      if (!d0) {
        var mr = document.createElement("div");
        mr.setAttribute("oninput", "return;"), d0 = typeof mr.oninput == "function";
      }
      f0 = d0;
    } else f0 = !1;
    dr = f0 && (!document.documentMode || 9 < document.documentMode);
  }
  function hr() {
    Lc && (Lc.detachEvent("onpropertychange", vr), kc = Lc = null);
  }
  function vr(e) {
    if (e.propertyName === "value" && Hi(kc)) {
      var t = [];
      rr(
        t,
        kc,
        e,
        l0(e)
      ), Is(dh, t);
    }
  }
  function mh(e, t, l) {
    e === "focusin" ? (hr(), Lc = t, kc = l, Lc.attachEvent("onpropertychange", vr)) : e === "focusout" && hr();
  }
  function hh(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Hi(kc);
  }
  function vh(e, t) {
    if (e === "click") return Hi(t);
  }
  function gh(e, t) {
    if (e === "input" || e === "change")
      return Hi(t);
  }
  function yh(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var Cl = typeof Object.is == "function" ? Object.is : yh;
  function jc(e, t) {
    if (Cl(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!A.call(t, n) || !Cl(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function m0(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function gr(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function yr(e, t) {
    var l = gr(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = gr(l);
    }
  }
  function br(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? br(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Er(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = m0(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = m0(e.document);
    }
    return t;
  }
  function h0(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var bh = Na && "documentMode" in document && 11 >= document.documentMode, Kn = null, v0 = null, Yc = null, g0 = !1;
  function pr(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    g0 || Kn == null || Kn !== m0(a) || (a = Kn, "selectionStart" in a && h0(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Yc && jc(Yc, a) || (Yc = a, a = Hu(v0, "onSelect"), 0 < a.length && (t = new Ri(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = Kn)));
  }
  function bn(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var Jn = {
    animationend: bn("Animation", "AnimationEnd"),
    animationiteration: bn("Animation", "AnimationIteration"),
    animationstart: bn("Animation", "AnimationStart"),
    transitionrun: bn("Transition", "TransitionRun"),
    transitionstart: bn("Transition", "TransitionStart"),
    transitioncancel: bn("Transition", "TransitionCancel"),
    transitionend: bn("Transition", "TransitionEnd")
  }, y0 = {}, Sr = {};
  Na && (Sr = document.createElement("div").style, "AnimationEvent" in window || (delete Jn.animationend.animation, delete Jn.animationiteration.animation, delete Jn.animationstart.animation), "TransitionEvent" in window || delete Jn.transitionend.transition);
  function En(e) {
    if (y0[e]) return y0[e];
    if (!Jn[e]) return e;
    var t = Jn[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in Sr)
        return y0[e] = t[l];
    return e;
  }
  var _r = En("animationend"), Nr = En("animationiteration"), wr = En("animationstart"), Eh = En("transitionrun"), ph = En("transitionstart"), Sh = En("transitioncancel"), Tr = En("transitionend"), zr = /* @__PURE__ */ new Map(), b0 = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  b0.push("scrollEnd");
  function ea(e, t) {
    zr.set(e, t), yn(t, [e]);
  }
  var _h = 0;
  function wa(e, t) {
    if (e.name != null && e.name !== "auto") return e.name;
    if (t.autoName !== null) return t.autoName;
    e = na.identifierPrefix;
    var l = _h++;
    return e = "_" + e + "t_" + l.toString(32) + "_", t.autoName = e;
  }
  function Cr(e) {
    if (e == null || typeof e == "string")
      return e;
    var t = null, l = hc;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = e[l[a]];
        if (n != null) {
          if (n === "none") return "none";
          t = t == null ? n : t + (" " + n);
        }
      }
    return t ?? e.default;
  }
  function Ta(e, t) {
    return e = Cr(e), t = Cr(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
  }
  var qi = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, Gl = [], Fn = 0, E0 = 0;
  function Bi() {
    for (var e = Fn, t = E0 = Fn = 0; t < e; ) {
      var l = Gl[t];
      Gl[t++] = null;
      var a = Gl[t];
      Gl[t++] = null;
      var n = Gl[t];
      Gl[t++] = null;
      var c = Gl[t];
      if (Gl[t++] = null, a !== null && n !== null) {
        var u = a.pending;
        u === null ? n.next = n : (n.next = u.next, u.next = n), a.pending = n;
      }
      c !== 0 && Mr(l, n, c);
    }
  }
  function Li(e, t, l, a) {
    Gl[Fn++] = e, Gl[Fn++] = t, Gl[Fn++] = l, Gl[Fn++] = a, E0 |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function p0(e, t, l, a) {
    return Li(e, t, l, a), ki(e);
  }
  function pn(e, t) {
    return Li(e, null, null, t), ki(e);
  }
  function Mr(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, c = e.return; c !== null; )
      c.childLanes |= l, a = c.alternate, a !== null && (a.childLanes |= l), c.tag === 22 && (e = c.stateNode, e === null || e._visibility & 1 || (n = !0)), e = c, c = c.return;
    return e.tag === 3 ? (c = e.stateNode, n && t !== null && (n = 31 - qt(l), e = c.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), c) : null;
  }
  function ki(e) {
    if (50 < si)
      throw si = 0, Mu = null, Error(r(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var $n = {};
  function Nh(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function bl(e, t, l, a) {
    return new Nh(e, t, l, a);
  }
  function S0(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function za(e, t) {
    var l = e.alternate;
    return l === null ? (l = bl(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 1206910976, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Ar(e, t) {
    e.flags &= 1206910978;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function ji(e, t, l, a, n, c) {
    var u = 0;
    if (a = e, typeof a == "function") S0(a) && (u = 1);
    else if (typeof a == "string")
      u = Wv(
        e,
        l,
        Tt.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (a) {
        case wt:
          return e = bl(31, l, t, n), e.elementType = wt, e.lanes = c, e;
        case Ve:
          return Sn(l.children, n, c, t);
        case he:
          u = 8, n |= 24;
          break;
        case rt:
          return e = bl(12, l, t, n | 2), e.elementType = rt, e.lanes = c, e;
        case G:
          return e = bl(13, l, t, n), e.elementType = G, e.lanes = c, e;
        case R:
          return e = bl(19, l, t, n), e.elementType = R, e.lanes = c, e;
        case vt:
        case h:
          return e = n | 32, e = bl(30, l, t, e), e.elementType = h, e.lanes = c, e.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, e;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case Ze:
                u = 10;
                break e;
              case Et:
                u = 9;
                break e;
              case M:
                u = 11;
                break e;
              case Ee:
                u = 14;
                break e;
              case ze:
                u = 16, a = null;
                break e;
            }
          u = 29, l = Error(
            r(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = bl(u, l, t, n), t.elementType = e, t.type = a, t.lanes = c, t;
  }
  function Sn(e, t, l, a) {
    return e = bl(7, e, a, t), e.lanes = l, e;
  }
  function _0(e, t, l) {
    return e = bl(6, e, null, t), e.lanes = l, e;
  }
  function Or(e) {
    var t = bl(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function N0(e, t, l) {
    return t = bl(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Dr = /* @__PURE__ */ new WeakMap();
  function Ql(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Dr.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: _e(t)
      }, Dr.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: _e(t)
    };
  }
  var Wn = [], In = 0, Yi = null, Vc = 0, Xl = [], Zl = 0, Ya = null, sa = 1, ra = "";
  function Ca(e, t) {
    Wn[In++] = Vc, Wn[In++] = Yi, Yi = e, Vc = t;
  }
  function xr(e, t, l) {
    Xl[Zl++] = sa, Xl[Zl++] = ra, Xl[Zl++] = Ya, Ya = e;
    var a = sa;
    e = ra;
    var n = 32 - qt(a) - 1;
    a &= ~(1 << n), l += 1;
    var c = 32 - qt(t) + n;
    if (30 < c) {
      var u = n - n % 5;
      c = (a & (1 << u) - 1).toString(32), a >>= u, n -= u, sa = 1 << 32 - qt(t) + n | l << n | a, ra = c + e;
    } else
      sa = 1 << c | l << n | a, ra = e;
  }
  function Vi(e) {
    e.return !== null && (Ca(e, 1), xr(e, 1, 0));
  }
  function w0(e) {
    for (; e === Yi; )
      Yi = Wn[--In], Wn[In] = null, Vc = Wn[--In], Wn[In] = null;
    for (; e === Ya; )
      Ya = Xl[--Zl], Xl[Zl] = null, ra = Xl[--Zl], Xl[Zl] = null, sa = Xl[--Zl], Xl[Zl] = null;
  }
  function Rr(e, t) {
    Xl[Zl++] = sa, Xl[Zl++] = ra, Xl[Zl++] = Ya, sa = t.id, ra = t.overflow, Ya = e;
  }
  var Yt = null, gt = null, Le = !1, Va = null, Kl = !1, T0 = Error(r(519));
  function Ga(e) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Gc(Ql(t, e)), T0;
  }
  function Ur(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[Ke] = e, t[$e] = a, l) {
      case "dialog":
        Ye("cancel", t), Ye("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ye("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < fi.length; l++)
          Ye(fi[l], t);
        break;
      case "source":
        Ye("error", t);
        break;
      case "img":
      case "image":
      case "link":
        Ye("error", t), Ye("load", t);
        break;
      case "details":
        Ye("toggle", t);
        break;
      case "input":
        Ye("invalid", t), Zs(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        Ye("invalid", t);
        break;
      case "textarea":
        Ye("invalid", t), Js(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || ld(t.textContent, l) ? (a.popover != null && (Ye("beforetoggle", t), Ye("toggle", t)), a.onScroll != null && Ye("scroll", t), a.onScrollEnd != null && Ye("scrollend", t), a.onClick != null && (t.onclick = oa), t = !0) : t = !1, t || Ga(e, !0);
  }
  function Gi(e) {
    for (Yt = e.return; Yt; )
      switch (Yt.tag) {
        case 5:
        case 31:
        case 13:
          Kl = !1;
          return;
        case 27:
        case 3:
          Kl = !0;
          return;
        default:
          Yt = Yt.return;
      }
  }
  function Pn(e) {
    if (e !== Yt) return !1;
    if (!Le) return Gi(e), Le = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || ls(e.type, e.memoizedProps)), l = !l), l && gt && Ga(e), Gi(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      gt = Sd(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      gt = Sd(e);
    } else
      t === 27 ? (t = gt, cn(e.type) ? (e = fs, fs = null, gt = e) : gt = t) : gt = Yt ? Fl(e.stateNode.nextSibling) : null;
    return !0;
  }
  function _n() {
    gt = Yt = null, Le = !1;
  }
  function z0() {
    var e = Va;
    return e !== null && (Sl === null ? Sl = e : Sl.push.apply(
      Sl,
      e
    ), Va = null), e;
  }
  function Gc(e) {
    Va === null ? Va = [e] : Va.push(e);
  }
  var C0 = at(null), Nn = null, Ma = null;
  function Qa(e, t, l) {
    ke(C0, t._currentValue), t._currentValue = l;
  }
  function Aa(e) {
    e._currentValue = C0.current, De(C0);
  }
  function Qi(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function M0(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var c = n.dependencies;
      if (c !== null) {
        var u = n.child;
        c = c.firstContext;
        e: for (; c !== null; ) {
          var o = c;
          c = n;
          for (var m = 0; m < t.length; m++)
            if (o.context === t[m]) {
              c.lanes |= l, o = c.alternate, o !== null && (o.lanes |= l), Qi(
                c.return,
                l,
                e
              ), a || (u = null);
              break e;
            }
          c = o.next;
        }
      } else if (n.tag === 18) {
        if (u = n.return, u === null) throw Error(r(341));
        u.lanes |= l, c = u.alternate, c !== null && (c.lanes |= l), Qi(u, l, e), u = null;
      } else
        n.tag === 13 && n.memoizedState !== null && n.memoizedState.dehydrated === null ? (n.lanes |= l, u = n.alternate, u !== null && (u.lanes |= l), Qi(
          n.return,
          l,
          e
        ), u = n.child, u = u !== null ? u.sibling : null) : u = n.child;
      if (u !== null) u.return = n;
      else
        for (u = n; u !== null; ) {
          if (u === e) {
            u = null;
            break;
          }
          if (n = u.sibling, n !== null) {
            n.return = u.return, u = n;
            break;
          }
          u = u.return;
        }
      n = u;
    }
  }
  function wn(e, t, l, a) {
    e = null;
    for (var n = t, c = !1; n !== null; ) {
      if (!c) {
        if ((n.flags & 524288) !== 0) c = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var u = n.alternate;
        if (u === null) throw Error(r(387));
        if (u = u.memoizedProps, u !== null) {
          var o = n.type;
          Cl(n.pendingProps.value, u.value) || (e !== null ? e.push(o) : e = [o]);
        }
      } else if (n === el.current) {
        if (u = n.alternate, u === null) throw Error(r(387));
        u.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(wc) : e = [wc]);
      }
      n = n.return;
    }
    return e !== null && M0(
      t,
      e,
      l,
      a
    ), t.flags |= 262144, e !== null;
  }
  function Xi(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!Cl(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Tn(e) {
    Nn = e, Ma = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Zt(e) {
    return Hr(Nn, e);
  }
  function Zi(e, t) {
    return Nn === null && Tn(e), Hr(e, t);
  }
  function Hr(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Ma === null) {
      if (e === null) throw Error(r(308));
      Ma = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Ma = Ma.next = t;
    return l;
  }
  var wh = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, Th = s.unstable_scheduleCallback, zh = s.unstable_NormalPriority, Dt = {
    $$typeof: Ze,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function A0() {
    return {
      controller: new wh(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Qc(e) {
    e.refCount--, e.refCount === 0 && Th(zh, function() {
      e.controller.abort();
    });
  }
  function qr(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var l = e.transitionTypes;
      for (l === null && (l = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var a = t[e];
        l.indexOf(a) === -1 && l.push(a);
      }
    }
  }
  var Xc = null;
  function Ch(e) {
    var t = e.transitionTypes;
    return e.transitionTypes = null, t;
  }
  var Zc = null, O0 = 0, zn = 0, ec = null;
  function Mh(e, t) {
    if (Zc === null) {
      var l = Zc = [];
      O0 = 0, zn = Ko(), ec = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return O0++, t.then(Br, Br), t;
  }
  function Br() {
    if (--O0 === 0 && (Xc = null, Zc !== null)) {
      ec !== null && (ec.status = "fulfilled");
      var e = Zc;
      Zc = null, zn = 0, ec = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Ah(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var Lr = ne.S;
  ne.S = function(e, t) {
    if (Df = St(), typeof t == "object" && t !== null && typeof t.then == "function" && Mh(e, t), Xc !== null)
      for (var l = bc; l !== null; )
        qr(l, Xc), l = l.next;
    if (l = e.types, l !== null) {
      for (var a = bc; a !== null; )
        qr(a, l), a = a.next;
      if (zn !== 0) {
        a = Xc, a === null && (a = Xc = []);
        for (var n = 0; n < l.length; n++) {
          var c = l[n];
          a.indexOf(c) === -1 && a.push(c);
        }
      }
    }
    Lr !== null && Lr(e, t);
  };
  var Cn = at(null);
  function D0() {
    var e = Cn.current;
    return e !== null ? e : mt.pooledCache;
  }
  function Ki(e, t) {
    t === null ? ke(Cn, Cn.current) : ke(Cn, t.pool);
  }
  function kr() {
    var e = D0();
    return e === null ? null : { parent: Dt._currentValue, pool: e };
  }
  var tc = Error(r(460)), x0 = Error(r(474)), Ji = Error(r(542)), Fi = { then: function() {
  } };
  function jr(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Yr(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(oa, oa), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Gr(e), e === void 0 && !("reason" in t) ? Error(r(600)) : e;
      default:
        if (typeof t.status == "string") t.then(oa, oa);
        else {
          if (e = mt, e !== null && 100 < e.shellSuspendCounter)
            throw Error(r(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Gr(e), e;
        }
        throw An = t, tc;
    }
  }
  function Mn(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (An = l, tc) : l;
    }
  }
  var An = null;
  function Vr() {
    if (An === null) throw Error(r(459));
    var e = An;
    return An = null, e;
  }
  function Gr(e) {
    if (e === tc || e === Ji)
      throw Error(r(483));
  }
  var lc = null, Kc = 0;
  function $i(e) {
    var t = Kc;
    return Kc += 1, lc === null && (lc = []), Yr(lc, e, t);
  }
  function Xa(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Wi(e, t) {
    throw t.$$typeof === ge ? Error(r(525)) : (e = Object.prototype.toString.call(t), Error(
      r(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Qr(e) {
    function t(E, v) {
      if (e) {
        var N = E.deletions;
        N === null ? (E.deletions = [v], E.flags |= 16) : N.push(v);
      }
    }
    function l(E, v) {
      if (!e) return null;
      for (; v !== null; )
        t(E, v), v = v.sibling;
      return null;
    }
    function a(E) {
      for (var v = /* @__PURE__ */ new Map(); E !== null; )
        E.key === null ? v.set(E.index, E) : v.set(E.key, E), E = E.sibling;
      return v;
    }
    function n(E, v) {
      return E = za(E, v), E.index = 0, E.sibling = null, E;
    }
    function c(E, v, N) {
      return E.index = N, e ? (N = E.alternate, N !== null ? (N = N.index, N < v ? (E.flags |= 2, v) : N) : (E.flags |= 134217730, v)) : (E.flags |= 1048576, v);
    }
    function u(E) {
      return e && E.alternate === null && (E.flags |= 134217730), E;
    }
    function o(E, v, N, H) {
      return v === null || v.tag !== 6 ? (v = _0(N, E.mode, H), v.return = E, v) : (v = n(v, N), v.return = E, v);
    }
    function m(E, v, N, H) {
      var oe = N.type;
      return oe === Ve ? (E = C(
        E,
        v,
        N.props.children,
        H,
        N.key
      ), Xa(E, N), E) : v !== null && (v.elementType === oe || typeof oe == "object" && oe !== null && oe.$$typeof === ze && Mn(oe) === v.type) ? (v = n(v, N.props), Xa(v, N), v.return = E, v) : (v = ji(
        N.type,
        N.key,
        N.props,
        null,
        E.mode,
        H
      ), Xa(v, N), v.return = E, v);
    }
    function p(E, v, N, H) {
      return v === null || v.tag !== 4 || v.stateNode.containerInfo !== N.containerInfo || v.stateNode.implementation !== N.implementation ? (v = N0(N, E.mode, H), v.return = E, v) : (v = n(v, N.children || []), v.return = E, v);
    }
    function C(E, v, N, H, oe) {
      return v === null || v.tag !== 7 ? (v = Sn(
        N,
        E.mode,
        H,
        oe
      ), v.return = E, v) : (v = n(v, N), v.return = E, v);
    }
    function q(E, v, N) {
      if (typeof v == "string" && v !== "" || typeof v == "number" || typeof v == "bigint")
        return v = _0(
          "" + v,
          E.mode,
          N
        ), v.return = E, v;
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case it:
            return N = ji(
              v.type,
              v.key,
              v.props,
              null,
              E.mode,
              N
            ), Xa(N, v), N.return = E, N;
          case Fe:
            return v = N0(
              v,
              E.mode,
              N
            ), v.return = E, v;
          case ze:
            return v = Mn(v), q(E, v, N);
        }
        if (Ae(v) || te(v))
          return v = Sn(
            v,
            E.mode,
            N,
            null
          ), v.return = E, v;
        if (typeof v.then == "function")
          return q(E, $i(v), N);
        if (v.$$typeof === Ze)
          return q(
            E,
            Zi(E, v),
            N
          );
        Wi(E, v);
      }
      return null;
    }
    function b(E, v, N, H) {
      var oe = v !== null ? v.key : null;
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return oe !== null ? null : o(E, v, "" + N, H);
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case it:
            return N.key === oe ? m(E, v, N, H) : null;
          case Fe:
            return N.key === oe ? p(E, v, N, H) : null;
          case ze:
            return N = Mn(N), b(E, v, N, H);
        }
        if (Ae(N) || te(N))
          return oe !== null ? null : C(E, v, N, H, null);
        if (typeof N.then == "function")
          return b(
            E,
            v,
            $i(N),
            H
          );
        if (N.$$typeof === Ze)
          return b(
            E,
            v,
            Zi(E, N),
            H
          );
        Wi(E, N);
      }
      return null;
    }
    function w(E, v, N, H, oe) {
      if (typeof H == "string" && H !== "" || typeof H == "number" || typeof H == "bigint")
        return E = E.get(N) || null, o(v, E, "" + H, oe);
      if (typeof H == "object" && H !== null) {
        switch (H.$$typeof) {
          case it:
            return E = E.get(
              H.key === null ? N : H.key
            ) || null, m(v, E, H, oe);
          case Fe:
            return E = E.get(
              H.key === null ? N : H.key
            ) || null, p(v, E, H, oe);
          case ze:
            return H = Mn(H), w(
              E,
              v,
              N,
              H,
              oe
            );
        }
        if (Ae(H) || te(H))
          return E = E.get(N) || null, C(v, E, H, oe, null);
        if (typeof H.then == "function")
          return w(
            E,
            v,
            N,
            $i(H),
            oe
          );
        if (H.$$typeof === Ze)
          return w(
            E,
            v,
            N,
            Zi(v, H),
            oe
          );
        Wi(v, H);
      }
      return null;
    }
    function P(E, v, N, H) {
      for (var oe = null, Xe = null, be = v, we = v = 0, Ut = null; be !== null && we < N.length; we++) {
        be.index > we ? (Ut = be, be = null) : Ut = be.sibling;
        var Je = b(
          E,
          be,
          N[we],
          H
        );
        if (Je === null) {
          be === null && (be = Ut);
          break;
        }
        e && be && Je.alternate === null && t(E, be), v = c(Je, v, we), Xe === null ? oe = Je : Xe.sibling = Je, Xe = Je, be = Ut;
      }
      if (we === N.length)
        return l(E, be), Le && Ca(E, we), oe;
      if (be === null) {
        for (; we < N.length; we++)
          be = q(E, N[we], H), be !== null && (v = c(
            be,
            v,
            we
          ), Xe === null ? oe = be : Xe.sibling = be, Xe = be);
        return Le && Ca(E, we), oe;
      }
      for (be = a(be); we < N.length; we++)
        Ut = w(
          be,
          E,
          we,
          N[we],
          H
        ), Ut !== null && (e && (Je = Ut.alternate, Je !== null && be.delete(Je.key === null ? we : Je.key)), v = c(
          Ut,
          v,
          we
        ), Xe === null ? oe = Ut : Xe.sibling = Ut, Xe = Ut);
      return e && be.forEach(function(fn) {
        return t(E, fn);
      }), Le && Ca(E, we), oe;
    }
    function de(E, v, N, H) {
      if (N == null) throw Error(r(151));
      for (var oe = null, Xe = null, be = v, we = v = 0, Ut = null, Je = N.next(); be !== null && !Je.done; we++, Je = N.next()) {
        be.index > we ? (Ut = be, be = null) : Ut = be.sibling;
        var fn = b(E, be, Je.value, H);
        if (fn === null) {
          be === null && (be = Ut);
          break;
        }
        e && be && fn.alternate === null && t(E, be), v = c(fn, v, we), Xe === null ? oe = fn : Xe.sibling = fn, Xe = fn, be = Ut;
      }
      if (Je.done)
        return l(E, be), Le && Ca(E, we), oe;
      if (be === null) {
        for (; !Je.done; we++, Je = N.next())
          Je = q(E, Je.value, H), Je !== null && (v = c(Je, v, we), Xe === null ? oe = Je : Xe.sibling = Je, Xe = Je);
        return Le && Ca(E, we), oe;
      }
      for (be = a(be); !Je.done; we++, Je = N.next())
        Je = w(be, E, we, Je.value, H), Je !== null && (e && (Ut = Je.alternate, Ut !== null && be.delete(
          Ut.key === null ? we : Ut.key
        )), v = c(Je, v, we), Xe === null ? oe = Je : Xe.sibling = Je, Xe = Je);
      return e && be.forEach(function(sg) {
        return t(E, sg);
      }), Le && Ca(E, we), oe;
    }
    function Re(E, v, N, H) {
      if (typeof N == "object" && N !== null && N.type === Ve && N.key === null && N.props.ref === void 0 && (N = N.props.children), typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case it:
            e: {
              for (var oe = N.key; v !== null; ) {
                if (v.key === oe) {
                  if (oe = N.type, oe === Ve) {
                    if (v.tag === 7) {
                      l(
                        E,
                        v.sibling
                      ), H = n(
                        v,
                        N.props.children
                      ), Xa(H, N), H.return = E, E = H;
                      break e;
                    }
                  } else if (v.elementType === oe || typeof oe == "object" && oe !== null && oe.$$typeof === ze && Mn(oe) === v.type) {
                    l(
                      E,
                      v.sibling
                    ), H = n(v, N.props), Xa(H, N), H.return = E, E = H;
                    break e;
                  }
                  l(E, v);
                  break;
                } else t(E, v);
                v = v.sibling;
              }
              N.type === Ve ? (H = Sn(
                N.props.children,
                E.mode,
                H,
                N.key
              ), Xa(H, N), H.return = E, E = H) : (H = ji(
                N.type,
                N.key,
                N.props,
                null,
                E.mode,
                H
              ), Xa(H, N), H.return = E, E = H);
            }
            return u(E);
          case Fe:
            e: {
              for (oe = N.key; v !== null; ) {
                if (v.key === oe)
                  if (v.tag === 4 && v.stateNode.containerInfo === N.containerInfo && v.stateNode.implementation === N.implementation) {
                    l(
                      E,
                      v.sibling
                    ), H = n(v, N.children || []), H.return = E, E = H;
                    break e;
                  } else {
                    l(E, v);
                    break;
                  }
                else t(E, v);
                v = v.sibling;
              }
              H = N0(N, E.mode, H), H.return = E, E = H;
            }
            return u(E);
          case ze:
            return N = Mn(N), Re(
              E,
              v,
              N,
              H
            );
        }
        if (Ae(N))
          return P(
            E,
            v,
            N,
            H
          );
        if (te(N)) {
          if (oe = te(N), typeof oe != "function") throw Error(r(150));
          return N = oe.call(N), de(
            E,
            v,
            N,
            H
          );
        }
        if (typeof N.then == "function")
          return Re(
            E,
            v,
            $i(N),
            H
          );
        if (N.$$typeof === Ze)
          return Re(
            E,
            v,
            Zi(E, N),
            H
          );
        Wi(E, N);
      }
      return typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint" ? (N = "" + N, v !== null && v.tag === 6 ? (l(E, v.sibling), H = n(v, N), H.return = E, E = H) : (l(E, v), H = _0(N, E.mode, H), H.return = E, E = H), u(E)) : l(E, v);
    }
    return function(E, v, N, H) {
      try {
        Kc = 0;
        var oe = Re(
          E,
          v,
          N,
          H
        );
        return lc = null, oe;
      } catch (be) {
        if (be === tc || be === Ji) throw be;
        var Xe = bl(29, be, null, E.mode);
        return Xe.lanes = H, Xe.return = E, Xe;
      } finally {
      }
    };
  }
  var On = Qr(!0), Xr = Qr(!1), Za = !1;
  function R0(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function U0(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Ka(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Ja(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (lt & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = ki(e), Mr(e, null, l), t;
    }
    return Li(e, a, t, l), ki(e);
  }
  function Jc(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, F(e, l);
    }
  }
  function H0(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, c = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var u = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          c === null ? n = c = u : c = c.next = u, l = l.next;
        } while (l !== null);
        c === null ? n = c = t : c = c.next = t;
      } else n = c = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: c,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var q0 = !1;
  function Fc() {
    if (q0) {
      var e = ec;
      if (e !== null) throw e;
    }
  }
  function $c(e, t, l, a) {
    q0 = !1;
    var n = e.updateQueue;
    Za = !1;
    var c = n.firstBaseUpdate, u = n.lastBaseUpdate, o = n.shared.pending;
    if (o !== null) {
      n.shared.pending = null;
      var m = o, p = m.next;
      m.next = null, u === null ? c = p : u.next = p, u = m;
      var C = e.alternate;
      C !== null && (C = C.updateQueue, o = C.lastBaseUpdate, o !== u && (o === null ? C.firstBaseUpdate = p : o.next = p, C.lastBaseUpdate = m));
    }
    if (c !== null) {
      var q = n.baseState;
      u = 0, C = p = m = null, o = c;
      do {
        var b = o.lane & -536870913, w = b !== o.lane;
        if (w ? (Qe & b) === b : (a & b) === b) {
          b !== 0 && b === zn && (q0 = !0), C !== null && (C = C.next = {
            lane: 0,
            tag: o.tag,
            payload: o.payload,
            callback: null,
            next: null
          });
          e: {
            var P = e, de = o;
            b = t;
            var Re = l;
            switch (de.tag) {
              case 1:
                if (P = de.payload, typeof P == "function") {
                  q = P.call(Re, q, b);
                  break e;
                }
                q = P;
                break e;
              case 3:
                P.flags = P.flags & -65537 | 128;
              case 0:
                if (P = de.payload, b = typeof P == "function" ? P.call(Re, q, b) : P, b == null) break e;
                q = k({}, q, b);
                break e;
              case 2:
                Za = !0;
            }
          }
          b = o.callback, b !== null && (e.flags |= 64, w && (e.flags |= 8192), w = n.callbacks, w === null ? n.callbacks = [b] : w.push(b));
        } else
          w = {
            lane: b,
            tag: o.tag,
            payload: o.payload,
            callback: o.callback,
            next: null
          }, C === null ? (p = C = w, m = q) : C = C.next = w, u |= b;
        if (o = o.next, o === null) {
          if (o = n.shared.pending, o === null)
            break;
          w = o, o = w.next, w.next = null, n.lastBaseUpdate = w, n.shared.pending = null;
        }
      } while (!0);
      C === null && (m = q), n.baseState = m, n.firstBaseUpdate = p, n.lastBaseUpdate = C, c === null && (n.shared.lanes = 0), tn |= u, e.lanes = u, e.memoizedState = q;
    }
  }
  function Zr(e, t) {
    if (typeof e != "function")
      throw Error(r(191, e));
    e.call(t);
  }
  function Kr(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Zr(l[e], t);
  }
  var Fa = at(null), Ii = at(0);
  function Jr(e, t) {
    e = Ua, ke(Ii, e), ke(Fa, t), Ua = e | t.baseLanes;
  }
  function B0() {
    ke(Ii, Ua), ke(Fa, Fa.current);
  }
  function L0() {
    Ua = Ii.current, De(Fa), De(Ii);
  }
  var Kt = at(null), cl = null;
  function $a(e) {
    var t = e.alternate;
    ke(Jt, Jt.current & 1), ke(Kt, e), cl === null && (t === null || Fa.current !== null || t.memoizedState !== null) && (cl = e);
  }
  function k0(e) {
    ke(Jt, Jt.current), ke(Kt, e), cl === null && (cl = e);
  }
  function Fr(e) {
    e.tag === 22 ? (ke(Jt, Jt.current), ke(Kt, e), cl === null && (cl = e)) : Wa();
  }
  function Wa() {
    ke(Jt, Jt.current), ke(Kt, Kt.current);
  }
  function Ml(e) {
    De(Kt), cl === e && (cl = null), De(Jt);
  }
  var Jt = at(0);
  function Wc(e, t) {
    ke(Kt, Kt.current), ke(Jt, t);
  }
  function j0(e) {
    De(Jt), De(Kt), cl === e && (cl = null);
  }
  function Pi(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || ss(l) || rs(l)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Oa = 0, xe = null, dt = null, xt = null, eu = !1, ac = !1, Dn = !1, tu = 0, Ic = 0, nc = null, Oh = 0;
  function _t() {
    throw Error(r(321));
  }
  function Y0(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!Cl(e[l], t[l])) return !1;
    return !0;
  }
  function V0(e, t, l, a, n, c) {
    return Oa = c, xe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ne.H = e === null || e.memoizedState === null ? x2 : R2, Dn = !1, c = l(a, n), Dn = !1, ac && (c = Wr(
      t,
      l,
      a,
      n
    )), $r(e), c;
  }
  function $r(e) {
    ne.H = ou;
    var t = dt !== null && dt.next !== null;
    if (Oa = 0, xt = dt = xe = null, eu = !1, Ic = 0, nc = null, t) throw Error(r(300));
    e === null || Rt || (e = e.dependencies, e !== null && Xi(e) && (Rt = !0));
  }
  function Wr(e, t, l, a) {
    xe = e;
    var n = 0;
    do {
      if (ac && (nc = null), Ic = 0, ac = !1, 25 <= n) throw Error(r(301));
      if (n += 1, xt = dt = null, e.updateQueue != null) {
        var c = e.updateQueue;
        c.lastEffect = null, c.events = null, c.stores = null, c.memoCache != null && (c.memoCache.index = 0);
      }
      ne.H = Lh, c = t(l, a);
    } while (ac);
    return c;
  }
  function Dh() {
    var e = ne.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Pc(t) : t, e = e.useState()[0], (dt !== null ? dt.memoizedState : null) !== e && (xe.flags |= 1024), t;
  }
  function G0() {
    var e = tu !== 0;
    return tu = 0, e;
  }
  function Q0(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function X0(e) {
    if (eu) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      eu = !1;
    }
    Oa = 0, xt = dt = xe = null, ac = !1, Ic = tu = 0, nc = null;
  }
  function rl() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return xt === null ? xe.memoizedState = xt = e : xt = xt.next = e, xt;
  }
  function zt() {
    if (dt === null) {
      var e = xe.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = dt.next;
    var t = xt === null ? xe.memoizedState : xt.next;
    if (t !== null)
      xt = t, dt = e;
    else {
      if (e === null)
        throw xe.alternate === null ? Error(r(467)) : Error(r(310));
      dt = e, e = {
        memoizedState: dt.memoizedState,
        baseState: dt.baseState,
        baseQueue: dt.baseQueue,
        queue: dt.queue,
        next: null
      }, xt === null ? xe.memoizedState = xt = e : xt = xt.next = e;
    }
    return xt;
  }
  function lu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Pc(e) {
    var t = Ic;
    return Ic += 1, nc === null && (nc = []), e = Yr(nc, e, t), t = xe, (xt === null ? t.memoizedState : xt.next) === null && (t = t.alternate, ne.H = t === null || t.memoizedState === null ? x2 : R2), e;
  }
  function au(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Pc(e);
      if (e.$$typeof === B) return;
      if (e.$$typeof === Ze) return Zt(e);
    }
    throw Error(r(438, String(e)));
  }
  function Z0(e) {
    var t = null, l = xe.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = xe.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = lu(), xe.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = me;
    return t.index++, l;
  }
  function Da(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function nu(e) {
    var t = zt();
    return K0(t, dt, e);
  }
  function K0(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, c = a.pending;
    if (c !== null) {
      if (n !== null) {
        var u = n.next;
        n.next = c.next, c.next = u;
      }
      t.baseQueue = n = c, a.pending = null;
    }
    if (c = e.baseState, n === null) e.memoizedState = c;
    else {
      t = n.next;
      var o = u = null, m = null, p = t, C = !1;
      do {
        var q = p.lane & -536870913;
        if (q !== p.lane ? (Qe & q) === q : (Oa & q) === q) {
          var b = p.revertLane;
          if (b === 0)
            m !== null && (m = m.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }), q === zn && (C = !0);
          else if ((Oa & b) === b) {
            p = p.next, b === zn && (C = !0);
            continue;
          } else
            q = {
              lane: 0,
              revertLane: p.revertLane,
              gesture: null,
              action: p.action,
              hasEagerState: p.hasEagerState,
              eagerState: p.eagerState,
              next: null
            }, m === null ? (o = m = q, u = c) : m = m.next = q, xe.lanes |= b, tn |= b;
          q = p.action, Dn && l(c, q), c = p.hasEagerState ? p.eagerState : l(c, q);
        } else
          b = {
            lane: q,
            revertLane: p.revertLane,
            gesture: p.gesture,
            action: p.action,
            hasEagerState: p.hasEagerState,
            eagerState: p.eagerState,
            next: null
          }, m === null ? (o = m = b, u = c) : m = m.next = b, xe.lanes |= q, tn |= q;
        p = p.next;
      } while (p !== null && p !== t);
      if (m === null ? u = c : m.next = o, !Cl(c, e.memoizedState) && (Rt = !0, C && (l = ec, l !== null)))
        throw l;
      e.memoizedState = c, e.baseState = u, e.baseQueue = m, a.lastRenderedState = c;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function J0(e) {
    var t = zt(), l = t.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, c = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var u = n = n.next;
      do
        c = e(c, u.action), u = u.next;
      while (u !== n);
      Cl(c, t.memoizedState) || (Rt = !0), t.memoizedState = c, t.baseQueue === null && (t.baseState = c), l.lastRenderedState = c;
    }
    return [c, a];
  }
  function Ir(e, t, l) {
    var a = xe, n = zt(), c = Le;
    if (c) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = t();
    var u = !Cl(
      (dt || n).memoizedState,
      l
    );
    if (u && (n.memoizedState = l, Rt = !0), n = n.queue, W0(t2.bind(null, a, n, e), [
      e
    ]), e = n.getSnapshot !== t || u || xt !== null && (xt.memoizedState.tag & 1) !== 0, cc(
      e ? 9 : 8,
      { destroy: void 0 },
      e2.bind(null, a, n, l, t),
      null
    ), e) {
      if (a.flags |= 2048, mt === null) throw Error(r(349));
      c || (Oa & 127) !== 0 || Pr(a, t, l);
    }
    return l;
  }
  function Pr(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = xe.updateQueue, t === null ? (t = lu(), xe.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function e2(e, t, l, a) {
    t.value = l, t.getSnapshot = a, l2(t) && a2(e);
  }
  function t2(e, t, l) {
    return l(function() {
      l2(t) && a2(e);
    });
  }
  function l2(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !Cl(e, l);
    } catch {
      return !0;
    }
  }
  function a2(e) {
    var t = pn(e, 2);
    t !== null && _l(t, e, 2);
  }
  function F0(e) {
    var t = rl();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Dn) {
        ft(!0);
        try {
          l();
        } finally {
          ft(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Da,
      lastRenderedState: e
    }, t;
  }
  function n2(e, t, l, a) {
    return e.baseState = l, K0(
      e,
      dt,
      typeof a == "function" ? a : Da
    );
  }
  function xh(e, t, l, a, n) {
    if (uu(e)) throw Error(r(485));
    if (e = t.action, e !== null) {
      var c = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(u) {
          c.listeners.push(u);
        }
      };
      ne.T !== null ? l(!0) : c.isTransition = !1, a(c), l = t.pending, l === null ? (c.next = t.pending = c, c2(t, c)) : (c.next = l.next, t.pending = l.next = c);
    }
  }
  function c2(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var c = ne.T, u = {};
      u.types = c !== null ? c.types : null, ne.T = u;
      try {
        var o = l(n, a), m = ne.S;
        m !== null && m(u, o), i2(e, t, o);
      } catch (p) {
        $0(e, t, p);
      } finally {
        c !== null && u.types !== null && (c.types = u.types), ne.T = c;
      }
    } else
      try {
        c = l(n, a), i2(e, t, c);
      } catch (p) {
        $0(e, t, p);
      }
  }
  function i2(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        u2(e, t, a);
      },
      function(a) {
        return $0(e, t, a);
      }
    ) : u2(e, t, l);
  }
  function u2(e, t, l) {
    t.status = "fulfilled", t.value = l, o2(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, c2(e, l)));
  }
  function $0(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, o2(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function o2(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function s2(e, t) {
    return t;
  }
  function r2(e, t) {
    if (Le) {
      var l = mt.formState;
      if (l !== null) {
        e: {
          var a = xe;
          if (Le) {
            if (gt) {
              t: {
                for (var n = gt, c = Kl; n.nodeType !== 8; ) {
                  if (!c) {
                    n = null;
                    break t;
                  }
                  if (n = Fl(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                c = n.data, n = c === "F!" || c === "F" ? n : null;
              }
              if (n) {
                gt = Fl(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            Ga(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = rl(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: s2,
      lastRenderedState: t
    }, l.queue = a, l = A2.bind(
      null,
      xe,
      a
    ), a.dispatch = l, a = F0(!1), c = lo.bind(
      null,
      xe,
      !1,
      a.queue
    ), a = rl(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = xh.bind(
      null,
      xe,
      n,
      c,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function f2(e) {
    var t = zt();
    return d2(t, dt, e);
  }
  function d2(e, t, l) {
    if (t = K0(
      e,
      t,
      s2
    )[0], e = nu(Da)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Pc(t);
      } catch (u) {
        throw u === tc ? Ji : u;
      }
    else a = t;
    t = zt();
    var n = t.queue, c = n.dispatch;
    return l !== t.memoizedState && (xe.flags |= 2048, cc(
      9,
      { destroy: void 0 },
      Rh.bind(null, n, l),
      null
    )), [a, c, e];
  }
  function Rh(e, t) {
    e.action = t;
  }
  function m2(e) {
    var t = zt(), l = dt;
    if (l !== null)
      return d2(t, l, e);
    zt(), t = t.memoizedState, l = zt();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function cc(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = xe.updateQueue, t === null && (t = lu(), xe.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function h2() {
    return zt().memoizedState;
  }
  function cu(e, t, l, a) {
    var n = rl();
    xe.flags |= e, n.memoizedState = cc(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function iu(e, t, l, a) {
    var n = zt();
    a = a === void 0 ? null : a;
    var c = n.memoizedState.inst;
    dt !== null && a !== null && Y0(a, dt.memoizedState.deps) ? n.memoizedState = cc(t, c, l, a) : (xe.flags |= e, n.memoizedState = cc(
      1 | t,
      c,
      l,
      a
    ));
  }
  function v2(e, t) {
    cu(8390656, 8, e, t);
  }
  function W0(e, t) {
    iu(2048, 8, e, t);
  }
  function Uh(e) {
    xe.flags |= 4;
    var t = xe.updateQueue;
    if (t === null)
      t = lu(), xe.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function g2(e) {
    var t = zt().memoizedState;
    return Uh({ ref: t, nextImpl: e }), function() {
      if ((lt & 2) !== 0) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function y2(e, t) {
    return iu(4, 2, e, t);
  }
  function b2(e, t) {
    return iu(4, 4, e, t);
  }
  function E2(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function p2(e, t, l) {
    l = l != null ? l.concat([e]) : null, iu(4, 4, E2.bind(null, t, e), l);
  }
  function I0() {
  }
  function S2(e, t) {
    var l = zt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Y0(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function _2(e, t) {
    var l = zt();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Y0(t, a[1]))
      return a[0];
    if (a = e(), Dn) {
      ft(!0);
      try {
        e();
      } finally {
        ft(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function P0(e, t, l) {
    return l === void 0 || (Oa & 1073741824) !== 0 && (Qe & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Rf(), xe.lanes |= e, tn |= e, l);
  }
  function N2(e, t, l, a) {
    return Cl(l, t) ? l : Fa.current !== null ? (e = P0(e, l, a), Cl(e, t) || (Rt = !0), e) : (Oa & 106) === 0 || (Oa & 1073741824) !== 0 && (Qe & 261930) === 0 ? (Rt = !0, e.memoizedState = l) : (e = Rf(), xe.lanes |= e, tn |= e, t);
  }
  function w2(e, t, l, a, n) {
    var c = fe.p;
    fe.p = c !== 0 && 8 > c ? c : 8;
    var u = ne.T, o = {};
    o.types = u !== null ? u.types : null, ne.T = o, lo(e, !1, t, l);
    try {
      var m = n(), p = ne.S;
      if (p !== null && p(o, m), m !== null && typeof m == "object" && typeof m.then == "function") {
        var C = Ah(
          m,
          a
        );
        ei(
          e,
          t,
          C,
          xl(e)
        );
      } else
        ei(
          e,
          t,
          a,
          xl(e)
        );
    } catch (q) {
      ei(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: q },
        xl()
      );
    } finally {
      fe.p = c, u !== null && o.types !== null && (u.types = o.types), ne.T = u;
    }
  }
  function Hh() {
  }
  function eo(e, t, l, a) {
    if (e.tag !== 5) throw Error(r(476));
    var n = T2(e).queue;
    w2(
      e,
      n,
      t,
      Mt,
      l === null ? Hh : function() {
        return z2(e), l(a);
      }
    );
  }
  function T2(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Mt,
      baseState: Mt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Da,
        lastRenderedState: Mt
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Da,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function z2(e) {
    var t = T2(e);
    t.next === null && (t = e.alternate.memoizedState), ei(
      e,
      t.next.queue,
      {},
      xl()
    );
  }
  function to() {
    return Zt(wc);
  }
  function C2() {
    return zt().memoizedState;
  }
  function M2() {
    return zt().memoizedState;
  }
  function qh(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = xl();
          e = Ka(l);
          var a = Ja(t, e, l);
          a !== null && (_l(a, t, l), Jc(a, t, l)), t = { cache: A0() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Bh(e, t, l) {
    var a = xl();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, uu(e) ? O2(t, l) : (l = p0(e, t, l, a), l !== null && (_l(l, e, a), D2(l, t, a)));
  }
  function A2(e, t, l) {
    var a = xl();
    ei(e, t, l, a);
  }
  function ei(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (uu(e)) O2(t, n);
    else {
      var c = e.alternate;
      if (e.lanes === 0 && (c === null || c.lanes === 0) && (c = t.lastRenderedReducer, c !== null))
        try {
          var u = t.lastRenderedState, o = c(u, l);
          if (n.hasEagerState = !0, n.eagerState = o, Cl(o, u))
            return Li(e, t, n, 0), mt === null && Bi(), !1;
        } catch {
        } finally {
        }
      if (l = p0(e, t, n, a), l !== null)
        return _l(l, e, a), D2(l, t, a), !0;
    }
    return !1;
  }
  function lo(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Ko(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, uu(e)) {
      if (t) throw Error(r(479));
    } else
      t = p0(
        e,
        l,
        a,
        2
      ), t !== null && _l(t, e, 2);
  }
  function uu(e) {
    var t = e.alternate;
    return e === xe || t !== null && t === xe;
  }
  function O2(e, t) {
    ac = eu = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function D2(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, F(e, l);
    }
  }
  var ou = {
    readContext: Zt,
    use: au,
    useCallback: _t,
    useContext: _t,
    useEffect: _t,
    useImperativeHandle: _t,
    useLayoutEffect: _t,
    useInsertionEffect: _t,
    useMemo: _t,
    useReducer: _t,
    useRef: _t,
    useState: _t,
    useDebugValue: _t,
    useDeferredValue: _t,
    useTransition: _t,
    useSyncExternalStore: _t,
    useId: _t,
    useHostTransitionStatus: _t,
    useFormState: _t,
    useActionState: _t,
    useOptimistic: _t,
    useMemoCache: _t,
    useCacheRefresh: _t,
    useEffectEvent: _t
  }, x2 = {
    readContext: Zt,
    use: au,
    useCallback: function(e, t) {
      return rl().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Zt,
    useEffect: v2,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, cu(
        4194308,
        4,
        E2.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return cu(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      cu(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = rl();
      t = t === void 0 ? null : t;
      var a = e();
      if (Dn) {
        ft(!0);
        try {
          e();
        } finally {
          ft(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = rl();
      if (l !== void 0) {
        var n = l(t);
        if (Dn) {
          ft(!0);
          try {
            l(t);
          } finally {
            ft(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = Bh.bind(
        null,
        xe,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = rl();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = F0(e);
      var t = e.queue, l = A2.bind(null, xe, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: I0,
    useDeferredValue: function(e, t) {
      var l = rl();
      return P0(l, e, t);
    },
    useTransition: function() {
      var e = F0(!1);
      return e = w2.bind(
        null,
        xe,
        e.queue,
        !0,
        !1
      ), rl().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = xe, n = rl();
      if (Le) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = t(), mt === null)
          throw Error(r(349));
        (Qe & 127) !== 0 || Pr(a, t, l);
      }
      n.memoizedState = l;
      var c = { value: l, getSnapshot: t };
      return n.queue = c, v2(t2.bind(null, a, c, e), [
        e
      ]), a.flags |= 2048, cc(
        9,
        { destroy: void 0 },
        e2.bind(
          null,
          a,
          c,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = rl(), t = mt.identifierPrefix;
      if (Le) {
        var l = ra, a = sa;
        l = (a & ~(1 << 32 - qt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = tu++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = Oh++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: to,
    useFormState: r2,
    useActionState: r2,
    useOptimistic: function(e) {
      var t = rl();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = lo.bind(
        null,
        xe,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Z0,
    useCacheRefresh: function() {
      return rl().memoizedState = qh.bind(
        null,
        xe
      );
    },
    useEffectEvent: function(e) {
      var t = rl(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((lt & 2) !== 0)
          throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, R2 = {
    readContext: Zt,
    use: au,
    useCallback: S2,
    useContext: Zt,
    useEffect: W0,
    useImperativeHandle: p2,
    useInsertionEffect: y2,
    useLayoutEffect: b2,
    useMemo: _2,
    useReducer: nu,
    useRef: h2,
    useState: function() {
      return nu(Da);
    },
    useDebugValue: I0,
    useDeferredValue: function(e, t) {
      var l = zt();
      return N2(
        l,
        dt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = nu(Da)[0], t = zt().memoizedState;
      return [
        typeof e == "boolean" ? e : Pc(e),
        t
      ];
    },
    useSyncExternalStore: Ir,
    useId: C2,
    useHostTransitionStatus: to,
    useFormState: f2,
    useActionState: f2,
    useOptimistic: function(e, t) {
      var l = zt();
      return n2(l, dt, e, t);
    },
    useMemoCache: Z0,
    useCacheRefresh: M2,
    useEffectEvent: g2
  }, Lh = {
    readContext: Zt,
    use: au,
    useCallback: S2,
    useContext: Zt,
    useEffect: W0,
    useImperativeHandle: p2,
    useInsertionEffect: y2,
    useLayoutEffect: b2,
    useMemo: _2,
    useReducer: J0,
    useRef: h2,
    useState: function() {
      return J0(Da);
    },
    useDebugValue: I0,
    useDeferredValue: function(e, t) {
      var l = zt();
      return dt === null ? P0(l, e, t) : N2(
        l,
        dt.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = J0(Da)[0], t = zt().memoizedState;
      return [
        typeof e == "boolean" ? e : Pc(e),
        t
      ];
    },
    useSyncExternalStore: Ir,
    useId: C2,
    useHostTransitionStatus: to,
    useFormState: m2,
    useActionState: m2,
    useOptimistic: function(e, t) {
      var l = zt();
      return dt !== null ? n2(l, dt, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Z0,
    useCacheRefresh: M2,
    useEffectEvent: g2
  };
  function ao(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : k({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var no = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = xl(), n = Ka(a);
      n.payload = t, l != null && (n.callback = l), t = Ja(e, n, a), t !== null && (_l(t, e, a), Jc(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = xl(), n = Ka(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = Ja(e, n, a), t !== null && (_l(t, e, a), Jc(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = xl(), a = Ka(l);
      a.tag = 2, t != null && (a.callback = t), t = Ja(e, a, l), t !== null && (_l(t, e, l), Jc(t, e, l));
    }
  };
  function U2(e, t, l, a, n, c, u) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, c, u) : t.prototype && t.prototype.isPureReactComponent ? !jc(l, a) || !jc(n, c) : !0;
  }
  function H2(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && no.enqueueReplaceState(t, t.state, null);
  }
  function xn(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = k({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function q2(e) {
    qi(e);
  }
  function B2(e) {
    console.error(e);
  }
  function L2(e) {
    qi(e);
  }
  function su(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function k2(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function co(e, t, l) {
    return l = Ka(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      su(e, t);
    }, l;
  }
  function j2(e) {
    return e = Ka(e), e.tag = 3, e;
  }
  function Y2(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var c = a.value;
      e.payload = function() {
        return n(c);
      }, e.callback = function() {
        k2(t, l, a);
      };
    }
    var u = l.stateNode;
    u !== null && typeof u.componentDidCatch == "function" && (e.callback = function() {
      k2(t, l, a), typeof n != "function" && (ln === null ? ln = /* @__PURE__ */ new Set([this]) : ln.add(this));
      var o = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: o !== null ? o : ""
      });
    });
  }
  function kh(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && wn(
        t,
        l,
        n,
        !0
      ), l = Kt.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
          case 19:
            return cl === null ? Ou() : l.alternate === null && Nt === 0 && (Nt = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === Fi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Qo(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === Fi ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), Qo(e, a, n)), !1;
        }
        throw Error(r(435, l.tag));
      }
      return Qo(e, a, n), Ou(), !1;
    }
    if (Le)
      return t = Kt.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== T0 && (e = Error(r(422), { cause: a }), Gc(Ql(e, l)))) : (a !== T0 && (t = Error(r(423), {
        cause: a
      }), Gc(
        Ql(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Ql(a, l), n = co(
        e.stateNode,
        a,
        n
      ), H0(e, n), Nt !== 4 && (Nt = 2)), !1;
    var c = Error(r(520), { cause: a });
    if (c = Ql(c, l), oi === null ? oi = [c] : oi.push(c), Nt !== 4 && (Nt = 2), t === null) return !0;
    a = Ql(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = co(l.stateNode, a, e), H0(l, e), !1;
        case 1:
          if (t = l.type, c = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (ln === null || !ln.has(c))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = j2(n), Y2(
              n,
              e,
              l,
              a
            ), H0(l, n), !1;
          break;
        case 22:
          if (l.memoizedState !== null)
            return l.flags |= 65536, !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var io = Error(r(461)), Rt = !1;
  function Lt(e, t, l, a) {
    t.child = e === null ? Xr(t, null, l, a) : On(
      t,
      e.child,
      l,
      a
    );
  }
  function V2(e, t, l, a, n) {
    l = l.render;
    var c = t.ref;
    if ("ref" in a) {
      var u = {};
      for (var o in a)
        o !== "ref" && (u[o] = a[o]);
    } else u = a;
    return Tn(t), a = V0(
      e,
      t,
      l,
      u,
      c,
      n
    ), o = G0(), e !== null && !Rt ? (Q0(e, t, n), xa(e, t, n)) : (Le && o && Vi(t), t.flags |= 1, Lt(e, t, a, n), t.child);
  }
  function G2(e, t, l, a, n) {
    if (e === null) {
      var c = l.type;
      return typeof c == "function" && !S0(c) && c.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = c, Q2(
        e,
        t,
        c,
        a,
        n
      )) : (e = ji(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (c = e.child, !vo(e, n)) {
      var u = c.memoizedProps;
      if (l = l.compare, l = l !== null ? l : jc, l(u, a) && e.ref === t.ref)
        return xa(e, t, n);
    }
    return t.flags |= 1, e = za(c, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Q2(e, t, l, a, n) {
    if (e !== null) {
      var c = e.memoizedProps;
      if (jc(c, a) && e.ref === t.ref)
        if (Rt = !1, t.pendingProps = a = c, vo(e, n))
          (e.flags & 131072) !== 0 && (Rt = !0);
        else
          return t.lanes = e.lanes, xa(e, t, n);
    }
    return uo(
      e,
      t,
      l,
      a,
      n
    );
  }
  function X2(e, t, l, a) {
    var n = a.children, c = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (c = c !== null ? c.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~c;
        } else a = 0, t.child = null;
        return Z2(
          e,
          t,
          c,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Ki(
          t,
          c !== null ? c.cachePool : null
        ), c !== null ? Jr(t, c) : B0(), Fr(t);
      else
        return a = t.lanes = 536870912, Z2(
          e,
          t,
          c !== null ? c.baseLanes | l : l,
          l,
          a
        );
    } else
      c !== null ? (Ki(t, c.cachePool), Jr(t, c), Wa(), t.memoizedState = null) : (e !== null && Ki(t, null), B0(), Wa());
    return Lt(e, t, n, l), t.child;
  }
  function ti(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Z2(e, t, l, a, n) {
    var c = D0();
    return c = c === null ? null : { parent: Dt._currentValue, pool: c }, t.memoizedState = {
      baseLanes: l,
      cachePool: c
    }, e !== null && Ki(t, null), B0(), Fr(t), e !== null && wn(e, t, a, !0), t.childLanes = n, null;
  }
  function ru(e, t) {
    return t = fu(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function K2(e, t, l) {
    return On(t, e.child, null, l), e = ru(t, t.pendingProps), e.flags |= 2, Ml(t), t.memoizedState = null, e;
  }
  function jh(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Le) {
        if (a.mode === "hidden")
          return e = ru(t, a), t.lanes = 536870912, e.memoizedState = { baseLanes: 0, cachePool: null }, ti(null, e);
        if (k0(t), (e = gt) ? (e = pd(
          e,
          Kl
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Ya !== null ? { id: sa, overflow: ra } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Or(e), l.return = t, t.child = l, Yt = t, gt = null)) : e = null, e === null) throw Ga(t);
        return t.lanes = 536870912, null;
      }
      return ru(t, a);
    }
    var c = e.memoizedState;
    if (c !== null) {
      var u = c.dehydrated;
      if (k0(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = K2(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(r(558));
      else if (Rt || wn(e, t, l, !1), n = (l & e.childLanes) !== 0, Rt || n) {
        if (Fa.current === null) {
          if (a = mt, a !== null && (u = ue(a, l), u !== 0 && u !== c.retryLane))
            throw c.retryLane = u, pn(e, u), _l(a, e, u), io;
          Ou();
        }
        t = K2(
          e,
          t,
          l
        );
      } else
        e = c.treeContext, gt = Fl(u.nextSibling), Yt = t, Le = !0, Va = null, Kl = !1, e !== null && Rr(t, e), t = ru(t, a), t.flags |= 134221824;
      return t;
    }
    return e = za(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function ic(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(r(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function uo(e, t, l, a, n) {
    return Tn(t), l = V0(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = G0(), e !== null && !Rt ? (Q0(e, t, n), xa(e, t, n)) : (Le && a && Vi(t), t.flags |= 1, Lt(e, t, l, n), t.child);
  }
  function J2(e, t, l, a, n, c) {
    return Tn(t), t.updateQueue = null, l = Wr(
      t,
      a,
      l,
      n
    ), $r(e), a = G0(), e !== null && !Rt ? (Q0(e, t, c), xa(e, t, c)) : (Le && a && Vi(t), t.flags |= 1, Lt(e, t, l, c), t.child);
  }
  function F2(e, t, l, a, n) {
    if (Tn(t), t.stateNode === null) {
      var c = $n, u = l.contextType;
      typeof u == "object" && u !== null && (c = Zt(u)), c = new l(a, c), t.memoizedState = c.state !== null && c.state !== void 0 ? c.state : null, c.updater = no, t.stateNode = c, c._reactInternals = t, c = t.stateNode, c.props = a, c.state = t.memoizedState, c.refs = {}, R0(t), u = l.contextType, c.context = typeof u == "object" && u !== null ? Zt(u) : $n, c.state = t.memoizedState, u = l.getDerivedStateFromProps, typeof u == "function" && (ao(
        t,
        l,
        u,
        a
      ), c.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof c.getSnapshotBeforeUpdate == "function" || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (u = c.state, typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount(), u !== c.state && no.enqueueReplaceState(c, c.state, null), $c(t, a, c, n), Fc(), c.state = t.memoizedState), typeof c.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      c = t.stateNode;
      var o = t.memoizedProps, m = xn(l, o);
      c.props = m;
      var p = c.context, C = l.contextType;
      u = $n, typeof C == "object" && C !== null && (u = Zt(C));
      var q = l.getDerivedStateFromProps;
      C = typeof q == "function" || typeof c.getSnapshotBeforeUpdate == "function", o = t.pendingProps !== o, C || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (o || p !== u) && H2(
        t,
        c,
        a,
        u
      ), Za = !1;
      var b = t.memoizedState;
      c.state = b, $c(t, a, c, n), Fc(), p = t.memoizedState, o || b !== p || Za ? (typeof q == "function" && (ao(
        t,
        l,
        q,
        a
      ), p = t.memoizedState), (m = Za || U2(
        t,
        l,
        m,
        a,
        b,
        p,
        u
      )) ? (C || typeof c.UNSAFE_componentWillMount != "function" && typeof c.componentWillMount != "function" || (typeof c.componentWillMount == "function" && c.componentWillMount(), typeof c.UNSAFE_componentWillMount == "function" && c.UNSAFE_componentWillMount()), typeof c.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = p), c.props = a, c.state = p, c.context = u, a = m) : (typeof c.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      c = t.stateNode, U0(e, t), u = t.memoizedProps, C = xn(l, u), c.props = C, q = t.pendingProps, b = c.context, p = l.contextType, m = $n, typeof p == "object" && p !== null && (m = Zt(p)), o = l.getDerivedStateFromProps, (p = typeof o == "function" || typeof c.getSnapshotBeforeUpdate == "function") || typeof c.UNSAFE_componentWillReceiveProps != "function" && typeof c.componentWillReceiveProps != "function" || (u !== q || b !== m) && H2(
        t,
        c,
        a,
        m
      ), Za = !1, b = t.memoizedState, c.state = b, $c(t, a, c, n), Fc();
      var w = t.memoizedState;
      u !== q || b !== w || Za || e !== null && e.dependencies !== null && Xi(e.dependencies) ? (typeof o == "function" && (ao(
        t,
        l,
        o,
        a
      ), w = t.memoizedState), (C = Za || U2(
        t,
        l,
        C,
        a,
        b,
        w,
        m
      ) || e !== null && e.dependencies !== null && Xi(e.dependencies)) ? (p || typeof c.UNSAFE_componentWillUpdate != "function" && typeof c.componentWillUpdate != "function" || (typeof c.componentWillUpdate == "function" && c.componentWillUpdate(a, w, m), typeof c.UNSAFE_componentWillUpdate == "function" && c.UNSAFE_componentWillUpdate(
        a,
        w,
        m
      )), typeof c.componentDidUpdate == "function" && (t.flags |= 4), typeof c.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof c.componentDidUpdate != "function" || u === e.memoizedProps && b === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && b === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = w), c.props = a, c.state = w, c.context = m, a = C) : (typeof c.componentDidUpdate != "function" || u === e.memoizedProps && b === e.memoizedState || (t.flags |= 4), typeof c.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && b === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return c = a, ic(e, t), a = (t.flags & 128) !== 0, c || a ? (c = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : c.render(), t.flags |= 1, e !== null && a ? (t.child = On(
      t,
      e.child,
      null,
      n
    ), t.child = On(
      t,
      null,
      l,
      n
    )) : Lt(e, t, l, n), t.memoizedState = c.state, e = t.child) : e = xa(
      e,
      t,
      n
    ), e;
  }
  function $2(e, t, l, a) {
    return _n(), t.flags |= 256, Lt(e, t, l, a), t.child;
  }
  var oo = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function so(e) {
    return { baseLanes: e, cachePool: kr() };
  }
  function ro(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= Dl), e;
  }
  function W2(e, t, l) {
    var a = t.pendingProps, n = !1, c = (t.flags & 128) !== 0, u;
    if ((u = c) || (u = e !== null && e.memoizedState === null ? !1 : (Jt.current & 2) !== 0), u && (n = !0, t.flags &= -129), u = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Le) {
        if (n ? $a(t) : Wa(), (e = gt) ? (e = pd(
          e,
          Kl
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Ya !== null ? { id: sa, overflow: ra } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Or(e), l.return = t, t.child = l, Yt = t, gt = null)) : e = null, e === null) throw Ga(t);
        return rs(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return c = a.children, a = a.fallback, n ? (Wa(), n = t.mode, c = fu(
        { mode: "hidden", children: c },
        n
      ), a = Sn(
        a,
        n,
        l,
        null
      ), c.return = t, a.return = t, c.sibling = a, t.child = c, a = t.child, a.memoizedState = so(l), a.childLanes = ro(
        e,
        u,
        l
      ), t.memoizedState = oo, ti(null, a)) : ($a(t), fo(t, c));
    }
    var o = e.memoizedState;
    if (o !== null) {
      var m = o.dehydrated;
      if (m !== null)
        return Yh(
          e,
          t,
          c,
          u,
          a,
          m,
          o,
          l
        );
    }
    return n ? (Wa(), n = a.fallback, c = t.mode, o = e.child, m = o.sibling, a = za(o, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = o.subtreeFlags & 1206910976, m !== null ? n = za(m, n) : (n = Sn(
      n,
      c,
      l,
      null
    ), n.flags |= 2), n.return = t, a.return = t, a.sibling = n, t.child = a, ti(null, a), a = t.child, n = e.child.memoizedState, n === null ? n = so(l) : (c = n.cachePool, c !== null ? (o = Dt._currentValue, c = c.parent !== o ? { parent: o, pool: o } : c) : c = kr(), n = {
      baseLanes: n.baseLanes | l,
      cachePool: c
    }), a.memoizedState = n, a.childLanes = ro(
      e,
      u,
      l
    ), t.memoizedState = oo, ti(e.child, a)) : ($a(t), l = e.child, e = l.sibling, l = za(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (u = t.deletions, u === null ? (t.deletions = [e], t.flags |= 16) : u.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function fo(e, t) {
    return t = fu(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function fu(e, t) {
    return e = bl(22, e, null, t), e.lanes = 0, e;
  }
  function du(e, t, l) {
    return On(t, e.child, null, l), e = fo(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function Yh(e, t, l, a, n, c, u, o) {
    if (l)
      return t.flags & 256 ? ($a(t), t.flags &= -257, du(
        e,
        t,
        o
      )) : t.memoizedState !== null ? (Wa(), t.child = e.child, t.flags |= 128, null) : (Wa(), c = n.fallback, u = t.mode, n = fu(
        { mode: "visible", children: n.children },
        u
      ), c = Sn(
        c,
        u,
        o,
        null
      ), c.flags |= 2, n.return = t, c.return = t, n.sibling = c, t.child = n, On(t, e.child, null, o), n = t.child, n.memoizedState = so(o), n.childLanes = ro(
        e,
        a,
        o
      ), t.memoizedState = oo, ti(null, n));
    if ($a(t), rs(c)) {
      if (a = c.nextSibling && c.nextSibling.dataset, a) var m = a.dgst;
      return a = m, a !== "" && (n = Error(r(419)), n.stack = "", n.digest = a, Gc({ value: n, source: null, stack: null })), du(
        e,
        t,
        o
      );
    }
    if (Rt || wn(e, t, o, !1), a = (o & e.childLanes) !== 0, Rt || a) {
      if (Fa.current !== null)
        return du(
          e,
          t,
          o
        );
      if (a = mt, a !== null && (n = ue(
        a,
        o
      ), n !== 0 && n !== u.retryLane))
        throw u.retryLane = n, pn(e, n), _l(a, e, n), io;
      return ss(c) || Ou(), du(
        e,
        t,
        o
      );
    }
    return ss(c) ? (t.flags |= 192, t.child = e.child, null) : (e = u.treeContext, gt = Fl(c.nextSibling), Yt = t, Le = !0, Va = null, Kl = !1, e !== null && Rr(t, e), t = fo(
      t,
      n.children
    ), t.flags |= 134221824, t);
  }
  function I2(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Qi(e.return, t, l);
  }
  function P2(e) {
    for (var t = null; e !== null; ) {
      var l = e.alternate;
      l !== null && Pi(l) === null && (t = e), e = e.sibling;
    }
    return t;
  }
  function mu(e, t, l, a, n, c) {
    var u = e.memoizedState;
    u === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: c
    } : (u.isBackwards = t, u.rendering = null, u.renderingStartTime = 0, u.last = a, u.tail = l, u.tailMode = n, u.treeForkCount = c);
  }
  function mo(e) {
    var t = e.child;
    for (e.child = null; t !== null; ) {
      var l = t.sibling;
      t.sibling = e.child, e.child = t, t = l;
    }
  }
  function ho(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, c = a.tail;
    a = a.children;
    var u = Jt.current;
    if (t.flags & 128)
      return Wc(t, u), null;
    var o = (u & 2) !== 0;
    if (o ? (u = u & 1 | 2, t.flags |= 128) : u &= 1, Wc(t, u), n === "backwards" && e !== null ? (mo(e), Lt(e, t, a, l), mo(e)) : Lt(e, t, a, l), a = Le ? Vc : 0, !o && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && I2(e, l, t);
        else if (e.tag === 19)
          I2(e, l, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "backwards":
        l = P2(t.child), l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null, mo(t)), mu(
          t,
          !0,
          n,
          null,
          c,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && Pi(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        mu(
          t,
          !0,
          l,
          null,
          c,
          a
        );
        break;
      case "together":
        mu(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        l = P2(t.child), l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), mu(
          t,
          !1,
          n,
          l,
          c,
          a
        );
    }
    return t.child;
  }
  function ef(e, t, l) {
    var a = t.pendingProps;
    return Qa(t, t.type, a.value), Lt(e, t, a.children, l), t.child;
  }
  function xa(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), tn |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (wn(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (e = t.child, l = za(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = za(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function vo(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && Xi(e)));
  }
  function Vh(e, t, l) {
    switch (t.tag) {
      case 3:
        Bl(t, t.stateNode.containerInfo), Qa(t, Dt, e.memoizedState.cache), _n();
        break;
      case 27:
      case 5:
        kt(t);
        break;
      case 4:
        Bl(t, t.stateNode.containerInfo);
        break;
      case 10:
        Qa(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, k0(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return $a(t), t.flags |= 128, null;
          a = wn(
            e,
            t,
            l,
            !1
          );
          var n = t.child.childLanes;
          return a || (l & n) !== 0 ? W2(e, t, l) : ($a(t), e = xa(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        }
        $a(t);
        break;
      case 19:
        if (t.flags & 128)
          return ho(
            e,
            t,
            l
          );
        if (n = (e.flags & 128) !== 0, a = (l & t.childLanes) !== 0, a || (wn(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return ho(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), Wc(t, Jt.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, X2(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        Qa(t, Dt, e.memoizedState.cache);
    }
    return xa(e, t, l);
  }
  function tf(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        Rt = !0;
      else {
        if (!vo(e, l) && (t.flags & 128) === 0)
          return Rt = !1, Vh(
            e,
            t,
            l
          );
        Rt = (e.flags & 131072) !== 0;
      }
    else
      Rt = !1, Le && (t.flags & 1048576) !== 0 && xr(t, Vc, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = Mn(t.elementType), t.type = e, typeof e == "function")
            S0(e) ? (a = xn(e, a), t.tag = 1, t = F2(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = uo(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === M) {
                t.tag = 11, t = V2(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === Ee) {
                t.tag = 14, t = G2(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === Ze) {
                t.tag = 10, t.type = e, t = ef(
                  null,
                  t,
                  l
                );
                break e;
              }
            }
            throw t = Ue(e) || e, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return uo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = xn(
          a,
          t.pendingProps
        ), F2(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (Bl(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(r(387));
          a = t.pendingProps;
          var c = t.memoizedState;
          n = c.element, U0(e, t), $c(t, a, null, l);
          var u = t.memoizedState;
          if (a = u.cache, Qa(t, Dt, a), a !== c.cache && M0(
            t,
            [Dt],
            l,
            !0
          ), Fc(), a = u.element, c.isDehydrated)
            if (c = {
              element: a,
              isDehydrated: !1,
              cache: u.cache
            }, t.updateQueue.baseState = c, t.memoizedState = c, t.flags & 256) {
              t = $2(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Ql(
                Error(r(424)),
                t
              ), Gc(n), t = $2(
                e,
                t,
                a,
                l
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (gt = Fl(e.firstChild), Yt = t, Le = !0, Va = null, Kl = !0, l = Xr(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 134221824, l = l.sibling;
            }
          else {
            if (_n(), a === n) {
              t = xa(
                e,
                t,
                l
              );
              break e;
            }
            Lt(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return ic(e, t), e === null ? (l = Cd(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : Le || (t.stateNode = id(
          t.type,
          t.pendingProps,
          At.current,
          t
        )) : t.memoizedState = Cd(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return kt(t), e === null && Le && (a = t.stateNode = Nd(
          t.type,
          t.pendingProps,
          At.current
        ), Yt = t, Kl = !0, n = gt, cn(t.type) ? (fs = n, gt = Fl(a.firstChild)) : gt = n), Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), ic(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Le && ((n = a = gt) && (a = qv(
          a,
          t.type,
          t.pendingProps,
          Kl
        ), a !== null ? (t.stateNode = a, Yt = t, gt = Fl(a.firstChild), Kl = !1, n = !0) : n = !1), n || Ga(t)), kt(t), n = t.type, c = t.pendingProps, u = e !== null ? e.memoizedProps : null, a = c.children, ls(n, c) ? a = null : u !== null && ls(n, u) && (t.flags |= 32), t.memoizedState !== null && (n = V0(
          e,
          t,
          Dh,
          null,
          null,
          l
        ), wc._currentValue = n), ic(e, t), Lt(e, t, a, l), t.child;
      case 6:
        return e === null && Le && ((e = l = gt) && (l = Bv(
          l,
          t.pendingProps,
          Kl
        ), l !== null ? (t.stateNode = l, Yt = t, gt = null, e = !0) : e = !1), e || Ga(t)), null;
      case 13:
        return W2(e, t, l);
      case 4:
        return Bl(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = On(
          t,
          null,
          a,
          l
        ) : Lt(e, t, a, l), t.child;
      case 11:
        return V2(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return a = t.pendingProps, ic(e, t), Lt(e, t, a, l), t.child;
      case 8:
        return Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return ef(e, t, l);
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Tn(t), n = Zt(n), a = a(n), t.flags |= 1, Lt(e, t, a, l), t.child;
      case 14:
        return G2(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Q2(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return ho(e, t, l);
      case 31:
        return jh(e, t, l);
      case 22:
        return X2(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return Tn(t), a = Zt(Dt), e === null ? (n = D0(), n === null && (n = mt, c = A0(), n.pooledCache = c, c.refCount++, c !== null && (n.pooledCacheLanes |= l), n = c), t.memoizedState = { parent: a, cache: n }, R0(t), Qa(t, Dt, n)) : ((e.lanes & l) !== 0 && (U0(e, t), $c(t, null, null, l), Fc()), n = e.memoizedState, c = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), Qa(t, Dt, a)) : (a = c.cache, Qa(t, Dt, a), a !== n.cache && M0(
          t,
          [Dt],
          l,
          !0
        ))), Lt(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : Le && Vi(t), e !== null && e.memoizedProps.name !== a.name ? t.flags |= 4194816 : ic(e, t), Lt(e, t, a.children, l), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function Ra(e) {
    e.flags |= 4;
  }
  function go(e, t, l, a, n) {
    var c;
    if ((c = (e.mode & 32) !== 0) && (c = l === null ? Dd(t, a) : Dd(t, a) && (a.src !== l.src || a.srcSet !== l.srcSet)), c) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Bf()) e.flags |= 8192;
        else
          throw An = Fi, x0;
    } else e.flags &= -16777217;
  }
  function lf(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !xd(t))
      if (Bf()) e.flags |= 8192;
      else
        throw An = Fi, x0;
  }
  function hu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Pl() : 536870912, e.lanes |= t, fc |= t);
  }
  function li(e, t) {
    if (!Le)
      switch (e.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var l = e.tail, a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (t = e.tail, l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
      }
  }
  function yt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 1206910976, a |= n.flags & 1206910976, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function Gh(e, t, l) {
    var a = t.pendingProps;
    switch (w0(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return yt(t), null;
      case 1:
        return yt(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Aa(Dt), Pe(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (Pn(t) ? Ra(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, z0())), yt(t), null;
      case 26:
        var n = t.type, c = t.memoizedState;
        return e === null ? (Ra(t), c !== null ? (yt(t), lf(t, c)) : (yt(t), go(
          t,
          n,
          null,
          a,
          l
        ))) : c ? c !== e.memoizedState ? (Ra(t), yt(t), lf(t, c)) : (yt(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && Ra(t), yt(t), go(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (ul(t), l = At.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Ra(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return yt(t), t.subtreeFlags &= -33554433, null;
          }
          e = Tt.current, Pn(t) ? Ur(t) : (e = Nd(n, a, l), t.stateNode = e, Ra(t));
        }
        return yt(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (ul(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && Ra(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return yt(t), t.subtreeFlags &= -33554433, null;
          }
          if (c = Tt.current, Pn(t))
            Ur(t);
          else {
            var u = mi(
              At.current
            );
            switch (c) {
              case 1:
                c = u.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                c = u.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    c = u.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    c = u.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    c = u.createElement("div"), c.innerHTML = "<script><\/script>", c = c.removeChild(
                      c.firstChild
                    );
                    break;
                  case "select":
                    c = typeof a.is == "string" ? u.createElement("select", {
                      is: a.is
                    }) : u.createElement("select"), a.multiple ? c.multiple = !0 : a.size && (c.size = a.size);
                    break;
                  default:
                    c = typeof a.is == "string" ? u.createElement(n, { is: a.is }) : u.createElement(n);
                }
            }
            c[Ke] = t, c[$e] = a;
            e: for (u = t.child; u !== null; ) {
              if (u.tag === 5 || u.tag === 6)
                c.appendChild(u.stateNode);
              else if (u.tag !== 4 && u.tag !== 27 && u.child !== null) {
                u.child.return = u, u = u.child;
                continue;
              }
              if (u === t) break e;
              for (; u.sibling === null; ) {
                if (u.return === null || u.return === t)
                  break e;
                u = u.return;
              }
              u.sibling.return = u.return, u = u.sibling;
            }
            t.stateNode = c;
            e: switch ($t(c, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && Ra(t);
          }
        }
        return yt(t), t.subtreeFlags &= -33554433, go(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && Ra(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(r(166));
          if (e = At.current, Pn(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = Yt, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[Ke] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || ld(e.nodeValue, l)), e || Ga(t, !0);
          } else
            e = mi(e).createTextNode(
              a
            ), e[Ke] = t, t.stateNode = e;
        }
        return yt(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = Pn(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(557));
              e[Ke] = t;
            } else
              _n(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            yt(t), e = !1;
          } else
            l = z0(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (Ml(t), t) : (Ml(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(r(558));
        }
        return yt(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = Pn(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(r(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(r(317));
              n[Ke] = t;
            } else
              _n(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            yt(t), n = !1;
          } else
            n = z0(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (Ml(t), t) : (Ml(t), null);
        }
        return Ml(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), c = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (c = a.memoizedState.cachePool.pool), c !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), hu(t, t.updateQueue), yt(t), null);
      case 4:
        return Pe(), e === null && Wo(t.stateNode.containerInfo), t.flags |= 67108864, yt(t), null;
      case 10:
        return Aa(t.type), yt(t), null;
      case 19:
        if (j0(t), a = t.memoizedState, a === null) return yt(t), null;
        if (n = (t.flags & 128) !== 0, c = a.rendering, c === null)
          if (n) li(a, !1);
          else {
            if (Nt !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (c = Pi(e), c !== null) {
                  for (t.flags |= 128, li(a, !1), e = c.updateQueue, t.updateQueue = e, hu(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Ar(l, e), l = l.sibling;
                  return Wc(
                    t,
                    Jt.current & 1 | 2
                  ), Le && Ca(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && St() > zu && (t.flags |= 128, n = !0, li(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = Pi(c), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, hu(t, e), li(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !c.alternate && !Le)
                return yt(t), null;
            } else
              2 * St() - a.renderingStartTime > zu && l !== 536870912 && (t.flags |= 128, n = !0, li(a, !1), t.lanes = 4194304);
          a.isBackwards ? (c.sibling = t.child, t.child = c) : (e = a.last, e !== null ? e.sibling = c : t.child = c, a.last = c);
        }
        if (a.tail !== null) {
          e = a.tail;
          e: {
            for (l = e; l !== null; ) {
              if (l.alternate !== null) {
                l = !1;
                break e;
              }
              l = l.sibling;
            }
            l = !0;
          }
          return a.rendering = e, a.tail = e.sibling, a.renderingStartTime = St(), e.sibling = null, c = Jt.current, c = n ? c & 1 | 2 : c & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !l || Le ? Wc(t, c) : (l = c, ke(Kt, t), ke(Jt, l), cl === null && (cl = t)), Le && Ca(t, a.treeForkCount), e;
        }
        return yt(t), null;
      case 22:
      case 23:
        return Ml(t), L0(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (yt(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : yt(t), l = t.updateQueue, l !== null && hu(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && De(Cn), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Aa(Dt), yt(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, yt(t), null;
    }
    throw Error(r(156, t.tag));
  }
  function Qh(e, t) {
    switch (w0(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Aa(Dt), Pe(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return ul(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (Ml(t), t.alternate === null)
            throw Error(r(340));
          _n();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (Ml(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          _n();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return j0(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Pe(), null;
      case 10:
        return Aa(t.type), null;
      case 22:
      case 23:
        return Ml(t), L0(), e !== null && De(Cn), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Aa(Dt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function af(e, t) {
    switch (w0(t), t.tag) {
      case 3:
        Aa(Dt), Pe();
        break;
      case 26:
      case 27:
      case 5:
        ul(t);
        break;
      case 4:
        Pe();
        break;
      case 31:
        t.memoizedState !== null && Ml(t);
        break;
      case 13:
        Ml(t);
        break;
      case 19:
        j0(t);
        break;
      case 10:
        Aa(t.type);
        break;
      case 22:
      case 23:
        Ml(t), L0(), e !== null && De(Cn);
        break;
      case 24:
        Aa(Dt);
    }
  }
  function ai(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var c = l.create, u = l.inst;
            a = c(), u.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (o) {
      ot(t, t.return, o);
    }
  }
  function Ia(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var c = n.next;
        a = c;
        do {
          if ((a.tag & e) === e) {
            var u = a.inst, o = u.destroy;
            if (o !== void 0) {
              u.destroy = void 0, n = t;
              var m = l, p = o;
              try {
                p();
              } catch (C) {
                ot(
                  n,
                  m,
                  C
                );
              }
            }
          }
          a = a.next;
        } while (a !== c);
      }
    } catch (C) {
      ot(t, t.return, C);
    }
  }
  function nf(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Kr(t, l);
      } catch (a) {
        ot(e, e.return, a);
      }
    }
  }
  function cf(e, t, l) {
    l.props = xn(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      ot(e, t, a);
    }
  }
  function fa(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            var n = e.stateNode, c = wa(e.memoizedProps, n);
            (n.ref === null || n.ref.name !== c) && (n.ref = md(c)), a = n.ref;
            break;
          case 7:
            if (e.stateNode === null) {
              var u = new Rl(e);
              g(
                e.child,
                !1,
                Uv,
                u,
                void 0,
                void 0
              ), e.stateNode = u;
            }
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (o) {
      ot(e, t, o);
    }
  }
  function Ft(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          ot(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          ot(e, t, n);
        }
      else l.current = null;
  }
  function vu(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var l = 0; l < t.length; l++)
        Ed(
          e.stateNode,
          t[l]
        );
  }
  function uf(e) {
    for (var t = e.return; t !== null && (bo(t) && Ed(e.stateNode, t.stateNode), !yo(t)); )
      t = t.return;
  }
  function ni(e) {
    for (var t = e.return; t !== null && (bo(t) && Hv(e.stateNode, t.stateNode), !yo(t)); )
      t = t.return;
  }
  function yo(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function bo(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function Eo(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      ot(e, e.return, n);
    }
  }
  function po(e, t, l) {
    try {
      var a = e.stateNode;
      gv(a, e.type, l, t), a[$e] = t;
    } catch (n) {
      ot(e, e.return, n);
    }
  }
  function of(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && cn(e.type) || e.tag === 4;
  }
  function So(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || of(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && cn(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function _o(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      n = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(n, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(n), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = oa)), vu(e, a), tt = !0;
    else if (n !== 4 && (n === 27 && (vu(e, a), a = null, cn(e.type) && (l = e.stateNode, t = null)), e = e.child, e !== null))
      for (_o(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        _o(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function gu(e, t, l, a) {
    var n = e.tag;
    if (n === 5 || n === 6)
      n = e.stateNode, t ? l.insertBefore(n, t) : l.appendChild(n), vu(e, a), tt = !0;
    else if (n !== 4 && (n === 27 && (vu(e, a), a = null, cn(e.type) && (l = e.stateNode)), e = e.child, e !== null))
      for (gu(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        gu(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function sf(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      $t(t, a, l), t[Ke] = e, t[$e] = l;
    } catch (c) {
      ot(e, e.return, c);
    }
  }
  var yu = !1, Al = null;
  function rf(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (yu = !0);
  }
  var da = null;
  function ff() {
    var e = da;
    return da = null, e;
  }
  var El = 0;
  function uc(e, t, l, a, n) {
    return El = 0, df(
      e.child,
      t,
      l,
      a,
      n
    );
  }
  function df(e, t, l, a, n) {
    for (var c = !1; e !== null; ) {
      if (e.tag === 5) {
        var u = e.stateNode;
        if (a !== null) {
          var o = cs(u);
          a.push(o), o.view && (c = !0);
        } else
          c || cs(u).view && (c = !0);
        yu = !0, fd(
          u,
          El === 0 ? t : t + "_" + El,
          l
        ), El++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && n || df(
        e.child,
        t,
        l,
        a,
        n
      ) && (c = !0));
      e = e.sibling;
    }
    return c;
  }
  function ma(e, t) {
    for (; e !== null; )
      e.tag === 5 ? dd(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || ma(
        e.child,
        t
      )), e = e.sibling;
  }
  function bu(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if ((e.tag !== 22 || e.memoizedState === null) && (bu(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(r(544));
          var l = t.name;
          t = Ta(t.default, t.share), t !== "none" && (uc(
            e,
            l,
            t,
            null,
            !1
          ) || ma(e.child, !1));
        }
        e = e.sibling;
      }
  }
  function No(e, t) {
    if (e.tag === 30) {
      var l = e.stateNode, a = e.memoizedProps, n = wa(a, l), c = Ta(
        a.default,
        l.paired ? a.share : a.enter
      );
      c !== "none" ? uc(e, n, c, null, !1) ? (bu(e), l.paired || t || vc(e, a.onEnter)) : ma(e.child, !1) : bu(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        No(e, t), e = e.sibling;
    else bu(e);
  }
  function wo(e) {
    if (Al !== null && Al.size !== 0) {
      var t = Al;
      if ((e.subtreeFlags & 18874368) !== 0)
        for (e = e.child; e !== null; ) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && (e.flags & 18874368) !== 0) {
              var l = e.memoizedProps, a = l.name;
              if (a != null && a !== "auto") {
                var n = t.get(a);
                if (n !== void 0) {
                  var c = Ta(
                    l.default,
                    l.share
                  );
                  if (c !== "none" && (uc(
                    e,
                    a,
                    c,
                    null,
                    !1
                  ) ? (c = e.stateNode, n.paired = c, c.paired = n, vc(e, l.onShare)) : ma(e.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            wo(e);
          }
          e = e.sibling;
        }
    }
  }
  function To(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps, l = wa(t, e.stateNode), a = Al !== null ? Al.get(l) : void 0, n = Ta(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      n !== "none" && (uc(e, l, n, null, !1) ? a !== void 0 ? (n = e.stateNode, a.paired = n, n.paired = a, Al.delete(l), vc(e, t.onShare)) : vc(e, t.onExit) : ma(e.child, !1)), Al !== null && wo(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        To(e), e = e.sibling;
    else
      Al !== null && wo(e);
  }
  function mf(e) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var t = e.memoizedProps, l = wa(t, e.stateNode);
        t = Ta(t.default, t.update), e.flags &= -5, t !== "none" && uc(
          e,
          l,
          t,
          e.memoizedState = [],
          !1
        );
      } else
        (e.subtreeFlags & 33554432) !== 0 && mf(e);
      e = e.sibling;
    }
  }
  function zo(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && (t.paired = null, ma(e.child, !1));
          }
          zo(e);
        }
        e = e.sibling;
      }
  }
  function Eu(e) {
    if (e.tag === 30)
      e.stateNode.paired = null, ma(e.child, !1), zo(e);
    else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Eu(e), e = e.sibling;
    else zo(e);
  }
  function hf(e) {
    for (e = e.child; e !== null; )
      e.tag === 30 ? ma(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && hf(e), e = e.sibling;
  }
  function Co(e, t, l, a, n, c, u) {
    for (var o = !1; t !== null; ) {
      if (t.tag === 5) {
        var m = t.stateNode;
        if (c !== null && El < c.length) {
          var p = c[El], C = cs(m);
          (p.view || C.view) && (o = !0);
          var q;
          if (q = (e.flags & 4) === 0)
            if (C.clip) q = !0;
            else {
              q = p.rect;
              var b = C.rect;
              q = q.y !== b.y || q.x !== b.x || q.height !== b.height || q.width !== b.width;
            }
          q && (e.flags |= 4), C.abs ? C = !p.abs : (p = p.rect, C = C.rect, C = p.height !== C.height || p.width !== C.width), C && (e.flags |= 32);
        } else e.flags |= 32;
        (e.flags & 4) !== 0 && fd(
          m,
          El === 0 ? l : l + "_" + El,
          n
        ), o && (e.flags & 4) !== 0 || (da === null && (da = []), da.push(
          m,
          El === 0 ? a : a + "_" + El,
          t.memoizedProps
        )), El++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && u ? e.flags |= t.flags & 32 : Co(
        e,
        t.child,
        l,
        a,
        n,
        c,
        u
      ) && (o = !0));
      t = t.sibling;
    }
    return o;
  }
  function vf(e, t) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var l = e.memoizedProps, a = e.stateNode, n = wa(l, a), c = Ta(l.default, l.update), u;
        u = e.memoizedState, e.memoizedState = null, a = e;
        var o = e.child;
        El = 0, n = Co(
          a,
          o,
          n,
          n,
          c,
          u,
          !1
        ), (e.flags & 4) !== 0 && n && vc(e, l.onUpdate);
      } else
        (e.subtreeFlags & 33554432) !== 0 && vf(e);
      e = e.sibling;
    }
  }
  var Vt = !1, nt = !1, ha = !1, Mo = !1, gf = typeof WeakSet == "function" ? WeakSet : Set, Gt = null, va = !1, ci = !1, pu = !1, Ao = !1;
  function Xh(e, t, l) {
    if (e = e.containerInfo, es = Tc, e = Er(e), h0(e)) {
      if ("selectionStart" in e)
        var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var n = a.getSelection && a.getSelection();
          if (n && n.rangeCount !== 0) {
            a = n.anchorNode;
            var c = n.anchorOffset, u = n.focusNode;
            n = n.focusOffset;
            try {
              a.nodeType, u.nodeType;
            } catch {
              a = null;
              break e;
            }
            var o = 0, m = -1, p = -1, C = 0, q = 0, b = e, w = null;
            t: for (; ; ) {
              for (var P; b !== a || c !== 0 && b.nodeType !== 3 || (m = o + c), b !== u || n !== 0 && b.nodeType !== 3 || (p = o + n), b.nodeType === 3 && (o += b.nodeValue.length), (P = b.firstChild) !== null; )
                w = b, b = P;
              for (; ; ) {
                if (b === e) break t;
                if (w === a && ++C === c && (m = o), w === u && ++q === n && (p = o), (P = b.nextSibling) !== null) break;
                b = w, w = b.parentNode;
              }
              b = P;
            }
            a = m === -1 || p === -1 ? null : { start: m, end: p };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (ts = { focusedElem: e, selectionRange: a }, Tc = !1, l = (l & 335544064) === l, Gt = t, t = l ? 9270 : 1024; Gt !== null; ) {
      if (e = Gt, l && (a = e.deletions, a !== null))
        for (c = 0; c < a.length; c++)
          l && To(a[c]);
      if (e.alternate === null && (e.flags & 2) !== 0)
        l && rf(e), Su(l);
      else {
        if (e.tag === 22) {
          if (a = e.alternate, e.memoizedState !== null) {
            a !== null && a.memoizedState === null && l && To(a), Su(l);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            l && rf(e), Su(l);
            continue;
          }
        }
        a = e.child, (e.subtreeFlags & t) !== 0 && a !== null ? (a.return = e, Gt = a) : (l && mf(e), Su(l));
      }
    }
    Al = null;
  }
  function Su(e) {
    for (; Gt !== null; ) {
      var t = Gt, l = e, a = t.alternate, n = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((n & 1024) !== 0 && a !== null) {
            l = void 0, n = a.memoizedProps, a = a.memoizedState;
            var c = t.stateNode;
            try {
              var u = xn(
                t.type,
                n
              );
              l = c.getSnapshotBeforeUpdate(
                u,
                a
              ), c.__reactInternalSnapshotBeforeUpdate = l;
            } catch (o) {
              ot(t, t.return, o);
            }
          }
          break;
        case 3:
          if ((n & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, l = a.nodeType, l === 9)
              os(a);
            else if (l === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  os(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          l && a !== null && (l = wa(
            a.memoizedProps,
            a.stateNode
          ), n = t.memoizedProps, n = Ta(n.default, n.update), n !== "none" && uc(
            a,
            l,
            n,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((n & 1024) !== 0) throw Error(r(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, Gt = a;
        break;
      }
      Gt = t.return;
    }
  }
  function yf(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        ga(e, l), a & 4 && ai(5, l);
        break;
      case 1:
        if (ga(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (u) {
              ot(l, l.return, u);
            }
          else {
            var n = xn(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (u) {
              ot(
                l,
                l.return,
                u
              );
            }
          }
        a & 64 && nf(l), a & 512 && fa(l, l.return);
        break;
      case 3:
        if (ga(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            Kr(e, t);
          } catch (u) {
            ot(l, l.return, u);
          }
        }
        break;
      case 27:
        t === null && a & 4 && sf(l);
      case 26:
      case 5:
        ga(e, l), t === null && a & 4 && Eo(l), a & 512 && fa(l, l.return);
        break;
      case 12:
        ga(e, l);
        break;
      case 31:
        ga(e, l), a & 4 && Sf(e, l);
        break;
      case 13:
        ga(e, l), a & 4 && _f(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = av.bind(
          null,
          l
        ), Lv(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || Vt, !a) {
          var c = t !== null && t.memoizedState !== null || nt;
          t = Vt, n = nt, Vt = a, (nt = c) && !n ? (a = 2, (l.subtreeFlags & 8772) !== 0 && (a |= 1), aa(
            e,
            l,
            a
          )) : ga(e, l), Vt = t, nt = n;
        }
        break;
      case 30:
        ga(e, l), a & 512 && fa(l, l.return);
        break;
      case 7:
        a & 512 && fa(l, l.return);
      default:
        ga(e, l);
    }
  }
  function Oo(e, t) {
    for (e = e.child; e !== null; )
      bf(e, t), e = e.sibling;
  }
  function bf(e, t) {
    switch (e.tag) {
      case 5:
      case 26:
        try {
          var l = e.stateNode;
          if (t) {
            var a = l.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var n = e.stateNode, c = e.memoizedProps.style, u = c != null && c.hasOwnProperty("display") ? c.display : null;
            n.style.display = u == null || typeof u == "boolean" ? "" : ("" + u).trim();
          }
        } catch (m) {
          ot(e, e.return, m);
        }
        Do(e, t);
        break;
      case 6:
        try {
          e.stateNode.nodeValue = t ? "" : e.memoizedProps, tt = !0;
        } catch (m) {
          ot(e, e.return, m);
        }
        break;
      case 18:
        try {
          var o = e.stateNode;
          t ? rd(o, !0) : rd(e.stateNode, !1);
        } catch (m) {
          ot(e, e.return, m);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && Oo(e, t);
        break;
      default:
        Oo(e, t);
    }
  }
  function Do(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null; ) {
        e: {
          var l = e, a = t;
          switch (l.tag) {
            case 4:
              bf(l, a);
              break e;
            case 22:
              l.memoizedState === null && Do(l, a);
              break e;
            default:
              Do(l, a);
          }
        }
        e = e.sibling;
      }
  }
  function Ef(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Ef(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && Ie(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var bt = null, pl = !1;
  function ta(e, t, l) {
    for (l = l.child; l !== null; )
      pf(e, t, l), l = l.sibling;
  }
  function pf(e, t, l) {
    if (W && typeof W.onCommitFiberUnmount == "function")
      try {
        W.onCommitFiberUnmount(jl, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        nt || Ft(l, t), ta(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && !nt && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        nt || Ft(l, t), ni(l);
        var a = bt, n = pl;
        cn(l.type) && (bt = l.stateNode, pl = !1), ta(
          e,
          t,
          l
        ), wd(
          l.stateNode,
          l.type,
          l.memoizedProps
        ), bt = a, pl = n;
        break;
      case 5:
        nt || Ft(l, t), ni(l);
      case 6:
        if (l.tag === 6 && ni(l), a = bt, n = pl, bt = null, ta(
          e,
          t,
          l
        ), bt = a, pl = n, bt !== null)
          if (pl)
            try {
              (bt.nodeType === 9 ? bt.body : bt.nodeName === "HTML" ? bt.ownerDocument.body : bt).removeChild(l.stateNode), tt = !0;
            } catch (c) {
              ot(
                l,
                t,
                c
              );
            }
          else
            try {
              bt.removeChild(l.stateNode), tt = !0;
            } catch (c) {
              ot(
                l,
                t,
                c
              );
            }
        break;
      case 18:
        bt !== null && (pl ? (e = bt, sd(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), zc(e)) : sd(bt, l.stateNode));
        break;
      case 4:
        a = bt, n = pl, bt = l.stateNode.containerInfo, pl = !0, ta(
          e,
          t,
          l
        ), bt = a, pl = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        Ia(2, l, t), nt || Ia(4, l, t), ta(
          e,
          t,
          l
        );
        break;
      case 1:
        nt || (Ft(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && cf(
          l,
          t,
          a
        )), ta(
          e,
          t,
          l
        );
        break;
      case 21:
        ta(
          e,
          t,
          l
        );
        break;
      case 22:
        nt = (a = nt) || l.memoizedState !== null, ta(
          e,
          t,
          l
        ), nt = a;
        break;
      case 30:
        Ft(l, t), ta(
          e,
          t,
          l
        );
        break;
      case 7:
        nt || Ft(l, t), ta(
          e,
          t,
          l
        );
        break;
      default:
        ta(
          e,
          t,
          l
        );
    }
  }
  function Sf(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        zc(e);
      } catch (l) {
        ot(t, t.return, l);
      }
    }
  }
  function _f(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        zc(e);
      } catch (l) {
        ot(t, t.return, l);
      }
  }
  function Zh(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new gf()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new gf()), t;
      default:
        throw Error(r(435, e.tag));
    }
  }
  function _u(e, t) {
    var l = Zh(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = nv.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function fl(e, t, l) {
    var a = t.deletions;
    if (a !== null)
      for (var n = 0; n < a.length; n++) {
        var c = a[n], u = e, o = t, m = o;
        e: for (; m !== null; ) {
          switch (m.tag) {
            case 27:
              if (cn(m.type)) {
                bt = m.stateNode, pl = !1;
                break e;
              }
              break;
            case 5:
              bt = m.stateNode, pl = !1;
              break e;
            case 3:
            case 4:
              bt = m.stateNode.containerInfo, pl = !0;
              break e;
          }
          m = m.return;
        }
        if (bt === null) throw Error(r(160));
        pf(u, o, c), bt = null, pl = !1, u = c.alternate, u !== null && (u.return = null), c.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Nf(t, e, l), t = t.sibling;
  }
  var la = null;
  function Nf(e, t, l) {
    var a = e.alternate, n = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (n & 4 && (a = e.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var c = 0; c < a.length; c++) {
            var u = a[c];
            u.ref.impl = u.nextImpl;
          }
        fl(t, e, l), dl(e), n & 4 && (Ia(3, e, e.return), ai(3, e), Ia(5, e, e.return));
        break;
      case 1:
        fl(t, e, l), dl(e), n & 512 && (nt || a === null || Ft(a, a.return)), n & 64 && Vt && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? t : l.concat(t))));
        break;
      case 26:
        if (c = la, fl(t, e, l), dl(e), n & 512 && (nt || a === null || Ft(a, a.return)), n & 4)
          if (n = a !== null ? a.memoizedState : null, l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null)
                if (Vt)
                  e.stateNode = id(
                    e.type,
                    e.memoizedProps,
                    t.containerInfo,
                    e
                  );
                else {
                  e: {
                    t = e.type, l = e.memoizedProps, n = c.ownerDocument || c;
                    t: switch (t) {
                      case "title":
                        a = n.getElementsByTagName("title")[0], (!a || a[ee] || a[Ke] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = n.createElement(t), n.head.insertBefore(
                          a,
                          n.querySelector("head > title")
                        )), $t(a, t, l), a[Ke] = e, jt(a), t = a;
                        break e;
                      case "link":
                        if (c = Od(
                          "link",
                          "href",
                          n
                        ).get(t + (l.href || ""))) {
                          for (u = 0; u < c.length; u++)
                            if (a = c[u], a.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && a.getAttribute("rel") === (l.rel == null ? null : l.rel) && a.getAttribute("title") === (l.title == null ? null : l.title) && a.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                              c.splice(u, 1);
                              break t;
                            }
                        }
                        a = n.createElement(t), $t(a, t, l), n.head.appendChild(a);
                        break;
                      case "meta":
                        if (c = Od(
                          "meta",
                          "content",
                          n
                        ).get(t + (l.content || ""))) {
                          for (u = 0; u < c.length; u++)
                            if (a = c[u], a.getAttribute("content") === (l.content == null ? null : "" + l.content) && a.getAttribute("name") === (l.name == null ? null : l.name) && a.getAttribute("property") === (l.property == null ? null : l.property) && a.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && a.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                              c.splice(u, 1);
                              break t;
                            }
                        }
                        a = n.createElement(t), $t(a, t, l), n.head.appendChild(a);
                        break;
                      default:
                        throw Error(r(468, t));
                    }
                    a[Ke] = e, jt(a), t = a;
                  }
                  e.stateNode = t;
                }
              else
                Vt || vs(c, e.type, e.stateNode);
            else
              e.stateNode = Ad(
                c,
                l,
                e.memoizedProps
              );
          else
            n !== l ? (n === null ? (t = a.stateNode, t === null || nt || t.parentNode.removeChild(t)) : n.count--, l === null ? Vt || vs(c, e.type, e.stateNode) : Ad(c, l, e.memoizedProps)) : l === null && e.stateNode !== null && po(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        fl(t, e, l), dl(e), n & 512 && (nt || a === null || Ft(a, a.return)), a !== null && n & 4 && po(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (c = ha, ha = !1, fl(t, e, l), ha = c, dl(e), n & 512 && (nt || a === null || Ft(a, a.return)), e.flags & 32) {
          t = e.stateNode;
          try {
            Gn(t, ""), tt = !0;
          } catch (C) {
            ot(e, e.return, C);
          }
        }
        n & 4 && e.stateNode != null && (t = e.memoizedProps, po(
          e,
          t,
          a !== null ? a.memoizedProps : t
        )), n & 1024 && (Mo = !0);
        break;
      case 6:
        if (fl(t, e, l), dl(e), n & 4) {
          if (e.stateNode === null)
            throw Error(r(162));
          t = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = t, tt = !0;
          } catch (C) {
            ot(e, e.return, C);
          }
        }
        break;
      case 3:
        if (tt = !1, Bu = null, c = la, la = hi(t.containerInfo), fl(t, e, l), la = c, dl(e), n & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            zc(t.containerInfo);
          } catch (C) {
            ot(e, e.return, C);
          }
        Mo && (Mo = !1, wf(e)), tt = !1;
        break;
      case 4:
        n = ha, ha = Vt, a = Gs(), c = la, la = hi(
          e.stateNode.containerInfo
        ), fl(t, e, l), dl(e), la = c, tt && ci && (pu = !0), tt = a, ha = n;
        break;
      case 12:
        fl(t, e, l), dl(e);
        break;
      case 31:
        fl(t, e, l), dl(e), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, _u(e, t)));
        break;
      case 13:
        fl(t, e, l), dl(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Tu = St()), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, _u(e, t)));
        break;
      case 22:
        c = e.memoizedState !== null, u = a !== null && a.memoizedState !== null;
        var o = Vt, m = nt, p = ha;
        Vt = o || c, ha = p || c, nt = m || u, fl(t, e, l), nt = m, ha = p, Vt = o, dl(e), n & 8192 && (t = e.stateNode, t._visibility = c ? t._visibility & -2 : t._visibility | 1, !c || a === null || u || Vt || nt || (t = u || nt, l = Vt, a = nt, Vt = c || Vt, nt = t, Pa(e, 2), Vt = l, nt = a), !c && ha || Oo(e, c)), n & 4 && (t = e.updateQueue, t !== null && (l = t.retryQueue, l !== null && (t.retryQueue = null, _u(e, l))));
        break;
      case 19:
        fl(t, e, l), dl(e), n & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, _u(e, t)));
        break;
      case 30:
        n & 512 && (nt || a === null || Ft(a, a.return)), n = Gs(), c = ci, u = (l & 335544064) === l, o = e.memoizedProps, ci = u && Ta(
          o.default,
          o.update
        ) !== "none", fl(t, e, l), dl(e), u && a !== null && tt && (e.flags |= 4), ci = c, tt = n;
        break;
      case 21:
        break;
      case 7:
        n & 512 && (nt || a === null || Ft(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = e);
      default:
        fl(t, e, l), dl(e);
    }
  }
  function dl(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (of(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var n = e.return; n !== null; ) {
          if (bo(n)) {
            var c = n.stateNode;
            a === null ? a = [c] : a.push(c);
          }
          if (yo(n)) break;
          n = n.return;
        }
        var u = a;
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var o = l.stateNode, m = So(e);
            gu(
              e,
              m,
              o,
              u
            );
            break;
          case 5:
            var p = l.stateNode;
            l.flags & 32 && (Gn(p, ""), l.flags &= -33);
            var C = So(e);
            gu(
              e,
              C,
              p,
              u
            );
            break;
          case 3:
          case 4:
            var q = l.stateNode.containerInfo, b = So(e);
            _o(
              e,
              b,
              q,
              u
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (w) {
        ot(e, e.return, w);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wf(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        wf(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, Tc = !0, t.reset(), Tc = !1), e = e.sibling;
      }
  }
  function oc(e, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Tf(t, e), t = t.sibling;
    else vf(t);
  }
  function Tf(e, t) {
    var l = e.alternate;
    if (l === null) No(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (Ao = va = !1, ff(), oc(t, e), !va && !pu) {
            if (e = da, e !== null)
              for (var a = 0; a < e.length; a += 3) {
                l = e[a];
                var n = e[a + 1];
                dd(l, e[a + 2]), l = l.ownerDocument.documentElement, l !== null && l.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + n + ")"
                  }
                );
              }
            e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), e.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), Ao = !0;
          }
          da = null;
          break;
        case 5:
          oc(t, e);
          break;
        case 4:
          a = va, va = !1, oc(t, e), va && (pu = !0), va = a;
          break;
        case 22:
          e.memoizedState === null && (l.memoizedState !== null ? No(e, !1) : oc(t, e));
          break;
        case 30:
          a = va, n = ff(), va = !1, oc(t, e), va && (e.flags |= 4);
          var c = e.memoizedProps, u = e.stateNode;
          t = wa(c, u), u = wa(l.memoizedProps, u);
          var o = Ta(c.default, c.update);
          o === "none" ? t = !1 : (c = l.memoizedState, l.memoizedState = null, l = e.child, El = 0, t = Co(
            e,
            l,
            t,
            u,
            o,
            c,
            !0
          ), El !== (c === null ? 0 : c.length) && (e.flags |= 32)), (e.flags & 4) !== 0 && t ? (vc(
            e,
            e.memoizedProps.onUpdate
          ), da = n) : n !== null && (n.push.apply(n, da), da = n), va = (e.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          oc(t, e);
      }
  }
  function ga(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        yf(e, t.alternate, t), t = t.sibling;
  }
  function Pa(e, t) {
    for (e = e.child; e !== null; ) {
      var l = e, a = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          Ia(4, l, l.return), Pa(
            l,
            a
          );
          break;
        case 1:
          Ft(l, l.return);
          var n = l.stateNode;
          typeof n.componentWillUnmount == "function" && cf(
            l,
            l.return,
            n
          ), Pa(
            l,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && wd(
            l.stateNode,
            l.type,
            l.memoizedProps
          );
        case 5:
          Ft(l, l.return), l.tag !== 5 && l.tag !== 27 || ni(l), Pa(
            l,
            a
          );
          break;
        case 6:
          ni(l);
          break;
        case 26:
          Ft(l, l.return), n = l.stateNode, l.memoizedState !== null || n === null || nt || n.parentNode.removeChild(n), Pa(
            l,
            a
          );
          break;
        case 22:
          l.memoizedState === null && Pa(
            l,
            a
          );
          break;
        case 30:
          Ft(l, l.return), Pa(
            l,
            a
          );
          break;
        case 7:
          Ft(l, l.return);
        default:
          Pa(
            l,
            a
          );
      }
      e = e.sibling;
    }
  }
  function aa(e, t, l) {
    for (l = (t.subtreeFlags & 8772) !== 0 ? l : l & -2, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, c = t, u = c.flags, o = (l & 1) !== 0;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          aa(
            n,
            c,
            l
          ), ai(4, c);
          break;
        case 1:
          if (aa(
            n,
            c,
            l
          ), a = c, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (C) {
              ot(a, a.return, C);
            }
          if (a = c, n = a.updateQueue, n !== null) {
            var m = a.stateNode;
            try {
              var p = n.shared.hiddenCallbacks;
              if (p !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < p.length; n++)
                  Zr(p[n], m);
            } catch (C) {
              ot(a, a.return, C);
            }
          }
          o && u & 64 && nf(c), fa(c, c.return);
          break;
        case 27:
          (l & 2) !== 0 && sf(c);
        case 5:
          c.tag !== 5 && c.tag !== 27 || uf(c), aa(
            n,
            c,
            l
          ), o && a === null && u & 4 && Eo(c), fa(c, c.return);
          break;
        case 6:
          uf(c);
          break;
        case 26:
          m = c.stateNode, c.memoizedState !== null || m === null || Vt || vs(
            hi(m.ownerDocument),
            c.type,
            m
          ), aa(
            n,
            c,
            l
          ), o && a === null && u & 4 && Eo(c), fa(c, c.return);
          break;
        case 12:
          aa(
            n,
            c,
            l
          );
          break;
        case 31:
          aa(
            n,
            c,
            l
          ), o && u & 4 && Sf(n, c);
          break;
        case 13:
          aa(
            n,
            c,
            l
          ), o && u & 4 && _f(n, c);
          break;
        case 22:
          c.memoizedState === null && aa(
            n,
            c,
            l
          ), fa(c, c.return);
          break;
        case 30:
          aa(
            n,
            c,
            l
          ), fa(c, c.return);
          break;
        case 7:
          fa(c, c.return);
        default:
          aa(
            n,
            c,
            l
          );
      }
      t = t.sibling;
    }
  }
  function xo(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Qc(l));
  }
  function Ro(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Qc(e));
  }
  function Jl(e, t, l, a) {
    var n = (l & 335544064) === l;
    if (t.subtreeFlags & (n ? 10262 : 10256))
      for (t = t.child; t !== null; )
        zf(
          e,
          t,
          l,
          a
        ), t = t.sibling;
    else n && hf(t);
  }
  function zf(e, t, l, a) {
    var n = (l & 335544064) === l;
    n && t.alternate === null && t.return !== null && t.return.alternate !== null && Eu(t);
    var c = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Jl(
          e,
          t,
          l,
          a
        ), c & 2048 && ai(9, t);
        break;
      case 1:
        Jl(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Jl(
          e,
          t,
          l,
          a
        ), n && Ao && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), c & 2048 && (c = null, t.alternate !== null && (c = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== c && (t.refCount++, c != null && Qc(c)));
        break;
      case 12:
        if (c & 2048) {
          Jl(
            e,
            t,
            l,
            a
          ), c = t.stateNode;
          try {
            var u = t.memoizedProps, o = u.id, m = u.onPostCommit;
            typeof m == "function" && m(
              o,
              t.alternate === null ? "mount" : "update",
              c.passiveEffectDuration,
              -0
            );
          } catch (p) {
            ot(t, t.return, p);
          }
        } else
          Jl(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Jl(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Jl(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, o = t.alternate, t.memoizedState !== null ? (n && o !== null && o.memoizedState === null && Eu(o), u._visibility & 2 ? Jl(
          e,
          t,
          l,
          a
        ) : ii(
          e,
          t
        )) : (n && o !== null && o.memoizedState !== null && Eu(t), u._visibility & 2 ? Jl(
          e,
          t,
          l,
          a
        ) : (u._visibility |= 2, sc(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), c & 2048 && xo(o, t);
        break;
      case 24:
        Jl(
          e,
          t,
          l,
          a
        ), c & 2048 && Ro(t.alternate, t);
        break;
      case 30:
        n && (c = t.alternate, c !== null && (ma(c.child, !0), ma(t.child, !0))), Jl(
          e,
          t,
          l,
          a
        );
        break;
      default:
        Jl(
          e,
          t,
          l,
          a
        );
    }
  }
  function sc(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var c = e, u = t, o = l, m = a, p = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          sc(
            c,
            u,
            o,
            m,
            n
          ), ai(8, u);
          break;
        case 23:
          break;
        case 22:
          var C = u.stateNode;
          u.memoizedState !== null ? C._visibility & 2 ? sc(
            c,
            u,
            o,
            m,
            n
          ) : ii(
            c,
            u
          ) : (C._visibility |= 2, sc(
            c,
            u,
            o,
            m,
            n
          )), n && p & 2048 && xo(
            u.alternate,
            u
          );
          break;
        case 24:
          sc(
            c,
            u,
            o,
            m,
            n
          ), n && p & 2048 && Ro(u.alternate, u);
          break;
        default:
          sc(
            c,
            u,
            o,
            m,
            n
          );
      }
      t = t.sibling;
    }
  }
  function ii(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            ii(l, a), n & 2048 && xo(
              a.alternate,
              a
            );
            break;
          case 24:
            ii(l, a), n & 2048 && Ro(a.alternate, a);
            break;
          default:
            ii(l, a);
        }
        t = t.sibling;
      }
  }
  var Rn = 8192;
  function Un(e, t, l) {
    if (e.subtreeFlags & Rn)
      for (e = e.child; e !== null; )
        Cf(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function Cf(e, t, l) {
    switch (e.tag) {
      case 26:
        Un(
          e,
          t,
          l
        ), e.flags & Rn && (e.memoizedState !== null ? Iv(
          l,
          la,
          e.memoizedState,
          e.memoizedProps
        ) : (e = e.stateNode, (t & 335544128) === t && Ud(l, e)));
        break;
      case 5:
        Un(
          e,
          t,
          l
        ), e.flags & Rn && (e = e.stateNode, (t & 335544128) === t && Ud(l, e));
        break;
      case 3:
      case 4:
        var a = la;
        la = hi(e.stateNode.containerInfo), Un(
          e,
          t,
          l
        ), la = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = Rn, Rn = 16777216, Un(
          e,
          t,
          l
        ), Rn = a) : Un(
          e,
          t,
          l
        ));
        break;
      case 30:
        if ((e.flags & Rn) !== 0 && (a = e.memoizedProps.name, a != null && a !== "auto")) {
          var n = e.stateNode;
          n.paired = null, Al === null && (Al = /* @__PURE__ */ new Map()), Al.set(a, n);
        }
        Un(
          e,
          t,
          l
        );
        break;
      default:
        Un(
          e,
          t,
          l
        );
    }
  }
  function Mf(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function ui(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Gt = a, Of(
            a,
            e
          );
        }
      Mf(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Af(e), e = e.sibling;
  }
  function Af(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        ui(e), e.flags & 2048 && Ia(9, e, e.return);
        break;
      case 3:
        ui(e);
        break;
      case 12:
        ui(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Nu(e)) : ui(e);
        break;
      default:
        ui(e);
    }
  }
  function Nu(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Gt = a, Of(
            a,
            e
          );
        }
      Mf(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          Ia(8, t, t.return), Nu(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Nu(t));
          break;
        default:
          Nu(t);
      }
      e = e.sibling;
    }
  }
  function Of(e, t) {
    for (; Gt !== null; ) {
      var l = Gt;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          Ia(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Qc(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Gt = a;
      else
        e: for (l = e; Gt !== null; ) {
          a = Gt;
          var n = a.sibling, c = a.return;
          if (Ef(a), a === l) {
            Gt = null;
            break e;
          }
          if (n !== null) {
            n.return = c, Gt = n;
            break e;
          }
          Gt = c;
        }
    }
  }
  var Kh = {
    getCacheForType: function(e) {
      var t = Zt(Dt), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return Zt(Dt).controller.signal;
    }
  }, Jh = typeof WeakMap == "function" ? WeakMap : Map, lt = 0, mt = null, je = null, Qe = 0, ut = 0, Ol = null, en = !1, rc = !1, Uo = !1, Ua = 0, Nt = 0, tn = 0, Hn = 0, wu = 0, Dl = 0, fc = 0, oi = null, Sl = null, Ho = !1, Tu = 0, Df = 0, zu = 1 / 0, Cu = null, ln = null, pt = 0, na = null, qn = null, ya = 0, qo = 0, Bo = null, xf = null, dc = null, mc = null, hc = null, si = 0, Mu = null;
  function xl() {
    return (lt & 2) !== 0 && Qe !== 0 ? Qe & -Qe : ne.T !== null ? Ko() : et();
  }
  function Rf() {
    if (Dl === 0)
      if ((Qe & 536870912) === 0 || Le) {
        var e = al;
        al <<= 1, (al & 3932160) === 0 && (al = 262144), Dl = e;
      } else Dl = 536870912;
    return e = Kt.current, e !== null && (e.flags |= 32), Dl;
  }
  function vc(e, t) {
    if (t != null) {
      var l = e.stateNode, a = l.ref;
      a === null && (a = l.ref = md(
        wa(e.memoizedProps, l)
      )), mc === null && (mc = []), mc.push(t.bind(null, a));
    }
  }
  function _l(e, t, l) {
    (e === mt && (ut === 2 || ut === 9) || e.cancelPendingCommit !== null) && (gc(e, 0), an(
      e,
      Qe,
      Dl,
      !1
    )), ol(e, l), ((lt & 2) === 0 || e !== mt) && (e === mt && ((lt & 2) === 0 && (Hn |= l), Nt === 4 && an(
      e,
      Qe,
      Dl,
      !1
    )), ba(e));
  }
  function Uf(e, t, l) {
    if ((lt & 6) !== 0) throw Error(r(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Sa(e, t), n = a ? Wh(e, t) : ko(e, t, !0), c = a;
    do {
      if (n === 0) {
        rc && !a && an(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, c && !Fh(l)) {
          n = ko(e, t, !1), c = !1;
          continue;
        }
        if (n === 2) {
          if (c = t, e.errorRecoveryDisabledLanes & c)
            var u = 0;
          else
            u = e.pendingLanes & -536870913, u = u !== 0 ? u : u & 536870912 ? 536870912 : 0;
          if (u !== 0) {
            t = u;
            e: {
              var o = e;
              n = oi;
              var m = o.current.memoizedState.isDehydrated;
              if (m && (gc(o, u).flags |= 256), u = ko(
                o,
                u,
                !1
              ), u !== 2 && u !== 6) {
                if (Uo && !m) {
                  o.errorRecoveryDisabledLanes |= c, Hn |= c, n = 4;
                  break e;
                }
                c = Sl, Sl = n, c !== null && (Sl === null ? Sl = c : Sl.push.apply(
                  Sl,
                  c
                ));
              }
              n = u;
            }
            if (c = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          gc(e, 0), an(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, c = n, c) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              an(
                a,
                t,
                Dl,
                !en
              );
              break e;
            case 2:
              Sl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (n = Tu + 300 - St(), 10 < n)) {
            if (an(
              a,
              t,
              Dl,
              !en
            ), ua(a, 0, !0) !== 0) break e;
            ya = t, a.timeoutHandle = ns(
              Hf.bind(
                null,
                a,
                l,
                Sl,
                Cu,
                Ho,
                t,
                Dl,
                Hn,
                fc,
                en,
                c,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          Hf(
            a,
            l,
            Sl,
            Cu,
            Ho,
            t,
            Dl,
            Hn,
            fc,
            en,
            c,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    ba(e);
  }
  function Hf(e, t, l, a, n, c, u, o, m, p, C, q, b, w) {
    e.timeoutHandle = -1;
    var P = t.subtreeFlags, de = (c & 335544064) === c;
    if (q = null, (de || P & 8192 || (P & 16785408) === 16785408) && (q = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: oa
    }, Al = null, Cf(
      t,
      c,
      q
    ), de && (P = q, de = e.containerInfo, de = (de.nodeType === 9 ? de : de.ownerDocument).__reactViewTransition, de != null && (P.count++, P.waitingForViewTransition = !0, P = yi.bind(P), de.finished.then(P, P))), P = (c & 62914560) === c ? Tu - St() : (c & 4194048) === c ? Df - St() : 0, P = Pv(
      q,
      P
    ), P !== null)) {
      ya = c, e.cancelPendingCommit = P(
        Gf.bind(
          null,
          e,
          t,
          c,
          l,
          a,
          n,
          u,
          o,
          m,
          p,
          C,
          q,
          null,
          b,
          w
        )
      ), an(e, c, u, !p);
      return;
    }
    Gf(
      e,
      t,
      c,
      l,
      a,
      n,
      u,
      o,
      m,
      p,
      C,
      q
    );
  }
  function Fh(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], c = n.getSnapshot;
          n = n.value;
          try {
            if (!Cl(c(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function an(e, t, l, a) {
    t = vn(e, t), t &= ~wu, t &= ~Hn, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var c = 31 - qt(n), u = 1 << c;
      a[c] = -1, n &= ~u;
    }
    l !== 0 && Y(e, l, t);
  }
  function Au() {
    return (lt & 6) === 0 ? (ri(0), !1) : !0;
  }
  function Lo() {
    if (je !== null) {
      if (ut === 0)
        var e = je.return;
      else
        e = je, Ma = Nn = null, X0(e), lc = null, Kc = 0, e = je;
      for (; e !== null; )
        af(e.alternate, e), e = e.return;
      je = null;
    }
  }
  function gc(e, t) {
    var l = e.timeoutHandle;
    return l !== -1 && (e.timeoutHandle = -1, Ev(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), ya = 0, Lo(), mt = e, je = l = za(e.current, null), Qe = t, ut = 0, Ol = null, en = !1, rc = Sa(e, t), Uo = !1, fc = Dl = wu = Hn = tn = Nt = 0, Sl = oi = null, Ho = !1, Ua = vn(e, t), Bi(), l;
  }
  function qf(e, t) {
    xe = null, ne.H = ou, t === tc || t === Ji ? (t = Vr(), ut = 3) : t === x0 ? (t = Vr(), ut = 4) : ut = t === io ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, Ol = t, je === null && (Nt = 1, su(
      e,
      Ql(t, e.current)
    ));
  }
  function Bf() {
    var e = Kt.current;
    return e === null ? !0 : (Qe & 4194048) === Qe ? cl === null : (Qe & 62914560) === Qe || (Qe & 536870912) !== 0 ? e === cl : !1;
  }
  function Lf() {
    var e = ne.H;
    return ne.H = ou, e === null ? ou : e;
  }
  function kf() {
    var e = ne.A;
    return ne.A = Kh, e;
  }
  function Ou() {
    Nt = 4, en || (Qe & 4194048) !== Qe && Kt.current !== null || (rc = !0), (tn & 134217727) === 0 && (Hn & 134217727) === 0 || mt === null || an(
      mt,
      Qe,
      Dl,
      !1
    );
  }
  function ko(e, t, l) {
    var a = lt;
    lt |= 2;
    var n = Lf(), c = kf();
    (mt !== e || Qe !== t) && (Cu = null, gc(e, t)), t = !1;
    var u = Nt;
    e: do
      try {
        if (ut !== 0 && je !== null) {
          var o = je, m = Ol;
          switch (ut) {
            case 8:
              Lo(), u = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Kt.current === null && (t = !0);
              var p = ut;
              if (ut = 0, Ol = null, yc(e, o, m, p), l && rc) {
                u = 0;
                break e;
              }
              break;
            default:
              p = ut, ut = 0, Ol = null, yc(e, o, m, p);
          }
        }
        $h(), u = Nt;
        break;
      } catch (C) {
        qf(e, C);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Ma = Nn = null, lt = a, ne.H = n, ne.A = c, je === null && (mt = null, Qe = 0, Bi()), u;
  }
  function $h() {
    for (; je !== null; ) jf(je);
  }
  function Wh(e, t) {
    var l = lt;
    lt |= 2;
    var a = Lf(), n = kf();
    mt !== e || Qe !== t ? (Cu = null, zu = St() + 500, gc(e, t)) : rc = Sa(
      e,
      t
    );
    e: do
      try {
        if (ut !== 0 && je !== null) {
          t = je;
          var c = Ol;
          t: switch (ut) {
            case 1:
              ut = 0, Ol = null, yc(e, t, c, 1);
              break;
            case 2:
            case 9:
              if (jr(c)) {
                ut = 0, Ol = null, Yf(t);
                break;
              }
              t = function() {
                ut !== 2 && ut !== 9 || mt !== e || (ut = 7), ba(e);
              }, c.then(t, t);
              break e;
            case 3:
              ut = 7;
              break e;
            case 4:
              ut = 5;
              break e;
            case 7:
              jr(c) ? (ut = 0, Ol = null, Yf(t)) : (ut = 0, Ol = null, yc(e, t, c, 7));
              break;
            case 5:
              var u = null;
              switch (je.tag) {
                case 26:
                  u = je.memoizedState;
                case 5:
                case 27:
                  var o = je;
                  if (u ? xd(u) : o.stateNode.complete) {
                    ut = 0, Ol = null;
                    var m = o.sibling;
                    if (m !== null) je = m;
                    else {
                      var p = o.return;
                      p !== null ? (je = p, Du(p)) : je = null;
                    }
                    break t;
                  }
              }
              ut = 0, Ol = null, yc(e, t, c, 5);
              break;
            case 6:
              ut = 0, Ol = null, yc(e, t, c, 6);
              break;
            case 8:
              Lo(), Nt = 6;
              break e;
            default:
              throw Error(r(462));
          }
        }
        Ih();
        break;
      } catch (C) {
        qf(e, C);
      }
    while (!0);
    return Ma = Nn = null, ne.H = a, ne.A = n, lt = l, je !== null ? 0 : (mt = null, Qe = 0, Bi(), Nt);
  }
  function Ih() {
    for (; je !== null && !gl(); )
      jf(je);
  }
  function jf(e) {
    var t = tf(e.alternate, e, Ua);
    e.memoizedProps = e.pendingProps, t === null ? Du(e) : je = t;
  }
  function Yf(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = J2(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Qe
        );
        break;
      case 11:
        t = J2(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Qe
        );
        break;
      case 5:
        X0(t);
        var a = t;
        a === Yt && (Le ? (Gi(a), a.tag === 5 && a.stateNode != null && (gt = a.stateNode)) : (Gi(a), Le = !0));
      default:
        af(l, t), t = je = Ar(t, Ua), t = tf(l, t, Ua);
    }
    e.memoizedProps = e.pendingProps, t === null ? Du(e) : je = t;
  }
  function yc(e, t, l, a) {
    Ma = Nn = null, X0(t), lc = null, Kc = 0;
    var n = t.return;
    try {
      if (kh(
        e,
        n,
        t,
        l,
        Qe
      )) {
        Nt = 1, su(
          e,
          Ql(l, e.current)
        ), je = null;
        return;
      }
    } catch (c) {
      if (n !== null) throw je = n, c;
      Nt = 1, su(
        e,
        Ql(l, e.current)
      ), je = null;
      return;
    }
    t.flags & 32768 ? (Le || a === 1 ? e = !0 : rc || (Qe & 536870912) !== 0 ? e = !1 : (en = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Kt.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Vf(t, e)) : Du(t);
  }
  function Du(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Vf(
          t,
          en
        );
        return;
      }
      e = t.return;
      var l = Gh(
        t.alternate,
        t,
        Ua
      );
      if (l !== null) {
        je = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        je = t;
        return;
      }
      je = t = e;
    } while (t !== null);
    Nt === 0 && (Nt = 5);
  }
  function Vf(e, t) {
    do {
      var l = Qh(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, je = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        je = e;
        return;
      }
      je = e = l;
    } while (e !== null);
    Nt = 6, je = null;
  }
  function Gf(e, t, l, a, n, c, u, o, m, p, C, q) {
    e.cancelPendingCommit = null;
    do
      xu();
    while (pt !== 0);
    if ((lt & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      e === mt && (je = mt = null, Qe = 0), qn = t, na = e, ya = l, Bo = n, xf = a, Ph(
        e,
        t,
        l,
        u,
        o,
        m,
        q
      );
    }
  }
  function Ph(e, t, l, a, n, c, u) {
    var o = t.lanes | t.childLanes;
    if (qo = o, o |= E0, S(
      e,
      l,
      o,
      a,
      n,
      c
    ), mc = null, (l & 335544064) === l ? (hc = Ch(e), a = 10262) : (hc = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, cv(Xt, function() {
      return Go(), null;
    })) : (e.callbackNode = null, e.callbackPriority = 0), yu = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = ne.T, ne.T = null, n = fe.p, fe.p = 2, c = lt, lt |= 4;
      try {
        Xh(e, t, l);
      } finally {
        lt = c, fe.p = n, ne.T = a;
      }
    }
    pt = 1, yu ? dc = Tv(
      u,
      e.containerInfo,
      hc,
      jo,
      Yo,
      tv,
      Vo,
      Go,
      ev
    ) : (jo(), Yo(), Vo());
  }
  function ev(e) {
    if (pt !== 0) {
      var t = na.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function tv() {
    pt === 3 && (pt = 0, Tf(qn, na), pt = 4);
  }
  function jo() {
    if (pt === 1) {
      pt = 0;
      var e = na, t = qn, l = ya, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = ne.T, ne.T = null;
        var n = fe.p;
        fe.p = 2;
        var c = lt;
        lt |= 4;
        try {
          ci = pu = !1, Nf(t, e, l), l = ts;
          var u = Er(e.containerInfo), o = l.focusedElem, m = l.selectionRange;
          if (u !== o && o && o.ownerDocument && br(
            o.ownerDocument.documentElement,
            o
          )) {
            if (m !== null && h0(o)) {
              var p = m.start, C = m.end;
              if (C === void 0 && (C = p), "selectionStart" in o)
                o.selectionStart = p, o.selectionEnd = Math.min(
                  C,
                  o.value.length
                );
              else {
                var q = o.ownerDocument || document, b = q && q.defaultView || window;
                if (b.getSelection) {
                  var w = b.getSelection(), P = o.textContent.length, de = Math.min(m.start, P), Re = m.end === void 0 ? de : Math.min(m.end, P);
                  !w.extend && de > Re && (u = Re, Re = de, de = u);
                  var E = yr(
                    o,
                    de
                  ), v = yr(
                    o,
                    Re
                  );
                  if (E && v && (w.rangeCount !== 1 || w.anchorNode !== E.node || w.anchorOffset !== E.offset || w.focusNode !== v.node || w.focusOffset !== v.offset)) {
                    var N = q.createRange();
                    N.setStart(E.node, E.offset), w.removeAllRanges(), de > Re ? (w.addRange(N), w.extend(v.node, v.offset)) : (N.setEnd(v.node, v.offset), w.addRange(N));
                  }
                }
              }
            }
            for (q = [], w = o; w = w.parentNode; )
              w.nodeType === 1 && q.push({
                element: w,
                left: w.scrollLeft,
                top: w.scrollTop
              });
            for (typeof o.focus == "function" && o.focus(), o = 0; o < q.length; o++) {
              var H = q[o];
              H.element.scrollLeft = H.left, H.element.scrollTop = H.top;
            }
          }
          Tc = !!es, ts = es = null;
        } finally {
          lt = c, fe.p = n, ne.T = a;
        }
      }
      e.current = t, pt = 2;
    }
  }
  function Yo() {
    if (pt === 2) {
      pt = 0;
      var e = na, t = qn, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = ne.T, ne.T = null;
        var a = fe.p;
        fe.p = 2;
        var n = lt;
        lt |= 4;
        try {
          yf(e, t.alternate, t);
        } finally {
          lt = n, fe.p = a, ne.T = l;
        }
      }
      pt = 3;
    }
  }
  function Vo() {
    if (pt === 4 || pt === 3) {
      pt = 0;
      var e = dc;
      dc = null, Wl();
      var t = na, l = qn, a = ya, n = xf, c = (a & 335544064) === a ? 10262 : 10256;
      if ((l.subtreeFlags & c) !== 0 || (l.flags & c) !== 0 ? pt = 5 : (pt = 0, qn = na = null, Qf(t, t.pendingLanes)), c = t.pendingLanes, c === 0 && (ln = null), pe(a), l = l.stateNode, W && typeof W.onCommitFiberRoot == "function")
        try {
          W.onCommitFiberRoot(
            jl,
            l,
            void 0,
            (l.current.flags & 128) === 128
          );
        } catch {
        }
      if (n !== null) {
        l = ne.T, c = fe.p, fe.p = 2, ne.T = null;
        try {
          for (var u = t.onRecoverableError, o = 0; o < n.length; o++) {
            var m = n[o];
            u(m.value, {
              componentStack: m.stack
            });
          }
        } finally {
          ne.T = l, fe.p = c;
        }
      }
      if (n = mc, u = hc, hc = null, n !== null && (mc = null, u === null && (u = []), e !== null))
        for (m = 0; m < n.length; m++)
          l = (0, n[m])(
            u
          ), l !== void 0 && e.finished.finally(l);
      (ya & 3) !== 0 && xu(), ba(t), c = t.pendingLanes, (a & 261930) !== 0 && (c & 42) !== 0 ? t === Mu ? si++ : (si = 0, Mu = t) : (si = 0, Mu = null), ri(0);
    }
  }
  function Qf(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Qc(t)));
  }
  function xu() {
    return dc !== null && (dc.skipTransition(), dc = null), jo(), Yo(), Vo(), Go();
  }
  function Go() {
    if (pt !== 5) return !1;
    var e = na, t = qo;
    qo = 0;
    var l = pe(ya), a = ne.T, n = fe.p;
    try {
      fe.p = 32 > l ? 32 : l, ne.T = null, l = Bo, Bo = null;
      var c = na, u = ya;
      if (pt = 0, qn = na = null, ya = 0, (lt & 6) !== 0) throw Error(r(331));
      var o = lt;
      if (lt |= 4, Af(c.current), zf(
        c,
        c.current,
        u,
        l
      ), lt = o, ri(0, !1), W && typeof W.onPostCommitFiberRoot == "function")
        try {
          W.onPostCommitFiberRoot(jl, c);
        } catch {
        }
      return !0;
    } finally {
      fe.p = n, ne.T = a, Qf(e, t);
    }
  }
  function Xf(e, t, l) {
    t = Ql(l, t), t = co(e.stateNode, t, 2), e = Ja(e, t, 2), e !== null && (ol(e, 2), ba(e));
  }
  function ot(e, t, l) {
    if (e.tag === 3)
      Xf(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Xf(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (ln === null || !ln.has(a))) {
            e = Ql(l, e), l = j2(2), a = Ja(t, l, 2), a !== null && (Y2(
              l,
              a,
              t,
              e
            ), ol(a, 2), ba(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Qo(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new Jh();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Uo = !0, n.add(l), e = lv.bind(null, e, t, l), t.then(e, e));
  }
  function lv(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, mt === e && (Qe & l) === l && ((Nt === 4 || Nt === 3 && (Qe & 62914560) === Qe && 300 > St() - Tu) && (lt & 2) === 0 ? gc(e, 0) : wu |= l, fc === Qe && (fc = 0)), ba(e);
  }
  function Zf(e, t) {
    t === 0 && (t = Pl()), e = pn(e, t), e !== null && (ol(e, t), ba(e));
  }
  function av(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), Zf(e, l);
  }
  function nv(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(t), Zf(e, l);
  }
  function cv(e, t) {
    return Se(e, t);
  }
  var bc = null, Ec = null, Xo = !1, Ru = !1, Zo = !1, nn = 0;
  function ba(e) {
    e !== Ec && e.next === null && (Ec === null ? bc = Ec = e : Ec = Ec.next = e), Ru = !0, Xo || (Xo = !0, uv());
  }
  function ri(e, t) {
    if (!Zo && Ru) {
      Zo = !0;
      do
        for (var l = !1, a = bc; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var c = 0;
            else {
              var u = a.suspendedLanes, o = a.pingedLanes;
              c = (1 << 31 - qt(42 | e) + 1) - 1, c &= n & ~(u & ~o), c = c & 201326741 ? c & 201326741 | 1 : c ? c | 2 : 0;
            }
            c !== 0 && (l = !0, $f(a, c));
          } else
            c = Qe, c = ua(
              a,
              a === mt ? c : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (c & 3) === 0 || Sa(a, c) || (l = !0, $f(a, c));
          a = a.next;
        }
      while (l);
      Zo = !1;
    }
  }
  function iv() {
    Kf();
  }
  function Kf() {
    Ru = Xo = !1;
    var e = 0;
    nn !== 0 && bv() && (e = nn);
    for (var t = St(), l = null, a = bc; a !== null; ) {
      var n = a.next, c = Jf(a, t);
      c === 0 ? (a.next = null, l === null ? bc = n : l.next = n, n === null && (Ec = l)) : (l = a, (e !== 0 || (c & 3) !== 0) && (Ru = !0)), a = n;
    }
    pt !== 0 && pt !== 5 || ri(e), nn !== 0 && (nn = 0);
  }
  function Jf(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, c = e.pendingLanes & -62914561; 0 < c; ) {
      var u = 31 - qt(c), o = 1 << u, m = n[u];
      m === -1 ? ((o & l) === 0 || (o & a) !== 0) && (n[u] = La(o, t)) : m <= t && (e.expiredLanes |= o), c &= ~o;
    }
    if (t = mt, l = Qe, l = ua(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (ut === 2 || ut === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && He(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || Sa(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && He(a), pe(l)) {
        case 2:
        case 8:
          l = pa;
          break;
        case 32:
          l = Xt;
          break;
        case 268435456:
          l = yl;
          break;
        default:
          l = Xt;
      }
      return a = Ff.bind(null, e), l = Se(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && He(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Ff(e, t) {
    if (pt !== 0 && pt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (xu() && e.callbackNode !== l)
      return null;
    var a = Qe;
    return a = ua(
      e,
      e === mt ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Uf(e, a, t), Jf(e, St()), e.callbackNode != null && e.callbackNode === l ? Ff.bind(null, e) : null);
  }
  function $f(e, t) {
    if (xu()) return null;
    Uf(e, t, !0);
  }
  function uv() {
    pv(function() {
      (lt & 6) !== 0 ? Se(
        kl,
        iv
      ) : Kf();
    });
  }
  function Ko() {
    if (nn === 0) {
      var e = zn;
      e === 0 && (e = Tl, Tl <<= 1, (Tl & 261888) === 0 && (Tl = 256)), nn = e;
    }
    return nn;
  }
  function Wf(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Ai(e);
  }
  function ov(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var c = Wf(
        (n[$e] || null).action
      ), u = a.submitter;
      u && (t = (t = u[$e] || null) ? Wf(t.formAction) : u.getAttribute("formAction"), t !== null && (c = t, u = null));
      var o = new Ri(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: o,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (nn !== 0) {
                  var m = new FormData(n, u);
                  eo(
                    l,
                    {
                      pending: !0,
                      data: m,
                      method: n.method,
                      action: c
                    },
                    null,
                    m
                  );
                }
              } else
                typeof c == "function" && (o.preventDefault(), m = new FormData(n, u), eo(
                  l,
                  {
                    pending: !0,
                    data: m,
                    method: n.method,
                    action: c
                  },
                  c,
                  m
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Jo = 0; Jo < b0.length; Jo++) {
    var Fo = b0[Jo], sv = Fo.toLowerCase(), rv = Fo[0].toUpperCase() + Fo.slice(1);
    ea(
      sv,
      "on" + rv
    );
  }
  ea(_r, "onAnimationEnd"), ea(Nr, "onAnimationIteration"), ea(wr, "onAnimationStart"), ea("dblclick", "onDoubleClick"), ea("focusin", "onFocus"), ea("focusout", "onBlur"), ea(Eh, "onTransitionRun"), ea(ph, "onTransitionStart"), ea(Sh, "onTransitionCancel"), ea(Tr, "onTransitionEnd"), Yn("onMouseEnter", ["mouseout", "mouseover"]), Yn("onMouseLeave", ["mouseout", "mouseover"]), Yn("onPointerEnter", ["pointerout", "pointerover"]), Yn("onPointerLeave", ["pointerout", "pointerover"]), yn(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), yn(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), yn("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), yn(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), yn(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), yn(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var fi = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), fv = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(fi)
  );
  function If(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var c = void 0;
        if (t)
          for (var u = a.length - 1; 0 <= u; u--) {
            var o = a[u], m = o.instance, p = o.currentTarget;
            if (o = o.listener, m !== c && n.isPropagationStopped())
              break e;
            c = o, n.currentTarget = p;
            try {
              c(n);
            } catch (C) {
              qi(C);
            }
            n.currentTarget = null, c = m;
          }
        else
          for (u = 0; u < a.length; u++) {
            if (o = a[u], m = o.instance, p = o.currentTarget, o = o.listener, m !== c && n.isPropagationStopped())
              break e;
            c = o, n.currentTarget = p;
            try {
              c(n);
            } catch (C) {
              qi(C);
            }
            n.currentTarget = null, c = m;
          }
      }
    }
  }
  function Ye(e, t) {
    var l = t[We];
    l === void 0 && (l = t[We] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Pf(t, e, 2, !1), l.add(a));
  }
  function $o(e, t, l) {
    var a = 0;
    t && (a |= 4), Pf(
      l,
      e,
      a,
      t
    );
  }
  var Uu = "_reactListening" + Math.random().toString(36).slice(2);
  function Wo(e) {
    if (!e[Uu]) {
      e[Uu] = !0, ks.forEach(function(l) {
        l !== "selectionchange" && (fv.has(l) || $o(l, !1, e), $o(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Uu] || (t[Uu] = !0, $o("selectionchange", !1, t));
    }
  }
  function Pf(e, t, l, a) {
    switch (Vd(t)) {
      case 2:
        var n = ag;
        break;
      case 8:
        n = ng;
        break;
      default:
        n = ys;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !n0 || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function Io(e, t, l, a, n) {
    var c = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var u = a.tag;
        if (u === 3 || u === 4) {
          var o = a.stateNode.containerInfo;
          if (o === n) break;
          if (u === 4)
            for (u = a.return; u !== null; ) {
              var m = u.tag;
              if ((m === 3 || m === 4) && u.stateNode.containerInfo === n)
                return;
              u = u.return;
            }
          for (; o !== null; ) {
            if (u = Bt(o), u === null) return;
            if (m = u.tag, m === 5 || m === 6 || m === 26 || m === 27) {
              a = c = u;
              continue e;
            }
            o = o.parentNode;
          }
        }
        a = a.return;
      }
    Is(function() {
      var p = c, C = l0(l), q = [];
      e: {
        var b = zr.get(e);
        if (b !== void 0) {
          var w = Ri, P = e;
          switch (e) {
            case "keypress":
              if (Di(l) === 0) break e;
            case "keydown":
            case "keyup":
              w = F1;
              break;
            case "focusin":
              P = "focus", w = o0;
              break;
            case "focusout":
              P = "blur", w = o0;
              break;
            case "beforeblur":
            case "afterblur":
              w = o0;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              w = tr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              w = B1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              w = eh;
              break;
            case _r:
            case Nr:
            case wr:
              w = j1;
              break;
            case Tr:
              w = lh;
              break;
            case "scroll":
            case "scrollend":
              w = H1;
              break;
            case "wheel":
              w = nh;
              break;
            case "copy":
            case "cut":
            case "paste":
              w = V1;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              w = ar;
              break;
            case "submit":
              w = I1;
              break;
            case "toggle":
            case "beforetoggle":
              w = ih;
          }
          var de = (t & 4) !== 0, Re = !de && (e === "scroll" || e === "scrollend"), E = de ? b !== null ? b + "Capture" : null : b;
          de = [];
          for (var v = p, N; v !== null; ) {
            var H = v;
            if (N = H.stateNode, H = H.tag, H !== 5 && H !== 26 && H !== 27 || N === null || E === null || (H = Rc(v, E), H != null && de.push(
              di(v, H, N)
            )), Re) break;
            v = v.return;
          }
          0 < de.length && (b = new w(
            b,
            P,
            null,
            l,
            C
          ), q.push({ event: b, listeners: de }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", b = e === "mouseout" || e === "pointerout", w && l !== t0 && (P = l.relatedTarget || l.fromElement) && (Bt(P) || P[Be]))
            break e;
          (b || w) && (P = C.window === C ? C : (w = C.ownerDocument) ? w.defaultView || w.parentWindow : window, b ? (w = l.relatedTarget || l.toElement, b = p, w = w ? Bt(w) : null, w !== null && (Re = j(w), de = w.tag, w !== Re || de !== 5 && de !== 27 && de !== 6) && (w = null)) : (b = null, w = p), b !== w && (de = tr, H = "onMouseLeave", E = "onMouseEnter", v = "mouse", (e === "pointerout" || e === "pointerover") && (de = ar, H = "onPointerLeave", E = "onPointerEnter", v = "pointer"), Re = b == null ? P : xc(b), N = w == null ? P : xc(w), P = new de(
            H,
            v + "leave",
            b,
            l,
            C
          ), P.target = Re, P.relatedTarget = N, H = null, Bt(C) === p && (de = new de(
            E,
            v + "enter",
            w,
            l,
            C
          ), de.target = N, de.relatedTarget = Re, H = de), Re = H, de = b && w ? Q(
            b,
            w,
            dv
          ) : null, b !== null && ed(
            q,
            P,
            b,
            de,
            !1
          ), w !== null && Re !== null && ed(
            q,
            Re,
            w,
            de,
            !0
          )));
        }
        e: {
          if (b = p ? xc(p) : window, w = b.nodeName && b.nodeName.toLowerCase(), w === "select" || w === "input" && b.type === "file")
            var oe = fr;
          else if (sr(b))
            if (dr)
              oe = gh;
            else {
              oe = hh;
              var Xe = mh;
            }
          else
            w = b.nodeName, !w || w.toLowerCase() !== "input" || b.type !== "checkbox" && b.type !== "radio" ? p && e0(p.elementType) && (oe = fr) : oe = vh;
          if (oe && (oe = oe(e, p))) {
            rr(
              q,
              oe,
              l,
              C
            );
            break e;
          }
          Xe && Xe(e, b, p);
        }
        switch (Xe = p ? xc(p) : window, e) {
          case "focusin":
            (sr(Xe) || Xe.contentEditable === "true") && (Kn = Xe, v0 = p, Yc = null);
            break;
          case "focusout":
            Yc = v0 = Kn = null;
            break;
          case "mousedown":
            g0 = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            g0 = !1, pr(q, l, C);
            break;
          case "selectionchange":
            if (bh) break;
          case "keydown":
          case "keyup":
            pr(q, l, C);
        }
        var be;
        if (r0)
          e: {
            switch (e) {
              case "compositionstart":
                var we = "onCompositionStart";
                break e;
              case "compositionend":
                we = "onCompositionEnd";
                break e;
              case "compositionupdate":
                we = "onCompositionUpdate";
                break e;
            }
            we = void 0;
          }
        else
          Zn ? ur(e, l) && (we = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (we = "onCompositionStart");
        we && (nr && l.locale !== "ko" && (Zn || we !== "onCompositionStart" ? we === "onCompositionEnd" && Zn && (be = Ps()) : (ka = C, c0 = "value" in ka ? ka.value : ka.textContent, Zn = !0)), Xe = Hu(p, we), 0 < Xe.length && (we = new lr(
          we,
          e,
          null,
          l,
          C
        ), q.push({ event: we, listeners: Xe }), be ? we.data = be : (be = or(l), be !== null && (we.data = be)))), (be = oh ? sh(e, l) : rh(e, l)) && (we = Hu(p, "onBeforeInput"), 0 < we.length && (Xe = new lr(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          C
        ), q.push({
          event: Xe,
          listeners: we
        }), Xe.data = be)), ov(
          q,
          e,
          p,
          l,
          C
        );
      }
      If(q, t);
    });
  }
  function di(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Hu(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, c = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || c === null || (n = Rc(e, l), n != null && a.unshift(
        di(e, n, c)
      ), n = Rc(e, t), n != null && a.push(
        di(e, n, c)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function dv(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function ed(e, t, l, a, n) {
    for (var c = t._reactName, u = []; l !== null && l !== a; ) {
      var o = l, m = o.alternate, p = o.stateNode;
      if (o = o.tag, m !== null && m === a) break;
      o !== 5 && o !== 26 && o !== 27 || p === null || (m = p, n ? (p = Rc(l, c), p != null && u.unshift(
        di(l, p, m)
      )) : n || (p = Rc(l, c), p != null && u.push(
        di(l, p, m)
      ))), l = l.return;
    }
    u.length !== 0 && e.push({ event: t, listeners: u });
  }
  var mv = /\r\n?/g, hv = /\u0000|\uFFFD/g;
  function td(e) {
    return (typeof e == "string" ? e : "" + e).replace(mv, `
`).replace(hv, "");
  }
  function ld(e, t) {
    return t = td(t), td(e) === t;
  }
  function st(e, t, l, a, n, c) {
    switch (l) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || Gn(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && Gn(e, "" + a);
        else return;
        break;
      case "className":
        Mi(e, "class", a);
        break;
      case "tabIndex":
        Mi(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Mi(e, l, a);
        break;
      case "style":
        $s(e, a, c);
        return;
      case "data":
        if (t !== "object") {
          Mi(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Ai(a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof c == "function" && (l === "formAction" ? (t !== "input" && st(e, t, "name", n.name, n, null), st(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), st(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), st(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (st(e, t, "encType", n.encType, n, null), st(e, t, "method", n.method, n, null), st(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Ai(a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = oa);
        return;
      case "onScroll":
        a != null && Ye("scroll", e);
        return;
      case "onScrollEnd":
        a != null && Ye("scrollend", e);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(r(60));
            (c != null ? c.__html : void 0) !== l && (e.innerHTML = l);
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = Ai(a), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        Ye("beforetoggle", e), Ye("toggle", e), Ci(e, "popover", a);
        break;
      case "xlinkActuate":
        _a(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        _a(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        _a(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        _a(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        _a(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        _a(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        _a(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        _a(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        _a(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Ci(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N")
          l = R1.get(l) || l, Ci(e, l, a);
        else return;
    }
    tt = !0;
  }
  function Po(e, t, l, a, n, c) {
    switch (l) {
      case "style":
        $s(e, a, c);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(r(60));
            (c != null ? c.__html : void 0) !== l && (e.innerHTML = l);
          }
        }
        break;
      case "children":
        if (typeof a == "string") Gn(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          Gn(e, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && Ye("scroll", e);
        return;
      case "onScrollEnd":
        a != null && Ye("scrollend", e);
        return;
      case "onClick":
        a != null && (e.onclick = oa);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!js.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), c = l.slice(2, n ? l.length - 7 : void 0), t = e[$e] || null, t = t != null ? t[l] : null, typeof t == "function" && e.removeEventListener(c, t, n), typeof a == "function")) {
              typeof t != "function" && t !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(c, a, n);
              break e;
            }
            tt = !0, l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Ci(e, l, a);
          }
        return;
    }
    tt = !0;
  }
  function $t(e, t, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Ye("error", e), Ye("load", e);
        var a = !1, n = !1, c;
        for (c in l)
          if (l.hasOwnProperty(c)) {
            var u = l[c];
            if (u != null)
              switch (c) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  st(e, t, c, u, l, null);
              }
          }
        n && st(e, t, "srcSet", l.srcSet, l, null), a && st(e, t, "src", l.src, l, null);
        return;
      case "input":
        Ye("invalid", e);
        var o = c = u = n = null, m = null, p = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var C = l[a];
            if (C != null)
              switch (a) {
                case "name":
                  n = C;
                  break;
                case "type":
                  u = C;
                  break;
                case "checked":
                  m = C;
                  break;
                case "defaultChecked":
                  p = C;
                  break;
                case "value":
                  c = C;
                  break;
                case "defaultValue":
                  o = C;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (C != null)
                    throw Error(r(137, t));
                  break;
                default:
                  st(e, t, a, C, l, null);
              }
          }
        Zs(
          e,
          c,
          o,
          m,
          p,
          u,
          n,
          !1
        );
        return;
      case "select":
        Ye("invalid", e), a = u = c = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (o = l[n], o != null))
            switch (n) {
              case "value":
                c = o;
                break;
              case "defaultValue":
                u = o;
                break;
              case "multiple":
                a = o;
              default:
                st(e, t, n, o, l, null);
            }
        t = c, l = u, e.multiple = !!a, t != null ? Vn(e, !!a, t, !1) : l != null && Vn(e, !!a, l, !0);
        return;
      case "textarea":
        Ye("invalid", e), c = n = a = null;
        for (u in l)
          if (l.hasOwnProperty(u) && (o = l[u], o != null))
            switch (u) {
              case "value":
                a = o;
                break;
              case "defaultValue":
                n = o;
                break;
              case "children":
                c = o;
                break;
              case "dangerouslySetInnerHTML":
                if (o != null) throw Error(r(91));
                break;
              default:
                st(e, t, u, o, l, null);
            }
        Js(e, a, n, c);
        return;
      case "option":
        for (m in l)
          if (l.hasOwnProperty(m) && (a = l[m], a != null))
            switch (m) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                st(e, t, m, a, l, null);
            }
        return;
      case "dialog":
        Ye("beforetoggle", e), Ye("toggle", e), Ye("cancel", e), Ye("close", e);
        break;
      case "iframe":
      case "object":
        Ye("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < fi.length; a++)
          Ye(fi[a], e);
        break;
      case "image":
        Ye("error", e), Ye("load", e);
        break;
      case "details":
        Ye("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        Ye("error", e), Ye("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (p in l)
          if (l.hasOwnProperty(p) && (a = l[p], a != null))
            switch (p) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                st(e, t, p, a, l, null);
            }
        return;
      default:
        if (e0(t)) {
          for (C in l)
            l.hasOwnProperty(C) && (a = l[C], a !== void 0 && Po(
              e,
              t,
              C,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (o in l)
      l.hasOwnProperty(o) && (a = l[o], a != null && st(e, t, o, a, l, null));
  }
  var vv = {};
  function gv(e, t, l, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null, c = null, u = null, o = null, m = null, p = null, C = null;
        for (w in l) {
          var q = l[w];
          if (l.hasOwnProperty(w) && q != null)
            switch (w) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                m = q;
              default:
                a.hasOwnProperty(w) || st(e, t, w, null, a, q);
            }
        }
        for (var b in a) {
          var w = a[b];
          if (q = l[b], a.hasOwnProperty(b) && (w != null || q != null))
            switch (b) {
              case "type":
                w !== q && (tt = !0), c = w;
                break;
              case "name":
                w !== q && (tt = !0), n = w;
                break;
              case "checked":
                w !== q && (tt = !0), p = w;
                break;
              case "defaultChecked":
                w !== q && (tt = !0), C = w;
                break;
              case "value":
                w !== q && (tt = !0), u = w;
                break;
              case "defaultValue":
                w !== q && (tt = !0), o = w;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (w != null)
                  throw Error(r(137, t));
                break;
              default:
                w !== q && st(
                  e,
                  t,
                  b,
                  w,
                  a,
                  q
                );
            }
        }
        Iu(
          e,
          u,
          o,
          m,
          p,
          C,
          c,
          n
        );
        return;
      case "select":
        w = u = o = b = null;
        for (c in l)
          if (m = l[c], l.hasOwnProperty(c) && m != null)
            switch (c) {
              case "value":
                break;
              case "multiple":
                w = m;
              default:
                a.hasOwnProperty(c) || st(
                  e,
                  t,
                  c,
                  null,
                  a,
                  m
                );
            }
        for (n in a)
          if (c = a[n], m = l[n], a.hasOwnProperty(n) && (c != null || m != null))
            switch (n) {
              case "value":
                c !== m && (tt = !0), b = c;
                break;
              case "defaultValue":
                c !== m && (tt = !0), o = c;
                break;
              case "multiple":
                c !== m && (tt = !0), u = c;
              default:
                c !== m && st(
                  e,
                  t,
                  n,
                  c,
                  a,
                  m
                );
            }
        t = o, l = u, a = w, b != null ? Vn(e, !!l, b, !1) : !!a != !!l && (t != null ? Vn(e, !!l, t, !0) : Vn(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        w = b = null;
        for (o in l)
          if (n = l[o], l.hasOwnProperty(o) && n != null && !a.hasOwnProperty(o))
            switch (o) {
              case "value":
                break;
              case "children":
                break;
              default:
                st(e, t, o, null, a, n);
            }
        for (u in a)
          if (n = a[u], c = l[u], a.hasOwnProperty(u) && (n != null || c != null))
            switch (u) {
              case "value":
                n !== c && (tt = !0), b = n;
                break;
              case "defaultValue":
                n !== c && (tt = !0), w = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== c && st(e, t, u, n, a, c);
            }
        Ks(e, b, w);
        return;
      case "option":
        for (var P in l)
          if (b = l[P], l.hasOwnProperty(P) && b != null && !a.hasOwnProperty(P))
            switch (P) {
              case "selected":
                e.selected = !1;
                break;
              default:
                st(
                  e,
                  t,
                  P,
                  null,
                  a,
                  b
                );
            }
        for (m in a)
          if (b = a[m], w = l[m], a.hasOwnProperty(m) && b !== w && (b != null || w != null))
            switch (m) {
              case "selected":
                b !== w && (tt = !0), e.selected = b && typeof b != "function" && typeof b != "symbol";
                break;
              default:
                st(
                  e,
                  t,
                  m,
                  b,
                  a,
                  w
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var de in l)
          b = l[de], l.hasOwnProperty(de) && b != null && !a.hasOwnProperty(de) && st(e, t, de, null, a, b);
        for (p in a)
          if (b = a[p], w = l[p], a.hasOwnProperty(p) && b !== w && (b != null || w != null))
            switch (p) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null)
                  throw Error(r(137, t));
                break;
              default:
                st(
                  e,
                  t,
                  p,
                  b,
                  a,
                  w
                );
            }
        return;
      default:
        if (e0(t)) {
          for (var Re in l)
            b = l[Re], l.hasOwnProperty(Re) && b !== void 0 && !a.hasOwnProperty(Re) && Po(
              e,
              t,
              Re,
              void 0,
              a,
              b
            );
          for (C in a)
            b = a[C], w = l[C], !a.hasOwnProperty(C) || b === w || b === void 0 && w === void 0 || Po(
              e,
              t,
              C,
              b,
              a,
              w
            );
          return;
        }
    }
    for (var E in l)
      b = l[E], l.hasOwnProperty(E) && b != null && !a.hasOwnProperty(E) && st(e, t, E, null, a, b);
    for (q in a)
      b = a[q], w = l[q], !a.hasOwnProperty(q) || b === w || b == null && w == null || st(e, t, q, b, a, w);
  }
  function ad(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function yv() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], c = n.transferSize, u = n.initiatorType, o = n.duration;
        if (c && o && ad(u)) {
          for (u = 0, o = n.responseEnd, a += 1; a < l.length; a++) {
            var m = l[a], p = m.startTime;
            if (p > o) break;
            var C = m.transferSize, q = m.initiatorType;
            C && ad(q) && (m = m.responseEnd, u += C * (m < o ? 1 : (o - p) / (m - p)));
          }
          if (--a, t += 8 * (c + u) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var es = null, ts = null;
  function mi(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function nd(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function cd(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function id(e, t, l, a) {
    return l = mi(
      l
    ).createElement(e), l[Ke] = a, l[$e] = t, $t(l, e, t), jt(l), l;
  }
  function ls(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var as = null;
  function bv() {
    var e = window.event;
    return e && e.type === "popstate" ? e === as ? !1 : (as = e, !0) : (as = null, !1);
  }
  var ns = typeof setTimeout == "function" ? setTimeout : void 0, Ev = typeof clearTimeout == "function" ? clearTimeout : void 0, ud = typeof Promise == "function" ? Promise : void 0, od = typeof requestAnimationFrame == "function" ? requestAnimationFrame : ns, pv = typeof queueMicrotask == "function" ? queueMicrotask : typeof ud < "u" ? function(e) {
    return ud.resolve(null).then(e).catch(Sv);
  } : ns;
  function Sv(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function cn(e) {
    return e === "head";
  }
  function sd(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), zc(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          ds(
            e.ownerDocument.documentElement
          );
        else if (l === "head") {
          l = e.ownerDocument.head, ds(l);
          for (var c = l.firstChild; c; ) {
            var u = c.nextSibling, o = c.nodeName;
            c[ee] || o === "SCRIPT" || o === "STYLE" || o === "LINK" && c.rel.toLowerCase() === "stylesheet" || l.removeChild(c), c = u;
          }
        } else
          l === "body" && ds(e.ownerDocument.body);
      l = n;
    } while (l);
    zc(t);
  }
  function rd(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? t ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (t ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (e === 0) break;
          e--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || e++;
      l = a;
    } while (l);
  }
  function fd(e, t, l) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, e.style.viewTransitionName = t, l != null && (e.style.viewTransitionClass = l), l = getComputedStyle(e), l.display === "inline") {
      if (t = e.getClientRects(), t.length === 1) var a = 1;
      else
        for (var n = a = 0; n < t.length; n++) {
          var c = t[n];
          0 < c.width && 0 < c.height && a++;
        }
      a === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + l.paddingTop, e.marginBottom = "-" + l.paddingBottom);
    }
  }
  function dd(e, t) {
    e = e.style, t = t.style;
    var l = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    e.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), l = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, e.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (l = t.display, e.display = l == null || typeof l == "boolean" ? "" : l, l = t.margin, l != null ? e.margin = l : (l = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = l == null || typeof l == "boolean" ? "" : l, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function _v(e, t, l) {
    return l = l.ownerDocument.defaultView, {
      rect: e,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= e.bottom && 0 <= e.right && e.top <= l.innerHeight && e.left <= l.innerWidth
    };
  }
  function cs(e) {
    var t = e.getBoundingClientRect(), l = getComputedStyle(e);
    return _v(t, l, e);
  }
  function Nv(e) {
    return e.documentElement.clientHeight;
  }
  function wv(e) {
    this.addEventListener("load", e), this.addEventListener("error", e);
  }
  function Tv(e, t, l, a, n, c, u, o, m) {
    var p = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var C = p.startViewTransition({
        update: function() {
          var b = p.defaultView, w = b.navigation && b.navigation.transition, P = p.fonts.status;
          a();
          var de = [];
          if (P === "loaded" && (Nv(p), p.fonts.status === "loading" && de.push(p.fonts.ready)), P = de.length, e !== null)
            for (var Re = e.suspenseyImages, E = 0, v = 0; v < Re.length; v++) {
              var N = Re[v];
              if (!N.complete) {
                var H = N.getBoundingClientRect();
                if (0 < H.bottom && 0 < H.right && H.top < b.innerHeight && H.left < b.innerWidth) {
                  if (E += Rd(N), E > Lu) {
                    de.length = P;
                    break;
                  }
                  N = new Promise(
                    wv.bind(N)
                  ), de.push(N);
                }
              }
            }
          if (0 < de.length)
            return b = Promise.race([
              Promise.all(de),
              new Promise(function(oe) {
                return setTimeout(oe, 500);
              })
            ]).then(n, n), (w ? Promise.allSettled([w.finished, b]) : b).then(c, c);
          if (n(), w)
            return w.finished.then(
              c,
              c
            );
          c();
        },
        types: l
      });
      p.__reactViewTransition = C;
      var q = [];
      return C.ready.then(
        function() {
          for (var b = p.documentElement.getAnimations({
            subtree: !0
          }), w = 0; w < b.length; w++) {
            var P = b[w], de = P.effect, Re = de.pseudoElement;
            if (Re != null && Re.startsWith("::view-transition")) {
              q.push(P), P = de.getKeyframes();
              for (var E = Re = void 0, v = !0, N = 0; N < P.length; N++) {
                var H = P[N], oe = H.width;
                if (Re === void 0) Re = oe;
                else if (Re !== oe) {
                  v = !1;
                  break;
                }
                if (oe = H.height, E === void 0) E = oe;
                else if (E !== oe) {
                  v = !1;
                  break;
                }
                delete H.width, delete H.height, H.transform === "none" && delete H.transform;
              }
              v && Re !== void 0 && E !== void 0 && (de.setKeyframes(P), v = getComputedStyle(
                de.target,
                de.pseudoElement
              ), v.width !== Re || v.height !== E) && (v = P[0], v.width = Re, v.height = E, v = P[P.length - 1], v.width = Re, v.height = E, de.setKeyframes(P));
            }
          }
          u();
        },
        function(b) {
          p.__reactViewTransition === C && (p.__reactViewTransition = null);
          try {
            if (typeof b == "object" && b !== null)
              switch (b.name) {
                case "InvalidStateError":
                  (b.message === "View transition was skipped because document visibility state is hidden." || b.message === "Skipping view transition because document visibility state has become hidden." || b.message === "Skipping view transition because viewport size changed." || b.message === "Transition was aborted because of invalid state") && (b = null);
              }
            b !== null && m(b);
          } finally {
            a(), n(), u();
          }
        }
      ), C.finished.finally(function() {
        for (var b = 0; b < q.length; b++)
          q[b].cancel();
        p.__reactViewTransition === C && (p.__reactViewTransition = null), o();
      }), C;
    } catch {
      return a(), n(), u(), null;
    }
  }
  function Bn(e, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
  }
  Bn.prototype.animate = function(e, t) {
    return t = typeof t == "number" ? { duration: t } : k({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
  }, Bn.prototype.getAnimations = function() {
    for (var e = this._scope, t = this._selector, l = e.getAnimations({ subtree: !0 }), a = [], n = 0; n < l.length; n++) {
      var c = l[n].effect;
      c !== null && c.target === e && c.pseudoElement === t && a.push(l[n]);
    }
    return a;
  }, Bn.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function md(e) {
    return {
      name: e,
      group: new Bn("group", e),
      imagePair: new Bn("image-pair", e),
      old: new Bn("old", e),
      new: new Bn("new", e)
    };
  }
  function Rl(e) {
    this._fragmentFiber = e, this._observers = this._eventListeners = null;
  }
  Rl.prototype.addEventListener = function(e, t, l) {
    var a = null, n = null;
    if (!(l != null && typeof l != "boolean" && (a = l.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var c = this._eventListeners;
      if (vd(c, e, t, l) === -1) {
        var u = this, o = t;
        l != null && typeof l != "boolean" && l.once === !0 && (o = function(m) {
          u.removeEventListener(
            e,
            t,
            l
          ), typeof t == "function" ? t.call(this, m) : t.handleEvent(m);
        }), a !== null && (n = u.removeEventListener.bind(
          u,
          e,
          t,
          l
        ), a.addEventListener("abort", n, { once: !0 }), n = a.removeEventListener.bind(a, "abort", n)), a = pc(l), c.push({
          type: e,
          listener: t,
          optionsOrUseCapture: l,
          attachedListener: o,
          cleanup: n
        }), g(
          this._fragmentFiber.child,
          !1,
          zv,
          e,
          o,
          a
        );
      }
      this._eventListeners = c;
    }
  };
  function zv(e, t, l, a) {
    return X(e).addEventListener(
      t,
      l,
      a
    ), !1;
  }
  Rl.prototype.removeEventListener = function(e, t, l) {
    var a = this._eventListeners;
    if (a !== null && (t = vd(
      a,
      e,
      t,
      l
    ), t !== -1)) {
      var n = a[t];
      l = n.attachedListener;
      var c = n.cleanup;
      n = pc(n.optionsOrUseCapture), g(
        this._fragmentFiber.child,
        !1,
        Cv,
        e,
        l,
        n
      ), a.splice(t, 1), c !== null && c();
    }
  };
  function Cv(e, t, l, a) {
    return X(e).removeEventListener(
      t,
      l,
      a
    ), !1;
  }
  function pc(e) {
    return e != null && typeof e != "boolean" && (e.once === !0 || e.signal instanceof AbortSignal) ? { capture: e.capture, passive: e.passive } : e;
  }
  function hd(e) {
    return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
  }
  function vd(e, t, l, a) {
    if (e.length === 0) return -1;
    a = hd(a);
    for (var n = 0; n < e.length; n++) {
      var c = e[n];
      if (c.type === t && c.listener === l && hd(c.optionsOrUseCapture) === a)
        return n;
    }
    return -1;
  }
  Rl.prototype.dispatchEvent = function(e) {
    var t = z(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = X(t);
    var l = this._eventListeners;
    if (l !== null && 0 < l.length || !e.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (l)
        for (var n = 0; n < l.length; n++) {
          var c = l[n];
          a.addEventListener(
            c.type,
            c.attachedListener,
            pc(c.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), e = a.dispatchEvent(e), l)
        for (n = 0; n < l.length; n++)
          c = l[n], a.removeEventListener(
            c.type,
            c.attachedListener,
            pc(c.optionsOrUseCapture)
          );
      return t.removeChild(a), e;
    }
    return t.dispatchEvent(e);
  }, Rl.prototype.focus = function(e) {
    g(
      this._fragmentFiber.child,
      !0,
      gd,
      e,
      void 0,
      void 0
    );
  };
  function gd(e, t) {
    return e.tag === 6 ? !1 : (e = X(e), kv(e, t));
  }
  Rl.prototype.focusLast = function(e) {
    var t = [];
    g(
      this._fragmentFiber.child,
      !0,
      is,
      t,
      void 0,
      void 0
    );
    for (var l = t.length - 1; 0 <= l && !gd(t[l], e); l--) ;
  };
  function is(e, t) {
    return t.push(e), !1;
  }
  Rl.prototype.blur = function() {
    var e = z(
      this._fragmentFiber
    );
    e !== null && (e = X(e), e = mi(e).activeElement, e !== null && g(
      this._fragmentFiber.child,
      !1,
      Mv,
      e,
      void 0,
      void 0
    ));
  };
  function Mv(e, t) {
    return e.tag === 6 ? !1 : (e = X(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  Rl.prototype.observeUsing = function(e) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), g(
      this._fragmentFiber.child,
      !1,
      Av,
      e,
      void 0,
      void 0
    );
  };
  function Av(e, t) {
    return e.tag === 6 || (e = X(e), t.observe(e)), !1;
  }
  Rl.prototype.unobserveUsing = function(e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      t.delete(e), g(
        this._fragmentFiber.child,
        !1,
        Ov,
        e,
        void 0,
        void 0
      );
      for (var l = t = 0; l < ca.length; l++) {
        var a = ca[l];
        a.fragmentInstance === this && a.observer === e ? e.unobserve(a.instance) : ca[t++] = a;
      }
      ca.length = t;
    }
  };
  function Ov(e, t) {
    return e.tag === 6 || (e = X(e), t.unobserve(e)), !1;
  }
  var ca = [], us = !1;
  function Dv(e, t, l) {
    ca.push({
      fragmentInstance: e,
      observer: t,
      instance: l
    }), us || (us = !0, jv(function() {
      us = !1;
      var a = ca;
      ca = [];
      for (var n = 0; n < a.length; n++) {
        var c = a[n];
        c.observer.unobserve(c.instance);
      }
    }));
  }
  Rl.prototype.getClientRects = function() {
    var e = [];
    return g(
      this._fragmentFiber.child,
      !1,
      xv,
      e,
      void 0,
      void 0
    ), e;
  };
  function xv(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var l = e.ownerDocument.createRange();
      l.selectNodeContents(e), t.push.apply(t, l.getClientRects());
    } else
      e = X(e), t.push.apply(t, e.getClientRects());
    return !1;
  }
  Rl.prototype.getRootNode = function(e) {
    var t = z(
      this._fragmentFiber
    );
    return t === null ? this : X(t).getRootNode(e);
  }, Rl.prototype.compareDocumentPosition = function(e) {
    var t = z(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var l = [];
    g(
      this._fragmentFiber.child,
      !1,
      is,
      l,
      void 0,
      void 0
    );
    var a = X(t);
    if (l.length === 0) {
      if (l = a, D(this._fragmentFiber)) {
        e: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break e;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (l = t);
      }
      t = this._fragmentFiber;
      var n = a = l.compareDocumentPosition(e);
      return l === e ? n = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (l = K(t)[1], l === null ? n = Node.DOCUMENT_POSITION_PRECEDING : (e = X(l).compareDocumentPosition(
        e
      ), n = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), n |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = X(l[0]), n = X(l[l.length - 1]);
    var c = D(this._fragmentFiber) ? t.parentElement : a;
    if (c == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = c.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, c = c.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var u = t.compareDocumentPosition(e), o = n.compareDocumentPosition(e), m = u & Node.DOCUMENT_POSITION_CONTAINED_BY || o & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return o = a && c && u & Node.DOCUMENT_POSITION_FOLLOWING && o & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === e || c && n === e || m || o ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === e || !c && n === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : u, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Rv(
      t,
      this._fragmentFiber,
      l[0],
      l[l.length - 1],
      e
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function Rv(e, t, l, a, n) {
    var c = Bt(n);
    if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (l = !!c)
        e: {
          for (; c !== null; ) {
            if (c.tag === 7 && (c === t || c.alternate === t)) {
              l = !0;
              break e;
            }
            c = c.return;
          }
          l = !1;
        }
      return l;
    }
    if (e & Node.DOCUMENT_POSITION_CONTAINS) {
      if (c === null)
        return c = n.ownerDocument, n === c || n === c.documentElement || n === c.body;
      e: {
        for (c = t, t = z(t); c !== null; ) {
          if (!(c.tag !== 5 && c.tag !== 3 && c.tag !== 27 || c !== t && c.alternate !== t)) {
            c = !0;
            break e;
          }
          c = c.return;
        }
        c = !1;
      }
      return c;
    }
    return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!c) && !(t = c === l) && (t = Q(
      l,
      c,
      Oe
    ), t === null ? t = !1 : (g(
      t,
      !0,
      ve,
      c,
      l
    ), c = J, J = null, t = c !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!c) && !(t = c === a) && (t = Q(
      a,
      c,
      Oe
    ), t === null ? t = !1 : (g(
      t,
      !0,
      ae,
      c,
      a
    ), c = J, $ = J = null, t = c !== null)), t) : !1;
  }
  function yd(e, t) {
    var l = e.ownerDocument.createRange();
    l.selectNodeContents(e), e = l.getBoundingClientRect(), window.scrollTo(
      window.scrollX + e.left,
      t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight
    );
  }
  Rl.prototype.scrollIntoView = function(e) {
    if (typeof e == "object") throw Error(r(566));
    var t = [];
    g(
      this._fragmentFiber.child,
      !1,
      is,
      t,
      void 0,
      void 0
    );
    var l = e !== !1;
    if (t.length === 0) {
      var a = K(
        this._fragmentFiber
      );
      if (a = l ? a[1] || a[0] || z(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        e = X(a), yd(e, l);
        return;
      }
      if (a = X(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          l = "host" in a ? a.host : null, l !== null && l.scrollIntoView(e);
          return;
        }
        a.scrollIntoView(e);
      }
    }
    for (a = l ? t.length - 1 : 0; a !== (l ? -1 : t.length); ) {
      var n = t[a];
      n.tag === 6 ? (n = X(n), yd(n, l)) : X(n).scrollIntoView(e), a += l ? -1 : 1;
    }
  };
  function Uv(e, t) {
    return e = X(e), bd(e, t), !1;
  }
  function bd(e, t) {
    e.reactFragments == null && (e.reactFragments = /* @__PURE__ */ new Set()), e.reactFragments.add(t);
  }
  function Ed(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a];
        e.addEventListener(
          n.type,
          n.attachedListener,
          pc(n.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (l = t._observers, l !== null && l.forEach(function(c) {
      for (var u = 0, o = 0; o < ca.length; o++) {
        var m = ca[o];
        (m.fragmentInstance !== t || m.observer !== c || m.instance !== e) && (ca[u++] = m);
      }
      ca.length = u, c.observe(e);
    }), bd(e, t));
  }
  function Hv(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a];
        e.removeEventListener(
          n.type,
          n.attachedListener,
          pc(n.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (l = t._observers, l !== null && l.forEach(function(c) {
      typeof c.rootMargin == "string" ? Dv(
        t,
        c,
        e
      ) : c.unobserve(e);
    }), e.reactFragments != null && e.reactFragments.delete(t));
  }
  function os(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          os(l), Ie(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function qv(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[ee])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (c = e.getAttribute("rel"), c === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (c !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (c = e.getAttribute("src"), (c !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && c && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var c = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === c)
          return e;
      } else return e;
      if (e = Fl(e.nextSibling), e === null) break;
    }
    return null;
  }
  function Bv(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Fl(e.nextSibling), e === null)) return null;
    return e;
  }
  function pd(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Fl(e.nextSibling), e === null)) return null;
    return e;
  }
  function ss(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function rs(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Lv(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function Fl(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var fs = null;
  function Sd(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Fl(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function _d(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else l !== "/$" && l !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function kv(e, t) {
    function l() {
      a = !0;
    }
    if (e.ownerDocument.activeElement === e) return !0;
    var a = !1;
    try {
      e.ownerDocument.addEventListener("focus", l, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
    } finally {
      e.ownerDocument.removeEventListener("focus", l, !0);
    }
    return a;
  }
  function jv(e) {
    od(function() {
      od(function(t) {
        return e(t);
      });
    });
  }
  function Nd(e, t, l) {
    switch (t = mi(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(r(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(r(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function wd(e, t, l) {
    for (var a in l) {
      var n = l[a];
      l.hasOwnProperty(a) && n != null && st(e, t, a, null, vv, n);
    }
    l.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === oa && (e.onclick = null), Ie(e);
  }
  function ds(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    Ie(e);
  }
  var $l = /* @__PURE__ */ new Map(), Td = /* @__PURE__ */ new Set();
  function hi(e) {
    if (typeof e.getRootNode == "function") {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var Ha = fe.d;
  fe.d = {
    f: Yv,
    r: Vv,
    D: Gv,
    C: Qv,
    L: Xv,
    m: Zv,
    X: Jv,
    S: Kv,
    M: Fv
  };
  function Yv() {
    var e = Ha.f(), t = Au();
    return e || t;
  }
  function Vv(e) {
    var t = Yl(e);
    t !== null && t.tag === 5 && t.type === "form" ? z2(t) : Ha.r(e);
  }
  var Sc = typeof document > "u" ? null : document;
  function zd(e, t, l) {
    var a = Sc;
    if (a && typeof t == "string" && t) {
      var n = Vl(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Td.has(n) || (Td.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), $t(t, "link", e), jt(t), a.head.appendChild(t)));
    }
  }
  function Gv(e) {
    Ha.D(e), zd("dns-prefetch", e, null);
  }
  function Qv(e, t) {
    Ha.C(e, t), zd("preconnect", e, t);
  }
  function Xv(e, t, l) {
    Ha.L(e, t, l);
    var a = Sc;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Vl(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Vl(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Vl(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Vl(e) + '"]';
      var c = n;
      switch (t) {
        case "style":
          c = _c(e);
          break;
        case "script":
          c = Nc(e);
      }
      if (!($l.has(c) || (e = k(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), $l.set(c, e), a.querySelector(n) !== null || t === "style" && a.querySelector(vi(c)) || t === "script" && a.querySelector(gi(c))))) {
        var u = a.createElement("link");
        $t(u, "link", e), t === "style" && (u[se] = !0, u.onload = u.onerror = function() {
          Ls(u);
        }), jt(u), a.head.appendChild(u);
      }
    }
  }
  function Zv(e, t) {
    Ha.m(e, t);
    var l = Sc;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Vl(a) + '"][href="' + Vl(e) + '"]', c = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          c = Nc(e);
      }
      if (!$l.has(c) && (e = k({ rel: "modulepreload", href: e }, t), $l.set(c, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(gi(c)))
              return;
        }
        a = l.createElement("link"), $t(a, "link", e), jt(a), l.head.appendChild(a);
      }
    }
  }
  function Kv(e, t, l) {
    Ha.S(e, t, l);
    var a = Sc;
    if (a && e) {
      var n = jn(a).hoistableStyles, c = _c(e);
      t = t || "default";
      var u = n.get(c);
      if (!u) {
        var o = { loading: 0, preload: null };
        if (u = a.querySelector(
          vi(c)
        ))
          o.loading = 5;
        else {
          e = k(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = $l.get(c)) && ms(e, l);
          var m = u = a.createElement("link");
          jt(m), $t(m, "link", e), m._p = new Promise(function(p, C) {
            m.onload = p, m.onerror = C;
          }), m.addEventListener("load", function() {
            o.loading |= 1;
          }), m.addEventListener("error", function() {
            o.loading |= 2;
          }), o.loading |= 4, qu(u, t, a);
        }
        u = {
          type: "stylesheet",
          instance: u,
          count: 1,
          state: o
        }, n.set(c, u);
      }
    }
  }
  function Jv(e, t) {
    Ha.X(e, t);
    var l = Sc;
    if (l && e) {
      var a = jn(l).hoistableScripts, n = Nc(e), c = a.get(n);
      c || (c = l.querySelector(gi(n)), c || (e = k({ src: e, async: !0 }, t), (t = $l.get(n)) && hs(e, t), c = l.createElement("script"), jt(c), $t(c, "link", e), l.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, a.set(n, c));
    }
  }
  function Fv(e, t) {
    Ha.M(e, t);
    var l = Sc;
    if (l && e) {
      var a = jn(l).hoistableScripts, n = Nc(e), c = a.get(n);
      c || (c = l.querySelector(gi(n)), c || (e = k({ src: e, async: !0, type: "module" }, t), (t = $l.get(n)) && hs(e, t), c = l.createElement("script"), jt(c), $t(c, "link", e), l.head.appendChild(c)), c = {
        type: "script",
        instance: c,
        count: 1,
        state: null
      }, a.set(n, c));
    }
  }
  function Cd(e, t, l, a) {
    var n = (n = At.current) ? hi(n) : null;
    if (!n) throw Error(r(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (l = _c(l.href), t = jn(
          n
        ).hoistableStyles, a = t.get(l), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = _c(l.href);
          var c = jn(
            n
          ).hoistableStyles, u = c.get(e);
          if (u || (n = n.ownerDocument || n, u = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, c.set(e, u), (c = n.querySelector(
            vi(e)
          )) ? c._p || (u.instance = c, u.state.loading = 5) : (c = $l.get(e), c || (c = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, $l.set(e, c)), $v(
            n,
            e,
            c,
            u.state
          ))), t && a === null)
            throw Error(r(528, ""));
          return u;
        }
        if (t && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (l = Nc(l), t = jn(
          n
        ).hoistableScripts, a = t.get(l), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, e));
    }
  }
  function _c(e) {
    return 'href="' + Vl(e) + '"';
  }
  function vi(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Md(e) {
    return k({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function $v(e, t, l, a) {
    if (t = e.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[se] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = e.createElement("link"), t[se] = !0, t.onload = t.onerror = Ls.bind(null, t), $t(t, "link", l), jt(t), e.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function Nc(e) {
    return '[src="' + Vl(e) + '"]';
  }
  function gi(e) {
    return "script[async]" + e;
  }
  function Ad(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Vl(l.href) + '"]'
          );
          if (a)
            return t.instance = a, jt(a), a;
          var n = k({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), jt(a), $t(a, "style", n), qu(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = _c(l.href);
          var c = e.querySelector(
            vi(n)
          );
          if (c)
            return t.state.loading |= 4, t.instance = c, jt(c), c;
          a = Md(l), (n = $l.get(n)) && ms(a, n), c = (e.ownerDocument || e).createElement("link"), jt(c);
          var u = c;
          return u._p = new Promise(function(o, m) {
            u.onload = o, u.onerror = m;
          }), $t(c, "link", a), t.state.loading |= 4, qu(c, l.precedence, e), t.instance = c;
        case "script":
          return c = Nc(l.src), (n = e.querySelector(
            gi(c)
          )) ? (t.instance = n, jt(n), n) : (a = l, (n = $l.get(c)) && (a = k({}, l), hs(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), jt(n), $t(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, qu(a, l.precedence, e));
    return t.instance;
  }
  function qu(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, c = n, u = 0; u < a.length; u++) {
      var o = a[u];
      if (o.dataset.precedence === t) c = o;
      else if (c !== n) break;
    }
    c ? c.parentNode.insertBefore(e, c.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function ms(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function hs(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Bu = null;
  function Od(e, t, l) {
    if (Bu === null) {
      var a = /* @__PURE__ */ new Map(), n = Bu = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = Bu, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var c = l[n];
      if (!(c[ee] || c[Ke] || e === "link" && c.getAttribute("rel") === "stylesheet") && c.namespaceURI !== "http://www.w3.org/2000/svg") {
        var u = c.getAttribute(t) || "";
        u = e + u;
        var o = a.get(u);
        o ? o.push(c) : a.set(u, [c]);
      }
    }
    return a;
  }
  function vs(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Wv(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Dd(e, t) {
    return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function xd(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Rd(e) {
    return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Ud(e, t) {
    typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Rd(t), e.suspenseyImages.push(t)), e = eg.bind(e), t.decode().then(e, e));
  }
  function Iv(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = _c(a.href), c = t.querySelector(
          vi(n)
        );
        if (c) {
          t = c._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = yi.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = c, jt(c);
          return;
        }
        c = t.ownerDocument || t, a = Md(a), (n = $l.get(n)) && ms(a, n), c = c.createElement("link"), jt(c);
        var u = c;
        u._p = new Promise(function(o, m) {
          u.onload = o, u.onerror = m;
        }), $t(c, "link", a), l.instance = c;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = yi.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Lu = 0;
  function Pv(e, t) {
    return e.stylesheets && e.count === 0 && ju(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && ju(e, e.stylesheets), e.unsuspend) {
          var c = e.unsuspend;
          e.unsuspend = null, c();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Lu === 0 && (Lu = 62500 * yv());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ju(e, e.stylesheets), e.unsuspend)) {
            var c = e.unsuspend;
            e.unsuspend = null, c();
          }
        },
        (e.imgBytes > Lu ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function Hd(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) ju(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        e.unsuspend = null, t();
      }
    }
  }
  function yi() {
    this.count--, Hd(this);
  }
  function eg() {
    this.imgCount--, Hd(this);
  }
  var ku = null;
  function ju(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, ku = /* @__PURE__ */ new Map(), t.forEach(tg, e), ku = null, yi.call(e));
  }
  function tg(e, t) {
    if (!(t.state.loading & 4)) {
      var l = ku.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), ku.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), c = 0; c < n.length; c++) {
          var u = n[c];
          (u.nodeName === "LINK" || u.getAttribute("media") !== "not all") && (l.set(u.dataset.precedence, u), a = u);
        }
        a && l.set(null, a);
      }
      n = t.instance, u = n.getAttribute("data-precedence"), c = l.get(u) || a, c === a && l.set(null, n), l.set(u, n), this.count++, a = yi.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), c ? c.parentNode.insertBefore(n, c.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var wc = {
    $$typeof: Ze,
    Provider: null,
    Consumer: null,
    _currentValue: Mt,
    _currentValue2: Mt,
    _threadCount: 0
  };
  function lg(e, t, l, a, n, c, u, o, m) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = gn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = gn(0), this.hiddenUpdates = gn(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = c, this.onRecoverableError = u, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = m, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function qd(e, t, l, a, n, c, u, o, m, p, C, q) {
    return e = new lg(
      e,
      t,
      l,
      u,
      m,
      p,
      C,
      q,
      o
    ), t = 1, c === !0 && (t |= 24), c = bl(3, null, null, t), e.current = c, c.stateNode = e, t = A0(), t.refCount++, e.pooledCache = t, t.refCount++, c.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, R0(c), e;
  }
  function Bd(e) {
    return e ? (e = $n, e) : $n;
  }
  function Ld(e, t, l, a, n, c) {
    n = Bd(n), a.context === null ? a.context = n : a.pendingContext = n, a = Ka(t), a.payload = { element: l }, c = c === void 0 ? null : c, c !== null && (a.callback = c), l = Ja(e, a, t), l !== null && (_l(l, e, t), Jc(l, e, t));
  }
  function kd(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function gs(e, t) {
    kd(e, t), (e = e.alternate) && kd(e, t);
  }
  function jd(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = pn(e, 67108864);
      t !== null && _l(t, e, 67108864), gs(e, 67108864);
    }
  }
  function Yd(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = xl();
      t = ce(t);
      var l = pn(e, t);
      l !== null && _l(l, e, t), gs(e, t);
    }
  }
  var Tc = !0;
  function ag(e, t, l, a) {
    var n = ne.T;
    ne.T = null;
    var c = fe.p;
    try {
      fe.p = 2, ys(e, t, l, a);
    } finally {
      fe.p = c, ne.T = n;
    }
  }
  function ng(e, t, l, a) {
    var n = ne.T;
    ne.T = null;
    var c = fe.p;
    try {
      fe.p = 8, ys(e, t, l, a);
    } finally {
      fe.p = c, ne.T = n;
    }
  }
  function ys(e, t, l, a) {
    if (Tc) {
      var n = bs(a);
      if (n === null)
        Io(
          e,
          t,
          a,
          Yu,
          l
        ), Gd(e, a);
      else if (ig(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Gd(e, a), t & 4 && -1 < cg.indexOf(e)) {
        for (; n !== null; ) {
          var c = Yl(n);
          if (c !== null)
            switch (c.tag) {
              case 3:
                if (c = c.stateNode, c.current.memoizedState.isDehydrated) {
                  var u = nl(c.pendingLanes);
                  if (u !== 0) {
                    var o = c;
                    for (o.pendingLanes |= 2, o.entangledLanes |= 2; u; ) {
                      var m = 1 << 31 - qt(u);
                      o.entanglements[1] |= m, u &= ~m;
                    }
                    ba(c), (lt & 6) === 0 && (zu = St() + 500, ri(0));
                  }
                }
                break;
              case 31:
              case 13:
                o = pn(c, 2), o !== null && _l(o, c, 2), Au(), gs(c, 2);
            }
          if (c = bs(a), c === null && Io(
            e,
            t,
            a,
            Yu,
            l
          ), c === n) break;
          n = c;
        }
        n !== null && a.stopPropagation();
      } else
        Io(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function bs(e) {
    return e = l0(e), Es(e);
  }
  var Yu = null;
  function Es(e) {
    if (Yu = null, e = Bt(e), e !== null) {
      var t = j(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = Z(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = V(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Yu = e, null;
  }
  function Vd(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Ea()) {
          case kl:
            return 2;
          case pa:
            return 8;
          case Xt:
          case wl:
            return 32;
          case yl:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ps = !1, un = null, on = null, sn = null, bi = /* @__PURE__ */ new Map(), Ei = /* @__PURE__ */ new Map(), rn = [], cg = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Gd(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        un = null;
        break;
      case "dragenter":
      case "dragleave":
        on = null;
        break;
      case "mouseover":
      case "mouseout":
        sn = null;
        break;
      case "pointerover":
      case "pointerout":
        bi.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Ei.delete(t.pointerId);
    }
  }
  function pi(e, t, l, a, n, c) {
    return e === null || e.nativeEvent !== c ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: c,
      targetContainers: [n]
    }, t !== null && (t = Yl(t), t !== null && jd(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function ig(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return un = pi(
          un,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return on = pi(
          on,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return sn = pi(
          sn,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var c = n.pointerId;
        return bi.set(
          c,
          pi(
            bi.get(c) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return c = n.pointerId, Ei.set(
          c,
          pi(
            Ei.get(c) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function Qd(e) {
    var t = Bt(e.target);
    if (t !== null) {
      var l = j(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = Z(l), t !== null) {
            e.blockedOn = t, Ne(e.priority, function() {
              Yd(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = V(l), t !== null) {
            e.blockedOn = t, Ne(e.priority, function() {
              Yd(l);
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Vu(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = bs(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        t0 = a, l.target.dispatchEvent(a), t0 = null;
      } else
        return t = Yl(l), t !== null && jd(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Xd(e, t, l) {
    Vu(e) && l.delete(t);
  }
  function ug() {
    ps = !1, un !== null && Vu(un) && (un = null), on !== null && Vu(on) && (on = null), sn !== null && Vu(sn) && (sn = null), bi.forEach(Xd), Ei.forEach(Xd);
  }
  function Gu(e, t) {
    e.blockedOn === t && (e.blockedOn = null, ps || (ps = !0, s.unstable_scheduleCallback(
      s.unstable_NormalPriority,
      ug
    )));
  }
  var Qu = null;
  function Zd(e) {
    Qu !== e && (Qu = e, s.unstable_scheduleCallback(
      s.unstable_NormalPriority,
      function() {
        Qu === e && (Qu = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (Es(a || l) === null)
              continue;
            break;
          }
          var c = Yl(l);
          c !== null && (e.splice(t, 3), t -= 3, eo(
            c,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function zc(e) {
    function t(m) {
      return Gu(m, e);
    }
    un !== null && Gu(un, e), on !== null && Gu(on, e), sn !== null && Gu(sn, e), bi.forEach(t), Ei.forEach(t);
    for (var l = 0; l < rn.length; l++) {
      var a = rn[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < rn.length && (l = rn[0], l.blockedOn === null); )
      Qd(l), l.blockedOn === null && rn.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], c = l[a + 1], u = n[$e] || null;
        if (typeof c == "function")
          u || Zd(l);
        else if (u) {
          var o = null;
          if (c && c.hasAttribute("formAction")) {
            if (n = c, u = c[$e] || null)
              o = u.formAction;
            else if (Es(n) !== null) continue;
          } else o = u.action;
          typeof o == "function" ? l[a + 1] = o : (l.splice(a, 3), a -= 3), Zd(l);
        }
      }
  }
  function Kd() {
    function e(c) {
      c.canIntercept && c.info === "react-transition" && c.intercept({
        handler: function() {
          return new Promise(function(u) {
            return n = u;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var c = navigation.currentEntry;
        c && c.url != null && navigation.navigate(c.url, {
          state: c.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Ss(e) {
    this._internalRoot = e;
  }
  Xu.prototype.render = Ss.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var l = t.current, a = xl();
    Ld(l, a, e, t, null, null);
  }, Xu.prototype.unmount = Ss.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Ld(e.current, 2, null, e, null, null), Au(), t[Be] = null;
    }
  };
  function Xu(e) {
    this._internalRoot = e;
  }
  Xu.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = et();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < rn.length && t !== 0 && t < rn[l].priority; l++) ;
      rn.splice(l, 0, e), l === 0 && Qd(e);
    }
  };
  var Jd = d.version;
  if (Jd !== "19.3.1")
    throw Error(
      r(
        527,
        Jd,
        "19.3.1"
      )
    );
  fe.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(r(188)) : (e = Object.keys(e).join(","), Error(r(268, e)));
    return e = x(t), e = e !== null ? O(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var og = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ne,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Zu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Zu.isDisabled && Zu.supportsFiber)
      try {
        jl = Zu.inject(
          og
        ), W = Zu;
      } catch {
      }
  }
  return Si.createRoot = function(e, t) {
    if (!T(e)) throw Error(r(299));
    var l = !1, a = "", n = q2, c = B2, u = L2;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (c = t.onCaughtError), t.onRecoverableError !== void 0 && (u = t.onRecoverableError)), t = qd(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      c,
      u,
      Kd
    ), e[Be] = t.current, Wo(e), new Ss(t);
  }, Si.hydrateRoot = function(e, t, l) {
    if (!T(e)) throw Error(r(299));
    var a = !1, n = "", c = q2, u = B2, o = L2, m = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (c = l.onUncaughtError), l.onCaughtError !== void 0 && (u = l.onCaughtError), l.onRecoverableError !== void 0 && (o = l.onRecoverableError), l.formState !== void 0 && (m = l.formState)), t = qd(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      m,
      c,
      u,
      o,
      Kd
    ), t.context = Bd(null), l = t.current, a = xl(), a = ce(a), n = Ka(a), n.callback = null, Ja(l, n, a), l = a, t.current.lanes = l, ol(t, l), ba(t), e[Be] = t.current, Wo(e), new Xu(t);
  }, Si.version = "19.3.1", Si;
}
var lm;
function gg() {
  if (lm) return Ns.exports;
  lm = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (d) {
        console.error(d);
      }
  }
  return s(), Ns.exports = vg(), Ns.exports;
}
var yg = gg(), vm;
const Ku = ((vm = document.querySelector('meta[name="tornado-root"]')) == null ? void 0 : vm.content) || "";
function Ct(s) {
  return typeof s == "string" && s.startsWith("/") && !s.startsWith("//") && !(Ku && (s === Ku || s.startsWith(Ku + "/"))) ? Ku + s : s;
}
const Ac = /* @__PURE__ */ new Map();
function wi(s) {
  const d = Ac.get(s);
  return d && Date.now() - d.at < 3e4 ? d.value : void 0;
}
function Dc(s, d) {
  const y = wi(s);
  return y !== void 0 ? Promise.resolve(y) : Te(s, { signal: d }).then((r) => (d != null && d.aborted || (Ac.size >= 64 && Ac.delete(Ac.keys().next().value), Ac.set(s, { at: Date.now(), value: r })), r));
}
const Ti = "Соединение с сервером потеряно";
async function Te(s, d = {}) {
  var Z, V;
  const { json: y, ...r } = d;
  y !== void 0 && (r.headers = { "Content-Type": "application/json", ...r.headers }, r.body = JSON.stringify(y));
  let T;
  try {
    T = await fetch(Ct(s), r);
  } catch (L) {
    throw (Z = r.signal) != null && Z.aborted ? L : (window.dispatchEvent(new Event("tornado:connection-lost")), new Error(Ti));
  }
  if ([502, 503, 504].includes(T.status))
    throw window.dispatchEvent(new Event("tornado:connection-lost")), new Error(Ti);
  if (T.status === 401)
    throw location.assign(Ct("/login")), new Error("Сеанс завершён");
  let j;
  try {
    j = await T.json();
  } catch (L) {
    throw (V = r.signal) != null && V.aborted ? L : T.status >= 500 ? (window.dispatchEvent(new Event("tornado:connection-lost")), new Error(Ti)) : new Error("Сервер вернул неожиданный ответ");
  }
  if (!T.ok || j != null && j.error) {
    const L = {
      400: "Проверьте введённые данные.",
      403: "У вас нет доступа к этому действию.",
      404: "Эти данные больше недоступны.",
      413: "Файл слишком большой. Выберите файл меньшего размера.",
      429: "Слишком много запросов. Подождите немного."
    }, x = [j == null ? void 0 : j.error, j == null ? void 0 : j.description].find((g) => typeof g == "string" && /[а-яё]/i.test(g)), O = new Error(x || L[T.status] || "Не удалось выполнить действие.");
    throw O.field = j == null ? void 0 : j.field, O;
  }
  return r.method && r.method !== "GET" && Ac.clear(), j;
}
const It = JSON.parse(document.getElementById("tornado-session").textContent), Hs = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }), bg = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
function ym(s) {
  if (s != null && s.online) return "в сети";
  const d = s == null ? void 0 : s.last_seen;
  if (!d) return "";
  const y = new Date(d.includes("T") ? d : d.replace(" ", "T") + "Z");
  return Number.isFinite(y.valueOf()) ? "был(а) " + bg.format(y) + " в " + Hs.format(y) : "";
}
const Eg = new Intl.PluralRules("ru-RU");
function bm(s, d) {
  const y = d ? { one: "подписчик", few: "подписчика", many: "подписчиков" } : { one: "участник", few: "участника", many: "участников" };
  return s.toLocaleString("ru-RU") + " " + (y[Eg.select(s)] || y.many);
}
function Ju(s, d) {
  var y, r, T, j;
  return {
    id: s.id,
    text: s.content,
    own: s.user_id === It.id,
    at: Date.parse(s.sent_at),
    sender: d && s.user_id !== It.id ? s.author_name || s.login : null,
    author: s.author_name || s.login,
    authorId: s.user_id,
    avatar: s.avatar,
    reactions: s.reactions || [],
    read: s.is_read,
    edited: s.is_edited,
    keyboard: (y = s.reply_markup) == null ? void 0 : y.inline_keyboard,
    quote: (r = s.reply) == null ? void 0 : r.text,
    audio: (T = s.file_type) != null && T.startsWith("audio/") ? Ct(s.file_url) : null,
    file: s.file_url && !((j = s.file_type) != null && j.startsWith("audio/")) ? { name: s.file_name, url: Ct(s.file_url) } : null
  };
}
async function pg(s, d) {
  var r;
  const y = d.forwarded ? "Переслано из «" + d.forwarded + `»
` + (d.text || "") : d.text || "";
  if (d.file || d.audio) {
    const T = new FormData();
    T.set("chat_id", s), T.set("caption", y), d.forwardFrom && T.set("forward_from", d.forwardFrom), d.replyId && T.set("reply_to_id", d.replyId), d.audio && T.set("msg_type", "voice");
    let j = d.audio || d.file;
    const Z = ((r = d.file) == null ? void 0 : r.name) || "voice.webm";
    if (!(j instanceof Blob)) {
      const V = await fetch(j.url || j);
      if (!V.ok) throw new Error("Не удалось открыть вложение");
      j = await V.blob();
    }
    return T.append("file", j, Z), Te("/api/upload", { method: "POST", body: T });
  }
  return Te("/api/messages", { method: "POST", json: { chat_id: Number(s), content: y, reply_to_id: d.replyId, forward_from: d.forwardFrom } });
}
var Sg = gm();
const _g = (s) => (s.match(/\d+[xX]\d+|[A-Z]?[a-z]+|[A-Z]|\d+/g) ?? []).join("-").toLowerCase();
function Ng(s, d, y = []) {
  if (d == null)
    throw new Error("[lucide]: iconNode is required when icon name is used");
  return {
    name: _g(s),
    size: 24,
    node: d,
    ...y.length > 0 ? { aliases: y } : {}
  };
}
const wg = (s) => {
  let d = "", y = !1;
  for (const r of s) {
    if (r === "-" || r === "_" || r <= " ") {
      y = d.length > 0;
      continue;
    }
    d.length === 0 ? d += r.toLowerCase() : d += y ? r.toUpperCase() : r, y = !1;
  }
  return d;
}, Tg = (s) => {
  const d = wg(s);
  return d.charAt(0).toUpperCase() + d.slice(1);
}, xs = (...s) => {
  const d = /* @__PURE__ */ new Set();
  for (const y of s)
    if (typeof y == "string")
      for (const r of y.split(/\s+/))
        r && d.add(r);
  return [...d].join(" ");
}, Cc = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function Cs(s) {
  return s != null;
}
function zg(s, d = {}) {
  var z, D;
  const y = d.attributeNames ?? {}, r = (K) => y[K] ?? K, T = s.size ?? s.width ?? Cc.width, j = s.size ?? s.height ?? Cc.height, Z = ((z = s.aliases) == null ? void 0 : z.filter((K) => typeof K == "string" && K.trim() !== "").map((K) => `lucide-${K}`)) ?? [], V = [...s.name ? [`lucide-${s.name}`] : [], ...Z], L = ((D = d.className) == null ? void 0 : D.split(" ").filter(Boolean)) ?? [], x = d.includeDefaultClasses === !1 ? xs(...L) : xs("lucide", ...V, ...L);
  let O = d.strokeWidth ?? Cc["stroke-width"];
  if (d.absoluteStrokeWidth) {
    const K = Number(O) * Number(s.size ?? s.width ?? Cc.width) / Number(d.size ?? d.width ?? Cc.width);
    Number.isFinite(K) && (O = K);
  }
  return [
    "svg",
    {
      ...Object.entries(Cc).reduce((K, [re, X]) => (K[r(re)] = X, K), {}),
      ..."color" in d && d.color && {
        [r("stroke")]: d.color
      },
      ..."size" in d && Cs(d.size) && {
        [r("width")]: d.size,
        [r("height")]: d.size
      },
      ..."width" in d && Cs(d.width) && {
        [r("width")]: d.width
      },
      ..."height" in d && Cs(d.height) && {
        [r("height")]: d.height
      },
      [r("stroke-width")]: O,
      ...x && {
        [r("class")]: x
      },
      [r("viewBox")]: `0 0 ${T} ${j}`,
      ...d.hasA11yProp === !1 ? {
        [r("aria-hidden")]: "true"
      } : {},
      ..."attributes" in d && d.attributes
    },
    s.node.map((K) => {
      const [re, X, J] = K, $ = d.nonScalingStroke ? { [r("vector-effect")]: "non-scaling-stroke", ...X } : X;
      return J ? [re, $, J] : [re, $];
    })
  ];
}
function Cg(s, d = {}) {
  return zg(s, {
    ...d,
    attributeNames: {
      ...d.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}
const Mg = (s) => {
  if (s == null || typeof s != "object")
    return !1;
  for (const d in s)
    if (Object.prototype.hasOwnProperty.call(s, d) && (d.startsWith("aria-") || d === "role" || d === "title") && s[d] != null)
      return !0;
  return !1;
}, Ag = _.createContext({}), Og = () => _.useContext(Ag), Dg = _.forwardRef(
  ({
    color: s,
    size: d,
    width: y,
    height: r,
    strokeWidth: T,
    absoluteStrokeWidth: j,
    nonScalingStroke: Z,
    className: V = "",
    children: L,
    iconNode: x = [],
    icon: O = {
      node: x,
      aliases: [],
      size: 24
    },
    ...g
  }, z) => {
    const {
      size: D = 24,
      strokeWidth: K = 2,
      absoluteStrokeWidth: re = !1,
      nonScalingStroke: X = !1,
      color: J = "currentColor",
      className: $ = ""
    } = Og() ?? {}, ve = !!L || Mg(g), [ae, Oe, Q = []] = Cg(O, {
      color: s ?? J,
      width: y ?? d ?? D,
      height: r ?? d ?? D,
      strokeWidth: T ?? K,
      absoluteStrokeWidth: j ?? re,
      nonScalingStroke: Z ?? X,
      className: xs($, V),
      hasA11yProp: ve,
      attributes: g
    });
    return _.createElement(
      ae,
      {
        ref: z,
        ...Oe
      },
      [
        ...Q.map(([k, ge]) => _.createElement(k, ge)),
        ...Array.isArray(L) ? L : [L]
      ]
    );
  }
);
function ye(s, d = [], y = []) {
  const r = typeof s == "string" ? Ng(s, d, y) : s, T = _.forwardRef(
    ({ className: j, ...Z }, V) => _.createElement(Dg, {
      ref: V,
      icon: r,
      className: j,
      ...Z
    })
  );
  return r.name && (T.displayName = Tg(r.name)), T;
}
const Em = {
  name: "archive",
  size: 24,
  node: [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", key: "1s80jp" }],
    ["path", { d: "M10 12h4", key: "a56b0p" }]
  ]
};
Em.node;
const xg = ye(Em), pm = {
  name: "arrow-left",
  size: 24,
  node: [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }]
  ]
};
pm.node;
const Rg = ye(pm), Sm = {
  name: "arrow-right",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
  ]
};
Sm.node;
const Ug = ye(Sm), _m = {
  name: "at-sign",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }]
  ]
};
_m.node;
const Hg = ye(_m), Nm = {
  name: "bell-off",
  size: 24,
  node: [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
        key: "178tsu"
      }
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
    ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
  ]
};
Nm.node;
const qg = ye(Nm), wm = {
  name: "bell",
  size: 24,
  node: [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
    [
      "path",
      {
        d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        key: "11g9vi"
      }
    ]
  ]
};
wm.node;
const Bg = ye(wm), Tm = {
  name: "camera",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
        key: "18u6gg"
      }
    ],
    ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
  ]
};
Tm.node;
const am = ye(Tm), zm = {
  name: "check-check",
  size: 24,
  node: [
    ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
    ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
  ]
};
zm.node;
const Lg = ye(zm), Cm = {
  name: "check",
  size: 24,
  node: [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]
};
Cm.node;
const kg = ye(Cm), Mm = {
  name: "chevron-down",
  size: 24,
  node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]
};
Mm.node;
const nm = ye(Mm), Am = {
  name: "chevron-right",
  size: 24,
  node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]
};
Am.node;
const jg = ye(Am), Om = {
  name: "circle-check",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m16 9-5.5 5.5L8 12", key: "xofnsj" }]
  ],
  aliases: ["check-circle-2"]
};
Om.node;
const Yg = ye(Om), Dm = {
  name: "circle-exclamation-point",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
  ],
  aliases: ["alert-circle", "circle-alert"]
};
Dm.node;
const Vg = ye(Dm), xm = {
  name: "circle-slash",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "9", x2: "15", y1: "15", y2: "9", key: "1dfufj" }]
  ]
};
xm.node;
const Gg = ye(xm), Rm = {
  name: "clock",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
  ]
};
Rm.node;
const Qg = ye(Rm), Um = {
  name: "code-xml",
  size: 24,
  node: [
    ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
    ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
    ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
  ],
  aliases: ["code-2"]
};
Um.node;
const Xg = ye(Um), Hm = {
  name: "copy",
  size: 24,
  node: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]
};
Hm.node;
const Zg = ye(Hm), qm = {
  name: "door-open",
  size: 24,
  node: [
    ["path", { d: "M10 21H2", key: "1sthdo" }],
    ["path", { d: "M10 3H7a2 2 0 00-2 2v16", key: "15gt7x" }],
    ["path", { d: "M14 12h.01", key: "1jfl7z" }],
    [
      "path",
      {
        d: "M19 21V5a2 2 0 00-1.675-1.974l-6.163-1.013A1 1 0 0010 3v18a1 1 0 001.124.992z",
        key: "tyvg9a"
      }
    ],
    ["path", { d: "M22 21h-3", key: "1ec3tr" }]
  ]
};
qm.node;
const Kg = ye(qm), Bm = {
  name: "download",
  size: 24,
  node: [
    ["path", { d: "M12 15V3", key: "m9g1x1" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
  ]
};
Bm.node;
const Jg = ye(Bm), Lm = {
  name: "ellipsis-vertical",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
    ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
    ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
  ],
  aliases: ["more-vertical"]
};
Lm.node;
const Fg = ye(Lm), km = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
km.node;
const $g = ye(km), jm = {
  name: "eye",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]
};
jm.node;
const Wg = ye(jm), Ym = {
  name: "face-slightly-smiling",
  size: 24,
  node: [
    ["path", { d: "M15 10V9", key: "4dkmfx" }],
    ["path", { d: "M16.472 15a6 6 0 01-8.943 0", key: "7qomzy" }],
    ["path", { d: "M9 10V9", key: "1lazqi" }],
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
  ],
  aliases: ["smile"]
};
Ym.node;
const Ig = ye(Ym), Vm = {
  name: "folder",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        key: "1kt360"
      }
    ]
  ]
};
Vm.node;
const Pg = ye(Vm), Gm = {
  name: "forward",
  size: 24,
  node: [
    ["path", { d: "m15 17 5-5-5-5", key: "nf172w" }],
    ["path", { d: "M4 18v-2a4 4 0 0 1 4-4h12", key: "jmiej9" }]
  ]
};
Gm.node;
const e5 = ye(Gm), Qm = {
  name: "globe",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
    ["path", { d: "M2 12h20", key: "9i4pu4" }]
  ]
};
Qm.node;
const t5 = ye(Qm), Xm = {
  name: "heart",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        key: "mvr1a0"
      }
    ]
  ]
};
Xm.node;
const l5 = ye(Xm), Zm = {
  name: "info",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }]
  ]
};
Zm.node;
const a5 = ye(Zm), Km = {
  name: "keyboard",
  size: 24,
  node: [
    ["path", { d: "M10 8h.01", key: "1r9ogq" }],
    ["path", { d: "M12 12h.01", key: "1mp3jc" }],
    ["path", { d: "M14 8h.01", key: "1primd" }],
    ["path", { d: "M16 12h.01", key: "1l6xoz" }],
    ["path", { d: "M18 8h.01", key: "emo2bl" }],
    ["path", { d: "M6 8h.01", key: "x9i8wu" }],
    ["path", { d: "M7 16h10", key: "wp8him" }],
    ["path", { d: "M8 12h.01", key: "czm47f" }],
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2", key: "18n3k1" }]
  ]
};
Km.node;
const n5 = ye(Km), Jm = {
  name: "layout-grid",
  size: 24,
  node: [
    ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
    ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
    ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
    ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
  ]
};
Jm.node;
const c5 = ye(Jm), Fm = {
  name: "link-2",
  size: 24,
  node: [
    ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
    ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
  ]
};
Fm.node;
const i5 = ye(Fm), $m = {
  name: "lock-open",
  size: 24,
  node: [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
  ],
  aliases: ["unlock"]
};
$m.node;
const u5 = ye($m), Wm = {
  name: "lock",
  size: 24,
  node: [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
  ]
};
Wm.node;
const o5 = ye(Wm), Im = {
  name: "megaphone",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
        key: "q8bfy3"
      }
    ],
    ["path", { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14", key: "1853fq" }],
    ["path", { d: "M8 6v8", key: "15ugcq" }]
  ]
};
Im.node;
const s5 = ye(Im), Pm = {
  name: "menu",
  size: 24,
  node: [
    ["path", { d: "M4 5h16", key: "1tepv9" }],
    ["path", { d: "M4 12h16", key: "1lakjw" }],
    ["path", { d: "M4 19h16", key: "1djgab" }]
  ]
};
Pm.node;
const r5 = ye(Pm), e1 = {
  name: "message-circle",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        key: "1sd12s"
      }
    ]
  ]
};
e1.node;
const Ms = ye(e1), t1 = {
  name: "mic",
  size: 24,
  node: [
    ["path", { d: "M12 19v3", key: "npa21l" }],
    ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
    ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
  ]
};
t1.node;
const f5 = ye(t1), l1 = {
  name: "paperclip",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
        key: "1miecu"
      }
    ]
  ]
};
l1.node;
const d5 = ye(l1), a1 = {
  name: "pencil",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        key: "1a8usu"
      }
    ],
    ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
  ]
};
a1.node;
const m5 = ye(a1), n1 = {
  name: "phone",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        key: "9njp5v"
      }
    ]
  ]
};
n1.node;
const cm = ye(n1), c1 = {
  name: "pin",
  size: 24,
  node: [
    ["path", { d: "M12 17v5", key: "bb1du9" }],
    [
      "path",
      {
        d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
        key: "1nkz8b"
      }
    ]
  ]
};
c1.node;
const h5 = ye(c1), i1 = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]
};
i1.node;
const v5 = ye(i1), u1 = {
  name: "qr-code",
  size: 24,
  node: [
    ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" }],
    ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" }],
    ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" }],
    ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
    ["path", { d: "M21 21v.01", key: "ents32" }],
    ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
    ["path", { d: "M3 12h.01", key: "nlz23k" }],
    ["path", { d: "M12 3h.01", key: "n36tog" }],
    ["path", { d: "M12 16v.01", key: "133mhm" }],
    ["path", { d: "M16 12h1", key: "1slzba" }],
    ["path", { d: "M21 12v.01", key: "1lwtk9" }],
    ["path", { d: "M12 21v-1", key: "1880an" }]
  ]
};
u1.node;
const g5 = ye(u1), o1 = {
  name: "refresh-cw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]
};
o1.node;
const y5 = ye(o1), s1 = {
  name: "reply",
  size: 24,
  node: [
    ["path", { d: "M20 18v-2a4 4 0 0 0-4-4H4", key: "5vmcpk" }],
    ["path", { d: "m9 17-5-5 5-5", key: "nvlc11" }]
  ]
};
s1.node;
const b5 = ye(s1), r1 = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ]
};
r1.node;
const E5 = ye(r1), f1 = {
  name: "send",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        key: "1ffxy3"
      }
    ],
    ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
  ]
};
f1.node;
const p5 = ye(f1), d1 = {
  name: "settings",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]
};
d1.node;
const S5 = ye(d1), m1 = {
  name: "shield-check",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
  ]
};
m1.node;
const _5 = ye(m1), h1 = {
  name: "shield",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ]
  ]
};
h1.node;
const N5 = ye(h1), v1 = {
  name: "square",
  size: 24,
  node: [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]]
};
v1.node;
const w5 = ye(v1), g1 = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ],
  aliases: ["trash-2"]
};
g1.node;
const im = ye(g1), y1 = {
  name: "user-round-plus",
  size: 24,
  node: [
    ["path", { d: "M2 21a8 8 0 0 1 13.292-6", key: "bjp14o" }],
    ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }],
    ["path", { d: "M19 16v6", key: "tddt3s" }],
    ["path", { d: "M22 19h-6", key: "vcuq98" }]
  ],
  aliases: ["user-plus-2"]
};
y1.node;
const As = ye(y1), b1 = {
  name: "user-round-x",
  size: 24,
  node: [
    ["path", { d: "m16.5 16.5 5 5", key: "zc9lw7" }],
    ["path", { d: "M2 21a8 8 0 0 1 11.531-7.18", key: "x5izle" }],
    ["path", { d: "m21.5 16.5-5 5", key: "1empo3" }],
    ["circle", { cx: "10", cy: "8", r: "5", key: "o932ke" }]
  ],
  aliases: ["user-x-2"]
};
b1.node;
const T5 = ye(b1), E1 = {
  name: "user-round",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
    ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }]
  ],
  aliases: ["user-2"]
};
E1.node;
const um = ye(E1), p1 = {
  name: "users",
  size: 24,
  node: [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
    ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
  ]
};
p1.node;
const z5 = ye(p1), S1 = {
  name: "video",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
        key: "ftymec"
      }
    ],
    ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
  ]
};
S1.node;
const C5 = ye(S1), _1 = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
_1.node;
const M5 = ye(_1), A5 = {
  error: Vg,
  archive: xg,
  arrow_back: Rg,
  arrow_forward: Ug,
  check: kg,
  checkAll: Lg,
  close: M5,
  edit: m5,
  search: E5,
  phone: cm,
  telephone: cm,
  more: Fg,
  menu: r5,
  expand_more: nm,
  chevron_right: jg,
  notifications: Bg,
  notifications_off: qg,
  privacy_tip: N5,
  admin_panel_settings: _5,
  account_circle: um,
  person: um,
  group_add: As,
  person_add: As,
  person_off: T5,
  how_to_reg: As,
  groups: z5,
  info: a5,
  alternate_email: Hg,
  chat_bubble: Ms,
  forum: Ms,
  lock: o5,
  lock_open: u5,
  favorite: l5,
  qr_code_2: g5,
  add_a_photo: am,
  photo_camera: am,
  content_copy: Zg,
  view_compact_alt: c5,
  keyboard: n5,
  logout: Kg,
  link: i5,
  public: t5,
  autorenew: y5,
  campaign: s5,
  block: Gg,
  videocam: C5,
  mark_chat_unread: Ms,
  check_circle: Yg,
  open_in_new: $g,
  visibility: Wg,
  folder: Pg,
  forward: e5,
  reply: b5,
  push_pin: h5,
  delete: im,
  trash: im,
  paperclip: d5,
  mic: f5,
  send: p5,
  stop: w5,
  smile: Ig,
  down: nm,
  settings: S5,
  add: v5,
  code: Xg,
  schedule: Qg,
  download: Jg
};
function Hl({ name: s }) {
  const d = A5[s];
  return d ? /* @__PURE__ */ i.createElement(d, { "aria-hidden": "true", className: "outline-icon profile-symbol", size: 20, strokeWidth: 1.75 }) : null;
}
function qe({ name: s }) {
  return /* @__PURE__ */ i.createElement(Hl, { name: s });
}
function Pt({ message: s, id: d, className: y = "" }) {
  return s ? /* @__PURE__ */ i.createElement("p", { id: d, className: "form-error " + y, role: "alert" }, /* @__PURE__ */ i.createElement(qe, { name: "error" }), /* @__PURE__ */ i.createElement("span", null, s)) : null;
}
function ct({ title: s, children: d, hint: y, options: r = !1 }) {
  return /* @__PURE__ */ i.createElement("section", { className: "access-section" }, /* @__PURE__ */ i.createElement("h3", null, s), /* @__PURE__ */ i.createElement("div", { className: "access-card" + (r ? " option-card" : "") }, d), y && /* @__PURE__ */ i.createElement("p", { className: "access-hint" }, y));
}
function ql({ label: s, detail: d, checked: y, onChange: r, disabled: T = !1 }) {
  return /* @__PURE__ */ i.createElement("label", { className: "access-switch-row" }, /* @__PURE__ */ i.createElement("span", { className: "access-option-copy" }, /* @__PURE__ */ i.createElement("strong", null, s), d && /* @__PURE__ */ i.createElement("small", null, d)), /* @__PURE__ */ i.createElement("input", { type: "checkbox", role: "switch", checked: y, disabled: T, onChange: (j) => r(j.target.checked) }));
}
function _i({ name: s, checked: d, onChange: y, title: r, detail: T, icon: j }) {
  return /* @__PURE__ */ i.createElement("label", { className: "access-option" }, /* @__PURE__ */ i.createElement("input", { type: "radio", name: s, checked: d, onChange: y }), /* @__PURE__ */ i.createElement("span", { className: "access-option-copy" }, /* @__PURE__ */ i.createElement("strong", null, r), T && /* @__PURE__ */ i.createElement("small", null, T)), j && /* @__PURE__ */ i.createElement(qe, { name: j }));
}
function Ln({ children: s, icon: d = "check", disabled: y, type: r = "submit", onClick: T }) {
  return /* @__PURE__ */ i.createElement("footer", { className: "access-footer" }, /* @__PURE__ */ i.createElement("button", { type: r, className: "access-save", disabled: y, onClick: T }, /* @__PURE__ */ i.createElement(qe, { name: d }), s));
}
function ml({ label: s, multiline: d = !1, error: y, formatError: r, onChange: T, ...j }) {
  const Z = d ? "textarea" : "input", V = i.useId(), [L, x] = i.useState(""), O = L || y, g = [j["aria-describedby"], O && V].filter(Boolean).join(" ");
  return /* @__PURE__ */ i.createElement("div", { className: "floating-field-group" }, /* @__PURE__ */ i.createElement("label", { className: "floating-field" }, /* @__PURE__ */ i.createElement(
    Z,
    {
      placeholder: " ",
      ...j,
      "aria-invalid": O ? !0 : void 0,
      "aria-describedby": g || void 0,
      onChange: (z) => {
        x(""), T == null || T(z);
      },
      onInvalid: (z) => {
        var K;
        z.preventDefault();
        const D = z.currentTarget;
        x(D.validity.valueMissing ? "Заполните это поле." : r || "Проверьте значение в этом поле."), ((K = D.form) == null ? void 0 : K.querySelector(":invalid")) === D && D.focus();
      }
    }
  ), /* @__PURE__ */ i.createElement("span", null, s)), /* @__PURE__ */ i.createElement(Pt, { id: V, className: "field-error", message: O }));
}
function Ul({ src: s, name: d = "", className: y = "" }) {
  return /* @__PURE__ */ i.createElement("span", { className: "panel-portrait " + y }, /* @__PURE__ */ i.createElement("span", { "aria-hidden": "true" }, String(d ?? "").trim().split(/\s+/).slice(0, 2).map((r) => r[0]).join("").toUpperCase() || "T"), s && /* @__PURE__ */ i.createElement("img", { src: Ct(s), alt: "", onError: (r) => {
    r.currentTarget.hidden = !0;
  } }));
}
function qs({ avatar: s, file: d, onChange: y, label: r = "Выбрать фото" }) {
  const [T, j] = i.useState("");
  return i.useEffect(() => {
    if (!d) {
      j("");
      return;
    }
    const Z = URL.createObjectURL(d);
    return j(Z), () => URL.revokeObjectURL(Z);
  }, [d]), /* @__PURE__ */ i.createElement("label", { className: "panel-avatar-picker", "aria-label": r }, (T || s) && /* @__PURE__ */ i.createElement(Ul, { src: T || s }), /* @__PURE__ */ i.createElement(Hl, { name: "add_a_photo" }), /* @__PURE__ */ i.createElement("input", { type: "file", accept: "image/jpeg,image/png,image/webp,image/gif", "aria-label": r, onChange: (Z) => {
    const V = Z.target.files[0];
    V && y(V);
  } }));
}
async function N1(s, d, y) {
  const r = new FormData();
  return r.set("avatar", y), s("/api/chats/" + d + "/avatar", { method: "POST", body: r });
}
function Ba({ label: s = "Загрузка…", className: d = "" }) {
  return /* @__PURE__ */ i.createElement("div", { className: "ui-loader " + d, role: "status", "aria-label": s }, /* @__PURE__ */ i.createElement("span", { className: "loader-wheel", "aria-hidden": "true" }), /* @__PURE__ */ i.createElement("span", null, s));
}
function O5({ label: s, value: d, options: y, onChange: r }) {
  var L;
  const [T, j] = i.useState(!1), Z = i.useRef(null), V = i.useRef(null);
  return i.useEffect(() => {
    if (!T) return;
    const x = (z) => {
      var D;
      (D = Z.current) != null && D.contains(z.target) || j(!1);
    }, O = (z) => {
      var D;
      z.key === "Escape" && (z.stopPropagation(), j(!1), (D = V.current) == null || D.focus());
    }, g = Z.current;
    return document.addEventListener("pointerdown", x), g.addEventListener("keydown", O), () => {
      document.removeEventListener("pointerdown", x), g.removeEventListener("keydown", O);
    };
  }, [T]), /* @__PURE__ */ i.createElement("div", { className: "panel-select" + (T ? " expanded" : ""), ref: Z }, /* @__PURE__ */ i.createElement("button", { className: "panel-select-trigger", ref: V, type: "button", "aria-expanded": T, "aria-label": s, onClick: () => j((x) => !x) }, /* @__PURE__ */ i.createElement("span", null, /* @__PURE__ */ i.createElement("small", null, s), ((L = y.find((x) => x.value === d)) == null ? void 0 : L.label) || "Выбрать"), /* @__PURE__ */ i.createElement(qe, { name: "expand_more" })), /* @__PURE__ */ i.createElement("div", { className: "panel-select-options", inert: !T }, /* @__PURE__ */ i.createElement("div", null, y.map((x) => /* @__PURE__ */ i.createElement("button", { type: "button", key: x.value ?? "none", "aria-pressed": d === x.value, onClick: () => {
    var O;
    r(x.value), j(!1), (O = V.current) == null || O.focus();
  } }, x.label, d === x.value && /* @__PURE__ */ i.createElement(qe, { name: "check" }))))));
}
const D5 = {
  reply: "reply",
  edit: "edit",
  profile: "person",
  settings: "settings",
  copy: "content_copy",
  pin: "push_pin",
  select: "check_circle",
  delete: "delete",
  tab: "open_in_new",
  eye: "visibility",
  archive: "archive",
  folder: "folder",
  unread: "mark_chat_unread",
  bell: "notifications",
  bellOff: "notifications_off",
  forward: "forward",
  link: "link",
  chevron: "expand_more",
  chats: "chat_bubble",
  groups: "groups",
  channel: "campaign",
  video: "videocam",
  block: "block"
}, zi = ["👍", "🌚", "🔥", "😢", "🏆", "😡", "❤️", "👏", "😂", "🤔", "🎉", "👎"];
function Fu({ name: s }) {
  return /* @__PURE__ */ i.createElement(qe, { name: D5[s] });
}
function w1({ menu: s, close: d }) {
  const [y, r] = _.useState(null), [T, j] = _.useState(!1), Z = _.useRef(null), V = _.useRef(d);
  if (V.current = d, _.useLayoutEffect(() => {
    if (s) {
      r(s), j(!1);
      return;
    }
    const x = setTimeout(() => r(null), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 160);
    return () => clearTimeout(x);
  }, [s]), _.useLayoutEffect(() => {
    const x = Z.current;
    if (!x || !y || !s) return;
    const O = () => {
      const { x: z, y: D, above: K, align: re, trigger: X } = y, J = X == null ? void 0 : X.getBoundingClientRect(), $ = J ? re === "end" ? J.right - x.offsetWidth : J.left : z, ve = J ? K ? J.top - x.offsetHeight - 7 : J.bottom + 7 : D;
      x.style.left = Math.max(8, Math.min($, innerWidth - x.offsetWidth - 8)) + "px", x.style.top = Math.max(8, Math.min(ve, innerHeight - x.offsetHeight - 8)) + "px";
    };
    O();
    const g = new ResizeObserver(O);
    return g.observe(x), window.addEventListener("resize", O), () => {
      g.disconnect(), window.removeEventListener("resize", O);
    };
  }, [y, s]), _.useEffect(() => {
    var O, g;
    if (!s) return;
    (g = (O = Z.current) == null ? void 0 : O.querySelector(".context-card button")) == null || g.focus({ preventScroll: !0 });
    function x(z) {
      var D, K, re;
      z.key === "Escape" ? (V.current(), (D = s.trigger) == null || D.focus({ preventScroll: !0 })) : z.type === "pointerdown" && !((K = Z.current) != null && K.contains(z.target)) && !((re = s.trigger) != null && re.contains(z.target)) && V.current();
    }
    return window.addEventListener("pointerdown", x), window.addEventListener("keydown", x), () => {
      window.removeEventListener("pointerdown", x), window.removeEventListener("keydown", x);
    };
  }, [s]), !y) return null;
  const L = y.reactionChoices ?? zi;
  return Sg.createPortal(/* @__PURE__ */ i.createElement("div", { ref: Z, className: "context-popover" + (y.align === "end" ? " align-end" : "") + (y.above ? " anchored-above" : "") + (y.messageKey ? " message-popover" : "") + (s ? "" : " closing"), inert: !s, "aria-hidden": !s || void 0 }, y.react && /* @__PURE__ */ i.createElement("div", { className: "context-reactions", role: "group", "aria-label": "Реакции" }, L.slice(0, 7).map((x) => /* @__PURE__ */ i.createElement("button", { type: "button", key: x, "aria-label": "Реакция " + x, onClick: () => {
    d(), y.react(x);
  } }, x)), L.length > 7 && /* @__PURE__ */ i.createElement("button", { type: "button", className: "reaction-expand", "aria-expanded": T, "aria-label": T ? "Свернуть реакции" : "Ещё реакции", onClick: () => j((x) => !x) }, /* @__PURE__ */ i.createElement(Fu, { name: "chevron" })), /* @__PURE__ */ i.createElement("div", { className: "extra-reactions" + (T ? " expanded" : ""), inert: !T }, /* @__PURE__ */ i.createElement("div", null, L.slice(7).map((x) => /* @__PURE__ */ i.createElement("button", { type: "button", key: x, "aria-label": "Реакция " + x, onClick: () => {
    d(), y.react(x);
  } }, x))))), /* @__PURE__ */ i.createElement("div", { className: "context-card", role: "group", "aria-label": y.label ?? "Действия" }, y.identity && /* @__PURE__ */ i.createElement("button", { className: "context-identity", type: "button", onClick: () => {
    d(), y.identity.open();
  } }, y.identity.avatar ? /* @__PURE__ */ i.createElement("img", { src: Ct(y.identity.avatar), alt: "" }) : /* @__PURE__ */ i.createElement(Fu, { name: "profile" }), /* @__PURE__ */ i.createElement("span", null, y.identity.name)), y.actions.map(([x, O, g, z]) => /* @__PURE__ */ i.createElement("button", { key: O, type: "button", "aria-current": z || void 0, className: x === "delete" ? "danger" : void 0, onClick: () => {
    var D, K;
    d(), g(), (D = Z.current) != null && D.contains(document.activeElement) && ((K = y.trigger) == null || K.focus({ preventScroll: !0 }));
  } }, /* @__PURE__ */ i.createElement(Fu, { name: x }), /* @__PURE__ */ i.createElement("span", null, O), z && /* @__PURE__ */ i.createElement("span", { className: "context-current" }, /* @__PURE__ */ i.createElement(Fu, { name: "select" })))))), document.body);
}
const $u = {
  hide: { action: "Скрыть чат", confirm: "Скрыть", done: "Чат скрыт" },
  message: { action: "Удалить сообщение", confirm: "Удалить" },
  chat: { action: "Удалить чат", confirm: "Удалить", done: "Чат удалён" },
  group: { action: "Покинуть группу", confirm: "Покинуть", done: "Вы покинули группу" },
  "owned-channel": { action: "Удалить канал", confirm: "Удалить", done: "Канал удалён" },
  channel: { action: "Покинуть канал", confirm: "Покинуть", done: "Вы покинули канал" }
};
function T1({ name: s, kind: d, onClose: y, onConfirm: r, allowBoth: T = d === "chat", count: j = 1 }) {
  const Z = _.useRef(null), V = _.useRef(null), L = _.useRef(!1), x = _.useRef(null), [O, g] = _.useState(!1), [z, D] = _.useState(!1), K = $u[d];
  _.useLayoutEffect(() => {
    const X = Z.current;
    return X.showModal(), V.current.focus(), () => {
      clearTimeout(x.current), X.close();
    };
  }, []);
  function re(X) {
    if (L.current) return;
    L.current = !0;
    const J = () => {
      Z.current.close(), X ? r(z) : y();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      J();
      return;
    }
    g(!0), x.current = setTimeout(J, 160);
  }
  return /* @__PURE__ */ i.createElement(
    "dialog",
    {
      ref: Z,
      className: "delete-dialog" + (O ? " is-closing" : ""),
      "aria-labelledby": "delete-title",
      "aria-describedby": "delete-description",
      onCancel: (X) => {
        X.preventDefault(), re(!1);
      },
      onClick: (X) => {
        X.target === X.currentTarget && re(!1);
      }
    },
    /* @__PURE__ */ i.createElement("div", { className: "delete-dialog-content" }, /* @__PURE__ */ i.createElement("h2", { id: "delete-title" }, d === "message" && j > 1 ? "Удалить выбранные сообщения" : K.action, "?"), /* @__PURE__ */ i.createElement("p", { id: "delete-description" }, d === "chat" ? /* @__PURE__ */ i.createElement(i.Fragment, null, "Переписка с «", s, "» будет удалена ", z ? "у вас и у собеседника" : "только у вас", ". Восстановить её нельзя.") : d === "owned-channel" ? /* @__PURE__ */ i.createElement(i.Fragment, null, "«", s, "» и все публикации будут удалены у подписчиков.") : d === "hide" ? /* @__PURE__ */ i.createElement(i.Fragment, null, "«", s, "» исчезнет из вашего списка. Сообщения сохранятся у участников.") : d === "message" ? j > 1 ? "Выбранные сообщения будут удалены у всех участников. Восстановить их нельзя." : "Сообщение будет удалено у всех участников. Восстановить его нельзя." : /* @__PURE__ */ i.createElement(i.Fragment, null, "«", s, "» исчезнет из списка чатов, и уведомления оттуда больше не будут приходить.")), T && /* @__PURE__ */ i.createElement("button", { type: "button", className: "delete-for-both", role: "checkbox", "aria-checked": z, onClick: () => D((X) => !X), disabled: O }, /* @__PURE__ */ i.createElement("span", { className: "delete-checkbox", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement(qe, { name: "check" })), /* @__PURE__ */ i.createElement("span", null, "Удалить у обоих", /* @__PURE__ */ i.createElement("small", null, d === "message" ? j > 1 ? "Удалить выбранные сообщения также у собеседника." : "Удалить сообщение также у собеседника." : "Удалить историю переписки также у собеседника."))), /* @__PURE__ */ i.createElement("div", { className: "delete-dialog-actions" }, /* @__PURE__ */ i.createElement("button", { type: "button", ref: V, onClick: () => re(!1) }, "Отмена"), /* @__PURE__ */ i.createElement("button", { type: "button", className: "danger", onClick: () => re(!0) }, d === "chat" ? z ? "Удалить у обоих" : "Удалить у себя" : K.confirm)))
  );
}
const x5 = { tick: "check", check: "checkAll", clip: "paperclip", delete: "trash", close: "close", copy: "content_copy", forward: "forward", bell: "notifications" };
function dn({ name: s }) {
  return /* @__PURE__ */ i.createElement(Hl, { name: x5[s] });
}
const om = new Intl.DateTimeFormat("ru", { hour: "2-digit", minute: "2-digit" }), Mc = new Intl.DateTimeFormat("ru", { year: "numeric", month: "numeric", day: "numeric" }), R5 = new Intl.DateTimeFormat("ru", { day: "numeric", month: "long" }), sm = [];
function U5({ chat: s, channel: d, showSender: y, search: r, forwardTargets: T, notificationsEnabled: j, onToggleNotifications: Z, notify: V, header: L, onUpdated: x, canWrite: O, revision: g, focus: z, pickRequest: D, onOpenAuthor: K, enterToSend: re }) {
  const [X, J] = _.useState({}), [$, ve] = _.useState({}), [ae, Oe] = _.useState(null), [Q, k] = _.useState({}), [ge, it] = _.useState(!1), Fe = _.useRef(null), Ve = 50, [he, rt] = _.useState({}), Et = i.useId(), [Ze, M] = _.useState({}), G = _.useRef(/* @__PURE__ */ new Set()), R = _.useRef(null), [Ee, ze] = _.useState(!1), [wt, vt] = _.useState(null), [me, h] = _.useState(null), B = _.useRef(null);
  _.useEffect(() => () => clearTimeout(B.current), []);
  const [I, te] = _.useState(null), [Ce, Ue] = _.useState([]), [Ae, ne] = _.useState(null), [fe, Mt] = _.useState(null), [il, hl] = _.useState(!1), at = _.useRef(null), De = _.useRef(null), ke = _.useRef(null), Tt = _.useRef(null);
  function Ht() {
    const S = at.current;
    hl(!!(S && S.scrollHeight - S.clientHeight - S.scrollTop > 40));
  }
  function At(S = !1) {
    const Y = at.current;
    Y == null || Y.scrollTo({ top: Y.scrollHeight, behavior: S && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto" });
  }
  async function el(S) {
    var F;
    let Y = !1;
    try {
      (F = navigator.clipboard) != null && F.writeText && (await navigator.clipboard.writeText(S), Y = !0);
    } catch {
    }
    if (!Y) {
      const ue = document.activeElement, ce = document.createElement("textarea");
      ce.className = "clipboard-fallback", ce.value = S, ce.readOnly = !0, document.body.append(ce), ce.focus({ preventScroll: !0 }), ce.select();
      try {
        Y = document.execCommand("copy");
      } catch {
      } finally {
        ce.remove(), ue instanceof HTMLElement && !ue.closest("[inert]") && ue.focus({ preventScroll: !0 });
      }
    }
    return Y || V("Не удалось скопировать текст. Проверьте доступ к буферу обмена."), Y;
  }
  function Bl(S, Y, F) {
    const ue = Xt(S);
    if (G.current.has(ue)) return;
    const ce = Pe(S).find((et) => et.own), pe = (ce == null ? void 0 : ce.emoji) === Y ? null : Y;
    G.current.add(ue), Te("/api/messages/" + S.id + "/reaction", { method: "PUT", json: { emoji: pe } }).then((et) => {
      var Ne;
      if (F != null && F.isConnected && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const Ge = (Ne = F.querySelector("footer")) == null ? void 0 : Ne.getBoundingClientRect();
        Ge && (R.current = { bubble: F, bounds: Ge });
      }
      M((Ge) => ({ ...Ge, [ue]: et.reactions }));
    }).catch((et) => V(et.message)).finally(() => G.current.delete(ue));
  }
  function Pe(S) {
    return Ze[Xt(S)] ?? S.reactions ?? [];
  }
  _.useLayoutEffect(() => {
    const S = R.current;
    if (R.current = null, !S) return;
    const Y = S.bubble.querySelector("footer");
    if (!(Y != null && Y.isConnected)) return;
    const F = Y.getBoundingClientRect(), ue = S.bounds.left - F.left, ce = S.bounds.top - F.top;
    (ue || ce) && Y.animate(
      [{ transform: "translate(" + ue + "px," + ce + "px)" }, { transform: "translate(0,0)" }],
      { duration: 210, easing: "cubic-bezier(.23,1,.32,1)" }
    );
  }, [Ze]);
  const kt = _.useRef(null), ul = _.useRef(!1), vl = _.useRef(null), tl = _.useRef(null), Qt = _.useRef(!1), [Nl, Ll] = _.useState(null), [le, , , , , _e] = s, A = (_e == null ? void 0 : _e.history_after_id) ?? 0, [Se, He] = _.useState(null), [gl, Wl] = _.useState(null), [St, Ea] = _.useState(null), kl = _.useRef(null), pa = _.useRef(null);
  _.useEffect(() => () => clearTimeout(pa.current), []), _.useEffect(() => {
    (D == null ? void 0 : D.chatId) === le && Wl(le);
  }, [D, le]), _.useEffect(() => {
    if (!z || z.chatId !== le) return;
    const S = new AbortController();
    return Te("/api/messages?" + new URLSearchParams({ chat_id: le, around: z.id }), { signal: S.signal }).then((Y) => {
      J((F) => {
        const ue = new Map((F[le] ?? []).map((ce) => [ce.id, ce]));
        for (const ce of Y)
          ce.is_deleted ? ue.delete(ce.id) : ue.set(ce.id, Ju(ce, y));
        return { ...F, [le]: [...ue.values()].sort((ce, pe) => ce.id - pe.id) };
      });
    }).catch((Y) => {
      S.signal.aborted || V(Y.message);
    }), () => S.abort();
  }, [z, le, y]), _.useEffect(() => {
    if (!_e) return;
    const S = new AbortController();
    return (async () => {
      try {
        const F = await Te("/api/messages?chat_id=" + encodeURIComponent(le), { signal: S.signal });
        if (!S.signal.aborted && !B.current) {
          Oe((pe) => (pe == null ? void 0 : pe.name) === le ? null : pe), M((pe) => Object.fromEntries(Object.entries(pe).filter(([et]) => !F.some((Ne) => et === JSON.stringify([le, Ne.id]) && !G.current.has(et))))), ve((pe) => pe[le] ? pe : { ...pe, [le]: !0 }), k((pe) => le in pe ? pe : { ...pe, [le]: F.length >= Ve });
          const ue = F.filter((pe) => !pe.is_deleted).map((pe) => Ju(pe, y)), ce = at.current;
          ce && ce.scrollHeight - ce.clientHeight - ce.scrollTop < 40 && (Tt.current = le), J((pe) => ({ ...pe, [le]: [
            ...(pe[le] ?? []).filter((et) => {
              var Ne;
              return et.id > A && et.id < (((Ne = F[0]) == null ? void 0 : Ne.id) ?? 0);
            }),
            ...ue
          ] }));
        }
      } catch (F) {
        S.signal.aborted || Oe({ name: le, message: F.message });
      }
    })(), () => S.abort();
  }, [le, y, g, A]);
  const Xt = (S) => JSON.stringify([le, S.id]), { text: wl = "", file: yl = null, error: hn = "" } = he[le] ?? {}, ll = A ? (X[le] ?? sm).filter((S) => S.id > A) : X[le] ?? sm;
  async function jl() {
    if (!(ge || !ll.length)) {
      it(!0);
      try {
        const S = await Te("/api/messages?chat_id=" + encodeURIComponent(le) + "&first_id=" + ll[0].id), Y = at.current;
        (Y == null ? void 0 : Y.dataset.historyChat) === le && (Fe.current = { name: le, height: Y.scrollHeight, top: Y.scrollTop }), J((F) => ({ ...F, [le]: [
          ...S.filter((ue) => !ue.is_deleted).map((ue) => Ju(ue, y)),
          ...F[le] ?? []
        ] })), k((F) => ({ ...F, [le]: S.length >= Ve }));
      } catch (S) {
        V(S.message);
      } finally {
        it(!1);
      }
    }
  }
  const W = ll.filter((S) => Ce.includes(Xt(S))), ft = W.length > 0 || gl === le, qt = _.useRef(0);
  _.useLayoutEffect(() => {
    ft && (qt.current = W.length);
  }, [ft, W.length]);
  function ia(S) {
    Ue((Y) => Y.includes(S) ? Y.filter((F) => F !== S) : [...Y, S]);
  }
  function Il() {
    Wl(null);
    const S = new Set(W.map(Xt));
    Ue((Y) => Y.filter((F) => !S.has(F)));
  }
  async function kn() {
    const S = W.map((Y) => {
      var ce;
      const F = Y.own ? It.name || It.login : Y.author ?? (_e == null ? void 0 : _e.name), ue = Y.text || ((ce = Y.file) == null ? void 0 : ce.name) || "Голосовое сообщение";
      return "[" + om.format(Y.at) + "] " + F + ": " + ue;
    }).join(`
`);
    await el(S) && Il();
  }
  const Tl = r.trim().toLocaleLowerCase("ru"), al = Tl ? ll.filter((S) => {
    var Y;
    return [S.text, (Y = S.file) == null ? void 0 : Y.name].some((F) => F == null ? void 0 : F.toLocaleLowerCase("ru").includes(Tl));
  }) : ll;
  function Ot(S) {
    rt((Y) => ({ ...Y, [le]: { ...Y[le], error: "", ...S } }));
  }
  async function nl(S, Y = s) {
    var Ne;
    const [F, , , , , ue] = Y, ce = await pg(F, S), pe = await Te("/api/messages?chat_id=" + encodeURIComponent(F)).catch(() => null), et = pe == null ? void 0 : pe.filter((Ge) => !Ge.is_deleted).map((Ge) => Ju(Ge, !ue.target_user_id && ue.chat_type !== "channel"));
    F === le && (Tt.current = F, matchMedia("(prefers-reduced-motion: reduce)").matches || Ll(((Ne = ce.ids) == null ? void 0 : Ne.at(-1)) ?? null)), et && J((Ge) => ({ ...Ge, [F]: [
      ...(Ge[F] ?? []).filter((Ke) => {
        var $e;
        return Ke.id < ((($e = et[0]) == null ? void 0 : $e.id) ?? 0);
      }),
      ...et
    ] })), x();
  }
  async function ua() {
    var S;
    if (!(!O || Ee || Qt.current || !wl.trim() && !yl)) {
      Qt.current = !0, Ot({ error: "" });
      try {
        (Se == null ? void 0 : Se.name) === le ? (await Te("/api/messages/" + Se.message.id, { method: "PUT", json: { content: wl.trim() } }), J((Y) => ({ ...Y, [le]: ll.map((F) => F.id === Se.message.id ? { ...F, text: wl.trim(), edited: !0 } : F) })), He(null), x()) : await nl({ text: wl.trim(), file: yl, replyId: (fe == null ? void 0 : fe.name) === le ? fe.message.id : null }), Mt(null), Ot({ text: "", file: null }), (S = vl.current) == null || S.focus();
      } catch (Y) {
        Ot({ error: Y.message });
      } finally {
        Qt.current = !1;
      }
    }
  }
  _.useLayoutEffect(() => {
    const S = vl.current;
    if (!S || ft) {
      tl.current = null;
      return;
    }
    const Y = () => {
      var Ne;
      const ue = tl.current, ce = S.getBoundingClientRect().height;
      (Ne = ue == null ? void 0 : ue.animation) == null || Ne.cancel(), S.style.height = "0px";
      const pe = Math.min(S.scrollHeight, 132);
      S.style.height = pe + "px";
      const et = (ue == null ? void 0 : ue.input) === S && ue.name === le && Math.abs(ce - pe) > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches ? S.animate([{ height: ce + "px" }, { height: pe + "px" }], { duration: 145, easing: "ease-out" }) : null;
      tl.current = { input: S, animation: et, name: le };
    };
    Y();
    const F = new ResizeObserver((ue) => {
      var pe;
      const ce = ue[0].contentRect.width;
      ce !== ((pe = tl.current) == null ? void 0 : pe.width) && (Y(), tl.current.width = ce);
    });
    return tl.current.width = S.parentElement.getBoundingClientRect().width, F.observe(S.parentElement), () => F.disconnect();
  }, [wl, le, ft]), _.useLayoutEffect(() => {
    const S = at.current, Y = De.current, F = ke.current;
    function ue() {
      const pe = S.scrollHeight - S.clientHeight - S.scrollTop < 12;
      S.style.setProperty("--history-top", Y.offsetHeight + Y.offsetTop + "px"), S.style.setProperty("--history-bottom", S.parentElement.clientHeight - F.offsetTop + "px"), pe && At(), Ht();
    }
    ue(), At(), Ht();
    const ce = new ResizeObserver(ue);
    return ce.observe(S), ce.observe(Y), ce.observe(F), () => ce.disconnect();
  }, [le]), _.useLayoutEffect(() => {
    var Y;
    if ((z == null ? void 0 : z.chatId) === le && kl.current !== z) {
      const F = (Y = at.current) == null ? void 0 : Y.querySelector('[data-message-id="' + z.id + '"]');
      F && (kl.current = z, Tt.current = null, F.scrollIntoView({ block: "center", behavior: "instant" }), clearTimeout(pa.current), Ea(z.id), pa.current = setTimeout(() => Ea(null), 2e3));
    }
    const S = Fe.current;
    if ((S == null ? void 0 : S.name) === le) {
      const F = at.current;
      F.scrollTop = S.top + F.scrollHeight - S.height, Fe.current = null;
    }
    Tt.current === le && (Tt.current = null, At()), Ht();
  }, [le, X, r, z]), _.useEffect(() => () => {
    var S;
    ((S = kt.current) == null ? void 0 : S.state) === "recording" && kt.current.stop();
  }, []);
  async function Sa() {
    var Y;
    if (((Y = kt.current) == null ? void 0 : Y.state) === "recording") {
      kt.current.stop();
      return;
    }
    if (ul.current) return;
    ul.current = !0;
    let S;
    try {
      S = await navigator.mediaDevices.getUserMedia({ audio: !0 });
      const F = new MediaRecorder(S), ue = [];
      F.ondataavailable = (ce) => {
        ce.data.size && ue.push(ce.data);
      }, F.onstop = () => {
        S.getTracks().forEach((ce) => ce.stop()), kt.current = null, ze(!1), ue.length && nl({ audio: new Blob(ue, { type: F.mimeType }) }).catch((ce) => Ot({ error: ce.message }));
      }, F.start(), kt.current = F, ze(!0);
    } catch {
      S == null || S.getTracks().forEach((F) => F.stop()), Ot({ error: "Нет доступа к микрофону. Разрешите его использование в браузере." });
    } finally {
      ul.current = !1;
    }
  }
  function vn(S, Y) {
    var $e, Be;
    S.preventDefault();
    const F = Y.text ?? (($e = Y.file) == null ? void 0 : $e.name) ?? "Голосовое сообщение", ue = Xt(Y), ce = S.currentTarget, pe = ce.getBoundingClientRect(), et = { x: S.clientX || pe.left, y: S.clientY || pe.bottom }, Ne = new URL(Ct("/chat"), location.origin);
    Ne.search = new URLSearchParams({ chat: le, message: Y.id });
    const Ge = [
      ...O ? [["reply", "Ответить", () => {
        var We;
        Mt({ name: le, message: Y }), (We = vl.current) == null || We.focus();
      }]] : [],
      ...O && Y.own && !Y.file && !Y.audio ? [["edit", "Изменить", () => {
        var We;
        He({ name: le, message: Y }), Ot({ text: Y.text }), (We = vl.current) == null || We.focus();
      }]] : [],
      ..._e != null && _e.protected ? [] : [["copy", "Копировать текст", () => el(F)]],
      ..._e != null && _e.protected ? [] : [["link", "Копировать ссылку", () => el(Ne.href)]],
      ...d ? [] : [["pin", (Ae == null ? void 0 : Ae.message.id) === Y.id && Ae.name === le ? "Открепить" : "Закрепить", () => ne((We) => (We == null ? void 0 : We.name) === le && We.message.id === Y.id ? null : { name: le, message: Y })]],
      ...!(_e != null && _e.protected) && T.length ? [["forward", "Переслать", () => te({ ...et, actions: T.map((We) => ["forward", We[5].name, () => nl({ text: Y.text, file: Y.file, audio: Y.audio, forwarded: _e.name, forwardFrom: Y.id }, We).catch((f) => V(f.message))]) })]] : [],
      ["select", Ce.includes(ue) ? "Снять выделение" : "Выбрать", () => ia(ue)],
      ...!me && (Y.own || _e != null && _e.target_user_id || (Be = _e == null ? void 0 : _e.permissions) != null && Be.includes("moderate")) ? [["delete", "Удалить", () => vt([{ key: ue, message: Y, bubble: ce }])]] : []
    ], Ke = (_e == null ? void 0 : _e.reactions_mode) === "none" ? [] : (_e == null ? void 0 : _e.reactions_mode) === "selected" ? _e.allowed_reactions : zi;
    te({ ...et, actions: Ge, messageKey: ue, reactionChoices: Ke, react: Ke != null && Ke.length ? (We) => Bl(Y, We, ce) : null });
  }
  function La(S) {
    const Y = S.currentTarget.getBoundingClientRect();
    te({ x: Y.left, y: Y.top, actions: T.map((F) => ["forward", F[5].name, async () => {
      try {
        for (const ue of W) await nl({ text: ue.text, file: ue.file, audio: ue.audio, forwarded: _e.name, forwardFrom: ue.id }, F);
        Il();
      } catch (ue) {
        V(ue.message);
      }
    }]) });
  }
  function Pl() {
    const S = new Map([...at.current.querySelectorAll("[data-message-id]")].map((Y) => [Y.dataset.messageId, Y]));
    vt(W.map((Y) => ({ key: Xt(Y), message: Y, bubble: S.get(String(Y.id)) })));
  }
  async function gn() {
    const S = wt;
    vt(null), B.current = !0;
    const Y = await Promise.allSettled(S.map(({ message: Ne }) => Te("/api/messages/" + Ne.id, { method: "DELETE" }))), F = S.filter((Ne, Ge) => Y[Ge].status === "fulfilled");
    if (F.length !== S.length && V("Не удалось удалить часть сообщений"), !F.length) {
      B.current = null;
      return;
    }
    const ue = new Set(F.map(({ message: Ne }) => Ne.id)), ce = new Set(F.map(({ key: Ne }) => Ne));
    vt(null);
    const pe = () => {
      J((Ne) => ({ ...Ne, [le]: (Ne[le] ?? ll).filter((Ge) => !ue.has(Ge.id)) })), ne((Ne) => (Ne == null ? void 0 : Ne.name) === le && ue.has(Ne.message.id) ? null : Ne), Mt((Ne) => (Ne == null ? void 0 : Ne.name) === le && ue.has(Ne.message.id) ? null : Ne), Ue((Ne) => Ne.filter((Ge) => !ce.has(Ge))), h(null), B.current = null, x();
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pe();
      return;
    }
    const et = /* @__PURE__ */ new Map();
    for (const { key: Ne, message: Ge, bubble: Ke } of F) {
      const $e = Ke == null ? void 0 : Ke.closest(".message-row"), Be = $e == null ? void 0 : $e.closest(".message-slot");
      if (!(Be != null && Be.isConnected)) continue;
      const We = $e.getBoundingClientRect(), f = $e.querySelector(".sender-avatar"), U = [Ke, f].filter(Boolean).flatMap((ie, ee) => {
        const se = ie.getBoundingClientRect();
        return Array.from({ length: ee === 0 ? 100 : 32 }, () => ({
          "--x": se.left - We.left + Math.random() * se.width + "px",
          "--y": se.top - We.top + Math.random() * se.height + "px",
          "--dx": 14 + Math.random() * 53 + "px",
          "--dy": Math.random() * 65 - 45 + "px",
          "--delay": Math.random() * 100 + "ms",
          "--size": 1.5 + Math.random() * 3.4 + "px",
          "--particle-color": ee === 0 ? Ge.own ? "#789f86" : "#78817b" : "#a9b6ad"
        }));
      });
      et.set(Ne, { particles: U, height: Be.getBoundingClientRect().height });
    }
    if (!et.size) {
      pe();
      return;
    }
    h(et), B.current = setTimeout(pe, 480);
  }
  const ol = Ee ? "stop" : wl.trim() || yl ? "send" : "mic";
  return /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { ref: De, className: "conversation-dock conversation-dock-top" }, L, !d && (Ae == null ? void 0 : Ae.name) === le && /* @__PURE__ */ i.createElement("button", { className: "chat-note", onClick: () => ne(null) }, "⌖ ", Ae.message.text ?? "Вложение", " · ×")), /* @__PURE__ */ i.createElement("div", { key: le, ref: at, "data-history-chat": le, className: "message-history", onScroll: Ht, "aria-label": "История сообщений" }, !Tl && Q[le] && /* @__PURE__ */ i.createElement("button", { className: "chat-note history-load-more", type: "button", disabled: ge, onClick: jl }, ge ? "Загрузка…" : "Загрузить предыдущие сообщения"), !al.length && (ae == null ? void 0 : ae.name) === le && /* @__PURE__ */ i.createElement(Pt, { className: "history-error", message: ae.message === Ti ? ae.message : "Не удалось загрузить сообщения. " + ae.message }), _e && !$[le] && !al.length && (ae == null ? void 0 : ae.name) !== le && /* @__PURE__ */ i.createElement(Ba, { label: "Загрузка сообщений…", className: "history-loader" }), $[le] && !al.length && (ae == null ? void 0 : ae.name) !== le && /* @__PURE__ */ i.createElement("div", { className: "message-date" }, Tl ? "Ничего не найдено" : "Нет сообщений"), al.map((S, Y) => {
    const F = Xt(S), ue = Ce.includes(F), ce = me == null ? void 0 : me.get(F), pe = Pe(S), et = !!S.text && !S.text.includes(`
`) && !S.file && !S.audio && !pe.length, Ne = /* @__PURE__ */ i.createElement("footer", null, /* @__PURE__ */ i.createElement("time", { dateTime: new Date(S.at).toISOString() }, om.format(S.at)), S.edited && /* @__PURE__ */ i.createElement("span", { className: "message-edited", title: "Сообщение изменено", "aria-label": "Сообщение изменено" }, /* @__PURE__ */ i.createElement(qe, { name: "edit" })), S.own && /* @__PURE__ */ i.createElement(dn, { name: S.read ? "check" : "tick" })), Ge = !Y || Mc.format(S.at) !== Mc.format(al[Y - 1].at), Ke = Ge && (!al[Y + 1] || Mc.format(S.at) !== Mc.format(al[Y + 1].at)), $e = /* @__PURE__ */ i.createElement("div", { className: "message-date" }, Mc.format(S.at) === Mc.format(Date.now()) ? "Сегодня" : R5.format(S.at));
    return /* @__PURE__ */ i.createElement(i.Fragment, { key: S.id }, Ge && !Ke && $e, /* @__PURE__ */ i.createElement("div", { className: "message-slot" + (ce ? " collapsing" : ""), style: ce ? { "--slot-height": ce.height + "px" } : void 0 }, Ke && $e, /* @__PURE__ */ i.createElement(
      "div",
      {
        className: "message-row" + (S.own ? " outgoing" : "") + (ue ? " selected-message" : "") + ((I == null ? void 0 : I.messageKey) === F ? " context-message" : "") + (ce ? " row-dissolving" : "") + (St === S.id ? " search-highlight" : "") + (ft ? " selection-enabled" : ""),
        onClick: ft ? (Be) => {
          Be.target.closest("button,audio,a") || ia(F);
        } : void 0
      },
      /* @__PURE__ */ i.createElement("button", { type: "button", className: "message-selection", inert: !ft, "aria-hidden": !ft || void 0, "aria-pressed": ue, "aria-label": ue ? "Снять выделение сообщения" : "Выбрать сообщение", onClick: () => ia(F) }, /* @__PURE__ */ i.createElement(dn, { name: "tick" })),
      S.sender && /* @__PURE__ */ i.createElement("button", { className: "sender-avatar sender-link", type: "button", "aria-label": "Профиль " + S.sender, onClick: () => K(S) }, /* @__PURE__ */ i.createElement(Ul, { src: S.avatar, name: S.sender })),
      /* @__PURE__ */ i.createElement(
        "article",
        {
          "data-message-id": S.id,
          className: "bubble" + (S.own ? " own" : "") + (ce ? " dissolving" : "") + (Nl === S.id ? " entering" : ""),
          onContextMenu: (Be) => vn(Be, S),
          onAnimationEnd: (Be) => {
            Be.target === Be.currentTarget && Be.animationName === "message-arrive" && Ll((We) => We === S.id ? null : We);
          }
        },
        S.forwarded && /* @__PURE__ */ i.createElement("div", { className: "forwarded-label" }, "Переслано из «", S.forwarded, "»"),
        S.quote && /* @__PURE__ */ i.createElement("blockquote", null, S.quote),
        y && !S.own && /* @__PURE__ */ i.createElement("button", { type: "button", className: "sender-name sender-link", onClick: () => K(S) }, S.sender || S.author),
        et ? /* @__PURE__ */ i.createElement("div", { className: "bubble-inline" }, /* @__PURE__ */ i.createElement("span", null, S.text), Ne) : S.text && /* @__PURE__ */ i.createElement("div", null, S.text),
        S.file && /* @__PURE__ */ i.createElement("div", { className: "bubble-file" }, /* @__PURE__ */ i.createElement(dn, { name: "clip" }), S.file.url ? /* @__PURE__ */ i.createElement("a", { href: S.file.url, download: !0 }, S.file.name) : S.file.name),
        S.audio && /* @__PURE__ */ i.createElement("audio", { controls: !0, src: S.audio }),
        Array.isArray(S.keyboard) && /* @__PURE__ */ i.createElement("div", { className: "bot-actions" }, S.keyboard.map((Be, We) => Array.isArray(Be) && /* @__PURE__ */ i.createElement("div", { key: We }, Be.map((f, U) => !f || typeof f.text != "string" ? null : typeof f.url == "string" && /^https?:\/\//i.test(f.url) ? /* @__PURE__ */ i.createElement("a", { key: U, href: f.url, target: "_blank", rel: "noopener noreferrer" }, f.text) : f.callback_data == null ? null : /* @__PURE__ */ i.createElement("button", { key: U, type: "button", onClick: async (ie) => {
          const ee = ie.currentTarget;
          ee.disabled = !0;
          try {
            const se = await Te("/api/bot/callback", { method: "POST", json: { chat_id: Number(le), message_id: S.id, data: f.callback_data } });
            if (!se.ok) throw new Error(se.description || "Бот не выполнил действие");
          } catch (se) {
            V(se.message);
          } finally {
            ee.disabled = !1;
          }
        } }, f.text))))),
        pe.length ? /* @__PURE__ */ i.createElement("div", { className: "bubble-reaction-line" }, /* @__PURE__ */ i.createElement("div", { className: "bubble-reaction-buttons" }, pe.map((Be) => /* @__PURE__ */ i.createElement(
          "button",
          {
            type: "button",
            key: Be.emoji,
            className: "message-reaction" + (d ? " channel-reaction" : ""),
            "aria-pressed": Be.own,
            "aria-label": Be.emoji + ", всего " + Be.count,
            onClick: (We) => Bl(S, Be.emoji, We.currentTarget.closest(".bubble"))
          },
          /* @__PURE__ */ i.createElement("span", null, Be.emoji),
          !d && Be.own && Be.count === 1 ? /* @__PURE__ */ i.createElement("span", { className: "reaction-author", "aria-hidden": "true" }, "Я") : /* @__PURE__ */ i.createElement("span", { className: "reaction-count" }, Be.count)
        ))), Ne) : !et && Ne
      ),
      ce && /* @__PURE__ */ i.createElement("span", { className: "message-particles", "aria-hidden": "true" }, ce.particles.map((Be, We) => /* @__PURE__ */ i.createElement("i", { key: We, style: Be })))
    )));
  })), /* @__PURE__ */ i.createElement("div", { ref: ke, className: "conversation-dock conversation-dock-bottom" }, !ft && O && /* @__PURE__ */ i.createElement(Pt, { id: Et, className: "composer-error", message: hn }), (Se == null ? void 0 : Se.name) === le && /* @__PURE__ */ i.createElement("button", { className: "chat-note", onClick: () => {
    He(null), Ot({ text: "", file: null });
  } }, "Редактирование · ×"), (fe == null ? void 0 : fe.name) === le && /* @__PURE__ */ i.createElement("button", { className: "chat-note", onClick: () => Mt(null) }, "↩ ", fe.message.text ?? "Вложение", " · ×"), /* @__PURE__ */ i.createElement("div", { className: "composer-stack" + (ft ? " is-selecting" : "") }, /* @__PURE__ */ i.createElement("div", { className: "composer selection-bar", inert: !ft, "aria-hidden": !ft || void 0, role: "group", "aria-label": "Действия с выбранными сообщениями" }, /* @__PURE__ */ i.createElement("div", { className: "selection-actions" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action selection-delete", "aria-label": "Удалить выбранные сообщения", disabled: !W.length || !!me || W.some((S) => {
    var Y;
    return !S.own && !(_e != null && _e.target_user_id) && !((Y = _e == null ? void 0 : _e.permissions) != null && Y.includes("moderate"));
  }), onClick: Pl }, /* @__PURE__ */ i.createElement(dn, { name: "delete" })), /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action", "aria-label": "Снять выделение со всех сообщений", onClick: Il }, /* @__PURE__ */ i.createElement(dn, { name: "close" }))), /* @__PURE__ */ i.createElement("span", { className: "selection-count", role: "status" }, "Выбрано: ", ft ? W.length : qt.current), /* @__PURE__ */ i.createElement("div", { className: "selection-actions" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action", "aria-label": "Копировать выбранные сообщения", disabled: !W.length || !!(_e != null && _e.protected), onClick: kn }, /* @__PURE__ */ i.createElement(dn, { name: "copy" })), /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action", "aria-label": "Переслать выбранные сообщения", disabled: !W.length || !T.length || !!(_e != null && _e.protected), onClick: La }, /* @__PURE__ */ i.createElement(dn, { name: "forward" })))), /* @__PURE__ */ i.createElement("div", { inert: ft, "aria-hidden": ft || void 0, className: "composer standard-composer" + (d && !O ? " channel-composer channel-readonly" : "") }, il && /* @__PURE__ */ i.createElement("button", { type: "button", className: "scroll-latest", "aria-label": "К последнему сообщению", onClick: () => At(!0) }, /* @__PURE__ */ i.createElement(Hl, { name: "down" })), !O && !d ? /* @__PURE__ */ i.createElement("p", { className: "composer-restricted" }, "Отправка сообщений недоступна") : !O && d ? /* @__PURE__ */ i.createElement("button", { type: "button", className: "channel-alert", "aria-pressed": j, onClick: Z }, /* @__PURE__ */ i.createElement("span", { className: "bell-state", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement(dn, { name: "bell" }), /* @__PURE__ */ i.createElement("i", null)), /* @__PURE__ */ i.createElement("span", { className: "alert-label" }, /* @__PURE__ */ i.createElement("span", { className: "label-enable" }, "Включить уведомления"), /* @__PURE__ */ i.createElement("span", { className: "label-disable" }, "Выключить уведомления"))) : /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("label", { className: "composer-action attachment" }, /* @__PURE__ */ i.createElement(Hl, { name: "paperclip" }), /* @__PURE__ */ i.createElement("input", { type: "file", "aria-label": "Прикрепить файл", onChange: (S) => {
    const Y = S.target.files[0];
    Y && Ot({ file: Y }), S.target.value = "";
  } })), /* @__PURE__ */ i.createElement("div", { className: "compose-field" }, /* @__PURE__ */ i.createElement("span", { "aria-hidden": "true", className: "compose-placeholder" + (wl ? " faded" : "") }, Ee ? "Идёт запись…" : "Сообщение"), /* @__PURE__ */ i.createElement("textarea", { ref: vl, className: "message-input", rows: 1, "aria-label": "Сообщение", "aria-describedby": hn ? Et : void 0, value: wl, onChange: (S) => Ot({ text: S.target.value }), onKeyDown: (S) => {
    S.key === "Enter" && !S.shiftKey && !S.nativeEvent.isComposing && (re || S.ctrlKey || S.metaKey) && (S.preventDefault(), Ee || ua());
  } })), yl && /* @__PURE__ */ i.createElement("button", { type: "button", className: "attached-file", title: "Убрать файл", onClick: () => Ot({ file: null }) }, yl.name, " ×"), /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action", "aria-label": "Добавить смайлик", onClick: () => {
    var S;
    Ot({ text: wl + " 🙂" }), (S = vl.current) == null || S.focus();
  } }, /* @__PURE__ */ i.createElement(Hl, { name: "smile" })), /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action primary-action " + ol, "aria-label": { mic: "Записать голосовое", stop: "Завершить запись", send: "Отправить" }[ol], onClick: ol === "send" ? ua : Sa }, /* @__PURE__ */ i.createElement("span", { key: ol }, /* @__PURE__ */ i.createElement(Hl, { name: ol }))))))), wt && /* @__PURE__ */ i.createElement(T1, { kind: "message", count: wt.length, allowBoth: !1, onClose: () => vt(null), onConfirm: gn }), /* @__PURE__ */ i.createElement(w1, { menu: I, close: () => te(null) }));
}
function H5({ onStatus: s, onChange: d }) {
  let y, r = !1, T, j, Z, V, L, x = 700, O = !1, g = !1, z = { epoch: "", seq: -1 };
  function D(ae) {
    g !== ae && (g = ae, s(ae));
  }
  function K(ae) {
    if (typeof ae.epoch != "string" || !Number.isInteger(ae.seq)) return !1;
    const Oe = !g || z.epoch !== ae.epoch || z.seq !== ae.seq;
    return z = { epoch: ae.epoch, seq: ae.seq }, x = 700, D(!0), Oe && d(), !0;
  }
  function re() {
    if (O || y || !navigator.onLine) return;
    let ae;
    try {
      const Oe = new URL(Ct("/api/chats/socket"), location.href);
      Oe.protocol = location.protocol === "https:" ? "wss:" : "ws:", ae = new WebSocket(Oe);
    } catch {
      X();
      return;
    }
    y = ae, T = setTimeout(() => ae.close(), 1800), ae.onmessage = (Oe) => {
      let Q;
      try {
        Q = JSON.parse(Oe.data);
      } catch {
        return;
      }
      y !== ae || O || !K(Q) || (r = !0, clearTimeout(T), T = setTimeout(() => ae.close(), 45e3), V == null || V.abort());
    }, ae.onclose = () => {
      y === ae && (y = null, clearTimeout(T), r && D(!1), r = !1, X());
    };
  }
  async function X() {
    if (O || r || V || L || !navigator.onLine) return;
    const ae = new AbortController();
    V = ae;
    try {
      for (; !O && !r && navigator.onLine; ) {
        const Oe = setTimeout(() => ae.abort("timeout"), 28e3);
        try {
          const Q = await Te("/api/chats/realtime?" + new URLSearchParams(z), { signal: ae.signal, cache: "no-store" });
          if (O || r) break;
          if (!K(Q)) throw new Error("Неверный ответ сервера");
        } finally {
          clearTimeout(Oe);
        }
      }
    } catch {
      if (O || r || !navigator.onLine) return;
      D(!1), L = setTimeout(() => {
        L = null, re(), X();
      }, x + Math.random() * 200), x = Math.min(x * 2, 1e4);
    } finally {
      V = null, !O && !r && !L && navigator.onLine && X();
    }
  }
  function J() {
    clearTimeout(L), L = null, x = 700, re(), X();
  }
  function $() {
    D(!1), y == null || y.close(), V == null || V.abort();
  }
  const ve = () => D(!1);
  return window.addEventListener("tornado:connection-lost", ve), window.addEventListener("online", J), window.addEventListener("offline", $), re(), Z = setTimeout(X, 650), j = setInterval(() => {
    r || re();
  }, 6e4), () => {
    O = !0, clearTimeout(Z), clearTimeout(L), clearTimeout(T), clearInterval(j), y == null || y.close(), V == null || V.abort(), window.removeEventListener("tornado:connection-lost", ve), window.removeEventListener("online", J), window.removeEventListener("offline", $);
  };
}
function q5({ page: s, setPage: d, onDone: y }) {
  const [r, T] = _.useState(""), [j, Z] = _.useState(null), [V, L] = _.useState([]), [x, O] = _.useState(""), [g, z] = _.useState(""), [D, K] = _.useState(null), [re, X] = _.useState(""), [J, $] = _.useState(""), [ve, ae] = _.useState(null), [Oe, Q] = _.useState(!1), k = _.useRef(null), ge = s.view === "new-chat", it = s.view === "invite", Fe = s.view === "new-channel", Ve = Fe || s.step === 2;
  _.useEffect(() => {
    if (Ve) return;
    const M = new AbortController();
    $(""), Z(null);
    const G = setTimeout(() => {
      Te("/api/users/search?q=" + encodeURIComponent(r.trim()), { signal: M.signal }).then((R) => {
        M.signal.aborted || Z(R);
      }).catch((R) => {
        M.signal.aborted || $(R.message);
      });
    }, r ? 180 : 0);
    return () => {
      clearTimeout(G), M.abort();
    };
  }, [r, Ve]);
  async function he(M) {
    if (M.preventDefault(), !Oe) {
      if (!ge && !it && !Ve) {
        d({ ...s, step: 2 });
        return;
      }
      if (X(""), ae(null), Ve && !x.trim()) {
        ae({ field: "name", message: "Введите название." });
        return;
      }
      if (!((ge || it) && !V.length)) {
        Q(!0);
        try {
          if (ge) {
            const G = await Te("/api/chats/get_or_create", { method: "POST", json: { target_user_id: V[0].id } });
            await y(G.chat_id);
          } else if (it)
            await Te("/api/chats/invite", { method: "POST", json: { chat_id: Number(s.id), participants: V.map((G) => G.id) } }), await y(s.id, !0);
          else {
            if (!k.current) {
              const G = await Te("/api/chats/group", { method: "POST", json: { name: x.trim(), description: g.trim(), chat_type: Fe ? "channel" : "group", participants: V.map((R) => R.id) } });
              k.current = G.chat_id;
            }
            D && await N1(Te, k.current, D), await y(k.current, !0);
          }
        } catch (G) {
          G.field ? ae(G) : X(G.message);
        } finally {
          Q(!1);
        }
      }
    }
  }
  const rt = ge ? "Написать сообщение" : it ? "Добавить" : Ve ? "Создать" : "Далее", Et = (M) => (ve == null ? void 0 : ve.field) === M ? ve.message : "";
  function Ze(M, G, R) {
    ae((Ee) => (Ee == null ? void 0 : Ee.field) === M ? null : Ee), G(R);
  }
  return /* @__PURE__ */ i.createElement("form", { className: "chat-setup panel-flow", onSubmit: he }, Ve ? /* @__PURE__ */ i.createElement("div", { className: "access-settings panel-section-enter", key: "details" }, /* @__PURE__ */ i.createElement(qs, { file: D, onChange: (M) => Ze("avatar", K, M) }), /* @__PURE__ */ i.createElement(Pt, { message: Et("avatar") }), /* @__PURE__ */ i.createElement(ct, { title: Fe ? "Данные канала" : "Данные группы", hint: V.length ? "Выбрано участников: " + V.length : void 0 }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement(ml, { label: Fe ? "Название канала" : "Название группы", required: !0, maxLength: 150, error: Et("name"), value: x, onChange: (M) => Ze("name", O, M.target.value) }), /* @__PURE__ */ i.createElement(ml, { label: "Описание (необязательно)", multiline: !0, rows: 2, maxLength: 250, error: Et("description"), value: g, onChange: (M) => Ze("description", z, M.target.value) })))) : /* @__PURE__ */ i.createElement("div", { className: "access-settings panel-section-enter", key: "members" }, /* @__PURE__ */ i.createElement(ml, { label: "Поиск контактов", type: "search", error: J, value: r, onChange: (M) => T(M.target.value) }), V.length > 0 && /* @__PURE__ */ i.createElement("div", { className: "people-chips" }, V.map((M) => /* @__PURE__ */ i.createElement("button", { key: M.id, type: "button", onClick: () => L((G) => G.filter((R) => R.id !== M.id)) }, M.fio || M.login, /* @__PURE__ */ i.createElement(qe, { name: "close" })))), j === null && !J && /* @__PURE__ */ i.createElement(Ba, { label: "Загрузка контактов…" }), (j == null ? void 0 : j.length) > 0 && /* @__PURE__ */ i.createElement("div", { className: "person-list access-card" }, j.map((M) => {
    const G = V.some((R) => R.id === M.id);
    return /* @__PURE__ */ i.createElement("button", { className: "profile-row person-row", key: M.id, type: "button", "aria-pressed": G, onClick: () => L((R) => G ? R.filter((Ee) => Ee.id !== M.id) : ge ? [M] : [...R, M]) }, /* @__PURE__ */ i.createElement(Ul, { src: M.avatar, name: M.fio || M.login }), /* @__PURE__ */ i.createElement("span", null, M.fio || M.login), /* @__PURE__ */ i.createElement("span", { className: "person-select" }, G && /* @__PURE__ */ i.createElement(qe, { name: "check" })));
  })), (j == null ? void 0 : j.length) === 0 && /* @__PURE__ */ i.createElement("p", { className: "panel-hint" }, r ? "Никого не найдено." : "Введите имя или никнейм.")), /* @__PURE__ */ i.createElement(Pt, { message: re }), /* @__PURE__ */ i.createElement(Ln, { icon: Ve || it ? "check" : "arrow_forward", disabled: Oe || (ge || it) && !V.length }, Oe ? "Сохраняем…" : rt));
}
const B5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-person-circle'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M11%206a3%203%200%201%201-6%200%203%203%200%200%201%206%200'/%3e%3cpath%20fill-rule='evenodd'%20d='M0%208a8%208%200%201%201%2016%200A8%208%200%200%201%200%208m8-7a7%207%200%200%200-5.468%2011.37C3.242%2011.226%204.805%2010%208%2010s4.757%201.225%205.468%202.37A7%207%200%200%200%208%201'/%3e%3c/svg%3e", L5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-info-circle-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M8%2016A8%208%200%201%200%208%200a8%208%200%200%200%200%2016m.93-9.412-1%204.705c-.07.34.029.533.304.533.194%200%20.487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703%200-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381%202.29-.287zM8%205.5a1%201%200%201%201%200-2%201%201%200%200%201%200%202'/%3e%3c/svg%3e", k5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-bell-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M8%2016a2%202%200%200%200%202-2H6a2%202%200%200%200%202%202m.995-14.901a1%201%200%201%200-1.99%200A5%205%200%200%200%203%206c0%201.098-.5%206-2%207h14c-1.5-1-2-5.902-2-7%200-2.42-1.72-4.44-4.005-4.901'/%3e%3c/svg%3e", j5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-people-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M7%2014s-1%200-1-1%201-4%205-4%205%203%205%204-1%201-1%201zm4-6a3%203%200%201%200%200-6%203%203%200%200%200%200%206m-5.784%206A2.24%202.24%200%200%201%205%2013c0-1.355.68-2.75%201.936-3.72A6.3%206.3%200%200%200%205%209c-4%200-5%203-5%204s1%201%201%201zM4.5%208a2.5%202.5%200%201%200%200-5%202.5%202.5%200%200%200%200%205'/%3e%3c/svg%3e", Y5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-envelope-at-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M2%202A2%202%200%200%200%20.05%203.555L8%208.414l7.95-4.859A2%202%200%200%200%2014%202zm-2%209.8V4.698l5.803%203.546zm6.761-2.97-6.57%204.026A2%202%200%200%200%202%2014h6.256A4.5%204.5%200%200%201%208%2012.5a4.49%204.49%200%200%201%201.606-3.446l-.367-.225L8%209.586zM16%209.671V4.697l-5.803%203.546.338.208A4.5%204.5%200%200%201%2012.5%208c1.414%200%202.675.652%203.5%201.671'/%3e%3cpath%20d='M15.834%2012.244c0%201.168-.577%202.025-1.587%202.025-.503%200-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77%200-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4%201.26-1.4.585%200%20.87.333.953.63h.03v-.568h.905v2.19c0%20.272.18.42.411.42.315%200%20.639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582%200-2.64%201.067-2.64%202.724v.157c0%201.867%201.237%202.654%202.57%202.654h.045c.507%200%20.935-.07%201.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438%2016%209%2014.82%209%2012.646v-.214C9%2010.36%2010.421%209%2012.485%209h.035c2.12%200%203.314%201.43%203.314%203.034zm-4.04.21v.227c0%20.586.227.8.581.8.31%200%20.564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346%200-.573.245-.573.791'/%3e%3c/svg%3e", rm = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-chat-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M8%2015c4.418%200%208-3.134%208-7s-3.582-7-8-7-8%203.134-8%207c0%201.76.743%203.37%201.97%204.6-.097%201.016-.417%202.13-.771%202.966-.079.186.074.394.273.362%202.256-.37%203.597-.938%204.18-1.234A9%209%200%200%200%208%2015'/%3e%3c/svg%3e", V5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-lock-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M8%200a4%204%200%200%201%204%204v2.05a2.5%202.5%200%200%201%202%202.45v5a2.5%202.5%200%200%201-2.5%202.5h-7A2.5%202.5%200%200%201%202%2013.5v-5a2.5%202.5%200%200%201%202-2.45V4a4%204%200%200%201%204-4m0%201a3%203%200%200%200-3%203v2h6V4a3%203%200%200%200-3-3'/%3e%3c/svg%3e", fm = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-shield-lock-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M8%200c-.69%200-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54%201.54%200%200%200-1.044%201.262c-.596%204.477.787%207.795%202.465%209.99a11.8%2011.8%200%200%200%202.517%202.453c.386.273.744.482%201.048.625.28.132.581.24.829.24s.548-.108.829-.24a7%207%200%200%200%201.048-.625%2011.8%2011.8%200%200%200%202.517-2.453c1.678-2.195%203.061-5.513%202.465-9.99a1.54%201.54%200%200%200-1.044-1.263%2063%2063%200%200%200-2.887-.87C9.843.266%208.69%200%208%200m0%205a1.5%201.5%200%200%201%20.5%202.915l.385%201.99a.5.5%200%200%201-.491.595h-.788a.5.5%200%200%201-.49-.595l.384-1.99A1.5%201.5%200%200%201%208%205'/%3e%3c/svg%3e", G5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-heart-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M8%201.314C12.438-3.248%2023.534%204.735%208%2015-7.534%204.736%203.562-3.248%208%201.314'/%3e%3c/svg%3e", Q5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-clock-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M16%208A8%208%200%201%201%200%208a8%208%200%200%201%2016%200M8%203.5a.5.5%200%200%200-1%200V9a.5.5%200%200%200%20.252.434l3.5%202a.5.5%200%200%200%20.496-.868L8%208.71z'/%3e%3c/svg%3e", X5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-globe-americas'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M8%200a8%208%200%201%200%200%2016A8%208%200%200%200%208%200M2.04%204.326c.325%201.329%202.532%202.54%203.717%203.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758%201.266.035.634.618.824%201.214%201.017.577.188%201.168.38%201.286.983.082.417-.075.988-.22%201.52-.215.782-.406%201.48.22%201.48%201.5-.5%203.798-3.186%204-5%20.138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171%201.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434%201.265-.791%202.028-1.12.712-.306%201.365-.587%201.579-.88A7%207%200%201%201%202.04%204.327Z'/%3e%3c/svg%3e", Z5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-link-45deg'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M4.715%206.542%203.343%207.914a3%203%200%201%200%204.243%204.243l1.828-1.829A3%203%200%200%200%208.586%205.5L8%206.086a1%201%200%200%200-.154.199%202%202%200%200%201%20.861%203.337L6.88%2011.45a2%202%200%201%201-2.83-2.83l.793-.792a4%204%200%200%201-.128-1.287z'/%3e%3cpath%20d='M6.586%204.672A3%203%200%200%200%207.414%209.5l.775-.776a2%202%200%200%201-.896-3.346L9.12%203.55a2%202%200%201%201%202.83%202.83l-.793.792c.112.42.155.855.128%201.287l1.372-1.372a3%203%200%201%200-4.243-4.243z'/%3e%3c/svg%3e", K5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-grid-1x2-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M0%201a1%201%200%200%201%201-1h5a1%201%200%200%201%201%201v14a1%201%200%200%201-1%201H1a1%201%200%200%201-1-1zm9%200a1%201%200%200%201%201-1h5a1%201%200%200%201%201%201v5a1%201%200%200%201-1%201h-5a1%201%200%200%201-1-1zm0%209a1%201%200%200%201%201-1h5a1%201%200%200%201%201%201v5a1%201%200%200%201-1%201h-5a1%201%200%200%201-1-1z'/%3e%3c/svg%3e", J5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-keyboard-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M0%206a2%202%200%200%201%202-2h12a2%202%200%200%201%202%202v5a2%202%200%200%201-2%202H2a2%202%200%200%201-2-2zm13%20.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25h-.5a.25.25%200%200%200-.25.25M2.25%208a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h.5A.25.25%200%200%200%203%208.75v-.5A.25.25%200%200%200%202.75%208zM4%208.25v.5c0%20.138.112.25.25.25h.5A.25.25%200%200%200%205%208.75v-.5A.25.25%200%200%200%204.75%208h-.5a.25.25%200%200%200-.25.25M6.25%208a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h.5A.25.25%200%200%200%207%208.75v-.5A.25.25%200%200%200%206.75%208zM8%208.25v.5c0%20.138.112.25.25.25h.5A.25.25%200%200%200%209%208.75v-.5A.25.25%200%200%200%208.75%208h-.5a.25.25%200%200%200-.25.25M13.25%208a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25zm0%202a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25zm-3-2a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h1.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25zm.75%202.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25h-.5a.25.25%200%200%200-.25.25M11.25%206a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25zM9%206.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5A.25.25%200%200%200%209.75%206h-.5a.25.25%200%200%200-.25.25M7.25%206a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h.5A.25.25%200%200%200%208%206.75v-.5A.25.25%200%200%200%207.75%206zM5%206.25v.5c0%20.138.112.25.25.25h.5A.25.25%200%200%200%206%206.75v-.5A.25.25%200%200%200%205.75%206h-.5a.25.25%200%200%200-.25.25M2.25%206a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h1.5A.25.25%200%200%200%204%206.75v-.5A.25.25%200%200%200%203.75%206zM2%2010.25v.5c0%20.138.112.25.25.25h.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25h-.5a.25.25%200%200%200-.25.25M4.25%2010a.25.25%200%200%200-.25.25v.5c0%20.138.112.25.25.25h5.5a.25.25%200%200%200%20.25-.25v-.5a.25.25%200%200%200-.25-.25z'/%3e%3c/svg%3e", F5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-door-open-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M1.5%2015a.5.5%200%200%200%200%201h13a.5.5%200%200%200%200-1H13V2.5A1.5%201.5%200%200%200%2011.5%201H11V.5a.5.5%200%200%200-.57-.495l-7%201A.5.5%200%200%200%203%201.5V15zM11%202h.5a.5.5%200%200%201%20.5.5V15h-1zm-2.5%208c-.276%200-.5-.448-.5-1s.224-1%20.5-1%20.5.448.5%201-.224%201-.5%201'/%3e%3c/svg%3e", $5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-qr-code'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M2%202h2v2H2z'/%3e%3cpath%20d='M6%200v6H0V0zM5%201H1v4h4zM4%2012H2v2h2z'/%3e%3cpath%20d='M6%2010v6H0v-6zm-5%201v4h4v-4zm11-9h2v2h-2z'/%3e%3cpath%20d='M10%200v6h6V0zm5%201v4h-4V1zM8%201V0h1v2H8v2H7V1zm0%205V4h1v2zM6%208V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0%200v1H2V8H1v1H0V7h3v1zm10%201h-1V7h1zm-1%200h-1v2h2v-1h-1zm-4%200h2v1h-1v1h-1zm2%203v-1h-1v1h-1v1H9v1h3v-2zm0%200h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z'/%3e%3cpath%20d='M7%2012h1v3h4v1H7zm9%202v2h-3v-1h2v-1z'/%3e%3c/svg%3e", dm = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-camera-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M10.5%208.5a2.5%202.5%200%201%201-5%200%202.5%202.5%200%200%201%205%200'/%3e%3cpath%20d='M2%204a2%202%200%200%200-2%202v6a2%202%200%200%200%202%202h12a2%202%200%200%200%202-2V6a2%202%200%200%200-2-2h-1.172a2%202%200%200%201-1.414-.586l-.828-.828A2%202%200%200%200%209.172%202H6.828a2%202%200%200%200-1.414.586l-.828.828A2%202%200%200%201%203.172%204zm.5%202a.5.5%200%201%201%200-1%20.5.5%200%200%201%200%201m9%202.5a3.5%203.5%200%201%201-7%200%203.5%203.5%200%200%201%207%200'/%3e%3c/svg%3e", W5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-mic-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M5%203a3%203%200%200%201%206%200v5a3%203%200%200%201-6%200z'/%3e%3cpath%20d='M3.5%206.5A.5.5%200%200%201%204%207v1a4%204%200%200%200%208%200V7a.5.5%200%200%201%201%200v1a5%205%200%200%201-4.5%204.975V15h3a.5.5%200%200%201%200%201h-7a.5.5%200%200%201%200-1h3v-2.025A5%205%200%200%201%203%208V7a.5.5%200%200%201%20.5-.5'/%3e%3c/svg%3e", I5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-paperclip'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M4.5%203a2.5%202.5%200%200%201%205%200v9a1.5%201.5%200%200%201-3%200V5a.5.5%200%200%201%201%200v7a.5.5%200%200%200%201%200V3a1.5%201.5%200%201%200-3%200v9a2.5%202.5%200%200%200%205%200V5a.5.5%200%200%201%201%200v7a3.5%203.5%200%201%201-7%200z'/%3e%3c/svg%3e", P5 = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-emoji-smile'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M8%2015A7%207%200%201%201%208%201a7%207%200%200%201%200%2014m0%201A8%208%200%201%200%208%200a8%208%200%200%200%200%2016'/%3e%3cpath%20d='M4.285%209.567a.5.5%200%200%201%20.683.183A3.5%203.5%200%200%200%208%2011.5a3.5%203.5%200%200%200%203.032-1.75.5.5%200%201%201%20.866.5A4.5%204.5%200%200%201%208%2012.5a4.5%204.5%200%200%201-3.898-2.25.5.5%200%200%201%20.183-.683M7%206.5C7%207.328%206.552%208%206%208s-1-.672-1-1.5S5.448%205%206%205s1%20.672%201%201.5m4%200c0%20.828-.448%201.5-1%201.5s-1-.672-1-1.5S9.448%205%2010%205s1%20.672%201%201.5'/%3e%3c/svg%3e", ey = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-send-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M15.964.686a.5.5%200%200%200-.65-.65L.767%205.855H.766l-.452.18a.5.5%200%200%200-.082.887l.41.26.001.002%204.995%203.178%203.178%204.995.002.002.26.41a.5.5%200%200%200%20.886-.083zm-1.833%201.89L6.637%2010.07l-.215-.338a.5.5%200%200%200-.154-.154l-.338-.215%207.494-7.494%201.178-.471z'/%3e%3c/svg%3e", ty = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-stop-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M5%203.5h6A1.5%201.5%200%200%201%2012.5%205v6a1.5%201.5%200%200%201-1.5%201.5H5A1.5%201.5%200%200%201%203.5%2011V5A1.5%201.5%200%200%201%205%203.5'/%3e%3c/svg%3e", ly = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-pencil-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M12.854.146a.5.5%200%200%200-.707%200L10.5%201.793%2014.207%205.5l1.647-1.646a.5.5%200%200%200%200-.708zm.646%206.061L9.793%202.5%203.293%209H3.5a.5.5%200%200%201%20.5.5v.5h.5a.5.5%200%200%201%20.5.5v.5h.5a.5.5%200%200%201%20.5.5v.5h.5a.5.5%200%200%201%20.5.5v.207zm-7.468%207.468A.5.5%200%200%201%206%2013.5V13h-.5a.5.5%200%200%201-.5-.5V12h-.5a.5.5%200%200%201-.5-.5V11h-.5a.5.5%200%200%201-.5-.5V10h-.5a.5.5%200%200%201-.175-.032l-.179.178a.5.5%200%200%200-.11.168l-2%205a.5.5%200%200%200%20.65.65l5-2a.5.5%200%200%200%20.168-.11z'/%3e%3c/svg%3e", ay = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-person-plus-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M1%2014s-1%200-1-1%201-4%206-4%206%203%206%204-1%201-1%201zm5-6a3%203%200%201%200%200-6%203%203%200%200%200%200%206'/%3e%3cpath%20fill-rule='evenodd'%20d='M13.5%205a.5.5%200%200%201%20.5.5V7h1.5a.5.5%200%200%201%200%201H14v1.5a.5.5%200%200%201-1%200V8h-1.5a.5.5%200%200%201%200-1H13V5.5a.5.5%200%200%201%20.5-.5'/%3e%3c/svg%3e", ny = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-person-x-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M1%2014s-1%200-1-1%201-4%206-4%206%203%206%204-1%201-1%201zm5-6a3%203%200%201%200%200-6%203%203%200%200%200%200%206m6.146-2.854a.5.5%200%200%201%20.708%200L14%206.293l1.146-1.147a.5.5%200%200%201%20.708.708L14.707%207l1.147%201.146a.5.5%200%200%201-.708.708L14%207.707l-1.146%201.147a.5.5%200%200%201-.708-.708L13.293%207l-1.147-1.146a.5.5%200%200%201%200-.708'/%3e%3c/svg%3e", cy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-person-check-fill'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M15.854%205.146a.5.5%200%200%201%200%20.708l-3%203a.5.5%200%200%201-.708%200l-1.5-1.5a.5.5%200%200%201%20.708-.708L12.5%207.793l2.646-2.647a.5.5%200%200%201%20.708%200'/%3e%3cpath%20d='M1%2014s-1%200-1-1%201-4%206-4%206%203%206%204-1%201-1%201zm5-6a3%203%200%201%200%200-6%203%203%200%200%200%200%206'/%3e%3c/svg%3e", iy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-arrow-repeat'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M11.534%207h3.932a.25.25%200%200%201%20.192.41l-1.966%202.36a.25.25%200%200%201-.384%200l-1.966-2.36a.25.25%200%200%201%20.192-.41m-11%202h3.932a.25.25%200%200%200%20.192-.41L2.692%206.23a.25.25%200%200%200-.384%200L.342%208.59A.25.25%200%200%200%20.534%209'/%3e%3cpath%20fill-rule='evenodd'%20d='M8%203c-1.552%200-2.94.707-3.857%201.818a.5.5%200%201%201-.771-.636A6.002%206.002%200%200%201%2013.917%207H12.9A5%205%200%200%200%208%203M3.1%209a5.002%205.002%200%200%200%208.757%202.182.5.5%200%201%201%20.771.636A6.002%206.002%200%200%201%202.083%209z'/%3e%3c/svg%3e", uy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-copy'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M4%202a2%202%200%200%201%202-2h8a2%202%200%200%201%202%202v8a2%202%200%200%201-2%202H6a2%202%200%200%201-2-2zm2-1a1%201%200%200%200-1%201v8a1%201%200%200%200%201%201h8a1%201%200%200%200%201-1V2a1%201%200%200%200-1-1zM2%205a1%201%200%200%200-1%201v8a1%201%200%200%200%201%201h8a1%201%200%200%200%201-1v-1h1v1a2%202%200%200%201-2%202H2a2%202%200%200%201-2-2V6a2%202%200%200%201%202-2h1v1z'/%3e%3c/svg%3e", oy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-check-lg'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M12.736%203.97a.733.733%200%200%201%201.047%200c.286.289.29.756.01%201.05L7.88%2012.01a.733.733%200%200%201-1.065.02L3.217%208.384a.757.757%200%200%201%200-1.06.733.733%200%200%201%201.047%200l3.052%203.093%205.4-6.425z'/%3e%3c/svg%3e", sy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-check2-all'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M12.354%204.354a.5.5%200%200%200-.708-.708L5%2010.293%201.854%207.146a.5.5%200%201%200-.708.708l3.5%203.5a.5.5%200%200%200%20.708%200zm-4.208%207-.896-.897.707-.707.543.543%206.646-6.647a.5.5%200%200%201%20.708.708l-7%207a.5.5%200%200%201-.708%200'/%3e%3cpath%20d='m5.354%207.146.896.897-.707.707-.897-.896a.5.5%200%201%201%20.708-.708'/%3e%3c/svg%3e", ry = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-trash3'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M6.5%201h3a.5.5%200%200%201%20.5.5v1H6v-1a.5.5%200%200%201%20.5-.5M11%202.5v-1A1.5%201.5%200%200%200%209.5%200h-3A1.5%201.5%200%200%200%205%201.5v1H1.5a.5.5%200%200%200%200%201h.538l.853%2010.66A2%202%200%200%200%204.885%2016h6.23a2%202%200%200%200%201.994-1.84l.853-10.66h.538a.5.5%200%200%200%200-1zm1.958%201-.846%2010.58a1%201%200%200%201-.997.92h-6.23a1%201%200%200%201-.997-.92L3.042%203.5zm-7.487%201a.5.5%200%200%201%20.528.47l.5%208.5a.5.5%200%200%201-.998.06L5%205.03a.5.5%200%200%201%20.47-.53Zm5.058%200a.5.5%200%200%201%20.47.53l-.5%208.5a.5.5%200%201%201-.998-.06l.5-8.5a.5.5%200%200%201%20.528-.47M8%204.5a.5.5%200%200%201%20.5.5v8.5a.5.5%200%200%201-1%200V5a.5.5%200%200%201%20.5-.5'/%3e%3c/svg%3e", fy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-reply'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M6.598%205.013a.144.144%200%200%201%20.202.134V6.3a.5.5%200%200%200%20.5.5c.667%200%202.013.005%203.3.822.984.624%201.99%201.76%202.595%203.876-1.02-.983-2.185-1.516-3.205-1.799a8.7%208.7%200%200%200-1.921-.306%207%207%200%200%200-.798.008h-.013l-.005.001h-.001L7.3%209.9l-.05-.498a.5.5%200%200%200-.45.498v1.153c0%20.108-.11.176-.202.134L2.614%208.254l-.042-.028a.147.147%200%200%201%200-.252l.042-.028zM7.8%2010.386q.103%200%20.223.006c.434.02%201.034.086%201.7.271%201.326.368%202.896%201.202%203.94%203.08a.5.5%200%200%200%20.933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144%201.144%200%200%200-1.767-.96l-3.994%202.94a1.147%201.147%200%200%200%200%201.946l3.994%202.94a1.144%201.144%200%200%200%201.767-.96z'/%3e%3c/svg%3e", dy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-chevron-down'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M1.646%204.646a.5.5%200%200%201%20.708%200L8%2010.293l5.646-5.647a.5.5%200%200%201%20.708.708l-6%206a.5.5%200%200%201-.708%200l-6-6a.5.5%200%200%201%200-.708'/%3e%3c/svg%3e", my = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-telephone'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M3.654%201.328a.678.678%200%200%200-1.015-.063L1.605%202.3c-.483.484-.661%201.169-.45%201.77a17.6%2017.6%200%200%200%204.168%206.608%2017.6%2017.6%200%200%200%206.608%204.168c.601.211%201.286.033%201.77-.45l1.034-1.034a.678.678%200%200%200-.063-1.015l-2.307-1.794a.68.68%200%200%200-.58-.122l-2.19.547a1.75%201.75%200%200%201-1.657-.459L5.482%208.062a1.75%201.75%200%200%201-.46-1.657l.548-2.19a.68.68%200%200%200-.122-.58zM1.884.511a1.745%201.745%200%200%201%202.612.163L6.29%202.98c.329.423.445.974.315%201.494l-.547%202.19a.68.68%200%200%200%20.178.643l2.457%202.457a.68.68%200%200%200%20.644.178l2.189-.547a1.75%201.75%200%200%201%201.494.315l2.306%201.794c.829.645.905%201.87.163%202.611l-1.034%201.034c-.74.74-1.846%201.065-2.877.702a18.6%2018.6%200%200%201-7.01-4.42%2018.6%2018.6%200%200%201-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z'/%3e%3c/svg%3e", hy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-search'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M11.742%2010.344a6.5%206.5%200%201%200-1.397%201.398h-.001q.044.06.098.115l3.85%203.85a1%201%200%200%200%201.415-1.414l-3.85-3.85a1%201%200%200%200-.115-.1zM12%206.5a5.5%205.5%200%201%201-11%200%205.5%205.5%200%200%201%2011%200'/%3e%3c/svg%3e", vy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-three-dots-vertical'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M9.5%2013a1.5%201.5%200%201%201-3%200%201.5%201.5%200%200%201%203%200m0-5a1.5%201.5%200%201%201-3%200%201.5%201.5%200%200%201%203%200m0-5a1.5%201.5%200%201%201-3%200%201.5%201.5%200%200%201%203%200'/%3e%3c/svg%3e", gy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-arrow-left'%20viewBox='0%200%2016%2016'%3e%3cpath%20fill-rule='evenodd'%20d='M15%208a.5.5%200%200%200-.5-.5H2.707l3.147-3.146a.5.5%200%201%200-.708-.708l-4%204a.5.5%200%200%200%200%20.708l4%204a.5.5%200%200%200%20.708-.708L2.707%208.5H14.5A.5.5%200%200%200%2015%208'/%3e%3c/svg%3e", yy = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='16'%20height='16'%20fill='currentColor'%20class='bi%20bi-x-lg'%20viewBox='0%200%2016%2016'%3e%3cpath%20d='M2.146%202.854a.5.5%200%201%201%20.708-.708L8%207.293l5.146-5.147a.5.5%200%200%201%20.708.708L8.707%208l5.147%205.146a.5.5%200%200%201-.708.708L8%208.707l-5.146%205.147a.5.5%200%200%201-.708-.708L7.293%208z'/%3e%3c/svg%3e", by = {
  account_circle: B5,
  info: L5,
  notifications: k5,
  groups: j5,
  alternate_email: Y5,
  chat_bubble: rm,
  forum: rm,
  lock: V5,
  admin_panel_settings: fm,
  privacy_tip: fm,
  favorite: G5,
  schedule: Q5,
  public: X5,
  link: Z5,
  view_compact_alt: K5,
  keyboard: J5,
  logout: F5,
  qr_code_2: $5,
  photo_camera: dm,
  add_a_photo: dm,
  mic: W5,
  paperclip: I5,
  smile: P5,
  send: ey,
  stop: ty,
  edit: ly,
  person_add: ay,
  person_off: ny,
  how_to_reg: cy,
  autorenew: iy,
  content_copy: uy,
  check: oy,
  arrow_back: gy,
  close: yy,
  checkAll: sy,
  trash: ry,
  forward: fy,
  down: dy,
  telephone: my,
  search: hy,
  more: vy
};
function Ey({ name: s, fallback: d = null }) {
  const y = by[s];
  return y ? /* @__PURE__ */ i.createElement("img", { className: "pack-icon", src: y, alt: "", "aria-hidden": "true" }) : d;
}
const py = ["chat", "chat-edit", "chat-type", "chat-reactions", "chat-discussion", "chat-members", "chat-admins", "chat-admin-pick", "chat-admin-rights", "chat-admin-review", "chat-blocked", "chat-requests"];
function ht({ icon: s, tone: d = "slate", title: y, detail: r, onClick: T, children: j, expanded: Z }) {
  const V = T ? "button" : "div";
  return /* @__PURE__ */ i.createElement(V, { className: "profile-row detail-row", ...T ? { type: "button", onClick: T, "aria-expanded": Z } : {} }, /* @__PURE__ */ i.createElement("i", { className: "detail-icon " + d }, /* @__PURE__ */ i.createElement(Ey, { name: s, fallback: /* @__PURE__ */ i.createElement(qe, { name: s }) })), /* @__PURE__ */ i.createElement("span", { className: "detail-label" }, y, r != null && /* @__PURE__ */ i.createElement("small", null, r)), j, T && !j && /* @__PURE__ */ i.createElement(qe, { name: "chevron_right" }));
}
function z1({ chatId: s }) {
  const [d, y] = _.useState("Медиа"), [r, T] = _.useState(null), [j, Z] = _.useState(!1);
  if (_.useEffect(() => {
    if (!s) return;
    const L = new AbortController();
    return T(null), Z(!1), Dc("/api/messages?chat_id=" + s, L.signal).then((x) => {
      L.signal.aborted || T(x);
    }).catch(() => {
      L.signal.aborted || Z(!0);
    }), () => L.abort();
  }, [s]), !s) return null;
  const V = (r ?? []).filter((L) => !L.is_deleted).flatMap((L) => {
    var z;
    if (d === "Ссылки") return (((z = L.content) == null ? void 0 : z.match(/https?:\/\/[^\s<>]+/gi)) || []).map((D) => ({ url: D, title: D }));
    if (!L.file_url) return [];
    const x = L.file_type || "", O = x === "image/gif", g = /^(image|video)\//.test(x);
    return d === "Медиа" && g && !O || d === "GIF" && O || d === "Музыка" && x.startsWith("audio/") || d === "Файлы" && !g && !x.startsWith("audio/") ? [{ url: Ct(L.file_url), title: L.file_name || "Вложение", image: g && x.startsWith("image/") }] : [];
  });
  return /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("nav", { className: "panel-tabs", "aria-label": "Вложения чата" }, ["Медиа", "Файлы", "Ссылки", "Музыка", "GIF"].map((L) => /* @__PURE__ */ i.createElement("button", { key: L, type: "button", "aria-pressed": d === L, onClick: () => y(L) }, L))), j ? /* @__PURE__ */ i.createElement(Pt, { message: "Не удалось загрузить вложения." }) : r === null ? /* @__PURE__ */ i.createElement(Ba, { label: "Загрузка вложений…" }) : V.length ? /* @__PURE__ */ i.createElement("div", { className: "panel-media " + (["Медиа", "GIF"].includes(d) ? "panel-media-grid" : "") }, V.map(({ url: L, title: x, image: O }, g) => /* @__PURE__ */ i.createElement("a", { key: L + g, href: L, target: "_blank", rel: "noopener noreferrer", title: x }, O ? /* @__PURE__ */ i.createElement("img", { src: L, alt: x }) : x))) : /* @__PURE__ */ i.createElement("p", { className: "panel-empty" }, { Медиа: "Нет медиафайлов", Файлы: "Нет файлов", Ссылки: "Нет ссылок", Музыка: "Нет аудио", GIF: "Нет GIF" }[d]));
}
function Sy({ page: s, setPage: d, groups: y, onOpenChat: r, onUpdated: T, notifications: j, onToggleNotifications: Z }) {
  var Qt, Nl, Ll, le, _e;
  const V = "/api/chats/" + s.id + "/info", [L, x] = _.useState(() => wi(V)), [O, g] = _.useState(() => wi(V) ? s.id : null), [z, D] = _.useState(() => wi(V)), [K, re] = _.useState(null), [X, J] = _.useState(""), [$, ve] = _.useState(null), [ae, Oe] = _.useState(!1), [Q, k] = _.useState(null), [ge, it] = _.useState(!1), [Fe, Ve] = _.useState(!1), [he, rt] = _.useState(""), Et = i.useRef(null), Ze = i.useId(), M = s.id, G = s.view;
  _.useEffect(() => {
    const A = new AbortController();
    return J(""), ve(null), it(!1), rt(""), Bl(""), G === "chat-requests" && (k(null), Te("/api/chats/" + M + "/requests", { signal: A.signal }).then((Se) => {
      A.signal.aborted || k(Se);
    }).catch((Se) => {
      A.signal.aborted || J(Se.message);
    })), Dc(V, A.signal).then((Se) => {
      A.signal.aborted || (x(Se), g(M), D(Se), re(null));
    }).catch((Se) => {
      A.signal.aborted || J(Se.message);
    }), () => A.abort();
  }, [M, G]);
  const R = O === M ? L : null, Ee = ((R == null ? void 0 : R.chat_type) ?? s.kind) === "channel", ze = Number(R == null ? void 0 : R.owner_id) === It.id, wt = ze || ((Qt = R == null ? void 0 : R.permissions) == null ? void 0 : Qt.includes("manage")), vt = ze || ((Nl = R == null ? void 0 : R.permissions) == null ? void 0 : Nl.includes("invite")), me = ze || ((Ll = R == null ? void 0 : R.permissions) == null ? void 0 : Ll.includes("moderate")), h = Ee ? "Подписчики" : "Участники", B = ((R == null ? void 0 : R.participants) || []).filter((A) => G === "chat-admins" ? ["owner", "admin"].includes(A.role) : G === "chat-blocked" ? A.blocked : !A.blocked), I = (A) => d({ ...s, view: A, back: s });
  function te(A, Se) {
    D((He) => ({ ...He, [A]: Se })), ve((He) => (He == null ? void 0 : He.field) === A || A === "visibility" && (He == null ? void 0 : He.field) === "alias" || A === "reactions_mode" && (He == null ? void 0 : He.field) === "allowed_reactions" ? null : He);
  }
  const Ce = (A) => ($ == null ? void 0 : $.field) === A ? $.message : "";
  async function Ue(A, Se) {
    try {
      await Te("/api/chats/" + M + "/requests", { method: "POST", json: { user_id: A.id, accept: Se } }), k((He) => He.filter((gl) => gl.id !== A.id));
    } catch (He) {
      J(He.message);
    }
  }
  async function Ae(A) {
    try {
      await Te("/api/chats/" + M + "/" + (A.blocked ? "unblock" : "block") + "/" + A.id, { method: "POST" });
      const Se = await Te("/api/chats/" + M + "/info");
      x(Se);
    } catch (Se) {
      J(Se.message);
    }
  }
  async function ne(A) {
    if (A.preventDefault(), !ae) {
      if (J(""), ve(null), G === "chat-edit" && !z.name.trim()) {
        ve({ field: "name", message: "Введите название." });
        return;
      }
      if (G === "chat-reactions" && z.reactions_mode === "selected" && !z.allowed_reactions.length) {
        ve({ field: "allowed_reactions", message: "Выберите хотя бы одну реакцию или переключитесь на «Без реакций»." });
        return;
      }
      Oe(!0);
      try {
        const He = Object.fromEntries({
          "chat-edit": ["name", "description"],
          "chat-type": ["visibility", "approval_required", "protected", "alias"],
          "chat-discussion": ["discussion_chat_id"],
          "chat-reactions": ["reactions_mode", "reaction_limit", "allowed_reactions"]
        }[G].map((gl) => [gl, z[gl]]));
        G === "chat-type" && z.visibility === "private" && delete He.alias, await Te("/api/chats/" + M + "/settings", { method: "PUT", json: He }), G === "chat-edit" && K && await N1(Te, M, K), await T(), d(s.back || { ...s, view: G === "chat-edit" ? "chat" : "chat-edit" });
      } catch (Se) {
        Se.field ? ve(Se) : J(Se.message);
      } finally {
        Oe(!1);
      }
    }
  }
  const fe = (R == null ? void 0 : R.alias) || "chat-" + M, Mt = Ct("/t/" + encodeURIComponent(fe)), il = new URL(Ct("/t/join-" + encodeURIComponent(M)), location.origin);
  R != null && R.invite_token && il.searchParams.set("token", R.invite_token);
  const hl = () => d({ view: "qr", id: M, handle: fe, qrUrl: "/api/chats/" + M + "/qr", back: s });
  async function at() {
    var A, Se;
    rt("");
    try {
      await navigator.clipboard.writeText(il.href), it(!0);
    } catch {
      G === "chat-type" ? ((A = Et.current) == null || A.focus(), (Se = Et.current) == null || Se.select(), rt("Не удалось скопировать ссылку. Скопируйте её из поля.")) : J("Не удалось скопировать ссылку.");
    }
  }
  async function De() {
    if (!Fe) {
      Ve(!0), rt("");
      try {
        const A = await Te("/api/chats/" + M + "/invite-link", { method: "POST" });
        x((Se) => ({ ...Se, invite_token: A.token })), it(!1);
      } catch (A) {
        rt(A.message);
      } finally {
        Ve(!1);
      }
    }
  }
  const ke = ["chat-edit", "chat-type", "chat-reactions", "chat-discussion"].includes(G), Tt = z && R, Ht = ((le = z == null ? void 0 : z.alias) == null ? void 0 : le.trim().replace(/^@+/, "").toLowerCase()) || "", At = !Ce("alias") && (!Ht || /^[a-z][a-z0-9_]{2,31}$/.test(Ht)), [el, Bl] = _.useState(""), Pe = s.admin, kt = [["manage", "Изменять настройки чата"], ["invite", "Приглашать и принимать заявки"], ["moderate", "Блокировать и удалять сообщения"], ...Ee ? [["post", "Публиковать сообщения"]] : []];
  function ul(A) {
    d({
      ...s,
      view: "chat-admin-rights",
      back: s,
      admin: { id: A.id, login: A.login, name: A.name || A.login, avatar: A.avatar, permissions: A.permissions || [], wasAdmin: A.role === "admin" }
    });
  }
  async function vl(A) {
    var Se;
    A.preventDefault(), Oe(!0), J("");
    try {
      await Te("/api/chats/" + M + "/administrators/" + Pe.id, { method: "PUT", json: { permissions: Pe.permissions } });
      const He = (Se = s.back) == null ? void 0 : Se.back;
      d((He == null ? void 0 : He.view) === "chat-admin-pick" ? He.back : He), await T();
    } catch (He) {
      J(He.message);
    } finally {
      Oe(!1);
    }
  }
  const tl = ((R == null ? void 0 : R.participants) || []).filter((A) => A.role !== "owner" && !A.blocked && (A.name || A.login).toLocaleLowerCase().includes(el.trim().toLocaleLowerCase()));
  return /* @__PURE__ */ i.createElement("div", { className: "chat-detail-body" }, /* @__PURE__ */ i.createElement(Pt, { message: X }), !R && !X && /* @__PURE__ */ i.createElement(Ba, null), G === "chat" && R && /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { className: "profile-cover chat-detail-cover" }, /* @__PURE__ */ i.createElement(Ul, { src: R.avatar || s.avatar, name: R.name || s.name }), /* @__PURE__ */ i.createElement("strong", null, R.name || s.name), /* @__PURE__ */ i.createElement("small", null, bm(B.length, Ee))), /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: Ee ? "Информация о канале" : "Информация о группе" }, R.description && /* @__PURE__ */ i.createElement(ht, { icon: "info", title: R.description, detail: "Информация" }), R.visibility === "public" ? /* @__PURE__ */ i.createElement(ht, { icon: "alternate_email", tone: "blue", title: /* @__PURE__ */ i.createElement("a", { className: "detail-public-handle", href: Mt }, "@", fe), detail: "Имя пользователя" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action profile-qr-action", "aria-label": "Открыть QR-код", title: "QR-код", onClick: hl }, /* @__PURE__ */ i.createElement(qe, { name: "qr_code_2" }))) : R.invite_token && /* @__PURE__ */ i.createElement(ht, { icon: "link", tone: "amber", title: il.href, detail: "Ссылка-приглашение", onClick: at }, /* @__PURE__ */ i.createElement(qe, { name: ge ? "check" : "content_copy" })), /* @__PURE__ */ i.createElement(ht, { icon: "notifications", tone: "coral", title: "Уведомления", onClick: Z }, /* @__PURE__ */ i.createElement("span", { className: "panel-switch" + (j ? " enabled" : ""), role: "switch", "aria-checked": j, "aria-label": "Уведомления" })), /* @__PURE__ */ i.createElement(ht, { icon: "groups", tone: "green", title: h, detail: B.length, onClick: () => I("chat-members") }), R.discussion_chat_id && /* @__PURE__ */ i.createElement(ht, { icon: "forum", title: "Обсуждение", onClick: () => r(R.discussion_chat_id) }))), /* @__PURE__ */ i.createElement(z1, { chatId: M })), ke && Tt && wt && /* @__PURE__ */ i.createElement("form", { className: "managed-form", onSubmit: ne }, G === "chat-edit" && /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement(qs, { avatar: R.avatar || s.avatar, file: K, onChange: (A) => {
    re(A), ($ == null ? void 0 : $.field) === "avatar" && ve(null);
  } }), /* @__PURE__ */ i.createElement(Pt, { message: Ce("avatar") }), /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: Ee ? "Данные канала" : "Данные группы" }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement(ml, { label: Ee ? "Название канала" : "Название группы", required: !0, maxLength: 150, error: Ce("name"), value: z.name || "", onChange: (A) => te("name", A.target.value) }), /* @__PURE__ */ i.createElement(ml, { label: "Описание", multiline: !0, rows: 2, maxLength: 250, error: Ce("description"), value: z.description, onChange: (A) => te("description", A.target.value) }))), /* @__PURE__ */ i.createElement(ct, { title: "Настройки чата" }, /* @__PURE__ */ i.createElement(ht, { icon: "lock", title: Ee ? "Тип канала" : "Тип группы", detail: R.visibility === "private" ? "Частный" : "Публичный", onClick: () => I("chat-type") }), Ee && /* @__PURE__ */ i.createElement(ht, { icon: "forum", title: "Обсуждение", detail: ((_e = y.find((A) => Number(A.id) === R.discussion_chat_id)) == null ? void 0 : _e.name) || "Добавить", onClick: () => I("chat-discussion") }), /* @__PURE__ */ i.createElement(ht, { icon: "favorite", title: "Реакции", detail: { all: "Все", selected: "Только выбранные", none: "Отключены" }[R.reactions_mode], onClick: () => I("chat-reactions") })), /* @__PURE__ */ i.createElement(ct, { title: "Управление участниками" }, /* @__PURE__ */ i.createElement(ht, { icon: "admin_panel_settings", title: "Администраторы", onClick: () => I("chat-admins") }), /* @__PURE__ */ i.createElement(ht, { icon: "groups", title: h, onClick: () => I("chat-members") }), /* @__PURE__ */ i.createElement(ht, { icon: "person_off", title: "Чёрный список", onClick: () => I("chat-blocked") }), vt && /* @__PURE__ */ i.createElement(ht, { icon: "how_to_reg", title: "Заявки на вступление", onClick: () => I("chat-requests") })))), G === "chat-type" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement("fieldset", { className: "access-section" }, /* @__PURE__ */ i.createElement("legend", null, "Тип доступа"), /* @__PURE__ */ i.createElement("div", { className: "access-card option-card" }, /* @__PURE__ */ i.createElement(
    _i,
    {
      name: "visibility",
      icon: "lock",
      checked: z.visibility === "private",
      onChange: () => te("visibility", "private"),
      title: "Только по приглашению",
      detail: "Вступить можно по действующей ссылке-приглашению."
    }
  ), /* @__PURE__ */ i.createElement(
    _i,
    {
      name: "visibility",
      icon: "public",
      checked: z.visibility === "public",
      onChange: () => te("visibility", "public"),
      title: Ee ? "Публичный канал" : "Публичная группа",
      detail: Ee ? "Канал можно найти через поиск и открыть по короткой ссылке." : "Группу можно найти через поиск и открыть по короткой ссылке."
    }
  )), /* @__PURE__ */ i.createElement("div", { className: "access-public" + (z.visibility === "public" ? " expanded" : ""), inert: z.visibility !== "public" }, /* @__PURE__ */ i.createElement("div", { className: "access-public-inner" }, /* @__PURE__ */ i.createElement("div", { className: "access-alias" }, /* @__PURE__ */ i.createElement(ml, { label: "Короткое имя", "aria-describedby": Ze, autoCapitalize: "none", spellCheck: !1, maxLength: 32, error: Ce("alias"), value: z.alias, onChange: (A) => te("alias", A.target.value) }), /* @__PURE__ */ i.createElement("p", { id: Ze, className: "access-hint" }, At ? /* @__PURE__ */ i.createElement(i.Fragment, null, Ht === R.alias ? "Публичная ссылка" : "Ссылка после сохранения", " ", /* @__PURE__ */ i.createElement("b", null, "/t/", Ht || "chat-" + M)) : "От 3 до 32 символов. Начните с латинской буквы."))))), (vt || R.invite_token) && /* @__PURE__ */ i.createElement("section", { className: "access-section" }, /* @__PURE__ */ i.createElement("h3", null, "Ссылка-приглашение"), /* @__PURE__ */ i.createElement("div", { className: "access-card invite-card" }, R.invite_token && /* @__PURE__ */ i.createElement("div", { className: "invite-field" }, /* @__PURE__ */ i.createElement(qe, { name: "link" }), /* @__PURE__ */ i.createElement("input", { ref: Et, "aria-label": "Ссылка-приглашение", value: il.href, readOnly: !0, onFocus: (A) => A.currentTarget.select() }), /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action", "aria-label": ge ? "Ссылка скопирована" : "Копировать ссылку", title: ge ? "Ссылка скопирована" : "Копировать ссылку", onClick: at }, /* @__PURE__ */ i.createElement(qe, { name: ge ? "check" : "content_copy" }))), vt && /* @__PURE__ */ i.createElement("button", { type: "button", className: "access-link-action" + (R.invite_token ? " renewing" : ""), disabled: Fe, onClick: De }, /* @__PURE__ */ i.createElement(qe, { name: R.invite_token ? "autorenew" : "add" }), Fe ? "Готовим ссылку…" : R.invite_token ? "Обновить ссылку" : "Создать ссылку"), /* @__PURE__ */ i.createElement(Pt, { className: "invite-error", message: he })), /* @__PURE__ */ i.createElement("p", { className: "access-hint" }, R.invite_token ? "Поделитесь ссылкой, чтобы пригласить людей. Для частного доступа обновление отменяет прежнюю ссылку." : "Создайте ссылку, которой можно поделиться с участниками.")), /* @__PURE__ */ i.createElement("section", { className: "access-section" }, /* @__PURE__ */ i.createElement("h3", null, "Вступление"), /* @__PURE__ */ i.createElement("div", { className: "access-card" }, /* @__PURE__ */ i.createElement(ql, { label: "Заявки на вступление", checked: z.approval_required, onChange: (A) => te("approval_required", A) })), /* @__PURE__ */ i.createElement("p", { className: "access-hint" }, "Новые участники смогут вступить после одобрения владельцем или администратором.")), /* @__PURE__ */ i.createElement("fieldset", { className: "access-section" }, /* @__PURE__ */ i.createElement("legend", null, "Пересылка сообщений"), /* @__PURE__ */ i.createElement("div", { className: "access-card option-card" }, /* @__PURE__ */ i.createElement(_i, { name: "forwarding", checked: !z.protected, onChange: () => te("protected", !1), title: "Разрешить пересылку" }), /* @__PURE__ */ i.createElement(_i, { name: "forwarding", checked: z.protected, onChange: () => te("protected", !0), title: "Запретить пересылку" })), /* @__PURE__ */ i.createElement("p", { className: "access-hint" }, z.protected ? "Кнопки копирования и пересылки будут скрыты у участников." : "Участники смогут копировать и пересылать сообщения."))), G === "chat-reactions" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Количество реакций", options: !0, hint: "Максимум разных эмодзи на одном сообщении." }, /* @__PURE__ */ i.createElement("label", { className: "setting-slider panel-range" }, /* @__PURE__ */ i.createElement("span", null, "На одно сообщение ", /* @__PURE__ */ i.createElement("b", null, z.reaction_limit)), /* @__PURE__ */ i.createElement("input", { type: "range", min: "1", max: zi.length, value: z.reaction_limit, style: { "--range-fill": (z.reaction_limit - 1) / (zi.length - 1) * 100 + "%" }, onChange: (A) => te("reaction_limit", Number(A.target.value)) }))), /* @__PURE__ */ i.createElement("fieldset", { className: "access-section" }, /* @__PURE__ */ i.createElement("legend", null, "Доступные реакции"), /* @__PURE__ */ i.createElement("div", { className: "access-card option-card" }, [["all", "Все реакции"], ["selected", "Только выбранные"], ["none", "Без реакций"]].map(([A, Se]) => /* @__PURE__ */ i.createElement(_i, { key: A, name: "reactions", title: Se, checked: z.reactions_mode === A, onChange: () => te("reactions_mode", A) })), z.reactions_mode === "selected" && /* @__PURE__ */ i.createElement("div", { className: "allowed-reactions" }, zi.map((A) => /* @__PURE__ */ i.createElement("button", { type: "button", key: A, "aria-pressed": z.allowed_reactions.includes(A), onClick: () => te("allowed_reactions", z.allowed_reactions.includes(A) ? z.allowed_reactions.filter((Se) => Se !== A) : [...z.allowed_reactions, A]) }, A))), /* @__PURE__ */ i.createElement(Pt, { className: "field-error", message: Ce("allowed_reactions") })))), G === "chat-discussion" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Связанная группа", hint: "Для обсуждения можно выбрать группу, которой вы владеете." }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement(
    O5,
    {
      label: "Группа для обсуждений",
      value: z.discussion_chat_id,
      onChange: (A) => te("discussion_chat_id", A),
      options: [{ value: null, label: "Без обсуждения" }, ...y.map((A) => ({ value: Number(A.id), label: A.name }))]
    }
  )))), /* @__PURE__ */ i.createElement(Ln, { disabled: ae || G === "chat-type" && Fe }, ae ? "Сохраняем…" : "Сохранить")), ["chat-members", "chat-admins", "chat-blocked"].includes(G) && R && /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: G === "chat-admins" ? "Администраторы" : G === "chat-blocked" ? "Заблокированные" : h }, B.map((A) => /* @__PURE__ */ i.createElement("div", { className: "profile-row person-row panel-person", key: A.id }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "member-profile", onClick: () => d(A.id === It.id ? { view: "self", back: s } : { view: "peer", id: A.id, name: A.name || A.login, avatar: A.avatar, back: s }) }, /* @__PURE__ */ i.createElement(Ul, { src: A.avatar, name: A.name || A.login }), /* @__PURE__ */ i.createElement("span", null, A.name || A.login, /* @__PURE__ */ i.createElement("small", null, A.role === "owner" ? "Владелец" : A.role === "admin" ? "Администратор" : h === "Подписчики" ? "Подписчик" : "Участник"))), ze && A.id !== It.id && !A.blocked && /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action", "aria-label": "Права администратора", title: "Права администратора", onClick: () => ul(A) }, /* @__PURE__ */ i.createElement(qe, { name: "admin_panel_settings" })), me && A.id !== It.id && A.role !== "owner" && /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action", title: A.blocked ? "Разблокировать" : "Заблокировать", "aria-label": A.blocked ? "Разблокировать" : "Заблокировать", onClick: () => Ae(A) }, /* @__PURE__ */ i.createElement(qe, { name: A.blocked ? "lock_open" : "block" })))), !B.length && /* @__PURE__ */ i.createElement("p", { className: "panel-empty" }, "Список пуст"))), vt && G === "chat-members" && /* @__PURE__ */ i.createElement(Ln, { type: "button", icon: "person_add", onClick: () => d({ view: "invite", id: M, back: s }) }, Ee ? "Добавить подписчиков" : "Добавить участников")), G === "chat-admins" && R && ze && /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement(Ln, { type: "button", icon: "person_add", onClick: () => I("chat-admin-pick") }, "Назначить администратора")), G === "chat-admin-pick" && R && ze && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ml, { label: "Поиск участников", type: "search", value: el, onChange: (A) => Bl(A.target.value) }), /* @__PURE__ */ i.createElement(ct, { title: "Шаг 1 из 3 · Выберите участника" }, tl.map((A) => /* @__PURE__ */ i.createElement("button", { className: "profile-row person-row panel-person", type: "button", key: A.id, onClick: () => ul(A) }, /* @__PURE__ */ i.createElement(Ul, { src: A.avatar, name: A.name || A.login }), /* @__PURE__ */ i.createElement("span", null, A.name || A.login, /* @__PURE__ */ i.createElement("small", null, A.role === "admin" ? "Администратор" : h === "Подписчики" ? "Подписчик" : "Участник")), /* @__PURE__ */ i.createElement(qe, { name: "chevron_right" }))), !tl.length && /* @__PURE__ */ i.createElement("p", { className: "panel-empty" }, "Участники не найдены"))), G === "chat-admin-rights" && Pe && ze && /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement("div", { className: "access-card" }, /* @__PURE__ */ i.createElement("div", { className: "profile-row panel-person" }, /* @__PURE__ */ i.createElement(Ul, { src: Pe.avatar, name: Pe.name }), /* @__PURE__ */ i.createElement("strong", null, Pe.name))), /* @__PURE__ */ i.createElement(ct, { title: "Шаг 2 из 3 · Настройте права" }, kt.map(([A, Se]) => /* @__PURE__ */ i.createElement(ql, { key: A, label: Se, checked: Pe.permissions.includes(A), onChange: (He) => d({ ...s, admin: { ...Pe, permissions: He ? [...Pe.permissions, A] : Pe.permissions.filter((gl) => gl !== A) } }) })))), /* @__PURE__ */ i.createElement(Ln, { type: "button", icon: "arrow_forward", disabled: !Pe.permissions.length && !Pe.wasAdmin, onClick: () => I("chat-admin-review") }, "Далее")), G === "chat-admin-review" && Pe && ze && /* @__PURE__ */ i.createElement("form", { className: "panel-flow", onSubmit: vl }, /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement("div", { className: "access-card" }, /* @__PURE__ */ i.createElement("div", { className: "profile-row panel-person" }, /* @__PURE__ */ i.createElement(Ul, { src: Pe.avatar, name: Pe.name }), /* @__PURE__ */ i.createElement("strong", null, Pe.name))), /* @__PURE__ */ i.createElement(ct, { title: "Шаг 3 из 3 · Подтвердите изменения" }, Pe.permissions.length ? kt.filter(([A]) => Pe.permissions.includes(A)).map(([A, Se]) => /* @__PURE__ */ i.createElement(ht, { key: A, icon: "check", tone: "green", title: Se })) : /* @__PURE__ */ i.createElement("p", { className: "panel-hint" }, "Права администратора будут сняты."))), /* @__PURE__ */ i.createElement(Ln, { disabled: ae }, ae ? "Сохраняем…" : Pe.permissions.length ? "Подтвердить права" : "Снять права")), G === "chat-requests" && R && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Ожидают решения" }, Q === null && !X && /* @__PURE__ */ i.createElement(Ba, { label: "Загрузка заявок…" }), Q == null ? void 0 : Q.map((A) => /* @__PURE__ */ i.createElement("div", { key: A.id, className: "profile-row panel-person" }, /* @__PURE__ */ i.createElement(Ul, { src: A.avatar, name: A.name }), /* @__PURE__ */ i.createElement("span", null, A.name), /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action accept-request", "aria-label": "Принять", onClick: () => Ue(A, !0) }, /* @__PURE__ */ i.createElement(qe, { name: "check" })), /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action reject-request", "aria-label": "Отклонить", onClick: () => Ue(A, !1) }, /* @__PURE__ */ i.createElement(qe, { name: "close" })))), (Q == null ? void 0 : Q.length) === 0 && /* @__PURE__ */ i.createElement("p", { className: "panel-empty" }, "Новых заявок нет"))));
}
function _y() {
  const [s, d] = _.useState(null), [y, r] = _.useState(""), [T, j] = _.useState(""), [Z, V] = _.useState(""), [L, x] = _.useState(null), [O, g] = _.useState(!1), [z, D] = _.useState(!1), [K, re] = _.useState(null);
  _.useEffect(() => {
    const $ = new AbortController();
    return Te("/api/developer/apps", { signal: $.signal }).then(d).catch((ve) => {
      $.signal.aborted || V(ve.message);
    }), () => $.abort();
  }, []);
  async function X($) {
    if ($.preventDefault(), V(""), x(null), !y.trim()) {
      x({ field: "name", message: "Введите название приложения." });
      return;
    }
    D(!0);
    try {
      const ve = await Te("/api/developer/apps", { method: "POST", json: { name: y, redirect_uri: T.trim() } });
      d((ae) => [...ae ?? [], ve]), g(!1), r(""), j("");
    } catch (ve) {
      ve.field ? x(ve) : V(ve.message);
    } finally {
      D(!1);
    }
  }
  async function J($, ve) {
    D(!0), V("");
    try {
      const ae = await Te("/api/developer/apps/" + $.id, { method: "PUT", json: ve });
      d((Oe) => Oe.map((Q) => Q.id === $.id ? ae : Q)), re(null);
    } catch (ae) {
      V(ae.message);
    } finally {
      D(!1);
    }
  }
  return /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Приложения", hint: "OAuth даёт доступ к базовому профилю после согласия пользователя." }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "access-link-action", "aria-expanded": O, onClick: () => g(($) => !$) }, /* @__PURE__ */ i.createElement(qe, { name: O ? "close" : "add" }), O ? "Отмена" : "Создать приложение")), O && /* @__PURE__ */ i.createElement("form", { className: "access-card panel-fields panel-section-enter", onSubmit: X }, /* @__PURE__ */ i.createElement(ml, { label: "Название приложения", required: !0, value: y, maxLength: 80, error: (L == null ? void 0 : L.field) === "name" ? L.message : "", onChange: ($) => {
    r($.target.value), (L == null ? void 0 : L.field) === "name" && x(null);
  } }), /* @__PURE__ */ i.createElement(ml, { label: "Адрес возврата", required: !0, type: "url", value: T, formatError: "Введите полный адрес, например https://example.com/callback.", error: (L == null ? void 0 : L.field) === "redirect_uri" ? L.message : "", onChange: ($) => {
    j($.target.value), (L == null ? void 0 : L.field) === "redirect_uri" && x(null);
  } }), /* @__PURE__ */ i.createElement("button", { type: "submit", className: "access-save", disabled: z }, /* @__PURE__ */ i.createElement(qe, { name: "check" }), z ? "Создаём…" : "Создать")), !s && !Z && /* @__PURE__ */ i.createElement(Ba, null), /* @__PURE__ */ i.createElement(Pt, { message: Z }), s == null ? void 0 : s.map(($) => /* @__PURE__ */ i.createElement(ct, { title: $.name, key: $.id }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement(ml, { label: "Client ID", readOnly: !0, value: $.id }), /* @__PURE__ */ i.createElement(ml, { label: "Адрес возврата", readOnly: !0, value: $.redirect_uri })), /* @__PURE__ */ i.createElement(ql, { label: "OAuth", checked: $.enabled, disabled: z, onChange: (ve) => {
    ve ? J($, { enabled: !0 }) : re({ app: $, values: { enabled: !1 }, label: "Выключить OAuth" });
  } }), $.enabled && /* @__PURE__ */ i.createElement("button", { type: "button", className: "access-link-action renewing", onClick: () => re({ app: $, values: { revoke: !0 }, label: "Отозвать токены" }) }, /* @__PURE__ */ i.createElement(qe, { name: "lock" }), "Отозвать все токены"), (K == null ? void 0 : K.app.id) === $.id && /* @__PURE__ */ i.createElement("div", { className: "api-confirm" }, /* @__PURE__ */ i.createElement("p", null, "Выданные токены перестанут действовать. Для доступа нужно будет снова авторизоваться."), /* @__PURE__ */ i.createElement("div", { className: "panel-actions" }, /* @__PURE__ */ i.createElement("button", { type: "button", onClick: () => re(null) }, "Отмена"), /* @__PURE__ */ i.createElement("button", { type: "button", onClick: () => J($, K.values), disabled: z }, K.label))))), /* @__PURE__ */ i.createElement(ct, { title: "OAuth 2.0", hint: /* @__PURE__ */ i.createElement(i.Fragment, null, "Authorization Code с PKCE S256. Область доступа ", /* @__PURE__ */ i.createElement("code", null, "profile"), ".") }, /* @__PURE__ */ i.createElement("dl", { className: "panel-endpoints" }, /* @__PURE__ */ i.createElement("dt", null, "Согласие"), /* @__PURE__ */ i.createElement("dd", null, /* @__PURE__ */ i.createElement("code", null, "/oauth/authorize")), /* @__PURE__ */ i.createElement("dt", null, "Токен"), /* @__PURE__ */ i.createElement("dd", null, /* @__PURE__ */ i.createElement("code", null, "/oauth/token")), /* @__PURE__ */ i.createElement("dt", null, "Профиль"), /* @__PURE__ */ i.createElement("dd", null, /* @__PURE__ */ i.createElement("code", null, "/oauth/userinfo")))));
}
const Rs = [["personal", "Личные чаты"], ["group", "Группы"], ["channel", "Каналы"]];
function Bs() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}
function Ny(s) {
  const d = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=");
  return Uint8Array.from(atob(d), (y) => y.charCodeAt(0));
}
function C1(s, d) {
  return {
    kinds: Object.fromEntries(Rs.map(([y]) => [y, s["notify_" + y] !== !1])),
    previews: Object.fromEntries(Rs.map(([y]) => [y, s["preview_" + y] !== !1])),
    overrides: d
  };
}
async function wy(s, d, y) {
  if (!Bs()) throw new Error("Этот браузер не поддерживает фоновые уведомления");
  if (!s) {
    const Z = await navigator.serviceWorker.getRegistration("/"), V = await (Z == null ? void 0 : Z.pushManager.getSubscription());
    V && (await Te("/api/push/unsubscribe", { method: "POST", json: { endpoint: V.endpoint } }), await V.unsubscribe());
    return;
  }
  if (await Notification.requestPermission() !== "granted") throw new Error("Браузер не разрешил уведомления");
  const r = await Te("/api/push/vapid-key");
  if (!r.publicKey || !r.available) throw new Error("Сервер не настроен для фоновых уведомлений");
  await navigator.serviceWorker.register(Ct("/sw.js"));
  const T = await navigator.serviceWorker.ready;
  let j = await T.pushManager.getSubscription();
  j || (j = await T.pushManager.subscribe({ userVisibleOnly: !0, applicationServerKey: Ny(r.publicKey) })), await Te("/api/push/subscribe", { method: "POST", json: { ...j.toJSON(), settings: C1(d, y) } });
}
function Ty(s, d, y, r) {
  const T = _.useRef(null), j = _.useRef(null);
  _.useEffect(() => {
    if (!d.webNotifications || !window.AudioContext) return;
    function Z() {
      try {
        j.current || (j.current = new AudioContext()), j.current.resume().catch(() => {
        });
      } catch {
      }
    }
    return document.addEventListener("pointerdown", Z, { once: !0 }), () => document.removeEventListener("pointerdown", Z);
  }, [d.webNotifications]), _.useEffect(() => {
    if (!d.backgroundNotifications || !Bs()) return;
    let Z = !0;
    return navigator.serviceWorker.getRegistration("/").then((V) => V == null ? void 0 : V.pushManager.getSubscription()).then((V) => {
      if (Z && V) return Te("/api/push/subscribe", { method: "POST", json: { ...V.toJSON(), settings: C1(d, y) } });
    }).catch(() => {
    }), () => {
      Z = !1;
    };
  }, [d, y]), _.useEffect(() => {
    var V, L, x;
    if (!Object.keys(s).length) return;
    const Z = T.current;
    if (T.current = s, !(!Z || !d.webNotifications))
      for (const [O, g] of Object.entries(s)) {
        const z = g.target_user_id ? "personal" : g.chat_type === "channel" ? "channel" : "group";
        if (!g.unread || !g.last_sent_at || (((V = Z[O]) == null ? void 0 : V.last_sent_at) || "") >= g.last_sent_at || g.last_status != null || y[O] === !1 || y[O] !== !0 && d["notify_" + z] === !1 || !document.hidden && O === r) continue;
        const D = Number(d.notificationVolume ?? 5) / 10;
        if (D > 0 && ((L = j.current) == null ? void 0 : L.state) === "running") {
          const K = j.current, re = K.createOscillator(), X = K.createGain();
          re.frequency.value = 620, X.gain.setValueAtTime(D * 0.075, K.currentTime), X.gain.exponentialRampToValueAtTime(1e-3, K.currentTime + 0.17), re.connect(X).connect(K.destination), re.start(), re.stop(K.currentTime + 0.18);
        }
        if (document.hidden && !d.backgroundNotifications && ((x = globalThis.Notification) == null ? void 0 : x.permission) === "granted")
          try {
            const K = new Notification(g.name, { body: d["preview_" + z] === !1 ? "Новое сообщение" : g.last_msg, tag: "tornado-chat-" + O });
            K.onclick = () => {
              window.focus(), location.assign(Ct("/chat?chat=" + encodeURIComponent(O)));
            };
          } catch {
          }
      }
  }, [s, d, y, r]);
}
function zy({ preferences: s, changePreference: d, notifications: y }) {
  const [r, T] = _.useState(null), [j, Z] = _.useState(""), [V, L] = _.useState(!1), x = "Notification" in window;
  _.useEffect(() => {
    if (!Bs()) {
      T(!1);
      return;
    }
    const D = new AbortController();
    return Te("/api/push/vapid-key", { signal: D.signal }).then((K) => {
      D.signal.aborted || T(!!(K.publicKey && K.available));
    }).catch(() => {
      D.signal.aborted || T(!1);
    }), () => D.abort();
  }, []);
  async function O(D) {
    if (Z(""), !D) {
      d("webNotifications", !1);
      return;
    }
    try {
      if (await Notification.requestPermission() !== "granted") throw new Error("Разрешите уведомления в настройках сайта.");
      d("webNotifications", !0);
    } catch (K) {
      Z(K.message);
    }
  }
  async function g(D) {
    L(!0), Z("");
    try {
      await wy(D, s, y), d("backgroundNotifications", D);
    } catch (K) {
      Z(K.message);
    } finally {
      L(!1);
    }
  }
  const z = s.notificationVolume ?? 5;
  return /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Веб-уведомления", options: !0 }, /* @__PURE__ */ i.createElement(ql, { label: "Уведомления в браузере", detail: x ? void 0 : "Браузер не поддерживает уведомления", disabled: !x, checked: !!s.webNotifications, onChange: O }), /* @__PURE__ */ i.createElement(ql, { label: "Уведомления в фоне", detail: r === null ? "Проверяем доступность…" : r ? "При закрытой вкладке" : "Сервис фоновых уведомлений недоступен", disabled: V || !r && !s.backgroundNotifications, checked: !!s.backgroundNotifications, onChange: g }), /* @__PURE__ */ i.createElement("label", { className: "setting-slider panel-range" }, /* @__PURE__ */ i.createElement("span", null, "Громкость звука ", /* @__PURE__ */ i.createElement("b", null, z)), /* @__PURE__ */ i.createElement("input", { type: "range", min: "0", max: "10", value: z, style: { "--range-fill": z * 10 + "%" }, onChange: (D) => d("notificationVolume", Number(D.target.value)) })), /* @__PURE__ */ i.createElement(Pt, { message: j })), Rs.map(([D, K]) => /* @__PURE__ */ i.createElement(ct, { key: D, title: K }, /* @__PURE__ */ i.createElement(ql, { label: "Уведомления", checked: s["notify_" + D] !== !1, onChange: (re) => d("notify_" + D, re) }), /* @__PURE__ */ i.createElement(ql, { label: "Предпросмотр сообщений", detail: "Показывать текст в уведомлении", checked: s["preview_" + D] !== !1, onChange: (re) => d("preview_" + D, re) }))));
}
function Cy({ profile: s, setProfile: d, blocked: y, onUpdated: r }) {
  const [T, j] = _.useState(""), [Z, V] = _.useState(!1), [L, x] = _.useState(!1);
  async function O(g, z) {
    V(!0), j("");
    try {
      const D = await Te("/api/user/privacy", { method: "PUT", json: { [g]: z } });
      d((K) => ({ ...K, ...D }));
    } catch (D) {
      j(D.message);
    } finally {
      V(!1);
    }
  }
  return /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Блокировки" }, /* @__PURE__ */ i.createElement(ht, { icon: "person_off", tone: "coral", title: "Чёрный список", detail: y.length, expanded: L, onClick: () => x((g) => !g) }, /* @__PURE__ */ i.createElement(qe, { name: L ? "expand_more" : "chevron_right" })), /* @__PURE__ */ i.createElement("div", { className: "settings-expander" + (L ? " expanded" : ""), inert: !L }, /* @__PURE__ */ i.createElement("div", null, y.length ? y.map((g) => /* @__PURE__ */ i.createElement("div", { key: g.id, className: "profile-row panel-person" }, /* @__PURE__ */ i.createElement(Ul, { src: g.avatar, name: g.name }), /* @__PURE__ */ i.createElement("span", null, g.name), /* @__PURE__ */ i.createElement("button", { className: "panel-value", type: "button", onClick: async () => {
    try {
      await Te("/api/chats/" + g.id + "/unblock/" + g.target_user_id, { method: "POST" }), await r();
    } catch (z) {
      j(z.message);
    }
  } }, "Разблокировать"))) : /* @__PURE__ */ i.createElement("p", { className: "panel-hint" }, "Список пуст")))), /* @__PURE__ */ i.createElement(ct, { title: "Кто видит данные профиля" }, /* @__PURE__ */ i.createElement(ql, { label: "Последний визит и статус «в сети»", detail: s.show_last_seen === !1 ? "Только я" : "Все в Tornado", checked: s.show_last_seen !== !1, disabled: Z, onChange: (g) => O("show_last_seen", g) }), /* @__PURE__ */ i.createElement(ql, { label: "О себе", detail: s.show_bio === !1 ? "Только я" : "Все в Tornado", checked: s.show_bio !== !1, disabled: Z, onChange: (g) => O("show_bio", g) })), /* @__PURE__ */ i.createElement(Pt, { message: T }));
}
const mm = {
  "new-chat": "Новое сообщение",
  "new-group": "Добавить участников",
  "new-channel": "Создать канал",
  invite: "Добавить участников",
  self: "Мой профиль",
  edit: "Изменить профиль",
  peer: "Информация",
  chat: "О чате",
  "chat-edit": "Изменить",
  "chat-type": "Тип чата",
  "chat-discussion": "Обсуждение",
  "chat-reactions": "Реакции",
  "chat-members": "Участники",
  "chat-admin-pick": "Выбрать администратора",
  "chat-admin-rights": "Права администратора",
  "chat-admin-review": "Проверить права",
  "chat-admins": "Администраторы",
  "chat-blocked": "Чёрный список",
  "chat-requests": "Заявки на вступление",
  settings: "Настройки",
  developer: "API-кабинет",
  display: "Отображение",
  privacy: "Конфиденциальность",
  shortcuts: "Набор сообщений",
  notifications: "Уведомления",
  logout: "Выход из аккаунта",
  qr: "QR-код",
  join: "Вступить в канал"
}, My = ["new-chat", "new-group", "new-channel", "invite"];
function Ay(s) {
  const [d, ...y] = (s.name || "").trim().split(/\s+/);
  return { first: d, last: y.join(" "), bio: s.bio || "", login: s.login };
}
function Oy({ page: s, setPage: d, profile: y, setProfile: r, onOpenChat: T, onUpdated: j, groups: Z, notifications: V, notificationEnabled: L, onToggleNotifications: x, preferences: O, changePreference: g, blocked: z }) {
  const [D, K] = _.useState(null), [re, X] = _.useState(""), [J, $] = _.useState(null), [ve, ae] = _.useState(!1), [Oe, Q] = _.useState(null), k = s == null ? void 0 : s.view;
  if (_.useEffect(() => {
    if (X(""), $(null), k !== "peer") return;
    const me = new AbortController(), h = "/api/user/" + s.id;
    return Q(wi(h) ?? null), Dc(h, me.signal).then((B) => {
      me.signal.aborted || Q(B);
    }).catch((B) => {
      me.signal.aborted || X(B.message);
    }), () => me.abort();
  }, [k, s == null ? void 0 : s.id]), _.useEffect(() => {
    if (k !== "join" || !(s != null && s.alias) || s.id) return;
    const me = new AbortController();
    return Dc("/api/chats/by-alias/" + encodeURIComponent(s.alias), me.signal).then((h) => {
      me.signal.aborted || d({ ...s, ...h });
    }).catch((h) => {
      me.signal.aborted || X(h.message);
    }), () => me.abort();
  }, [k, s == null ? void 0 : s.alias, s == null ? void 0 : s.id, d]), !s) return null;
  const ge = py.includes(k), it = My.includes(k), Fe = k === "edit", Ve = k === "self" || k === "settings", he = Ve ? y : k === "peer" ? Oe : null, rt = Ve || k === "peer", Et = () => d({ view: "qr", id: Ve ? y.id : s.id, name: he == null ? void 0 : he.login, handle: (he == null ? void 0 : he.handle) || (he == null ? void 0 : he.login), back: s }), Ze = Ct(s.qrUrl || "/api/user/" + s.id + "/qr"), M = s.back || (k === "new-group" && s.step === 2 ? { ...s, step: 1 } : ["notifications", "logout", "display", "shortcuts", "privacy", "developer"].includes(k) ? { view: "settings" } : ge && k !== "chat" ? { ...s, view: ["chat-type", "chat-discussion", "chat-reactions", "chat-admins", "chat-blocked", "chat-requests"].includes(k) ? "chat-edit" : "chat" } : null), G = k === "new-group" && s.step === 2 ? "Создать группу" : s.kind === "channel" ? { chat: "О канале", "chat-type": "Тип канала", "chat-members": "Подписчики" }[k] || mm[k] : k === "chat" ? "О группе" : mm[k];
  function R(me, h) {
    K((I) => ({ ...I, [me]: h }));
    const B = ["first", "last"].includes(me) ? "fio" : me;
    $((I) => (I == null ? void 0 : I.field) === B ? null : I);
  }
  function Ee() {
    K(Ay(y)), d({ view: "edit", back: s });
  }
  async function ze(me) {
    if (me.preventDefault(), X(""), $(null), !D.first.trim()) {
      $({ field: "fio", message: "Введите имя." });
      return;
    }
    ae(!0);
    try {
      const h = await Te("/api/user/profile", { method: "POST", json: { fio: [D.first, D.last].map((B) => B.trim()).filter(Boolean).join(" "), login: D.login.trim(), bio: D.bio, ...D.avatar ? { avatar: D.avatar } : {} } });
      r({ ...y, name: h.fio, login: h.login, handle: h.handle, bio: h.bio, avatar: h.avatar }), d(M || { view: "self" });
    } catch (h) {
      h.field ? $(h) : X(h.message);
    } finally {
      ae(!1);
    }
  }
  function wt(me) {
    if (me.size > 10 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(me.type)) {
      $({ field: "avatar", message: "Выберите фото JPG, PNG, WebP или GIF размером до 10 МБ." });
      return;
    }
    const h = new FileReader();
    h.addEventListener("load", () => R("avatar", h.result)), h.readAsDataURL(me);
  }
  async function vt() {
    ae(!0), X("");
    try {
      (await Te("/api/chats/join", { method: "POST", json: { chat_id: Number(s.id), token: s.token } })).pending ? d({ ...s, pending: !0 }) : await T(s.id, !0);
    } catch (me) {
      X(me.message);
    } finally {
      ae(!1);
    }
  }
  return /* @__PURE__ */ i.createElement("section", { className: "profile-sheet" + (Fe || it || ge && k !== "chat" ? " is-profile-form" : "") + (Fe ? " profile-edit-sheet" : ""), "aria-label": G }, /* @__PURE__ */ i.createElement("header", { className: "profile-sheet-header" }, /* @__PURE__ */ i.createElement("button", { className: "header-action", type: "button", "aria-label": M ? "Назад" : "Закрыть", onClick: () => d(M) }, /* @__PURE__ */ i.createElement(qe, { name: M ? "arrow_back" : "close" })), /* @__PURE__ */ i.createElement("strong", null, G), rt && he && /* @__PURE__ */ i.createElement("button", { className: "header-action profile-qr-action", type: "button", "aria-label": "Открыть QR-код", title: "QR-код", onClick: Et }, /* @__PURE__ */ i.createElement(qe, { name: "qr_code_2" })), Ve && /* @__PURE__ */ i.createElement("button", { className: "header-action", type: "button", "aria-label": "Изменить профиль", onClick: Ee }, /* @__PURE__ */ i.createElement(qe, { name: "edit" })), k === "chat" && (s.owner || s.manage) && /* @__PURE__ */ i.createElement("button", { className: "header-action", type: "button", "aria-label": "Изменить чат", onClick: () => d({ ...s, view: "chat-edit", back: s }) }, /* @__PURE__ */ i.createElement(qe, { name: "edit" }))), /* @__PURE__ */ i.createElement("div", { key: k + ":" + (s.id || ""), className: "profile-sheet-scroll" + (Fe ? "" : " panel-section-enter") }, k === "peer" && !he && !re && /* @__PURE__ */ i.createElement(Ba, null), rt && (he || k !== "peer") && /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { className: "profile-cover" + (Ve ? " own-profile-cover" : " chat-detail-cover") + (k === "settings" ? " settings-cover" : "") }, /* @__PURE__ */ i.createElement(Ul, { name: (he == null ? void 0 : he.name) || (he == null ? void 0 : he.fio) || s.name || (he == null ? void 0 : he.login), src: (he == null ? void 0 : he.avatar) || s.avatar }), /* @__PURE__ */ i.createElement("strong", null, (he == null ? void 0 : he.name) || (he == null ? void 0 : he.fio) || s.name || (he == null ? void 0 : he.login)), /* @__PURE__ */ i.createElement("small", null, Ve ? "в сети" : ym(Oe))), he && k !== "settings" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Данные профиля" }, /* @__PURE__ */ i.createElement(ht, { icon: "alternate_email", tone: "blue", title: "@" + (he.handle || he.login), detail: "Имя пользователя", onClick: Et }, /* @__PURE__ */ i.createElement("span", { className: "profile-qr-chip", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement(qe, { name: "qr_code_2" }))), he.bio && /* @__PURE__ */ i.createElement(ht, { icon: "info", title: he.bio, detail: "О себе" }), k === "peer" && s.chatId && /* @__PURE__ */ i.createElement(ht, { icon: "notifications", tone: "coral", title: "Уведомления", onClick: () => x(s.chatId) }, /* @__PURE__ */ i.createElement("span", { className: "panel-switch" + (L(s.chatId) ? " enabled" : "") })), k === "peer" && /* @__PURE__ */ i.createElement(ht, { icon: "chat_bubble", tone: "green", title: "Написать сообщение", onClick: async () => {
    try {
      const me = await Te("/api/chats/get_or_create", { method: "POST", json: { target_user_id: Number(s.id) } });
      await T(me.chat_id);
    } catch (me) {
      X(me.message);
    }
  } })), Ve && /* @__PURE__ */ i.createElement(ct, { title: "Для разработчиков" }, /* @__PURE__ */ i.createElement(ht, { icon: "code", tone: "green", title: "API-кабинет", detail: "Приложения, OAuth и токены", onClick: () => d({ view: "developer", back: s }) }))), k === "peer" && /* @__PURE__ */ i.createElement(z1, { chatId: s.chatId })), /* @__PURE__ */ i.createElement(Pt, { message: re }), it && /* @__PURE__ */ i.createElement(q5, { page: s, setPage: d, onDone: T }), Fe && D && /* @__PURE__ */ i.createElement("form", { className: "profile-editor panel-flow", onSubmit: ze }, /* @__PURE__ */ i.createElement(qs, { avatar: D.avatar || y.avatar, onChange: wt }), /* @__PURE__ */ i.createElement(Pt, { message: (J == null ? void 0 : J.field) === "avatar" ? J.message : "" }), /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Личные данные", hint: "Описание видно тем, кто открывает ваш профиль." }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement(ml, { label: "Имя (обязательно)", required: !0, maxLength: 100, error: (J == null ? void 0 : J.field) === "fio" ? J.message : "", value: D.first, onChange: (me) => R("first", me.target.value) }), /* @__PURE__ */ i.createElement(ml, { label: "Фамилия", maxLength: 100, value: D.last, onChange: (me) => R("last", me.target.value) }), /* @__PURE__ */ i.createElement(ml, { label: "О себе", multiline: !0, maxLength: 200, rows: 2, error: (J == null ? void 0 : J.field) === "bio" ? J.message : "", value: D.bio, onChange: (me) => R("bio", me.target.value) }))), /* @__PURE__ */ i.createElement(ct, { title: "Публичный профиль", hint: "Это имя используется в поиске и для входа в Tornado." }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement(ml, { label: "Имя пользователя", required: !0, pattern: "[A-Za-z0-9_]{3,50}", autoCapitalize: "none", spellCheck: !1, formatError: "Введите от 3 до 50 символов. Подойдут латинские буквы, цифры и подчёркивания.", error: (J == null ? void 0 : J.field) === "login" ? J.message : "", value: D.login, maxLength: 50, onChange: (me) => R("login", me.target.value) })))), /* @__PURE__ */ i.createElement(Ln, { disabled: ve }, ve ? "Сохраняем…" : "Сохранить")), ge && /* @__PURE__ */ i.createElement(Sy, { page: s, setPage: d, groups: Z, onOpenChat: T, onUpdated: j, notifications: L(s.id), onToggleNotifications: () => x(s.id) }), k === "settings" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Аккаунт" }, /* @__PURE__ */ i.createElement(ht, { icon: "account_circle", tone: "blue", title: "Аккаунт", detail: "Имя, аватар и описание", onClick: Ee }), /* @__PURE__ */ i.createElement(ht, { icon: "code", tone: "green", title: "API-кабинет", detail: "Приложения, OAuth и токены", onClick: () => d({ view: "developer", back: s }) })), /* @__PURE__ */ i.createElement(ct, { title: "Приложение" }, /* @__PURE__ */ i.createElement(ht, { icon: "notifications", tone: "coral", title: "Уведомления", detail: "Звук, предпросмотр и фоновые уведомления", onClick: () => d({ view: "notifications" }) }), /* @__PURE__ */ i.createElement(ht, { icon: "privacy_tip", tone: "green", title: "Конфиденциальность", detail: "Статус, описание и чёрный список", onClick: () => d({ view: "privacy" }) }), /* @__PURE__ */ i.createElement(ht, { icon: "view_compact_alt", tone: "green", title: "Отображение", detail: "Плотность, анимации и превью", onClick: () => d({ view: "display" }) }), /* @__PURE__ */ i.createElement(ht, { icon: "keyboard", title: "Набор сообщений", detail: "Поведение клавиши Enter", onClick: () => d({ view: "shortcuts" }) })), /* @__PURE__ */ i.createElement("div", { className: "access-card" }, /* @__PURE__ */ i.createElement(ht, { icon: "logout", tone: "coral", title: "Выйти из аккаунта", onClick: () => d({ view: "logout" }) }))), k === "display" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Список чатов" }, /* @__PURE__ */ i.createElement(ql, { label: "Компактный список", detail: "Уменьшить высоту строк чатов", checked: !!O.compact, onChange: (me) => g("compact", me) }), /* @__PURE__ */ i.createElement(ql, { label: "Текст последнего сообщения", checked: O.previews !== !1, onChange: (me) => g("previews", me) })), /* @__PURE__ */ i.createElement(ct, { title: "Переходы" }, /* @__PURE__ */ i.createElement(ql, { label: "Анимации интерфейса", checked: O.motion !== !1, onChange: (me) => g("motion", me) }))), k === "shortcuts" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Отправка сообщений", hint: "Shift+Enter добавляет новую строку. Ctrl+Enter или ⌘+Enter отправляют сообщение в любом режиме." }, /* @__PURE__ */ i.createElement(ql, { label: "Отправлять по Enter", checked: O.enterToSend !== !1, onChange: (me) => g("enterToSend", me) }))), k === "developer" && /* @__PURE__ */ i.createElement(_y, null), k === "notifications" && /* @__PURE__ */ i.createElement(zy, { preferences: O, changePreference: g, notifications: V }), k === "privacy" && /* @__PURE__ */ i.createElement(Cy, { profile: y, setProfile: r, blocked: z, onUpdated: j }), k === "logout" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Сеанс Tornado", hint: "Для возвращения к чатам потребуется снова войти." }, /* @__PURE__ */ i.createElement("a", { className: "access-link-action renewing", href: Ct("/logout") }, /* @__PURE__ */ i.createElement(qe, { name: "logout" }), "Выйти из аккаунта"))), k === "qr" && /* @__PURE__ */ i.createElement("div", { className: "qr-view qr-enter" }, /* @__PURE__ */ i.createElement("div", { className: "qr-card" }, /* @__PURE__ */ i.createElement("img", { src: Ze, alt: "QR-код" }), /* @__PURE__ */ i.createElement("strong", null, "@", s.handle)), /* @__PURE__ */ i.createElement("a", { className: "qr-profile-link", href: Ct("/t/" + encodeURIComponent(s.handle)) }, location.host, Ct("/t/" + s.handle)), /* @__PURE__ */ i.createElement("button", { type: "button", onClick: async () => {
    try {
      const me = fetch(Ze).then((h) => {
        if (!h.ok) throw new Error();
        return h.blob();
      });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": me })]);
    } catch {
      X("Не удалось скопировать изображение.");
    }
  } }, /* @__PURE__ */ i.createElement(qe, { name: "content_copy" }), "Копировать QR-код"), /* @__PURE__ */ i.createElement("a", { href: Ze, download: "tornado-qr.png" }, /* @__PURE__ */ i.createElement(qe, { name: "download" }), "Скачать QR-код")), k === "join" && /* @__PURE__ */ i.createElement("div", { className: "access-settings" }, /* @__PURE__ */ i.createElement(ct, { title: "Приглашение" }, /* @__PURE__ */ i.createElement("div", { className: "panel-fields" }, /* @__PURE__ */ i.createElement("strong", null, s.name || "Вступить в чат Tornado"), s.pending ? /* @__PURE__ */ i.createElement("p", { className: "access-hint" }, "Заявка отправлена владельцу.") : /* @__PURE__ */ i.createElement("button", { className: "access-save", type: "button", disabled: ve || !s.id, onClick: vt }, /* @__PURE__ */ i.createElement(qe, { name: "person_add" }), ve ? "Вступаем…" : "Вступить"))))));
}
const Dy = [["all", "Чаты"], ["channels", "Каналы"], ["bots", "Боты"], ["posts", "Посты"], ["media", "Медиа"], ["links", "Ссылки"], ["messages", "Сообщения"]], hm = { users: [], channels: [], messages: [], next_cursor: null };
function xy({ open: s, query: d, tab: y, setTab: r, recent: T, clearRecent: j, records: Z, openPerson: V, openChat: L, openResult: x, openChannel: O }) {
  const [g, z] = _.useState([]), [D, K] = _.useState(hm), [re, X] = _.useState(!1), [J, $] = _.useState(""), ve = d.trim();
  _.useEffect(() => {
    if (!s) return;
    const Q = new AbortController();
    return Dc("/api/users/search", Q.signal).then((k) => {
      Q.signal.aborted || z(k);
    }).catch(() => {
    }), () => Q.abort();
  }, [s]), _.useEffect(() => {
    if (!s || (K(hm), $(""), X(ve.length >= 2), ve.length < 2)) return;
    const Q = new AbortController(), k = setTimeout(() => {
      Dc("/api/search?" + new URLSearchParams({ q: ve, kind: y }), Q.signal).then((ge) => {
        Q.signal.aborted || K(ge);
      }).catch((ge) => {
        Q.signal.aborted || $(ge.message);
      }).finally(() => {
        Q.signal.aborted || X(!1);
      });
    }, 320);
    return () => {
      clearTimeout(k), Q.abort();
    };
  }, [s, ve, y]);
  async function ae() {
    X(!0), $("");
    try {
      const Q = await Te("/api/search?" + new URLSearchParams({ q: ve, kind: y, cursor: D.next_cursor }));
      K((k) => k === D ? { ...k, messages: [...k.messages, ...Q.messages], next_cursor: Q.next_cursor } : k);
    } catch (Q) {
      $(Q.message);
    } finally {
      X(!1);
    }
  }
  const Oe = ve.length >= 2 && y === "all" ? Object.entries(Z).filter(([, Q]) => {
    var k;
    return (k = Q.name) == null ? void 0 : k.toLocaleLowerCase("ru").includes(ve.toLocaleLowerCase("ru"));
  }).slice(0, 8) : [];
  return /* @__PURE__ */ i.createElement("div", { className: "global-search" + (s ? " searching" : ""), inert: !s, "aria-hidden": !s || void 0 }, /* @__PURE__ */ i.createElement("nav", { className: "panel-tabs search-tabs", "aria-label": "Категории поиска" }, Dy.map(([Q, k]) => /* @__PURE__ */ i.createElement("button", { key: Q, type: "button", "aria-pressed": y === Q, onClick: () => r(Q) }, k))), /* @__PURE__ */ i.createElement("div", { className: "global-search-results" }, !ve && /* @__PURE__ */ i.createElement(i.Fragment, null, g.length > 0 && /* @__PURE__ */ i.createElement("div", { className: "search-contacts" }, g.map((Q) => /* @__PURE__ */ i.createElement("button", { key: Q.id, type: "button", onClick: () => V(Q) }, /* @__PURE__ */ i.createElement(Ul, { src: Q.avatar, name: Q.fio || Q.login }), /* @__PURE__ */ i.createElement("span", null, Q.fio || Q.login)))), !!T.filter((Q) => Z[Q]).length && /* @__PURE__ */ i.createElement("section", { className: "search-result-card" }, /* @__PURE__ */ i.createElement("header", null, "Недавние", /* @__PURE__ */ i.createElement("button", { className: "header-action", type: "button", "aria-label": "Очистить недавние", onClick: j }, /* @__PURE__ */ i.createElement(qe, { name: "close" }))), T.filter((Q) => Z[Q]).map((Q) => /* @__PURE__ */ i.createElement(Ni, { key: Q, avatar: Z[Q].avatar, title: Z[Q].name, detail: Z[Q].last_msg, onClick: () => L(Q) })))), Oe.length > 0 && /* @__PURE__ */ i.createElement("section", { className: "search-result-card" }, /* @__PURE__ */ i.createElement("header", null, "Ваши чаты"), Oe.map(([Q, k]) => /* @__PURE__ */ i.createElement(Ni, { key: Q, avatar: k.avatar, title: k.name, detail: k.last_msg, onClick: () => L(Q) }))), (D.users.length > 0 || D.channels.length > 0) && /* @__PURE__ */ i.createElement("section", { className: "search-result-card" }, /* @__PURE__ */ i.createElement("header", null, "Глобальный поиск"), D.users.map((Q) => /* @__PURE__ */ i.createElement(Ni, { key: "user" + Q.id, avatar: Q.avatar, title: Q.fio || Q.login, detail: "@" + Q.login, onClick: () => V(Q) })), D.channels.map((Q) => /* @__PURE__ */ i.createElement(Ni, { key: "channel" + Q.id, avatar: Q.avatar, title: Q.name, detail: Q.description || "Публичный канал", onClick: () => O(Q) }))), D.messages.length > 0 && /* @__PURE__ */ i.createElement("section", { className: "search-result-card" }, /* @__PURE__ */ i.createElement("header", null, "Сообщения"), D.messages.map((Q) => {
    const k = Z[Q.chat_id];
    return /* @__PURE__ */ i.createElement(Ni, { key: Q.id, avatar: (k == null ? void 0 : k.avatar) || Q.avatar, title: (k == null ? void 0 : k.name) || Q.name || Q.author, detail: Q.text, time: Hs.format(new Date(Q.at)), onClick: () => x(Q) });
  })), D.next_cursor && /* @__PURE__ */ i.createElement("button", { type: "button", className: "search-more", onClick: ae, disabled: re }, "Искать дальше"), /* @__PURE__ */ i.createElement(Pt, { message: J }), ve.length >= 2 && !J && !re && !Oe.length && !D.users.length && !D.channels.length && !D.messages.length && !D.next_cursor && /* @__PURE__ */ i.createElement("p", { className: "panel-empty" }, "Ничего не найдено"), re && /* @__PURE__ */ i.createElement(Ba, null)));
}
function Ni({ avatar: s, title: d, detail: y, time: r, onClick: T }) {
  return /* @__PURE__ */ i.createElement("button", { type: "button", className: "profile-row search-result", onClick: T }, /* @__PURE__ */ i.createElement(Ul, { src: s, name: d }), /* @__PURE__ */ i.createElement("span", { className: "search-result-text" }, d, /* @__PURE__ */ i.createElement("small", null, y)), r && /* @__PURE__ */ i.createElement("time", null, r));
}
const Ry = ["Архив", "Сохранённые чаты", "", 0, "/static/icons/archive.png"];
function mn(s, d) {
  const y = "tornado:" + It.id + ":" + s, [r, T] = _.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(y)) ?? d;
    } catch {
      return d;
    }
  });
  return _.useEffect(() => {
    try {
      localStorage.setItem(y, JSON.stringify(r));
    } catch {
    }
  }, [y, r]), [r, T];
}
function Os({ icon: s, label: d, onClick: y, expanded: r }) {
  return /* @__PURE__ */ i.createElement("button", { type: "button", className: "header-action", "aria-label": d, "aria-expanded": r, title: d, onClick: y }, /* @__PURE__ */ i.createElement(Hl, { name: s === "phone" ? "telephone" : s }));
}
const Oc = new URLSearchParams(location.search), Ds = Oc.get("chat"), qa = (s) => /^\d+$/.test(Oc.get(s) || "") ? Number(Oc.get(s)) : null;
function Uy() {
  return Oc.get("channel") ? { view: "join", alias: Oc.get("channel") } : qa("join") ? { view: "join", id: qa("join"), token: Oc.get("invite") } : qa("peer") ? qa("peer") === It.id ? { view: "self" } : { view: "peer", id: qa("peer") } : null;
}
function Hy() {
  var We;
  const [s, d] = _.useState(!0), [y, r] = _.useState(""), [T, j] = _.useState(/^\d+$/.test(Ds ?? "") ? Ds : null), [Z, V] = _.useState(null), L = _.useRef(null), [x, O] = mn("archive", []), [g, z] = _.useState(It), [D, K] = mn("interface-settings", { enterToSend: !0, compact: !1, previews: !0, motion: !0 });
  function re(f, U) {
    K((ie) => ({ ...ie, [f]: U }));
  }
  const [X, J] = _.useState(Uy), [$, ve] = _.useState(!1), [ae, Oe] = _.useState("all"), [Q, k] = mn("recent", []), [ge, it] = _.useState(() => qa("chat") && qa("message") ? { chatId: Ds, id: qa("message") } : null), [Fe, Ve] = _.useState(null), he = _.useRef(null);
  function rt() {
    var f;
    ve(!1), r(""), (f = he.current) == null || f.blur();
  }
  _.useEffect(() => {
    if (!$) return;
    function f(U) {
      U.key === "Escape" && !document.querySelector("dialog[open],.context-popover:not(.closing)") && rt();
    }
    return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
  }, [$]);
  const [Et, Ze] = _.useState(null);
  _.useEffect(() => {
    if (!X) return;
    function f(U) {
      U.key === "Escape" && !document.querySelector("dialog[open],.context-popover:not(.closing)") && J(null);
    }
    return window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f);
  }, [X]), _.useLayoutEffect(() => {
    if (X) {
      Ze(X);
      return;
    }
    const f = setTimeout(() => Ze(null), 240);
    return () => clearTimeout(f);
  }, [X]);
  const [M, G] = _.useState({}), [R, Ee] = _.useState(!1), [ze, wt] = _.useState(0), vt = _.useRef(0), [me, h] = _.useState({}), [B, I] = _.useState(!1), [te, Ce] = _.useState(""), [Ue, Ae] = mn("hidden", []);
  async function ne() {
    const f = ++vt.current;
    try {
      const U = {};
      let ie = 0;
      for (; ; ) {
        const ee = await Te("/api/chats?limit=50&offset=" + ie, { cache: "no-store" });
        if (Object.assign(U, ee.items), !ee.has_more || !Object.keys(ee.items ?? {}).length) break;
        ie += 50;
      }
      return f !== vt.current || (G(U), Ce(""), I(!0)), U;
    } catch (U) {
      f === vt.current && Ce(U.message);
    }
  }
  _.useEffect(() => {
    const f = H5({
      onStatus: Ee,
      onChange: () => {
        ne(), wt((ee) => ee + 1);
      }
    });
    ne();
    const U = () => Te("/api/user/update_status", { method: "POST" }).catch(() => {
    });
    U();
    const ie = setInterval(U, 3e4);
    return () => {
      f(), clearInterval(ie);
    };
  }, []);
  const fe = Object.entries(M).sort(([, f], [, U]) => String(U.last_sent_at ?? "").localeCompare(String(f.last_sent_at ?? ""))).map(([f, U]) => [
    f,
    U.last_msg,
    U.last_sent_at ? Hs.format(new Date(U.last_sent_at)) : U.last_time,
    U.unread,
    U.avatar,
    U
  ]), Mt = [Ry, ...fe], il = (f) => {
    var U;
    return ((U = M[f]) == null ? void 0 : U.name) ?? f;
  }, [hl, at] = _.useState(!1), [De, ke] = _.useState(null), [Tt, Ht] = _.useState([]), [At, el] = _.useState(null), [Bl, Pe] = _.useState([]), kt = _.useRef(/* @__PURE__ */ new Map());
  _.useEffect(() => () => {
    for (const f of kt.current.values()) clearTimeout(f);
  }, []);
  const [ul, vl] = mn("pinned", []), [tl, Qt] = mn("folder", []), [Nl, Ll] = mn("unread", {}), [le, _e] = mn("notifications", {});
  Ty(M, D, le, T);
  const A = (f, U) => f((ie) => ie.includes(U) ? ie.filter((ee) => ee !== U) : [...ie, U]), [Se, He] = _.useState(null), gl = _.useRef(null);
  _.useEffect(() => () => clearTimeout(gl.current), []);
  function Wl(f) {
    f !== Ti && (clearTimeout(gl.current), He({ text: f }), gl.current = setTimeout(() => He(null), 3200));
  }
  function St(f) {
    const U = M[f], ie = U != null && U.target_user_id ? "personal" : (U == null ? void 0 : U.chat_type) === "channel" ? "channel" : "group";
    return le[f] ?? D["notify_" + ie] !== !1;
  }
  function Ea(f) {
    _e((U) => ({ ...U, [f]: !St(f) }));
  }
  function kl(f, U) {
    if (f === "Архив") {
      at(!0);
      return;
    }
    at(U), j(f), f && (Ll((ie) => {
      const ee = { ...ie };
      return delete ee[f], ee;
    }), k((ie) => [f, ...ie.filter((ee) => ee !== f)].slice(0, 8)));
  }
  function pa(f, U) {
    const ie = kt.current.get(f);
    ie && (clearTimeout(ie), kt.current.delete(f), Pe((ee) => ee.filter((se) => se.name !== f)), U && (matchMedia("(prefers-reduced-motion: reduce)").matches || (ua(), al.current.add(f)), Ht((ee) => ee.filter((se) => se.name !== f))));
  }
  function Xt(f) {
    var ie;
    const U = gn(f);
    return U === "channel" && Number((ie = M[f]) == null ? void 0 : ie.owner_id) === It.id ? "owned-channel" : U;
  }
  function wl(f, U) {
    const ie = Xt(f);
    el(null), Ht((ee) => [...ee, { name: f, forBoth: U }]), Pe((ee) => [...ee, { name: f, kind: ie }]), kt.current.set(f, setTimeout(async () => {
      pa(f, !1);
      try {
        ie === "chat" || ie === "owned-channel" ? (await Te("/api/chats/" + f + "?scope=" + (U ? "both" : "self"), { method: "DELETE" }), O((ee) => ee.filter((se) => se !== f)), k((ee) => ee.filter((se) => se !== f))) : await Te("/api/chats/" + f + "/leave", { method: "POST" }), await ne();
      } catch (ee) {
        Wl(ee.message);
      } finally {
        Ht((ee) => ee.filter((se) => se.name !== f));
      }
    }, 5e3)), T === f && j(null);
  }
  const [yl, hn] = _.useState("all"), [ll, jl] = _.useState(null), W = M[T];
  _.useEffect(() => {
    !W && B && T && j(null);
  }, [B, W, T]), _.useEffect(() => {
    if (!T || !W || W.target_user_id) return;
    const f = new AbortController();
    return Te("/api/chats/" + T + "/info", { signal: f.signal }).then((U) => {
      h((ie) => {
        var ee;
        return { ...ie, [T]: ((ee = U.participants) == null ? void 0 : ee.length) ?? 0 };
      });
    }).catch(() => {
    }), () => f.abort();
  }, [T, !!W, ze]);
  function ft() {
    var f;
    W && J({
      view: W.target_user_id ? "peer" : "chat",
      id: W.target_user_id || T,
      chatId: T,
      name: W.name,
      avatar: W.avatar,
      kind: W.chat_type,
      owner: Number(W.owner_id) === It.id,
      manage: (f = W.permissions) == null ? void 0 : f.includes("manage")
    });
  }
  async function qt() {
    try {
      const f = await Te("/api/call/start", { method: "POST", json: { target_user_id: Number(W.target_user_id), chat_id: Number(T) } });
      f.call_url && location.assign(Ct(f.call_url));
    } catch (f) {
      Wl(f.message);
    }
  }
  const ia = Mt.filter(([f]) => !Tt.some((U) => U.name === f) && !Ue.includes(f)), Il = ia.some(([f]) => x.includes(f)), kn = Il && hl;
  _.useLayoutEffect(() => {
    !Il && hl && at(!1);
  }, [Il, hl]);
  const Tl = _.useRef(/* @__PURE__ */ new Set()), al = _.useRef(/* @__PURE__ */ new Set()), Ot = _.useRef(null), nl = () => [...L.current.querySelectorAll("[data-chat]")];
  function ua() {
    Ot.current = new Map(nl().map((f) => [f.dataset.chat, f.getBoundingClientRect().top]));
  }
  async function Sa(f, U) {
    if (Tl.current.has(f)) return;
    Tl.current.add(f);
    const ie = window.matchMedia("(prefers-reduced-motion: reduce)").matches, ee = nl().find((se) => se.dataset.chat === f);
    !ie && ee && await ee.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: U ? "-12px 0" : "12px 0" }], { duration: 150, easing: "ease-out", fill: "forwards" }).finished.catch(() => {
    }), ie || (ua(), al.current.add(f)), O((se) => U ? se.filter((Ie) => Ie !== f) : [...se, f]), Tl.current.delete(f);
  }
  _.useLayoutEffect(() => {
    var f;
    for (const U of nl()) {
      const ie = U.dataset.chat, ee = (f = Ot.current) == null ? void 0 : f.get(ie), se = ee === void 0 ? 0 : ee - U.getBoundingClientRect().top;
      se && U.animate([{ transform: "translateY(" + se + "px)" }, { transform: "translateY(0)" }], { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }), al.current.delete(ie) && U.animate([{ opacity: 0, translate: "0 6px" }, { opacity: 1, translate: "0 0" }], { duration: 180, easing: "ease-out" });
    }
    Ot.current = null;
  }, [x, kn, y, yl, Tt]);
  function vn(f, U, ie) {
    f.preventDefault();
    const ee = x.includes(U), se = f.currentTarget.getBoundingClientRect();
    ke({ x: f.clientX || se.left, y: f.clientY || se.bottom, actions: [
      ["tab", "Открыть в новой вкладке", () => {
        const Ie = new URL(location.href);
        Ie.searchParams.set("chat", U), window.open(Ie, "_blank", "noopener");
      }],
      ["eye", "Просмотреть", () => kl(U, ee)],
      ["folder", tl.includes(U) ? "Убрать из папки" : "Добавить в папку", () => A(Qt, U)],
      ["unread", "Пометить непрочитанным", () => Ll((Ie) => ({ ...Ie, [U]: Math.max(1, Ie[U] ?? 0) }))],
      ["pin", ul.includes(U) ? "Открепить" : "Закрепить", () => A(vl, U)],
      [St(U) ? "bellOff" : "bell", St(U) ? "Выкл. уведомления" : "Вкл. уведомления", () => Ea(U)],
      ["archive", ee ? "Вернуть из архива" : "В архив", () => Sa(U, ee)],
      ["delete", $u[Xt(U)].action, () => el(U)]
    ] });
  }
  const La = fe.filter((f) => !f[5].target_user_id && f[5].chat_type !== "channel").map((f) => f[0]), Pl = fe.filter((f) => f[5].chat_type === "channel").map((f) => f[0]), gn = (f) => Pl.includes(f) ? "channel" : La.includes(f) ? "group" : "chat";
  function ol(f, U, ie, { above: ee = !1, align: se = "start", identity: Ie } = {}) {
    const Bt = f.currentTarget;
    if ((De == null ? void 0 : De.trigger) === Bt) {
      ke(null);
      return;
    }
    ke({ trigger: Bt, label: U, actions: ie, above: ee, align: se, identity: Ie });
  }
  function S(f) {
    if ($) {
      rt();
      return;
    }
    const U = [
      ["chats", "Все чаты", () => {
        hn("all"), at(!1), rt();
      }],
      ["profile", "Мой профиль", () => J({ view: "self" })],
      ["settings", "Настройки", () => J({ view: "settings" })]
    ];
    Il && U.push(["archive", "Архив", () => at(!0)]), ol(f, "Разделы чатов", U, { identity: { name: g.name || g.login, avatar: g.avatar, open: () => J({ view: "self" }) } });
  }
  function Y(f) {
    ol(f, "Создание чата", [
      ["channel", "Создать канал", () => J({ view: "new-channel" })],
      ["groups", "Создать группу", () => J({ view: "new-group", step: 1 })],
      ["profile", "Новое сообщение", () => J({ view: "new-chat" })]
    ], { above: !0, align: "end" });
  }
  function F(f) {
    var Bt;
    if (!W) return;
    const U = W.chat_type === "channel", ie = !!W.target_user_id, ee = Number(W.owner_id) === It.id, se = [];
    !ie && (ee || (Bt = W.permissions) != null && Bt.includes("manage")) ? se.push(["edit", "Изменить", () => J({ view: "chat-edit", id: T, name: W.name, avatar: W.avatar, kind: W.chat_type, owner: ee })]) : se.push(["profile", ie ? "Профиль собеседника" : U ? "О канале" : "О группе", ft]), ie && se.push(["video", "Видеозвонок", qt]);
    const Ie = !St(T);
    se.push([Ie ? "bell" : "bellOff", Ie ? "Включить уведомления" : "Выключить уведомления", () => Ea(T)]), U && W.discussion_chat_id && se.push(["chats", "Открыть обсуждение", () => ue(W.discussion_chat_id)]), se.push(["select", "Выбрать сообщения", () => Ve({ chatId: T })]), ie && !W.is_bot && se.push(["block", W.peer_blocked ? "Разблокировать" : "Заблокировать", async () => {
      try {
        await Te("/api/chats/" + T + "/" + (W.peer_blocked ? "unblock" : "block") + "/" + W.target_user_id, { method: "POST" }), await ne();
      } catch (Yl) {
        Wl(Yl.message);
      }
    }]), se.push(["delete", $u[Xt(T)].action, () => el(T)]), ol(f, "Действия чата", se, { align: "end" });
  }
  async function ue(f) {
    const U = String(f);
    if (!M[U])
      try {
        if ((await Te("/api/chats/join", { method: "POST", json: { chat_id: Number(f) } })).pending) {
          J({ view: "join", id: f, pending: !0 });
          return;
        }
        await ne();
      } catch (ie) {
        Wl(ie.message);
        return;
      }
    kl(U, x.includes(U)), J(null);
  }
  function ce(f) {
    const U = String(f);
    rt(), kl(U, x.includes(U));
  }
  async function pe(f) {
    if (Number(f.id) === It.id) {
      rt(), J({ view: "self" });
      return;
    }
    try {
      const U = await Te("/api/chats/get_or_create", { method: "POST", json: { target_user_id: Number(f.id) } });
      await ne();
      const ie = String(U.chat_id);
      Ae((ee) => ee.filter((se) => se !== ie)), J(null), ce(ie);
    } catch (U) {
      Wl(U.message);
    }
  }
  _.useEffect(() => {
    const f = qa("start_peer");
    f && pe({ id: f });
  }, []);
  const et = (f) => yl !== "folder" || tl.includes(f), Ne = ([f], [U]) => Number(ul.includes(U)) - Number(ul.includes(f)), Ge = ia.filter(([f]) => x.includes(f)).sort(Ne), Ke = ia.filter(([f]) => (f !== "Архив" || Il) && !x.includes(f) && et(f)).sort((f, U) => +(U[0] === "Архив") - +(f[0] === "Архив") || Ne(f, U));
  _.useEffect(() => {
    const f = setTimeout(() => d(!1), 700);
    return () => clearTimeout(f);
  }, []);
  const $e = (f) => Math.max(Math.min(window.innerWidth <= 1100 ? 76 : 280, window.innerWidth * 0.5), Math.min(window.innerWidth * 0.5, 480, f));
  _.useEffect(() => {
    const f = () => V((U) => U === null ? null : $e(U));
    return window.addEventListener("resize", f), () => window.removeEventListener("resize", f);
  }, []);
  function Be(f) {
    f.preventDefault(), f.currentTarget.setPointerCapture(f.pointerId);
    const U = f.clientX, ie = L.current.getBoundingClientRect().width, ee = f.currentTarget, se = (Bt) => V($e(ie + Bt.clientX - U)), Ie = () => {
      ee.removeEventListener("pointermove", se), ee.removeEventListener("pointerup", Ie), ee.removeEventListener("pointercancel", Ie);
    };
    ee.addEventListener("pointermove", se), ee.addEventListener("pointerup", Ie), ee.addEventListener("pointercancel", Ie);
  }
  return /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { className: "preloader" + (s ? "" : " is-hidden"), role: "status", "aria-label": "Загрузка" }, /* @__PURE__ */ i.createElement("div", { className: "brand" }, /* @__PURE__ */ i.createElement("svg", { className: "logo", viewBox: "0 0 1132 642", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("path", { d: "M442.493 592L687.802 384.673L687.802 235.834L811.937 235.834L1082 50L334.072 50L50 235.834L442.493 235.834L442.493 592Z", fill: "#fff" })), /* @__PURE__ */ i.createElement("div", { className: "word", "aria-label": "Tornado" }, "Tornado".split("").map((f, U) => /* @__PURE__ */ i.createElement("span", { key: U, style: { "--i": U } }, f))))), /* @__PURE__ */ i.createElement("div", { className: "pattern-light", "aria-hidden": "true" }), /* @__PURE__ */ i.createElement("main", { className: "interface" + (T && T !== "Архив" ? " has-chat" : "") + (X ? " has-profile" : "") + ($ ? " has-search" : "") + (D.compact ? " compact-chat" : "") + (D.motion === !1 ? " motion-disabled" : "") + (D.previews === !1 ? " hide-previews" : "") }, /* @__PURE__ */ i.createElement("aside", { className: "sidebar", ref: L, style: Z === null ? void 0 : { width: Z }, "aria-label": "Боковая панель" }, kn ? /* @__PURE__ */ i.createElement("div", { className: "archive-page" }, /* @__PURE__ */ i.createElement("header", null, /* @__PURE__ */ i.createElement("button", { type: "button", "aria-label": "Закрыть архив", onClick: () => at(!1) }, /* @__PURE__ */ i.createElement(Hl, { name: "arrow_back" })), "Архив"), /* @__PURE__ */ i.createElement("div", { className: "chat-list" }, Ge.map(
    ([f, U, ie, , ee]) => /* @__PURE__ */ i.createElement("div", { className: "archive-row", key: f, "data-chat": f, onContextMenu: (se) => vn(se, f) }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "chat", onClick: () => {
      kl(f, !0);
    } }, /* @__PURE__ */ i.createElement("img", { className: "avatar", alt: "", src: Ct(ee) }), /* @__PURE__ */ i.createElement("div", { className: "chat-body" }, /* @__PURE__ */ i.createElement("div", { className: "chat-line" }, /* @__PURE__ */ i.createElement("span", { className: "chat-name" }, il(f)), /* @__PURE__ */ i.createElement("span", { className: "chat-time" }, ie)), /* @__PURE__ */ i.createElement("div", { className: "chat-preview" }, /* @__PURE__ */ i.createElement("span", null, U), !!Nl[f] && /* @__PURE__ */ i.createElement("span", { className: "badge" }, Nl[f])))))
  ))) : /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("div", { className: "sidebar-header" }, /* @__PURE__ */ i.createElement("button", { className: "menu-button morph-menu" + ($ ? " back" : ""), type: "button", "aria-label": $ ? "Закрыть поиск" : "Меню", "aria-expanded": (De == null ? void 0 : De.label) === "Разделы чатов", onClick: S }, /* @__PURE__ */ i.createElement("span", null, /* @__PURE__ */ i.createElement(qe, { name: "menu" }), /* @__PURE__ */ i.createElement(qe, { name: "arrow_back" }))), /* @__PURE__ */ i.createElement("label", { className: "search" + ($ ? " search-active" : "") }, /* @__PURE__ */ i.createElement(qe, { name: "search" }), /* @__PURE__ */ i.createElement(
    "input",
    {
      ref: he,
      type: "search",
      placeholder: R ? "Поиск" : "Соединение…",
      "aria-label": R ? "Поиск" : "Соединение…",
      value: y,
      onFocus: () => {
        ve(!0), ke(null);
      },
      onChange: (f) => r(f.target.value)
    }
  ), y && /* @__PURE__ */ i.createElement("button", { type: "button", className: "search-clear", "aria-label": "Очистить поиск", onClick: () => {
    var f;
    r(""), (f = he.current) == null || f.focus();
  } }, /* @__PURE__ */ i.createElement(qe, { name: "close" })))), /* @__PURE__ */ i.createElement(
    xy,
    {
      open: $,
      query: y,
      tab: ae,
      setTab: Oe,
      recent: Q,
      clearRecent: () => k([]),
      records: M,
      openChat: ce,
      openPerson: pe,
      openResult: (f) => {
        jl(null), ce(f.chat_id), it({ chatId: String(f.chat_id), id: f.id });
      },
      openChannel: (f) => {
        rt(), M[f.id] ? ce(f.id) : J({ view: "join", id: f.id, name: f.name });
      }
    }
  ), /* @__PURE__ */ i.createElement("div", { className: "sidebar-chat-layer", inert: $, "aria-hidden": $ || void 0 }, (tl.length > 0 || yl === "folder") && /* @__PURE__ */ i.createElement("button", { type: "button", className: "folder-filter", "aria-pressed": yl === "folder", onClick: () => hn(yl === "folder" ? "all" : "folder") }, "Папка"), /* @__PURE__ */ i.createElement("div", { className: "chat-list", "aria-label": "Список чатов" }, !B && (te ? /* @__PURE__ */ i.createElement(Pt, { message: te }) : /* @__PURE__ */ i.createElement(Ba, { label: "Загрузка чатов…" })), " ", Ke.map((f) => {
    var U;
    return /* @__PURE__ */ i.createElement("button", { type: "button", className: "chat" + (T === f[0] ? " selected" : ""), key: f[0], "data-chat": f[0], "aria-pressed": T === f[0], onContextMenu: f[0] === "Архив" ? void 0 : (ie) => vn(ie, f[0]), onClick: (ie) => {
      kl(f[0], !1);
      const ee = ie.currentTarget, se = ee.getBoundingClientRect(), Ie = document.createElement("span");
      Ie.className = "chat-wave", Ie.style.left = (ie.detail ? ie.clientX - se.left : se.width / 2) + "px", Ie.style.top = (ie.detail ? ie.clientY - se.top : se.height / 2) + "px", Ie.setAttribute("aria-hidden", "true"), window.matchMedia("(prefers-reduced-motion: reduce)").matches || (ee.append(Ie), Ie.addEventListener("animationend", () => Ie.remove(), { once: !0 }));
    } }, /* @__PURE__ */ i.createElement("img", { className: "avatar", src: Ct(f[4]), alt: "" }), /* @__PURE__ */ i.createElement("div", { className: "chat-body" }, /* @__PURE__ */ i.createElement("div", { className: "chat-line" }, /* @__PURE__ */ i.createElement("span", { className: "chat-name" }, il(f[0])), /* @__PURE__ */ i.createElement("span", { className: "chat-time" }, typeof ((U = f[5]) == null ? void 0 : U.last_status) == "boolean" && /* @__PURE__ */ i.createElement("span", { "aria-label": f[5].last_status ? "Прочитано" : "Отправлено", role: "img" }, /* @__PURE__ */ i.createElement(Hl, { name: f[5].last_status ? "checkAll" : "check" })), f[2])), /* @__PURE__ */ i.createElement("div", { className: "chat-preview" }, /* @__PURE__ */ i.createElement("span", null, f[1]), !!(Nl[f[0]] ?? f[3]) && /* @__PURE__ */ i.createElement("span", { className: "badge" + (f[0] === "Архив" ? " muted" : "") }, Nl[f[0]] ?? f[3]))));
  }))), /* @__PURE__ */ i.createElement("button", { type: "button", className: "sidebar-create" + ((De == null ? void 0 : De.label) === "Создание чата" ? " is-open" : ""), "aria-label": "Создать чат", "aria-expanded": (De == null ? void 0 : De.label) === "Создание чата", onClick: Y, inert: $ }, /* @__PURE__ */ i.createElement(Hl, { name: (De == null ? void 0 : De.label) === "Создание чата" ? "close" : "edit" })), /* @__PURE__ */ i.createElement("div", { className: "resize-handle", role: "separator", "aria-label": "Изменить ширину панели", "aria-orientation": "vertical", "aria-valuemin": 0, "aria-valuemax": 50, tabIndex: "0", onPointerDown: Be, onKeyDown: (f) => {
    (f.key === "ArrowLeft" || f.key === "ArrowRight") && (f.preventDefault(), V($e(L.current.getBoundingClientRect().width + (f.key === "ArrowRight" ? 10 : -10))));
  } }))), /* @__PURE__ */ i.createElement("section", { className: "conversation", hidden: !W, "aria-label": (W == null ? void 0 : W.name) ?? "Чат" }, /* @__PURE__ */ i.createElement("div", { className: "conversation-body", hidden: T === "Архив" }, /* @__PURE__ */ i.createElement(U5, { enterToSend: D.enterToSend !== !1, onOpenAuthor: (f) => J({ view: "peer", id: f.authorId, name: f.author, avatar: f.avatar }), focus: ge, pickRequest: Fe, revision: ze, notify: Wl, onUpdated: ne, canWrite: g.can_message && !(W != null && W.blocked) && (!Pl.includes(T) || ((We = W == null ? void 0 : W.permissions) == null ? void 0 : We.includes("post")) || Number(W == null ? void 0 : W.owner_id) === g.id), chat: Mt.find((f) => f[0] === T) ?? Mt[0], channel: Pl.includes(T), showSender: La.includes(T), forwardTargets: ia.filter(([f]) => f !== "Архив" && !Pl.includes(f)), notificationsEnabled: St(T), onToggleNotifications: () => Ea(T), search: ll && ll.chat === T ? ll.value : "", header: /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("header", { key: T, className: "conversation-header", onClick: (f) => {
    f.target.closest("button") || ft();
  } }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "composer-action back-button", "aria-label": "Назад к списку чатов", onClick: () => j(null) }, /* @__PURE__ */ i.createElement(Hl, { name: "arrow_back" })), /* @__PURE__ */ i.createElement("button", { type: "button", className: "chat-profile-button", "aria-label": "Открыть сведения о чате", onClick: ft }, /* @__PURE__ */ i.createElement("img", { className: "header-avatar", src: Ct((W == null ? void 0 : W.target_user_id) === g.id ? g.avatar : W == null ? void 0 : W.avatar), alt: "" }), /* @__PURE__ */ i.createElement("span", { className: "header-identity" }, /* @__PURE__ */ i.createElement("strong", null, W == null ? void 0 : W.name), /* @__PURE__ */ i.createElement("small", null, W != null && W.target_user_id ? ym(W) : me[T] !== void 0 ? bm(me[T], Pl.includes(T)) : ""))), /* @__PURE__ */ i.createElement("div", { className: "header-actions" }, /* @__PURE__ */ i.createElement(Os, { icon: "search", label: "Поиск по сообщениям", onClick: () => jl((f) => (f == null ? void 0 : f.chat) === T ? null : { chat: T, value: "" }) }), !Pl.includes(T) && !La.includes(T) && /* @__PURE__ */ i.createElement(Os, { icon: "phone", label: "Позвонить", onClick: qt }), /* @__PURE__ */ i.createElement(Os, { icon: "more", label: "Действия чата", expanded: (De == null ? void 0 : De.label) === "Действия чата", onClick: F }))), ll && ll.chat === T && /* @__PURE__ */ i.createElement("div", { className: "header-search" }, /* @__PURE__ */ i.createElement("input", { autoFocus: !0, type: "search", "aria-label": "Поиск по сообщениям", placeholder: "Поиск по сообщениям", value: ll.value, onChange: (f) => jl({ chat: T, value: f.target.value }), onKeyDown: (f) => {
    f.key === "Escape" && jl(null);
  } }))) }))), /* @__PURE__ */ i.createElement("aside", { className: "profile-dock", inert: !X, "aria-hidden": !X || void 0 }, /* @__PURE__ */ i.createElement(
    Oy,
    {
      page: Et,
      setPage: J,
      profile: g,
      setProfile: z,
      blocked: fe.filter((f) => f[5].peer_blocked).map((f) => ({ ...f[5], id: f[0] })),
      preferences: D,
      changePreference: re,
      notifications: le,
      notificationEnabled: St,
      onToggleNotifications: Ea,
      onUpdated: ne,
      groups: fe.filter((f) => La.includes(f[0]) && Number(f[5].owner_id) === It.id).map((f) => ({ id: f[0], name: f[5].name })),
      onOpenChat: async (f, U = !1) => {
        var Ie;
        const ie = await ne(), ee = String(f);
        Ae((Bt) => Bt.filter((Yl) => Yl !== ee)), O((Bt) => Bt.filter((Yl) => Yl !== ee)), kl(ee, !1);
        const se = (ie == null ? void 0 : ie[ee]) || M[ee];
        J(U && se && !se.target_user_id ? { view: "chat", id: ee, name: se.name, avatar: se.avatar, kind: se.chat_type, owner: Number(se.owner_id) === It.id, manage: (Ie = se.permissions) == null ? void 0 : Ie.includes("manage") } : null);
      }
    }
  ))), /* @__PURE__ */ i.createElement(w1, { menu: De, close: () => ke(null) }), At && /* @__PURE__ */ i.createElement(T1, { name: il(At), kind: Xt(At), onClose: () => el(null), onConfirm: (f) => wl(At, f) }), /* @__PURE__ */ i.createElement("div", { className: "removal-notices" }, Se && /* @__PURE__ */ i.createElement("div", { className: "removal-notice error-notice", role: "alert" }, /* @__PURE__ */ i.createElement(Hl, { name: "error" }), Se.text), Bl.map(({ name: f, kind: U }) => /* @__PURE__ */ i.createElement("div", { className: "removal-notice", key: f }, /* @__PURE__ */ i.createElement("svg", { className: "removal-timer", viewBox: "0 0 26 26", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("circle", { cx: "13", cy: "13", r: "10", fill: "none", stroke: "#ffffff30", strokeWidth: "2" }), /* @__PURE__ */ i.createElement("circle", { className: "removal-timer-progress", cx: "13", cy: "13", r: "10", pathLength: "100", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", transform: "rotate(-90 13 13)" })), /* @__PURE__ */ i.createElement("span", { role: "status" }, $u[U].done), /* @__PURE__ */ i.createElement("button", { type: "button", "aria-label": "Вернуть чат " + il(f), onClick: () => pa(f, !0) }, "Вернуть")))));
}
yg.createRoot(document.getElementById("root")).render(/* @__PURE__ */ i.createElement(Hy, null));
