import { readSync, writeSync } from 'clipboardy'

import { Graph } from './graph'

import { State, StateMachine } from '@models/stateMachine'

/**
 * Class capable of shaking AWS State Machine
 */
export class StateMachineShaker {
  private startState: string;
  private stateMachine: StateMachine;

  /**
   * Creates a new StateMachineShaker reading necessary data from the user's clipboard
   */
  constructor () {
    try {
      this.stateMachine = this.readFromClipboard()
      this.startState = this.stateMachine.StartAt
    } catch (err) {
      console.log(err)
      throw new Error('Something went wrong reading from clipboard or parsing state machine definition')
    }
    if (!this.startState) {
      throw new Error('Missing start state in state machine definition')
    }
  }

  public shake = () => {
    try {
      const graph = new Graph(this.stateMachine)
      const visited = graph.dfs(this.startState)
      const newStateMachine = this.removeUnusedStates(visited)
      this.writeToClipboard(newStateMachine)
    } catch (err) {
      console.log(err)
      throw new Error('Something went wrong shaking state machine')
    }
  }

  /**
   * Reads data from user's clipboard
   * @returns
   * Unknown object which we assume is a StateMachine
   */
  private readFromClipboard = (): StateMachine => {
    return JSON.parse(readSync())
  }

  /**
   * Writes a StateMachine to user's clipboard
   * @param stateMachine
   * StateMachine instance
   */
  private writeToClipboard = (stateMachine: StateMachine): void => {
    writeSync(JSON.stringify(stateMachine))
  }

  /**
   * Removes unused states from the in memory State Machine
   * @param visited
   * Set with visited states
   * @returns
   * New state machine with unused states removed
   */
  private removeUnusedStates = (visited: Set<string>): StateMachine => {
    const stateMachine: StateMachine = {
      StartAt: this.startState,
      States: {}
    }
    Object.entries(this.stateMachine.States).forEach(([key, value]: [string, State]): void => {
      if (!visited.has(key)) {
        return
      }
      stateMachine.States[key] = value
    })
    return stateMachine
  }
}
