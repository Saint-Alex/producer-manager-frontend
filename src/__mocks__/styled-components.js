const React = require('react');

// Create a proper mock function that can handle both strings and components
function styledFactory(tag) {
  return function(...args) {
    const Component = ({ children, ...otherProps }) => {
      const filteredProps = Object.keys(otherProps).reduce((acc, key) => {
        if (!key.startsWith('$')) {
          acc[key] = otherProps[key];
        }
        return acc;
      }, {});

      // Ensure button has default type if not specified
      if (tag === 'button' && !filteredProps.type) {
        filteredProps.type = 'button';
      }

      // If tag is a React component (like Link from react-router-dom), render it directly
      if (typeof tag === 'function' || (typeof tag === 'object' && tag !== null)) {
        return React.createElement(tag, filteredProps, children);
      }

      return React.createElement(tag, filteredProps, children);
    };
    return Component;
  };
}

// Main styled function
const styled = styledFactory;

// Assign HTML elements as properties
styled.div = styledFactory('div');
styled.h1 = styledFactory('h1');
styled.h2 = styledFactory('h2');
styled.h3 = styledFactory('h3');
styled.h4 = styledFactory('h4');
styled.button = styledFactory('button');
styled.ul = styledFactory('ul');
styled.li = styledFactory('li');
styled.p = styledFactory('p');
styled.section = styledFactory('section');
styled.span = styledFactory('span');
styled.a = styledFactory('a');
styled.label = styledFactory('label');
styled.input = styledFactory('input');
styled.select = styledFactory('select');
styled.textarea = styledFactory('textarea');
styled.form = styledFactory('form');
styled.header = styledFactory('header');
styled.nav = styledFactory('nav');
styled.main = styledFactory('main');
styled.aside = styledFactory('aside');
styled.footer = styledFactory('footer');

styled.createGlobalStyle = (template) => {
  return () => null;
};

const ThemeProvider = ({ children, theme }) => {
  return React.createElement(React.Fragment, {}, children);
};

const keyframes = () => 'mocked-keyframes';

module.exports = styled;
module.exports.createGlobalStyle = styled.createGlobalStyle;
module.exports.keyframes = keyframes;
module.exports.ThemeProvider = ThemeProvider;
module.exports.default = styled;
