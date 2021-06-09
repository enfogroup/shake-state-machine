// to be tested
import { Graph } from '@code/graph'

// models
import { StateMachine, StateTask } from '@models/stateMachine'

describe('code/graph', () => {
  describe('dfs', () => {
    it('should handle Fail state', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Fail'
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B']))
    })

    it('should handle Succeed state', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Succeed'
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B']))
    })

    it('should handle Task state', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Task',
            Next: 'C'
          },
          C: {
            Type: 'Task',
            End: true
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B', 'C']))
    })

    it('should handle Map state', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Map',
            End: true
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B']))
    })

    it('should handle Parallel state', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Parallel',
            End: true
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B']))
    })

    it('should handle Choice State', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Choice',
            Choices: [
              {
                Next: 'D'
              },
              {
                Next: 'E'
              }
            ]
          },
          C: {
            Type: 'Succeed'
          },
          D: {
            Type: 'Succeed'
          },
          E: {
            Type: 'Succeed'
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B', 'D', 'E']))
    })

    it('should handle Choice State - default value', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Choice',
            Choices: [
              {
                Next: 'D'
              },
              {
                Next: 'E'
              }
            ],
            Default: 'C'
          },
          C: {
            Type: 'Succeed'
          },
          D: {
            Type: 'Succeed'
          },
          E: {
            Type: 'Succeed'
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B', 'C', 'D', 'E']))
    })

    it('should handle Wait State', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Wait',
            Next: 'C'
          },
          C: {
            Type: 'Succeed'
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B', 'C']))
    })

    it('should handle Pass State', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Task',
            Next: 'B'
          },
          B: {
            Type: 'Pass',
            Next: 'C'
          },
          C: {
            Type: 'Succeed'
          }
        }
      }

      const graph = new Graph(input)
      const output = graph.dfs('B')

      expect(output).toEqual(new Set(['B', 'C']))
    })

    it('should handle complex graph', () => {

    })

    it('should throw if an invalid state type was found', () => {
      const input: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Banana'
          } as unknown as StateTask
        }
      }

      const graph = new Graph(input)

      expect(() => { graph.dfs('A') }).toThrow('Unknown state type')
    })

    it('should throw if a state was not found', () => {
      const input: StateMachine = {
        StartAt: 'B',
        States: {
          A: {
            Type: 'Succeed'
          }
        }
      }

      const graph = new Graph(input)

      expect(() => { graph.dfs('B') }).toThrow('Unable to find state')
    })
  })
})
