import { type Validation } from '@/presentation/protocols'
import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSignUpValidation } from './signup-validation-factory'
import { EmailValidatorStub } from '@/validation/mocks'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', new EmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
