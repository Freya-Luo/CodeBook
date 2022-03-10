import './resizable-wrapper.css'
import { ResizableBox } from 'react-resizable'

interface ResizableWrapperProps {
  direction: 'horizontal' | 'vertical'
}

const ResizableWrapper: React.FC<ResizableWrapperProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      width={Infinity}
      height={300}
      resizeHandles={['s']}
      maxConstraints={[Infinity, window.innerHeight * 0.85]}
      minConstraints={[Infinity, window.innerHeight * 0.1]}
    >
      {children}
    </ResizableBox>
  )
}

export default ResizableWrapper
