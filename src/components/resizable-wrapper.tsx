import './resizable-wrapper.css'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'

interface ResizableWrapperProps {
  direction: 'horizontal' | 'vertical'
}

const ResizableWrapper: React.FC<ResizableWrapperProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps
  // if the resizable box grows/shrinks horizontally
  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      width: window.innerWidth * 0.5,
      height: Infinity,
      resizeHandles: ['e'],
      maxConstraints: [window.innerWidth * 0.85, Infinity],
      minConstraints: [window.innerWidth * 0.15, Infinity],
    }
  } else {
    // else the resizable box grows/shrinks vertically
    resizableProps = {
      width: Infinity,
      height: 300,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, window.innerHeight * 0.85],
      minConstraints: [Infinity, window.innerHeight * 0.1],
    }
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>
}

export default ResizableWrapper
