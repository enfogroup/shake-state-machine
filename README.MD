# @enfo/shake-state-machine

> Remove unused states from an AWS State Machine definition with minimal effort

## Usage

Installation is optional, the package can be invoked using npx.

```sh
npm i @enfo/shake-state-machine --save-dev
```

Add a state machine definition to your clipboard with your desired start state as StartAt. Invoke the package and if all went well your clipboard will now contain a state machine with no unreachable states.

```sh
npx @enfo/shake-state-machine
```

## Practical example

Let us have a look at an AWS State Machine definition.

![Hello World State Machine](https://github.com/enfogroup/shake-state-machine/blob/master/media/helloworld.png)

Execution is successful.

![Successful execution](https://github.com/enfogroup/shake-state-machine/blob/master/media/execution.png)

Let us try to modify the State Machine so it skips the Hello state and starts at World. Attempting to save will result in an error regarding an unreachable state.

![State "Hello" is not reachable](https://github.com/enfogroup/shake-state-machine/blob/master/media/broken.png)

Copy the definition into your clipboard and run the package. Paste to the definition input field afterwards

```sh
npx @enfo/shake-state-machine
```

![Just World](https://github.com/enfogroup/shake-state-machine/blob/master/media/fixed.png)

The new state machine definition is ready to be used. When used in the wild you can have your State Machine fixed in a matter of seconds!

## How it works

Under the hood the package runs a [Depth-first search](https://en.wikipedia.org/wiki/Depth-first_search) starting at StartAt. After completing it builds a new state machine using only the visited states.

## License

MIT
