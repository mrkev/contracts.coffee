loadVirt.patch()
{reactive, reactiveTimer, $E, insertValue, dom} = frp

$(document).ready ->

  now = reactiveTimer 1000
  startTm = now.curr()
  clickTms = $E("reset", "click").snapshot(now).startsWith startTm
  elapsed = now - clickTms

  dom("#curTime").text(elapsed)

