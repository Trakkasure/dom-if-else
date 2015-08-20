# dom-if-else
Modification of dom-if to be if/else compliant.

This is a Polymer Element providing the missing ELSE portion for the "DOM-IF" template by way of an alterative to DOM-IF.

## Build Status [![Build Status](https://travis-ci.org/Trakkasure/dom-if-else.svg?branch=master)](https://travis-ci.org/Trakkasure/dom-if-else) [![Coverage Status](https://coveralls.io/repos/Trakkasure/dom-if-else/badge.svg?branch=master&service=github)](https://coveralls.io/github/Trakkasure/dom-if-else?branch=master)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/dom-if-else.svg)](https://saucelabs.com/u/dom-if-else)

## Install
```bash
bower install --save dom-if-else
```

## Example

```html
    <button onclick="clicked()">Toggle</button>
    <template id="domIf" is="dom-if-else" if>
      <if-then>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          Stuff
          <div>4</div>
      </if-then>
      <if-else>
          <div>e1</div>
          <div>e2</div>
          More stuff
          <div>e3</div>
      </if-else>
    </template>

    <script>
       function clicked() {
           var t=document.querySelector('#domIf');
           t.set('if',!t.if);
       }
    </script>
```

