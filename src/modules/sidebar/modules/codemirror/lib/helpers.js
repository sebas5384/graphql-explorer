export function flatState(state, kinds = []) {
  if (!state.kind) {
    return kinds
  }

  if (!state.prevState) {
    return kinds.concat(state.kind)
  }

  return flatState(state.prevState, kinds.concat(state.kind))
}
