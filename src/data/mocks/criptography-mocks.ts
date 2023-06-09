import { type Hasher } from '../protocols/criptography/hasher'
import { type HashComparer } from '../protocols/criptography/hash-comparer'
import { type TokenGenerator } from '../protocols/criptography/token-generator'
import { type TokenDecrypter } from '../protocols/criptography/token-decrypter'

export class HasherSpy implements Hasher {
  hashed = 'hash'
  plaintext: string

  async hash (plaintext: string): Promise<string> {
    this.plaintext = plaintext
    return this.hashed
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string
  hash: string
  isValid = true

  async compare (plaintext: string, hash: string): Promise<boolean> {
    this.plaintext = plaintext
    this.hash = hash
    return this.isValid
  }
}

export class TokenGeneratorSpy implements TokenGenerator {
  token = 'any_token'
  content: any

  async generate (id: string): Promise<string> {
    this.content = id
    return this.token
  }
}

export class TokenDecrypterSpy implements TokenDecrypter {
  token: string
  decrypted = 'any_value'

  async decrypt (token: string): Promise<string> {
    this.token = token
    return this.decrypted
  }
}
