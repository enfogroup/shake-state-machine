
export interface StateMachine {
  StartAt: string;
  // eslint-disable-next-line no-use-before-define
  States: Record<string, State>
}

export interface StateBasic {
  Next?: string;
  End?: boolean;
}

export interface StateNextSet {
  Next: string;
}

export interface StateTask extends StateBasic {
  Type: 'Task'
}

export interface ParallelState extends StateBasic {
  Type: 'Parallel';
}

export interface MapState extends StateBasic {
  Type: 'Map';
}

export interface StateChoice {
  Type: 'Choice';
  Choices: StateNextSet[];
  Default?: string;
}

export interface StateFail {
  Type: 'Fail';
}

export interface StateSucceed {
  Type: 'Succeed'
}
export interface StateWait extends StateNextSet {
  Type: 'Wait';
}

export interface StatePass extends StateNextSet {
  Type: 'Pass'
}

export type State = StateTask | StateChoice | StateFail | StateSucceed | StatePass | StateWait | ParallelState | MapState
