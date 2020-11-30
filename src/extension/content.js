const loadScript = source => {
  return new Promise((resolve, reject) => {
    const onloadHander = (_, isAbort) => {
      if (
        isAbort ||
        !script.readyState ||
        /loaded|complete/.test(script.readyState)
      ) {
        script.onload = null
        script = undefined

        isAbort ? reject(new Error('Failed to load script')) : resolve()
      }
    }

    let script = document.createElement('script')
    script.src = source
    script.defer = true
    script.onload = onloadHander

    document.head.insertBefore(script, null)
  })
}

loadScript(chrome.extension.getURL('app.js'))
