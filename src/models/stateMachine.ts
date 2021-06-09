
/**
 * AWS State Machine. The definition should work not only for top level machines but also the definitions present in Map states etc
 */
export interface StateMachine {
  /**
   * State to start at
   */
  StartAt: string;
  /**
   * Object with states and their transitions
   */
  // eslint-disable-next-line no-use-before-define
  States: Record<string, State>
}

/**
 * Abstract state which may or may not be the end state.
 */
export interface StateBase {
  /**
   * Next state to transition to
   */
  Next?: string;
  /**
   * If set to true this is the final state
   */
  End?: boolean;
}

/**
 * Abstract state used by states which always has a transition
 */
export interface StateNextSet {
  /**
   * Next state to transition to
   */
  Next: string;
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html
 */
export interface StateTask extends StateBase {
  Type: 'Task'
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-parallel-state.html
 */
export interface ParallelState extends StateBase {
  Type: 'Parallel';
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-map-state.html
 */
export interface MapState extends StateBase {
  Type: 'Map';
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-choice-state.html
 */
export interface StateChoice {
  Type: 'Choice';
  /**
   * Non-empty array of choices
   */
  Choices: StateNextSet[];
  /**
   * Optional default choice to use if no choice is fulfilled
   */
  Default?: string;
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-fail-state.html
 */
export interface StateFail {
  Type: 'Fail';
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-succeed-state.html
 */
export interface StateSucceed {
  Type: 'Succeed'
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-wait-state.html
 */
export interface StateWait extends StateBase {
  Type: 'Wait';
}

/**
 * https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-pass-state.html
 */
export interface StatePass extends StateBase {
  Type: 'Pass'
}

/**
 * An AWS State Machine State
 */
export type State = StateTask | StateChoice | StateFail | StateSucceed | StatePass | StateWait | ParallelState | MapState
