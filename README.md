### Code Book

#### Challenges 
- User input code is `String`, which should be interpreted safetly to execute
  - compilation error or runtime error should not crash the entire App
- In addition to pure `JS` syntax, `JSX` needs some preprocessing for the browser to understand
- Integrated with `modules`, either `CommonJs` or `ES Modules` syntax should be understood before executing the code
  - self-defined modules
  - online NPM packages
  - CSS styling code

#### Design Choices
- How to _transpile_
  - option 1: outsource **remote** backend server API to run Babel 
  - option 2: **in-browser** transpiler as the foundation
- How to _bundle_ modules
  - `Webpack` bundler, taking multiple different modules, combining them all together and linking them into a single file
    - option 1: running `Webpack` on the **remote server**, interpose own customized plugin to make a request to `NPM Registry`, return the source code for the bundling process on the remote server
    - option 2: maintaining the above logic in the **loacl React App** with customized plugin for changing `Webpack` behavior
  ###### Reasoning
  - Remote procedure
    - download and cache NPM packages on the remote server => bundle for multiple users more quickly
    - better support for different devices and low bandwidth cases 
      - extra request to remote server is unavoidable
  - Local procedure
    - faster code execution (save waiting time)
    - no need to maintain the logic for connecting remote server
    - simplicity, also as no commercial use
      - so for any developer, just run the infrastructure and use the tool
  - Conclusion
    - using **Local Design**
    - in addition, using `ESBuild` instead of `Webpack` as it cannot be used in the browser
      - `ESBuild` supports in-browser transpiling and bundling
      - way much faster (written as Go underneath, translate JS into web assembly binary)