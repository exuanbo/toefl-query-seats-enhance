const loadScript = source => {
  return new Promise((resolve, reject) => {
    function onloadHander(_, isAbort) {
      if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
        script.onload = null
        script.onreadystatechange = null
        script = undefined

        isAbort ? reject(new Error('Failed to load script')) : resolve()
      }
    }

    let script = document.createElement('script')
    script.src = source
    script.defer = true
    script.onload = onloadHander
    script.onreadystatechange = onloadHander

    const prior = document.getElementsByTagName('script')[0]
    prior.parentNode.insertBefore(script, prior)
  })
}

loadScript(chrome.extension.getURL('app.js'))
