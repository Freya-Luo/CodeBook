import './preview.css';
import { useEffect, useRef } from 'react';
interface PreviewProps {
  id: string;
  code: string;
  bundleMsg: string;
}

// generate iframe content locally
// listen for any input code from the parent window and execute it
const iframeHTML = (id: string) => `
  <html>
    <head></head>
    <body>
      <div id="root_${id}"></div>
      <script>
      const handleError = (err) => {
        const root = document.querySelector('#root_${id}')
        root.innerHTML = '<div style="color: red"><h4>Runtime Error</h4>' + err + '</div>'
        console.error(err);
      }

      // handle asynchronous errors
      window.addEventListener('error', (e) => {
        e.preventDefault()
        handleError(e.error)
      })

      window.addEventListener('message', (e) => {
        try {
          eval(e.data)
        } catch (err) {
          handleError(err)
        }
      }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ id, code, bundleMsg }) => {
  const iframeRef = useRef<any>();
  const html = iframeHTML(id);

  useEffect(() => {
    // dump all previous execution variables and changes (whole HTML goes away)
    // and get a newly fresh iframe environment
    iframeRef.current.srcdoc = html;

    // parent window (React App) emit user input code to the iframe (pass down)
    // targetWindow.postMeassage()
    // * for allowing for any domain (still relative secure as stated tradeoff in README)
    // Trick: Adding a few miliseconds to make sure iframe has already setup the new event listener
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, '*');
    }, 30);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      {bundleMsg && (
        <div className='error'>
          <h4>Bundling Error</h4>
          {bundleMsg}
        </div>
      )}
      <iframe title='preview' ref={iframeRef} sandbox='allow-scripts' srcDoc={html} />
    </div>
  );
};

export default Preview;
