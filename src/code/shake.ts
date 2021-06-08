import { readSync } from 'clipboardy'

import { StateMachine } from "@models/shake";

export class StepFunctionShaker {
  private startState: string;
  private stateMachine: StateMachine;

  constructor() {
    try {
      this.stateMachine = JSON.parse(readSync())
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

  }
}
