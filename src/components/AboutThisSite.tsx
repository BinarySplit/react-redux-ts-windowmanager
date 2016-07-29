import * as React from "react";

export let AboutThisSiteComponent = () => (<div>
    <p>This is a practice project for React/Redux/TypeScript.</p>
    <p>What should work:</p>
    <ul>
        <li>Moving &amp; resizing windows</li>
        <li>Opening &amp; closing windows</li>
        <li>Ahead-of-time rendering of the initial React DOM (isomorphic rendering done during build)</li>
    </ul>
    <p>
        What probably won't work (yet):
    </p>
    <ul>
        <li>Non-Chrome browsers</li>
        <li>Minimizing/maximizing windows</li>
    </ul>
    <p>Where this is going:</p>
    <ul>
        <li>A full <a href="https://en.wikipedia.org/wiki/WIMP_(computing)" target="_top">WIMP</a> desktop environment, for housing other projects</li>
        <li>Replacing React with Preact &amp; TypeScript with Flow</li>
    </ul>
    <p>
        <a href="https://github.com/BinarySplit/react-redux-ts-windowmanager" target="_top">src</a>
    </p>
</div>);