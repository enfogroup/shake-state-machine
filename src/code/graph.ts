import { State, StateBasic, StateChoice, StateMachine, StateNextSet } from '@models/stateMachine'

export class Graph {
  private stateMachine: StateMachine
  private visited: Set<string>
  constructor (stateMachine: StateMachine) {
    this.stateMachine = stateMachine
    this.visited = new Set<string>()
  }

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

  private getNeighboursFromBasicState = (state: StateBasic): string[] => {
    if (state.Next) {
      return [state.Next]
    }
    return []
  }

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

  private processNeighbours = (neighbours: string[]): void => {
    for (const neighbour of neighbours) {
      if (this.visited.has(neighbour)) {
        return
      }
      this.dfs(neighbour)
    }
  }
}
