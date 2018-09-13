export class Store {
  private subscribers: Function[];
  private reducers: {[key: string]: Function};
  private state: {[key: string]: any};

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get value() {
    return this.state;
  }

  subscribe(fn) { // after updating state we want to notify our subscribers
    this.subscribers = [...this.subscribers, fn];
    this.notify(); // and update initially of course
    return () => { // and unsubscribe imidiately...
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    }
  }

  dispatch(action) {
    this.state = this.reduce(this.state, action); // this updates the state
    this.notify(); //... and notifies all about that
  }

  private notify() { // loop through subscribers and pass them new state
    this.subscribers.forEach(fn => fn(this.value)); // value means state actually
  }

  private reduce(state, action) { //
    const newState = {};
    // iterate through reducers ... and dynamicly update result of our reducers
    for (const prop in this.reducers) {
      // meaning: newState[todos] = this.reducers[todos](state.todos, action);
      newState[prop] = this.reducers[prop](state[prop], action);
      //EACH REDUCER MANAGES OF ITS OWN PEACE OF STATE
    }

    return newState;
  }
}

// console.log(store.value);
