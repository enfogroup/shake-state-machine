interface StateTask {

}

interface StateChoice {

}

interface StateFail {

}

interface StateSuccess {

}

interface StatePass {

}

interface StateWait {

}

interface ParallelState {

}

interface MapState {

}

type State = StateTask | StateChoice | StateFail | StateSuccess | StatePass | StateWait | ParallelState | MapState

export interface StateMachine {
  StartAt: string;
  States: Record<string, State>
}