import { readSync, writeSync } from 'clipboardy'

import { State, StateMachine } from '@models/stateMachine'
import { Graph } from './graph'

export class StateMachineShaker {
  private startState: string;
  private stateMachine: StateMachine;

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
    const graph = new Graph(this.stateMachine)
    const visited = graph.dfs(this.startState)
    const newStateMachine = this.shakeStateMachine(visited)
    this.writeToClipboard(newStateMachine)
  }

  private readFromClipboard = (): StateMachine => {
    return JSON.parse(readSync())
  }

  private writeToClipboard = (stateMachine: StateMachine): void => {
    writeSync(JSON.stringify(stateMachine))
  }

  private shakeStateMachine = (visited: Set<string>): StateMachine => {
    const stateMachine: StateMachine = {
      StartAt: this.startState,
      States: {}
    }
    Object.entries(this.stateMachine).forEach(([key, value]: [string, State]): void => {
      if (!visited.has(key)) {
        return
      }
      stateMachine.States[key] = value
    })
    return this.stateMachine
  }
}
