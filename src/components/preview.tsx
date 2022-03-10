import './preview.css'
import { useEffect, useRef } from 'react'
interface PreviewProps {
  code: string
}

// generate iframe content locally
// listen for any input code from the parent window and execute it
const iframeHTML = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (e) => {
            try {
              eval(e.data)
            } catch (err) {
              const root = document.querySelector('#root')
              root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + err + '</div>'
              console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframeRef = useRef<any>()

  useEffect(() => {
    // dump all previous execution variables and changes
    // and get a newly fresh iframe environment
    iframeRef.current.srcdoc = iframeHTML

    // parent window (React App) emit user input code to the iframe (pass down)
    // * for allowing for any domain (still relative secure as stated tradeoff in README)
    iframeRef.current.contentWindow.postMessage(code, '*')
  }, [code])

  return (
    <div className='preview-wrapper'>
      <iframe title='preview' ref={iframeRef} sandbox='allow-scripts' srcDoc={iframeHTML} />
    </div>
  )
}

export default Preview
