(function() {(function() {
  var old_require = require;
  require = function(mod, filename) {
    var key, m = old_require(mod);
    for(key in m) {
      if(typeof(m[key]) && m[key].hasOwnProperty && m[key].hasOwnProperty('use')) {
        m[key] = m[key].use(filename, mod);
      }
    }
    return m;
  };
  for(var key in old_require) {
    require[key] = old_require[key];
  }
})();

  var Behavior, EventStream, PQ, Pulse, andE, collectE, constantE, createNode, createTimerNodeStatic, delayE, delayStaticE, disableTimer, disableTimerNode, doNotPropagate, filterE, genericAttachListener, genericRemoveListener, ifE, internalE, lastRank, mapE, mergeE, nextStamp, onceE, oneE, orE, propagatePulse, recE, receiverE, sendEvent, skipFirstE, snapshotE, stamp, startsWith, switchE, timerB, timerDisablers, timerE, valueNow, zeroE, ___timerID, __getTimerId;
  var __slice = Array.prototype.slice;

  doNotPropagate = {};

  Pulse = function(stamp, value) {
    this.stamp = stamp;
    return this.value = value;
  };

  PQ = function() {
    var ctx;
    ctx = this;
    ctx.val = [];
    this.insert = function(kv) {
      var kvpos, oldpos, _ref, _results;
      ctx.val.push(kv);
      kvpos = Proxy.dispatchBinary('-', ctx.val.length, 1, function() { return ctx.val.length - 1;});
      _results = [];
      while (Proxy.dispatchBinary('&&', Proxy.dispatchBinary('>', kvpos, 0, function() { return kvpos > 0;}), Proxy.dispatchBinary('<', kv.k, (Proxy.dispatchTest((_ref = ctx.val[Math.floor(Proxy.dispatchBinary('/', (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})), 2, function() { return (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})) / 2;}))]) != null) ? _ref.k : void 0), function() { return kv.k < (Proxy.dispatchTest((_ref = ctx.val[Math.floor(Proxy.dispatchBinary('/', (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})), 2, function() { return (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})) / 2;}))]) != null) ? _ref.k : void 0);}), function() { return Proxy.dispatchBinary('>', kvpos, 0, function() { return kvpos > 0;}) && Proxy.dispatchBinary('<', kv.k, (Proxy.dispatchTest((_ref = ctx.val[Math.floor(Proxy.dispatchBinary('/', (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})), 2, function() { return (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})) / 2;}))]) != null) ? _ref.k : void 0), function() { return kv.k < (Proxy.dispatchTest((_ref = ctx.val[Math.floor(Proxy.dispatchBinary('/', (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})), 2, function() { return (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})) / 2;}))]) != null) ? _ref.k : void 0);});})) {
        oldpos = kvpos;
        kvpos = Math.floor(Proxy.dispatchBinary('/', (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})), 2, function() { return (Proxy.dispatchBinary('-', kvpos, 1, function() { return kvpos - 1;})) / 2;}));
        ctx.val[oldpos] = ctx.val[kvpos];
        _results.push(ctx.val[kvpos] = kv);
      }
      return _results;
    };
    this.isEmpty = function() {
      return Proxy.dispatchBinary('===', ctx.val.length, 0, function() { return ctx.val.length === 0;});
    };
    this.pop = function() {
      var kv, kvpos, leftChild, ret, rightChild;
      if (Proxy.dispatchTest(Proxy.dispatchBinary('===', ctx.val.length, 1, function() { return ctx.val.length === 1;}))) {
        return ctx.val.pop();
      }
      ret = ctx.val.shift();
      ctx.val.unshift(ctx.val.pop());
      kvpos = 0;
      kv = ctx.val[0];
      while (true) {
        leftChild = Proxy.dispatchTest(Proxy.dispatchBinary('<', Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 1, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 1;}), ctx.val.length, function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 1, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 1;}) < ctx.val.length;})) ? ctx.val[Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 1, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 1;})].k : Proxy.dispatchBinary('+', kv.k, 1, function() { return kv.k + 1;});
        rightChild = Proxy.dispatchTest(Proxy.dispatchBinary('<', Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 2, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 2;}), ctx.val.length, function() { return Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 2, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 2;}) < ctx.val.length;})) ? ctx.val[Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 2, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 2;})].k : Proxy.dispatchBinary('+', kv.k, 1, function() { return kv.k + 1;});
        if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('>', leftChild, kv.k, function() { return leftChild > kv.k;}), Proxy.dispatchBinary('>', rightChild, kv.k, function() { return rightChild > kv.k;}), function() { return Proxy.dispatchBinary('>', leftChild, kv.k, function() { return leftChild > kv.k;}) && Proxy.dispatchBinary('>', rightChild, kv.k, function() { return rightChild > kv.k;});}))) {
          break;
        }
        if (Proxy.dispatchTest(Proxy.dispatchBinary('<', leftChild, rightChild, function() { return leftChild < rightChild;}))) {
          ctx.val[kvpos] = ctx.val[Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 1, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 1;})];
          ctx.val[Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 1, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 1;})] = kv;
          kvpos = Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 1, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 1;});
        } else {
          ctx.val[kvpos] = ctx.val[Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 2, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 2;})];
          ctx.val[Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 2, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 2;})] = kv;
          kvpos = Proxy.dispatchBinary('+', Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}), 2, function() { return Proxy.dispatchBinary('*', kvpos, 2, function() { return kvpos * 2;}) + 2;});
        }
      }
      return ret;
    };
    return this;
  };

  lastRank = 0;

  stamp = 1;

  nextStamp = function() {
    return Proxy.dispatchUnary('++', stamp, function() { return ++stamp; });
  };

  propagatePulse = function(pulse, node) {
    var i, len, nextPulse, queue, qv, weaklyHeld, _results;
    queue = new PQ();
    queue.insert({
      k: node.rank,
      n: node,
      v: pulse
    });
    len = 1;
    _results = [];
    while (len) {
      qv = queue.pop();
      Proxy.dispatchUnary('--', len, function() { return len--; });
      nextPulse = qv.n.updater(new Pulse(qv.v.stamp, qv.v.value));
      weaklyHeld = true;
      if (Proxy.dispatchTest(Proxy.dispatchBinary('!==', nextPulse, doNotPropagate, function() { return nextPulse !== doNotPropagate;}))) {
        i = 0;
        while (Proxy.dispatchBinary('<', i, qv.n.sendsTo.length, function() { return i < qv.n.sendsTo.length;})) {
          weaklyHeld = Proxy.dispatchBinary('&&', weaklyHeld, qv.n.sendsTo[i].weaklyHeld, function() { return weaklyHeld && qv.n.sendsTo[i].weaklyHeld;});
          Proxy.dispatchUnary('++', len, function() { return len++; });
          queue.insert({
            k: qv.n.sendsTo[i].rank,
            n: qv.n.sendsTo[i],
            v: nextPulse
          });
          Proxy.dispatchUnary('++', i, function() { return i++; });
        }
        if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('>', qv.n.sendsTo.length, 0, function() { return qv.n.sendsTo.length > 0;}), weaklyHeld, function() { return Proxy.dispatchBinary('>', qv.n.sendsTo.length, 0, function() { return qv.n.sendsTo.length > 0;}) && weaklyHeld;}))) {
          _results.push(qv.n.weaklyHeld = true);
        } else {
          _results.push(void 0);
        }
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  EventStream = function(nodes, updater) {
    var node, _i, _len;
    this.updater = updater;
    this.sendsTo = [];
    this.weaklyHeld = false;
    for (_i = 0, _len = nodes.length; _i < _len; _i++) {
      node = nodes[_i];
      node.attachListener(this);
    }
    return this.rank = Proxy.dispatchUnary('++', lastRank, function() { return ++lastRank; });
  };

  exports.createNode = createNode = function(nodes, updater) {
    return new EventStream(nodes, updater);
  };

  genericAttachListener = function(node, dependent) {
    var cur, lowest, q, _results;
    node.sendsTo.push(dependent);
    if (Proxy.dispatchTest(Proxy.dispatchBinary('>', node.rank, dependent.rank, function() { return node.rank > dependent.rank;}))) {
      lowest = Proxy.dispatchBinary('+', lastRank, 1, function() { return lastRank + 1;});
      q = [dependent];
      _results = [];
      while (q.length) {
        cur = q.splice(0, 1)[0];
        cur.rank = Proxy.dispatchUnary('++', lastRank, function() { return ++lastRank; });
        _results.push(q = q.concat(cur.sendsTo));
      }
      return _results;
    }
  };

  genericRemoveListener = function(node, dependent, isWeakReference) {
    var foundSending, i;
    foundSending = false;
    i = 0;
    while (Proxy.dispatchBinary('&&', Proxy.dispatchBinary('<', i, node.sendsTo.length, function() { return i < node.sendsTo.length;}), Proxy.dispatchUnary('!', foundSending, function() { return !foundSending; }), function() { return Proxy.dispatchBinary('<', i, node.sendsTo.length, function() { return i < node.sendsTo.length;}) && Proxy.dispatchUnary('!', foundSending, function() { return !foundSending; });})) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('===', node.sendsTo[i], dependent, function() { return node.sendsTo[i] === dependent;}))) {
        node.sendsTo.splice(i, 1);
        foundSending = true;
      }
      Proxy.dispatchUnary('++', i, function() { return i++; });
    }
    if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('===', isWeakReference, true, function() { return isWeakReference === true;}), Proxy.dispatchBinary('===', node.sendsTo.length, 0, function() { return node.sendsTo.length === 0;}), function() { return Proxy.dispatchBinary('===', isWeakReference, true, function() { return isWeakReference === true;}) && Proxy.dispatchBinary('===', node.sendsTo.length, 0, function() { return node.sendsTo.length === 0;});}))) {
      node.weaklyHeld = true;
    }
    return foundSending;
  };

  EventStream.prototype.attachListener = function(dependent) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', dependent, function() { return !dependent; }), EventStream, function() { return Proxy.dispatchUnary('!', dependent, function() { return !dependent; }) instanceof EventStream;}))) {
      throw 'attachListener: expected an EventStream';
    }
    return genericAttachListener(this, dependent);
  };

  EventStream.prototype.removeListener = function(dependent, isWeak) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', dependent, function() { return !dependent; }), EventStream, function() { return Proxy.dispatchUnary('!', dependent, function() { return !dependent; }) instanceof EventStream;}))) {
      throw 'removeListener: expected an EventStream';
    }
    return genericRemoveListener(this, dependent, isWeak);
  };

  sendEvent = function(node, value) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', node, function() { return !node; }), EventStream, function() { return Proxy.dispatchUnary('!', node, function() { return !node; }) instanceof EventStream;}))) {
      throw 'sendEvent: expected Event as first arg';
    }
    return propagatePulse(new Pulse(nextStamp(), value), node);
  };

  internalE = function(dependsOn) {
    if (Proxy.dispatchTest(dependsOn == null)) dependsOn = [];
    return createNode(dependsOn, function(pulse) {
      return pulse;
    });
  };

  zeroE = function() {
    return createNode([], function(pulse) {
      throw Proxy.dispatchBinary('+', "zeroE : received a value; zeroE should not receive a value; the value was ", pulse.value, function() { return "zeroE : received a value; zeroE should not receive a value; the value was " + pulse.value;});
    });
  };

  exports.oneE = oneE = function(val) {
    var evt, sent;
    sent = false;
    evt = createNode([], function(pulse) {
      if (Proxy.dispatchTest(sent)) throw 'oneE : received an extra value';
      sent = true;
      return pulse;
    });
    setTimeout((function() {
      return sendEvent(evt, val);
    }), 0);
    return evt;
  };

  mergeE = function() {
    var deps;
    deps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (Proxy.dispatchTest(Proxy.dispatchBinary('===', deps.length, 0, function() { return deps.length === 0;}))) {
      return zeroE();
    } else {
      return internalE(deps);
    }
  };

  EventStream.prototype.mergeE = function() {
    var deps;
    deps = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    deps.push(this);
    return internalE(deps);
  };

  EventStream.prototype.constantE = function(constantValue) {
    return createNode([this], function(pulse) {
      pulse.value = constantValue;
      return pulse;
    });
  };

  constantE = function(e, v) {
    return e.constantE(v);
  };

  EventStream.prototype.startsWith = function(init) {
    return new Behavior(this, init);
  };

  EventStream.prototype.bindE = function(k) {
    var inE, m, outE, prevE;
    m = this;
    prevE = false;
    outE = createNode([], function(pulse) {
      return pulse;
    });
    outE.name = "bind outE";
    inE = createNode([m], function(pulse) {
      if (Proxy.dispatchTest(prevE)) prevE.removeListener(outE, true);
      prevE = k(pulse.value);
      if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', prevE, EventStream, function() { return prevE instanceof EventStream;}))) {
        prevE.attachListener(outE);
      } else {
        throw "bindE : expected EventStream";
      }
      return doNotPropagate;
    });
    inE.name = "bind inE";
    return outE;
  };

  EventStream.prototype.switchE = function() {
    return this.bindE(function(v) {
      return v;
    });
  };

  Behavior = function(event, init, updater) {
    var behave;
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', event, function() { return !event; }), EventStream, function() { return Proxy.dispatchUnary('!', event, function() { return !event; }) instanceof EventStream;}))) {
      throw 'Behavior: expected event as second arg';
    }
    behave = this;
    this.last = init;
    this.underlyingRaw = event;
    this.underlying = createNode([event], (Proxy.dispatchTest(updater) ? function(p) {
      behave.last = updater(p.value);
      p.value = behave.last;
      return p;
    } : function(p) {
      behave.last = p.value;
      return p;
    }));
    return this;
  };

  Behavior.prototype.valueNow = function() {
    return this.last;
  };

  valueNow = function(behavior) {
    return behavior.valueNow();
  };

  receiverE = function() {
    var evt;
    evt = internalE();
    evt.sendEvent = function(value) {
      return propagatePulse(new Pulse(nextStamp(), value), evt);
    };
    return evt;
  };

  EventStream.prototype.mapE = function(f) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', f, function() { return !f; }), Function, function() { return Proxy.dispatchUnary('!', f, function() { return !f; }) instanceof Function;}))) {
      throw 'mapE : expected a function as the first argument; received #{f}';
    }
    return createNode([this], function(pulse) {
      pulse.value = f(pulse.value);
      return pulse;
    });
  };

  EventStream.prototype.notE = function() {
    return this.mapE(function(v) {
      return Proxy.dispatchUnary('!', v, function() { return !v; });
    });
  };

  EventStream.prototype.filterE = function(pred) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', pred, function() { return !pred; }), Function, function() { return Proxy.dispatchUnary('!', pred, function() { return !pred; }) instanceof Function;}))) {
      throw 'filterE : expected predicate; received #{pred}';
    }
    return createNode([this], function(pulse) {
      if (Proxy.dispatchTest(pred(pulse.value))) {
        return pulse;
      } else {
        return doNotPropagate;
      }
    });
  };

  filterE = function(e, p) {
    return e.filterE(p);
  };

  EventStream.prototype.onceE = function() {
    var done;
    done = false;
    return createNode([this], function(pulse) {
      if (Proxy.dispatchTest(Proxy.dispatchUnary('!', done, function() { return !done; }))) {
        done = true;
        return pulse;
      } else {
        return doNotPropagate;
      }
    });
  };

  onceE = function(e) {
    return e.onceE();
  };

  EventStream.prototype.skipFirstE = function() {
    var skipped;
    skipped = true;
    return createNode([this], function(pulse) {
      if (Proxy.dispatchTest(skipped)) {
        return pulse;
      } else {
        return doNotPropagate;
      }
    });
  };

  skipFirstE = function(e) {
    return e.skipFirstE();
  };

  EventStream.prototype.collectE = function(init, fold) {
    var acc;
    acc = init;
    return this.mapE(function(n) {
      var next;
      next = fold(n, acc);
      acc = next;
      return next;
    });
  };

  collectE = function(e, i, f) {
    return e.collectE(i, f);
  };

  EventStream.prototype.switchE = function() {
    return this.bindE(function(v) {
      return v;
    });
  };

  recE = function(fn) {
    var inE, outE;
    inE = receiverE();
    outE = fn(inE);
    outE.mapE(function(x) {
      return inE.sendEvent(x);
    });
    return outE;
  };

  switchE = function(e) {
    return e.switchE();
  };

  EventStream.prototype.ifE = function(thenE, elseE) {
    var testStamp, testValue;
    testStamp = Proxy.dispatchUnary('-', 1, function() { return -1; });
    testValue = false;
    createNode([this], function(pulse) {
      testStamp = pulse.stamp;
      testValue = pulse.value;
      return doNotPropagate;
    });
    return mergeE(createNode([thenE], function(pulse) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', testValue, (Proxy.dispatchBinary('===', testStamp, pulse.stamp, function() { return testStamp === pulse.stamp;})), function() { return testValue && (Proxy.dispatchBinary('===', testStamp, pulse.stamp, function() { return testStamp === pulse.stamp;}));}))) {
        return send(pulse);
      }
    }), createNode([elseE], function(pulse) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchUnary('!', testValue, function() { return !testValue; }), (Proxy.dispatchBinary('===', testStamp, pulse.stamp, function() { return testStamp === pulse.stamp;})), function() { return Proxy.dispatchUnary('!', testValue, function() { return !testValue; }) && (Proxy.dispatchBinary('===', testStamp, pulse.stamp, function() { return testStamp === pulse.stamp;}));}))) {
        return send(pulse);
      }
    }));
  };

  ifE = function(test, thenE, elseE) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', test, EventStream, function() { return test instanceof EventStream;}))) {
      return test.ifE(thenE, elseE);
    } else {
      if (Proxy.dispatchTest(test)) {
        return thenE;
      } else {
        return elseE;
      }
    }
  };

  andE = function() {
    var acc, i, nodes;
    nodes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    acc = Proxy.dispatchTest(Proxy.dispatchBinary('>', nodes.length, 0, function() { return nodes.length > 0;})) ? nodes[Proxy.dispatchBinary('-', nodes.length, 1, function() { return nodes.length - 1;})] : oneE(true);
    i = Proxy.dispatchBinary('-', nodes.length, 2, function() { return nodes.length - 2;});
    while (Proxy.dispatchBinary('>', i, Proxy.dispatchUnary('-', 1, function() { return -1; }), function() { return i > Proxy.dispatchUnary('-', 1, function() { return -1; });})) {
      acc = ifE(nodes[i], acc, nodes[i].constantE(false));
      Proxy.dispatchUnary('--', i, function() { return i--; });
    }
    return acc;
  };

  EventStream.prototype.andE = function() {
    var deps, others;
    others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    deps = [this].concat(others);
    return andE.apply(this, deps);
  };

  orE = function() {
    var acc, i, nodes;
    nodes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    acc = Proxy.dispatchTest(Proxy.dispatchBinary('>', nodes.length, 2, function() { return nodes.length > 2;})) ? nodes[Proxy.dispatchBinary('-', nodes.length, 1, function() { return nodes.length - 1;})] : oneE(false);
    i = nodes.length(Proxy.dispatchUnary('-', 2, function() { return -2; }));
    while (Proxy.dispatchBinary('>', i, Proxy.dispatchUnary('-', 1, function() { return -1; }), function() { return i > Proxy.dispatchUnary('-', 1, function() { return -1; });})) {
      acc = ifE(nodes[i], nodes[i], acc);
    }
    return acc;
  };

  EventStream.prototype.orE = function() {
    var deps, others;
    others = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    deps = [this].concat(others);
    return orE.apply(this, deps);
  };

  delayStaticE = function(event, time) {
    var resE;
    resE = internalE();
    createNode([this], function(p) {
      setTimeout((function() {
        return sendEvent(resE, p.value);
      }), time);
      return doNotPropagate;
    });
    return resE;
  };

  EventStream.prototype.delayE = function(time) {
    var event, link, receiverEE, resE, switcherE;
    event = this;
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', time, Behavior, function() { return time instanceof Behavior;}))) {
      receiverEE = internalE();
      link = {
        from: event,
        towards: delayStaticE(event, valueNow(time))
      };
      switcherE = createNode([changes(time)], function(p) {
        link.from.removeListener(link.towards);
        link = {
          from: event,
          towards: delayStaticE(event, p.value)
        };
        sendEvent(receiverEE, link.towards);
        return doNotPropagate;
      });
      resE = receiverEE.switchE();
      sendEvent(switcherE, valueNow(time));
      return resE;
    } else {
      return delayStaticE(event, time);
    }
  };

  delayE = function(sourceE, interval) {
    return sourceE.delayE(interval);
  };

  mapE = function() {
    var context, fn, i, nodes, nofnodes, selectI, selectors, valOrNodes;
    fn = arguments[0], valOrNodes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    selectors = [];
    selectI = 0;
    nodes = [];
    i = 0;
    while (Proxy.dispatchBinary('<', i, valsOrNodes.length, function() { return i < valsOrNodes.length;})) {
      if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', valsOrNodes[i], EventStream, function() { return valsOrNodes[i] instanceof EventStream;}))) {
        nodes.push(valsOrNodes[i]);
        selectors.push((function(ii) {
          return function(realArgs) {
            return realArgs[ii];
          };
        })(selectI));
        Proxy.dispatchUnary('++', selectI, function() { return selectI++; });
      } else {
        selectors.push((function(aa) {
          return function() {
            return aa;
          };
        })(valsOrNodes[i]));
      }
      Proxy.dispatchUnary('++', i, function() { return i++; });
    }
    context = this;
    nofnodes = selectors.slice(1);
    if (Proxy.dispatchTest(Proxy.dispatchBinary('===', nodes.length, 0, function() { return nodes.length === 0;}))) {
      return oneE(fn.apply(context, valsOrNodes));
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('&&', Proxy.dispatchBinary('===', nodes.length, 1, function() { return nodes.length === 1;}), Proxy.dispatchBinary('instanceof', fn, Function, function() { return fn instanceof Function;}), function() { return Proxy.dispatchBinary('===', nodes.length, 1, function() { return nodes.length === 1;}) && Proxy.dispatchBinary('instanceof', fn, Function, function() { return fn instanceof Function;});}))) {
      return nodes[0].mapE(function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return fn.apply(context, nofnodes.map(function(s) {
          return s(args);
        }));
      });
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('===', nodes.length, 1, function() { return nodes.length === 1;}))) {
      return fn.mapE(function(v) {
        var args;
        args = arguments;
        return v.apply(context, nofnodes.map(function(s) {
          return s(args);
        }));
      });
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', fn, Function, function() { return fn instanceof Function;}))) {
      return createTimeSyncNode(nodes).mapE(function(arr) {
        return fn.apply(this, nofnodes.map(function(s) {
          return s(arr);
        }));
      });
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', fn, EventStream, function() { return fn instanceof EventStream;}))) {
      return createTimeSyncNode(nodes).mapE(function(arr) {
        return arr[0].apply(this, nofnodes.map(function(s) {
          return s(arr);
        }));
      });
    } else {
      throw 'unknown mapE case';
    }
  };

  EventStream.prototype.snapshotE = function(valueB) {
    return createNode([this], function(pulse) {
      pulse.value = valueNow(valueB);
      return pulse;
    });
  };

  snapshotE = function(triggerE, valueB) {
    return triggerE.snapshotE(valueB);
  };

  ___timerID = 0;

  __getTimerId = function() {
    return Proxy.dispatchUnary('++', ___timerID, function() { return ++___timerID; });
  };

  timerDisablers = [];

  disableTimerNode = function(node) {
    return timerDisablers[node.__timerId]();
  };

  exports.disableTimer = disableTimer = function(v) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', v, Behavior, function() { return v instanceof Behavior;}))) {
      return disableTimerNode(v.underlyingRaw);
    } else if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', v, EventStream, function() { return v instanceof EventStream;}))) {
      return disableTimerNode(v);
    }
  };

  createTimerNodeStatic = function(interval) {
    var listener, primEventE, timer;
    primEventE = internalE();
    primEventE.__timerId = __getTimerId();
    listener = function(evt) {
      var isListening;
      if (Proxy.dispatchTest(Proxy.dispatchUnary('!', primEventE.weaklyHeld, function() { return !primEventE.weaklyHeld; }))) {
        sendEvent(primEventE, (new Date()).getTime());
      } else {
        clearInterval(timer);
        isListening = false;
      }
      return true;
    };
    timer = setInterval(listener, interval);
    timerDisablers[primEventE.__timerId] = function() {
      return clearInterval(timer);
    };
    return primEventE;
  };

  timerE = function(interval) {
    var prevE, res;
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', interval, Behavior, function() { return interval instanceof Behavior;}))) {
      receiverE = internalE();
      res = receiverE.switchE();
      prevE = createTimerNodeStatic(valueNow(interval));
      sendEvent(receiverE, prevE);
      createNode([changes(interval)], function(p) {
        disableTimerNode(prevE);
        prevE = createTimerNodeStatic(p.value);
        sendEvent(receiverE, prevE);
        return doNotPropagate;
      });
      res.__timerId = __getTimerId();
      timerDisablers[res.__timerId] = function() {
        disableTimerNode[prevE]();
        return;
      };
      return res;
    } else {
      return createTimerNodeStatic(interval);
    }
  };

  startsWith = function(e, init) {
    if (Proxy.dispatchTest(Proxy.dispatchBinary('instanceof', Proxy.dispatchUnary('!', e, function() { return !e; }), EventStream, function() { return Proxy.dispatchUnary('!', e, function() { return !e; }) instanceof EventStream;}))) {
      throw 'startsWith: expected EventStream; received #{e}';
    }
    return e.startsWith(init);
  };

  exports.timerB = timerB = function(interval) {
    return startsWith(timerE(interval), (new Date()).getTime());
  };

}).call(this);