export const fieldIsInvalid = field => {
  const brackets = field.type.match(/\[|\]/g)
  if (brackets && brackets.length < 2) {
    return true
  }
  return false
}