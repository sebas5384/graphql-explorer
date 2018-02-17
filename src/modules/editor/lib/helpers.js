export const fieldIsInvalid = field => {
  const brackets = field.type.match(/\[|\]/g)
  if (brackets && brackets.length < 2) {
    return true
  }
  return false
}

export const fieldsTypeIsModel = nodes => field => nodes.some(
  ({ name }) => typeToModel(field.type) === name
)

export const typeToModel = type => type.replace(/[^A-Za-z_]*/g, "");
