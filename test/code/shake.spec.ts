/* eslint-disable no-new */
// to be tested
import { StateMachineShaker } from '@code/shake'

// models
import { StateMachine } from '@models/stateMachine'

// to be mocked
import * as clipboardy from 'clipboardy'

// testing tools
import { checkAllMocksCalled } from '@test/tools'

// mock inits
jest.mock('clipboardy')

describe('code/shake', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should throw if something went wrong reading from clipboard', () => {
      const mocks = [
        jest.spyOn(clipboardy, 'readSync').mockImplementation(() => { throw new Error() })
      ]

      expect(() => { new StateMachineShaker() }).toThrow('reading from clipboard')
      checkAllMocksCalled(mocks, 1)
    })

    it('should throw if StartAt is missing', () => {
      const mocks = [
        jest.spyOn(clipboardy, 'readSync').mockReturnValue(JSON.stringify({ States: {} }))
      ]

      expect(() => { new StateMachineShaker() }).toThrow('Missing start state')
      checkAllMocksCalled(mocks, 1)
    })
  })

  describe('shake', () => {
    it('should shake a state machine - no change', () => {
      const stateMachine: StateMachine = {
        StartAt: 'A',
        States: {
          A: {
            Type: 'Pass',
            Next: 'B'
          },
          B: {
            Type: 'Succeed'
          }
        }
      }
      const clipboardyRead = jest.spyOn(clipboardy, 'writeSync').mockImplementation()
      const mocks = [
        jest.spyOn(clipboardy, 'readSync').mockReturnValue(JSON.stringify(stateMachine)),
        clipboardyRead
      ]

      const shaker = new StateMachineShaker()
      shaker.shake()

      const output = JSON.parse(clipboardyRead.mock.calls[0][0])
      expect(output).toEqual(stateMachine)
      checkAllMocksCalled(mocks, 1)
    })

    it('should shake a state machine - shake one', () => {
      const stateMachine: StateMachine = {
        StartAt: 'B',
        States: {
          A: {
            Type: 'Pass',
            Next: 'B'
          },
          B: {
            Type: 'Succeed'
          }
        }
      }
      const clipboardyRead = jest.spyOn(clipboardy, 'writeSync').mockImplementation()
      const mocks = [
        jest.spyOn(clipboardy, 'readSync').mockReturnValue(JSON.stringify(stateMachine)),
        clipboardyRead
      ]

      const shaker = new StateMachineShaker()
      shaker.shake()

      const output = JSON.parse(clipboardyRead.mock.calls[0][0])
      expect(output).toEqual({
        StartAt: 'B',
        States: {
          B: {
            Type: 'Succeed'
          }
        }
      })
      checkAllMocksCalled(mocks, 1)
    })

    it('should catch errors from underlying operations', () => {
      const stateMachine: StateMachine = {
        StartAt: 'B',
        States: {
          A: {
            Type: 'Pass',
            Next: 'B'
          }
        }
      }
      const mocks = [
        jest.spyOn(clipboardy, 'readSync').mockReturnValue(JSON.stringify(stateMachine))
      ]

      const shaker = new StateMachineShaker()

      expect(() => { shaker.shake() }).toThrow('went wrong shaking')
      checkAllMocksCalled(mocks, 1)
    })
  })
})
