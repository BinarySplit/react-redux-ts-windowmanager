Goals:
    Use React, Redux, TypeScript in a project
    The project is a window manager, as it contains many moving parts and will serve as the basis for other projects

Thoughts:
    * Have to ditch the Redux yeoman generator as I'm renaming the autogenerated files to .ts/.tsx
    * TypeScript resists metaprogramming - no introspection or dynamic type creation
    * TypeScript + Redux is a bad combo:
        ** the @connect decorator doesn't play nicely with types - the decorated class can't see the added fields
            *** workaround: don't use the decorator
        ** the "makeActionCreator" pattern doesn't play nicely with types
    * http://marmelab.com/blog/2015/12/17/react-directory-structure.html
        ** IMO, this solves a lot of problems. It will be my preferred structure for new Redux projects
        ** It's almost essential for dividing code into bundles
            *** Not sure how bundling and on-demand-loading Redux reducers & action creators would work though...
            * https://github.com/erikras/ducks-modular-redux
    * Making props shallow-equal when nothing has changed is quite a pain
        * Binding all event handlers in the component's ctor
        * Passing children to components is particularly annoying
            ** Had to roll my own solution as there seems to be no discussion online
        * Now that they're easy to use via decorator, using memoized functions liberally is working well
    * http://jamesknelson.com/join-the-dark-side-of-the-flux-responding-to-actions-with-actors/
        ** Still quite awkward for triggering instantaneous DOM interactions, e.g. shifting focus,
            as React probably hasn't rendered when actor is called
    * redux-thunk
        ** So far only one use case: getting up-to-date state for proper transactionality
            e.g. to prevent DRAG events that trigger after DRAG_END because React hasn't handled the DRAG_END yet
        ** AJAX will definitely warrant adding thunks though