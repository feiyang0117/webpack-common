import _ from 'lodash';

  function component() {
    var element = document.createElement('div');

   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }
  console.log(component() )
  let str = component()
  document.getElementById("inner").innerHTML = str.innerHTML;