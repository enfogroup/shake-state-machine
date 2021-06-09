import { State, StateBasic, StateChoice, StateMachine, StateNextSet } from '@models/stateMachine'

/**
 * Graph class with knowledge about AWS State Machines
 */
export class Graph {
  private stateMachine: StateMachine
  private visited: Set<string>
  /**
   * Creates a new Graph
   * @param stateMachine
   * AWS State Machine definition
   */
  constructor (stateMachine: StateMachine) {
    this.stateMachine = stateMachine
    this.visited = new Set<string>()
  }

  /**
   * Runs a Depth First Search on a state machine
   * @param currentState
   * Current state that is being investigated
   * @returns
   * Set with visited states
   */
  public dfs = (currentState: string): Set<string> => {
    const state: State | undefined = this.stateMachine.States[currentState]
    if (!state) {
      throw new Error(`Unable to find state ${currentState}`)
    }
    this.visited.add(currentState)
    const neighbours = this.getNeighbours(state)
    this.processNeighbours(neighbours)
    return this.visited
  }

  /**
   * Returns a list of downstream neighbours of the current state
   * @param state
   * AWS State machine state
   * @returns
   * Array of downstream neighbours
   */
  private getNeighbours = (state: State): string[] => {
    switch (state.Type) {
      case 'Fail':
      case 'Succeed':
        return []
      case 'Task':
      case 'Parallel':
      case 'Map':
        return this.getNeighboursFromBasicState(state)
      case 'Choice':
        return this.getNeighboursFromChoiceType(state)
      case 'Wait':
      case 'Pass':
        return [state.Next]
      default:
        throw new Error('Unknown state type')
    }
  }

  /**
   * Returns a list of neighbours from states where Next is always defined
   * @param state
   * StateBasic instance
   * @returns
   * Array of downstream neighbours
   */
  private getNeighboursFromBasicState = (state: StateBasic): string[] => {
    if (state.Next) {
      return [state.Next]
    }
    return []
  }

  /**
   * Returns a list of neighbours from StateChoice
   * @param state
   * StateChoice instance
   * @returns
   * Array of downstream neighbours
   */
  private getNeighboursFromChoiceType = (state: StateChoice): string[] => {
    const response: string[] = state.Choices.reduce((acc: string[], choice: StateNextSet) => {
      acc.push(choice.Next)
      return acc
    }, [])
    if (state.Default) {
      response.push(state.Default)
    }
    return response
  }

  /**
   * Runs DFS on a list of states
   * @param neighbours
   * Array of states
   */
  private processNeighbours = (neighbours: string[]): void => {
    for (const neighbour of neighbours) {
      if (this.visited.has(neighbour)) {
        return
      }
      this.dfs(neighbour)
    }
  }
}
