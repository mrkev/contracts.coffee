loadVirt.patch()
{reactive, insertValueB, $E} = frp


this.run = ->
  now = timerB 1000
  startTm = now.valueNow()
  clickTms = $E("reset", "click").snapshotE(now).startsWith startTm
  elapsed = now - clickTms
  insertValueB elapsed, "curTime", "innerHTML"


