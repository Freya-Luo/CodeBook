import './resizable-wrapper.css';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useEffect, useState } from 'react';

interface ResizableWrapperProps {
  direction: 'horizontal' | 'vertical';
}

const ResizableWrapper: React.FC<ResizableWrapperProps> = ({ direction, children }) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [editorWidth, setEditorWidth] = useState(window.innerWidth * 0.6);

  // register the 'resize' event listener only once
  useEffect(() => {
    let timer: any;
    const resizeListener = () => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setInnerWidth(window.innerWidth);
        setInnerHeight(window.innerHeight);

        // responsize bug fix
        if (window.innerWidth * 0.6 < editorWidth) {
          setEditorWidth(window.innerWidth * 0.6);
        }
      }, 100);
    };
    window.addEventListener('resize', resizeListener);

    // listener clean up
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [editorWidth]);

  let resizableProps: ResizableBoxProps;
  // if the resizable box grows/shrinks horizontally
  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      width: editorWidth, // should not be the window.innerWidth, no width jumps
      height: Infinity,
      resizeHandles: ['e'],
      maxConstraints: [innerWidth * 0.9, Infinity],
      minConstraints: [innerWidth * 0.1, Infinity],
      // callback to change the editor's width
      onResizeStop: (e, data) => {
        setEditorWidth(data.size.width);
      },
    };
  } else {
    // else the resizable box grows/shrinks vertically
    resizableProps = {
      width: Infinity,
      height: innerHeight * 0.4,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, innerHeight * 0.85],
      minConstraints: [Infinity, innerHeight * 0.1],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default ResizableWrapper;
