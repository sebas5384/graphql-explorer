import { fieldIsInvalid } from '../helpers'

describe('[Lib] Invalid fields helper', () => {
  it('should return false when is an invalid field', () => {
    const invalidFields = [
      { name: 'author', type: 'User' },
      { name: 'posts', type: '[Post' },
    ]

    const result = invalidFields.some(fieldIsInvalid)

    expect(result).toBeTruthy()
  })

  it('should return true when is a valid field', () => {
    const invalidFields = [
      { name: 'author', type: 'User' },
      { name: 'posts', type: '[Post]!' },
    ]

    const result = invalidFields.some(fieldIsInvalid)

    expect(result).toBeFalsy()
  })
})